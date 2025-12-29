
import React, { useState, useEffect, useMemo } from 'react';
import { getCMSData, saveCMSData, CMSData, Partner } from '../services/dataService';
import { uploadImageToBlob } from '../services/imageService';
import { ClassType, PortfolioItem, Review, ReviewCategory, CulinaryClass } from '../types';
import { ACTUAL_CHEF_PHOTO } from '../constants';

interface Props {
  onExit: () => void;
}

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
    <div className="space-y-3 flex-grow">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block">{label}</label>
      <div className="flex flex-col gap-2">
        <div className="relative group">
          <input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            className="w-full text-[10px] text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-slate-100 file:text-slate-900 hover:file:bg-gold hover:file:text-white transition-all cursor-pointer disabled:opacity-50"
            onChange={handleFile}
          />
          {isUploading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <div className="px-3 py-2 bg-stone-50 rounded-lg border border-stone-100">
          <p className="text-[8px] text-slate-400 uppercase font-bold tracking-widest">Ratio: <span className="text-gold">{sizeGuidance}</span></p>
        </div>
      </div>
    </div>
  );
};

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
      alert("Gagal menyimpan perubahan.");
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
          list[index].image = url;
          if (listKey === 'reviews') list[index].avatar = url;
          if (listKey === 'partners') list[index].logo = url;
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
    if (window.confirm("Apakah Anda yakin ingin menghapus item ini?")) {
      setData({ ...data, [field]: (data[field] as any[]).filter(item => item.id !== id) });
    }
  };

  const WorkshopFormItem = ({ ws }: { ws: CulinaryClass }) => (
    <div key={ws.id} className={`group bg-white p-8 md:p-10 rounded-[2.5rem] border border-stone-200 flex flex-col lg:flex-row gap-10 shadow-sm transition-all duration-500 hover:shadow-xl hover:border-gold/30 mb-8 animate-in fade-in slide-in-from-bottom-4 ${ws.isHistorical ? 'bg-stone-50/50' : ''}`}>
      <div className={`w-full lg:w-72 aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-100 shadow-xl flex-shrink-0 border-4 border-white transition-all duration-700 ${ws.isHistorical ? 'grayscale opacity-70 scale-95' : 'group-hover:scale-105'}`}>
        <img src={ws.image} className="w-full h-full object-cover" alt="" />
      </div>
      
      <div className="flex-grow space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
           <div className="flex items-center gap-3">
             <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-widest transition-colors ${ws.isHistorical ? 'bg-slate-200 text-slate-500' : 'bg-red-600 text-white shadow-lg shadow-red-200'}`}>
               {ws.isHistorical ? '📁 Historical Archive' : '🔴 Active Workshop'}
             </span>
           </div>
           <div className="flex items-center gap-3 bg-stone-100 p-2 px-4 rounded-2xl border border-stone-200 transition-colors hover:bg-white">
              <input 
                type="checkbox" 
                id={`check-${ws.id}`}
                className="w-5 h-5 text-gold rounded border-stone-300 focus:ring-gold cursor-pointer"
                checked={ws.isHistorical || false} 
                onChange={(e) => updateListItem('workshops', ws.id, { isHistorical: e.target.checked })} 
              />
              <label htmlFor={`check-${ws.id}`} className="text-[10px] font-black uppercase text-slate-500 cursor-pointer tracking-wider">Archive this session</label>
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Workshop Title (Judul)</label>
            <input 
              className="w-full font-serif text-2xl font-black bg-stone-50/50 p-5 rounded-2xl border border-stone-100 focus:bg-white focus:ring-4 focus:ring-gold/5 focus:border-gold outline-none transition-all" 
              value={ws.title} 
              onChange={(e) => updateListItem('workshops', ws.id, { title: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Tanggal Pelaksanaan</label>
            <input 
              className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-medium focus:bg-white focus:border-gold outline-none transition-all" 
              value={ws.displayDate || ''} 
              placeholder="Contoh: 20 Oktober 2024" 
              onChange={(e) => updateListItem('workshops', ws.id, { displayDate: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Lokasi / Sesi</label>
            <input 
              className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-medium focus:bg-white focus:border-gold outline-none transition-all" 
              value={ws.location || ''} 
              placeholder="Contoh: Jakarta / Zoom Live" 
              onChange={(e) => updateListItem('workshops', ws.id, { location: e.target.value })} 
            />
          </div>

          {ws.isHistorical ? (
            <div className="col-span-2 mt-4">
              <div className="bg-gold/5 p-8 rounded-[2.5rem] border border-gold/10 shadow-inner group-hover:bg-gold/10 transition-colors">
                <label className="text-[10px] font-black uppercase tracking-widest text-gold mb-4 block">Total Alumni Terdaftar (Real Attendance)</label>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-sm border border-gold/10">👥</div>
                  <input 
                    className="w-full bg-white border-2 border-gold/20 p-5 rounded-2xl text-4xl font-black text-slate-900 focus:ring-8 focus:ring-gold/5 focus:border-gold outline-none transition-all" 
                    type="number" 
                    placeholder="0"
                    value={ws.realAttendance || 0} 
                    onChange={(e) => updateListItem('workshops', ws.id, { realAttendance: Number(e.target.value) })} 
                  />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Harga (IDR)</label>
                <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-bold focus:bg-white focus:border-gold outline-none transition-all" type="number" value={ws.price} onChange={(e) => updateListItem('workshops', ws.id, { price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Harga Coret (IDR)</label>
                <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-medium text-slate-400 focus:bg-white focus:border-gold outline-none transition-all" type="number" value={ws.priceBeforeDiscount || 0} onChange={(e) => updateListItem('workshops', ws.id, { priceBeforeDiscount: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Durasi</label>
                <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-medium focus:bg-white focus:border-gold outline-none transition-all" value={ws.duration} onChange={(e) => updateListItem('workshops', ws.id, { duration: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Slots Available</label>
                <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-medium focus:bg-white focus:border-gold outline-none transition-all" type="number" value={ws.slots || 0} onChange={(e) => updateListItem('workshops', ws.id, { slots: Number(e.target.value) })} />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1">Curriculum (Pemisah Baris Baru)</label>
                <textarea className="w-full bg-stone-50/50 border border-stone-100 p-5 rounded-2xl text-xs h-36 leading-relaxed focus:bg-white focus:border-gold outline-none transition-all" value={ws.curriculum?.join('\n')} onChange={(e) => updateListItem('workshops', ws.id, { curriculum: e.target.value.split('\n') })} />
              </div>
            </>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-stone-100">
          <FileUploader 
            label={ws.isHistorical ? "Dokumentasi Alumni" : "Poster Workshop"} 
            sizeGuidance="Portrait 3:4" 
            isUploading={uploadingField === `workshops:${ws.id}`} 
            onUpload={(b) => handleImageUpload(`workshops:${ws.id}`, b, 'workshop.jpg')} 
          />
          <button 
            onClick={() => removeItem('workshops', ws.id)} 
            className="px-6 py-4 bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all transform active:scale-95"
          >
            Hapus Sesi
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] flex font-sans overflow-hidden selection:bg-gold/20">
      {/* Sidebar - Enhanced Visuals */}
      <aside className={`fixed inset-y-0 left-0 w-80 bg-slate-950 text-white flex flex-col shadow-2xl z-50 transform transition-all duration-500 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-12 border-b border-white/5">
           <div className="w-12 h-12 bg-gold rounded-2xl mb-6 shadow-xl shadow-gold/20 flex items-center justify-center text-2xl">👨‍🍳</div>
           <h1 className="text-3xl font-serif font-black text-gold uppercase tracking-tighter">Chef Portal</h1>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.4em] mt-2 italic">Admin Dashboard</p>
        </div>
        
        <nav className="flex-grow p-8 space-y-2 overflow-y-auto">
          {navItems.map(tab => (
            <button 
              key={tab.id} 
              onClick={() => {setActiveTab(tab.id as any); setIsSidebarOpen(false);}} 
              className={`w-full flex items-center gap-5 px-7 py-5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 relative group ${activeTab === tab.id ? 'bg-gold text-white shadow-2xl shadow-gold/20 translate-x-2' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
            >
              <span className={`text-xl transition-transform duration-300 ${activeTab === tab.id ? 'scale-125' : 'group-hover:scale-110'}`}>{tab.icon}</span> 
              {tab.label}
              {activeTab === tab.id && <span className="absolute right-4 w-1.5 h-1.5 bg-white rounded-full"></span>}
            </button>
          ))}
        </nav>
        
        <div className="p-8 border-t border-white/5">
          <button onClick={onExit} className="w-full py-5 bg-white/5 text-slate-300 text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-white/10 hover:text-white transition-all border border-white/10 group">
            <span className="group-hover:-translate-x-1 inline-block transition-transform mr-2">←</span> Exit to Website
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-100 h-28 flex items-center justify-between px-12 shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-6">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-900 p-3 bg-stone-100 rounded-xl">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
             <div>
               <h2 className="text-2xl font-serif font-black text-slate-900 uppercase tracking-widest">{activeTab}</h2>
               <p className="text-[9px] text-slate-400 font-bold uppercase tracking-widest mt-1">Sistem Manajemen Konten Website</p>
             </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={handleSave} 
              disabled={isSaving} 
              className={`group flex items-center gap-3 px-10 py-5 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gold transition-all shadow-xl shadow-slate-200 disabled:opacity-50 transform active:scale-95`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <span className="text-lg">⚡</span> Publish Updates
                </>
              )}
            </button>
          </div>
        </header>

        <main className="p-12 overflow-y-auto flex-grow bg-slate-50/30">
           {isSaved && (
             <div className="mb-10 p-6 bg-green-500 text-white rounded-[2rem] text-center font-black uppercase text-[10px] tracking-[0.3em] shadow-xl shadow-green-100 animate-in zoom-in-95">
               ✨ Perubahan Berhasil Dipublikasikan ke Website!
             </div>
           )}
           
           <div className="max-w-7xl mx-auto">
             {activeTab === 'hero' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <div className="bg-white p-12 rounded-[3.5rem] border border-stone-200 space-y-8 shadow-sm">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hero Main Title</label>
                      <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-2xl font-serif font-black focus:bg-white focus:ring-4 focus:ring-gold/5 focus:border-gold outline-none transition-all" value={data?.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Hero Subtitle</label>
                      <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-40 leading-relaxed focus:bg-white focus:ring-4 focus:ring-gold/5 focus:border-gold outline-none transition-all" value={data?.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
                    </div>
                    
                    <div className="pt-10 border-t border-stone-100 space-y-8">
                      <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Service Feature Cards</h3>
                      
                      {[
                        { title: 'heroCTA_Workshop_Title', desc: 'heroCTA_Workshop_Desc', icon: '🎥', color: 'bg-red-50', text: 'text-red-600' },
                        { title: 'heroCTA_Recorded_Title', desc: 'heroCTA_Recorded_Desc', icon: '📀', color: 'bg-gold/5', text: 'text-gold' },
                        { title: 'heroCTA_Consultancy_Title', desc: 'heroCTA_Consultancy_Desc', icon: '🛡️', color: 'bg-slate-100', text: 'text-slate-900' }
                      ].map((card, idx) => (
                        <div key={idx} className="bg-stone-50/50 p-8 rounded-[2.5rem] border border-stone-100 space-y-5 transition-all hover:bg-white hover:shadow-lg">
                          <div className="flex items-center gap-4">
                             <div className={`w-12 h-12 ${card.color} ${card.text} rounded-2xl flex items-center justify-center text-xl shadow-sm`}>{card.icon}</div>
                             <span className="text-[11px] font-black uppercase tracking-widest text-slate-900">Feature Card {idx+1}</span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input className="w-full bg-white border border-stone-100 rounded-xl px-5 py-4 text-xs font-bold focus:border-gold outline-none transition-all" value={(data as any)?.[card.title]} onChange={(e) => updateField(card.title as any, e.target.value)} />
                            <input className="w-full bg-white border border-stone-100 rounded-xl px-5 py-4 text-xs focus:border-gold outline-none transition-all" value={(data as any)?.[card.desc]} onChange={(e) => updateField(card.desc as any, e.target.value)} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white p-12 rounded-[3.5rem] border border-stone-200 flex flex-col items-center shadow-sm h-fit sticky top-40">
                    <div className="relative group">
                      <div className="absolute -inset-4 bg-gold/10 rounded-[4rem] blur-2xl group-hover:bg-gold/20 transition-all"></div>
                      <div className="relative aspect-[3/4] w-72 rounded-[3rem] overflow-hidden shadow-2xl mb-12 bg-slate-100 border-8 border-white group-hover:scale-105 transition-transform duration-700">
                        <img src={data?.heroImage} className="w-full h-full object-cover object-top" alt="Hero" />
                      </div>
                    </div>
                    <FileUploader label="Upload Hero Image" sizeGuidance="Portrait 3:4" isUploading={uploadingField === 'heroImage'} onUpload={(b) => handleImageUpload('heroImage', b, 'hero-image.jpg')} />
                  </div>
                </div>
             )}

             {activeTab === 'profile' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  <div className="bg-white p-12 rounded-[3.5rem] border border-stone-200 space-y-8 shadow-sm">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Chef Name</label>
                      <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm font-black tracking-widest focus:bg-white focus:border-gold outline-none transition-all" value={data?.chefName} onChange={(e) => updateField('chefName', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Professional Title</label>
                      <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm focus:bg-white focus:border-gold outline-none transition-all" value={data?.chefTitle} onChange={(e) => updateField('chefTitle', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Bio Quote</label>
                      <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-28 italic focus:bg-white focus:border-gold outline-none transition-all" value={data?.chefBioQuote} onChange={(e) => updateField('chefBioQuote', e.target.value)} />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Biography</label>
                      <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-80 leading-relaxed focus:bg-white focus:border-gold outline-none transition-all" value={data?.chefBio} onChange={(e) => updateField('chefBio', e.target.value)} />
                    </div>
                  </div>
                  <div className="bg-white p-12 rounded-[3.5rem] border border-stone-200 flex flex-col items-center shadow-sm h-fit sticky top-40">
                    <div className="aspect-[3/4] w-72 rounded-[3rem] overflow-hidden shadow-2xl mb-12 bg-slate-100 border-8 border-white">
                      <img src={data?.chefProfileImage} className="w-full h-full object-cover object-top" alt="Chef Profile" />
                    </div>
                    <FileUploader label="Upload Profile Photo" sizeGuidance="Portrait 3:4" isUploading={uploadingField === 'chefProfileImage'} onUpload={(b) => handleImageUpload('chefProfileImage', b, 'chef-portrait.jpg')} />
                  </div>
                </div>
             )}

             {activeTab === 'workshops' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                 <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
                   <div>
                     <h3 className="text-3xl font-serif text-slate-900 mb-2">Manajemen Workshop</h3>
                     <p className="text-xs text-slate-400 italic">Tambahkan sesi baru atau arsipkan batch yang sudah selesai.</p>
                   </div>
                   <button 
                    onClick={() => addItem('workshops', { id: `ws-${Date.now()}`, title: 'Sesi Kuliner Baru', description: 'Intensive culinary training.', price: 1500000, type: ClassType.LIVE, image: ACTUAL_CHEF_PHOTO, duration: '4 Hours', level: 'Professional', isHistorical: false, curriculum: [], slots: 10, displayDate: '', location: '', realAttendance: 0 })} 
                    className="group px-10 py-5 bg-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-gold/20 transform active:scale-95"
                  >
                    <span className="inline-block transition-transform group-hover:scale-125 mr-2">+</span> Add New Session
                  </button>
                 </div>
                 
                 <div className="space-y-8">
                   {data?.workshops.map(ws => (
                     <WorkshopFormItem key={ws.id} ws={ws} />
                   ))}
                 </div>

                 {data?.workshops.length === 0 && (
                   <div className="py-40 border-4 border-dashed border-stone-200 rounded-[5rem] text-center bg-white/50">
                      <div className="text-6xl mb-6">🍳</div>
                      <p className="text-slate-400 font-serif italic text-2xl">Belum ada workshop terdaftar.</p>
                   </div>
                 )}
               </div>
             )}

             {activeTab === 'partners' && (
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-6 duration-500">
                 {data?.partners.map(p => (
                   <div key={p.id} className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col gap-8 shadow-sm group hover:shadow-xl hover:border-gold/30 transition-all">
                     <div className="w-full h-40 bg-stone-50 rounded-[2rem] flex items-center justify-center text-6xl border border-stone-100 overflow-hidden relative group-hover:bg-white transition-colors">
                       {p.logo.length < 10 ? p.logo : <img src={p.logo} className="w-full h-full object-contain p-6" alt="" />}
                     </div>
                     <div className="space-y-6 text-center">
                       <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-4 text-xs font-black uppercase tracking-[0.2em] text-center focus:bg-white focus:border-gold outline-none transition-all" value={p.name} placeholder="Partner Name" onChange={(e) => updateListItem('partners', p.id, { name: e.target.value })} />
                       <FileUploader label="Upload Logo" sizeGuidance="PNG Transparent" isUploading={uploadingField === `partners:${p.id}`} onUpload={(b) => handleImageUpload(`partners:${p.id}`, b, 'partner-logo.png')} />
                       <button onClick={() => removeItem('partners', p.id)} className="w-full text-red-400 text-[9px] font-black uppercase tracking-widest py-3 hover:bg-red-50 rounded-xl transition-colors">Hapus</button>
                     </div>
                   </div>
                 ))}
                 <button onClick={() => addItem('partners', { id: `p-${Date.now()}`, name: 'New Collaboration', logo: '🏢' })} className="h-full min-h-[450px] border-4 border-dashed border-stone-200 rounded-[3rem] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:border-gold hover:text-gold transition-all flex flex-col items-center justify-center gap-4">
                    <span className="text-4xl">+</span> Tambah Partner
                 </button>
               </div>
             )}

             {activeTab === 'recorded' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                 {data?.recordedClasses.map(rc => (
                   <div key={rc.id} className="bg-white p-10 rounded-[3.5rem] border border-stone-200 flex flex-col gap-10 shadow-sm hover:shadow-xl transition-all group">
                      <div className="aspect-video w-full rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl group-hover:scale-[1.02] transition-transform duration-700">
                        <img src={rc.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="space-y-8">
                        <input className="w-full font-serif text-2xl font-black bg-stone-50 p-5 rounded-2xl border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={rc.title} onChange={(e) => updateListItem('recordedClasses', rc.id, { title: e.target.value })} />
                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (IDR)</label>
                             <input className="w-full bg-stone-50 p-4 rounded-xl text-sm font-bold border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" type="number" placeholder="Price" value={rc.price} onChange={(e) => updateListItem('recordedClasses', rc.id, { price: Number(e.target.value) })} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Duration Info</label>
                             <input className="w-full bg-stone-50 p-4 rounded-xl text-sm border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" placeholder="Module Info" value={rc.duration} onChange={(e) => updateListItem('recordedClasses', rc.id, { duration: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Sold Count</label>
                             <input className="w-full bg-stone-50 p-4 rounded-xl text-sm border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" type="number" placeholder="Sold Count" value={rc.soldCount || 0} onChange={(e) => updateListItem('recordedClasses', rc.id, { soldCount: Number(e.target.value) })} />
                          </div>
                          <div className="space-y-2">
                             <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Difficulty</label>
                             <select className="w-full bg-stone-50 p-4 rounded-xl text-[10px] font-black uppercase tracking-widest border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={rc.level} onChange={(e) => updateListItem('recordedClasses', rc.id, { level: e.target.value })}>
                                <option>Beginner</option>
                                <option>Professional</option>
                                <option>Executive</option>
                             </select>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-stone-100">
                          <FileUploader label="Update Cover" sizeGuidance="16:9 Landscape" isUploading={uploadingField === `recordedClasses:${rc.id}`} onUpload={(b) => handleImageUpload(`recordedClasses:${rc.id}`, b, 'academy-cover.jpg')} />
                          <button onClick={() => removeItem('recordedClasses', rc.id)} className="px-6 py-4 text-red-400 text-[10px] font-black uppercase hover:bg-red-50 rounded-xl ml-auto transition-colors">Hapus</button>
                        </div>
                      </div>
                   </div>
                 ))}
                 <button onClick={() => addItem('recordedClasses', { id: `rc-${Date.now()}`, title: 'New Academy Series', description: 'Elite culinary education.', price: 500000, type: ClassType.RECORDED, image: ACTUAL_CHEF_PHOTO, duration: '12 Videos', level: 'Beginner', soldCount: 0 })} className="h-full border-4 border-dashed border-stone-200 rounded-[3.5rem] p-20 text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:border-gold hover:text-gold transition-all flex flex-col items-center justify-center gap-6">
                    <span className="text-5xl">+</span> Add To Academy
                 </button>
               </div>
             )}

             {activeTab === 'portfolio' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                 {data?.portfolio.map(item => (
                   <div key={item.id} className="bg-white p-10 rounded-[3.5rem] border border-stone-200 space-y-8 shadow-sm group hover:shadow-xl transition-all">
                     <div className="aspect-[16/10] rounded-[2.5rem] overflow-hidden bg-slate-100 border-4 border-white shadow-xl group-hover:scale-[1.02] transition-transform duration-700">
                       <img src={item.image} className="w-full h-full object-cover" alt="" />
                     </div>
                     <div className="space-y-6">
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Project Title</label>
                         <input className="w-full font-serif font-black text-2xl bg-stone-50 p-5 rounded-2xl border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={item.title} onChange={(e) => updateListItem('portfolio', item.id, { title: e.target.value })} />
                       </div>
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry / Category</label>
                         <input className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-gold bg-stone-50 p-5 rounded-2xl border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={item.category} onChange={(e) => updateListItem('portfolio', item.id, { category: e.target.value })} />
                       </div>
                       <div className="flex flex-wrap items-center gap-8 pt-6 border-t border-stone-100">
                         <FileUploader label="Upload Image" sizeGuidance="16:10 Landscape" isUploading={uploadingField === `portfolio:${item.id}`} onUpload={(b) => handleImageUpload('portfolio', b, 'portfolio.jpg')} />
                         <button onClick={() => removeItem('portfolio', item.id)} className="px-6 py-4 text-red-400 text-[10px] font-black uppercase hover:bg-red-50 rounded-xl ml-auto transition-colors">Hapus</button>
                       </div>
                     </div>
                   </div>
                 ))}
                 <button onClick={() => addItem('portfolio', { id: `p-${Date.now()}`, title: 'Grand Strategic Project', category: 'Global Hospitality', image: ACTUAL_CHEF_PHOTO, aiPrompt: '' })} className="min-h-[500px] border-4 border-dashed border-stone-200 rounded-[3.5rem] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:border-gold hover:text-gold transition-all flex flex-col items-center justify-center gap-6">
                    <span className="text-5xl">+</span> Add Portfolio Item
                 </button>
               </div>
             )}

             {activeTab === 'reviews' && (
               <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                 {data?.reviews.map(rev => (
                   <div key={rev.id} className="bg-white p-12 rounded-[4rem] border border-stone-200 flex flex-col md:flex-row gap-16 shadow-sm hover:shadow-xl transition-all group">
                     <div className="flex flex-col items-center gap-6 flex-shrink-0">
                        <div className="w-40 h-40 rounded-[3rem] overflow-hidden border-8 border-stone-50 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                          <img src={rev.avatar} className="w-full h-full object-cover" alt="" />
                        </div>
                        <FileUploader label="Avatar" sizeGuidance="Square 1:1" isUploading={uploadingField === `reviews:${rev.id}`} onUpload={(b) => handleImageUpload(`reviews:${rev.id}`, b, 'avatar.jpg')} />
                     </div>
                     <div className="flex-grow space-y-8">
                       <div className="grid grid-cols-2 gap-8">
                         <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Nama Alumni</label>
                           <input className="w-full font-black text-slate-900 bg-stone-50 p-5 rounded-2xl text-sm border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={rev.name} onChange={(e) => updateListItem('reviews', rev.id, { name: e.target.value })} />
                         </div>
                         <div className="space-y-2">
                           <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Jabatan / Perusahaan</label>
                           <input className="w-full font-bold text-gold bg-stone-50 p-5 rounded-2xl text-[10px] uppercase tracking-widest border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={rev.role} onChange={(e) => updateListItem('reviews', rev.id, { role: e.target.value })} />
                         </div>
                       </div>
                       <div className="space-y-2">
                         <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Pesan Testimoni</label>
                         <textarea className="w-full bg-stone-50 p-6 rounded-[2.5rem] text-sm h-40 italic border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all leading-relaxed" value={rev.comment} onChange={(e) => updateListItem('reviews', rev.id, { comment: e.target.value })} />
                       </div>
                       <div className="flex flex-wrap items-center gap-10 pt-6 border-t border-stone-100">
                          <div className="space-y-3">
                            <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Kategori Review</label>
                            <select className="bg-slate-950 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl outline-none border border-white/10" value={rev.category} onChange={(e) => updateListItem('reviews', rev.id, { category: e.target.value as ReviewCategory })}>
                              <option>Live Workshop</option>
                              <option>Kelas Rekaman</option>
                              <option>Private Consultancy</option>
                            </select>
                          </div>
                          <button onClick={() => removeItem('reviews', rev.id)} className="ml-auto px-6 py-4 bg-red-50 text-red-400 text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-red-500 hover:text-white transition-all">Delete</button>
                       </div>
                     </div>
                   </div>
                 ))}
                 <button onClick={() => addItem('reviews', { id: `r-${Date.now()}`, name: 'New Elite Alumni', role: 'Executive Chef', comment: 'Luar biasa membantu operasional.', avatar: 'https://i.pravatar.cc/150', category: 'Live Workshop' })} className="w-full py-20 border-4 border-dashed border-stone-200 rounded-[5rem] text-slate-400 font-black uppercase text-[10px] tracking-widest hover:bg-white hover:border-gold hover:text-gold transition-all flex flex-col items-center justify-center gap-6">
                    <span className="text-5xl">+</span> Add Testimonial
                 </button>
               </div>
             )}

             {activeTab === 'footer' && (
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-6 duration-500">
                  {[data?.footerEducation, data?.footerB2B].map((cat, idx) => (
                    <div key={idx} className="bg-white p-12 rounded-[4rem] border border-stone-200 space-y-10 shadow-sm transition-all hover:shadow-xl">
                      <div className="flex items-center gap-4">
                        <div className="w-1.5 h-10 bg-gold rounded-full"></div>
                        <h4 className="text-sm font-black uppercase text-slate-900 tracking-[0.4em]">{cat?.title}</h4>
                      </div>
                      <div className="space-y-6">
                        {cat?.links.map(link => (
                          <div key={link.id} className="flex flex-col md:flex-row gap-5 p-6 bg-stone-50 rounded-3xl border border-stone-100 group hover:bg-white hover:border-gold/20 transition-all">
                            <div className="flex-grow space-y-2">
                               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Link Label</label>
                               <input className="w-full bg-white border border-stone-200 p-4 rounded-xl text-xs font-bold focus:border-gold outline-none transition-all" value={link.label} onChange={(e) => {
                                const targetField = idx === 0 ? 'footerEducation' : 'footerB2B';
                                const newLinks = (data?.[targetField] as any).links.map((l: any) => l.id === link.id ? { ...l, label: e.target.value } : l);
                                updateField(targetField, { ...(data?.[targetField] as any), links: newLinks });
                              }} />
                            </div>
                            <div className="md:w-64 space-y-2">
                               <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest ml-1">Destination URL</label>
                               <input className="w-full bg-stone-100 p-4 rounded-xl text-[10px] text-slate-500 font-mono focus:bg-white focus:border-gold outline-none transition-all border border-stone-200" value={link.url} onChange={(e) => {
                                const targetField = idx === 0 ? 'footerEducation' : 'footerB2B';
                                const newLinks = (data?.[targetField] as any).links.map((l: any) => l.id === link.id ? { ...l, url: e.target.value } : l);
                                updateField(targetField, { ...(data?.[targetField] as any), links: newLinks });
                              }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
               </div>
             )}
           </div>
           
           <div className="mt-20 pt-10 border-t border-stone-200 text-center">
             <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.4em]">Elite Culinary Branding System v7.1 • 2024</p>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCMS;
