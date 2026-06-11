const MAX_SCROLL_ATTEMPTS = 25;
const SCROLL_RETRY_MS = 50;
const CROSS_PAGE_INITIAL_DELAY_MS = 100;

export function scrollToSection(sectionId: string): void {
  document.getElementById(sectionId)?.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

export function isSectionHref(href: string): boolean {
  return href.startsWith("#") && href.length > 1;
}

export function sectionIdFromHref(href: string): string {
  return href.slice(1);
}

function waitAndScroll(sectionId: string): void {
  let attempts = 0;

  const tryScroll = () => {
    const el = document.getElementById(sectionId);

    if (el) {
      scrollToSection(sectionId);
      return;
    }

    if (attempts < MAX_SCROLL_ATTEMPTS) {
      attempts += 1;
      setTimeout(tryScroll, SCROLL_RETRY_MS);
    }
  };

  setTimeout(tryScroll, CROSS_PAGE_INITIAL_DELAY_MS);
}

export function navigateToSection(
  href: string,
  pathname: string,
  router: { push: (url: string) => void },
): boolean {
  if (!isSectionHref(href)) {
    return false;
  }

  const sectionId = sectionIdFromHref(href);

  if (pathname === "/") {
    scrollToSection(sectionId);
  } else {
    router.push("/");
    waitAndScroll(sectionId);
  }

  return true;
}
