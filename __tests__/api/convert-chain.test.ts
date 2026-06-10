/** @jest-environment node */

import { POST } from "@/app/api/convert-chain/route";
import { convertFromString } from "@/lib/converters";

jest.mock("@/auth", () => ({
  auth: jest.fn(async () => null),
}));

jest.mock("@/lib/db/history", () => ({
  saveConversion: jest.fn(async () => undefined),
}));

jest.mock("@/lib/db/stats", () => ({
  incrementConversionCount: jest.fn(async () => undefined),
}));

jest.mock("@/lib/converters", () => {
  const actual = jest.requireActual<typeof import("@/lib/converters")>(
    "@/lib/converters",
  );

  return {
    ...actual,
    convertFromString: jest.fn(actual.convertFromString),
  };
});

const mockedConvertFromString = convertFromString as jest.MockedFunction<
  typeof convertFromString
>;

function createChainRequest(body: Record<string, unknown>) {
  return new Request("http://localhost/api/convert-chain", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("POST /api/convert-chain", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedConvertFromString.mockImplementation(
      jest.requireActual<typeof import("@/lib/converters")>("@/lib/converters")
        .convertFromString,
    );
  });

  it("returns converted string for a valid request", async () => {
    const response = await POST(
      createChainRequest({
        content: JSON.stringify({ name: "test" }),
        fromFormat: "json",
        toFormat: "xml",
        fileName: "rapor.xlsx",
        fileType: "excel",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(typeof body.converted).toBe("string");
    expect(body.fromFormat).toBe("json");
    expect(body.toFormat).toBe("xml");
    expect(mockedConvertFromString).toHaveBeenCalledWith(
      JSON.stringify({ name: "test" }),
      "json",
      "xml",
    );
  });

  it("returns 400 when source and target formats are the same", async () => {
    const response = await POST(
      createChainRequest({
        content: "{}",
        fromFormat: "json",
        toFormat: "json",
        fileName: "rapor.xlsx",
        fileType: "excel",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Kaynak ve hedef format aynı olamaz",
    });
    expect(mockedConvertFromString).not.toHaveBeenCalled();
  });

  it("returns 400 when required fields are missing", async () => {
    const response = await POST(
      createChainRequest({
        content: "{}",
        fromFormat: "json",
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({
      success: false,
      error: "Eksik veya geçersiz alanlar",
    });
    expect(mockedConvertFromString).not.toHaveBeenCalled();
  });
});
