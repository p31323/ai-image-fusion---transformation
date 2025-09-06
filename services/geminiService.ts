
const fileToBase64 = async (file: File): Promise<{ data: string; mimeType: string; }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
        if (typeof reader.result === 'string') {
            resolve({
                data: reader.result.split(',')[1],
                mimeType: file.type
            });
        } else {
            reject(new Error("Failed to read file as data URL."));
        }
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateImage = async (
    prompt: string,
    image1: File,
    image2?: File | null
): Promise<string> => {
    
    // The Gemini API call is now proxied through our serverless function
    // to protect the API key.
    
    const image1Payload = await fileToBase64(image1);
    const image2Payload = image2 ? await fileToBase64(image2) : null;
    
    const body = JSON.stringify({
        prompt,
        image1: image1Payload,
        image2: image2Payload,
    });

    const response = await fetch('/.netlify/functions/generate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: body,
    });

    const result = await response.json();

    if (!response.ok) {
        if (result.error === "API_KEY_MISSING") {
            throw new Error('errorApiKey');
        }
        if (result.error && result.error.startsWith('Image generation failed')) {
            const modelResponse = result.error.split(':').slice(1).join(':').trim();
            throw new Error(`errorGenerationFailed:${modelResponse || 'Unknown model error'}`);
        }
        if (result.error === 'No image was generated.') {
            throw new Error('errorNoImageGenerated');
        }
        throw new Error(result.error || 'An unknown error occurred on the server.');
    }
    
    if (result.data) {
        return result.data;
    }

    throw new Error("errorNoImageGenerated");
};