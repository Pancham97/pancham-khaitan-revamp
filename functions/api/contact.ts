import validateEmail from "../../src/lib/validateEmail";

type Env = {
    PROFESSIONAL_EMAIL?: string;
    RESEND_API_KEY?: string;
    TURNSTILE_SECRET_KEY?: string;
};

type ContactPayload = {
    email: string;
    firstName: string;
    lastName: string;
    message: string;
    subject: string;
    turnstileToken: string;
};

type FunctionContext = {
    env: Env;
    request: Request;
};

const FIELD_LIMITS = {
    firstName: 80,
    lastName: 80,
    email: 254,
    subject: 160,
    message: 5000,
};

const ALLOWED_HOSTNAMES = new Set([
    "panchamkhaitan.com",
    "www.panchamkhaitan.com",
]);

const FROM_ADDRESS = "Pancham Khaitan <hello@updates.panchamkhaitan.com>";
const DEFAULT_OWNER_EMAIL = "hello@panchamkhaitan.com";
const EXTERNAL_REQUEST_TIMEOUT_MS = 10_000;

const htmlEntities: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

function escapeHtml(value: string): string {
    return value.replace(/[&<>"']/g, (character) => htmlEntities[character]);
}

function jsonResponse(body: object, status = 200): Response {
    return Response.json(body, {
        status,
        headers: {
            "Cache-Control": "no-store",
        },
    });
}

function normalizePayload(value: unknown): ContactPayload | null {
    if (!value || typeof value !== "object") {
        return null;
    }

    const input = value as Record<string, unknown>;
    const payload = {
        firstName:
            typeof input.firstName === "string" ? input.firstName.trim() : "",
        lastName:
            typeof input.lastName === "string" ? input.lastName.trim() : "",
        email: typeof input.email === "string" ? input.email.trim() : "",
        subject: typeof input.subject === "string" ? input.subject.trim() : "",
        message: typeof input.message === "string" ? input.message.trim() : "",
        turnstileToken:
            typeof input.turnstileToken === "string"
                ? input.turnstileToken.trim()
                : "",
    };

    if (
        !payload.firstName ||
        !payload.lastName ||
        !payload.email ||
        !payload.subject ||
        !payload.message ||
        payload.firstName.length > FIELD_LIMITS.firstName ||
        payload.lastName.length > FIELD_LIMITS.lastName ||
        payload.email.length > FIELD_LIMITS.email ||
        payload.subject.length > FIELD_LIMITS.subject ||
        payload.message.length > FIELD_LIMITS.message ||
        /[\r\n]/.test(payload.firstName) ||
        /[\r\n]/.test(payload.lastName) ||
        /[\r\n]/.test(payload.email) ||
        /[\r\n]/.test(payload.subject)
    ) {
        return null;
    }

    return payload;
}

async function verifyTurnstile(
    request: Request,
    secret: string,
    token: string,
): Promise<boolean> {
    const form = new FormData();
    form.set("secret", secret);
    form.set("response", token);

    const clientIp = request.headers.get("CF-Connecting-IP");
    if (clientIp) {
        form.set("remoteip", clientIp);
    }

    const response = await fetch(
        "https://challenges.cloudflare.com/turnstile/v0/siteverify",
        {
            method: "POST",
            body: form,
            signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
        },
    );

    if (!response.ok) {
        return false;
    }

    const result = (await response.json()) as {
        hostname?: string;
        success?: boolean;
    };

    return Boolean(
        result.success &&
            result.hostname &&
            ALLOWED_HOSTNAMES.has(result.hostname),
    );
}

function buildOwnerEmail(payload: ContactPayload, ownerEmail: string) {
    const safeFirstName = escapeHtml(payload.firstName);
    const safeLastName = escapeHtml(payload.lastName);
    const safeEmail = escapeHtml(payload.email);
    const safeSubject = escapeHtml(payload.subject);
    const safeMessage = escapeHtml(payload.message);

    return {
        from: FROM_ADDRESS,
        to: [ownerEmail],
        reply_to: payload.email,
        subject: `New message: ${payload.subject}`,
        html: `
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; max-width: 600px; margin: 0 auto; padding: 40px 20px; color: #000;">
  <h1 style="font-size: 24px; margin: 0 0 16px;">New contact message</h1>
  <div style="margin: 32px 0; padding: 24px; background: #fafafa;">
    <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; color: #737373;">From</p>
    <p>${safeFirstName} ${safeLastName}<br>${safeEmail}</p>
    <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; color: #737373;">Subject</p>
    <p>${safeSubject}</p>
    <p style="font-size: 13px; font-weight: 600; text-transform: uppercase; color: #737373;">Message</p>
    <p style="white-space: pre-wrap; line-height: 1.6;">${safeMessage}</p>
  </div>
</div>`,
        text: `NEW CONTACT MESSAGE\n\nFROM\n${payload.firstName} ${payload.lastName}\n${payload.email}\n\nSUBJECT\n${payload.subject}\n\nMESSAGE\n${payload.message}\n\n---\nReply to: ${payload.email}`,
    };
}

export async function onRequestPost({
    env,
    request,
}: FunctionContext): Promise<Response> {
    let input: unknown;
    try {
        input = await request.json();
    } catch {
        return jsonResponse({ error: "Invalid payload" }, 400);
    }

    const payload = normalizePayload(input);
    if (!payload || !validateEmail(payload.email)) {
        return jsonResponse({ error: "Invalid payload" }, 400);
    }

    if (!payload.turnstileToken) {
        return jsonResponse({ error: "Verification required" }, 400);
    }

    if (!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY) {
        console.error("Contact function secrets are not configured");
        return jsonResponse({ error: "Unable to send message right now" }, 500);
    }

    try {
        const verified = await verifyTurnstile(
            request,
            env.TURNSTILE_SECRET_KEY,
            payload.turnstileToken,
        );
        if (!verified) {
            return jsonResponse({ error: "Verification failed" }, 400);
        }

        const resendResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${env.RESEND_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(
                buildOwnerEmail(
                    payload,
                    env.PROFESSIONAL_EMAIL || DEFAULT_OWNER_EMAIL,
                ),
            ),
            signal: AbortSignal.timeout(EXTERNAL_REQUEST_TIMEOUT_MS),
        });

        if (!resendResponse.ok) {
            console.error(
                "Resend rejected owner notification",
                resendResponse.status,
            );
            return jsonResponse(
                { error: "Unable to send message right now" },
                502,
            );
        }

        return jsonResponse({ success: true });
    } catch (error) {
        console.error("Contact function request failed", error);
        return jsonResponse({ error: "Unable to send message right now" }, 502);
    }
}
