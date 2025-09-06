
import React from 'react';
import { AppMode } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ModeSelectorProps {
    selectedMode: AppMode;
    onModeChange: (mode: AppMode) => void;
}

const ModeSelector: React.FC<ModeSelectorProps> = ({ selectedMode, onModeChange }) => {
    const { t } = useLanguage();
    const baseClasses = "w-full py-2.5 text-sm font-semibold rounded-md transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-950 focus:ring-cyan-500";
    const activeClasses = "bg-cyan-600 text-white shadow-md";
    const inactiveClasses = "bg-blue-800 text-blue-200 hover:bg-blue-700";

    return (
        <div>
            <label className="block text-sm font-medium text-blue-200 mb-2">{t('modeLabel')}</label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-blue-900/50 rounded-lg">
                <button
                    onClick={() => onModeChange(AppMode.MERGE)}
                    className={`${baseClasses} ${selectedMode === AppMode.MERGE ? activeClasses : inactiveClasses}`}
                >
                    {t('mergeMode')}
                </button>
                <button
                    onClick={() => onModeChange(AppMode.EDIT)}
                    className={`${baseClasses} ${selectedMode === AppMode.EDIT ? activeClasses : inactiveClasses}`}
                >
                    {t('editMode')}
                </button>
            </div>
        </div>
    );
};

export default ModeSelector;