"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";
import { TbHistory, TbMenu2, TbSearch, TbX } from "react-icons/tb";
import type { Session } from "next-auth";
import HistoryDrawer from "@/components/HistoryDrawer";
import SmartSearch from "@/components/SmartSearch";
import { useFileUploadContext } from "@/contexts/FileUploadContext";
import { HOW_USE_LINK, HOW_USE_PATH, SECTION_LINKS } from "@/lib/siteNav";

interface NavBarProps {
  session: Session | null;
}

function getInitials(name?: string | null, email?: string | null): string {
  if (name) {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (email?.[0] ?? "U").toUpperCase();
}

export default function NavBar({ session }: NavBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { reconvertFromHistory } = useFileUploadContext();
  const user = session?.user ?? null;
  const [historyOpen, setHistoryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!userMenuRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleConvertClick = () => {
    setMobileNavOpen(false);

    if (pathname === "/") {
      document.getElementById("file-cards")?.scrollIntoView({
        behavior: "smooth",
      });
    } else {
      router.push("/");
      setTimeout(() => {
        document.getElementById("file-cards")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 300);
    }
  };

  useEffect(() => {
    if (!mobileNavOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileNavOpen(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [mobileNavOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-gray-100 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link href="/" className="flex shrink-0 items-center">
            <Image
              src="/logos/docshift_logo_wordmark.png"
              alt="DocShift"
              width={160}
              height={32}
              className="hidden h-8 w-auto md:block"
              priority
            />
            <Image
              src="/logos/docshift_logo_icon.png"
              alt="DocShift"
              width={32}
              height={32}
              className="h-8 w-8 md:hidden"
              priority
            />
          </Link>

          <div className="mx-auto hidden max-w-sm flex-1 justify-center px-4 sm:flex">
            <SmartSearch onOpenHistory={() => setHistoryOpen(true)} />
          </div>

          <nav
            aria-label="Sayfa bölümleri"
            className="hidden items-center justify-center gap-1 lg:flex"
          >
            {SECTION_LINKS.map((link) =>
              link.href === "#file-cards" ? (
                <button
                  key={link.href}
                  type="button"
                  onClick={handleConvertClick}
                  className="rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-[#d0f0f2]/60 hover:text-[#1D3461]"
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-[#d0f0f2]/60 hover:text-[#1D3461]"
                >
                  {link.label}
                </Link>
              ),
            )}
            <Link
              href={
                user
                  ? HOW_USE_PATH
                  : `/auth/login?callbackUrl=${HOW_USE_PATH}`
              }
              className="rounded-lg px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-[#d0f0f2]/60 hover:text-[#1D3461]"
            >
              {HOW_USE_LINK.label}
            </Link>
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              type="button"
              aria-label="Ara"
              onClick={() => setMobileSearchOpen((open) => !open)}
              className="rounded-lg p-2 text-[#1D3461] transition hover:bg-gray-100 sm:hidden"
            >
              <TbSearch className="text-lg" />
            </button>
            <button
              type="button"
              aria-label={mobileNavOpen ? "Menüyü kapat" : "Menüyü aç"}
              aria-expanded={mobileNavOpen}
              onClick={() => setMobileNavOpen((open) => !open)}
              className="rounded-lg p-2 text-[#1D3461] transition hover:bg-[#d0f0f2] lg:hidden"
            >
              {mobileNavOpen ? (
                <TbX className="text-lg" />
              ) : (
                <TbMenu2 className="text-lg" />
              )}
            </button>
            <button
              type="button"
              title="Geçmişim"
              aria-label="Geçmişim"
              onClick={() => setHistoryOpen(true)}
              className="group relative rounded-lg p-2 text-[#1D3461] transition hover:bg-[#d0f0f2]"
            >
              <TbHistory className="text-lg" />
              <span className="pointer-events-none absolute -bottom-8 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded bg-[#1D3461] px-2 py-1 text-xs text-white group-hover:block">
                Geçmişim
              </span>
            </button>

            {user ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  type="button"
                  onClick={() => setUserMenuOpen((open) => !open)}
                  className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-brand-navy text-sm font-medium text-white"
                  aria-label="User menu"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.name ?? "User"}
                      width={36}
                      height={36}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    getInitials(user.name, user.email)
                  )}
                </button>

                {userMenuOpen ? (
                  <div className="absolute top-12 right-0 z-50 w-48 rounded-xl border border-gray-100 bg-white py-2 shadow-lg">
                    {user.email ? (
                      <p className="border-b border-gray-100 px-4 py-2 text-xs text-gray-400">
                        {user.email}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setHistoryOpen(true);
                      }}
                    >
                      Geçmişim
                    </button>
                    <button
                      type="button"
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Çıkış Yap
                    </button>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="hidden items-center gap-2 sm:flex">
                <Link
                  href="/auth/login?callbackUrl=/"
                  className="rounded-lg border border-brand-teal px-3 py-2 text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal-bg sm:px-4"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/login?callbackUrl=/"
                  className="rounded-lg bg-brand-teal px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy sm:px-4"
                >
                  Kayıt Ol
                </Link>
              </div>
            )}
          </div>
        </div>

        {mobileSearchOpen ? (
          <div className="border-b border-gray-100 bg-white px-4 py-2 sm:hidden">
            <SmartSearch
              className="w-full [&_div:first-child]:w-full [&_div:first-child]:focus-within:w-full"
              onOpenHistory={() => {
                setHistoryOpen(true);
                setMobileSearchOpen(false);
              }}
            />
          </div>
        ) : null}

        {mobileNavOpen ? (
          <div className="border-t border-gray-100 bg-white px-4 py-4 lg:hidden">
            <nav aria-label="Mobil sayfa bölümleri" className="space-y-1">
              {SECTION_LINKS.map((link) =>
                link.href === "#file-cards" ? (
                  <button
                    key={link.href}
                    type="button"
                    onClick={handleConvertClick}
                    className="block w-full rounded-lg px-3 py-2.5 text-left text-sm text-gray-600 transition-colors hover:bg-[#d0f0f2]/60 hover:text-[#1D3461]"
                  >
                    {link.label}
                  </button>
                ) : (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileNavOpen(false)}
                    className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-[#d0f0f2]/60 hover:text-[#1D3461]"
                  >
                    {link.label}
                  </Link>
                ),
              )}
              <Link
                href={
                  user
                    ? HOW_USE_PATH
                    : `/auth/login?callbackUrl=${HOW_USE_PATH}`
                }
                onClick={() => setMobileNavOpen(false)}
                className="block rounded-lg px-3 py-2.5 text-sm text-gray-600 transition-colors hover:bg-[#d0f0f2]/60 hover:text-[#1D3461]"
              >
                {HOW_USE_LINK.label}
              </Link>
            </nav>

            {!user ? (
              <div className="mt-4 flex flex-col gap-2 border-t border-gray-100 pt-4 sm:hidden">
                <Link
                  href="/auth/login?callbackUrl=/"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg border border-brand-teal px-4 py-2.5 text-center text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal-bg"
                >
                  Giriş Yap
                </Link>
                <Link
                  href="/auth/login?callbackUrl=/"
                  onClick={() => setMobileNavOpen(false)}
                  className="rounded-lg bg-brand-teal px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-brand-navy"
                >
                  Kayıt Ol
                </Link>
              </div>
            ) : null}
          </div>
        ) : null}
      </header>

      <AnimatePresence>
        {historyOpen ? (
          <HistoryDrawer
            key="history-drawer"
            isOpen={historyOpen}
            onClose={() => setHistoryOpen(false)}
            onReconvert={reconvertFromHistory}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
}
