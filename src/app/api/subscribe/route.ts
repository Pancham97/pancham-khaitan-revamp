import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend";
import validateEmail from "@/lib/validateEmail";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_BY_IP = 10;
const RATE_LIMIT_MAX_BY_EMAIL = 3;

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

const subscribeRateLimits = new Map<string, RateLimitEntry>();

const getClientIp = (request: NextRequest) => {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

    return (
        firstForwardedIp ||
        request.headers.get("x-real-ip")?.trim() ||
        "unknown"
    );
};

const isRateLimited = (key: string, maxRequests: number) => {
    const now = Date.now();
    const current = subscribeRateLimits.get(key);

    if (!current || current.resetAt <= now) {
        subscribeRateLimits.set(key, {
            count: 1,
            resetAt: now + RATE_LIMIT_WINDOW_MS,
        });
        return false;
    }

    if (current.count >= maxRequests) {
        return true;
    }

    current.count += 1;
    return false;
};

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const email = typeof body.email === "string" ? body.email.trim() : "";

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 },
            );
        }

        if (!validateEmail(email)) {
            return NextResponse.json(
                { error: "Invalid email" },
                { status: 400 },
            );
        }

        const normalizedEmail = email.toLowerCase();
        const clientIp = getClientIp(request);
        const rateLimited =
            isRateLimited(`ip:${clientIp}`, RATE_LIMIT_MAX_BY_IP) ||
            isRateLimited(`email:${normalizedEmail}`, RATE_LIMIT_MAX_BY_EMAIL);

        if (rateLimited) {
            return NextResponse.json(
                { error: "Too many requests. Please try again later." },
                { status: 429 },
            );
        }

        await sendWelcomeEmail({ email: normalizedEmail });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Subscribe API error:", error);
        return NextResponse.json(
            { error: "Unable to subscribe right now" },
            { status: 500 },
        );
    }
}
