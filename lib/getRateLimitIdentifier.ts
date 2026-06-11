import type { NextRequest } from "next/server";

export function getIdentifier(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");

  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");

  if (realIp) {
    return realIp.trim();
  }

  if (request.ip) {
    return request.ip;
  }

  return "unknown";
}

export function buildRateLimitKey(identifier: string, route: string): string {
  return `${route}:${identifier}`;
}
