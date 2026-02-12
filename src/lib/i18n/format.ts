import type { Language } from '@/lib/i18n/language';
import type { Region } from '@/lib/i18n/locale';
import { getIntlLocale } from '@/lib/i18n/locale';

type DateInput = Date | string | number;

function asDate(value: DateInput): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatShortDate(value: DateInput, language: Language, region: Region) {
  const locale = getIntlLocale(language, region);
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric' }).format(asDate(value));
}

export function formatLongDate(value: DateInput, language: Language, region: Region) {
  const locale = getIntlLocale(language, region);
  return new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'long', day: 'numeric' }).format(asDate(value));
}

export function formatCurrency(amount: number, region: Region, language: Language) {
  const locale = getIntlLocale(language, region);
  const currency = region === 'ca' ? 'CAD' : 'NGN';
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 0 }).format(amount);
}

