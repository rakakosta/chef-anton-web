
import React, { useEffect, useState } from 'react';
import Partners from '../components/Partners';
import Reviews from '../components/Reviews';
import { WHATSAPP_NUMBER } from '../constants';
import { Review } from '../types';
import { Partner } from '../services/dataService';

interface Props {
  onBack: () => void;
  reviews: Review[];
  partners: Partner[];
}

const ConsultancyDetail: React.FC<Props> = ({ onBack, reviews, partners }) => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    businessType: 'Restaurant',
    whatsapp: '',
    location: '',
    message: ''
  });

  const [services, setServices] = useState<string[]>([]);

  const serviceOptions = [
    "Menu Improvement & Engineering",
    "Profit & Loss Analysis",
    "Standard Operating Procedures (SOP)",
    "Kitchen Staff Training",
    "Food Safety & HACCP Audit",
    "Inventory & Supply Chain System",
    "New Outlet Opening Strategy"
  ];

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const toggleService = (service: string) => {
    setServices(prev => 
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const selectedServices = services.join(', ');
    const text = `Halo Chef Anton,\n\nSaya ingin mengajukan request Konsultasi Privat.\n\nNama: ${formData.name}\nBisnis: ${formData.businessName} (${formData.businessType})\nLokasi: ${formData.location}\nLayanan yang diinginkan: ${selectedServices}\n\nPesan Tambahan: ${formData.message}\n\nMohon informasi jadwal ketersediaan Chef. Terima kasih.`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="bg-white min-h-screen pt-20">
      {/* 1. Hero Section */}
      <section className="bg-slate-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-pattern-gold"></div>
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gold/10 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <button 
            onClick={onBack}
            className="mb-10 flex items-center gap-2 text-gold font-black uppercase tracking-widest text-[10px] hover:text-white transition-colors bg-white/5 px-4 py-2 rounded-full border border-white/10"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Kembali
          </button>
          
          <div className="max-w-4xl">
            <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">B2B Professional Services</span>
            <h1 className="text-5xl md:text-7xl font-serif mb-8 leading-tight">Private Executive Consultancy</h1>
            <p className="text-slate-400 text-xl leading-relaxed italic max-w-2xl">
              "Bukan sekadar resep, tapi sistem. Transformasi operasional bisnis FnB Anda dengan standar akurasi industri hotel bintang lima global."
            </p>
          </div>
        </div>
      </section>

      {/* 2. Partners Section (Data passed from CMS) */}
      <Partners partners={partners} />

      {/* 3. Main Form Section (Qualification Inquiry) */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            {/* Left Column: Form Description */}
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-serif text-slate-900 mb-8">Qualification Inquiry</h2>
              <p className="text-slate-500 mb-12 leading-relaxed">
                Untuk memastikan solusi yang tepat bagi bisnis Anda, Chef Anton memerlukan detail kualifikasi awal. Sesi konsultasi bersifat eksklusif dan terbatas setiap bulannya.
              </p>
              
              <div className="space-y-10">
                {[
                  { icon: "📈", title: "Targeted Growth", desc: "Fokus pada kenaikan profit melalui efisiensi COGS dan optimasi menu." },
                  { icon: "🛡️", title: "Operational Safety", desc: "Standardisasi keamanan pangan dan alur kerja untuk ketenangan owner." },
                  { icon: "🤝", title: "Expert Mentorship", desc: "Bimbingan langsung untuk Executive Chef dan Management Team Anda." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6">
                    <div className="text-3xl">{item.icon}</div>
                    <div>
                      <h4 className="font-black text-slate-900 text-xs uppercase tracking-widest mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: The Form */}
            <div className="lg:col-span-7">
              <form onSubmit={handleSubmit} className="bg-stone-50 p-10 md:p-16 rounded-[4rem] border border-stone-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-gold outline-none transition-all"
                      placeholder="Contoh: Budi Santoso"
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp Bisnis</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-gold outline-none transition-all"
                      placeholder="+62 812..."
                      value={formData.whatsapp}
                      onChange={e => setFormData({...formData, whatsapp: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Bisnis</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-gold outline-none transition-all"
                      placeholder="Contoh: PT. Kuliner Jaya"
                      value={formData.businessName}
                      onChange={e => setFormData({...formData, businessName: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe Bisnis</label>
                    <select 
                      className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-gold outline-none transition-all appearance-none"
                      value={formData.businessType}
                      onChange={e => setFormData({...formData, businessType: e.target.value})}
                    >
                      <option>Restaurant</option>
                      <option>Hotel</option>
                      <option>Cafe / Bistro</option>
                      <option>Catering / Central Kitchen</option>
                      <option>FnB Startup</option>
                    </select>
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lokasi Bisnis</label>
                    <input 
                      required
                      type="text" 
                      className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-gold outline-none transition-all"
                      placeholder="Kota, Provinsi"
                      value={formData.location}
                      onChange={e => setFormData({...formData, location: e.target.value})}
                    />
                  </div>
                </div>

                <div className="mb-10">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block mb-6">Area Layanan yang Diinginkan (Bisa pilih lebih dari satu)</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {serviceOptions.map((service, idx) => (
                      <label key={idx} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-200 cursor-pointer hover:border-gold transition-all group">
                        <input 
                          type="checkbox" 
                          className="w-5 h-5 rounded border-stone-300 text-gold focus:ring-gold cursor-pointer"
                          onChange={() => toggleService(service)}
                          checked={services.includes(service)}
                        />
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{service}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="mb-10 space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Pesan / Masalah Utama yang Dihadapi</label>
                  <textarea 
                    className="w-full bg-white border border-stone-200 rounded-2xl px-6 py-4 text-sm focus:ring-2 focus:ring-gold outline-none transition-all h-32"
                    placeholder="Ceritakan singkat tantangan bisnis Anda saat ini..."
                    value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[12px] rounded-2xl hover:bg-gold transition-all shadow-2xl gold-glow active:scale-[0.98]"
                >
                  Send Inquiry to Chef Anton
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Testimonials (Reviews) Section */}
      {reviews.length > 0 && (
        <Reviews customReviews={reviews} />
      )}

      {/* 5. Trust Banner */}
      <section className="py-24 bg-slate-950 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 dot-pattern-gold"></div>
        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h3 className="text-3xl md:text-4xl font-serif mb-6 italic">"Sistem adalah fondasi, Rasa adalah jiwa."</h3>
          <p className="text-slate-400 uppercase tracking-[0.3em] font-black text-[10px]">Jadwalkan kualifikasi bisnis Anda hari ini.</p>
        </div>
      </section>
    </div>
  );
};

export default ConsultancyDetail;
