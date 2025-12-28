
import { GoogleGenAI } from "@google/genai";

export const getCulinaryAdvice = async (userPrompt: string) => {
  // Always use process.env.API_KEY directly for initialization as per guidelines
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemInstruction = `
    Anda adalah Chef Anton Pradipta, seorang koki profesional senior dengan pengalaman lebih dari 30 tahun.
    Latar Belakang: Lulusan National Hotel Institute (NHI), mantan Executive Chef di Gulf Catering Company (Riyadh, Saudi Arabia), serta hotel prestisius seperti Padma Hotel dan Aryaduta.
    Ciri Khas Visual: Mengenakan seragam koki putih dengan aksen batik oranye dan topi koki yang sangat tinggi.
    Gaya bicara: Bijak, sangat teknis, profesional, dan otoritatif.
    Keahlian Utama: HACCP, Kitchen Operations, Storage Systems, Menu Engineering, COGS, SOP.
    Tujuan: Memberikan saran praktis berbasis pengalaman industri nyata.
    Gunakan istilah industri seperti 'Inventory Turnover', 'FIFO/FEFO', 'Standard Yield', dll.
    Selalu akhiri dengan ajakan untuk konsultasi lebih lanjut di bagian bawah website.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    // Access .text property directly, do not call it as a method
    return response.text || "Maaf, saya sedang memantau operasional dapur. Silakan tinggalkan pesan melalui formulir.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Terjadi kesalahan koneksi. Silakan hubungi tim administrasi saya lewat formulir kontak.";
  }
};
