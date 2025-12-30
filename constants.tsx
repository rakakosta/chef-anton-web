
import { CulinaryClass, ClassType, PortfolioItem, Review, NavItem, PastWorkshop, ParticipantReview } from './types';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '#home' },
  { label: 'Live Workshop', href: '#live-workshops' },
  { label: 'Kelas Rekaman', href: '#recorded-classes' },
  { label: 'Private Konsultasi', href: '#consultancy' },
];

export const WHATSAPP_NUMBER = "6281802049331";

export const STOCK_IMAGES = {
  CHEF_MAIN: "https://images.unsplash.com/photo-1556911261-6bd741557938?q=80&w=1200&auto=format&fit=crop",
  CHEF_HERO: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?q=80&w=1000&auto=format&fit=crop",
  WORKSHOP_POSTER: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1000&auto=format&fit=crop",
  CERTIFICATE: "https://images.unsplash.com/photo-1589330694653-ded6df03f754?q=80&w=1000&auto=format&fit=crop",
};

// Added missing constant for Chef's actual photo to be used as default
export const ACTUAL_CHEF_PHOTO = STOCK_IMAGES.CHEF_HERO;

export const REVIEWS: Review[] = [
  {
    id: 'r1',
    name: 'Budi Santoso',
    role: 'Owner, Restoran Nusantara Jaya',
    comment: 'Audit kitchen dari Chef Anton menyelamatkan bisnis kami. COGS kami turun 12% tanpa mengurangi kualitas rasa.',
    avatar: 'https://i.pravatar.cc/150?u=budi',
    category: 'Private Consultancy'
  },
  {
    id: 'r2',
    name: 'Chef Devi',
    role: 'Executive Sous Chef, Hotel Bintang 5',
    comment: 'Workshop SOP Mastery beliau sangat aplikatif. Tim saya sekarang punya standar yang jelas.',
    avatar: 'https://i.pravatar.cc/150?u=devi',
    category: 'Live Workshop'
  },
  {
    id: 'r3',
    name: 'Rendi Wijaya',
    role: 'Food & Beverage Manager',
    comment: 'Materi Profit Engineering benar-benar membuka mata. Sangat direkomendasikan untuk pemilik bisnis FnB.',
    avatar: 'https://i.pravatar.cc/150?u=rendi',
    category: 'Live Workshop'
  }
];

export const WORKSHOPS: CulinaryClass[] = [
  {
    id: 'ws-active-elite',
    title: 'Elite Kitchen System & SOP Mastery 2026',
    description: 'Masterclass eksklusif untuk mentransformasi operasional dapur Anda menjadi mesin profit yang presisi dengan standar hotel bintang lima global.',
    price: 1850000,
    priceBeforeDiscount: 3500000,
    location: 'Bandung / Zoom Live Session',
    image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=100&w=1200&auto=format&fit=crop',
    type: ClassType.LIVE,
    duration: '6 Jam Intensif (Full Day)',
    level: 'Professional',
    date: '2026-05-20T09:00',
    displayDate: '20 Mei 2026, 09:00 WIB',
    slots: 8,
    curriculum: [
      "Fundamental Gold Standard SOP",
      "Kitchen Workflow & Station Optimization",
      "Precision Cost Control (COGS) Mastery",
      "Inventory Management & Waste Reduction",
      "Standardization for Scalability"
    ],
    isHistorical: false
  },
  {
    id: 'ws-past-2024-oct',
    title: 'Precision COGS & Profit Engineering',
    description: 'Bedah tuntas strategi penentuan harga jual dan optimasi margin keuntungan untuk bisnis mandiri.',
    price: 1250000,
    priceBeforeDiscount: 2500000,
    location: 'Jakarta Session',
    image: 'https://images.unsplash.com/photo-1554224155-1696413565d3?q=80&w=800&auto=format&fit=crop',
    type: ClassType.LIVE,
    duration: '5 Jam',
    level: 'Executive',
    date: '2024-10-20T10:00',
    displayDate: '20 Oktober 2024',
    realAttendance: 85,
    isHistorical: true
  }
];

export const PAST_WORKSHOPS: PastWorkshop[] = []; 
export const PARTICIPANT_REVIEWS: ParticipantReview[] = [];

export const RECORDED_CLASSES: CulinaryClass[] = [
  {
    id: 'rc1',
    title: 'Basic HACCP & Food Safety',
    description: 'Panduan fundamental keamanan pangan untuk dapur komersial skala besar.',
    price: 450000,
    image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800&auto=format&fit=crop',
    type: ClassType.RECORDED,
    duration: '10 Modul Video',
    level: 'Beginner',
    soldCount: 1240
  }
];

export const PORTFOLIO: PortfolioItem[] = [
  { id: 'p1', title: 'Executive Operations - Riyadh', category: 'International', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800', aiPrompt: '' }
];
