"use client";

import { useCallback, useEffect } from "react";
import {
  isInputFocused,
  matchesShortcut,
  SHORTCUTS,
  type ShortcutAction,
} from "@/lib/shortcuts";

export type ShortcutHandlers = Partial<Record<ShortcutAction, () => void>>;

export function useKeyboardShortcuts(handlers: ShortcutHandlers): void {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const allowInInput = event.key === "Escape";

      if (isInputFocused() && !allowInInput) {
        return;
      }

      for (const shortcut of SHORTCUTS) {
        if (matchesShortcut(event, shortcut)) {
          const handler = handlers[shortcut.action];

          if (handler) {
            event.preventDefault();
            handler();
            break;
          }
        }
      }
    },
    [handlers],
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);
}
