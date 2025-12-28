
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
    <div className="space-y-3">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">{label}</label>
      <div className="flex flex-col gap-2">
        <div className="relative">
          <input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            className="w-full text-[10px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gold file:text-white hover:file:bg-slate-900 transition-all cursor-pointer disabled:opacity-50"
            onChange={handleFile}
          />
          {isUploading && (
            <div className="absolute right-0 top-0 bottom-0 flex items-center px-4">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
          <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Guidance: <span className="text-gold font-bold">{sizeGuidance}</span></p>
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
      alert("Gagal menyimpan ke Postgres.");
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
    setData({ ...data, [field]: (data[field] as any[]).filter(item => item.id !== id) });
  };

  const WorkshopFormItem = ({ ws }: { ws: CulinaryClass }) => (
    <div key={ws.id} className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col lg:flex-row gap-12 shadow-sm mb-8 transition-all hover:border-gold/30">
      <div className={`w-full lg:w-64 aspect-[3/4] rounded-[2rem] overflow-hidden bg-slate-100 shadow-xl flex-shrink-0 border-4 border-white ${ws.isHistorical ? 'grayscale opacity-70' : ''}`}>
        <img src={ws.image} className="w-full h-full object-cover" alt="" />
      </div>
      <div className="flex-grow space-y-6">
        <div className="flex items-center justify-between">
           <div className="space-y-1">
             <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest ${ws.isHistorical ? 'bg-slate-100 text-slate-500' : 'bg-red-600 text-white animate-pulse'}`}>
               {ws.isHistorical ? 'Historical Archive' : 'Active Workshop'}
             </span>
           </div>
           <label className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-500 cursor-pointer p-3 bg-stone-50 rounded-xl hover:bg-stone-100 transition-colors">
              <input 
                type="checkbox" 
                className="w-5 h-5 text-gold rounded border-stone-300 focus:ring-gold"
                checked={ws.isHistorical || false} 
                onChange={(e) => updateListItem('workshops', ws.id, { isHistorical: e.target.checked })} 
              />
              Archive as Historical Batch
           </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="col-span-2 space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Workshop Title (Judul)</label>
            <input 
              className="w-full font-serif text-2xl font-black bg-stone-50 p-4 rounded-xl border border-stone-100" 
              value={ws.title} 
              onChange={(e) => updateListItem('workshops', ws.id, { title: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal Pelaksanaan</label>
            <input 
              className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" 
              value={ws.displayDate || ''} 
              placeholder="Contoh: 20 Oktober 2024" 
              onChange={(e) => updateListItem('workshops', ws.id, { displayDate: e.target.value })} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Lokasi / Sesi</label>
            <input 
              className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" 
              value={ws.location || ''} 
              placeholder="Contoh: Jakarta / Zoom Live" 
              onChange={(e) => updateListItem('workshops', ws.id, { location: e.target.value })} 
            />
          </div>

          {ws.isHistorical ? (
            <div className="col-span-2 mt-4">
              <div className="bg-gold/10 p-8 rounded-[2.5rem] border border-gold/20 shadow-inner">
                <label className="text-[11px] font-black uppercase tracking-widest text-gold mb-3 block">Total Alumni Terdaftar (Real Attendance)</label>
                <div className="flex items-center gap-4">
                  <div className="text-3xl">👥</div>
                  <input 
                    className="w-full bg-white border-2 border-gold/20 p-5 rounded-2xl text-3xl font-black text-slate-900 focus:ring-4 focus:ring-gold/10 focus:border-gold outline-none transition-all" 
                    type="number" 
                    placeholder="Masukkan jumlah alumni..."
                    value={ws.realAttendance || 0} 
                    onChange={(e) => updateListItem('workshops', ws.id, { realAttendance: Number(e.target.value) })} 
                  />
                </div>
                <p className="mt-3 text-[9px] text-slate-400 font-bold uppercase tracking-widest italic">Field ini muncul otomatis untuk data historis.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harga (IDR)</label>
                <input className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" type="number" value={ws.price} onChange={(e) => updateListItem('workshops', ws.id, { price: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Harga Coret (IDR)</label>
                <input className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" type="number" value={ws.priceBeforeDiscount || 0} onChange={(e) => updateListItem('workshops', ws.id, { priceBeforeDiscount: Number(e.target.value) })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Durasi</label>
                <input className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" value={ws.duration} onChange={(e) => updateListItem('workshops', ws.id, { duration: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Slots Available</label>
                <input className="w-full bg-stone-50 border border-stone-100 p-3 rounded-xl text-sm" type="number" value={ws.slots || 0} onChange={(e) => updateListItem('workshops', ws.id, { slots: Number(e.target.value) })} />
              </div>
              <div className="col-span-2 space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Curriculum (Pemisah Baris Baru)</label>
                <textarea className="w-full bg-stone-50 border border-stone-100 p-4 rounded-xl text-xs h-32 leading-relaxed" value={ws.curriculum?.join('\n')} onChange={(e) => updateListItem('workshops', ws.id, { curriculum: e.target.value.split('\n') })} />
              </div>
            </>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-stone-100">
          <FileUploader 
            label={ws.isHistorical ? "Update Foto Dokumentasi" : "Update Poster Workshop"} 
            sizeGuidance="Portrait 3:4" 
            isUploading={uploadingField === `workshops:${ws.id}`} 
            onUpload={(b) => handleImageUpload(`workshops:${ws.id}`, b, 'workshop.jpg')} 
          />
          <button onClick={() => removeItem('workshops', ws.id)} className="ml-auto text-red-400 text-[10px] font-black uppercase hover:bg-red-50 px-6 py-3 rounded-xl transition-all">Delete Sesi</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 border-b border-white/5">
           <h1 className="text-2xl font-serif font-black text-gold uppercase tracking-tighter text-center">Chef Portal</h1>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1 italic text-center">Admin Dashboard</p>
        </div>
        <nav className="flex-grow p-6 space-y-1 overflow-y-auto">
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => {setActiveTab(tab.id as any); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gold text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={onExit} className="w-full py-4 bg-white/10 text-white text-[10px] font-black uppercase rounded-xl hover:bg-gold transition-all border border-white/10">Exit to Website</button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-stone-200 h-24 flex items-center justify-between px-12 shrink-0">
          <div className="flex items-center gap-4">
             <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden text-slate-900 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
             </button>
             <h2 className="text-xl font-serif font-black text-slate-900 uppercase tracking-widest">{activeTab.toUpperCase()}</h2>
          </div>
          <button onClick={handleSave} disabled={isSaving} className={`px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase rounded-full hover:bg-gold transition-all shadow-xl disabled:opacity-50`}>
            {isSaving ? 'Publishing...' : 'Publish Updates'}
          </button>
        </header>

        <main className="p-12 overflow-y-auto flex-grow">
           {isSaved && <div className="mb-8 p-4 bg-green-50 text-green-600 rounded-xl text-center font-black uppercase text-[10px] animate-pulse">Live Updates Published!</div>}
           
           {activeTab === 'hero' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-6 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Main Title</label>
                    <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-4 text-lg font-serif" value={data?.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Subtitle</label>
                    <textarea className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-4 text-sm h-32 leading-relaxed" value={data?.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
                  </div>
                  
                  <div className="pt-8 border-t border-stone-100 space-y-8">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gold">Landing Service Highlight Cards</h3>
                    
                    <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white text-xs shadow-md">🎥</div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Card 1: Live Workshop</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="w-full bg-white border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold" value={data?.heroCTA_Workshop_Title} onChange={(e) => updateField('heroCTA_Workshop_Title', e.target.value)} />
                        <input className="w-full bg-white border border-stone-100 rounded-xl px-4 py-3 text-xs" value={data?.heroCTA_Workshop_Desc} onChange={(e) => updateField('heroCTA_Workshop_Desc', e.target.value)} />
                      </div>
                    </div>

                    <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-gold rounded-lg flex items-center justify-center text-white text-xs shadow-md">📀</div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Card 2: Academy Masterclass</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="w-full bg-white border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold" value={data?.heroCTA_Recorded_Title} onChange={(e) => updateField('heroCTA_Recorded_Title', e.target.value)} />
                        <input className="w-full bg-white border border-stone-100 rounded-xl px-4 py-3 text-xs" value={data?.heroCTA_Recorded_Desc} onChange={(e) => updateField('heroCTA_Recorded_Desc', e.target.value)} />
                      </div>
                    </div>

                    <div className="bg-stone-50 p-6 rounded-[2rem] border border-stone-100 space-y-4">
                      <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs shadow-md">🛡️</div>
                         <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Card 3: Private Audit</span>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input className="w-full bg-white border border-stone-100 rounded-xl px-4 py-3 text-xs font-bold" value={data?.heroCTA_Consultancy_Title} onChange={(e) => updateField('heroCTA_Consultancy_Title', e.target.value)} />
                        <input className="w-full bg-white border border-stone-100 rounded-xl px-4 py-3 text-xs" value={data?.heroCTA_Consultancy_Desc} onChange={(e) => updateField('heroCTA_Consultancy_Desc', e.target.value)} />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col items-center shadow-sm h-fit sticky top-10">
                   <div className="aspect-[3/4] w-64 rounded-[2rem] overflow-hidden shadow-2xl mb-8 bg-slate-100 border-4 border-white">
                    <img src={data?.heroImage} className="w-full h-full object-cover object-top" alt="Hero" />
                  </div>
                  <FileUploader label="Upload Hero Image" sizeGuidance="Portrait 3:4" isUploading={uploadingField === 'heroImage'} onUpload={(b) => handleImageUpload('heroImage', b, 'hero-image.jpg')} />
                </div>
              </div>
           )}

           {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-6 shadow-sm">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chef Name</label>
                    <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-4 text-sm font-bold" value={data?.chefName} onChange={(e) => updateField('chefName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Professional Title</label>
                    <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-4 text-sm" value={data?.chefTitle} onChange={(e) => updateField('chefTitle', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Bio Quote</label>
                    <textarea className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-4 text-sm h-24 italic" value={data?.chefBioQuote} onChange={(e) => updateField('chefBioQuote', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biography</label>
                    <textarea className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-4 text-sm h-64 leading-relaxed" value={data?.chefBio} onChange={(e) => updateField('chefBio', e.target.value)} />
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col items-center shadow-sm">
                  <div className="aspect-[3/4] w-64 rounded-[2rem] overflow-hidden shadow-2xl mb-8 bg-slate-100 border-4 border-white">
                    <img src={data?.chefProfileImage} className="w-full h-full object-cover object-top" alt="Chef Profile" />
                  </div>
                  <FileUploader label="Upload Profile Photo" sizeGuidance="Portrait 3:4" isUploading={uploadingField === 'chefProfileImage'} onUpload={(b) => handleImageUpload('chefProfileImage', b, 'chef-portrait.jpg')} />
                </div>
              </div>
           )}

           {activeTab === 'workshops' && (
             <div className="space-y-12">
               <div className="flex items-center justify-between mb-8">
                 <div>
                   <h3 className="text-2xl font-serif text-slate-900 mb-2">Manajemen Workshop</h3>
                   <p className="text-xs text-slate-400 italic">Gunakan satu sistem untuk batch aktif maupun arsip historis.</p>
                 </div>
                 <button onClick={() => addItem('workshops', { id: `ws-${Date.now()}`, title: 'Sesi Kuliner Baru', description: 'Intensive culinary training.', price: 1500000, type: ClassType.LIVE, image: ACTUAL_CHEF_PHOTO, duration: '4 Hours', level: 'Professional', isHistorical: false, curriculum: [], slots: 10, displayDate: '', location: '', realAttendance: 0 })} className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gold transition-all shadow-xl">+ Add New Session</button>
               </div>
               
               {data?.workshops.map(ws => (
                 <WorkshopFormItem key={ws.id} ws={ws} />
               ))}

               {data?.workshops.length === 0 && (
                 <div className="py-32 border-4 border-dashed border-stone-200 rounded-[4rem] text-center bg-white/50">
                    <p className="text-slate-400 font-serif italic text-xl">Belum ada workshop terdaftar.</p>
                 </div>
               )}
             </div>
           )}

           {activeTab === 'partners' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {data?.partners.map(p => (
                 <div key={p.id} className="bg-white p-8 rounded-[2rem] border border-stone-200 flex flex-col gap-6 shadow-sm group">
                   <div className="w-full h-32 bg-stone-50 rounded-2xl flex items-center justify-center text-5xl border border-stone-100 overflow-hidden relative">
                     {p.logo.length < 10 ? p.logo : <img src={p.logo} className="w-full h-full object-contain p-4" alt="" />}
                   </div>
                   <div className="space-y-4">
                     <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 text-xs font-black uppercase tracking-widest" value={p.name} placeholder="Partner Name" onChange={(e) => updateListItem('partners', p.id, { name: e.target.value })} />
                     <FileUploader label="Upload Custom Logo" sizeGuidance="PNG Transparent" isUploading={uploadingField === `partners:${p.id}`} onUpload={(b) => handleImageUpload(`partners:${p.id}`, b, 'partner-logo.png')} />
                     <button onClick={() => removeItem('partners', p.id)} className="w-full text-red-400 text-[10px] font-black uppercase tracking-widest py-3 hover:bg-red-50 rounded-xl transition-colors">Hapus Partner</button>
                   </div>
                 </div>
               ))}
               <button onClick={() => addItem('partners', { id: `p-${Date.now()}`, name: 'New Collaboration', logo: '🏢' })} className="h-full min-h-[300px] border-4 border-dashed border-stone-200 rounded-[2rem] text-slate-400 font-black uppercase text-[10px] hover:bg-white hover:border-gold transition-all">+ Tambah Partner</button>
             </div>
           )}

           {activeTab === 'recorded' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {data?.recordedClasses.map(rc => (
                 <div key={rc.id} className="bg-white p-8 rounded-[3rem] border border-stone-200 flex flex-col gap-8 shadow-sm">
                    <div className="aspect-video w-full rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                      <img src={rc.image} className="w-full h-full object-cover" alt="" />
                    </div>
                    <div className="space-y-6">
                      <input className="w-full font-serif text-xl font-black bg-stone-50 p-4 rounded-xl border border-stone-100" value={rc.title} onChange={(e) => updateListItem('recordedClasses', rc.id, { title: e.target.value })} />
                      <div className="grid grid-cols-2 gap-4">
                        <input className="w-full bg-stone-50 p-3 rounded-xl text-sm" type="number" placeholder="Price" value={rc.price} onChange={(e) => updateListItem('recordedClasses', rc.id, { price: Number(e.target.value) })} />
                        <input className="w-full bg-stone-50 p-3 rounded-xl text-sm" placeholder="Module Info" value={rc.duration} onChange={(e) => updateListItem('recordedClasses', rc.id, { duration: e.target.value })} />
                        <input className="w-full bg-stone-50 p-3 rounded-xl text-sm" type="number" placeholder="Sold Count" value={rc.soldCount || 0} onChange={(e) => updateListItem('recordedClasses', rc.id, { soldCount: Number(e.target.value) })} />
                        <select className="w-full bg-stone-50 p-3 rounded-xl text-[10px] font-black uppercase" value={rc.level} onChange={(e) => updateListItem('recordedClasses', rc.id, { level: e.target.value })}>
                          <option>Beginner</option>
                          <option>Professional</option>
                          <option>Executive</option>
                        </select>
                      </div>
                      <FileUploader label="Update Cover Image" sizeGuidance="16:9 Landscape" isUploading={uploadingField === `recordedClasses:${rc.id}`} onUpload={(b) => handleImageUpload(`recordedClasses:${rc.id}`, b, 'academy-cover.jpg')} />
                      <button onClick={() => removeItem('recordedClasses', rc.id)} className="text-red-400 text-[10px] font-black uppercase hover:bg-red-50 py-3 rounded-xl">Hapus Masterclass</button>
                    </div>
                 </div>
               ))}
               <button onClick={() => addItem('recordedClasses', { id: `rc-${Date.now()}`, title: 'New Academy Series', description: 'Elite culinary education.', price: 500000, type: ClassType.RECORDED, image: ACTUAL_CHEF_PHOTO, duration: '12 Videos', level: 'Beginner', soldCount: 0 })} className="h-full border-4 border-dashed border-stone-200 rounded-[3rem] p-12 text-slate-400 font-black uppercase text-[10px] hover:bg-white transition-all">+ Add To Academy</button>
             </div>
           )}

           {activeTab === 'portfolio' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
               {data?.portfolio.map(item => (
                 <div key={item.id} className="bg-white p-8 rounded-[3rem] border border-stone-200 space-y-6 shadow-sm group">
                   <div className="aspect-[16/10] rounded-[2rem] overflow-hidden bg-slate-100 border-4 border-white shadow-lg">
                     <img src={item.image} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="space-y-4">
                     <input className="w-full font-serif font-black text-xl bg-stone-50 p-4 rounded-xl border border-stone-100" value={item.title} onChange={(e) => updateListItem('portfolio', item.id, { title: e.target.value })} />
                     <input className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-gold bg-stone-50 p-3 rounded-xl border border-stone-100" value={item.category} onChange={(e) => updateListItem('portfolio', item.id, { category: e.target.value })} />
                     <FileUploader label="Upload Project Image" sizeGuidance="16:10 Landscape" isUploading={uploadingField === `portfolio:${item.id}`} onUpload={(b) => handleImageUpload(`portfolio:${item.id}`, b, 'portfolio.jpg')} />
                     <button onClick={() => removeItem('portfolio', item.id)} className="w-full text-red-400 text-[10px] font-black uppercase py-3 hover:bg-red-50 rounded-xl transition-colors">Hapus Item</button>
                   </div>
                 </div>
               ))}
               <button onClick={() => addItem('portfolio', { id: `p-${Date.now()}`, title: 'Grand Strategic Project', category: 'Global Hospitality', image: ACTUAL_CHEF_PHOTO, aiPrompt: '' })} className="min-h-[400px] border-4 border-dashed border-stone-200 rounded-[3rem] text-slate-400 font-black uppercase text-[10px] hover:bg-white transition-all">+ Add Portfolio Item</button>
             </div>
           )}

           {activeTab === 'reviews' && (
             <div className="space-y-10">
               {data?.reviews.map(rev => (
                 <div key={rev.id} className="bg-white p-10 rounded-[4rem] border border-stone-200 flex flex-col md:flex-row gap-12 shadow-sm">
                   <div className="w-32 h-32 rounded-[2rem] overflow-hidden border-4 border-white shadow-xl flex-shrink-0">
                     <img src={rev.avatar} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-grow space-y-6">
                     <div className="grid grid-cols-2 gap-6">
                       <input className="font-black text-slate-900 bg-stone-50 p-4 rounded-xl text-sm border border-stone-100" value={rev.name} onChange={(e) => updateListItem('reviews', rev.id, { name: e.target.value })} />
                       <input className="font-bold text-gold bg-stone-50 p-4 rounded-xl text-[10px] uppercase tracking-widest border border-stone-100" value={rev.role} onChange={(e) => updateListItem('reviews', rev.id, { role: e.target.value })} />
                     </div>
                     <textarea className="w-full bg-stone-50 p-5 rounded-[2rem] text-sm h-32 italic border border-stone-100" value={rev.comment} onChange={(e) => updateListItem('reviews', rev.id, { comment: e.target.value })} />
                     <div className="flex flex-wrap items-center gap-8">
                        <select className="bg-slate-900 text-white px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest" value={rev.category} onChange={(e) => updateListItem('reviews', rev.id, { category: e.target.value as ReviewCategory })}>
                          <option>Live Workshop</option>
                          <option>Kelas Rekaman</option>
                          <option>Private Consultancy</option>
                        </select>
                        <FileUploader label="Avatar" sizeGuidance="Square 1:1" isUploading={uploadingField === `reviews:${rev.id}`} onUpload={(b) => handleImageUpload(`reviews:${rev.id}`, b, 'avatar.jpg')} />
                        <button onClick={() => removeItem('reviews', rev.id)} className="ml-auto text-red-400 text-[10px] font-black uppercase hover:bg-red-50 px-6 py-3 rounded-xl transition-colors">Delete Testimoni</button>
                     </div>
                   </div>
                 </div>
               ))}
               <button onClick={() => addItem('reviews', { id: `r-${Date.now()}`, name: 'New Elite Alumni', role: 'Executive Chef', comment: 'Luar biasa membantu operasional.', avatar: 'https://i.pravatar.cc/150', category: 'Live Workshop' })} className="w-full py-12 border-4 border-dashed border-stone-200 rounded-[4rem] text-slate-400 font-black uppercase text-[10px] hover:bg-white transition-all">+ Add Testimonial</button>
             </div>
           )}

           {activeTab === 'footer' && (
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {[data?.footerEducation, data?.footerB2B].map((cat, idx) => (
                  <div key={idx} className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-8 shadow-sm">
                    <h4 className="text-sm font-black uppercase text-gold tracking-[0.3em]">{cat?.title}</h4>
                    <div className="space-y-6">
                      {cat?.links.map(link => (
                        <div key={link.id} className="flex flex-col md:flex-row gap-4 border-b border-stone-50 pb-4">
                          <input className="flex-grow bg-stone-50 p-4 rounded-xl text-xs font-bold border border-stone-100" value={link.label} onChange={(e) => {
                            const targetField = idx === 0 ? 'footerEducation' : 'footerB2B';
                            const newLinks = (data?.[targetField] as any).links.map((l: any) => l.id === link.id ? { ...l, label: e.target.value } : l);
                            updateField(targetField, { ...(data?.[targetField] as any), links: newLinks });
                          }} />
                          <input className="md:w-48 bg-stone-100 p-4 rounded-xl text-[10px] text-slate-500 font-mono" value={link.url} onChange={(e) => {
                            const targetField = idx === 0 ? 'footerEducation' : 'footerB2B';
                            const newLinks = (data?.[targetField] as any).links.map((l: any) => l.id === link.id ? { ...l, url: e.target.value } : l);
                            updateField(targetField, { ...(data?.[targetField] as any), links: newLinks });
                          }} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default AdminCMS;
