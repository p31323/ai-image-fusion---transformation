
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageSelector from './LanguageSelector';

const BubbleIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
        <path fillRule="evenodd" d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm-3.12-8.12a.75.75 0 010-1.06l1.06-1.06a.75.75 0 111.06 1.06l-1.06 1.06a.75.75 0 01-1.06 0z" clipRule="evenodd" />
        <path d="M12.5 15.5a.75.75 0 00-1.5 0v.75a.75.75 0 001.5 0v-.75z" />
    </svg>
);


const Header: React.FC = () => {
    const { t } = useLanguage();
    return (
        <header className="text-center relative">
            <LanguageSelector />
            <div className="inline-flex items-center gap-3">
                 <BubbleIcon className="w-8 h-8 text-cyan-300" />
                 <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
                    {t('appTitle')}
                </h1>
                 <BubbleIcon className="w-8 h-8 text-cyan-300" />
            </div>
            <p className="mt-3 text-lg text-blue-200 max-w-3xl mx-auto">
                {t('appSubtitle')}
            </p>
        </header>
    );
};

export default Header;