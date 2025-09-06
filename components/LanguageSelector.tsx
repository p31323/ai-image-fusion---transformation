
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Language } from '../types';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  const languages: { code: Language; label: string }[] = [
    { code: 'en', label: 'EN' },
    { code: 'zh', label: '繁體中文' },
    { code: 'ja', label: '日本語' },
  ];

  return (
    <div className="absolute top-4 right-4 bg-blue-950/60 backdrop-blur-sm p-1 rounded-lg border border-blue-800 z-10">
      <div className="flex items-center space-x-1">
        {languages.map(({ code, label }) => (
          <button
            key={code}
            onClick={() => setLanguage(code)}
            className={`px-3 py-1 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              language === code
                ? 'bg-cyan-600 text-white'
                : 'text-blue-200 hover:bg-blue-700'
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default LanguageSelector;