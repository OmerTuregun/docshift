"use client";

import Link from "next/link";
import { useSectionNav } from "@/hooks/useSectionNav";
import { isSectionHref } from "@/lib/scrollToSection";

interface SectionNavLinkProps {
  href: string;
  className?: string;
  onNavigate?: () => void;
  children: React.ReactNode;
}

export default function SectionNavLink({
  href,
  className,
  onNavigate,
  children,
}: SectionNavLinkProps) {
  const { goToSection } = useSectionNav();

  if (isSectionHref(href)) {
    return (
      <button
        type="button"
        className={className}
        onClick={() => goToSection(href, onNavigate)}
      >
        {children}
      </button>
    );
  }

  return (
    <Link href={href} className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
}
