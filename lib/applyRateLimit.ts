import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  buildRateLimitKey,
  getIdentifier,
} from "@/lib/getRateLimitIdentifier";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rateLimit";

export type RateLimitCheck = {
  blocked: NextResponse | null;
  headers: Record<string, string>;
};

export async function applyRateLimit(
  request: NextRequest,
  route: string,
): Promise<RateLimitCheck> {
  const session = await auth();
  const ip = getIdentifier(request);
  const userId = session?.user?.id;

  const identifier = userId
    ? buildRateLimitKey(`user:${userId}`, route)
    : buildRateLimitKey(`ip:${ip}`, route);

  const config = userId ? RATE_LIMITS.authenticated : RATE_LIMITS.anonymous;
  const result = checkRateLimit({ ...config, identifier });

  const headers = {
    "X-RateLimit-Limit": config.limit.toString(),
    "X-RateLimit-Remaining": result.remaining.toString(),
    "X-RateLimit-Reset": result.resetAt.toString(),
  };

  if (!result.allowed) {
    return {
      blocked: NextResponse.json(
        {
          success: false,
          error: userId
            ? `Çok fazla istek. Dakikada ${RATE_LIMITS.authenticated.limit} istek yapabilirsiniz.`
            : `Çok fazla istek. Dakikada ${RATE_LIMITS.anonymous.limit} istek yapabilirsiniz. Üye olarak limiti artırabilirsiniz.`,
          code: "RATE_LIMITED",
          retryAfter: result.retryAfter,
        },
        {
          status: 429,
          headers: {
            ...headers,
            "Retry-After": result.retryAfter.toString(),
          },
        },
      ),
      headers,
    };
  }

  return {
    blocked: null,
    headers,
  };
}
