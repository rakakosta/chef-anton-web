
import React, { useState, useMemo } from 'react';
import { getCMSData, saveCMSData, CMSData, Partner } from '../services/dataService';
import { ClassType, CulinaryClass, PortfolioItem, Review, ReviewCategory, FooterLink } from '../types';

interface Props {
  onExit: () => void;
}

const FileUploader = ({ label, sizeGuidance, onUpload }: { label: string, sizeGuidance: string, onUpload: (base64: string) => void }) => {
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
        <input 
          type="file" 
          accept="image/*"
          className="w-full text-[10px] text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-gold file:text-white hover:file:bg-slate-900 transition-all cursor-pointer"
          onChange={handleFile}
        />
        <div className="p-3 bg-stone-100 rounded-xl border border-stone-200">
          <p className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Ukuran File: <span className="text-gold">{sizeGuidance}</span></p>
        </div>
      </div>
    </div>
  );
};

const AdminCMS: React.FC<Props> = ({ onExit }) => {
  const [data, setData] = useState<CMSData>(getCMSData());
  const [activeTab, setActiveTab] = useState<'hero' | 'profile' | 'partners' | 'workshops' | 'recorded' | 'portfolio' | 'reviews' | 'footer'>('hero');
  const [isSaved, setIsSaved] = useState(false);
  const [reviewFilter, setReviewFilter] = useState<'All' | ReviewCategory>('All');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSave = () => {
    saveCMSData(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRestore = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan semua perubahan?')) {
      setData(getCMSData());
    }
  };

  const updateField = (field: keyof CMSData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const updateListItem = (field: keyof CMSData, id: string, updates: any) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).map(item => item.id === id ? { ...item, ...updates } : item)
    }));
  };

  const addItem = (field: keyof CMSData, newItem: any) => {
    setData(prev => ({
      ...prev,
      [field]: [newItem, ...(prev[field] as any[])]
    }));
  };

  const removeItem = (field: keyof CMSData, id: string) => {
    setData(prev => ({
      ...prev,
      [field]: (prev[field] as any[]).filter(item => item.id !== id)
    }));
  };

  const updateFooterLink = (category: 'footerEducation' | 'footerB2B', linkId: string, updates: Partial<FooterLink>) => {
    setData(prev => {
      const cat = prev[category];
      const newLinks = cat.links.map(l => l.id === linkId ? { ...l, ...updates } : l);
      return {
        ...prev,
        [category]: { ...cat, links: newLinks }
      };
    });
  };

  const addFooterLink = (category: 'footerEducation' | 'footerB2B') => {
    setData(prev => {
      const cat = prev[category];
      const newLink = { id: `f-${Date.now()}`, label: 'Menu Baru', url: '#' };
      return {
        ...prev,
        [category]: { ...cat, links: [...cat.links, newLink] }
      };
    });
  };

  const removeFooterLink = (category: 'footerEducation' | 'footerB2B', linkId: string) => {
    setData(prev => {
      const cat = prev[category];
      const newLinks = cat.links.filter(l => l.id !== linkId);
      return {
        ...prev,
        [category]: { ...cat, links: newLinks }
      };
    });
  };

  const workshops = useMemo(() => {
    const list = data.workshops || [];
    return {
      active: list.filter(ws => !ws.isHistorical),
      historical: list.filter(ws => ws.isHistorical)
    };
  }, [data.workshops]);

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
      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar Nav (Desktop Sidebar / Mobile Drawer) */}
      <aside className={`fixed inset-y-0 left-0 w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-50 transform transition-transform duration-300 lg:static lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-8 lg:p-10 border-b border-white/5 flex justify-between items-center">
          <div>
            <h1 className="text-xl lg:text-2xl font-serif font-black text-gold uppercase tracking-tighter">Chef Portal</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-1">Management</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        
        <nav className="flex-grow p-4 lg:p-6 space-y-1 overflow-y-auto">
          {navItems.map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[10px] lg:text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-gold text-white shadow-lg translate-x-1' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={onExit} className="w-full py-4 bg-white text-slate-950 text-[10px] font-black uppercase rounded-xl hover:bg-gold transition-all">Exit to Site</button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Responsive Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 h-16 lg:h-24 flex items-center justify-between px-4 lg:px-12 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 bg-stone-100 rounded-lg text-slate-600 hover:bg-gold hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <h2 className="text-sm lg:text-xl font-serif font-black text-slate-900 uppercase tracking-widest truncate max-w-[150px] lg:max-w-none">
              {activeTab.replace('-', ' ')}
            </h2>
          </div>

          <div className="flex items-center gap-2 lg:gap-4">
            <button 
              onClick={handleRestore} 
              className="px-3 py-2.5 lg:px-8 lg:py-4 border border-stone-200 text-slate-400 text-[9px] lg:text-[11px] font-black uppercase rounded-full hover:bg-stone-50 hover:text-slate-600 transition-all"
            >
              <span className="hidden lg:inline">Restore Previous</span>
              <span className="lg:hidden">Restore</span>
            </button>
            <button 
              onClick={handleSave} 
              className="px-4 py-2.5 lg:px-10 lg:py-4 bg-slate-900 text-white text-[9px] lg:text-[11px] font-black uppercase rounded-full hover:bg-gold transition-all shadow-xl"
            >
              <span className="hidden lg:inline">Publish Updates</span>
              <span className="lg:hidden">Publish</span>
            </button>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="p-4 lg:p-12 overflow-y-auto flex-grow bg-stone-50/50">
          <div className="max-w-5xl mx-auto space-y-8 lg:space-y-12 pb-20">
            {isSaved && (
              <div className="bg-green-50 border border-green-100 p-4 rounded-xl flex items-center justify-center gap-3 animate-in fade-in slide-in-from-top-4">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping"></div>
                <span className="text-green-600 text-[10px] font-black uppercase tracking-widest">Saved Successfully</span>
              </div>
            )}

            {activeTab === 'footer' && (
              <div className="space-y-8 lg:space-y-12">
                {[
                  { key: 'footerEducation', title: 'Pendidikan' },
                  { key: 'footerB2B', title: 'Layanan B2B' }
                ].map((catConfig) => {
                  const category = data[catConfig.key as 'footerEducation' | 'footerB2B'];
                  return (
                    <div key={catConfig.key} className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] border border-stone-200 space-y-6 lg:space-y-8">
                      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
                        <div className="flex-grow max-w-sm">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gold mb-2 block">Judul Kategori</label>
                          <input 
                            className="w-full font-serif text-xl lg:text-2xl font-black bg-stone-50 border border-stone-100 rounded-xl p-3 lg:p-4" 
                            value={category.title} 
                            onChange={(e) => setData(prev => ({ ...prev, [catConfig.key]: { ...category, title: e.target.value } }))}
                          />
                        </div>
                        <button 
                          onClick={() => addFooterLink(catConfig.key as any)}
                          className="px-6 py-3 bg-slate-900 text-white text-[9px] lg:text-[10px] font-black uppercase rounded-xl hover:bg-gold w-full md:w-auto"
                        >
                          + Tambah Link
                        </button>
                      </div>

                      <div className="space-y-3 lg:space-y-4">
                        {category.links.map((link) => (
                          <div key={link.id} className="grid grid-cols-1 md:grid-cols-12 gap-3 lg:gap-4 items-center bg-stone-50 p-4 rounded-2xl border border-stone-100 relative group">
                            <div className="md:col-span-5 space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-400">Label</label>
                              <input 
                                className="w-full bg-white text-[10px] font-bold p-2.5 rounded-lg border border-stone-200" 
                                value={link.label}
                                onChange={(e) => updateFooterLink(catConfig.key as any, link.id, { label: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-5 space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-400">URL Tujuan</label>
                              <input 
                                className="w-full bg-white text-[10px] p-2.5 rounded-lg border border-stone-200 font-mono" 
                                value={link.url}
                                onChange={(e) => updateFooterLink(catConfig.key as any, link.id, { url: e.target.value })}
                              />
                            </div>
                            <div className="md:col-span-2 flex justify-end md:justify-center items-end pt-2">
                              <button 
                                onClick={() => removeFooterLink(catConfig.key as any, link.id)}
                                className="text-red-400 hover:text-red-600 p-2 bg-red-50 md:bg-transparent rounded-lg"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'hero' && (
              <div className="space-y-8 lg:space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                  <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] border border-stone-200 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gold mb-4">Main Content</h3>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Main Title</label>
                      <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm font-bold" value={data.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                      <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4 text-sm h-32 leading-relaxed" value={data.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
                    </div>
                  </div>
                  <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] border border-stone-200 flex flex-col items-center">
                    <div className="aspect-[3/4] w-40 lg:w-48 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl mb-6">
                      <img src={data.heroImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <FileUploader label="Update Hero Image" sizeGuidance="Portrait 3:4" onUpload={(b) => updateField('heroImage', b)} />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
                <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] border border-stone-200 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chef Name</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-3 text-sm font-bold" value={data.chefName} onChange={(e) => updateField('chefName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chef Title</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-3 text-sm font-bold" value={data.chefTitle} onChange={(e) => updateField('chefTitle', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biography</label>
                    <textarea className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-3 text-sm h-48 leading-relaxed" value={data.chefBio} onChange={(e) => updateField('chefBio', e.target.value)} />
                  </div>
                </div>
                <div className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] border border-stone-200 flex flex-col items-center">
                  <div className="aspect-[4/5] w-40 lg:w-48 rounded-2xl lg:rounded-3xl overflow-hidden shadow-xl mb-6">
                    <img src={data.chefProfileImage} className="w-full h-full object-cover" alt="" />
                  </div>
                  <FileUploader label="Update Profile Photo" sizeGuidance="Max 1.5MB" onUpload={(b) => updateField('chefProfileImage', b)} />
                </div>
              </div>
            )}

            {activeTab === 'workshops' && (
              <div className="space-y-8">
                <div className="flex justify-between items-center gap-4">
                  <h3 className="text-[10px] font-black uppercase tracking-widest text-gold">Active Workshops</h3>
                  <button onClick={() => addItem('workshops', { id: `ws-${Date.now()}`, title: 'New Masterclass', description: 'Intensive session...', price: 1500000, priceBeforeDiscount: 2000000, location: 'Zoom / Office', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800', type: ClassType.LIVE, duration: '4 Jam Intensif', slots: 20, level: 'Professional', date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 16), isHistorical: false })} className="px-5 py-2.5 bg-slate-900 text-white text-[9px] font-black uppercase rounded-full whitespace-nowrap">+ New Batch</button>
                </div>
                <div className="space-y-6">
                  {workshops.active.map(ws => (
                    <div key={ws.id} className="bg-white p-6 lg:p-10 rounded-3xl lg:rounded-[3rem] border border-stone-200 flex flex-col lg:flex-row gap-6 lg:gap-10">
                      <div className="w-full lg:w-48 aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shrink-0 shadow-lg">
                        <img src={ws.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400">Workshop Title</label>
                            <input className="w-full text-base font-serif font-black bg-stone-50 rounded-xl p-3 border border-stone-100" value={ws.title} onChange={(e) => updateListItem('workshops', ws.id, { title: e.target.value })} />
                          </div>
                          <div className="space-y-1">
                            <label className="text-[8px] font-black uppercase text-slate-400">Jadwal Sesi</label>
                            <input type="datetime-local" className="w-full text-[10px] font-bold bg-stone-50 rounded-xl p-3 border border-stone-100" value={ws.date ? ws.date.slice(0, 16) : ''} onChange={(e) => updateListItem('workshops', ws.id, { date: e.target.value })} />
                          </div>
                        </div>
                        <FileUploader label="Update Poster" sizeGuidance="Portrait 3:4" onUpload={(b) => updateListItem('workshops', ws.id, { image: b })} />
                        <div className="flex items-center gap-4 pt-4">
                          <button onClick={() => updateListItem('workshops', ws.id, { isHistorical: true })} className="text-[9px] font-black uppercase text-gold bg-gold/5 px-4 py-2 rounded-lg border border-gold/10">Selesaikan Batch</button>
                          <button onClick={() => removeItem('workshops', ws.id)} className="text-[9px] font-black uppercase text-red-400 hover:text-red-600">Hapus</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Layout per tab lainnya disesuaikan secara serupa untuk mobile... */}
            {activeTab === 'recorded' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {(data.recordedClasses || []).map(rc => (
                  <div key={rc.id} className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col gap-5">
                    <div className="aspect-video rounded-xl overflow-hidden bg-stone-100 shadow-md"><img src={rc.image} className="w-full h-full object-cover" alt="" /></div>
                    <div className="space-y-3">
                      <input className="w-full font-serif font-black text-lg bg-stone-50 p-2.5 rounded-xl" value={rc.title} onChange={(e) => updateListItem('recordedClasses', rc.id, { title: e.target.value })} />
                      <FileUploader label="Update Video Cover" sizeGuidance="Wide 16:9" onUpload={(b) => updateListItem('recordedClasses', rc.id, { image: b })} />
                      <button onClick={() => removeItem('recordedClasses', rc.id)} className="text-red-400 text-[9px] font-black uppercase">Hapus Kelas</button>
                    </div>
                  </div>
                ))}
                <button onClick={() => addItem('recordedClasses', { id: `rc-${Date.now()}`, title: 'New Class', description: 'Video modules...', price: 499000, image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800', type: ClassType.RECORDED, duration: '5 Modules', level: 'Beginner', soldCount: 0 })} className="h-40 border-2 border-dashed border-stone-200 rounded-3xl text-slate-400 text-[10px] font-black uppercase hover:bg-stone-50 transition-colors">+ Tambah Masterclass</button>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-6">
                {data.reviews.map(r => (
                  <div key={r.id} className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col md:flex-row gap-6 items-start shadow-sm">
                    <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-stone-100"><img src={r.avatar} className="w-full h-full object-cover" alt="" /></div>
                    <div className="flex-grow space-y-3 w-full">
                      <input className="w-full font-black text-[10px] uppercase bg-stone-50 p-3 rounded-xl" value={r.name} onChange={(e) => updateListItem('reviews', r.id, { name: e.target.value })} />
                      <textarea className="w-full text-xs italic bg-stone-50 p-3 rounded-xl h-24" value={r.comment} onChange={(e) => updateListItem('reviews', r.id, { comment: e.target.value })} />
                      <div className="flex items-center gap-4">
                        <FileUploader label="Ganti Avatar" sizeGuidance="Square" onUpload={(b) => updateListItem('reviews', r.id, { avatar: b })} />
                        <button onClick={() => removeItem('reviews', r.id)} className="text-red-400 text-[8px] uppercase font-black">Hapus</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'partners' && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {(data.partners || []).map(p => (
                  <div key={p.id} className="bg-white p-4 rounded-2xl border border-stone-200 flex flex-col items-center gap-3 group">
                    <div className="text-3xl h-12 flex items-center justify-center">{p.logo.length < 50 ? p.logo : '🖼️'}</div>
                    <input className="text-center text-[9px] font-black uppercase w-full bg-stone-50 p-2 rounded-lg" value={p.name} onChange={(e) => updateListItem('partners', p.id, { name: e.target.value })} />
                    <button onClick={() => removeItem('partners', p.id)} className="text-[8px] text-red-400 uppercase font-black">Hapus</button>
                  </div>
                ))}
                <button onClick={() => addItem('partners', { id: `p-${Date.now()}`, name: 'New Partner', logo: '🏢' })} className="aspect-square border-2 border-dashed border-stone-200 rounded-2xl text-slate-400 text-[9px] font-black uppercase">+ Partner</button>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCMS;
