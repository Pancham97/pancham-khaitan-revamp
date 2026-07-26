import { NextRequest, NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/resend";
import validateEmail from "@/lib/validateEmail";
import { createRateLimiter, getClientIp } from "@/lib/rate-limit";

const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;
const RATE_LIMIT_MAX_BY_IP = 10;
const RATE_LIMIT_MAX_BY_EMAIL = 3;

const subscribeRateLimiter = createRateLimiter(RATE_LIMIT_WINDOW_MS);

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
            subscribeRateLimiter.isLimited(
                `ip:${clientIp}`,
                RATE_LIMIT_MAX_BY_IP,
            ) ||
            subscribeRateLimiter.isLimited(
                `email:${normalizedEmail}`,
                RATE_LIMIT_MAX_BY_EMAIL,
            );

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
