
import React, { useState, useEffect, useCallback } from 'react';
import { AppMode, ArtStyle } from './types';
import { generateImage } from './services/geminiService';
import Header from './components/Header';
import ModeSelector from './components/ModeSelector';
import ImageUploader from './components/ImageUploader';
import Spinner from './components/Spinner';
import { useLanguage } from './contexts/LanguageContext';
import StyleSelector from './components/StyleSelector';
import HistoryPanel from './components/HistoryPanel';

const SparklesIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
    </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ArrowPathIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 11.667 0l3.181-3.183m-4.991-2.696v4.992h-4.992" />
    </svg>
);


const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
    const res = await fetch(dataUrl);
    const blob = await res.blob();
    return new File([blob], filename, { type: blob.type });
};


const App: React.FC = () => {
    const [mode, setMode] = useState<AppMode>(AppMode.MERGE);
    const [style, setStyle] = useState<ArtStyle>(ArtStyle.PHOTOREALISTIC);
    const [image1, setImage1] = useState<File | null>(null);
    const [image2, setImage2] = useState<File | null>(null);
    const [prompt, setPrompt] = useState<string>('');
    const [negativePrompt, setNegativePrompt] = useState<string>('');
    const [styleStrength, setStyleStrength] = useState<number>(80);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [history, setHistory] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [image1Preview, setImage1Preview] = useState<string | null>(null);
    const [image2Preview, setImage2Preview] = useState<string | null>(null);

    const { t } = useLanguage();

    useEffect(() => {
        if (mode === AppMode.EDIT) {
            setImage2(null);
            setImage2Preview(null);
        }
    }, [mode]);

    const handleImage1Select = (file: File | null) => {
        setImage1(file);
        if (file) {
            setImage1Preview(URL.createObjectURL(file));
        } else {
            setImage1Preview(null);
        }
    };

    const handleImage2Select = (file: File | null) => {
        setImage2(file);
        if (file) {
            setImage2Preview(URL.createObjectURL(file));
        } else {
            setImage2Preview(null);
        }
    };
    
    const handleUseAsSource = useCallback(async () => {
        if (!resultImage) return;
        const file = await dataUrlToFile(resultImage, `generated-image-${Date.now()}.png`);
        handleImage1Select(file);
        setResultImage(null);
    }, [resultImage]);

    const handleSubmit = useCallback(async () => {
        if (!image1 || (mode === AppMode.MERGE && !image2)) {
            setError(t("errorAllInputs"));
            return;
        }

        setIsLoading(true);
        setError(null);
        setResultImage(null);
        
        const styleTextMap: Record<ArtStyle, string> = {
            [ArtStyle.PHOTOREALISTIC]: "photorealistic",
            [ArtStyle.ANIME]: "anime",
            [ArtStyle.WATERCOLOR]: "watercolor",
            [ArtStyle.CYBERPUNK]: "cyberpunk",
            [ArtStyle.FANTASY]: "fantasy art",
            [ArtStyle.THREED]: "3d model",
            [ArtStyle.PIXEL]: "pixel art",
            [ArtStyle.SUPERMAN_COMIC]: "American Superman comic book art",
            [ArtStyle.SPONGEBOB]: "SpongeBob SquarePants cartoon style",
            [ArtStyle.GHIBLI]: "Ghibli anime film style",
            [ArtStyle.ONE_PIECE]: "One Piece anime style",
        };

        let styleInstruction: string;
        if (styleStrength <= 33) {
            styleInstruction = `Subtly blend the provided image(s) with the style of ${styleTextMap[style]}.`;
        } else if (styleStrength <= 66) {
            styleInstruction = `Redraw the provided image(s) with a clear influence from the style of ${styleTextMap[style]}.`;
        } else {
            styleInstruction = `Completely redraw the provided image(s) in the style of ${styleTextMap[style]}.`;
        }

        let finalPrompt = prompt.trim()
            ? `${styleInstruction} Also, incorporate this description: ${prompt}`
            : styleInstruction;
        
        if (negativePrompt.trim()) {
            finalPrompt += ` Avoid the following elements: ${negativePrompt.trim()}`;
        }

        try {
            const generatedImageUrl = await generateImage(finalPrompt, image1, mode === AppMode.MERGE ? image2 : null);
            setResultImage(generatedImageUrl);
            setHistory(prev => [generatedImageUrl, ...prev.slice(0, 8)]);
        } catch (e) {
            console.error(e);
            const errorMessage = (e as Error).message;
            const [errorKey, ...errorDetails] = errorMessage.split(':');
            
            if (errorKey === 'errorGenerationFailed') {
                setError(t(errorKey, { response: errorDetails.join(':') }));
            } else {
                setError(t(errorKey));
            }
        } finally {
            setIsLoading(false);
        }
    }, [prompt, negativePrompt, styleStrength, image1, image2, mode, t, style]);

    return (
        <div className="relative min-h-screen text-slate-200 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <Header />
                <main className="mt-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Control Panel */}
                        <div className="bg-blue-950/60 rounded-lg p-6 shadow-2xl border border-blue-800 backdrop-blur-sm">
                            <h2 className="text-xl font-semibold text-white mb-4">{t('configurationTitle')}</h2>
                            <ModeSelector selectedMode={mode} onModeChange={setMode} />
                            <StyleSelector selectedStyle={style} onStyleChange={setStyle} />

                             <div className="mt-6">
                                <label htmlFor="style-strength" className="block text-sm font-medium text-blue-200 mb-2">
                                    {t('styleStrengthLabel')} ({styleStrength}%)
                                </label>
                                <input
                                    id="style-strength"
                                    type="range"
                                    min="1"
                                    max="100"
                                    value={styleStrength}
                                    onChange={(e) => setStyleStrength(Number(e.target.value))}
                                    className="w-full h-2 bg-blue-900/80 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                                />
                            </div>
                            
                            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <ImageUploader id="image1" onImageSelect={handleImage1Select} imagePreviewUrl={image1Preview} title={t('sourceImage1')} />
                                <div className={`transition-opacity duration-500 ${mode === AppMode.MERGE ? 'opacity-100' : 'opacity-50 pointer-events-none'}`}>
                                    <ImageUploader id="image2" onImageSelect={handleImage2Select} imagePreviewUrl={image2Preview} title={t('sourceImage2')} disabled={mode === AppMode.EDIT} />
                                </div>
                            </div>

                            <div className="mt-6">
                                <label htmlFor="prompt" className="block text-sm font-medium text-blue-200 mb-2">
                                    {t('promptLabel')}
                                </label>
                                <textarea
                                    id="prompt"
                                    rows={3}
                                    className="w-full bg-blue-900/50 border border-blue-700 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 p-3 placeholder:text-blue-400 transition"
                                    placeholder={mode === AppMode.MERGE ? t('mergePromptPlaceholder') : t('editPromptPlaceholder')}
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                />
                            </div>
                            
                             <div className="mt-4">
                                <label htmlFor="negative-prompt" className="block text-sm font-medium text-blue-200 mb-2">
                                    {t('negativePromptLabel')}
                                </label>
                                <textarea
                                    id="negative-prompt"
                                    rows={2}
                                    className="w-full bg-blue-900/50 border border-blue-700 rounded-md shadow-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 text-slate-200 p-3 placeholder:text-blue-400 transition"
                                    placeholder={t('negativePromptPlaceholder')}
                                    value={negativePrompt}
                                    onChange={(e) => setNegativePrompt(e.target.value)}
                                />
                            </div>

                            {error && <div className="mt-4 text-red-300 bg-red-900/50 border border-red-700 rounded-md p-3 text-sm">{error}</div>}

                            <div className="mt-6">
                                <button
                                    onClick={handleSubmit}
                                    disabled={isLoading}
                                    className="w-full flex items-center justify-center gap-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-900/50 disabled:cursor-not-allowed text-white font-bold py-3 px-4 rounded-md transition-all duration-300 transform hover:scale-105 shadow-lg"
                                >
                                    {isLoading ? <><Spinner /> {t('generatingButton')}</> : <><SparklesIcon className="w-5 h-5" /> {t('generateButton')}</>}
                                </button>
                            </div>
                        </div>

                        {/* Result Panel */}
                        <div className="bg-blue-950/60 rounded-lg p-6 shadow-2xl border border-blue-800 backdrop-blur-sm flex items-center justify-center min-h-[400px] lg:min-h-0">
                            {isLoading ? (
                                <div className="text-center">
                                    <Spinner className="w-12 h-12" />
                                    <p className="mt-4 text-blue-300">{t('synthesizing')}</p>
                                </div>
                            ) : resultImage ? (
                                <div className="flex flex-col items-center justify-center w-full h-full gap-4">
                                    <img src={resultImage} alt="Generated result" className="rounded-lg max-w-full max-h-[80%] object-contain shadow-2xl" />
                                    <div className="flex flex-wrap items-center justify-center gap-3">
                                        <a
                                            href={resultImage}
                                            download={`ai-fusion-${Date.now()}.png`}
                                            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                                        >
                                            <DownloadIcon className="w-5 h-5" /> {t('downloadButton')}
                                        </a>
                                        <button
                                            onClick={handleUseAsSource}
                                            className="flex items-center gap-2 bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-300"
                                        >
                                            <ArrowPathIcon className="w-5 h-5" /> {t('useAsSourceButton')}
                                        </button>
                                    </div>
                                </div>

                            ) : (
                                <div className="text-center text-blue-400">
                                    <SparklesIcon className="w-16 h-16 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-blue-200">{t('resultTitle')}</h3>
                                    <p>{t('resultSubtitle')}</p>
                                </div>
                            )}
                        </div>
                    </div>
                    <HistoryPanel history={history} onSelect={setResultImage} />
                </main>
            </div>
        </div>
    );
};

export default App;