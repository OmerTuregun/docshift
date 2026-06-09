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
    fileType: "excel" as const,
    icon: <PiMicrosoftExcelLogoFill />,
    bgColor: "#217346",
    iconColor: "#ffffff",
  },
  {
    title: "Word",
    fileType: "word" as const,
    icon: <PiMicrosoftWordLogoFill />,
    bgColor: "#2B579A",
    iconColor: "#ffffff",
  },
  {
    title: "PDF",
    fileType: "pdf" as const,
    icon: <AiOutlineFilePdf />,
    bgColor: "#F40F02",
    iconColor: "#ffffff",
  },
  {
    title: "PowerPoint",
    fileType: "powerpoint" as const,
    icon: <PiMicrosoftPowerpointLogoFill />,
    bgColor: "#D24726",
    iconColor: "#ffffff",
  },
];

interface FileGridProps {
  user: Session["user"] | null;
  onResult: (result: ResultPanelData) => void;
  onToast: (message: string) => void;
}

export default function FileGrid({ user, onResult, onToast }: FileGridProps) {
  return (
    <div
      data-authenticated={user ? "true" : "false"}
      className="grid w-full max-w-4xl grid-cols-4 gap-0 md:grid-cols-2 sm:grid-cols-1"
    >
      {CARD_CONFIGS.map(({ title, fileType, icon, bgColor, iconColor }) => (
        <FileCard
          key={fileType}
          title={title}
          fileType={fileType}
          accept={ACCEPT_BY_TYPE[fileType]}
          icon={icon}
          bgColor={bgColor}
          iconColor={iconColor}
          onResult={onResult}
          onToast={onToast}
        />
      ))}
    </div>
  );
}
