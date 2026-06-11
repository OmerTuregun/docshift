import { render, screen } from "@testing-library/react";
import JsonTreeRoot from "@/components/JsonTreeRoot";

describe("JsonTreeRoot", () => {
  it("renders key names for valid JSON", () => {
    render(<JsonTreeRoot content='{"name":"DocShift","version":1}' />);

    expect(screen.getByText("name:")).toBeInTheDocument();
    expect(screen.getByText("version:")).toBeInTheDocument();
  });

  it("shows error message for invalid JSON", () => {
    render(<JsonTreeRoot content="{ invalid json" />);

    expect(
      screen.getByText("Geçersiz JSON — ham metin gösteriliyor"),
    ).toBeInTheDocument();
    expect(screen.getByText("{ invalid json")).toBeInTheDocument();
  });

  it("renders nested object child keys", () => {
    render(
      <JsonTreeRoot content='{"user":{"id":1,"email":"a@b.com"}}' />,
    );

    expect(screen.getByText("user:")).toBeInTheDocument();
    expect(screen.getByText("id:")).toBeInTheDocument();
    expect(screen.getByText("email:")).toBeInTheDocument();
  });

  it("renders array indices", () => {
    render(<JsonTreeRoot content='["alpha","beta"]' />);

    expect(screen.getByText("0:")).toBeInTheDocument();
    expect(screen.getByText("1:")).toBeInTheDocument();
  });

  it("renders string values with emerald color", () => {
    render(<JsonTreeRoot content='{"label":"hello"}' />);

    const value = screen.getByText('"hello"');
    expect(value).toHaveClass("text-emerald-400");
  });

  it("renders number values with amber color", () => {
    render(<JsonTreeRoot content='{"count":42}' />);

    const value = screen.getByText("42");
    expect(value).toHaveClass("text-amber-400");
  });

  it("shows size warning for content over 50KB", () => {
    const largeContent = `{"data":"${"x".repeat(51 * 1024)}"}`;

    render(<JsonTreeRoot content={largeContent} />);

    expect(
      screen.getByText("Dosya çok büyük — önizleme devre dışı (50KB+)"),
    ).toBeInTheDocument();
  });
});
