import React, { createContext, useState, useContext, ReactNode, useMemo, useEffect } from 'react';
import { Language, Translations } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, Translations> | null>(null);

  useEffect(() => {
    const fetchTranslations = async () => {
        try {
            const [en, zh, ja] = await Promise.all([
                fetch('./locales/en.json').then(res => res.json()),
                fetch('./locales/zh.json').then(res => res.json()),
                fetch('./locales/ja.json').then(res => res.json()),
            ]);
            setTranslations({ en, zh, ja });
        } catch (error) {
            console.error("Failed to load translations:", error);
            // Set empty translations on error to prevent app crash
            setTranslations({ en: {}, zh: {}, ja: {} });
        }
    };
    fetchTranslations();
  }, []);

  const t = useMemo(() => (key: string, replacements?: Record<string, string>): string => {
    if (!translations) {
        return '...'; // Show a loading indicator until translations are loaded
    }
    const langDict = (translations as Record<Language, Translations>)[language];
    if (!langDict) return key;

    let translation = langDict[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
        });
    }
    return translation;
  }, [language, translations]);

  const value = { language, setLanguage, t };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
