import { toMarkdown } from "@/lib/converters/toMarkdown";

describe("toMarkdown", () => {
  it("converts text input into markdown paragraphs", () => {
    const result = toMarkdown({
      text: "First paragraph.\n\nSecond paragraph.",
    });

    expect(result).toBe("First paragraph.\n\nSecond paragraph.");
  });

  it("converts excel sheets into markdown tables", () => {
    const result = toMarkdown([
      {
        sheetName: "Sales",
        rows: [
          { Product: "A", Units: 10 },
          { Product: "B", Units: 5 },
        ],
      },
    ]);

    expect(result).toContain("### Sales");
    expect(result).toContain("| Product | Units |");
    expect(result).toContain("| A | 10 |");
    expect(result).toContain("| B | 5 |");
  });

  it("converts ppt slides into slide headings", () => {
    const result = toMarkdown({
      slides: [{ title: "Intro", body: "Welcome" }, { title: "Summary" }],
    });

    expect(result).toContain("## Slide 1");
    expect(result).toContain("## Slide 2");
    expect(result).toContain("- Intro");
    expect(result).toContain("- Welcome");
    expect(result).toContain("- Summary");
  });
});
