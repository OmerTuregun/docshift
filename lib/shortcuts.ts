export type ShortcutAction =
  | "search"
  | "history"
  | "copy-last"
  | "download-last"
  | "download-all"
  | "close"
  | "help";

export type Shortcut = {
  action: ShortcutAction;
  keys: string[];
  label: string;
  description: string;
  global: boolean;
};

export const SHORTCUTS: Shortcut[] = [
  {
    action: "search",
    keys: ["ctrl", "k"],
    label: "Ctrl + K",
    description: "Aramayı aç",
    global: true,
  },
  {
    action: "history",
    keys: ["ctrl", "h"],
    label: "Ctrl + H",
    description: "Geçmiş panelini aç/kapat",
    global: true,
  },
  {
    action: "copy-last",
    keys: ["ctrl", "shift", "c"],
    label: "Ctrl + Shift + C",
    description: "Son dönüşümü kopyala",
    global: true,
  },
  {
    action: "download-last",
    keys: ["ctrl", "shift", "d"],
    label: "Ctrl + Shift + D",
    description: "Son dönüşümü indir",
    global: true,
  },
  {
    action: "download-all",
    keys: ["ctrl", "shift", "z"],
    label: "Ctrl + Shift + Z",
    description: "Tümünü ZIP olarak indir",
    global: true,
  },
  {
    action: "close",
    keys: ["escape"],
    label: "Escape",
    description: "Açık paneli kapat",
    global: true,
  },
  {
    action: "help",
    keys: ["?"],
    label: "?",
    description: "Kısayol listesini göster",
    global: true,
  },
];

export function matchesShortcut(
  event: KeyboardEvent,
  shortcut: Shortcut,
): boolean {
  const keys = shortcut.keys;
  const ctrl = keys.includes("ctrl");
  const shift = keys.includes("shift");
  const key = keys[keys.length - 1];

  return (
    (ctrl ? event.ctrlKey || event.metaKey : true) &&
    (shift ? event.shiftKey : !event.shiftKey || key === "?") &&
    event.key.toLowerCase() === key.toLowerCase()
  );
}

export function isInputFocused(): boolean {
  const tag = document.activeElement?.tagName;

  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    (document.activeElement as HTMLElement | null)?.isContentEditable === true
  );
}
