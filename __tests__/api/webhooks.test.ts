/** @jest-environment node */

import { DELETE, GET, POST } from "@/app/api/webhooks/route";
import {
  deleteWebhook,
  getUserWebhook,
  upsertWebhook,
} from "@/lib/webhook";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/webhook", () => ({
  getUserWebhook: jest.fn(),
  upsertWebhook: jest.fn(),
  deleteWebhook: jest.fn(),
}));

import { auth } from "@/auth";

const mockedAuth = auth as jest.Mock;
const mockedGetUserWebhook = getUserWebhook as jest.Mock;
const mockedUpsertWebhook = upsertWebhook as jest.Mock;
const mockedDeleteWebhook = deleteWebhook as jest.Mock;

const sampleWebhook = {
  id: "wh-1",
  user_id: "1",
  url: "https://example.com/hook",
  secret: "abc123",
  is_active: true,
  created_at: new Date().toISOString(),
};

describe("/api/webhooks", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("GET returns null when no webhook", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });
    mockedGetUserWebhook.mockResolvedValue(null);

    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toBeNull();
  });

  it("POST validates HTTPS URL", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });

    const response = await POST(
      new Request("http://localhost/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "http://example.com/hook" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Webhook URL HTTPS olmalıdır");
    expect(mockedUpsertWebhook).not.toHaveBeenCalled();
  });

  it("POST rejects invalid URL format", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });

    const response = await POST(
      new Request("http://localhost/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "not-a-url" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.error).toBe("Geçersiz URL formatı");
    expect(mockedUpsertWebhook).not.toHaveBeenCalled();
  });

  it("DELETE deactivates webhook", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });
    mockedDeleteWebhook.mockResolvedValue(undefined);

    const response = await DELETE();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(mockedDeleteWebhook).toHaveBeenCalledWith("1");
  });

  it("returns 401 for unauthenticated GET", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("returns 401 for unauthenticated POST", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await POST(
      new Request("http://localhost/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://example.com/hook" }),
      }),
    );

    expect(response.status).toBe(401);
  });

  it("returns 401 for unauthenticated DELETE", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await DELETE();

    expect(response.status).toBe(401);
  });

  it("POST saves valid HTTPS webhook", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });
    mockedUpsertWebhook.mockResolvedValue(sampleWebhook);

    const response = await POST(
      new Request("http://localhost/api/webhooks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: "https://example.com/hook" }),
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toEqual(sampleWebhook);
    expect(mockedUpsertWebhook).toHaveBeenCalledWith(
      "1",
      "https://example.com/hook",
    );
  });
});
