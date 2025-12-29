
/**
 * Uploads an image via Serverless API Proxy to Vercel Blob.
 */
export const uploadImageToBlob = async (file: File | string, filename: string): Promise<string> => {
  try {
    let base64Content = "";
    let contentType = "image/jpeg";

    if (typeof file === 'string' && file.startsWith('data:')) {
      base64Content = file;
      contentType = file.split(';')[0].split(':')[1];
    } else if (file instanceof File) {
      const reader = new FileReader();
      base64Content = await new Promise((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      contentType = file.type;
    } else {
      // Jika sudah berupa URL (bukan base64), kembalikan langsung
      if (typeof file === 'string' && file.startsWith('http')) return file;
      throw new Error("Invalid file format for upload");
    }

    const response = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        filename,
        contentType,
        content: base64Content
      })
    });

    if (!response.ok) {
      const errData = await response.json().catch(() => ({}));
      throw new Error(errData.message || 'Upload failed via Proxy');
    }

    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error("Blob Upload Proxy Error:", error);
    // JANGAN mengembalikan base64 string jika gagal, karena akan membuat JSON CMS terlalu besar
    // Lemparkan error agar UI bisa menangani atau user tahu ada masalah koneksi
    throw error;
  }
};

// ... other generation functions remain the same but will now use the updated uploadImageToBlob
import { GoogleGenAI } from "@google/genai";

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function callWithRetry<T>(fn: () => Promise<T>, retries = 2, delay = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const isRateLimit = error?.message?.includes('429') || error?.status === 429;
    if (retries > 0 && isRateLimit) {
      await sleep(delay);
      return callWithRetry(fn, retries - 1, delay * 2);
    }
    throw error;
  }
}

export const generateChefImage = async (context: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const basePrompt = `PHOTOREALISTIC 8K. Close-up portrait of professional Indonesian male Executive Chef, charismatic. Pristine white chef jacket, orange batik patterns. Tall white hat. ${context}. Luxury hotel kitchen bokeh background.`;
    
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: basePrompt }] },
      config: { imageConfig: { aspectRatio: "3:4" } },
    });

    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData?.data) {
      const base64 = `data:image/png;base64,${part.inlineData.data}`;
      return await uploadImageToBlob(base64, 'generated-chef.png');
    }
    throw new Error("No image data");
  }).catch(() => "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=1000");
};

export const generatePortfolioImage = async (prompt: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `High-end culinary photography. Scene: ${prompt}` }] },
      config: { imageConfig: { aspectRatio: "1:1" } },
    });
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData?.data) {
      return await uploadImageToBlob(`data:image/png;base64,${part.inlineData.data}`, 'portfolio.png');
    }
    throw new Error("Failed");
  }).catch(() => `https://picsum.photos/seed/chef/800/800`);
};

export const generateWorkshopPoster = async (title: string): Promise<string> => {
  return callWithRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: `Professional workshop poster for ${title}` }] },
      config: { imageConfig: { aspectRatio: "3:4" } },
    });
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (part?.inlineData?.data) {
      return await uploadImageToBlob(`data:image/png;base64,${part.inlineData.data}`, 'workshop.png');
    }
    throw new Error("Failed");
  }).catch(() => "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800");
};
