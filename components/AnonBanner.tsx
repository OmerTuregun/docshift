"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { TbInfoCircle } from "react-icons/tb";

interface AnonBannerProps {
  isLoggedIn: boolean;
}

export default function AnonBanner({ isLoggedIn }: AnonBannerProps) {
  const router = useRouter();

  if (isLoggedIn) return null;

  return (
    <div className="mx-auto mb-8 max-w-4xl px-6">
      <div className="flex items-center gap-3 rounded-xl border border-brand-teal/30 bg-brand-teal-bg px-5 py-3.5">
        <TbInfoCircle className="shrink-0 text-lg text-brand-teal" />
        <p className="flex-1 text-sm text-brand-navy">
          Anonim olarak kullanıyorsunuz. Geçmişinizi kaydetmek için{" "}
          <Link
            href="/auth/login"
            className="font-medium text-brand-teal underline underline-offset-2 hover:text-brand-navy"
          >
            giriş yapın
          </Link>
        </p>
        <button
          type="button"
          onClick={() => router.push("/auth/login")}
          className="shrink-0 rounded-lg bg-brand-teal px-4 py-2 text-xs text-white transition-colors hover:bg-brand-navy"
        >
          Üye Ol
        </button>
      </div>
    </div>
  );
}
