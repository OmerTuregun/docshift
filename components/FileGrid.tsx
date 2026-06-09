import FileCard from "@/components/FileCard";
import type { ResultPanelData } from "@/components/ResultPanel";
import type { FileType } from "@/types";
import type { Session } from "next-auth";
import { AiOutlineFilePdf } from "react-icons/ai";
import {
  PiMicrosoftExcelLogoFill,
  PiMicrosoftPowerpointLogoFill,
  PiMicrosoftWordLogoFill,
} from "react-icons/pi";

const ACCEPT_BY_TYPE: Record<FileType, string> = {
  excel: ".xlsx,.xls",
  word: ".docx,.doc",
  pdf: ".pdf",
  powerpoint: ".pptx,.ppt",
};

const CARD_CONFIGS = [
  {
    title: "Excel",
    subtitle: ".xlsx .xls",
    fileType: "excel" as const,
    icon: <PiMicrosoftExcelLogoFill />,
    bgColor: "#217346",
  },
  {
    title: "Word",
    subtitle: ".docx .doc",
    fileType: "word" as const,
    icon: <PiMicrosoftWordLogoFill />,
    bgColor: "#2B579A",
  },
  {
    title: "PDF",
    subtitle: ".pdf",
    fileType: "pdf" as const,
    icon: <AiOutlineFilePdf />,
    bgColor: "#F40F02",
  },
  {
    title: "PowerPoint",
    subtitle: ".pptx .ppt",
    fileType: "powerpoint" as const,
    icon: <PiMicrosoftPowerpointLogoFill />,
    bgColor: "#D24726",
  },
];

interface FileGridProps {
  user: Session["user"] | null;
  onResult: (result: ResultPanelData) => void;
  onToast: (message: string) => void;
}

export default function FileGrid({ user, onResult, onToast }: FileGridProps) {
  return (
    <div className="mx-auto mb-10 max-w-4xl px-6">
      <div
        data-authenticated={user ? "true" : "false"}
        className="grid grid-cols-4 gap-0 overflow-hidden rounded-2xl border border-gray-200 shadow-sm md:grid-cols-2"
      >
        {CARD_CONFIGS.map(({ title, subtitle, fileType, icon, bgColor }) => (
          <FileCard
            key={fileType}
            title={title}
            subtitle={subtitle}
            fileType={fileType}
            accept={ACCEPT_BY_TYPE[fileType]}
            icon={icon}
            bgColor={bgColor}
            onResult={onResult}
            onToast={onToast}
          />
        ))}
      </div>
    </div>
  );
}
