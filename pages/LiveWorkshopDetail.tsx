
import React, { useEffect } from 'react';
import { CulinaryClass, Review } from '../types';
import { WHATSAPP_NUMBER, STOCK_IMAGES } from '../constants';
import Reviews from '../components/Reviews';

interface Props {
  workshop: CulinaryClass | null;
  historicalWorkshops: CulinaryClass[];
  reviews: Review[];
  onBack: () => void;
  onRecordedClick?: () => void;
  onConsultancyClick?: () => void;
  onViewWorkshop?: (id: string) => void;
}

const LiveWorkshopDetail: React.FC<Props> = ({ 
  workshop, 
  historicalWorkshops, 
  reviews, 
  onBack, 
  onRecordedClick, 
  onConsultancyClick,
  onViewWorkshop
}) => {
  const handleWhatsApp = () => {
    if (!workshop) return;
    const message = encodeURIComponent(`Halo Chef Anton, saya tertarik bergabung di Workshop "${workshop.title}". Saya lihat dari Website, Bagaimana cara pendaftarannya?`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [workshop?.id]);

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="bg-white min-h-screen selection:bg-gold/20">
      
      {/* SECTION 1: PREMIUM HERO & DETAIL */}
      <section className="relative bg-slate-950 text-white pt-28 pb-20 lg:pt-36 lg:pb-32 overflow-hidden px-6 md:px-12">
        {/* Subtle Background Textures */}
        <div className="absolute inset-0 opacity-[0.03] dot-pattern-gold pointer-events-none"></div>
        <div className="absolute -top-40 -left-40 w-[60rem] h-[60rem] bg-gold/5 rounded-full blur-[150px] pointer-events-none"></div>

        <div className="relative z-10 max-w-7xl mx-auto">
          {/* Back Button */}
          <button 
            onClick={onBack}
            className="mb-10 inline-flex items-center gap-2 text-gold font-black uppercase tracking-[0.4em] text-[11px] hover:text-white transition-all duration-300 group"
          >
            <span className="transform group-hover:-translate-x-1 transition-transform duration-300">←</span> KEMBALI
          </button>

          {!workshop ? (
            <div className="text-center py-24">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-4xl mb-8 mx-auto border border-white/10 animate-pulse">⏳</div>
              <h1 className="text-4xl lg:text-6xl font-serif font-black mb-6 text-white">Sesi Segera Datang</h1>
              <p className="text-slate-400 text-lg italic font-serif">Nantikan jadwal terbaru di kanal media sosial kami.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* LEFT COLUMN: THE POSTER (Span 5) */}
              <div className="lg:col-span-5 order-2 lg:order-1">
                <div className="relative">
                  {/* Poster Glass Container */}
                  <div className="bg-white/5 backdrop-blur-md p-3 md:p-4 rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden group">
                    <div className="relative aspect-[3/4] w-full rounded-[2.2rem] overflow-hidden bg-slate-800 transition-all duration-500 group-hover:shadow-[0_0_50px_rgba(212,175,55,0.15)]">
                      <img 
                        src={workshop.image} 
                        alt={workshop.title} 
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                        loading="eager"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent"></div>
                    </div>
                  </div>
                  
                  {/* Experience Badge */}
                  <div className="absolute -bottom-4 -right-4 bg-gold text-white px-8 py-4 rounded-2xl shadow-xl font-black text-[10px] uppercase tracking-[0.2em] transform rotate-3">
                    Limited Seats Only
                  </div>
                </div>
              </div>

              {/* RIGHT COLUMN: CONTENT & CONVERSION (Span 7) */}
              <div className="lg:col-span-7 order-1 lg:order-2 space-y-10">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <span className="px-5 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-lg shadow-red-900/40">
                      ENROLLMENT OPEN
                    </span>
                    <span className="text-gold font-black text-[10px] uppercase tracking-[0.2em]"> Beginner to Advanced Level</span>
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-serif font-black leading-tight tracking-tight">
                    {workshop.title}
                  </h1>
                  
                  <p className="text-slate-400 text-lg lg:text-xl leading-relaxed italic font-serif border-l-2 border-gold/40 pl-6 max-w-2xl">
                    {workshop.description}
                  </p>
                </div>

                {/* AIRY INFO GRID */}
                <div className="grid grid-cols-2 gap-4">
                   {[
                     { label: 'Platform', val: workshop.location || 'Zoom Live', icon: '📍' },
                     { label: 'Jadwal', val: workshop.displayDate || 'TBA', icon: '📅' },
                     { label: 'Durasi', val: workshop.duration, icon: '⏱️' },
                     { label: 'Kapasitas', val: `${workshop.slots || 0} Slots`, icon: '👥' }
                   ].map((info, idx) => (
                     <div key={idx} className="flex items-center gap-5 p-5 bg-white/5 rounded-3xl border border-white/10 hover:bg-white/[0.08] transition-all duration-300 group">
                        <div className="w-10 h-10 flex items-center justify-center text-xl bg-white/5 rounded-2xl group-hover:scale-110 transition-transform">{info.icon}</div>
                        <div>
                          <p className="text-[9px] font-black text-gold/60 uppercase tracking-widest mb-0.5">{info.label}</p>
                          <p className="text-sm font-bold text-white">{info.val}</p>
                        </div>
                     </div>
                   ))}
                </div>

                {/* COMPACT CONVERSION CTA CARD */}
                <div className="max-w-[600px] bg-white p-8 md:p-10 rounded-[3rem] text-slate-950 shadow-2xl relative overflow-hidden group transition-all duration-500 hover:-translate-y-1">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
                  
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 relative z-10">
                    <div>
                      <span className="block text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">INVESTASI KELAS</span>
                      <div className="flex flex-col">
                        {workshop.priceBeforeDiscount && (
                          <span className="text-slate-300 text-sm line-through font-medium mb-0.5">
                            {formatPrice(workshop.priceBeforeDiscount)}
                          </span>
                        )}
                        <span className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900">
                          {formatPrice(workshop.price)}
                        </span>
                      </div>
                    </div>

                    <div className="flex-shrink-0">
                      <button 
                        onClick={handleWhatsApp}
                        className="w-full md:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-[#25D366] hover:bg-slate-900 text-white font-black uppercase tracking-widest text-[12px] rounded-2xl transition-all duration-300 shadow-xl shadow-green-200 hover:shadow-gold/20"
                      >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.937 3.659 1.432 5.63 1.433h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                        DAFTAR VIA WA
                      </button>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}
        </div>
      </section>

      {/* SECTION 2: CURRICULUM */}
      <section className="py-24 lg:py-32 bg-white relative px-6 md:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            <div className="lg:col-span-8">
              <div className="mb-16">
                <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Materi Strategis</span>
                <h2 className="text-4xl lg:text-5xl font-serif text-slate-900 mb-8 leading-tight">
                  Kurikulum Live Workshop
                </h2>
                <p className="text-slate-500 text-lg leading-relaxed max-w-2xl italic font-serif">
                  "Dirancang untuk mentransformasi dapur konvensional menjadi operasional standar bintang lima yang efisien dan menguntungkan."
                </p>
              </div>

              <div className="space-y-4">
                {(workshop?.curriculum || ["Fundamental Kitchen SOP", "Workflow Optimization", "Advanced COGS Mastery", "Inventory System Design"]).map((item, i) => (
                  <div key={i} className="flex gap-8 p-10 bg-stone-50 rounded-[2.5rem] border border-stone-100 group hover:border-gold/30 transition-all duration-300 hover:bg-white hover:shadow-xl">
                    <div className="flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-gold font-black text-xl group-hover:bg-gold group-hover:text-white transition-colors duration-300">
                      {i + 1}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tight text-lg">{item}</h4>
                      <p className="text-xs text-slate-400 uppercase tracking-widest font-bold">Modul Expert Sesi {i + 1}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-4 lg:sticky lg:top-32 h-fit">
              <div className="bg-slate-950 text-white p-10 rounded-[3rem] shadow-2xl relative overflow-hidden border border-white/5">
                <div className="absolute top-0 left-0 w-full h-1 bg-gold"></div>
                <h3 className="text-xl font-serif mb-8 border-b border-white/10 pb-4">Eksklusivitas Alumni</h3>
                <ul className="space-y-6">
                  {[
                    { t: "Akses Materi & Exercise", d: "Tinjau kembali kurikulum sesi." },
                    { t: "Template SOP & Excel", d: "Dapatkan file siap pakai." },
                    { t: "E-Certificate Official", d: "Sertifikasi resmi bertanda tangan Chef Anton." },
                    { t: "Grup Diskusi VIP", d: "Networking strategis & konsultasi bersama Chef Anton." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                         <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase text-white tracking-widest mb-1">{item.t}</p>
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">{item.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECTION 3: ARCHIVE */}
      {historicalWorkshops.length > 0 && (
        <section className="py-24 bg-stone-50 border-y border-stone-200 px-6 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Archive</span>
              <h2 className="text-4xl lg:text-5xl font-serif text-slate-900">Jejak Edukasi Sebelumnya</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {historicalWorkshops.map(pw => (
                <div 
                  key={pw.id} 
                  onClick={() => onViewWorkshop?.(pw.id)} 
                  className="group bg-white rounded-[3rem] border border-stone-200 p-8 flex flex-col sm:flex-row gap-8 items-center hover:shadow-2xl cursor-pointer transition-all duration-500 hover:border-gold/30"
                >
                  <div className="w-32 h-32 rounded-[1.8rem] overflow-hidden flex-shrink-0 shadow-lg border-4 border-stone-50">
                    <img src={pw.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  </div>
                  <div>
                    <h3 className="text-xl font-serif text-slate-900 group-hover:text-gold transition-colors">{pw.title}</h3>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-2">{pw.displayDate || 'Past Event'}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: TESTIMONIALS */}
      <Reviews customReviews={reviews} />
      
      {/* FOOTER CALL-BAR */}
      <section className="py-20 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 dot-pattern-gold"></div>
        <div className="relative z-10 px-6">
          <p className="text-gold font-black uppercase tracking-[0.4em] text-[11px] mb-4">THE ACADEMY OF CULINARY EXCELLENCE</p>
          <h3 className="text-2xl font-serif italic text-slate-300">"Sistem adalah fondasi, Rasa adalah jiwa."</h3>
        </div>
      </section>
    </div>
  );
};

export default LiveWorkshopDetail;
