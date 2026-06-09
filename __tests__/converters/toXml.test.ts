import { toXml } from "@/lib/converters/toXml";

describe("toXml", () => {
  it("wraps output in a docshift root tag", () => {
    const result = toXml({ name: "test" });

    expect(result).toContain("<docshift>");
    expect(result).toContain("</docshift>");
    expect(result).toContain('<?xml version="1.0" encoding="UTF-8"?>');
  });

  it("converts nested objects and arrays", () => {
    const result = toXml({
      user: {
        name: "Ada",
        tags: ["xml", "json"],
      },
    });

    expect(result).toContain("<user>");
    expect(result).toContain("<name>Ada</name>");
    expect(result).toContain("<tags>");
    expect(result).toContain("<item>xml</item>");
    expect(result).toContain("<item>json</item>");
  });
});
