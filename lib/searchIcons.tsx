import type { IconType } from "react-icons";
import {
  TbBraces,
  TbCode,
  TbFile,
  TbFileText,
  TbFileTypePdf,
  TbFileTypeTxt,
  TbHistory,
  TbKey,
  TbMarkdown,
  TbPresentation,
  TbTable,
} from "react-icons/tb";

const SEARCH_ICON_MAP: Record<string, IconType> = {
  "ti-table": TbTable,
  "ti-file-text": TbFileText,
  "ti-file-type-pdf": TbFileTypePdf,
  "ti-presentation": TbPresentation,
  "ti-braces": TbBraces,
  "ti-code": TbCode,
  "ti-markdown": TbMarkdown,
  "ti-txt": TbFileTypeTxt,
  "ti-history": TbHistory,
  "ti-key": TbKey,
  "ti-file": TbFile,
};

export function getSearchIcon(iconName: string): IconType {
  return SEARCH_ICON_MAP[iconName] ?? TbFile;
}
