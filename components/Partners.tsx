
import React from 'react';
import { Partner } from '../services/dataService';

interface Props {
  partners?: Partner[];
}

const Partners: React.FC<Props> = ({ partners = [] }) => {
  return (
    <section className="py-12 md:py-24 bg-white border-y border-stone-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 md:mb-20">
          <span className="text-gold font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-1 md:mb-2 block">PROVEN TRACK RECORD</span>
          <p className="text-slate-400 text-[10px] md:text-xs italic font-serif">Dipercaya oleh Brand F&B Ternama. Mulai dari Cafe,Warung Makan hingga Luxury Resto</p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-8 md:gap-x-12 gap-y-12 md:gap-y-24 items-center justify-items-center">
          {partners.map((partner) => (
            <div key={partner.id} className="flex flex-col items-center justify-center group w-full">
              <div className="w-full max-w-[120px] md:max-w-none h-16 md:h-32 mb-4 md:mb-8 flex items-center justify-center text-5xl md:text-8xl group-hover:scale-105 transition-transform duration-500 overflow-hidden">
                {partner.logo.length < 10 ? partner.logo : <img src={partner.logo} className="w-full h-full object-contain filter-none" alt={partner.name} />}
              </div>
              <span className="text-[7px] md:text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 group-hover:text-gold transition-colors text-center leading-relaxed">
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
