import React, { createContext, useState, useContext, ReactNode, useMemo } from 'react';
import { Language, Translations } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, replacements?: Record<string, string>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Translations> = {
    en: {
      "appTitle": "AI Image Fusion & Transformation",
      "appSubtitle": "AI-Powered Image Synthesis: Merge, Edit & Transform Your Photos",
      "configurationTitle": "Configuration",
      "modeLabel": "Mode",
      "mergeMode": "Merge Two Images",
      "editMode": "Edit One Image",
      "sourceImage1": "Source Image 1",
      "sourceImage2": "Source Image 2",
      "promptLabel": "Prompt",
      "negativePromptLabel": "Negative Prompt (What to avoid)",
      "negativePromptPlaceholder": "e.g., blurry, text, watermark, ugly",
      "styleLabel": "Artistic Style",
      "styleStrengthLabel": "Style Strength",
      "stylePhotorealistic": "Photorealistic",
      "styleAnime": "Anime",
      "styleWatercolor": "Watercolor",
      "styleCyberpunk": "Cyberpunk",
      "styleFantasy": "Fantasy Art",
      "style3D": "3D Model",
      "stylePixel": "Pixel Art",
      "styleSupermanComic": "Superman Comic",
      "styleSpongebob": "SpongeBob Style",
      "styleGhibli": "Ghibli Style",
      "styleOnePiece": "One Piece Style",
      "mergePromptPlaceholder": "e.g., A fantasy landscape combining the mountains from image 1 and the river from image 2.",
      "editPromptPlaceholder": "e.g., Add a futuristic city skyline in the background.",
      "generateButton": "Generate Image",
      "generatingButton": "Generating...",
      "resultTitle": "Your masterpiece awaits",
      "resultSubtitle": "The generated image will appear here.",
      "synthesizing": "Synthesizing your vision...",
      "historyTitle": "Generation History",
      "historyEmptyState": "Your creations will appear here.",
      "downloadButton": "Download",
      "useAsSourceButton": "Use as Source",
      "errorAllInputs": "Please provide all required inputs for the selected mode.",
      // FIX: Updated error message to be more generic and not expose implementation details.
      "errorApiKey": "API key is not configured. Please contact the administrator.",
      "errorGenerationFailed": "Image generation failed. Model response: {response}",
      "errorNoImageGenerated": "No image was generated. The model may have refused the prompt without a text reason.",
      "uploadAction": "Click to upload",
      "removeImageAriaLabel": "Remove image"
    },
    zh: {
      "appTitle": "AI圖片融合改造",
      "appSubtitle": "AI 圖像合成：融合、編輯與改造您的相片",
      "configurationTitle": "設定",
      "modeLabel": "模式",
      "mergeMode": "合併兩張圖片",
      "editMode": "編輯單張圖片",
      "sourceImage1": "來源圖片 1",
      "sourceImage2": "來源圖片 2",
      "promptLabel": "提示詞",
      "negativePromptLabel": "負面提示詞 (避免出現的內容)",
      "negativePromptPlaceholder": "例如：模糊、文字、浮水印、醜陋",
      "styleLabel": "藝術風格",
      "styleStrengthLabel": "風格強度",
      "stylePhotorealistic": "照片級真實",
      "styleAnime": "動漫",
      "styleWatercolor": "水彩",
      "styleCyberpunk": "賽博龐克",
      "styleFantasy": "奇幻藝術",
      "style3D": "3D 模型",
      "stylePixel": "像素藝術",
      "styleSupermanComic": "美國超人藝術",
      "styleSpongebob": "海綿寶寶風格",
      "styleGhibli": "吉卜力風格",
      "styleOnePiece": "日本動漫海賊王風格",
      "mergePromptPlaceholder": "例如：一個結合了圖片1的山脈和圖片2的河流的奇幻景觀。",
      "editPromptPlaceholder": "例如：在背景中新增一個未來的城市天際線。",
      "generateButton": "生成圖片",
      "generatingButton": "生成中...",
      "resultTitle": "您的傑作即將呈現",
      "resultSubtitle": "生成的圖片將會顯示在此處。",
      "synthesizing": "正在合成您的構想...",
      "historyTitle": "生成歷史紀錄",
      "historyEmptyState": "您的創作將會顯示在這裡。",
      "downloadButton": "下載",
      "useAsSourceButton": "作為來源圖片",
      "errorAllInputs": "請為所選模式提供所有必要的輸入。",
      // FIX: Updated error message to be more generic and not expose implementation details.
      "errorApiKey": "API 金鑰未設定。請聯絡管理員。",
      "errorGenerationFailed": "圖片生成失敗。模型回應：{response}",
      "errorNoImageGenerated": "未能生成圖片。模型可能因提示詞原因拒絕了請求，且未提供文字說明。",
      "uploadAction": "點擊上傳",
      "removeImageAriaLabel": "移除圖片"
    },
    ja: {
      "appTitle": "AI画像 融合・改造",
      "appSubtitle": "AI画像合成：写真のマージ、編集、改造",
      "configurationTitle": "設定",
      "modeLabel": "モード",
      "mergeMode": "2枚の画像をマージ",
      "editMode": "1枚の画像を編集",
      "sourceImage1": "ソース画像 1",
      "sourceImage2": "ソース画像 2",
      "promptLabel": "プロンプト",
      "negativePromptLabel": "ネガティブプロンプト（除外したいもの）",
      "negativePromptPlaceholder": "例：ぼやけ、テキスト、透かし、醜い",
      "styleLabel": "アートスタイル",
      "styleStrengthLabel": "スタイルの強さ",
      "stylePhotorealistic": "写実的",
      "styleAnime": "アニメ",
      "styleWatercolor": "水彩画",
      "styleCyberpunk": "サイバーパンク",
      "styleFantasy": "ファンタジーアート",
      "style3D": "3Dモデル",
      "stylePixel": "ピクセルアート",
      "styleSupermanComic": "スーパーマンコミック風",
      "styleSpongebob": "スポンジ・ボブ風",
      "styleGhibli": "ジブリ風",
      "styleOnePiece": "ワンピース風",
      "mergePromptPlaceholder": "例：画像1の山と画像2の川を組み合わせたファンタジー風景。",
      "editPromptPlaceholder": "例：背景に未来的な都市のスカイラインを追加する。",
      "generateButton": "画像を生成",
      "generatingButton": "生成中...",
      "resultTitle": "あなたの傑作が待っています",
      "resultSubtitle": "生成された画像はここに表示されます。",
      "synthesizing": "あなたのビジョンを合成中...",
      "historyTitle": "生成履歴",
      "historyEmptyState": "あなたの作品はここに表示されます。",
      "downloadButton": "ダウンロード",
      "useAsSourceButton": "ソース画像として使用",
      "errorAllInputs": "選択したモードに必要なすべての入力を提供してください。",
      // FIX: Updated error message to be more generic and not expose implementation details.
      "errorApiKey": "APIキーが設定されていません。管理者に連絡してください。",
      "errorGenerationFailed": "画像生成に失敗しました。モデルの応答：{response}",
      "errorNoImageGenerated": "画像は生成されませんでした。モデルがプロンプトを拒否した可能性があります。",
      "uploadAction": "クリックしてアップロード",
      "removeImageAriaLabel": "画像を削除"
    }
};

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh');

  const t = useMemo(() => (key: string, replacements?: Record<string, string>): string => {
    const langDict = translations[language];
    if (!langDict) return key;

    let translation = langDict[key] || key;
    if (replacements) {
        Object.keys(replacements).forEach(placeholder => {
            translation = translation.replace(`{${placeholder}}`, replacements[placeholder]);
        });
    }
    return translation;
  }, [language]);

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