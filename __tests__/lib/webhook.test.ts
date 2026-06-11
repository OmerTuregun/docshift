/** @jest-environment node */

import {
  generateWebhookSecret,
  getUserWebhook,
  sendWithRetry,
  signPayload,
  triggerWebhook,
} from "@/lib/webhook";
import pool from "@/lib/db/pool";

jest.mock("@/lib/db/pool", () => ({
  __esModule: true,
  default: {
    query: jest.fn(),
  },
}));

const mockedQuery = pool.query as jest.Mock;
const mockedFetch = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
  global.fetch = mockedFetch as unknown as typeof fetch;
  jest.useFakeTimers();
});

afterEach(() => {
  jest.useRealTimers();
});

describe("signPayload", () => {
  it("returns consistent HMAC for the same payload and secret", () => {
    const payload = '{"event":"conversion.completed"}';
    const secret = "test-secret";

    expect(signPayload(payload, secret)).toBe(signPayload(payload, secret));
  });

  it("returns different results for different secrets", () => {
    const payload = '{"event":"conversion.completed"}';

    expect(signPayload(payload, "secret-a")).not.toBe(
      signPayload(payload, "secret-b"),
    );
  });
});

describe("generateWebhookSecret", () => {
  it("returns a 64 character hex string", () => {
    const secret = generateWebhookSecret();

    expect(secret).toHaveLength(64);
    expect(secret).toMatch(/^[0-9a-f]+$/);
  });
});

describe("sendWithRetry", () => {
  it("retries on failure", async () => {
    mockedFetch
      .mockRejectedValueOnce(new Error("network error"))
      .mockResolvedValueOnce({ status: 200, statusText: "OK" });

    mockedQuery.mockResolvedValue({ rows: [], rowCount: 1 });

    const promise = sendWithRetry(
      "https://example.com/hook",
      '{"test":true}',
      "sig",
      "delivery-1",
      3,
    );

    await jest.advanceTimersByTimeAsync(2000);
    await promise;

    expect(mockedFetch).toHaveBeenCalledTimes(2);
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining("delivered_at = NOW()"),
      [200, "OK", 2, "delivery-1"],
    );
  });

  it("stops after maxAttempts", async () => {
    mockedFetch.mockRejectedValue(new Error("network error"));
    mockedQuery.mockResolvedValue({ rows: [], rowCount: 1 });

    const promise = sendWithRetry(
      "https://example.com/hook",
      '{"test":true}',
      "sig",
      "delivery-1",
      3,
    );

    await jest.advanceTimersByTimeAsync(2000);
    await jest.advanceTimersByTimeAsync(4000);
    await promise;

    expect(mockedFetch).toHaveBeenCalledTimes(3);
    expect(mockedQuery).toHaveBeenCalledWith(
      expect.stringContaining("failed_at = NOW()"),
      [3, "delivery-1"],
    );
  });
});

describe("triggerWebhook", () => {
  it("skips delivery when no webhook exists", async () => {
    mockedQuery.mockResolvedValueOnce({ rows: [] });

    await triggerWebhook("1", {
      event: "conversion.completed",
      timestamp: new Date().toISOString(),
      data: {
        file_name: "test.xlsx",
        file_type: "excel",
        output_format: "json",
        converted_result: "{}",
        user_id: "1",
      },
    });

    expect(getUserWebhook).toBeDefined();
    expect(mockedQuery).toHaveBeenCalledTimes(1);
    expect(mockedFetch).not.toHaveBeenCalled();
  });
});
