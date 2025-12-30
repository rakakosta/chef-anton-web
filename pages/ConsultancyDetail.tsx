
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

  const handleWhatsAppInquiry = (e: React.FormEvent) => {
    e.preventDefault();
    
    // 1. Data Collection & Validation Logic
    const { name, businessName, businessType, whatsapp, location, message } = formData;
    
    if (!name.trim() || !businessName.trim() || !location.trim() || !message.trim() || !whatsapp.trim()) {
      alert("Mohon lengkapi data Anda: Nama, Nama Bisnis, Lokasi, WhatsApp, dan Detail Masalah wajib diisi.");
      return;
    }

    // 2. Text Limitation (Preventing URL truncation)
    let processedMessage = message.trim();
    if (processedMessage.length > 800) {
      processedMessage = processedMessage.substring(0, 800) + '... (selengkapnya saat diskusi)';
    }

    const selectedServices = services.length > 0 ? services.join(', ') : 'Belum spesifik';

    // 3. Professional Message Formatting
    const text = `Halo Chef Anton, saya ingin mengajukan Private Consultancy.\n\n` +
                 `*Nama:* ${name}\n` +
                 `*Bisnis:* ${businessName} (${businessType})\n` +
                 `*Lokasi:* ${location}\n` +
                 `*WhatsApp:* ${whatsapp}\n` +
                 `*Layanan Diminati:* ${selectedServices}\n\n` +
                 `*Kebutuhan/Masalah:* \n${processedMessage}\n\n` +
                 `Mohon informasi ketersediaan jadwal Chef untuk diskusi lebih lanjut. Terima kasih.`;

    // 4. Link Logic & Execution
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
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
            ← Kembali
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

      {/* 2. Partners Section */}
      <Partners partners={partners} />

      {/* 3. Main Form Section */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
            
            {/* Left Column: Benefits & Info */}
            <div className="lg:col-span-5">
              <h2 className="text-4xl font-serif text-slate-900 mb-8">Strategic Advisory</h2>
              <p className="text-slate-500 mb-12 leading-relaxed">
                Chef Anton memiliki batas maksimal proyek konsultasi per bulan untuk menjaga kualitas pengawasan dan akurasi implementasi sistem di lapangan.
              </p>
              
              <div className="space-y-10">
                {[
                  { icon: "📈", title: "Targeted Growth", desc: "Fokus pada kenaikan profit melalui optimasi menu dan kontrol biaya (COGS)." },
                  { icon: "⚙️", title: "Systemic Audit", desc: "Audit menyeluruh terhadap SOP, alur kerja dapur, hingga manajemen inventaris." },
                  { icon: "👨‍🏫", title: "Talent Development", desc: "Pelatihan teknis dan manajerial untuk staf dapur agar memiliki standar tinggi." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 group">
                    <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-gold group-hover:text-white transition-all shadow-sm">
                      {item.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-serif text-xl text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-16 p-8 bg-slate-950 rounded-3xl text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gold/10 rounded-full blur-2xl"></div>
                <p className="text-xs font-black uppercase tracking-widest text-gold mb-4">Direct Access</p>
                <p className="text-lg font-serif italic mb-6">"Efisiensi adalah margin yang tersembunyi. Saya akan membantu Anda menemukannya."</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center">🏆</div>
                  <span className="text-[10px] font-bold uppercase tracking-widest">30+ Years Industry Experience</span>
                </div>
              </div>
            </div>

            {/* Right Column: Inquiry Form */}
            <div className="lg:col-span-7">
              <div className="bg-stone-50 rounded-[3rem] p-8 md:p-12 border border-stone-100 shadow-xl">
                <form onSubmit={handleWhatsAppInquiry} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Lengkap</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white border border-stone-200 px-6 py-4 rounded-xl focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all"
                        placeholder="Contoh: Budi Santoso"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">WhatsApp Aktif</label>
                      <input 
                        type="tel" 
                        required
                        className="w-full bg-white border border-stone-200 px-6 py-4 rounded-xl focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all"
                        placeholder="0812..."
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Nama Bisnis / Brand</label>
                      <input 
                        type="text" 
                        required
                        className="w-full bg-white border border-stone-200 px-6 py-4 rounded-xl focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all"
                        placeholder="Contoh: Resto Nusantara"
                        value={formData.businessName}
                        onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Tipe Bisnis</label>
                      <select 
                        className="w-full bg-white border border-stone-200 px-6 py-4 rounded-xl focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all appearance-none"
                        value={formData.businessType}
                        onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                      >
                        <option>Restaurant / Cafe</option>
                        <option>Hotel Kitchen</option>
                        <option>Catering / Central Kitchen</option>
                        <option>Cloud Kitchen</option>
                        <option>Other / Personal Brand</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Lokasi Bisnis (Kota)</label>
                    <input 
                      type="text" 
                      required
                      className="w-full bg-white border border-stone-200 px-6 py-4 rounded-xl focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all"
                      placeholder="Contoh: Bandung / Jakarta"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Layanan Yang Dibutuhkan</label>
                    <div className="flex flex-wrap gap-2">
                      {serviceOptions.map(service => (
                        <button
                          key={service}
                          type="button"
                          onClick={() => toggleService(service)}
                          className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            services.includes(service) 
                            ? 'bg-gold border-gold text-white shadow-lg' 
                            : 'bg-white border-stone-200 text-slate-400 hover:border-gold/50'
                          }`}
                        >
                          {service}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Detail Kebutuhan / Masalah Utama</label>
                    <textarea 
                      required
                      rows={4}
                      className="w-full bg-white border border-stone-200 px-6 py-4 rounded-xl focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all"
                      placeholder="Jelaskan kendala operasional atau target yang ingin dicapai..."
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                    ></textarea>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-6 bg-slate-950 text-white font-black uppercase tracking-[0.2em] text-[11px] rounded-2xl hover:bg-gold transition-all shadow-2xl flex items-center justify-center gap-3 group"
                  >
                    Send inquiry to Chef Anton
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                  <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-4">
                    Data Anda akan diproses untuk verifikasi kualifikasi awal.
                  </p>
                </form>
              </div>
            </div>
            
          </div>
        </div>
      </section>

      {/* 4. Social Proof Section */}
      <Reviews customReviews={reviews} />

      {/* 5. Trust Bar */}
      <section className="py-20 bg-slate-950 text-white relative overflow-hidden">
         <div className="absolute inset-0 opacity-5 dot-pattern-gold"></div>
         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
           <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center items-center">
             {[
               { val: "30+", label: "Years Exp" },
               { val: "5-Star Reviews", label: "F&B Clients" },
               { val: "High Quality", label: "Standard" },
               { val: "Elite", label: "Advisory" }
             ].map((stat, i) => (
               <div key={i}>
                 <p className="text-3xl md:text-5xl font-serif text-gold mb-1">{stat.val}</p>
                 <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-500">{stat.label}</p>
               </div>
             ))}
           </div>
         </div>
      </section>
    </div>
  );
};

export default ConsultancyDetail;
