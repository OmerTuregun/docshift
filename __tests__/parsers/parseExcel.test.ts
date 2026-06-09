import * as XLSX from "xlsx";
import { parseExcel } from "@/lib/parsers/parseExcel";

function createWorkbookBuffer(
  sheets: Record<string, (string | number)[][]>,
): Buffer {
  const workbook = XLSX.utils.book_new();

  for (const [sheetName, rows] of Object.entries(sheets)) {
    const worksheet = XLSX.utils.aoa_to_sheet(rows);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
  }

  return XLSX.write(workbook, { type: "buffer" }) as Buffer;
}

describe("parseExcel", () => {
  it("returns an array of sheets with row objects", () => {
    const buffer = createWorkbookBuffer({
      Sheet1: [
        ["Name", "Value"],
        ["Alpha", 1],
        ["Beta", 2],
      ],
      Sheet2: [["Total"], [3]],
    });

    const result = parseExcel(buffer);

    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      sheetName: "Sheet1",
      rows: [
        { Name: "Alpha", Value: 1 },
        { Name: "Beta", Value: 2 },
      ],
    });
    expect(result[1]).toEqual({
      sheetName: "Sheet2",
      rows: [{ Total: 3 }],
    });
  });

  it("handles empty sheets by returning no rows", () => {
    const buffer = createWorkbookBuffer({
      EmptySheet: [],
    });

    const result = parseExcel(buffer);

    expect(result).toEqual([
      {
        sheetName: "EmptySheet",
        rows: [],
      },
    ]);
  });

  it("handles unreadable empty buffers without crashing", () => {
    const result = parseExcel(Buffer.alloc(0));

    expect(Array.isArray(result)).toBe(true);
    expect(result.every((sheet) => Array.isArray(sheet.rows))).toBe(true);
  });
});
