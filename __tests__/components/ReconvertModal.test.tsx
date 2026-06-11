import { fireEvent, render, screen } from "@testing-library/react";
import ReconvertModal from "@/components/ReconvertModal";
import type { ConversionRecord } from "@/lib/db/history";

const mockRecord: ConversionRecord = {
  id: "rec-1",
  user_id: "user-1",
  file_name: "report.xlsx",
  file_type: "excel",
  output_format: "json",
  converted_result: '{"data":true}',
  created_at: "2026-06-10T10:00:00.000Z",
};

describe("ReconvertModal", () => {
  it("renders when record is provided", () => {
    render(
      <ReconvertModal
        record={mockRecord}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(screen.getByText("Tekrar Dönüştür")).toBeInTheDocument();
    expect(screen.getByText("report.xlsx")).toBeInTheDocument();
  });

  it("is hidden when record is null", () => {
    render(
      <ReconvertModal
        record={null}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(screen.queryByText("Tekrar Dönüştür")).not.toBeInTheDocument();
  });

  it("excludes current format from options", () => {
    render(
      <ReconvertModal
        record={mockRecord}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
      />,
    );

    expect(screen.queryByRole("button", { name: "JSON" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "XML" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Markdown" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Plain Text" })).toBeInTheDocument();
  });

  it("calls onConfirm with selected format", () => {
    const onConfirm = jest.fn();

    render(
      <ReconvertModal
        record={mockRecord}
        onClose={jest.fn()}
        onConfirm={onConfirm}
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Markdown" }));
    fireEvent.click(screen.getByRole("button", { name: "Dönüştür" }));

    expect(onConfirm).toHaveBeenCalledWith(mockRecord, "markdown");
  });

  it("calls onClose when close button is clicked", () => {
    const onClose = jest.fn();

    render(
      <ReconvertModal
        record={mockRecord}
        onClose={onClose}
        onConfirm={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByLabelText("Kapat"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("disables confirm button while loading", () => {
    render(
      <ReconvertModal
        record={mockRecord}
        onClose={jest.fn()}
        onConfirm={jest.fn()}
        isLoading
      />,
    );

    expect(screen.getByRole("button", { name: /Dönüştürülüyor/ })).toBeDisabled();
  });
});
