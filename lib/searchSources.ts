import { HOW_USE_PATH } from "@/lib/siteNav";

export type SearchItem = {
  id: string;
  type: "format" | "filetype" | "history" | "action";
  title: string;
  subtitle?: string;
  icon: string;
  iconBg: string;
  iconColor: string;
  action: "scroll" | "open-history" | "navigate";
  payload?: string;
};

export const STATIC_SEARCH_ITEMS: SearchItem[] = [
  {
    id: "excel",
    type: "filetype",
    title: "Excel",
    subtitle: ".xlsx .xls dosyası yükle",
    icon: "ti-table",
    iconBg: "bg-[#217346]",
    iconColor: "text-white",
    action: "scroll",
    payload: "file-cards",
  },
  {
    id: "word",
    type: "filetype",
    title: "Word",
    subtitle: ".docx .doc dosyası yükle",
    icon: "ti-file-text",
    iconBg: "bg-[#2B579A]",
    iconColor: "text-white",
    action: "scroll",
    payload: "file-cards",
  },
  {
    id: "pdf",
    type: "filetype",
    title: "PDF",
    subtitle: ".pdf dosyası yükle",
    icon: "ti-file-type-pdf",
    iconBg: "bg-[#F40F02]",
    iconColor: "text-white",
    action: "scroll",
    payload: "file-cards",
  },
  {
    id: "powerpoint",
    type: "filetype",
    title: "PowerPoint",
    subtitle: ".pptx .ppt dosyası yükle",
    icon: "ti-presentation",
    iconBg: "bg-[#D24726]",
    iconColor: "text-white",
    action: "scroll",
    payload: "file-cards",
  },
  {
    id: "format-json",
    type: "format",
    title: "JSON formatına dönüştür",
    subtitle: "Yapılandırılmış veri formatı",
    icon: "ti-braces",
    iconBg: "bg-[#EAF3DE]",
    iconColor: "text-[#3B6D11]",
    action: "scroll",
    payload: "file-cards",
  },
  {
    id: "format-xml",
    type: "format",
    title: "XML formatına dönüştür",
    subtitle: "Genişletilebilir işaretleme dili",
    icon: "ti-code",
    iconBg: "bg-[#E6F1FB]",
    iconColor: "text-[#185FA5]",
    action: "scroll",
    payload: "file-cards",
  },
  {
    id: "format-markdown",
    type: "format",
    title: "Markdown formatına dönüştür",
    subtitle: "Hafif işaretleme dili",
    icon: "ti-markdown",
    iconBg: "bg-[#d0f0f2]",
    iconColor: "text-[#1D3461]",
    action: "scroll",
    payload: "file-cards",
  },
  {
    id: "format-plaintext",
    type: "format",
    title: "Düz metne dönüştür",
    subtitle: "Sade metin formatı",
    icon: "ti-txt",
    iconBg: "bg-[#F1EFE8]",
    iconColor: "text-[#5F5E5A]",
    action: "scroll",
    payload: "file-cards",
  },
  {
    id: "action-history",
    type: "action",
    title: "Dönüşüm geçmişini aç",
    subtitle: "Tüm geçmiş dönüşümleri görüntüle",
    icon: "ti-history",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
    action: "open-history",
  },
  {
    id: "action-api",
    type: "action",
    title: "API Anahtarları",
    subtitle: "API erişimini yönet",
    icon: "ti-key",
    iconBg: "bg-gray-100",
    iconColor: "text-gray-500",
    action: "navigate",
    payload: HOW_USE_PATH,
  },
];

export function searchStaticItems(query: string): SearchItem[] {
  const q = query.toLowerCase();

  return STATIC_SEARCH_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(q) ||
      item.subtitle?.toLowerCase().includes(q) ||
      item.id.toLowerCase().includes(q),
  );
}
