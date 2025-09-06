
import React from 'react';
import { ArtStyle } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface StyleSelectorProps {
    selectedStyle: ArtStyle;
    onStyleChange: (style: ArtStyle) => void;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({ selectedStyle, onStyleChange }) => {
    const { t } = useLanguage();

    const styles = [
        { id: ArtStyle.PHOTOREALISTIC, labelKey: 'stylePhotorealistic' },
        { id: ArtStyle.ANIME, labelKey: 'styleAnime' },
        { id: ArtStyle.WATERCOLOR, labelKey: 'styleWatercolor' },
        { id: ArtStyle.CYBERPUNK, labelKey: 'styleCyberpunk' },
        { id: ArtStyle.FANTASY, labelKey: 'styleFantasy' },
        { id: ArtStyle.THREED, labelKey: 'style3D' },
        { id: ArtStyle.PIXEL, labelKey: 'stylePixel' },
        { id: ArtStyle.SUPERMAN_COMIC, labelKey: 'styleSupermanComic' },
        { id: ArtStyle.SPONGEBOB, labelKey: 'styleSpongebob' },
        { id: ArtStyle.GHIBLI, labelKey: 'styleGhibli' },
        { id: ArtStyle.ONE_PIECE, labelKey: 'styleOnePiece' },
    ];

    return (
        <div className="mt-6">
            <label htmlFor="style-selector" className="block text-sm font-medium text-blue-200 mb-2">
                {t('styleLabel')}
            </label>
            <select
                id="style-selector"
                value={selectedStyle}
                onChange={(e) => onStyleChange(e.target.value as ArtStyle)}
                className="w-full bg-blue-900/50 border border-blue-700 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 p-3 transition"
            >
                {styles.map(style => (
                    <option key={style.id} value={style.id}>
                        {t(style.labelKey)}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default StyleSelector;