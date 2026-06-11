import { act, renderHook, waitFor } from "@testing-library/react";
import type { ConversionRecord } from "@/lib/db/history";
import { useSmartSearch } from "@/hooks/useSmartSearch";

const mockHistory: ConversionRecord[] = [
  {
    id: "h1",
    user_id: "u1",
    file_name: "budget.xlsx",
    file_type: "excel",
    output_format: "json",
    converted_result: "{}",
    created_at: "2026-06-10T10:00:00.000Z",
  },
  {
    id: "h2",
    user_id: "u1",
    file_name: "notes.docx",
    file_type: "word",
    output_format: "markdown",
    converted_result: "# hi",
    created_at: "2026-06-09T10:00:00.000Z",
  },
];

jest.mock("@/hooks/useHistory", () => ({
  useHistory: () => ({
    history: mockHistory,
    isLoading: false,
    error: null,
    deleteItem: jest.fn(),
    refetch: jest.fn(),
  }),
}));

describe("useSmartSearch", () => {
  it("returns no results for empty query", async () => {
    const { result } = renderHook(() => useSmartSearch());

    await waitFor(() => {
      expect(result.current.results).toEqual([]);
      expect(result.current.isOpen).toBe(false);
    });
  });

  it("returns file type matches", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("excel");
    });

    await waitFor(() => {
      expect(result.current.results.some((item) => item.id === "excel")).toBe(
        true,
      );
    });
  });

  it("returns format matches", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("markdown");
    });

    await waitFor(() => {
      expect(
        result.current.results.some((item) => item.id === "format-markdown"),
      ).toBe(true);
    });
  });

  it("returns history matches by file name", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("budget");
    });

    await waitFor(() => {
      expect(
        result.current.results.some((item) => item.id === "history-h1"),
      ).toBe(true);
    });
  });

  it("limits results to 8 items", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("e");
    });

    await waitFor(() => {
      expect(result.current.results.length).toBeLessThanOrEqual(8);
    });
  });

  it("places history results before static results", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("json");
    });

    await waitFor(() => {
      const historyIndex = result.current.results.findIndex(
        (item) => item.type === "history",
      );
      const staticIndex = result.current.results.findIndex(
        (item) => item.type === "format",
      );

      expect(historyIndex).toBeGreaterThanOrEqual(0);
      expect(staticIndex).toBeGreaterThanOrEqual(0);
      expect(historyIndex).toBeLessThan(staticIndex);
    });
  });

  it("clearSearch resets state", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("excel");
    });

    await waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.clearSearch();
    });

    expect(result.current.query).toBe("");
    expect(result.current.results).toEqual([]);
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activeIndex).toBe(-1);
  });

  it("clears query and closes on Escape", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("excel");
    });

    await waitFor(() => {
      expect(result.current.isOpen).toBe(true);
    });

    act(() => {
      result.current.handleKeyDown({
        key: "Escape",
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent);
    });

    expect(result.current.query).toBe("");
    expect(result.current.isOpen).toBe(false);
    expect(result.current.activeIndex).toBe(-1);
  });

  it("increments activeIndex on ArrowDown", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("excel");
    });

    await waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(1);
    });

    act(() => {
      result.current.setIsOpen(true);
      result.current.handleKeyDown({
        key: "ArrowDown",
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent);
    });

    expect(result.current.activeIndex).toBe(0);
  });

  it("wraps activeIndex on ArrowUp", async () => {
    const { result } = renderHook(() => useSmartSearch());

    act(() => {
      result.current.setQuery("excel");
    });

    await waitFor(() => {
      expect(result.current.results.length).toBeGreaterThan(0);
    });

    act(() => {
      result.current.setIsOpen(true);
      result.current.setActiveIndex(0);
      result.current.handleKeyDown({
        key: "ArrowUp",
        preventDefault: jest.fn(),
      } as unknown as React.KeyboardEvent);
    });

    expect(result.current.activeIndex).toBe(result.current.results.length - 1);
  });
});
