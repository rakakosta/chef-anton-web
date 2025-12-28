
import { GoogleGenAI } from "@google/genai";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429 || error?.message?.includes('RESOURCE_EXHAUSTED');
    if (retries > 0 && isRateLimit) {
      console.warn(`Rate limit hit, retrying in ${delay}ms...`);
      await sleep(delay);
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateChefImage = async (context: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const basePrompt = `
      PHOTOREALISTIC 8K. Close-up portrait of a professional Indonesian male Executive Chef, 
      middle-aged, charismatic and professional friendly smile. 
      UNIFORM: Pristine white professional chef jacket with distinctive orange batik patterns on the collar and cuffs. 
      HAT: Wearing a very tall, stiff, white professional chef hat (toque blanche). 
      SETTING: ${context}. 
      LIGHTING: Cinematic golden hour lighting, luxury hotel kitchen bokeh background. 
      Sharp focus, highly detailed skin texture, professional culinary photography style.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: basePrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data found in response");
  }).catch(error => {
    console.warn("Chef image generation failed after retries, using fallback.", error);
    return "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=1000&auto=format&fit=crop";
  });
};

export const generatePortfolioImage = async (prompt: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const basePrompt = `
      High-end culinary photography. Professional Indonesian Executive Chef 
      in white uniform with orange batik collar and tall white hat. 
      SCENE: ${prompt}. 
      STYLE: Luxury, cinematic, 8k resolution, realistic textures, bokeh background.
    `;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: basePrompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        },
      },
    });

    const candidate = response.candidates?.[0];
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.data) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("No image data found in response");
  }).catch(error => {
    return `https://picsum.photos/seed/${encodeURIComponent(prompt)}/800/800`;
  });
};

export const generateWorkshopPoster = async (title: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `Professional high-end culinary workshop poster for "${title}". 
    Visual: A modern kitchen scene, close up of a chef's hands plating a beautiful dish. 
    Layout: Clean, minimalist, premium aesthetic. Deep slate and gold color scheme. 
    Portrait 3:4 aspect ratio. No text on the image itself, just the visual atmosphere of a high-end masterclass.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "3:4" } },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Failed");
  }).catch(() => "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800");
};

export const generateCertificatePreview = async (): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `A premium, elegant culinary achievement certificate. 
    Design: Gold foil border, cream paper texture, professional typography. 
    Signature of Chef Anton Pradipta at the bottom. 
    Official stamp of "The Gold Standard Culinary Academy". 
    Close up, clean lighting.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: { imageConfig: { aspectRatio: "4:3" } },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) return `data:image/png;base64,${part.inlineData.data}`;
    }
    throw new Error("Failed");
  }).catch(() => "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=600");
};
