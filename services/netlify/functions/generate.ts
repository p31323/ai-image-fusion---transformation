
import { GoogleGenAI, Modality, Part } from "@google/genai";
import type { Handler } from "@netlify/functions";

const handler: Handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API_KEY_MISSING" }),
    };
  }

  try {
    const { prompt, image1, image2 } = JSON.parse(event.body || "{}");

    if (!prompt || !image1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Missing required fields: prompt and image1." }),
      };
    }
    
    const ai = new GoogleGenAI({ apiKey });

    const parts: Part[] = [];

    parts.push({
      inlineData: {
        data: image1.data,
        mimeType: image1.mimeType,
      },
    });

    if (image2) {
      parts.push({
        inlineData: {
          data: image2.data,
          mimeType: image2.mimeType,
        },
      });
    }

    parts.push({ text: prompt });

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts },
      config: {
        responseModalities: [Modality.IMAGE, Modality.TEXT],
      },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData && part.inlineData.data) {
        return {
          statusCode: 200,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            data: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`,
          }),
        };
      }
    }
    
    const textResponse = response.text;
    if (textResponse) {
        return {
            statusCode: 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: `Image generation failed. Model response: ${textResponse}` }),
        };
    }

    return {
        statusCode: 500,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ error: "No image was generated." }),
    };

  } catch (e) {
    console.error(e);
    const error = e as Error;
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

export { handler };
