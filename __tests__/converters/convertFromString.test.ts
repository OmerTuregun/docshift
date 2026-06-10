import { convertFromString } from "@/lib/converters";

describe("convertFromString", () => {
  const sampleJson = JSON.stringify({ name: "test", value: 42 });

  it("converts JSON to XML", () => {
    const result = convertFromString(sampleJson, "json", "xml");

    expect(result).toContain("<name>test</name>");
    expect(result).toContain("<value>42</value>");
  });

  it("converts JSON to Markdown", () => {
    const result = convertFromString(sampleJson, "json", "markdown");

    expect(result).toContain("name");
    expect(result).toContain("test");
  });

  it("converts JSON to plaintext", () => {
    const result = convertFromString(sampleJson, "json", "plaintext");

    expect(result).toContain('"name": "test"');
    expect(result).toContain('"value": 42');
  });

  it("converts XML to JSON", () => {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<docshift><name>test</name><value>42</value></docshift>`;

    const result = convertFromString(xml, "xml", "json");
    const parsed = JSON.parse(result) as { name: string; value: string };

    expect(parsed.name).toBe("test");
    expect(parsed.value).toBe("42");
  });

  it("throws when source and target formats are the same", () => {
    expect(() => convertFromString(sampleJson, "json", "json")).toThrow(
      "Kaynak ve hedef format aynı olamaz",
    );
  });

  it("throws for invalid JSON input", () => {
    expect(() => convertFromString("{ invalid", "json", "xml")).toThrow(
      "Geçersiz JSON — dönüşüm yapılamadı",
    );
  });

  it("wraps plaintext before converting to JSON", () => {
    const result = convertFromString("hello world", "plaintext", "json");
    const parsed = JSON.parse(result) as { text: string };

    expect(parsed.text).toBe("hello world");
  });
});
