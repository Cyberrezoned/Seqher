const FALLBACK_SITE_URL = 'https://seqher.org';

function normalizeSiteUrl(raw: string | undefined | null): string | null {
  if (!raw) return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;
  try {
    return new URL(trimmed).origin;
  } catch {
    return null;
  }
}

export function getSiteUrl(): string {
  return (
    normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL) ??
    normalizeSiteUrl(process.env.SITE_URL) ??
    normalizeSiteUrl(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    FALLBACK_SITE_URL
  );
}

export function getSiteOrigin(): URL {
  return new URL(getSiteUrl());
}

