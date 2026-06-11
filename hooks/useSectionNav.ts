"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { navigateToSection } from "@/lib/scrollToSection";

export function useSectionNav() {
  const pathname = usePathname();
  const router = useRouter();

  const goToSection = useCallback(
    (href: string, onNavigate?: () => void) => {
      onNavigate?.();
      return navigateToSection(href, pathname, router);
    },
    [pathname, router],
  );

  return { goToSection };
}
