/** @jest-environment node */

import { POST } from "@/app/api/parse/route";
import {
  parseExcel,
  parsePdf,
  parsePpt,
  parseWord,
} from "@/lib/parsers";

jest.mock("@/auth", () => ({
  auth: jest.fn(async () => null),
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

const mockedParseExcel = parseExcel as jest.MockedFunction<typeof parseExcel>;
const mockedParseWord = parseWord as jest.MockedFunction<typeof parseWord>;
const mockedParsePdf = parsePdf as jest.MockedFunction<typeof parsePdf>;
const mockedParsePpt = parsePpt as jest.MockedFunction<typeof parsePpt>;

function createParseRequest(fileType: string, file?: File) {
  const formData = new FormData();

  if (file) {
    formData.append("file", file);
  }

  formData.append("fileType", fileType);
  formData.append("outputFormat", "json");

  return new Request("http://localhost/api/parse", {
    method: "POST",
    body: formData,
  });
}

describe("POST /api/parse", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedParseExcel.mockReturnValue([{ sheetName: "Sheet1", rows: [] }]);
    mockedParseWord.mockResolvedValue({ text: "word text" });
    mockedParsePdf.mockResolvedValue({ text: "pdf text", numPages: 1 });
    mockedParsePpt.mockResolvedValue({ slides: [] });
  });

  it.each([
    ["excel", mockedParseExcel, [{ sheetName: "Sheet1", rows: [] }]],
    ["word", mockedParseWord, { text: "word text" }],
    ["pdf", mockedParsePdf, { text: "pdf text", numPages: 1 }],
    ["powerpoint", mockedParsePpt, { slides: [] }],
  ] as const)(
    "routes %s uploads to the correct parser",
    async (fileType, parserMock, raw) => {
      const file = new File(["content"], "sample.bin", {
        type: "application/octet-stream",
      });
      const response = await POST(createParseRequest(fileType, file));
      const body = await response.json();

      expect(response.status).toBe(200);
      expect(parserMock).toHaveBeenCalledTimes(1);
      expect(body).toMatchObject({
        success: true,
        fileType,
        outputFormat: "json",
        raw,
      });
      expect(typeof body.converted).toBe("string");
    },
  );

  it("returns 500 when file is missing", async () => {
    const formData = new FormData();
    formData.append("fileType", "excel");

    const response = await POST(
      new Request("http://localhost/api/parse", {
        method: "POST",
        body: formData,
      }),
    );
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      error: "Missing or invalid file field",
    });
    expect(mockedParseExcel).not.toHaveBeenCalled();
  });

  it("returns an error for invalid fileType", async () => {
    const file = new File(["content"], "sample.bin", {
      type: "application/octet-stream",
    });
    const response = await POST(createParseRequest("invalid-type", file));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual({
      success: false,
      error: "Missing or invalid fileType field",
    });
    expect(mockedParseExcel).not.toHaveBeenCalled();
  });
});
