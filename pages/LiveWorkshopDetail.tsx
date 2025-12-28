
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
    const message = encodeURIComponent(`Halo Chef Anton, saya tertarik bergabung di Workshop "${workshop.title}". Bagaimana cara pendaftarannya?`);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${message}`, '_blank');
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [workshop?.id]);

  const formatPrice = (price: number) => 
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(price);

  return (
    <div className="bg-white min-h-screen pt-20">
      
      {/* SECTION 1: ACTIVE WORKSHOP / HERO */}
      <section className="relative bg-slate-900 text-white overflow-hidden min-h-[85vh] flex items-center">
        {!workshop ? (
          // Empty State View (Tampilan jika benar-benar tidak ada workshop)
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-32">
            <div className="absolute inset-0 z-0 opacity-20">
              <img src={STOCK_IMAGES.WORKSHOP_POSTER} alt="Background" className="w-full h-full object-cover blur-sm" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/95 to-slate-900"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <button 
                onClick={onBack}
                className="mb-12 inline-flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors bg-white/5 px-6 py-3 rounded-full border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Kembali ke Beranda
              </button>
              
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-5xl mb-8 mx-auto border border-white/20 shadow-2xl">⏳</div>
              <h1 className="text-4xl md:text-7xl font-serif mb-8 leading-tight">Belum Ada Sesi Workshop Terdekat</h1>
              <p className="text-slate-400 text-xl mb-12 italic leading-relaxed font-serif">
                "Chef Anton saat ini sedang fokus pada pendampingan operasional di lapangan. Sambil menunggu jadwal baru, silakan eksplorasi opsi belajar mandiri atau konsultasi privat."
              </p>
              
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <button 
                  onClick={onRecordedClick}
                  className="px-10 py-6 bg-gold text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-white hover:text-slate-900 transition-all gold-glow"
                >
                  Beli Kelas Rekaman
                </button>
                <button 
                  onClick={onConsultancyClick}
                  className="px-10 py-6 bg-white/10 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-gold hover:text-white transition-all border border-white/20"
                >
                  Konsultasi Privat
                </button>
              </div>
            </div>
          </div>
        ) : (
          // Active Batch Detail View (Tampilan Prototipe Workshop Aktif)
          <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
            <div className="absolute inset-0 z-0 opacity-10">
              <img src={workshop.image} alt="Background" className="w-full h-full object-cover blur-md scale-110" />
            </div>
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-900/95 to-slate-900"></div>
            
            <div className="relative z-10">
              <button 
                onClick={onBack}
                className="mb-12 flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                Kembali
              </button>
              
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                <div className="lg:col-span-5 order-2 lg:order-1">
                  <span className="inline-block px-4 py-1.5 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full mb-6 animate-pulse">
                    Enrollment Now Open
                  </span>
                  <h1 className="text-4xl md:text-5xl xl:text-7xl font-serif mb-6 leading-tight">{workshop.title}</h1>
                  <p className="text-slate-400 text-lg mb-10 italic max-w-lg leading-relaxed font-serif">"{workshop.description}"</p>
                  
                  <div className="grid grid-cols-2 gap-6 py-8 border-y border-white/10 mb-8">
                    <div>
                      <p className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">Lokasi / Sesi</p>
                      <p className="font-bold text-sm text-white">{workshop.location || 'Online Live / On-site'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">Durasi</p>
                      <p className="font-bold text-sm text-white">{workshop.duration}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">Jadwal</p>
                      <p className="font-bold text-sm text-white">
                        {workshop.displayDate || (workshop.date ? new Date(workshop.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Segera Diumumkan')}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gold font-black uppercase tracking-widest mb-1">Kapasitas</p>
                      <p className="font-bold text-sm text-red-400">
                        {workshop.slots || 0} Sisa Kursi
                      </p>
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-3 order-1 lg:order-2">
                  <div className="relative aspect-[3/4] rounded-[3.5rem] overflow-hidden border-8 border-white shadow-2xl bg-slate-800 transform rotate-1">
                    <img src={workshop.image} alt="Poster" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60"></div>
                  </div>
                </div>
                
                <div className="lg:col-span-4 order-3">
                  <div className="bg-white p-12 rounded-[4rem] text-center shadow-[0_20px_50px_rgba(0,0,0,0.5)] relative">
                    <p className="text-gold font-black text-[10px] uppercase tracking-[0.3em] mb-6">Course Investment</p>
                    <div className="mb-10">
                      {workshop.priceBeforeDiscount && (
                        <span className="block text-slate-400 text-sm line-through mb-1">{formatPrice(workshop.priceBeforeDiscount)}</span>
                      )}
                      <h2 className="text-5xl font-black text-slate-900">
                        {formatPrice(workshop.price)}
                      </h2>
                    </div>
                    <button 
                      onClick={handleWhatsApp}
                      className="w-full py-6 bg-gold text-white font-black uppercase tracking-[0.2em] text-[12px] rounded-2xl hover:bg-slate-950 transition-all gold-glow transform active:scale-95 shadow-xl"
                    >
                      Daftar via WhatsApp
                    </button>
                    <p className="mt-6 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                      Standard Sertifikasi Hotel Bintang 5
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* SECTION 2: CURRICULUM & BENEFITS */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            <div className="lg:col-span-2">
              <h2 className="text-4xl font-serif text-slate-900 mb-12 flex items-center gap-6">
                <span className="w-2 h-12 bg-gold rounded-full"></span>
                Kurikulum Intensif Academy
              </h2>
              <div className="space-y-6">
                {(workshop?.curriculum || ["Fundamental SOP Analysis", "Station Workflow Optimization", "Cost Control & Margin Engineering", "Standardization & System Scaling"]).map((item, i) => (
                  <div key={i} className="flex gap-8 p-10 bg-stone-50 rounded-[3rem] border border-stone-100 group hover:border-gold/30 transition-all hover:bg-white hover:shadow-xl">
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-3xl shadow-md flex items-center justify-center text-gold font-black text-2xl group-hover:bg-gold group-hover:text-white transition-colors">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 mb-2 uppercase tracking-tight text-xl">{item}</h4>
                      <p className="text-sm text-slate-500 italic leading-relaxed font-serif">"Materi disusun berdasarkan studi kasus nyata puluhan tahun di industri hotel prestisius."</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="space-y-8">
              <div className="bg-slate-950 text-white p-12 rounded-[4rem] shadow-2xl relative overflow-hidden border border-white/5">
                <h3 className="text-2xl font-serif mb-10 border-b border-white/10 pb-4">Benefit Eksklusif</h3>
                <ul className="space-y-6 mb-12">
                  {[
                    { t: "Akses Video 30 Hari", d: "Tinjau kembali materi kapan saja." },
                    { t: "Template Spreadsheet", d: "Formulir SOP & COGS siap pakai." },
                    { t: "E-Certificate Official", d: "Sertifikasi keahlian profesional." },
                    { t: "Grup Konsultasi Alumni", d: "Networking antar pemilik bisnis." }
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <div className="mt-1 w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center flex-shrink-0">
                         <svg className="w-3 h-3 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" /></svg>
                      </div>
                      <div>
                        <p className="text-sm font-black uppercase text-white tracking-widest mb-1">{item.t}</p>
                        <p className="text-xs text-slate-400 font-medium leading-relaxed">{item.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="aspect-[4/3] rounded-3xl overflow-hidden bg-slate-900 border-2 border-gold/30 shadow-2xl">
                  <img src={STOCK_IMAGES.CERTIFICATE} alt="Certificate" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: HISTORICAL PREVIOUS WORKSHOPS */}
      {historicalWorkshops.length > 0 && (
        <section className="py-32 bg-stone-50 border-y border-stone-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-24">
              <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Archive & Legacy</span>
              <h2 className="text-5xl font-serif text-slate-900">Sesi Workshop Sebelumnya</h2>
              <p className="text-slate-400 mt-6 text-lg max-w-xl mx-auto italic font-serif">Melihat kembali jejak edukasi dan kolaborasi Chef Anton bersama ribuan profesional di seluruh Indonesia.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {historicalWorkshops.map(pw => (
                <div 
                  key={pw.id} 
                  onClick={() => onViewWorkshop?.(pw.id)} 
                  className="group bg-white rounded-[4rem] border border-stone-200 p-8 flex gap-8 items-center hover:shadow-2xl cursor-pointer transition-all hover:border-gold/30"
                >
                  <div className="w-44 h-44 rounded-[2.5rem] overflow-hidden flex-shrink-0 shadow-lg border-4 border-white">
                    <img src={pw.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-serif text-slate-900 group-hover:text-gold transition-colors leading-tight">{pw.title}</h3>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-3">{pw.location} • {pw.displayDate || (pw.date ? new Date(pw.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long' }) : '')}</p>
                    <div className="inline-flex mt-6 text-[9px] font-black uppercase text-gold px-6 py-2.5 bg-gold/5 rounded-full border border-gold/10">
                      {pw.realAttendance || 0} Alumni Terdaftar
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECTION 4: TESTIMONIALS */}
      <Reviews customReviews={reviews} />
      
      {/* FINAL CALL TO ACTION BAR */}
      <section className="py-24 bg-slate-950 text-white text-center">
        <h3 className="text-3xl font-serif mb-6 italic">"Bukan sekadar koki, tapi kawan strategis bisnis Anda."</h3>
        <p className="text-gold font-black uppercase tracking-[0.3em] text-[10px]">The Academy of Culinary Excellence</p>
      </section>
    </div>
  );
};

export default LiveWorkshopDetail;
