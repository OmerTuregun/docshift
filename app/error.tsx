"use client";

import { TbAlertTriangle } from "react-icons/tb";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50">
          <TbAlertTriangle className="text-xl text-red-400" aria-hidden="true" />
        </div>
        <h2 className="mb-2 text-lg font-medium text-[#1D3461]">
          Bir şeyler ters gitti
        </h2>
        <p className="mb-6 text-sm text-gray-400">
          {error.message || "Beklenmedik bir hata oluştu."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="rounded-xl bg-[#1A9BA1] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#1D3461]"
        >
          Tekrar dene
        </button>
      </div>
    </div>
  );
}
