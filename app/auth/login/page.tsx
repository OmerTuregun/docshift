import Image from "next/image";
import Link from "next/link";
import GoogleSignInButton from "@/components/GoogleSignInButton";

export default function LoginPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
        <div className="mb-8 flex justify-center">
          <Image
            src="/logos/docshift_logo_full.svg"
            alt="DocShift"
            width={240}
            height={48}
            className="h-12 w-auto"
            priority
          />
        </div>

        <h1 className="mb-2 text-center text-2xl font-bold text-[#1D3461]">
          Hoş geldiniz
        </h1>
        <p className="mb-8 text-center text-sm text-gray-600">
          Dönüşüm geçmişinize erişmek için giriş yapın
        </p>

        <GoogleSignInButton />

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-gray-200" />
          <span className="text-xs text-gray-400">veya</span>
          <div className="h-px flex-1 bg-gray-200" />
        </div>

        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-[#1A9BA1] underline underline-offset-2"
          >
            Anonim olarak devam et
          </Link>
        </div>
      </div>
    </main>
  );
}
