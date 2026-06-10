import Image from "next/image";
import Link from "next/link";
import NavBarClient from "@/components/NavBarClient";
import type { Session } from "next-auth";

interface NavBarProps {
  session: Session | null;
}

export default function NavBar({ session }: NavBarProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center">
          <Image
            src="/logos/docshift_logo_wordmark.png"
            alt="DocShift"
            width={160}
            height={32}
            className="hidden md:block"
            style={{ height: "2rem", width: "auto" }}
            priority
          />
          <Image
            src="/logos/docshift_logo_icon.png"
            alt="DocShift"
            width={32}
            height={32}
            className="md:hidden"
            style={{ height: "2rem", width: "2rem" }}
            priority
          />
        </Link>

        <NavBarClient user={session?.user ?? null} />
      </div>
    </header>
  );
}
