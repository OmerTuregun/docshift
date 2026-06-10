import Link from "next/link";

const ERROR_MESSAGES: Record<string, { title: string; description: string }> = {
  Configuration: {
    title: "OAuth yapılandırması eksik",
    description:
      "Google giriş bilgileri (.env.local) ayarlanmamış veya hatalı. AUTH_GOOGLE_ID, AUTH_GOOGLE_SECRET ve AUTH_SECRET değerlerini doldurun, ardından sunucuyu yeniden başlatın.",
  },
  AccessDenied: {
    title: "Erişim reddedildi",
    description: "Google hesabınızla giriş izni verilmedi.",
  },
  Verification: {
    title: "Doğrulama hatası",
    description: "Giriş bağlantısının süresi dolmuş veya geçersiz.",
  },
  Default: {
    title: "Giriş başarısız",
    description:
      "Kimlik doğrulama sırasında bir hata oluştu. Lütfen tekrar deneyin.",
  },
};

interface AuthErrorPageProps {
  searchParams: Promise<{ error?: string }>;
}

export default async function AuthErrorPage({
  searchParams,
}: AuthErrorPageProps) {
  const { error } = await searchParams;
  const message = ERROR_MESSAGES[error ?? ""] ?? ERROR_MESSAGES.Default;

  return (
    <main className="flex min-h-screen items-center justify-center bg-brand-teal-bg/30 px-4">
      <div className="w-full max-w-md rounded-2xl border border-red-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-brand-navy">
          {message.title}
        </h1>
        <p className="mb-6 text-sm text-gray-600">{message.description}</p>

        {error === "Configuration" ? (
          <div className="mb-6 rounded-lg bg-gray-50 p-4 text-left text-xs text-gray-500">
            <p className="mb-2 font-medium text-gray-700">Kontrol listesi:</p>
            <ol className="list-decimal space-y-1 pl-4">
              <li>
                <code className="text-brand-navy">.env.example</code> dosyasını{" "}
                <code className="text-brand-navy">.env.local</code> olarak kopyalayın
              </li>
              <li>Google Cloud Console&apos;dan OAuth Client ID oluşturun</li>
              <li>
                Redirect URI:{" "}
                <code className="text-brand-navy">
                  http://localhost:3030/api/auth/callback/google
                </code>
              </li>
              <li>Docker kullanıyorsanız container&apos;ı yeniden başlatın</li>
            </ol>
          </div>
        ) : null}

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
