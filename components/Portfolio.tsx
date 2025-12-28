
import React from 'react';
import { PortfolioItem } from '../types';

interface Props {
  items: PortfolioItem[];
}

const Portfolio: React.FC<Props> = ({ items }) => {
  return (
    <section id="portfolio" className="py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Selected Works</span>
          <h2 className="text-5xl md:text-6xl font-serif text-slate-900 mb-6">Culinary Portfolio</h2>
          <p className="text-slate-400 italic text-lg max-w-2xl mx-auto">"Dari manajemen dapur internasional hingga revitalisasi kuliner hotel legendaris."</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {items.map((item, idx) => (
            <div key={item.id} className={`group relative overflow-hidden rounded-[4rem] shadow-2xl transition-all duration-700 hover:-translate-y-2 ${idx % 3 === 0 ? 'md:col-span-1' : ''}`}>
              <div className="aspect-[16/10] overflow-hidden bg-stone-100">
                <img 
                  src={item.image} 
                  alt={item.title} 
                  className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity"></div>
              <div className="absolute bottom-10 left-10 right-10">
                <span className="text-gold font-black uppercase tracking-widest text-[9px] mb-2 block">{item.category}</span>
                <h3 className="text-3xl font-serif text-white">{item.title}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portfolio;
