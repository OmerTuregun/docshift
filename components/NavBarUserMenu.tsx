"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "next-auth/react";
import type { Session } from "next-auth";

interface NavBarUserMenuProps {
  user: NonNullable<Session["user"]>;
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

export default function NavBarUserMenu({ user }: NavBarUserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-[#1A9BA1]/10"
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
          <span className="text-sm font-semibold text-[#1D3461]">
            {getInitials(user.name, user.email)}
          </span>
        )}
      </button>

      {open ? (
        <div className="absolute right-0 z-50 mt-2 w-44 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          <Link
            href="/history"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            Geçmişim
          </Link>
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
  );
}
