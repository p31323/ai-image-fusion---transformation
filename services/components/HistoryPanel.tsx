
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HistoryPanelProps {
    history: string[];
    onSelect: (imageUrl: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({ history, onSelect }) => {
    const { t } = useLanguage();

    return (
        <div className="mt-8 bg-blue-950/60 rounded-lg p-6 shadow-2xl border border-blue-800 backdrop-blur-sm">
            <h3 className="text-xl font-semibold text-white mb-4">{t('historyTitle')}</h3>
            {history.length > 0 ? (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-9 gap-4">
                    {history.map((imageUrl, index) => (
                        <button
                            key={index}
                            onClick={() => onSelect(imageUrl)}
                            className="aspect-square rounded-lg overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-950 focus:ring-cyan-500 transition transform hover:scale-105"
                            aria-label={`View generated image ${index + 1}`}
                        >
                            <img
                                src={imageUrl}
                                alt={`Generated image ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </button>
                    ))}
                </div>
            ) : (
                <p className="text-blue-400 text-center py-4">{t('historyEmptyState')}</p>
            )}
        </div>
    );
};

export default HistoryPanel;