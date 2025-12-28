
import React from 'react';
import { CulinaryClass, ClassType } from '../types';

interface Props {
  item: CulinaryClass;
  onViewDetail?: (id: string) => void;
}

const ClassCard: React.FC<Props> = ({ item, onViewDetail }) => {
  const isLive = item.type === ClassType.LIVE;

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="group bg-white rounded-[3rem] overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 border border-stone-50 flex flex-col h-full">
      <div className="relative aspect-[4/3] overflow-hidden m-2 rounded-[2.5rem]">
        <img 
          src={item.image} 
          alt={item.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
        />
        <div className="absolute top-5 left-5 flex flex-col gap-2">
          <span className={`px-5 py-2 text-[8px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg ${
            isLive ? 'bg-red-600 text-white' : 'bg-gold text-white'
          }`}>
            {item.type}
          </span>
          <span className="px-5 py-2 bg-white/95 backdrop-blur-sm text-slate-900 text-[8px] font-black tracking-[0.2em] uppercase rounded-full shadow-lg">
            {item.level} Level
          </span>
        </div>
      </div>
      
      <div className="p-10 flex flex-col flex-grow">
        <div className="flex-grow">
          <h3 className="text-2xl font-serif text-slate-900 mb-4 group-hover:text-gold transition-colors">
            {item.title}
          </h3>
          <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2 italic">
            "{item.description}"
          </p>
        </div>

        <div className="pt-8 border-t border-slate-50 flex items-center justify-between mt-auto">
          <div>
            <span className="block text-[9px] text-gold uppercase font-black tracking-widest mb-1">
              Course Investment
            </span>
            <div className="flex flex-col">
              {item.priceBeforeDiscount && (
                <span className="text-[10px] text-slate-400 line-through">
                  {formatPrice(item.priceBeforeDiscount)}
                </span>
              )}
              <span className="text-2xl font-black text-slate-900">
                {formatPrice(item.price)}
              </span>
            </div>
          </div>
          <button 
            onClick={() => isLive && onViewDetail ? onViewDetail(item.id) : null}
            className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all"
          >
            {isLive ? 'View Details' : 'Buy Access'}
          </button>
        </div>
        
        {isLive && item.date && (
          <div className="mt-6 flex items-center gap-3 text-[9px] text-slate-900 font-bold uppercase tracking-widest bg-stone-50 py-3 px-5 rounded-2xl w-full border border-stone-100">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
            Schedule: {item.displayDate || new Date(item.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClassCard;
