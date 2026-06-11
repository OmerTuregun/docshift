"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { TbBrandGoogleDrive, TbLoader2 } from "react-icons/tb";
import { showToast } from "@/components/Toast";
import { detectFileType } from "@/lib/detectFileType";
import type { FileType } from "@/types";

const SUPPORTED_MIME_TYPES = [
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/pdf",
  "application/vnd.ms-powerpoint",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "application/vnd.google-apps.spreadsheet",
  "application/vnd.google-apps.document",
  "application/vnd.google-apps.presentation",
];

interface DriveFilePickerProps {
  onFileSelected: (
    fileId: string,
    fileName: string,
    fileType: FileType,
  ) => void;
  isLoading?: boolean;
  variant?: "dark" | "light";
}

const VARIANT_CLASSES = {
  dark: "border-white/30 text-white/70 hover:border-white/60 hover:bg-white/10 hover:text-white",
  light:
    "border-gray-200 text-gray-600 hover:border-[#1A9BA1] hover:bg-[#d0f0f2]/40 hover:text-[#1D3461]",
} as const;

export default function DriveFilePicker({
  onFileSelected,
  isLoading = false,
  variant = "dark",
}: DriveFilePickerProps) {
  const [pickerLoaded, setPickerLoaded] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (window.google?.picker) {
      setPickerLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = () => {
      window.gapi.load("picker", () => {
        setPickerLoaded(true);
      });
    };
    document.head.appendChild(script);
  }, []);

  const openPicker = async () => {
    if (!pickerLoaded || !session) {
      return;
    }

    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
    const appId = process.env.NEXT_PUBLIC_GOOGLE_APP_ID;

    if (!apiKey || !appId) {
      showToast("Google Picker yapılandırılmamış", "error");
      return;
    }

    try {
      const tokenRes = await fetch("/api/drive/token");

      if (!tokenRes.ok) {
        const err = (await tokenRes.json()) as { error?: string };
        showToast(err.error ?? "Google token alınamadı", "error");
        return;
      }

      const { accessToken } = (await tokenRes.json()) as {
        accessToken: string;
      };

      const picker = new window.google.picker.PickerBuilder()
        .addView(
          new window.google.picker.DocsView()
            .setMimeTypes(SUPPORTED_MIME_TYPES.join(","))
            .setSelectFolderEnabled(false),
        )
        .setOAuthToken(accessToken)
        .setDeveloperKey(apiKey)
        .setAppId(appId)
        .setCallback((data: GooglePickerCallback) => {
          if (data.action === window.google.picker.Action.PICKED) {
            const file = data.docs[0];
            const fileType = detectFileType(file.name, file.mimeType);

            if (!fileType) {
              showToast("Desteklenmeyen dosya türü", "error");
              return;
            }

            onFileSelected(file.id, file.name, fileType);
          }
        })
        .build();

      picker.setVisible(true);
    } catch {
      showToast("Google Drive açılamadı", "error");
    }
  };

  if (!session) {
    return null;
  }

  return (
    <button
      type="button"
      onClick={openPicker}
      disabled={!pickerLoaded || isLoading}
      className={`flex items-center gap-2 rounded-xl border px-3 py-2 text-xs transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${VARIANT_CLASSES[variant]}`}
    >
      {isLoading ? (
        <TbLoader2 className="animate-spin text-xs" />
      ) : (
        <TbBrandGoogleDrive className="text-xs" />
      )}
      Drive&apos;dan Seç
    </button>
  );
}
