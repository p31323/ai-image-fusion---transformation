import { GoogleGenAI, Modality, Part } from "@google/genai";

const fileToGenerativePart = async (file: File): Promise<Part> => {
  const base64EncodedDataPromise = new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve(reader.result.split(',')[1]);
        } else {
            resolve('');
        }
    };
    reader.readAsDataURL(file);
  });
  
  return {
    inlineData: {
      data: await base64EncodedDataPromise,
      mimeType: file.type,
    },
  };
};

export const generateImage = async (
    prompt: string,
    image1: File,
    image2?: File | null
): Promise<string> => {
    // FIX: The API key must be obtained from process.env.API_KEY as per the guidelines, which also resolves the TypeScript error with import.meta.env.
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
        // This error key matches the one in LanguageContext to show a user-friendly message.
        throw new Error('errorApiKey');
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const parts: Part[] = [];

    const imagePart1 = await fileToGenerativePart(image1);
    parts.push(imagePart1);

    if (image2) {
        const imagePart2 = await fileToGenerativePart(image2);
        parts.push(imagePart2);
    }
    
    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image-preview',
        contents: {
            parts: parts,
        },
        config: {
            responseModalities: [Modality.IMAGE, Modality.TEXT],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData && part.inlineData.data) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    const textResponse = response.text;
    if (textResponse) {
        throw new Error(`errorGenerationFailed:${textResponse}`);
    }

    throw new Error("errorNoImageGenerated");
};