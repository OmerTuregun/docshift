import { isInputFocused, matchesShortcut, SHORTCUTS } from "@/lib/shortcuts";

function createKeyboardEvent(
  init: Partial<KeyboardEvent> & { key: string },
): KeyboardEvent {
  return {
    ctrlKey: false,
    metaKey: false,
    shiftKey: false,
    key: init.key,
    preventDefault: jest.fn(),
    ...init,
  } as KeyboardEvent;
}

describe("matchesShortcut", () => {
  const searchShortcut = SHORTCUTS.find((shortcut) => shortcut.action === "search")!;
  const historyShortcut = SHORTCUTS.find((shortcut) => shortcut.action === "history")!;
  const closeShortcut = SHORTCUTS.find((shortcut) => shortcut.action === "close")!;
  const helpShortcut = SHORTCUTS.find((shortcut) => shortcut.action === "help")!;
  const copyShortcut = SHORTCUTS.find((shortcut) => shortcut.action === "copy-last")!;

  it("matches Ctrl+K for search", () => {
    expect(
      matchesShortcut(
        createKeyboardEvent({ key: "k", ctrlKey: true }),
        searchShortcut,
      ),
    ).toBe(true);
  });

  it("matches Ctrl+H for history", () => {
    expect(
      matchesShortcut(
        createKeyboardEvent({ key: "h", ctrlKey: true }),
        historyShortcut,
      ),
    ).toBe(true);
  });

  it("matches Escape for close", () => {
    expect(
      matchesShortcut(createKeyboardEvent({ key: "Escape" }), closeShortcut),
    ).toBe(true);
  });

  it("matches ? for help", () => {
    expect(
      matchesShortcut(createKeyboardEvent({ key: "?" }), helpShortcut),
    ).toBe(true);
  });

  it("does not match search when only K is pressed", () => {
    expect(
      matchesShortcut(createKeyboardEvent({ key: "k" }), searchShortcut),
    ).toBe(false);
  });

  it("requires Shift for Ctrl+Shift+C", () => {
    expect(
      matchesShortcut(
        createKeyboardEvent({ key: "c", ctrlKey: true }),
        copyShortcut,
      ),
    ).toBe(false);

    expect(
      matchesShortcut(
        createKeyboardEvent({ key: "c", ctrlKey: true, shiftKey: true }),
        copyShortcut,
      ),
    ).toBe(true);
  });

  it("is case insensitive", () => {
    expect(
      matchesShortcut(
        createKeyboardEvent({ key: "K", ctrlKey: true }),
        searchShortcut,
      ),
    ).toBe(true);
  });
});

describe("isInputFocused", () => {
  it("returns false when body is focused", () => {
    document.body.focus();
    expect(isInputFocused()).toBe(false);
  });

  it("returns true when an input is focused", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    input.focus();

    expect(isInputFocused()).toBe(true);

    document.body.removeChild(input);
  });
});
