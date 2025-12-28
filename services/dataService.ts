
import { WORKSHOPS, RECORDED_CLASSES, PORTFOLIO, REVIEWS, STOCK_IMAGES } from '../constants';
import { ReviewCategory, FooterCategory } from '../types';

const STORAGE_KEY = 'CHEF_ANTON_CMS_DATA';
const DATA_VERSION = '4.0'; 

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

const DEFAULT_PARTNERS: Partner[] = [
  { id: 'p1', name: 'Padma Hotel', logo: '🏨' },
  { id: 'p2', name: 'Aryaduta', logo: '🏢' },
  { id: 'p3', name: 'Grand Royal Panghegar', logo: '🏛️' },
  { id: 'p4', name: 'eL Hotel', logo: '🏨' },
  { id: 'p5', name: 'Gulf Catering Company', logo: '🇸🇦' },
  { id: 'p6', name: 'NHI Bandung', logo: '🎓' },
];

const DEFAULT_DATA: CMSData = {
  version: DATA_VERSION,
  heroTitle: "Sistem Dapur Presisi. Profit Maksimal.",
  heroSubtitle: "Transformasi operasional FnB dengan standar kualitas bintang lima. Tingkatkan efisiensi COGS dan bangun sistem dapur yang mandiri serta menguntungkan.",
  heroCTA_Workshop_Title: "Live Workshop",
  heroCTA_Workshop_Desc: "Interaksi Langsung",
  heroCTA_Recorded_Title: "Kelas Rekaman",
  heroCTA_Recorded_Desc: "Akses Selamanya",
  heroCTA_Consultancy_Title: "Private Audit",
  heroCTA_Consultancy_Desc: "Konsultasi Eksklusif",
  heroImage: STOCK_IMAGES.CHEF_HERO,
  chefName: "Chef Anton Pradipta",
  chefTitle: "Executive Culinary Consultant & Academy",
  chefBio: "Sebagai koki profesional dengan pengalaman puluhan tahun, Chef Anton telah memimpin berbagai dapur prestisius dari Riyadh (Saudi Arabia) hingga hotel bintang 5 ternama di Indonesia.",
  chefBioQuote: "Satu hidangan legendaris tercipta dari seribu sistem yang dijalankan dengan disiplin emas.",
  chefProfileImage: STOCK_IMAGES.CHEF_MAIN,
  stockImages: STOCK_IMAGES,
  workshops: [...WORKSHOPS],
  recordedClasses: [...RECORDED_CLASSES],
  portfolio: [...PORTFOLIO],
  reviews: REVIEWS.map((r) => ({ 
    ...r, 
    category: r.category as ReviewCategory 
  })),
  partners: DEFAULT_PARTNERS,
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

export const getCMSData = (): CMSData => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.version !== DATA_VERSION) {
        localStorage.removeItem(STORAGE_KEY);
        return DEFAULT_DATA;
      }
      return parsed;
    } catch (e) {
      return DEFAULT_DATA;
    }
  }
  return DEFAULT_DATA;
};

export const saveCMSData = (data: CMSData) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...data, version: DATA_VERSION }));
};

export const resetToDefault = () => {
  localStorage.removeItem(STORAGE_KEY);
  window.location.reload();
};
