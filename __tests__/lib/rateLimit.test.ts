import {
  checkRateLimit,
  RATE_LIMITS,
  type RateLimitConfig,
} from "@/lib/rateLimit";

describe("checkRateLimit", () => {
  const baseConfig: RateLimitConfig = {
    limit: 3,
    windowMs: 60_000,
    identifier: "test:ip:1",
  };

  it("allows the first request", () => {
    const result = checkRateLimit({
      ...baseConfig,
      identifier: "test:first-request",
    });

    expect(result.allowed).toBe(true);
    if (result.allowed) {
      expect(result.remaining).toBe(2);
    }
  });

  it("allows requests within the limit", () => {
    const identifier = "test:within-limit";

    checkRateLimit({ ...baseConfig, identifier });
    const second = checkRateLimit({ ...baseConfig, identifier });

    expect(second.allowed).toBe(true);
    if (second.allowed) {
      expect(second.remaining).toBe(1);
    }
  });

  it("blocks requests at the limit", () => {
    const identifier = "test:at-limit";

    checkRateLimit({ ...baseConfig, identifier });
    checkRateLimit({ ...baseConfig, identifier });
    checkRateLimit({ ...baseConfig, identifier });

    const blocked = checkRateLimit({ ...baseConfig, identifier });

    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.remaining).toBe(0);
      expect(blocked.retryAfter).toBeGreaterThan(0);
    }
  });

  it("allows new requests after the window resets", () => {
    const identifier = "test:window-reset";
    let now = 1_000_000;
    const dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);

    checkRateLimit({ ...baseConfig, identifier });
    checkRateLimit({ ...baseConfig, identifier });
    checkRateLimit({ ...baseConfig, identifier });

    const blocked = checkRateLimit({ ...baseConfig, identifier });
    expect(blocked.allowed).toBe(false);

    now += baseConfig.windowMs + 1;

    const afterReset = checkRateLimit({ ...baseConfig, identifier });
    expect(afterReset.allowed).toBe(true);

    dateNowSpy.mockRestore();
  });

  it("tracks different identifiers separately", () => {
    const first = checkRateLimit({
      ...baseConfig,
      identifier: "test:identifier-a",
    });
    const second = checkRateLimit({
      ...baseConfig,
      identifier: "test:identifier-b",
    });

    expect(first.allowed).toBe(true);
    expect(second.allowed).toBe(true);

    if (first.allowed && second.allowed) {
      expect(first.remaining).toBe(2);
      expect(second.remaining).toBe(2);
    }
  });

  it("uses anonymous limit of 10 per minute", () => {
    expect(RATE_LIMITS.anonymous).toEqual({
      limit: 10,
      windowMs: 60 * 1000,
    });
  });

  it("uses authenticated limit of 30 per minute", () => {
    expect(RATE_LIMITS.authenticated).toEqual({
      limit: 30,
      windowMs: 60 * 1000,
    });
  });

  it("returns retryAfter in seconds", () => {
    const identifier = "test:retry-after";
    let now = 2_000_000;
    const dateNowSpy = jest.spyOn(Date, "now").mockImplementation(() => now);

    checkRateLimit({ ...baseConfig, identifier });
    checkRateLimit({ ...baseConfig, identifier });
    checkRateLimit({ ...baseConfig, identifier });

    now += 15_000;

    const blocked = checkRateLimit({ ...baseConfig, identifier });

    expect(blocked.allowed).toBe(false);
    if (!blocked.allowed) {
      expect(blocked.retryAfter).toBe(45);
    }

    dateNowSpy.mockRestore();
  });
});
