import * as XLSX from "xlsx";

export interface ExcelSheet {
  sheetName: string;
  rows: Record<string, unknown>[];
}

export function parseExcel(buffer: Buffer): ExcelSheet[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });

  return workbook.SheetNames.map((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet);

    return { sheetName, rows };
  });
}
