
import React from 'react';
import { REVIEWS } from '../constants';
import { Review } from '../types';

interface Props {
  customReviews?: Review[];
}

const Reviews: React.FC<Props> = ({ customReviews }) => {
  const displayReviews = customReviews || REVIEWS;

  return (
    <section id="reviews" className="py-16 md:py-32 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <span className="text-gold font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-2 md:mb-4 block">Testimonials</span>
        <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-12 md:mb-20">Jejak Kepercayaan Mereka</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-10">
          {displayReviews.map((review) => (
            <div key={review.id} className="bg-white p-8 md:p-12 rounded-[2rem] md:rounded-[3.5rem] border border-stone-100 shadow-lg relative group hover:border-gold/50 transition-all duration-500 text-left">
              <div className="absolute -top-6 md:-top-8 left-8 md:left-12">
                <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl overflow-hidden border-4 border-white shadow-xl group-hover:scale-110 transition-transform">
                  <img src={review.avatar} alt={review.name} className="w-full h-full object-cover" />
                </div>
              </div>
              
              <div className="mt-8 mb-8 md:mt-10 md:mb-10">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-gold opacity-20 mb-4 md:mb-6" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21L14.017 18C14.017 16.8954 14.9124 16 16.017 16H19.017C19.5693 16 20.017 15.5523 20.017 15V9C20.017 8.44772 19.5693 8 19.017 8H15.017C14.4647 8 14.017 8.44772 14.017 9V12C14.017 12.5523 13.5693 13 13.017 13H11.017C10.4647 13 10.017 12.5523 10.017 12V9C10.017 7.34315 11.3602 6 13.017 6H19.017C20.6739 6 22.017 7.34315 22.017 9V15C22.017 18.3137 19.3307 21 16.017 21H14.017ZM3.017 21L3.017 18C3.017 16.8954 3.91243 16 5.017 16H8.017C8.56928 16 9.017 15.5523 9.017 15V9C9.017 8.44772 8.56928 8 8.017 8H4.017C3.46472 8 3.017 8.44772 3.017 9V12C3.017 12.5523 2.56928 13 2.017 13H0.017C-0.535282 13 -1.017 12.5523 -1.017 12V9C-1.017 7.34315 0.326142 6 1.983 6H8.017C9.67386 6 11.017 7.34315 11.017 9V15C11.017 18.3137 8.33071 21 5.017 21H3.017Z" /></svg>
                <p className="text-slate-600 leading-relaxed italic text-sm md:text-base">
                  "{review.comment}"
                </p>
              </div>
              
              <div className="pt-6 md:pt-8 border-t border-stone-50">
                <p className="font-black text-slate-900 text-xs md:text-sm mb-1 uppercase tracking-widest">{review.name}</p>
                <p className="text-[7px] md:text-[9px] text-gold uppercase tracking-[0.2em] font-black">{review.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Reviews;
