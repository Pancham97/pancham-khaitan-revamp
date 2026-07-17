import { NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/resend";
import validateEmail from "@/lib/validateEmail";

const FIELD_LIMITS = {
    firstName: 80,
    lastName: 80,
    email: 254,
    subject: 160,
    message: 5000,
};

const hasHeaderLineBreak = (value: string) => /[\r\n]/.test(value);

const isValidContactPayload = ({
    firstName,
    lastName,
    email,
    subject,
    message,
}: {
    firstName: string;
    lastName: string;
    email: string;
    subject: string;
    message: string;
}) => {
    if (!firstName || !lastName || !email || !subject || !message) {
        return false;
    }

    if (
        firstName.length > FIELD_LIMITS.firstName ||
        lastName.length > FIELD_LIMITS.lastName ||
        email.length > FIELD_LIMITS.email ||
        subject.length > FIELD_LIMITS.subject ||
        message.length > FIELD_LIMITS.message
    ) {
        return false;
    }

    return ![firstName, lastName, email, subject].some(hasHeaderLineBreak);
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const firstName =
            typeof body.firstName === "string" ? body.firstName.trim() : "";
        const lastName =
            typeof body.lastName === "string" ? body.lastName.trim() : "";
        const email = typeof body.email === "string" ? body.email.trim() : "";
        const subject =
            typeof body.subject === "string" ? body.subject.trim() : "";
        const message =
            typeof body.message === "string" ? body.message.trim() : "";
        const turnstileToken =
            typeof body.turnstileToken === "string"
                ? body.turnstileToken.trim()
                : "";

        if (
            !isValidContactPayload({
                firstName,
                lastName,
                email,
                subject,
                message,
            })
        ) {
            return NextResponse.json(
                { error: "Invalid payload" },
                { status: 400 },
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: "Invalid email" },
                { status: 400 },
            );
        }

        // Verify Turnstile token
        if (!turnstileToken) {
            return NextResponse.json(
                { error: "Verification required" },
                { status: 400 },
            );
        }

        const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
        if (!turnstileSecret) {
            console.error(
                "TURNSTILE_SECRET_KEY is not configured; contact verification aborted",
            );
            return NextResponse.json(
                { error: "Unable to verify request" },
                { status: 500 },
            );
        }

        const turnstileResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    secret: turnstileSecret,
                    response: turnstileToken,
                }),
            },
        );

        const turnstileData = await turnstileResponse.json();

        if (!turnstileData.success) {
            return NextResponse.json(
                { error: "Verification failed" },
                { status: 400 },
            );
        }

        await sendContactEmails({
            firstName,
            lastName,
            email,
            subject,
            message,
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Contact API error:", error);
        return NextResponse.json(
            { error: "Unable to send message right now" },
            { status: 500 },
        );
    }
}
