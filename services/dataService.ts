
import { createPool, Pool } from '@vercel/postgres';
import { WORKSHOPS, RECORDED_CLASSES, PORTFOLIO, REVIEWS, STOCK_IMAGES, ACTUAL_CHEF_PHOTO } from '../constants';
import { ReviewCategory, FooterCategory } from '../types';

const DATA_VERSION = '7.0'; 

// Mendapatkan connection string dari berbagai kemungkinan variabel Vercel/Vite
const getConnectionString = () => {
  return (
    process.env.POSTGRES_URL || 
    process.env.VITE_POSTGRES_URL || 
    process.env.STORAGE_URL || 
    process.env.VITE_STORAGE_URL ||
    ""
  );
};

const connectionString = getConnectionString();

/**
 * Initialize Postgres Pool. 
 * We use a lazy initialization or a safe check to prevent crashing if the string is missing.
 */
let pool: any = null;

try {
  if (connectionString) {
    console.log("[DB] Connection string found. Initializing pool...");
    pool = createPool({
      connectionString: connectionString
    });
  } else {
    console.warn("[DB] No connection string found (POSTGRES_URL is missing). Database features will be disabled.");
  }
} catch (e) {
  console.error("[DB] Failed to create pool:", e);
}

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
 * Ensures the database table exists for CMS data.
 */
async function initDatabase() {
  if (!pool) return;
  console.log("[DB] Checking table schema...");
  try {
    await pool.sql`
      CREATE TABLE IF NOT EXISTS chef_branding_cms (
        id SERIAL PRIMARY KEY,
        config JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `;
    console.log("[DB] Schema check completed.");
  } catch (err) {
    console.error("[DB] Table initialization failed:", err);
    throw err;
  }
}

/**
 * Fetches the latest CMS configuration from Vercel Postgres.
 */
export const getCMSData = async (): Promise<CMSData> => {
  try {
    if (!pool) {
      console.log("[CMS] No database pool available. Using fallback data.");
      return DEFAULT_DATA;
    }

    console.log("[CMS] Fetching from Vercel Postgres (using POSTGRES_URL)...");
    await initDatabase();
    
    const { rows } = await pool.sql`SELECT config FROM chef_branding_cms ORDER BY id DESC LIMIT 1;`;
    
    if (rows && rows.length > 0) {
      const data = rows[0].config as CMSData;
      console.log("[CMS] Data retrieved successfully.");
      return data;
    } else {
      console.log("[CMS] Database is currently empty.");
    }
  } catch (err) {
    console.error("[CMS] Database connection or query error:", err);
    // Explicit check for common Vercel error
    if (err instanceof Error && err.message.includes('missing_connection_string')) {
      console.error("[CMS] CRITICAL: POSTGRES_URL is not being passed correctly to the client.");
    }
  }
  
  console.log("[CMS] Falling back to default constants.");
  return DEFAULT_DATA;
};

/**
 * Saves CMS configuration to Vercel Postgres.
 */
export const saveCMSData = async (data: CMSData) => {
  if (!pool) {
    throw new Error("Database not connected. Cannot save changes.");
  }
  
  console.log("[CMS] Persisting changes to Postgres...");
  try {
    const jsonConfig = JSON.stringify({ ...data, version: DATA_VERSION });
    await pool.sql`
      INSERT INTO chef_branding_cms (config)
      VALUES (${jsonConfig});
    `;
    console.log("[CMS] Changes published successfully.");
  } catch (err) {
    console.error("[CMS] Save failed:", err);
    throw err;
  }
};

/**
 * Resets the application data by clearing the database table.
 */
export const resetToDefault = async () => {
  if (!pool) return;
  try {
    console.log("[DB] Executing reset...");
    await pool.sql`DELETE FROM chef_branding_cms;`;
    window.location.reload();
  } catch (err) {
    console.error("[DB] Reset failed:", err);
  }
};
