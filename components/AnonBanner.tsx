"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { TbInfoCircle } from "react-icons/tb";

export default function AnonBanner() {
  const router = useRouter();
  const { status } = useSession();

  if (status !== "unauthenticated") {
    return null;
  }

  return (
    <div className="mx-auto mb-8 max-w-4xl px-4 sm:px-6">
      <div className="flex flex-col items-start gap-3 rounded-xl border border-[#1A9BA1]/25 bg-[#d0f0f2] px-4 py-3 sm:flex-row sm:items-center">
        <TbInfoCircle className="shrink-0 text-lg text-[#1A9BA1]" />
        <p className="flex-1 text-sm text-[#1D3461]">
          Anonim olarak kullanıyorsunuz. Geçmişinizi kaydetmek için{" "}
          <Link
            href="/auth/login?callbackUrl=/"
            className="font-medium text-[#1A9BA1] underline underline-offset-2 hover:text-[#1D3461]"
          >
            giriş yapın
          </Link>
        </p>
        <button
          type="button"
          onClick={() => router.push("/auth/login?callbackUrl=/")}
          className="w-full shrink-0 rounded-lg bg-[#1A9BA1] px-4 py-2 text-xs text-white transition-colors hover:bg-[#1D3461] sm:w-auto"
        >
          Üye Ol
        </button>
      </div>
    </div>
  );
}
