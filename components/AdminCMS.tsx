
import React, { useState, useEffect } from 'react';
import { getCMSData, saveCMSData, CMSData } from '../services/dataService';
import { uploadImageToBlob } from '../services/imageService';

// Import sub-components
import AdminHero from './admin/AdminHero';
import AdminProfile from './admin/AdminProfile';
import AdminPartners from './admin/AdminPartners';
import AdminWorkshops from './admin/AdminWorkshops';
import AdminAcademy from './admin/AdminAcademy';
import AdminPortfolio from './admin/AdminPortfolio';
import AdminReviews from './admin/AdminReviews';
import AdminFooter from './admin/AdminFooter';

interface Props {
  onExit: () => void;
}

const AdminCMS: React.FC<Props> = ({ onExit }) => {
  const [data, setData] = useState<CMSData | null>(null);
  const [activeTab, setActiveTab] = useState<'hero' | 'profile' | 'partners' | 'workshops' | 'recorded' | 'portfolio' | 'reviews' | 'footer'>('hero');
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadingField, setUploadingField] = useState<string | null>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});

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
    // Mencegah simpan jika masih ada upload gambar yang sedang berjalan
    if (!data || uploadingField) return;
    setIsSaving(true);
    try {
      await saveCMSData(data);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (err: any) {
      alert(`Gagal mempublikasikan: ${err.message || 'Periksa koneksi database di dashboard Vercel'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const updateField = (field: keyof CMSData, value: any) => {
    if (!data) return;
    setData({ ...data, [field]: value });
  };

  const handleImageUpload = async (field: string, file: File, filename: string) => {
    if (!data) return;

    // 1. Aktifkan loading state INSTAN sebelum proses kompresi
    setUploadingField(field);
    
    // 2. Gunakan preview sementara untuk responsivitas UI dan siapkan pembersihan memori
    const tempUrl = URL.createObjectURL(file);
    const oldLocalUrl = localPreviews[field];
    
    setLocalPreviews(prev => ({ ...prev, [field]: tempUrl }));
    
    // Revoke URL lama jika ada untuk cegah memory leak
    if (oldLocalUrl && oldLocalUrl.startsWith('blob:')) {
      URL.revokeObjectURL(oldLocalUrl);
    }

    try {
      // 3. Jalankan kompresi & upload (dengan timeout 8s di service)
      const cloudUrl = await uploadImageToBlob(file, filename);
      
      // 4. Update state data dengan URL permanen
      if (field === 'heroImage' || field === 'chefProfileImage') {
        updateField(field as keyof CMSData, cloudUrl);
      } else if (field.includes(':')) {
        const [listKey, id] = field.split(':');
        const list = [...(data[listKey as keyof CMSData] as any[])];
        const index = list.findIndex(item => String(item.id) === String(id));
        if (index !== -1) {
          if (listKey === 'partners') list[index].logo = cloudUrl;
          else if (listKey === 'reviews') list[index].avatar = cloudUrl;
          else list[index].image = cloudUrl;
          setData({ ...data, [listKey as keyof CMSData]: list });
        }
      }
      
      // Ganti preview blob dengan cloud URL dan revoke blobnya
      setLocalPreviews(prev => ({ ...prev, [field]: cloudUrl }));
      URL.revokeObjectURL(tempUrl);
      
    } catch (err: any) {
      // 5. Tampilkan detail error spesifik (Timeout, Canvas Fail, dll)
      alert(err.message || "Gagal mengunggah gambar. Pastikan file valid.");
      
      // Jika gagal, hapus preview sementara dan bersihkan memori
      setLocalPreviews(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
      URL.revokeObjectURL(tempUrl);
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
    if (window.confirm("Hapus data ini secara permanen?")) {
      setData({ ...data, [field]: (data[field] as any[]).filter(item => item.id !== id) });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50/50 flex font-sans overflow-hidden selection:bg-gold/20">
      {/* Sidebar Navigation */}
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

      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Header Bar */}
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
              disabled={isSaving || uploadingField !== null} 
              className={`group flex items-center gap-4 px-10 py-5 bg-slate-950 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-gold transition-all shadow-xl shadow-slate-200 disabled:opacity-50 transform active:scale-95`}
            >
              {isSaving ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Syncing Changes...
                </>
              ) : uploadingField ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Wait: Processing...
                </>
              ) : (
                <>
                  <span className="text-xl group-hover:animate-bounce">⚡</span> Publish Updates
                </>
              )}
            </button>
          </div>
        </header>

        {/* Tab Content Area */}
        <main className="p-12 overflow-y-auto flex-grow">
           {isSaved && (
             <div className="mb-10 p-8 bg-green-500 text-white rounded-[2.5rem] text-center font-black uppercase text-[11px] tracking-[0.4em] shadow-2xl shadow-green-100 animate-in zoom-in-95 flex items-center justify-center gap-4">
               <span className="text-2xl">✨</span> Data synchronized successfully!
             </div>
           )}
           
           <div className="max-w-7xl mx-auto pb-20">
             {!data ? (
               <div className="flex flex-col items-center justify-center py-48">
                 <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6"></div>
                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Loading CMS Data...</p>
               </div>
             ) : (
               <>
                 {activeTab === 'hero' && <AdminHero data={data} updateField={updateField} uploadingField={uploadingField} handleImageUpload={handleImageUpload} localPreviews={localPreviews} />}
                 {activeTab === 'profile' && <AdminProfile data={data} updateField={updateField} uploadingField={uploadingField} handleImageUpload={handleImageUpload} localPreviews={localPreviews} />}
                 {activeTab === 'workshops' && <AdminWorkshops data={data} updateListItem={updateListItem} removeItem={removeItem} addItem={addItem} uploadingField={uploadingField} handleImageUpload={handleImageUpload} localPreviews={localPreviews} />}
                 {activeTab === 'partners' && <AdminPartners data={data} updateListItem={updateListItem} removeItem={removeItem} addItem={addItem} uploadingField={uploadingField} handleImageUpload={handleImageUpload} localPreviews={localPreviews} />}
                 {activeTab === 'recorded' && <AdminAcademy data={data} updateListItem={updateListItem} removeItem={removeItem} addItem={addItem} uploadingField={uploadingField} handleImageUpload={handleImageUpload} localPreviews={localPreviews} />}
                 {activeTab === 'portfolio' && <AdminPortfolio data={data} updateListItem={updateListItem} removeItem={removeItem} addItem={addItem} uploadingField={uploadingField} handleImageUpload={handleImageUpload} localPreviews={localPreviews} />}
                 {activeTab === 'reviews' && <AdminReviews data={data} updateListItem={updateListItem} removeItem={removeItem} addItem={addItem} uploadingField={uploadingField} handleImageUpload={handleImageUpload} localPreviews={localPreviews} />}
                 {activeTab === 'footer' && <AdminFooter data={data} updateField={updateField} />}
               </>
             )}
           </div>
           
           <div className="mt-24 pt-12 border-t border-stone-200 text-center">
             <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.5em]">Elite Culinary Branding System v7.8 • Premium Enterprise Access</p>
           </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCMS;
