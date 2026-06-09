import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-bold text-[#1D3461]">
          Giriş başarısız
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Kimlik doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex rounded-xl bg-[#1A9BA1] px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-[#1D3461]"
        >
          Giriş sayfasına dön
        </Link>
      </div>
    </main>
  );
}
