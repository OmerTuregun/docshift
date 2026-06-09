"use client";

import Image from "next/image";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-teal-bg/60 via-white to-brand-navy-bg/40 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-100 bg-white p-10 shadow-lg">
        <Image
          src="/logos/docshift_logo_full.png"
          alt="DocShift"
          width={240}
          height={72}
          className="mx-auto mb-6 h-[72px] w-auto"
          priority
        />

        <h1 className="text-center text-2xl font-semibold text-brand-navy">
          Hoş geldiniz
        </h1>
        <p className="mt-1 mb-8 text-center text-sm text-gray-400">
          Dönüşüm geçmişinize erişmek için giriş yapın
        </p>

        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-brand-navy transition hover:border-brand-teal hover:bg-brand-teal-bg"
        >
          <FcGoogle size={24} />
          Google ile devam et
        </button>

        <div className="my-5 flex items-center gap-3">
          <hr className="flex-1 border-gray-100" />
          <span className="text-xs text-gray-300">veya</span>
          <hr className="flex-1 border-gray-100" />
        </div>

        <p className="text-center text-sm">
          <Link
            href="/"
            className="text-brand-teal underline underline-offset-2 hover:text-brand-navy"
          >
            Anonim olarak devam et
          </Link>
        </p>
      </div>
    </main>
  );
}
