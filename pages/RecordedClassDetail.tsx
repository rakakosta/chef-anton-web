
import React, { useState, useEffect } from 'react';
import { WHATSAPP_NUMBER } from '../constants';
import { CulinaryClass, Review } from '../types';
import Reviews from '../components/Reviews';

interface Props {
  onBack: () => void;
  reviews: Review[];
  recordedClasses: CulinaryClass[];
}

const RecordedClassDetail: React.FC<Props> = ({ onBack, reviews, recordedClasses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  
  const totalPages = Math.ceil(recordedClasses.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = recordedClasses.slice(startIndex, startIndex + itemsPerPage);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  const handlePurchase = (item: CulinaryClass) => {
    const message = encodeURIComponent(`Halo Chef Anton, saya tertarik membeli akses selamanya untuk Kelas Rekaman: "${item.title}". Mohon info cara pembayarannya.`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Header Section */}
      <section className="bg-slate-950 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-pattern-gold"></div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <button 
            onClick={onBack}
            className="mb-10 flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            ← KEMBALI
          </button>
          
          <div className="max-w-3xl">
            <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Academy Access</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">Video Masterclass Academy</h1>
            <p className="text-slate-400 text-lg leading-relaxed italic">"Bangun sistem dapur elit dan kuasai standar bintang lima secara mandiri. Akses materi teknis selamanya, tonton di mana saja, kapan saja."</p>
          </div>
        </div>
      </section>

      {/* 2. Catalog Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-6">
            <h2 className="text-3xl font-serif text-slate-900 flex items-center gap-4">
              <span className="w-2 h-10 bg-gold rounded-full"></span>
              Katalog Kelas Premium
            </h2>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              {recordedClasses.length > 0 
                ? `Menampilkan ${startIndex + 1}-${Math.min(startIndex + itemsPerPage, recordedClasses.length)} dari ${recordedClasses.length} Video`
                : 'Belum ada materi tersedia'}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {recordedClasses.length > 0 ? (
              currentItems.map((item) => (
                <div key={item.id} className="group flex flex-col bg-white rounded-[3rem] border border-stone-100 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden">
                  <div className="relative aspect-video overflow-hidden">
                    <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/10 transition-colors"></div>
                    
                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="w-16 h-16 bg-gold text-white rounded-full flex items-center justify-center shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                        <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                      </div>
                    </div>

                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      <span className="px-4 py-1.5 bg-slate-900/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-full border border-white/10">
                        {item.level} Level
                      </span>
                    </div>
                  </div>

                  <div className="p-10 flex flex-col flex-grow">
                    <div className="flex-grow">
                      <h3 className="text-xl font-serif text-slate-900 mb-4 group-hover:text-gold transition-colors line-clamp-2">{item.title}</h3>
                      <p className="text-slate-500 text-sm mb-8 leading-relaxed line-clamp-2 italic">"{item.description}"</p>
                      
                      <div className="flex flex-wrap gap-4 mb-8">
                         <div className="flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100">
                           <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                           <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{item.duration}</span>
                         </div>
                         <div className="flex items-center gap-2 bg-stone-50 px-4 py-2 rounded-2xl border border-stone-100">
                           <svg className="w-4 h-4 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                           <span className="text-[10px] font-black uppercase tracking-widest text-gold">{item.soldCount?.toLocaleString()} Terjual</span>
                         </div>
                      </div>
                    </div>

                    <div className="pt-8 border-t border-stone-50 flex items-center justify-between">
                      <div>
                        <span className="block text-[8px] text-slate-400 uppercase font-black tracking-[0.2em] mb-1">Lifetime Access</span>
                        <span className="text-xl font-black text-slate-900">
                           {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(item.price)}
                        </span>
                      </div>
                      <button 
                        onClick={() => handlePurchase(item)}
                        className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all active:scale-95 shadow-lg"
                      >
                        Beli Akses
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <div className="bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200 p-20 text-center opacity-60">
                   <p className="text-4xl md:text-6xl font-serif font-black text-slate-300 mb-4">COMING SOON</p>
                   <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.3em] text-slate-400">Materi eksklusif sedang dalam proses produksi.</p>
                </div>
              </div>
            )}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-20 flex justify-center items-center gap-4">
              <button 
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-stone-50 border border-stone-100 text-slate-400 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" /></svg>
              </button>
              
              <div className="flex gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black transition-all ${
                      currentPage === page 
                        ? 'bg-gold text-white shadow-xl gold-glow scale-110' 
                        : 'bg-white border border-stone-100 text-slate-400 hover:text-gold hover:border-gold'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button 
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="w-12 h-12 rounded-2xl flex items-center justify-center bg-stone-50 border border-stone-100 text-slate-400 hover:text-gold hover:border-gold disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" /></svg>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      {reviews.length > 0 && (
        <Reviews customReviews={reviews} />
      )}

      {/* 3. Academy Trust Bar */}
      <section className="py-20 bg-stone-50 border-t border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
             <div className="p-8">
                <div className="text-4xl mb-4">🏆</div>
                <h4 className="font-serif text-xl mb-2">Kurikulum Teruji</h4>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Berdasarkan standar operasional hotel bintang 5.</p>
             </div>
             <div className="p-8 border-y md:border-y-0 md:border-x border-stone-200">
                <div className="text-4xl mb-4">📱</div>
                <h4 className="font-serif text-xl mb-2">Akses Multi-device</h4>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Tonton dari HP, Tablet, atau Laptop kapan saja.</p>
             </div>
             <div className="p-8">
                <div className="text-4xl mb-4">♾️</div>
                <h4 className="font-serif text-xl mb-2">Akses Seumur Hidup</h4>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">Satu kali bayar untuk referensi ilmu selamanya.</p>
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default RecordedClassDetail;
