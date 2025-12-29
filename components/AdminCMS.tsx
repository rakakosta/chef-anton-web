
import React, { useState, useEffect, useMemo } from 'react';
import { getCMSData, saveCMSData, CMSData, Partner } from '../services/dataService';
import { uploadImageToBlob } from '../services/imageService';
import { ClassType, PortfolioItem, Review, ReviewCategory, CulinaryClass } from '../types';
import { ACTUAL_CHEF_PHOTO } from '../constants';

interface Props {
  onExit: () => void;
}

const InputWrapper = ({ label, children, hint }: { label: string, children: React.ReactNode, hint?: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end px-1">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</label>
      {hint && <span className="text-[8px] text-slate-300 font-bold uppercase">{hint}</span>}
    </div>
    {children}
  </div>
);

const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-stone-100">
    <div>
      <h3 className="text-3xl font-serif font-black text-slate-900 tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-1 italic font-medium">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

const FileUploader = ({ label, sizeGuidance, onUpload, isUploading }: { label: string, sizeGuidance: string, onUpload: (base64: string) => void, isUploading?: boolean }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onUpload(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block">{label}</label>
      <div className="flex flex-col gap-3">
        <div className="relative group w-full">
          <input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            className="w-full text-[10px] text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-stone-100 file:text-slate-900 hover:file:bg-gold hover:file:text-white transition-all cursor-pointer disabled:opacity-50"
            onChange={handleFile}
          />
          {isUploading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <div className="px-3 py-2 bg-stone-50 rounded-xl border border-stone-100 w-fit">
          <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Ratio: <span className="text-gold">{sizeGuidance}</span></p>
        </div>
      </div>
    </div>
  );
};

/**
 * WorkshopFormItem Component
 */
const WorkshopFormItem = ({ 
  ws, 
  updateListItem, 
  removeItem, 
  uploadingField, 
  handleImageUpload 
}: { 
  ws: CulinaryClass, 
  updateListItem: (field: keyof CMSData, id: string, updates: any) => void,
  removeItem: (field: keyof CMSData, id: string) => void,
  uploadingField: string | null,
  handleImageUpload: (field: string, base64: string, filename: string) => void
}) => (
  <div key={ws.id} className={`group bg-white p-8 md:p-10 rounded-[3rem] border border-stone-200 flex flex-col lg:flex-row gap-12 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-gold/30 mb-10 animate-in fade-in slide-in-from-bottom-6 ${ws.isHistorical ? 'bg-stone-50/30' : ''}`}>
    <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
      <div className={`relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-stone-100 shadow-2xl border-8 border-white transition-all duration-700 ${ws.isHistorical ? 'grayscale opacity-60 scale-95' : 'group-hover:scale-105'}`}>
        <img src={ws.image} className="w-full h-full object-cover" alt="" />
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className={`px-4 py-1.5 rounded-full text-[7px] font-black uppercase tracking-widest shadow-lg ${ws.isHistorical ? 'bg-slate-800 text-white' : 'bg-red-600 text-white'}`}>
             {ws.isHistorical ? 'Archived' : 'Live Batch'}
          </span>
          {!ws.isHistorical && (
            <span className="px-4 py-1.5 bg-white text-slate-900 rounded-full text-[7px] font-black uppercase tracking-widest shadow-lg">
              {ws.slots} Slots Left
            </span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 p-6">
           <p className="text-white font-serif text-lg leading-tight line-clamp-2">{ws.title || 'Draft Title'}</p>
        </div>
      </div>
      <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest text-center italic">Live Preview Representation</p>
    </div>
    
    <div className="flex-grow space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-6">
         <div className={`flex items-center gap-3 px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg transition-all ${ws.isHistorical ? 'bg-slate-200 text-slate-500 shadow-slate-100' : 'bg-red-600 text-white shadow-red-100 animate-pulse'}`}>
           {ws.isHistorical ? '📁 Archived Session' : '🔴 Accepting Enrollment'}
         </div>
         <div className="flex items-center gap-4 bg-stone-100 p-3 px-6 rounded-2xl border border-stone-200 hover:bg-white transition-all cursor-pointer">
            <input 
              type="checkbox" 
              id={`check-${ws.id}`}
              className="w-6 h-6 text-gold rounded-lg border-stone-300 focus:ring-4 focus:ring-gold/10 cursor-pointer"
              checked={ws.isHistorical || false} 
              onChange={(e) => updateListItem('workshops', ws.id, { isHistorical: e.target.checked })} 
            />
            <label htmlFor={`check-${ws.id}`} className="text-[11px] font-black uppercase text-slate-500 cursor-pointer tracking-wider">Historical Batch</label>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-2">
          <InputWrapper label="Workshop Title (Judul Sesi)">
            <input className="w-full font-serif text-3xl font-black bg-stone-50/50 p-6 rounded-2xl border border-stone-100 focus:bg-white focus:ring-8 focus:ring-gold/5 focus:border-gold outline-none transition-all" value={ws.title} onChange={(e) => updateListItem('workshops', ws.id, { title: e.target.value })} />
          </InputWrapper>
        </div>

        <InputWrapper label="Tanggal Pelaksanaan">
          <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-bold focus:bg-white focus:border-gold outline-none transition-all" value={ws.displayDate || ''} placeholder="Contoh: 20 Oktober 2024" onChange={(e) => updateListItem('workshops', ws.id, { displayDate: e.target.value })} />
        </InputWrapper>

        <InputWrapper label="Lokasi / Sesi">
          <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-bold focus:bg-white focus:border-gold outline-none transition-all" value={ws.location || ''} placeholder="Contoh: Jakarta / Zoom Live" onChange={(e) => updateListItem('workshops', ws.id, { location: e.target.value })} />
        </InputWrapper>

        {ws.isHistorical ? (
          <div className="col-span-2">
            <div className="bg-gold/10 p-10 rounded-[3rem] border border-gold/20 shadow-inner">
              <InputWrapper label="Total Alumni Terdaftar (Real Attendance)" hint="Hanya muncul untuk arsip historis">
                <div className="flex items-center gap-6 mt-2">
                  <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center text-4xl shadow-xl border border-gold/10">👥</div>
                  <input className="w-full bg-white border-2 border-gold/20 p-6 rounded-2xl text-5xl font-black text-slate-900 focus:ring-8 focus:ring-gold/5 focus:border-gold outline-none transition-all" type="number" placeholder="0" value={ws.realAttendance || 0} onChange={(e) => updateListItem('workshops', ws.id, { realAttendance: Number(e.target.value) })} />
                </div>
              </InputWrapper>
            </div>
          </div>
        ) : (
          <>
            <InputWrapper label="Harga (IDR)">
              <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-black focus:bg-white focus:border-gold transition-all outline-none" type="number" value={ws.price} onChange={(e) => updateListItem('workshops', ws.id, { price: Number(e.target.value) })} />
            </InputWrapper>
            <InputWrapper label="Harga Coret (IDR)">
              <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-medium text-slate-400 focus:bg-white focus:border-gold transition-all outline-none" type="number" value={ws.priceBeforeDiscount || 0} onChange={(e) => updateListItem('workshops', ws.id, { priceBeforeDiscount: Number(e.target.value) })} />
            </InputWrapper>
            <InputWrapper label="Durasi">
              <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-bold focus:bg-white focus:border-gold transition-all outline-none" value={ws.duration} onChange={(e) => updateListItem('workshops', ws.id, { duration: e.target.value })} />
            </InputWrapper>
            <InputWrapper label="Slots Available">
              <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-bold focus:bg-white focus:border-gold transition-all outline-none" type="number" value={ws.slots || 0} onChange={(e) => updateListItem('workshops', ws.id, { slots: Number(e.target.value) })} />
            </InputWrapper>
            <div className="col-span-2">
              <InputWrapper label="Curriculum (Gunakan baris baru untuk setiap poin)">
                <textarea className="w-full bg-stone-50/50 border border-stone-100 p-6 rounded-2xl text-xs h-44 leading-relaxed font-medium focus:bg-white focus:border-gold transition-all outline-none" value={ws.curriculum?.join('\n')} onChange={(e) => updateListItem('workshops', ws.id, { curriculum: e.target.value.split('\n') })} />
              </InputWrapper>
            </div>
          </>
        )}
      </div>
      
      <div className="flex flex-wrap items-center gap-10 pt-10 border-t border-stone-100">
        <FileUploader 
          label={ws.isHistorical ? "Update Foto Dokumentasi" : "Update Poster Utama"} 
          sizeGuidance="Portrait 3:4" 
          isUploading={uploadingField === `workshops:${ws.id}`} 
          onUpload={(b) => handleImageUpload(`workshops:${ws.id}`, b, 'workshop.jpg')} 
        />
        <button 
          onClick={() => removeItem('workshops', ws.id)} 
          className="px-8 py-4 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all transform active:scale-95 shadow-sm"
        >
          ❌ Delete Sesi
        </button>
      </div>
    </div>
  </div>
);

/**
 * PartnerItem Component
 */
const PartnerItem = ({ 
  partner, 
  updateListItem, 
  removeItem, 
  uploadingField, 
  handleImageUpload 
}: { 
  partner: Partner, 
  updateListItem: (field: keyof CMSData, id: string, updates: any) => void,
  removeItem: (field: keyof CMSData, id: string) => void,
  uploadingField: string | null,
  handleImageUpload: (field: string, base64: string, filename: string) => void
}) => (
  <div key={partner.id} className="bg-white p-8 rounded-[3.5rem] border border-stone-200 flex flex-col gap-8 shadow-sm group hover:shadow-2xl hover:border-gold/40 transition-all">
    <div className="w-full h-44 bg-stone-50 rounded-[2.5rem] flex items-center justify-center text-7xl border border-stone-100 overflow-hidden relative group-hover:bg-white transition-colors">
      {partner.logo.length < 10 ? partner.logo : <img src={partner.logo} className="w-full h-full object-contain p-8" alt="" />}
    </div>
    <div className="space-y-6 flex-grow flex flex-col">
      <InputWrapper label="Partner Name">
         <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-center focus:bg-white focus:border-gold outline-none transition-all" value={partner.name} placeholder="Name" onChange={(e) => updateListItem('partners', partner.id, { name: e.target.value })} />
      </InputWrapper>
      
      <div className="flex-grow">
        <FileUploader 
          label="Update Logo" 
          sizeGuidance="PNG Transparent" 
          isUploading={uploadingField === `partners:${partner.id}`} 
          onUpload={(b) => handleImageUpload(`partners:${partner.id}`, b, 'partner-logo.png')} 
        />
      </div>

      <button onClick={() => removeItem('partners', partner.id)} className="w-full text-red-400 text-[10px] font-black uppercase tracking-widest py-4 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100">
        ❌ Remove Partner
      </button>
    </div>
  </div>
);

const AdminCMS: React.FC<Props> = ({ onExit }) => {
  const [data, setData] = useState<CMSData | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'profile' | 'partners' | 'workshops' | 'recorded' | 'portfolio' | 'reviews' | 'footer'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);

  const navItems = [
    { id: 'hero', label: 'Landing Hero', icon: '🏠' },
    { id: 'profile', label: 'Chef Profile', icon: '👨‍🍳' },
    { id: 'partners', label: 'Partners', icon: '🤝' },
    { id: 'workshops', label: 'Workshops', icon: '🎥' },
    { id: 'recorded', label: 'Academy', icon: '📀' },
    { id: 'portfolio', label: 'Portfolio', icon: '💼' },
    { id: 'reviews', label: 'Reviews', icon: '⭐' },
    { id: 'footer', label: 'Footer Links', icon: '🔗' },
  ];

  useEffect(() => {
    const init = async () => {
      const d = await getCMSData();
      setData(d);
    };
    init();
  }, []);

  const handleSave = async () => {
    if (!data) return;
    setIsSaving(true);
    try {
      await saveCMSData(data);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err) {
      alert("Gagal mempublikasikan perubahan.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof CMSData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleImageUpload = async (field: string, base64: string, filename: string) => {
    if (!data) return;
    setUploadingField(field);
    try {
      const url = await uploadImageToBlob(base64, filename);
      if (field === 'heroImage' || field === 'chefProfileImage') {
        updateField(field as keyof CMSData, url);
      } else if (field.includes(':')) {
        const [listKey, id] = field.split(':');
        const list = [...(data[listKey as keyof CMSData] as any[])];
        const index = list.findIndex(item => String(item.id) === String(id));
        if (index !== -1) {
          // Safeguard: only update existing properties based on list type
          if (listKey === 'partners') {
            list[index].logo = url;
          } else if (listKey === 'reviews') {
            list[index].avatar = url;
          } else {
            list[index].image = url;
          }
          setData({ ...data, [listKey as keyof CMSData]: list });
        }
      }
    } finally {
      setUploadingField(null);
    }
  };

  const updateListItem = (field: keyof CMSData, id: string, updates: any) => {
    if (!data) return;
    setData({
      ...data,
      [field]: (data[field] as any[]).map(item => item.id === id ? { ...item, ...updates } : item)
    });
  };

  const addItem = (field: keyof CMSData, newItem: any) => {
    if (!data) return;
    setData({ ...data, [field]: [newItem, ...(data[field] as any[])] });
  };

  const removeItem = (field: keyof CMSData, id: string) => {
    if (!data) return;
    if (window.confirm("Apakah Anda yakin ingin menghapus data ini secara permanen?")) {
      setData({ ...data, [field]: (data[field] as any[]).filter(item => item.id !== id) });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex font-sans overflow-hidden selection:bg-gold/20">
      {/* Enhanced Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-80 bg-slate-950 text-white flex flex-col shadow-2xl z-50 transform transition-all duration-500 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-12 border-b border-white/5 relative">
           <div className="absolute top-10 right-10 w-20 h-20 bg-gold/5 rounded-full blur-3xl"></div>
           <div className="w-14 h-14 bg-gradient-to-br from-gold to-amber-700 rounded-[1.2rem] mb-6 shadow-2xl shadow-gold/20 flex items-center justify-center text-3xl transform hover:rotate-12 transition-transform">👨‍🍳</div>
           <h1 className="text-3xl font-serif font-black text-gold uppercase tracking-tighter leading-none">Chef Portal</h1>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-3 italic">Management Console</p>
        </div>
        
        <nav className="flex-grow p-8 space-y-2 overflow-y-auto">
          {navItems.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => {setActiveTab(tab.id as any); setIsSidebarOpen(false);}} 
              className={`w-full flex items-center gap-5 px-7 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group overflow-hidden ${activeTab === tab.id ? 'bg-gold text-white shadow-2xl shadow-gold/20 translate-x-2' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`text-xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-125' : 'group-hover:scale-110'}`}>{tab.icon}</span> 
              {tab.label}
              {activeTab === tab.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-white animate-in slide-in-from-right duration-500"></div>
              )}
            </button>
          ))}
        </nav>
        
        <div className="p-8 border-t border-white/5">
          <button onClick={onExit} className="w-full py-5 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/10 group flex items-center justify-center gap-3">
             <span className="group-hover:-translate-x-1 transition-transform">←</span> Back to Site
          </button>
        </div>
      </aside>

      {/* Main UI Area */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white/90 backdrop-blur-xl border-b border-stone-100 h-28 flex items-center justify-between px-12 shrink-0 sticky top-0 z-40 shadow-sm">
          <div className="flex items-center gap-6">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-900 p-3 bg-stone-100 rounded-2xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
             <div>
               <h2 className="text-[11px] font-black text-gold uppercase tracking-[0.4em]">Configuration Mode</h2>
               <p className="text-2xl font-serif font-black text-slate-900 uppercase tracking-widest mt-0.5">{activeTab}</p>
             </div>
          </div>
          
          <div className="flex items-center gap-6">
            <button 
              onClick={handleSave} 
              disabled={isSaving} 
              className={`group flex items-center gap-4 px-10 py-5 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gold transition-all shadow-xl shadow-slate-200 disabled:opacity-50 transform active:scale-95`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Syncing Changes...
                </>
              ) : (
                <>
                  <span className="text-xl group-hover:animate-bounce">⚡</span> Publish Updates
                </>
              )}
            </button>
          </div>
        </header>

        <main className="p-12 overflow-y-auto flex-grow">
           {isSaved && (
             <div className="mb-10 p-8 bg-green-500 text-white rounded-[2.5rem] text-center font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl shadow-green-100 animate-in zoom-in-95 flex items-center justify-center gap-4">
               <span className="text-2xl">✨</span> Data synchronized to production successfully!
             </div>
           )}
           
           <div className="max-w-7xl mx-auto pb-20">
             {activeTab === 'hero' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="lg:col-span-7 bg-white p-12 rounded-[4rem] border border-stone-200 space-y-10 shadow-sm">
                    <SectionHeader title="Hero Branding" subtitle="Konfigurasi visual dan teks utama pada landing page." />
                    
                    <InputWrapper label="Landing Title (Headline Utama)">
                      <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-2xl font-serif font-black focus:bg-white focus:ring-8 focus:ring-gold/5 focus:border-gold outline-none transition-all" value={data?.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} />
                    </InputWrapper>
                    
                    <InputWrapper label="Landing Subtitle (Penjelasan Singkat)">
                      <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-44 leading-relaxed font-medium focus:bg-white focus:ring-8 focus:ring-gold/5 focus:border-gold outline-none transition-all" value={data?.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
                    </InputWrapper>
                    
                    <div className="pt-10 border-t border-stone-100 space-y-10">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold flex items-center gap-4">
                        <span className="w-10 h-0.5 bg-gold/30"></span> Feature Navigation Cards
                      </h3>
                      
                      {[
                        { title: 'heroCTA_Workshop_Title', desc: 'heroCTA_Workshop_Desc', icon: '🎥', label: 'Workshop Session', color: 'bg-red-50', text: 'text-red-600' },
                        { title: 'heroCTA_Recorded_Title', desc: 'heroCTA_Recorded_Desc', icon: '📀', label: 'Academy Series', color: 'bg-gold/10', text: 'text-gold' },
                        { title: 'heroCTA_Consultancy_Title', desc: 'heroCTA_Consultancy_Desc', icon: '🛡️', label: 'B2B Consultancy', color: 'bg-slate-100', text: 'text-slate-900' }
                      ].map((card, idx) => (
                        <div key={idx} className="bg-stone-50/50 p-10 rounded-[3rem] border border-stone-100 space-y-6 transition-all hover:bg-white hover:shadow-xl group">
                          <div className="flex items-center gap-5">
                             <div className={`w-14 h-14 ${card.color} ${card.text} rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>{card.icon}</div>
                             <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900">{card.label}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <InputWrapper label="Card Title">
                              <input className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 text-xs font-bold focus:border-gold outline-none transition-all" value={(data as any)?.[card.title]} onChange={(e) => updateField(card.title as any, e.target.value)} />
                            </InputWrapper>
                            <InputWrapper label="Card Description">
                              <input className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 text-xs font-medium focus:border-gold outline-none transition-all" value={(data as any)?.[card.desc]} onChange={(e) => updateField(card.desc as any, e.target.value)} />
                            </InputWrapper>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="lg:col-span-5 bg-white p-12 rounded-[4rem] border border-stone-200 flex flex-col items-center shadow-sm h-fit sticky top-40">
                    <SectionHeader title="Visual Assets" />
                    <div className="relative group mb-12">
                      <div className="absolute -inset-6 bg-gold/10 rounded-[4rem] blur-3xl group-hover:bg-gold/20 transition-all"></div>
                      <div className="relative aspect-[3/4] w-80 rounded-[3.5rem] overflow-hidden shadow-2xl bg-stone-100 border-8 border-white group-hover:scale-[1.03] transition-transform duration-700">
                        <img src={data?.heroImage} className="w-full h-full object-cover object-top" alt="Hero" />
                      </div>
                    </div>
                    <FileUploader label="Upload Hero Portrait" sizeGuidance="Portrait 3:4" isUploading={uploadingField === 'heroImage'} onUpload={(b) => handleImageUpload('heroImage', b, 'hero-image.jpg')} />
                  </div>
                </div>
             )}

             {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  <div className="lg:col-span-7 bg-white p-12 rounded-[4rem] border border-stone-200 space-y-10 shadow-sm">
                    <SectionHeader title="Professional Profile" subtitle="Profil biografi lengkap Chef Anton." />
                    <InputWrapper label="Chef Full Name">
                      <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm font-black tracking-[0.2em] focus:bg-white focus:border-gold outline-none transition-all" value={data?.chefName} onChange={(e) => updateField('chefName', e.target.value)} />
                    </InputWrapper>
                    <InputWrapper label="Professional Title (Gelar)">
                      <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm font-bold focus:bg-white focus:border-gold outline-none transition-all" value={data?.chefTitle} onChange={(e) => updateField('chefTitle', e.target.value)} />
                    </InputWrapper>
                    <InputWrapper label="Signature Bio Quote">
                      <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-32 italic font-serif leading-relaxed focus:bg-white focus:border-gold outline-none transition-all" value={data?.chefBioQuote} onChange={(e) => updateField('chefBioQuote', e.target.value)} />
                    </InputWrapper>
                    <InputWrapper label="Detailed Biography (Legacy)">
                      <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-96 leading-relaxed font-medium focus:bg-white focus:border-gold outline-none transition-all" value={data?.chefBio} onChange={(e) => updateField('chefBio', e.target.value)} />
                    </InputWrapper>
                  </div>
                  <div className="lg:col-span-5 bg-white p-12 rounded-[4rem] border border-stone-200 flex flex-col items-center shadow-sm h-fit sticky top-40">
                    <SectionHeader title="Official Portrait" />
                    <div className="aspect-[3/4] w-80 rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 bg-stone-100 border-8 border-white hover:rotate-2 transition-transform duration-500">
                      <img src={data?.chefProfileImage} className="w-full h-full object-cover object-top" alt="Chef Profile" />
                    </div>
                    <FileUploader label="Upload Bio Photo" sizeGuidance="Portrait 3:4" isUploading={uploadingField === 'chefProfileImage'} onUpload={(b) => handleImageUpload('chefProfileImage', b, 'chef-portrait.jpg')} />
                  </div>
                </div>
             )}

             {activeTab === 'workshops' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <SectionHeader 
                   title="Workshop Masterlist" 
                   subtitle="Manajemen sesi workshop aktif maupun batch historis dalam satu platform."
                   action={
                     <button onClick={() => addItem('workshops', { id: `ws-${Date.now()}`, title: 'Sesi Kuliner Baru', description: 'Intensive culinary training.', price: 1500000, type: ClassType.LIVE, image: ACTUAL_CHEF_PHOTO, duration: '4 Hours', level: 'Professional', isHistorical: false, curriculum: [], slots: 10, displayDate: '', location: '', realAttendance: 0 })} className="group px-12 py-5 bg-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-gold/20 transform active:scale-95">
                        <span className="inline-block transition-transform group-hover:rotate-90 mr-3">+</span> Create New Batch
                     </button>
                   }
                 />
                 <div className="space-y-4">
                   {data?.workshops.map(ws => (
                     <WorkshopFormItem 
                        key={ws.id} 
                        ws={ws} 
                        updateListItem={updateListItem} 
                        removeItem={removeItem} 
                        uploadingField={uploadingField}
                        handleImageUpload={handleImageUpload}
                     />
                   ))}
                 </div>
                 {data?.workshops.length === 0 && (
                   <div className="py-48 border-4 border-dashed border-stone-200 rounded-[5rem] text-center bg-white/50 transition-all hover:bg-white hover:border-gold/30">
                      <div className="text-7xl mb-8 grayscale group-hover:grayscale-0 animate-bounce">🍳</div>
                      <p className="text-slate-400 font-serif italic text-3xl">Belum ada workshop yang terdaftar.</p>
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 mt-4">Klik tombol di atas untuk memulai sesi pertama Anda.</p>
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'partners' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <SectionHeader 
                   title="Trusted Partners" 
                   subtitle="Kelola daftar klien dan kolaborasi institusi." 
                   action={
                     <button onClick={() => addItem('partners', { id: `p-${Date.now()}`, name: 'New Partner', logo: '🏢' })} className="px-10 py-5 bg-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl transform active:scale-95">
                        + Add New Partner
                     </button>
                   }
                 />
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                   {data?.partners.map(p => (
                     <PartnerItem 
                        key={p.id} 
                        partner={p} 
                        updateListItem={updateListItem} 
                        removeItem={removeItem} 
                        uploadingField={uploadingField}
                        handleImageUpload={handleImageUpload}
                     />
                   ))}
                 </div>
                 {data?.partners.length === 0 && (
                   <div className="py-24 text-center border-2 border-dashed border-stone-200 rounded-[3.5rem] bg-white">
                      <p className="text-slate-400 font-serif italic text-xl">Belum ada partner terdaftar.</p>
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'recorded' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <SectionHeader 
                   title="Academy Masterclasses" 
                   subtitle="Manajemen modul video belajar mandiri." 
                   action={
                     <button onClick={() => addItem('recordedClasses', { id: `rc-${Date.now()}`, title: 'New Masterclass', description: 'Elite culinary education.', price: 500000, type: ClassType.RECORDED, image: ACTUAL_CHEF_PHOTO, duration: '12 Videos', level: 'Beginner', soldCount: 0 })} className="px-10 py-5 bg-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-gold/20 transform active:scale-95">
                        + Add To Academy
                     </button>
                   }
                 />
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {data?.recordedClasses.map(rc => (
                     <div key={rc.id} className="bg-white p-10 rounded-[4rem] border border-stone-200 flex flex-col gap-10 shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
                        <div className="aspect-video w-full rounded-[3rem] overflow-hidden bg-stone-100 border-8 border-white shadow-2xl group-hover:scale-[1.03] transition-transform duration-700">
                          <img src={rc.image} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div className="space-y-8">
                          <InputWrapper label="Masterclass Title">
                            <input className="w-full font-serif text-2xl font-black bg-stone-50 p-6 rounded-2xl border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={rc.title} onChange={(e) => updateListItem('recordedClasses', rc.id, { title: e.target.value })} />
                          </InputWrapper>
                          <div className="grid grid-cols-2 gap-6">
                            <InputWrapper label="Investment Price (IDR)">
                               <input className="w-full bg-stone-50 p-4 rounded-xl text-sm font-black border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" type="number" value={rc.price} onChange={(e) => updateListItem('recordedClasses', rc.id, { price: Number(e.target.value) })} />
                            </InputWrapper>
                            <InputWrapper label="Module / Duration">
                               <input className="w-full bg-stone-50 p-4 rounded-xl text-sm font-bold border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={rc.duration} onChange={(e) => updateListItem('recordedClasses', rc.id, { duration: e.target.value })} />
                            </InputWrapper>
                            <InputWrapper label="Enrollment Count">
                               <input className="w-full bg-stone-50 p-4 rounded-xl text-sm border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" type="number" value={rc.soldCount || 0} onChange={(e) => updateListItem('recordedClasses', rc.id, { soldCount: Number(e.target.value) })} />
                            </InputWrapper>
                            <InputWrapper label="Proficiency Level">
                               <select className="w-full bg-stone-50 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all cursor-pointer" value={rc.level} onChange={(e) => updateListItem('recordedClasses', rc.id, { level: e.target.value })}>
                                  <option>Beginner</option>
                                  <option>Professional</option>
                                  <option>Executive</option>
                               </select>
                            </InputWrapper>
                          </div>
                          <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-stone-100">
                            <FileUploader label="Update Cover" sizeGuidance="16:9 Landscape" isUploading={uploadingField === `recordedClasses:${rc.id}`} onUpload={(b) => handleImageUpload(`recordedClasses:${rc.id}`, b, 'academy-cover.jpg')} />
                            <button onClick={() => removeItem('recordedClasses', rc.id)} className="px-8 py-4 text-red-400 text-[10px] font-black uppercase hover:bg-red-50 rounded-2xl ml-auto transition-all">❌ Remove</button>
                          </div>
                        </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {activeTab === 'portfolio' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <SectionHeader 
                   title="Portfolio Showcase" 
                   subtitle="Galeri proyek strategis dan dokumentasi operasional elit." 
                   action={
                     <button onClick={() => addItem('portfolio', { id: `p-${Date.now()}`, title: 'Grand Strategic Project', category: 'Global Hospitality', image: ACTUAL_CHEF_PHOTO, aiPrompt: '' })} className="px-10 py-5 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gold transition-all shadow-xl transform active:scale-95">
                        + Add Project Item
                     </button>
                   }
                 />
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                   {data?.portfolio.map(item => (
                     <div key={item.id} className="bg-white p-10 rounded-[4rem] border border-stone-200 space-y-10 shadow-sm group hover:shadow-2xl transition-all">
                       <div className="aspect-[16/10] rounded-[3rem] overflow-hidden bg-stone-100 border-8 border-white shadow-2xl group-hover:scale-[1.02] transition-transform duration-700">
                         <img src={item.image} className="w-full h-full object-cover" alt="" />
                       </div>
                       <div className="space-y-8">
                         <InputWrapper label="Project Title (Nama Proyek)">
                           <input className="w-full font-serif font-black text-3xl bg-stone-50 p-6 rounded-2xl border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={item.title} onChange={(e) => updateListItem('portfolio', item.id, { title: e.target.value })} />
                         </InputWrapper>
                         <InputWrapper label="Industry / Legacy Category">
                           <input className="w-full text-[11px] font-black uppercase tracking-[0.4em] text-gold bg-stone-50 p-6 rounded-2xl border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={item.category} onChange={(e) => updateListItem('portfolio', item.id, { category: e.target.value })} />
                         </InputWrapper>
                         <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-stone-100">
                           <FileUploader label="Update Image Asset" sizeGuidance="16:10 Landscape" isUploading={uploadingField === `portfolio:${item.id}`} onUpload={(b) => handleImageUpload(`portfolio:${item.id}`, b, 'portfolio.jpg')} />
                           <button onClick={() => removeItem('portfolio', item.id)} className="px-8 py-4 text-red-400 text-[10px] font-black uppercase hover:bg-red-50 rounded-2xl ml-auto transition-all">❌ Delete Item</button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {activeTab === 'reviews' && (
               <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
                 <SectionHeader 
                   title="Testimonial Engine" 
                   subtitle="Manajemen jejak kepercayaan alumni dan klien B2B." 
                   action={
                     <button onClick={() => addItem('reviews', { id: `r-${Date.now()}`, name: 'New Elite Alumni', role: 'Executive Chef', comment: 'Luar biasa membantu operasional.', avatar: 'https://i.pravatar.cc/150', category: 'Live Workshop' })} className="px-10 py-5 bg-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-gold/20 transform active:scale-95">
                        + Add Alumni Review
                     </button>
                   }
                 />
                 <div className="space-y-10">
                   {data?.reviews.map(rev => (
                     <div key={rev.id} className="bg-white p-12 rounded-[4.5rem] border border-stone-200 flex flex-col md:flex-row gap-16 shadow-sm hover:shadow-2xl transition-all group relative">
                       <div className="flex flex-col items-center gap-8 flex-shrink-0">
                          <div className="w-44 h-44 rounded-[3.5rem] overflow-hidden border-8 border-stone-50 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3">
                            <img src={rev.avatar} className="w-full h-full object-cover" alt="" />
                          </div>
                          <FileUploader label="Alumni Photo" sizeGuidance="Square 1:1" isUploading={uploadingField === `reviews:${rev.id}`} onUpload={(b) => handleImageUpload(`reviews:${rev.id}`, b, 'avatar.jpg')} />
                       </div>
                       <div className="flex-grow space-y-10">
                         <div className="grid grid-cols-2 gap-10">
                           <InputWrapper label="Alumni Full Name">
                             <input className="w-full font-black text-slate-900 bg-stone-50 p-6 rounded-2xl text-base border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={rev.name} onChange={(e) => updateListItem('reviews', rev.id, { name: e.target.value })} />
                           </InputWrapper>
                           <InputWrapper label="Profession / Enterprise">
                             <input className="w-full font-bold text-gold bg-stone-50 p-6 rounded-2xl text-[11px] uppercase tracking-[0.2em] border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={rev.role} onChange={(e) => updateListItem('reviews', rev.id, { role: e.target.value })} />
                           </InputWrapper>
                         </div>
                         <InputWrapper label="Review Message (Testimoni)">
                           <textarea className="w-full bg-stone-50 p-8 rounded-[3rem] text-sm h-48 italic border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all leading-loose" value={rev.comment} onChange={(e) => updateListItem('reviews', rev.id, { comment: e.target.value })} />
                         </InputWrapper>
                         <div className="flex flex-wrap items-center gap-12 pt-10 border-t border-stone-100">
                            <InputWrapper label="Review Source Category">
                              <select className="bg-slate-950 text-white px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl outline-none border border-white/10 cursor-pointer" value={rev.category} onChange={(e) => updateListItem('reviews', rev.id, { category: e.target.value as ReviewCategory })}>
                                <option>Live Workshop</option>
                                <option>Kelas Rekaman</option>
                                <option>Private Consultancy</option>
                              </select>
                            </InputWrapper>
                            <button onClick={() => removeItem('reviews', rev.id)} className="ml-auto px-8 py-4 bg-red-50 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all">❌ Remove Review</button>
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               </div>
             )}

             {activeTab === 'footer' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
                  {[data?.footerEducation, data?.footerB2B].map((cat, idx) => (
                    <div key={idx} className="bg-white p-12 rounded-[4rem] border border-stone-200 space-y-12 shadow-sm transition-all hover:shadow-2xl group">
                      <SectionHeader title={cat?.title || 'Navigation'} subtitle="Kelola link cepat di bagian bawah website." />
                      <div className="space-y-8">
                        {cat?.links.map(link => (
                          <div key={link.id} className="flex flex-col md:flex-row gap-6 p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 group/link hover:bg-white hover:border-gold/30 transition-all shadow-sm">
                            <div className="flex-grow space-y-3">
                               <InputWrapper label="Display Label">
                                 <input className="w-full bg-white border border-stone-200 p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:border-gold outline-none transition-all" value={link.label} onChange={(e) => {
                                  const targetField = idx === 0 ? 'footerEducation' : 'footerB2B';
                                  const newLinks = (data?.[targetField] as any).links.map((l: any) => l.id === link.id ? { ...l, label: e.target.value } : l);
                                  updateField(targetField, { ...(data?.[targetField] as any), links: newLinks });
                                }} />
                               </InputWrapper>
                            </div>
                            <div className="md:w-72 space-y-3">
                               <InputWrapper label="Destination URL (Anchor)">
                                 <input className="w-full bg-stone-100 p-5 rounded-2xl text-[10px] text-slate-500 font-mono focus:bg-white focus:border-gold outline-none transition-all border border-stone-200" value={link.url} onChange={(e) => {
                                  const targetField = idx === 0 ? 'footerEducation' : 'footerB2B';
                                  const newLinks = (data?.[targetField] as any).links.map((l: any) => l.id === link.id ? { ...l, url: e.target.value } : l);
                                  updateField(targetField, { ...(data?.[targetField] as any), links: newLinks });
                                }} />
                               </InputWrapper>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
             )}
           </div>
           
           <div className="mt-24 pt-12 border-t border-stone-200 text-center">
             <div className="flex items-center justify-center gap-8 mb-8">
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-ping"></div>
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-ping delay-150"></div>
                <div className="w-1.5 h-1.5 bg-gold rounded-full animate-ping delay-300"></div>
             </div>
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">Elite Culinary Branding System v7.5 • Premium Enterprise Access</p>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCMS;
