import Link from "next/link";

export default function AuthErrorPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-teal-bg/30 px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-brand-navy">
          Giriş başarısız
        </h1>
        <p className="mb-6 text-sm text-gray-600">
          Kimlik doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.
        </p>
        <Link
          href="/auth/login"
          className="inline-flex rounded-xl bg-brand-teal px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand-navy"
        >
          Giriş sayfasına dön
        </Link>
      </div>
    </main>
  );
}
