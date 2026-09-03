import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, translations } from '../i18n/translations';

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: typeof translations['th'];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app_language') as Language;
      if (saved === 'th' || saved === 'en') return saved;
    }
    return 'th'; // Default to Thai as requested
  });

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('app_language', newLang);
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const value = {
    lang,
    setLang,
    t: translations[lang],
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
