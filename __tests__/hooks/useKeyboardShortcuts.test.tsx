import { act, render } from "@testing-library/react";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";

function ShortcutHarness({
  handlers,
}: {
  handlers: Parameters<typeof useKeyboardShortcuts>[0];
}) {
  useKeyboardShortcuts(handlers);
  return null;
}

function dispatchKey(key: string, init: Partial<KeyboardEventInit> = {}) {
  act(() => {
    document.dispatchEvent(
      new KeyboardEvent("keydown", { key, bubbles: true, ...init }),
    );
  });
}

describe("useKeyboardShortcuts", () => {
  it("calls handler when shortcut is pressed", () => {
    const historyHandler = jest.fn();

    render(<ShortcutHarness handlers={{ history: historyHandler }} />);

    dispatchKey("h", { ctrlKey: true });

    expect(historyHandler).toHaveBeenCalledTimes(1);
  });

  it("does not call handler when input is focused", () => {
    const historyHandler = jest.fn();
    const input = document.createElement("input");

    document.body.appendChild(input);
    input.focus();

    render(<ShortcutHarness handlers={{ history: historyHandler }} />);

    dispatchKey("h", { ctrlKey: true });

    expect(historyHandler).not.toHaveBeenCalled();

    document.body.removeChild(input);
    document.body.focus();
  });

  it("calls Escape handler even when input is focused", () => {
    const closeHandler = jest.fn();
    const input = document.createElement("input");

    document.body.appendChild(input);
    input.focus();

    render(<ShortcutHarness handlers={{ close: closeHandler }} />);

    dispatchKey("Escape");

    expect(closeHandler).toHaveBeenCalledTimes(1);

    document.body.removeChild(input);
    document.body.focus();
  });

  it("registers multiple handlers correctly", () => {
    const searchHandler = jest.fn();
    const helpHandler = jest.fn();

    render(
      <ShortcutHarness
        handlers={{ search: searchHandler, help: helpHandler }}
      />,
    );

    dispatchKey("k", { ctrlKey: true });
    dispatchKey("?");

    expect(searchHandler).toHaveBeenCalledTimes(1);
    expect(helpHandler).toHaveBeenCalledTimes(1);
  });

  it("removes event listener on unmount", () => {
    const removeSpy = jest.spyOn(document, "removeEventListener");
    const historyHandler = jest.fn();

    const { unmount } = render(
      <ShortcutHarness handlers={{ history: historyHandler }} />,
    );

    unmount();

    expect(removeSpy).toHaveBeenCalledWith("keydown", expect.any(Function));

    removeSpy.mockRestore();
  });
});
