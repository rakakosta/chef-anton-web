
import React from 'react';
import { CMSData } from '../services/dataService';

interface HeroProps {
  cmsData: CMSData;
  onWorkshopClick?: () => void;
  onRecordedClick?: () => void;
  onConsultancyClick?: () => void;
}

const Hero: React.FC<HeroProps> = ({ cmsData, onWorkshopClick, onRecordedClick, onConsultancyClick }) => {
  const serviceCards = [
    {
      title: cmsData.heroCTA_Workshop_Title || 'Live Workshop',
      desc: cmsData.heroCTA_Workshop_Desc || 'Interaksi Langsung',
      href: '#live-workshops',
      bg: 'bg-red-600',
      isWorkshop: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )
    },
    {
      title: cmsData.heroCTA_Recorded_Title || 'Kelas Rekaman',
      desc: cmsData.heroCTA_Recorded_Desc || 'Akses Selamanya',
      href: '#recorded-classes',
      bg: 'bg-gold',
      isRecorded: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: cmsData.heroCTA_Consultancy_Title || 'Private Audit',
      desc: cmsData.heroCTA_Consultancy_Desc || 'Konsultasi Eksklusif',
      href: '#consultancy',
      bg: 'bg-slate-900',
      isConsultancy: true,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      )
    }
  ];

  return (
    <div className="relative pt-24 pb-16 md:pt-40 md:pb-32 overflow-hidden gold-soft-gradient border-b border-stone-100">
      <div className="absolute inset-0 z-0 dot-pattern-gold"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-16 items-start">
          <div className="lg:col-span-7">
            <span className="inline-block py-1 px-3 mb-6 border border-gold/30 bg-gold/5 text-gold text-[8px] md:text-[10px] font-black tracking-[0.2em] uppercase rounded-full">
              30+ Years Legacy • The Gold Standard
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl text-slate-900 font-serif mb-6 leading-tight">
              {cmsData.heroTitle}
            </h1>
            <p className="text-base md:text-xl text-slate-500 mb-10 max-w-xl leading-relaxed">
              {cmsData.heroSubtitle}
            </p>
            
            {/* Service Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {serviceCards.map((card, idx) => (
                <a 
                  key={idx} 
                  href={card.isWorkshop || card.isRecorded || card.isConsultancy ? undefined : card.href}
                  onClick={(e) => {
                    if (card.isWorkshop && onWorkshopClick) {
                      e.preventDefault();
                      onWorkshopClick();
                    } else if (card.isRecorded && onRecordedClick) {
                      e.preventDefault();
                      onRecordedClick();
                    } else if (card.isConsultancy && onConsultancyClick) {
                      e.preventDefault();
                      onConsultancyClick();
                    }
                  }}
                  className={`cursor-pointer group relative overflow-hidden p-5 md:p-6 rounded-[2rem] text-white shadow-lg transition-all duration-500 hover:-translate-y-1 ${card.bg} ${card.bg === 'bg-gold' ? 'gold-glow' : ''}`}
                >
                  <div className="relative z-10">
                    <div className="mb-4 bg-white/20 w-8 h-8 md:w-10 md:h-10 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <div className="scale-75 md:scale-100">{card.icon}</div>
                    </div>
                    <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{card.desc}</p>
                    <h3 className="text-base md:text-lg font-serif font-bold">{card.title}</h3>
                  </div>
                </a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5 relative group flex justify-center lg:justify-end mt-12 lg:mt-0">
            <div className="absolute inset-0 bg-amber-500/10 rounded-[2.5rem] md:rounded-[4rem] blur-3xl -z-10 scale-75"></div>
            <div className="relative aspect-[3/4] w-full max-w-[320px] md:max-w-[360px] rounded-[2.5rem] md:rounded-[3rem] overflow-hidden border-4 md:border-8 border-white shadow-2xl bg-slate-100">
              <img 
                src={cmsData.heroImage} 
                alt="Executive Chef" 
                className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-orange-950/40 via-transparent to-transparent"></div>
              
              <div className="absolute bottom-4 left-4 right-4 p-3 md:p-4 bg-white/95 backdrop-blur-md border border-white rounded-[1.2rem] md:rounded-[1.5rem] shadow-2xl text-center">
                <p className="text-slate-900 font-black text-[10px] md:text-sm uppercase tracking-tighter">{cmsData.chefName}</p>
                <p className="text-orange-600 text-[6px] md:text-[8px] uppercase font-black tracking-[0.2em] mt-1">{cmsData.chefTitle}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
