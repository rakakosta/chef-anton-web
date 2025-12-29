
import { WORKSHOPS, RECORDED_CLASSES, PORTFOLIO, REVIEWS, STOCK_IMAGES, ACTUAL_CHEF_PHOTO } from '../constants';
import { ReviewCategory, FooterCategory } from '../types';

const DATA_VERSION = '7.0'; 

export interface Partner {
  id: string;
  name: string;
  logo: string; 
}

export interface CMSData {
  version?: string;
  heroTitle: string;
  heroSubtitle: string;
  heroCTA_Workshop_Title: string;
  heroCTA_Workshop_Desc: string;
  heroCTA_Recorded_Title: string;
  heroCTA_Recorded_Desc: string;
  heroCTA_Consultancy_Title: string;
  heroCTA_Consultancy_Desc: string;
  heroImage: string;
  chefName: string;
  chefTitle: string;
  chefBio: string;
  chefBioQuote: string;
  chefProfileImage: string;
  workshops: typeof WORKSHOPS;
  recordedClasses: typeof RECORDED_CLASSES;
  portfolio: typeof PORTFOLIO;
  reviews: (typeof REVIEWS[0] & { category: ReviewCategory })[];
  partners: Partner[];
  stockImages: typeof STOCK_IMAGES;
  footerEducation: FooterCategory;
  footerB2B: FooterCategory;
}

export const DEFAULT_DATA: CMSData = {
  version: DATA_VERSION,
  heroTitle: "Sistem Dapur Presisi. Profit Maksimal.",
  heroSubtitle: "Transformasi operasional FnB dengan standar kualitas bintang lima. Tingkatkan efisiensi COGS dan bangun sistem dapur yang mandiri serta menguntungkan.",
  heroCTA_Workshop_Title: "Live Workshop",
  heroCTA_Workshop_Desc: "Interaksi Langsung",
  heroCTA_Recorded_Title: "Kelas Rekaman",
  heroCTA_Recorded_Desc: "Akses Selamanya",
  heroCTA_Consultancy_Title: "Private Audit",
  heroCTA_Consultancy_Desc: "Konsultasi Eksklusif",
  heroImage: ACTUAL_CHEF_PHOTO,
  chefName: "Chef Anton Pradipta",
  chefTitle: "Executive Culinary Consultant & Academy",
  chefBio: "Sebagai koki profesional dengan pengalaman puluhan tahun, Chef Anton telah memimpin berbagai dapur prestisius dari Riyadh (Saudi Arabia) hingga hotel bintang 5 ternama di Indonesia.",
  chefBioQuote: "Satu hidangan legendaris tercipta dari seribu sistem yang dijalankan dengan disiplin emas.",
  chefProfileImage: ACTUAL_CHEF_PHOTO,
  stockImages: STOCK_IMAGES,
  workshops: [...WORKSHOPS],
  recordedClasses: [...RECORDED_CLASSES],
  portfolio: [...PORTFOLIO],
  reviews: REVIEWS.map((r) => ({ 
    ...r, 
    category: r.category as ReviewCategory 
  })),
  partners: [
    { id: 'p1', name: 'Padma Hotel', logo: '🏨' },
    { id: 'p2', name: 'Aryaduta', logo: '🏢' },
    { id: 'p3', name: 'Grand Royal Panghegar', logo: '🏛️' },
    { id: 'p4', name: 'eL Hotel', logo: '🏨' },
    { id: 'p5', name: 'Gulf Catering Company', logo: '🇸🇦' },
    { id: 'p6', name: 'NHI Bandung', logo: '🎓' },
  ],
  footerEducation: {
    title: "Pendidikan",
    links: [
      { id: 'f1', label: 'Live Workshop', url: '#live-workshops' },
      { id: 'f2', label: 'Masterclass Rekaman', url: '#recorded-classes' },
      { id: 'f3', label: 'Bundel SOP Digital', url: '#recorded-classes' },
      { id: 'f4', label: 'Alumni Stories', url: '#portfolio' }
    ]
  },
  footerB2B: {
    title: "Layanan B2B",
    links: [
      { id: 'fb1', label: 'Audit Operasional', url: '#consultancy' },
      { id: 'fb2', label: 'Analisis Food Cost', url: '#consultancy' },
      { id: 'fb3', label: 'In-House Training', url: '#consultancy' },
      { id: 'fb4', label: 'Kontak Bisnis', url: '#consultancy' }
    ]
  }
};

/**
 * Fetches CMS configuration via Serverless API Proxy.
 */
export const getCMSData = async (): Promise<CMSData> => {
  try {
    console.log("[CMS] Fetching data via API Proxy...");
    const response = await fetch('/api/cms');
    
    if (response.ok) {
      const data = await response.json();
      if (data) {
        console.log("[CMS] Data retrieved from server successfully.");
        return data;
      }
    } else {
      console.warn("[CMS] Server returned error, using local fallback.");
    }
  } catch (err) {
    console.error("[CMS] API Connection failed:", err);
  }
  
  return DEFAULT_DATA;
};

/**
 * Saves CMS configuration via Serverless API Proxy.
 */
export const saveCMSData = async (data: CMSData) => {
  console.log("[CMS] Publishing changes via API Proxy...");
  
  try {
    const response = await fetch('/api/cms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, version: DATA_VERSION })
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch (e) {
        errorData = { error: 'Unknown server error', message: errorText };
      }
      
      console.error("[CMS] Publish failed:", errorData);
      throw new Error(errorData.message || errorData.error || 'Failed to save data');
    }
    
    console.log("[CMS] Changes persisted to Postgres successfully.");
  } catch (error: any) {
    console.error("[CMS] Error in saveCMSData:", error);
    throw error;
  }
};

/**
 * Resets the application data.
 */
export const resetToDefault = async () => {
  try {
    await fetch('/api/cms', { method: 'DELETE' });
    window.location.reload();
  } catch (err) {
    console.error("[DB] Reset failed:", err);
  }
};
