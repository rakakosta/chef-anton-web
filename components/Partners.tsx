
import React from 'react';
import { Partner } from '../services/dataService';

interface Props {
  partners?: Partner[];
}

const Partners: React.FC<Props> = ({ partners = [] }) => {
  return (
    <section className="py-24 bg-white border-y border-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-2 block">Trusted By Industry Leaders</span>
          <p className="text-slate-400 text-xs italic font-serif">Partner & Kolaborasi Strategis di Industri Hospitality</p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-12 gap-y-24 items-center justify-items-center">
          {partners.map((partner) => (
            <div key={partner.id} className="flex flex-col items-center justify-center group w-full">
              <div className="w-56 h-32 mb-8 flex items-center justify-center text-8xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                {partner.logo.length < 10 ? partner.logo : <img src={partner.logo} className="w-full h-full object-contain filter-none" alt={partner.name} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-gold transition-colors text-center leading-relaxed">
                {partner.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
