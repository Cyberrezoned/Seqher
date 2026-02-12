export const LANGUAGE_COOKIE = 'seqher_lang';

export const SUPPORTED_LANGUAGES = ['en', 'fr'] as const;
export type Language = (typeof SUPPORTED_LANGUAGES)[number];

export function isLanguage(value: unknown): value is Language {
  return value === 'en' || value === 'fr';
}

export function parseCookieValue(cookie: string, name: string): string | null {
  const parts = cookie.split(';');
  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    if (key !== name) continue;
    const rawValue = trimmed.slice(eq + 1).trim();
    try {
      return decodeURIComponent(rawValue);
    } catch {
      return null;
    }
  }
  return null;
}

export function getLanguageFromCookieString(cookie: string): Language {
  const raw = parseCookieValue(cookie, LANGUAGE_COOKIE);
  return isLanguage(raw) ? raw : 'en';
}

export function buildLanguageCookie(language: Language): string {
  const secureAttr = typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; secure' : '';
  return `${LANGUAGE_COOKIE}=${language}; path=/; max-age=31536000; samesite=lax${secureAttr}`;
}
