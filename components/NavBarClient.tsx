"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { TbHistory } from "react-icons/tb";
import type { Session } from "next-auth";

const HistoryPanel = dynamic(() => import("@/components/HistoryPanel"), {
  ssr: false,
});

interface NavBarClientProps {
  user: Session["user"] | null;
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

export default function NavBarClient({ user }: NavBarClientProps) {
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="flex items-center gap-2">
        {user ? (
          <>
            <button
              type="button"
              title="Geçmişim"
              aria-label="Geçmişim"
              onClick={() => setHistoryPanelOpen(true)}
              className="rounded-lg p-2 text-brand-navy transition-colors hover:bg-brand-teal-bg"
            >
              <TbHistory size={20} />
            </button>

            <div className="relative" ref={menuRef}>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
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

              {menuOpen ? (
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
                      setMenuOpen(false);
                      setHistoryPanelOpen(true);
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
          </>
        ) : (
          <>
            <Link
              href="/auth/login"
              className="rounded-lg border border-brand-teal px-4 py-2 text-sm font-medium text-brand-teal transition-colors hover:bg-brand-teal-bg"
            >
              Giriş Yap
            </Link>
            <Link
              href="/auth/login"
              className="rounded-lg bg-brand-teal px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-navy"
            >
              Kayıt Ol
            </Link>
          </>
        )}
      </div>

      {historyPanelOpen ? (
        <HistoryPanel
          isOpen={historyPanelOpen}
          onClose={() => setHistoryPanelOpen(false)}
        />
      ) : null}
    </>
  );
}
