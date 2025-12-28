
export enum ClassType {
  LIVE = 'LIVE WORKSHOP',
  RECORDED = 'MASTERCLASS RECORDED'
}

export type ReviewCategory = 'Live Workshop' | 'Kelas Rekaman' | 'Private Consultancy';

export interface CulinaryClass {
  id: string;
  title: string;
  description: string;
  price: number;
  priceBeforeDiscount?: number;
  image: string;
  type: ClassType;
  duration: string;
  level: 'Beginner' | 'Professional' | 'Executive';
  date?: string; 
  displayDate?: string; 
  location?: string; 
  curriculum?: string[];
  slots?: number;
  soldCount?: number; 
  realAttendance?: number; 
  isHistorical?: boolean; 
}

export interface FooterLink {
  id: string;
  label: string;
  url: string;
}

export interface FooterCategory {
  title: string;
  links: FooterLink[];
}

export interface PastWorkshop {
  id: string;
  title: string;
  date: string;
  location: string;
  participants: number;
  image: string;
}

export interface ParticipantReview {
  id: string;
  name: string;
  batch: string;
  comment: string;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  image: string;
  aiPrompt: string;
}

export interface Review {
  id: string;
  name: string;
  role: string;
  comment: string;
  avatar: string;
  category: ReviewCategory;
}

export interface NavItem {
  label: string;
  href: string;
}
