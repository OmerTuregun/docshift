function looksLikePlaceholder(value: string): boolean {
  const lower = value.toLowerCase();
  return (
    lower.includes("placeholder") ||
    lower.includes("your-") ||
    lower.includes("replace") ||
    lower.includes("xxxxx") ||
    lower.includes("change-in-prod")
  );
}

export function isGoogleAuthConfigured(): boolean {
  const clientId = process.env.AUTH_GOOGLE_ID;
  const clientSecret = process.env.AUTH_GOOGLE_SECRET;
  const secret = process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

  if (!clientId || !clientSecret || !secret) {
    return false;
  }

  return !(
    looksLikePlaceholder(clientId) ||
    looksLikePlaceholder(clientSecret) ||
    looksLikePlaceholder(secret)
  );
}
