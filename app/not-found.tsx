import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="max-w-md text-center">
        <div className="mb-4 text-6xl font-medium text-gray-100">404</div>
        <h2 className="mb-2 text-lg font-medium text-[#1D3461]">
          Sayfa bulunamadı
        </h2>
        <p className="mb-6 text-sm text-gray-400">
          Aradığın sayfa mevcut değil veya taşınmış olabilir.
        </p>
        <Link
          href="/"
          className="inline-block rounded-xl bg-[#1A9BA1] px-5 py-2.5 text-sm text-white transition-colors hover:bg-[#1D3461]"
        >
          Ana sayfaya dön
        </Link>
      </div>
    </div>
  );
}
