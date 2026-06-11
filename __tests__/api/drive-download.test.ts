/** @jest-environment node */

import { GET } from "@/app/api/drive/download/route";
import { FILE_SIZE_LIMIT_BYTES } from "@/lib/constants";
import { getGoogleAccessToken, downloadDriveFile } from "@/lib/drive";

jest.mock("@/auth", () => ({
  auth: jest.fn(),
}));

jest.mock("@/lib/drive", () => ({
  getGoogleAccessToken: jest.fn(),
  downloadDriveFile: jest.fn(),
  DriveApiError: class DriveApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
      super(message);
      this.status = status;
    }
  },
}));

import { auth } from "@/auth";

const mockedAuth = auth as jest.Mock;
const mockedGetToken = getGoogleAccessToken as jest.Mock;
const mockedDownload = downloadDriveFile as jest.Mock;

function createRequest(params: Record<string, string>) {
  const search = new URLSearchParams(params).toString();

  return new Request(`http://localhost/api/drive/download?${search}`);
}

describe("GET /api/drive/download", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when unauthenticated", async () => {
    mockedAuth.mockResolvedValue(null);

    const response = await GET(createRequest({ fileId: "abc" }));

    expect(response.status).toBe(401);
  });

  it("returns 400 when fileId is missing", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });

    const response = await GET(
      new Request("http://localhost/api/drive/download"),
    );

    expect(response.status).toBe(400);
  });

  it("returns 401 when access token is missing", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });
    mockedGetToken.mockResolvedValue(null);

    const response = await GET(createRequest({ fileId: "abc" }));

    expect(response.status).toBe(401);
    const body = await response.json();
    expect(body.error).toContain("Google erişim token");
  });

  it("returns base64 data on successful download", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });
    mockedGetToken.mockResolvedValue("token-123");
    mockedDownload.mockResolvedValue({
      buffer: Buffer.from("hello"),
      mimeType: "application/pdf",
      fileName: "report.pdf",
    });

    const response = await GET(
      createRequest({ fileId: "abc", fileName: "report.pdf" }),
    );
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.success).toBe(true);
    expect(body.fileType).toBe("pdf");
    expect(body.data).toBe(Buffer.from("hello").toString("base64"));
  });

  it("returns 415 for unsupported file type", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });
    mockedGetToken.mockResolvedValue("token-123");
    mockedDownload.mockResolvedValue({
      buffer: Buffer.from("hello"),
      mimeType: "text/plain",
      fileName: "notes.txt",
    });

    const response = await GET(
      createRequest({ fileId: "abc", fileName: "notes.txt" }),
    );

    expect(response.status).toBe(415);
  });

  it("returns 413 when file exceeds 10MB", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });
    mockedGetToken.mockResolvedValue("token-123");
    mockedDownload.mockResolvedValue({
      buffer: Buffer.alloc(FILE_SIZE_LIMIT_BYTES + 1),
      mimeType: "application/pdf",
      fileName: "large.pdf",
    });

    const response = await GET(
      createRequest({ fileId: "abc", fileName: "large.pdf" }),
    );

    expect(response.status).toBe(413);
  });

  it("propagates Drive API errors", async () => {
    mockedAuth.mockResolvedValue({ user: { id: "1" } });
    mockedGetToken.mockResolvedValue("token-123");

    const { DriveApiError } = jest.requireMock("@/lib/drive") as {
      DriveApiError: new (message: string, status: number) => Error;
    };

    mockedDownload.mockRejectedValue(new DriveApiError("Dosya indirilemedi", 403));

    const response = await GET(
      createRequest({ fileId: "abc", fileName: "report.pdf" }),
    );

    expect(response.status).toBe(403);
  });
});
