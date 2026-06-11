/** @jest-environment node */

import { POST } from "@/app/api/parse/route";
import { applyRateLimit } from "@/lib/applyRateLimit";
import { parseExcel } from "@/lib/parsers";

jest.mock("@/auth", () => ({
  auth: jest.fn(async () => null),
}));

jest.mock("@/lib/applyRateLimit", () => ({
  applyRateLimit: jest.fn(),
}));

jest.mock("@/lib/db/history", () => ({
  saveConversion: jest.fn(async () => undefined),
}));

jest.mock("@/lib/db/stats", () => ({
  incrementConversionCount: jest.fn(async () => undefined),
}));

jest.mock("@/lib/parsers", () => ({
  parseExcel: jest.fn(),
  parseWord: jest.fn(),
  parsePdf: jest.fn(),
  parsePpt: jest.fn(),
}));

const mockedApplyRateLimit = applyRateLimit as jest.MockedFunction<
  typeof applyRateLimit
>;
const mockedParseExcel = parseExcel as jest.MockedFunction<typeof parseExcel>;

function createParseRequest() {
  const formData = new FormData();
  formData.append("file", new File(["content"], "sample.xlsx"));
  formData.append("fileType", "excel");
  formData.append("outputFormat", "json");

  return new Request("http://localhost/api/parse", {
    method: "POST",
    body: formData,
  });
}

describe("POST /api/parse rate limiting", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedParseExcel.mockReturnValue([{ sheetName: "Sheet1", rows: [] }]);
  });

  it("returns 429 when rate limited", async () => {
    mockedApplyRateLimit.mockResolvedValue({
      blocked: Response.json(
        {
          success: false,
          error: "Çok fazla istek",
          code: "RATE_LIMITED",
          retryAfter: 42,
        },
        { status: 429 },
      ),
      headers: {
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": "1234567890",
      },
    });

    const response = await POST(createParseRequest());
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.code).toBe("RATE_LIMITED");
    expect(mockedParseExcel).not.toHaveBeenCalled();
  });

  it("proceeds when rate limit allows the request", async () => {
    mockedApplyRateLimit.mockResolvedValue({
      blocked: null,
      headers: {
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": "9",
        "X-RateLimit-Reset": "1234567890",
      },
    });

    const response = await POST(createParseRequest());
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(mockedParseExcel).toHaveBeenCalledTimes(1);
  });

  it("includes X-RateLimit headers on success", async () => {
    mockedApplyRateLimit.mockResolvedValue({
      blocked: null,
      headers: {
        "X-RateLimit-Limit": "10",
        "X-RateLimit-Remaining": "8",
        "X-RateLimit-Reset": "9999999999",
      },
    });

    const response = await POST(createParseRequest());

    expect(response.headers.get("X-RateLimit-Limit")).toBe("10");
    expect(response.headers.get("X-RateLimit-Remaining")).toBe("8");
    expect(response.headers.get("X-RateLimit-Reset")).toBe("9999999999");
  });
});
