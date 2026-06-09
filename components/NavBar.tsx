import Image from "next/image";
import Link from "next/link";
import { auth } from "@/auth";
import NavBarUserMenu from "@/components/NavBarUserMenu";

export default async function NavBar() {
  const session = await auth();

  return (
    <header className="sticky top-0 z-50 border-b border-[#e5e7eb] bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logos/logo_wordmark.svg"
            alt="DocShift"
            width={140}
            height={32}
            className="hidden h-8 w-auto sm:block"
            priority
          />
          <Image
            src="/logos/logo_icon.svg"
            alt="DocShift"
            width={32}
            height={32}
            className="h-8 w-8 sm:hidden"
            priority
          />
        </Link>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <NavBarUserMenu user={session.user} />
          ) : (
            <>
              <Link
                href="/auth/login"
                className="rounded-lg px-3 py-2 text-sm font-medium text-[#1D3461] transition-colors hover:bg-gray-100"
              >
                Giriş Yap
              </Link>
              <Link
                href="/auth/login"
                className="rounded-lg bg-[#1A9BA1] px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-[#1D3461]"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
