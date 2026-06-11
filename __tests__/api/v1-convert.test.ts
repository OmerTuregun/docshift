/** @jest-environment node */

import { POST } from "@/app/api/v1/convert/route";
import {
  getApiKeyUsageCountLastHour,
  logApiKeyUsage,
  validateApiKey,
} from "@/lib/db/apiKeys";
import { saveConversion } from "@/lib/db/history";
import { incrementConversionCount } from "@/lib/db/stats";

jest.mock("@/lib/db/apiKeys", () => ({
  validateApiKey: jest.fn(),
  getApiKeyUsageCountLastHour: jest.fn(),
  logApiKeyUsage: jest.fn(),
}));

jest.mock("@/lib/db/history", () => ({
  saveConversion: jest.fn(async () => undefined),
}));

jest.mock("@/lib/db/stats", () => ({
  incrementConversionCount: jest.fn(async () => undefined),
}));

jest.mock("@/lib/webhook", () => ({
  triggerWebhook: jest.fn(async () => undefined),
}));

jest.mock("@/lib/parsers", () => ({
  parseExcel: jest.fn(() => [{ sheetName: "Sheet1", rows: [{ a: 1 }] }]),
  parseWord: jest.fn(),
  parsePdf: jest.fn(),
  parsePpt: jest.fn(),
}));

const mockedValidateApiKey = validateApiKey as jest.MockedFunction<
  typeof validateApiKey
>;
const mockedUsageCount = getApiKeyUsageCountLastHour as jest.MockedFunction<
  typeof getApiKeyUsageCountLastHour
>;
const mockedLogUsage = logApiKeyUsage as jest.MockedFunction<
  typeof logApiKeyUsage
>;

function createConvertRequest(options?: {
  authHeader?: string;
  file?: File | null;
  outputFormat?: string;
}) {
  const formData = new FormData();

  if (options?.file) {
    formData.append("file", options.file);
  }

  formData.append("outputFormat", options?.outputFormat ?? "json");

  return new Request("http://localhost/api/v1/convert", {
    method: "POST",
    headers: options?.authHeader
      ? { Authorization: options.authHeader }
      : undefined,
    body: formData,
  });
}

describe("POST /api/v1/convert", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedValidateApiKey.mockResolvedValue({
      valid: true,
      keyId: "key-1",
      userId: "1",
    });
    mockedUsageCount.mockResolvedValue(0);
    mockedLogUsage.mockResolvedValue(undefined);
  });

  it("returns 401 when Authorization header is missing", async () => {
    const response = await POST(createConvertRequest());
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.code).toBe("MISSING_AUTH");
    expect(mockedValidateApiKey).not.toHaveBeenCalled();
  });

  it("returns 401 for invalid API key", async () => {
    mockedValidateApiKey.mockResolvedValueOnce({ valid: false });

    const response = await POST(
      createConvertRequest({ authHeader: "Bearer ds_live_invalid" }),
    );
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.code).toBe("INVALID_KEY");
  });

  it("returns 200 for valid key and valid file", async () => {
    const file = new File(["content"], "sample.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const response = await POST(
      createConvertRequest({
        authHeader: "Bearer ds_live_validkey123",
        file,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.data.fileType).toBe("excel");
    expect(body.data.outputFormat).toBe("json");
    expect(saveConversion).toHaveBeenCalled();
    expect(incrementConversionCount).toHaveBeenCalled();
    expect(mockedLogUsage).toHaveBeenCalledWith(
      "key-1",
      "/api/v1/convert",
      "excel",
      "json",
      200,
    );
  });

  it("returns 429 when rate limit is exceeded", async () => {
    mockedUsageCount.mockResolvedValueOnce(100);

    const file = new File(["content"], "sample.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const response = await POST(
      createConvertRequest({
        authHeader: "Bearer ds_live_validkey123",
        file,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.code).toBe("RATE_LIMITED");
  });

  it("returns 413 when file is too large", async () => {
    const largeContent = new Uint8Array(10 * 1024 * 1024 + 1);
    const file = new File([largeContent], "large.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    const response = await POST(
      createConvertRequest({
        authHeader: "Bearer ds_live_validkey123",
        file,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(413);
    expect(body.code).toBe("FILE_TOO_LARGE");
  });

  it("returns 415 for unsupported file type", async () => {
    const file = new File(["content"], "sample.zip", {
      type: "application/zip",
    });

    const response = await POST(
      createConvertRequest({
        authHeader: "Bearer ds_live_validkey123",
        file,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(415);
    expect(body.code).toBe("UNSUPPORTED_FILE");
  });
});
