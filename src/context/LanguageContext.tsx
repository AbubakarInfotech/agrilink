import React, { createContext, useContext, useEffect, useState } from 'react';
import ur from '../locales/ur.json';
import sd from '../locales/sd.json';
import en from '../locales/en.json';

export type Language = 'ur' | 'sd' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  dir: 'rtl' | 'ltr';
  t: (path: string) => string;
}

const translations: Record<Language, any> = { ur, sd, en };

const LanguageContext = createContext<LanguageContextType>({
  language: 'ur',
  setLanguage: () => {},
  dir: 'rtl',
  t: (key) => key,
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('agrilink_lang');
    if (saved === 'ur' || saved === 'sd' || saved === 'en') {
      return saved;
    }
    return 'ur'; // Default is Urdu
  });

  const dir: 'rtl' | 'ltr' = language === 'en' ? 'ltr' : 'rtl';

  useEffect(() => {
    localStorage.setItem('agrilink_lang', language);
    document.documentElement.setAttribute('lang', language);
    document.documentElement.setAttribute('dir', dir);
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (path: string): string => {
    const keys = path.split('.');
    let current: any = translations[language];

    for (const k of keys) {
      if (current && typeof current === 'object' && k in current) {
        current = current[k];
      } else {
        // Fallback to Urdu or English
        let fallback: any = translations.ur;
        for (const fb of keys) {
          if (fallback && typeof fallback === 'object' && fb in fallback) {
            fallback = fallback[fb];
          } else {
            fallback = undefined;
            break;
          }
        }
        return typeof fallback === 'string' ? fallback : path;
      }
    }

    return typeof current === 'string' ? current : path;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, dir, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => useContext(LanguageContext);
