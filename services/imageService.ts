
/**
 * Ultra-Light Image Compression
 * - Resolusi Maks: 800px (Sangat Cepat)
 * - Kualitas: 0.5 JPEG (Sangat Aman untuk limit Vercel)
 * - Agresif Memory Cleanup (Revoke ObjectURL)
 * - Timeout: 8 detik
 */
const compressImage = async (file: File): Promise<{ base64: string, type: string }> => {
  // 1. Validasi awal: Jika file > 10MB langsung tolak sebelum diproses
  if (file.size > 10 * 1024 * 1024) throw new Error("File terlalu besar (Maks 10MB).");

  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    const cleanup = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      img.onload = null;
      img.onerror = null;
    };

    // Timeout 8 detik
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Proses macet (Timeout). Coba file lebih kecil."));
    }, 8000);

    img.src = objectUrl;
    img.onload = () => {
      clearTimeout(timer);
      const canvas = document.createElement('canvas');
      const MAX_WIDTH = 800; 
      let width = img.width;
      let height = img.height;

      if (width > MAX_WIDTH) {
        height = Math.round((MAX_WIDTH / width) * height);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;
      
      // Optimasi memori: alpha false untuk mematikan transparansi (lebih ringan)
      const ctx = canvas.getContext('2d', { alpha: false });
      
      if (!ctx) { 
        cleanup(); 
        return reject(new Error("Gagal menginisialisasi sistem gambar (Canvas Fail)")); 
      }
      
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'low'; // Prioritas kecepatan proses
      
      // Isi background putih (karena alpha false)
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, width, height);
      
      ctx.drawImage(img, 0, 0, width, height);

      // Kualitas 0.5 (Paling aman untuk batas 4.5MB Vercel)
      const dataUrl = canvas.toDataURL('image/jpeg', 0.5);
      cleanup();
      
      // Final size check
      const stringLength = dataUrl.length - 'data:image/jpeg;base64,'.length;
      const sizeInMb = (4 * Math.ceil(stringLength / 3) * 0.5624896334383812) / (1024 * 1024);

      if (sizeInMb > 4.2) {
        return reject(new Error("File terlalu besar bahkan setelah kompresi ekstrem."));
      }

      resolve({ base64: dataUrl, type: 'image/jpeg' });
    };

    img.onerror = () => { 
      clearTimeout(timer);
      cleanup(); 
      reject(new Error("Format gambar tidak didukung atau file korup.")); 
    };
  });
};

/**
 * Uploads an image via Serverless API Proxy to Vercel Blob with Global Compression.
 */
export const uploadImageToBlob = async (file: File | string, filename: string): Promise<string> => {
  try {
    let base64Content = "";
    let contentType = "image/jpeg";

    // 1. Handle Compression if it's a raw File from input
    if (file instanceof File) {
      const compressed = await compressImage(file);
      base64Content = compressed.base64;
      contentType = compressed.type;
    } 
    // 2. Handle Base64 strings (from AI generation etc)
    else if (typeof file === 'string' && file.startsWith('data:')) {
      base64Content = file;
      contentType = file.split(';')[0].split(':')[1];
      
      const stringLength = base64Content.length - `data:${contentType};base64,`.length;
      const sizeInMb = (4 * Math.ceil(stringLength / 3) * 0.5624896334383812) / (1024 * 1024);
      if (sizeInMb > 4.5) throw new Error("File terlalu besar (Maksimal 4.5MB).");
    } 
    // 3. If it's already a URL, return it
    else if (typeof file === 'string' && file.startsWith('http')) {
      return file;
    } else {
      throw new Error("Format file tidak valid untuk diunggah");
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
      throw new Error(errData.message || 'Gagal mengirim data ke server.');
    }

    const data = await response.json();
    return data.url;
  } catch (error: any) {
    console.error("Blob Upload Error:", error);
    throw error;
  }
};

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
