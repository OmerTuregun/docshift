import { FILE_SIZE_LIMIT_BYTES } from "@/lib/constants";
import { validateFile } from "@/lib/validateFile";
import type { FileType } from "@/types";

function createFile(name: string, size: number): File {
  const content = new Uint8Array(size);
  return new File([content], name, { type: "application/octet-stream" });
}

describe("validateFile", () => {
  it("returns valid for file under limit", () => {
    const file = createFile("report.xlsx", FILE_SIZE_LIMIT_BYTES - 1);

    expect(validateFile(file, "excel")).toEqual({ valid: true });
  });

  it("returns valid for file exactly at limit", () => {
    const file = createFile("report.xlsx", FILE_SIZE_LIMIT_BYTES);

    expect(validateFile(file, "excel")).toEqual({ valid: true });
  });

  it("returns FILE_TOO_LARGE for file over limit", () => {
    const file = createFile("large.xlsx", FILE_SIZE_LIMIT_BYTES + 1);
    const result = validateFile(file, "excel");

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.code).toBe("FILE_TOO_LARGE");
      expect(result.error).toContain("large.xlsx");
      expect(result.error).toContain("10.0MB");
    }
  });

  it("returns INVALID_TYPE for wrong extension", () => {
    const file = createFile("notes.txt", 1024);
    const result = validateFile(file, "excel");

    expect(result.valid).toBe(false);
    if (!result.valid) {
      expect(result.code).toBe("INVALID_TYPE");
      expect(result.error).toContain("notes.txt");
      expect(result.error).toContain(".xlsx");
    }
  });

  it.each([
    ["excel", "sheet.xlsx"],
    ["excel", "legacy.xls"],
    ["word", "doc.docx"],
    ["word", "legacy.doc"],
    ["pdf", "file.pdf"],
    ["powerpoint", "slides.pptx"],
    ["powerpoint", "legacy.ppt"],
  ] as const satisfies readonly [FileType, string][])(
    "accepts correct extension for %s",
    (fileType, name) => {
      const file = createFile(name, 1024);

      expect(validateFile(file, fileType)).toEqual({ valid: true });
    },
  );
});
