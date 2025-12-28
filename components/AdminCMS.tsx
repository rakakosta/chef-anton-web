
import React, { useState, useEffect, useMemo } from 'react';
import { getCMSData, saveCMSData, CMSData, Partner } from '../services/dataService';
import { uploadImageToBlob } from '../services/imageService';
import { ClassType, CulinaryClass, PortfolioItem, Review, ReviewCategory, FooterLink } from '../types';
// Added missing import for ACTUAL_CHEF_PHOTO
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
          <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Ukuran File: <span className="text-gold">{sizeGuidance}</span></p>
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
      alert("Gagal menyimpan ke Postgres. Silakan coba lagi.");
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof CMSData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleImageUpload = async (field: keyof CMSData | string, base64: string, filename: string) => {
    if (!data) return;
    setUploadingField(field);
    try {
      const url = await uploadImageToBlob(base64, filename);
      
      if (field === 'heroImage' || field === 'chefProfileImage') {
        updateField(field as keyof CMSData, url);
      } else if (field.includes(':')) {
        const [listKey, id] = field.split(':');
        const list = [...(data[listKey as keyof CMSData] as any[])];
        const index = list.findIndex(item => item.id === id);
        if (index !== -1) {
          list[index].image = url;
          if (listKey === 'reviews') list[index].avatar = url;
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
    setData({
      ...data,
      [field]: [newItem, ...(data[field] as any[])]
    });
  };

  const removeItem = (field: keyof CMSData, id: string) => {
    if (!data) return;
    setData({
      ...data,
      [field]: (data[field] as any[]).filter(item => item.id !== id)
    });
  };

  if (!data) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Membuka Portal Vercel Postgres...</p>
      </div>
    );
  }

  const workshops = {
    active: data.workshops.filter(ws => !ws.isHistorical),
    historical: data.workshops.filter(ws => ws.isHistorical)
  };

  const navItems = [
    { id: 'hero', label: 'Landing Hero', icon: '✨' },
    { id: 'profile', label: 'Chef Profile', icon: '👤' },
    { id: 'partners', label: 'Partners', icon: '🤝' },
    { id: 'workshops', label: 'Workshops', icon: '🎥' },
    { id: 'recorded', label: 'Academy', icon: '📀' },
    { id: 'portfolio', label: 'Portfolio', icon: '🖼️' },
    { id: 'reviews', label: 'Reviews', icon: '⭐️' },
    { id: 'footer', label: 'Footer Links', icon: '🔗' },
  ];

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans overflow-hidden">
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-10 border-b border-white/5">
           <h1 className="text-2xl font-serif font-black text-gold uppercase tracking-tighter">Chef Portal</h1>
           <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Vercel Backend</p>
        </div>
        <nav className="flex-grow p-6 space-y-1 overflow-y-auto">
          {navItems.map(tab => (
            <button key={tab.id} onClick={() => {setActiveTab(tab.id as any); setIsSidebarOpen(false);}} className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id ? 'bg-gold text-white shadow-lg' : 'text-slate-500 hover:text-white hover:bg-white/5'}`}>
              <span>{tab.icon}</span> {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-6 border-t border-white/5">
          <button onClick={onExit} className="w-full py-4 bg-white text-slate-950 text-[10px] font-black uppercase rounded-xl hover:bg-gold transition-all">Exit to Site</button>
        </div>
      </aside>

      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white border-b border-stone-200 h-24 flex items-center justify-between px-12 shrink-0">
          <h2 className="text-xl font-serif font-black text-slate-900 uppercase tracking-widest">{activeTab}</h2>
          <div className="flex gap-4">
            <button onClick={handleSave} disabled={isSaving} className={`px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase rounded-full hover:bg-gold transition-all shadow-xl disabled:opacity-50`}>
              {isSaving ? 'Publishing to Postgres...' : 'Publish Updates'}
            </button>
          </div>
        </header>

        <main className="p-12 overflow-y-auto flex-grow">
           {isSaved && <div className="mb-8 p-4 bg-green-50 text-green-600 rounded-xl text-center font-black uppercase text-[10px] animate-bounce">Data Berhasil Disimpan di Vercel Postgres!</div>}
           
           {activeTab === 'profile' && (
              <div className="grid grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chef Name</label>
                    <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-3 text-sm font-bold" value={data.chefName} onChange={(e) => updateField('chefName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biography</label>
                    <textarea className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-3 text-sm h-48" value={data.chefBio} onChange={(e) => updateField('chefBio', e.target.value)} />
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col items-center">
                  <div className="aspect-[3/4] w-48 rounded-3xl overflow-hidden shadow-xl mb-6 bg-slate-100">
                    <img src={data.chefProfileImage} className="w-full h-full object-cover object-top" alt="Chef Profile" />
                  </div>
                  <FileUploader 
                    label="Update Profile Photo (Vercel Blob)" 
                    sizeGuidance="Max 4MB" 
                    isUploading={uploadingField === 'chefProfileImage'}
                    onUpload={(b) => handleImageUpload('chefProfileImage', b, 'chef-profile.jpg')} 
                  />
                </div>
              </div>
           )}

           {activeTab === 'hero' && (
              <div className="grid grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Title</label>
                    <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-3 text-sm font-bold" value={data.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sub-headline</label>
                    <textarea className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-3 text-sm h-32" value={data.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col items-center">
                   <div className="aspect-[3/4] w-48 rounded-3xl overflow-hidden shadow-xl mb-6 bg-slate-100">
                    <img src={data.heroImage} className="w-full h-full object-cover object-top" alt="Hero" />
                  </div>
                  <FileUploader 
                    label="Update Hero Image (Vercel Blob)" 
                    sizeGuidance="Portrait 3:4" 
                    isUploading={uploadingField === 'heroImage'}
                    onUpload={(b) => handleImageUpload('heroImage', b, 'hero-image.jpg')} 
                  />
                </div>
              </div>
           )}

           {activeTab === 'workshops' && (
             <div className="space-y-8">
               {workshops.active.map(ws => (
                 <div key={ws.id} className="bg-white p-10 rounded-[3rem] border border-stone-200 flex gap-10">
                   <div className="w-48 aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 shadow-md">
                     <img src={ws.image} className="w-full h-full object-cover" alt="" />
                   </div>
                   <div className="flex-grow space-y-4">
                     <input className="w-full font-serif text-xl font-black bg-stone-50 p-3 rounded-xl" value={ws.title} onChange={(e) => updateListItem('workshops', ws.id, { title: e.target.value })} />
                     <FileUploader 
                        label="Update Poster (Vercel Blob)" 
                        sizeGuidance="Portrait 3:4" 
                        isUploading={uploadingField === `workshops:${ws.id}`}
                        onUpload={(b) => handleImageUpload(`workshops:${ws.id}`, b, 'workshop-poster.jpg')} 
                     />
                     <button onClick={() => removeItem('workshops', ws.id)} className="text-red-400 text-[10px] font-black uppercase">Hapus Batch</button>
                   </div>
                 </div>
               ))}
               <button onClick={() => addItem('workshops', { id: `ws-${Date.now()}`, title: 'Batch Baru', description: 'Intensive Masterclass', price: 1500000, type: ClassType.LIVE, image: ACTUAL_CHEF_PHOTO, duration: '4 Jam', level: 'Professional', isHistorical: false })} className="w-full py-10 border-4 border-dashed border-stone-200 rounded-[3rem] text-slate-400 font-black uppercase text-[10px] hover:bg-stone-50">+ Tambah Workshop</button>
             </div>
           )}
        </main>
      </div>
    </div>
  );
};

export default AdminCMS;
