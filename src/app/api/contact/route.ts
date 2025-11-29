import { NextRequest, NextResponse } from "next/server";
import { sendContactEmails } from "@/lib/resend";

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

        if (!firstName || !lastName || !email || !subject || !message) {
            return NextResponse.json(
                { error: "Invalid payload" },
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

        const turnstileResponse = await fetch(
            "https://challenges.cloudflare.com/turnstile/v0/siteverify",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    secret: process.env.TURNSTILE_SECRET_KEY,
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
            { error: error instanceof Error ? error.message : "Unknown error" },
            { status: 500 },
        );
    }
}
