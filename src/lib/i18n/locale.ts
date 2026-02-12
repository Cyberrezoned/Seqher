import { getLanguageFromCookieString, isLanguage, LANGUAGE_COOKIE, type Language } from '@/lib/i18n/language';

export type Region = 'ng' | 'ca';
export const REGION_COOKIE = 'seqher_region';

type CookieStore = {
  get: (name: string) => { value: string } | undefined;
};

export function isRegion(value: unknown): value is Region {
  return value === 'ng' || value === 'ca';
}

export function getRegionFromCookies(cookieStore: CookieStore): Region {
  const raw = cookieStore.get(REGION_COOKIE)?.value;
  return isRegion(raw) ? raw : 'ng';
}

export function getLanguageFromCookies(cookieStore: CookieStore): Language {
  const raw = cookieStore.get(LANGUAGE_COOKIE)?.value;
  return isLanguage(raw) ? raw : 'en';
}

export function getHtmlLang(language: Language, region: Region): string {
  if (language === 'fr') return region === 'ca' ? 'fr-CA' : 'fr';
  return region === 'ca' ? 'en-CA' : 'en-NG';
}

export function getIntlLocale(language: Language, region: Region): string {
  return getHtmlLang(language, region);
}

export function getHtmlLangFromCookies(cookieStore: CookieStore): string {
  const region = getRegionFromCookies(cookieStore);
  const language = getLanguageFromCookies(cookieStore);
  return getHtmlLang(language, region);
}

export function getLanguageFromClientCookieString(cookie: string): Language {
  return getLanguageFromCookieString(cookie);
}
