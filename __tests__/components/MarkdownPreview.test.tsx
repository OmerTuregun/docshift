import { render, screen } from "@testing-library/react";
import MarkdownPreview from "@/components/MarkdownPreview";

describe("MarkdownPreview", () => {
  it("renders h1 heading", () => {
    render(<MarkdownPreview content="# Title One" />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Title One",
    );
  });

  it("renders h2 heading", () => {
    render(<MarkdownPreview content="## Section Two" />);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent(
      "Section Two",
    );
  });

  it("renders h3 heading", () => {
    render(<MarkdownPreview content="### Subsection Three" />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Subsection Three",
    );
  });

  it("renders bold text as strong", () => {
    render(<MarkdownPreview content="**bold text**" />);
    expect(screen.getByText("bold text").tagName).toBe("STRONG");
  });

  it("renders list items", () => {
    render(<MarkdownPreview content={"- first\n- second"} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("first");
    expect(items[1]).toHaveTextContent("second");
  });

  it("renders table with header and body cells", () => {
    render(
      <MarkdownPreview
        content={`| Col A | Col B |
|---|---|
| 1 | 2 |`}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByText("Col A")).toBeInTheDocument();
    expect(screen.getByText("Col B")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders fenced code block with block styling", () => {
    const { container } = render(
      <MarkdownPreview content={"```js\nconst x = 1;\n```"} />,
    );

    const code = container.querySelector("code");
    expect(code).toBeInTheDocument();
    expect(code).toHaveClass("block");
    expect(code).toHaveClass("text-emerald-400");
    expect(code).toHaveTextContent("const x = 1;");
  });

  it("renders empty string without error", () => {
    const { container } = render(<MarkdownPreview content="" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
