import FileCard from "@/components/FileCard";
import type { OutputFormat } from "@/lib/converters";
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
  addFiles: (files: File[], fileType: FileType, format: OutputFormat) => void;
}

export default function FileGrid({ user, addFiles }: FileGridProps) {
  return (
    <div className="mx-auto mb-10 w-full max-w-5xl px-4 sm:px-6">
      <div
        data-authenticated={user ? "true" : "false"}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
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
            addFiles={addFiles}
          />
        ))}
      </div>
    </div>
  );
}
