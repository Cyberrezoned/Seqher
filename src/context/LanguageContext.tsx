'use client';

import { createContext, useContext, useMemo, useState } from 'react';

import { buildLanguageCookie, type Language } from '@/lib/i18n/language';
import { getLanguageFromClientCookieString } from '@/lib/i18n/locale';
import { UI_MESSAGES } from '@/lib/i18n/messages';

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  messages: (typeof UI_MESSAGES)[Language];
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() =>
    typeof document === 'undefined' ? 'en' : getLanguageFromClientCookieString(document.cookie)
  );

  const value = useMemo<LanguageContextValue>(() => {
    const setLanguage = (next: Language) => {
      document.cookie = buildLanguageCookie(next);
      setLanguageState(next);
    };
    return { language, setLanguage, messages: UI_MESSAGES[language] };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguageContext(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguageContext must be used within LanguageProvider');
  return ctx;
}

