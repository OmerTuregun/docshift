"use client";

import Image from "next/image";
import Link from "next/link";
import {
  TbBrandGithub,
  TbBrandTwitter,
  TbMail,
} from "react-icons/tb";
import { HOW_USE_LINK, HOW_USE_PATH, SECTION_LINKS } from "@/lib/siteNav";

const PRODUCT_LINKS = [
  ...SECTION_LINKS,
  {
    label: HOW_USE_LINK.label,
    href: `/auth/login?callbackUrl=${HOW_USE_PATH}`,
  },
] as const;

const ACCOUNT_LINKS = [
  { label: "Giriş Yap", href: "/auth/login?callbackUrl=/" },
  { label: "Kayıt Ol", href: "/auth/login?callbackUrl=/" },
  { label: "Geçmişim", href: "#" },
] as const;

const LEGAL_LINKS = [
  { label: "Gizlilik Politikası", href: "#" },
  { label: "Kullanım Koşulları", href: "#" },
  { label: "İletişim", href: "mailto:info@docshift.app" },
] as const;

const SOCIAL_LINKS = [
  { icon: TbMail, href: "mailto:info@docshift.app", label: "E-posta" },
  { icon: TbBrandGithub, href: "#", label: "GitHub" },
  { icon: TbBrandTwitter, href: "#", label: "Twitter" },
] as const;

const TRUST_BADGES = ["Ücretsiz", "Güvenli", "Hızlı"] as const;

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6 sm:py-12">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <div className="mb-3">
              <Image
                src="/logos/docshift_logo_wordmark.png"
                alt="DocShift"
                width={160}
                height={28}
                className="h-7 w-auto"
                style={{ height: "1.75rem", width: "auto" }}
              />
            </div>

            <p className="max-w-[180px] text-xs leading-relaxed text-gray-400">
              Belge dönüşümünü herkes için basit ve erişilebilir hale
              getiriyoruz.
            </p>

            <div className="mt-4 flex gap-2">
              {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-100 text-gray-400 transition-all duration-150 hover:border-[#1A9BA1]/30 hover:text-[#1A9BA1]"
                >
                  <Icon className="text-sm" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-medium tracking-wider text-[#1D3461] uppercase">
              Ürün
            </h4>
            <ul className="space-y-2.5">
              {PRODUCT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-400 transition-colors duration-150 hover:text-[#1A9BA1]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-medium tracking-wider text-[#1D3461] uppercase">
              Hesap
            </h4>
            <ul className="space-y-2.5">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-400 transition-colors duration-150 hover:text-[#1A9BA1]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-medium tracking-wider text-[#1D3461] uppercase">
              Yasal
            </h4>
            <ul className="space-y-2.5">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-xs text-gray-400 transition-colors duration-150 hover:text-[#1A9BA1]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-4 py-4 sm:flex-row sm:px-6">
          <p className="text-xs text-gray-300">
            © {new Date().getFullYear()} DocShift. Tüm hakları saklıdır.
          </p>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                document.dispatchEvent(
                  new KeyboardEvent("keydown", { key: "?", bubbles: true }),
                );
              }}
              className="hidden items-center gap-1.5 text-[10px] text-gray-300 transition-colors hover:text-[#1A9BA1] sm:flex"
            >
              <kbd className="rounded border border-gray-200 bg-gray-50 px-1.5 py-0.5 font-mono text-[9px]">
                ?
              </kbd>
              Klavye kısayolları
            </button>

            {TRUST_BADGES.map((badge) => (
              <span
                key={badge}
                className="rounded-full border border-gray-100 px-2.5 py-1 text-[10px] text-gray-300"
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
