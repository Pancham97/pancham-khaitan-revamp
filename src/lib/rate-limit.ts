import type { NextRequest } from "next/server";

type RateLimitEntry = {
    count: number;
    resetAt: number;
};

/**
 * Simple in-memory rate limiter for serverless-ish Node routes.
 * Resets per instance; good enough to blunt form spam under a traffic spike.
 */
export function createRateLimiter(windowMs: number) {
    const store = new Map<string, RateLimitEntry>();

    return {
        isLimited(key: string, maxRequests: number): boolean {
            const now = Date.now();
            const current = store.get(key);

            if (!current || current.resetAt <= now) {
                store.set(key, {
                    count: 1,
                    resetAt: now + windowMs,
                });
                return false;
            }

            if (current.count >= maxRequests) {
                return true;
            }

            current.count += 1;
            return false;
        },
    };
}

export function getClientIp(request: NextRequest): string {
    const forwardedFor = request.headers.get("x-forwarded-for");
    const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

    return (
        firstForwardedIp ||
        request.headers.get("x-real-ip")?.trim() ||
        "unknown"
    );
}
