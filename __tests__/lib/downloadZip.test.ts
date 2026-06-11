import { getFileExtension, sanitizeFileName } from "@/lib/downloadZip";

describe("getFileExtension", () => {
  it("returns .json for json", () => {
    expect(getFileExtension("json")).toBe(".json");
  });

  it("returns .md for markdown", () => {
    expect(getFileExtension("markdown")).toBe(".md");
  });

  it("returns .xml for xml", () => {
    expect(getFileExtension("xml")).toBe(".xml");
  });

  it("returns .txt for plaintext", () => {
    expect(getFileExtension("plaintext")).toBe(".txt");
  });
});

describe("sanitizeFileName", () => {
  it("removes file extension", () => {
    expect(sanitizeFileName("report.xlsx")).toBe("report");
  });

  it("replaces special characters with underscore", () => {
    expect(sanitizeFileName("my file (1).docx")).toBe("my_file__1_");
  });

  it("truncates to 50 characters", () => {
    const longName = `${"a".repeat(60)}.pdf`;
    expect(sanitizeFileName(longName)).toHaveLength(50);
    expect(sanitizeFileName(longName)).toBe("a".repeat(50));
  });

  it("preserves Turkish characters", () => {
    expect(sanitizeFileName("rapor_özeti_ışık.docx")).toBe("rapor_özeti_ışık");
  });
});
