
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

  const handleSave = () => {
    saveCMSData(data);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleRestore = () => {
    if (window.confirm('Apakah Anda yakin ingin membatalkan semua perubahan yang belum dipublikasikan? Data akan dikembalikan ke versi publik terakhir.')) {
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

  const filteredReviews = useMemo(() => {
    if (reviewFilter === 'All') return data.reviews;
    return data.reviews.filter(r => r.category === reviewFilter);
  }, [data.reviews, reviewFilter]);

  return (
    <div className="min-h-screen bg-stone-50 flex font-sans">
      {/* Sidebar */}
      <div className="w-72 bg-slate-950 text-white flex flex-col shadow-2xl z-20">
        <div className="p-10 border-b border-white/5">
          <h1 className="text-2xl font-serif font-black text-gold uppercase tracking-tighter">Chef Portal</h1>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.3em] mt-2">CMS Management</p>
        </div>
        
        <nav className="flex-grow p-6 space-y-1">
          {[
            { id: 'hero', label: 'Landing Hero', icon: '✨' },
            { id: 'profile', label: 'Chef Profile', icon: '👤' },
            { id: 'partners', label: 'Partners', icon: '🤝' },
            { id: 'workshops', label: 'Workshops', icon: '🎥' },
            { id: 'recorded', label: 'Academy', icon: '📀' },
            { id: 'portfolio', label: 'Portfolio', icon: '🖼️' },
            { id: 'reviews', label: 'Reviews', icon: '⭐️' },
            { id: 'footer', label: 'Footer Links', icon: '🔗' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab.id 
                  ? 'bg-gold text-white shadow-lg translate-x-2' 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={onExit} className="w-full py-4 bg-white text-slate-950 text-[10px] font-black uppercase rounded-xl hover:bg-gold transition-all">Exit to Website</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-grow flex flex-col h-screen overflow-hidden">
        <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 h-24 flex items-center justify-between px-12">
          <h2 className="text-xl font-serif font-black text-slate-900 uppercase tracking-widest">{activeTab.replace('-', ' ')}</h2>
          <div className="flex items-center gap-4">
            {isSaved && <span className="text-green-600 text-[10px] font-black uppercase tracking-widest animate-pulse">Saved Successfully</span>}
            <button 
              onClick={handleRestore} 
              className="px-8 py-4 border border-stone-200 text-slate-400 text-[11px] font-black uppercase rounded-full hover:bg-stone-50 hover:text-slate-600 transition-all"
            >
              Restore Previous
            </button>
            <button 
              onClick={handleSave} 
              className="px-10 py-4 bg-slate-900 text-white text-[11px] font-black uppercase rounded-full hover:bg-gold transition-all shadow-xl"
            >
              Publish Updates
            </button>
          </div>
        </header>

        <main className="p-12 overflow-y-auto flex-grow">
          <div className="max-w-5xl mx-auto space-y-12">
            
            {/* FOOTER TAB */}
            {activeTab === 'footer' && (
              <div className="space-y-12">
                <div className="bg-amber-50 p-6 rounded-2xl border border-amber-100 mb-8">
                  <p className="text-[10px] font-bold text-amber-800 uppercase tracking-widest leading-relaxed">
                    Note: Footer website mendukung maksimal 2 kolom kategori navigasi (Pendidikan & Layanan B2B) untuk menjaga estetika desain premium.
                  </p>
                </div>
                {[
                  { key: 'footerEducation', title: 'Kategori: Pendidikan' },
                  { key: 'footerB2B', title: 'Kategori: Layanan B2B' }
                ].map((catConfig) => {
                  const category = data[catConfig.key as 'footerEducation' | 'footerB2B'];
                  return (
                    <div key={catConfig.key} className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-8">
                      <div className="flex justify-between items-end">
                        <div className="flex-grow max-w-sm">
                          <label className="text-[10px] font-black uppercase tracking-widest text-gold mb-3 block">Judul Kategori</label>
                          <input 
                            className="w-full font-serif text-2xl font-black bg-stone-50 border border-stone-100 rounded-xl p-4" 
                            value={category.title} 
                            onChange={(e) => setData(prev => ({ ...prev, [catConfig.key]: { ...category, title: e.target.value } }))}
                          />
                        </div>
                        <button 
                          onClick={() => addFooterLink(catConfig.key as any)}
                          className="px-6 py-4 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-gold"
                        >
                          + Tambah Link
                        </button>
                      </div>

                      <div className="space-y-4">
                        {category.links.map((link) => (
                          <div key={link.id} className="grid grid-cols-12 gap-4 items-center bg-stone-50 p-4 rounded-2xl border border-stone-100">
                            <div className="col-span-5 space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-400">Label Link</label>
                              <input 
                                className="w-full bg-white text-xs font-bold p-3 rounded-lg border border-stone-200" 
                                value={link.label}
                                onChange={(e) => updateFooterLink(catConfig.key as any, link.id, { label: e.target.value })}
                              />
                            </div>
                            <div className="col-span-5 space-y-1">
                              <label className="text-[8px] font-black uppercase text-slate-400">URL Tujuan</label>
                              <input 
                                className="w-full bg-white text-xs p-3 rounded-lg border border-stone-200 font-mono" 
                                value={link.url}
                                onChange={(e) => updateFooterLink(catConfig.key as any, link.id, { url: e.target.value })}
                              />
                            </div>
                            <div className="col-span-2 flex justify-center items-end pt-4">
                              <button 
                                onClick={() => removeFooterLink(catConfig.key as any, link.id)}
                                className="text-red-500 hover:text-red-700 p-2"
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

            {/* HERO TAB */}
            {activeTab === 'hero' && (
              <div className="space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-6">
                    <h3 className="text-[10px] font-black uppercase tracking-widest text-gold mb-4">Main Hero Content</h3>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Hero Main Title</label>
                      <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold" value={data.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Description</label>
                      <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm h-32" value={data.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
                    </div>
                  </div>
                  <div className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col items-center">
                    <div className="aspect-[3/4] w-48 rounded-3xl overflow-hidden shadow-2xl mb-6">
                      <img src={data.heroImage} className="w-full h-full object-cover" alt="" />
                    </div>
                    <FileUploader label="Update Hero Image" sizeGuidance="Max 2MB (Portrait 3:4)" onUpload={(b) => updateField('heroImage', b)} />
                  </div>
                </div>
              </div>
            )}

            {/* PROFILE TAB */}
            {activeTab === 'profile' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chef Name</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold" value={data.chefName} onChange={(e) => updateField('chefName', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Chef Title</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm font-bold" value={data.chefTitle} onChange={(e) => updateField('chefTitle', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Main Quote</label>
                    <input type="text" className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm italic" value={data.chefBioQuote} onChange={(e) => updateField('chefBioQuote', e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Biography</label>
                    <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-4 text-sm h-48" value={data.chefBio} onChange={(e) => updateField('chefBio', e.target.value)} />
                  </div>
                </div>
                <div className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col items-center">
                  <div className="aspect-[4/5] w-48 rounded-3xl overflow-hidden shadow-2xl mb-6">
                    <img src={data.chefProfileImage} className="w-full h-full object-cover" alt="" />
                  </div>
                  <FileUploader label="Update Profile Photo" sizeGuidance="Max 1.5MB" onUpload={(b) => updateField('chefProfileImage', b)} />
                </div>
              </div>
            )}

            {/* WORKSHOPS TAB */}
            {activeTab === 'workshops' && (
              <div className="space-y-12">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-black uppercase tracking-widest text-gold">Active Workshops</h3>
                  <button onClick={() => addItem('workshops', { id: `ws-${Date.now()}`, title: 'New Masterclass', description: 'Intensive session...', price: 1500000, priceBeforeDiscount: 2000000, location: 'Zoom / Office', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800', type: ClassType.LIVE, duration: '4 Jam Intensif', slots: 20, level: 'Professional', date: new Date(Date.now() + 86400000 * 14).toISOString().slice(0, 16), isHistorical: false })} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full">+ Add New Batch</button>
                </div>
                <div className="space-y-8">
                  {workshops.active.map(ws => (
                    <div key={ws.id} className="bg-white p-10 rounded-[3rem] border border-stone-200 flex flex-col md:flex-row gap-10">
                      <div className="w-56 h-72 rounded-[2rem] overflow-hidden bg-stone-100 flex-shrink-0 shadow-lg border-4 border-white">
                        <img src={ws.image} className="w-full h-full object-cover" alt="" />
                      </div>
                      <div className="flex-grow space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Workshop Title</label>
                            <input className="w-full text-lg font-serif font-black bg-stone-50 rounded-xl p-3 border border-stone-100" value={ws.title} onChange={(e) => updateListItem('workshops', ws.id, { title: e.target.value })} />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[9px] font-black uppercase tracking-widest text-slate-400">Jadwal Sesi</label>
                            <input type="datetime-local" className="w-full text-xs font-bold bg-stone-50 rounded-xl p-3 border border-stone-100" value={ws.date ? ws.date.slice(0, 16) : ''} onChange={(e) => updateListItem('workshops', ws.id, { date: e.target.value })} />
                          </div>
                        </div>
                        <FileUploader label="Poster Workshop" sizeGuidance="Max 2MB" onUpload={(b) => updateListItem('workshops', ws.id, { image: b })} />
                        <div className="flex justify-between items-center">
                          <button onClick={() => updateListItem('workshops', ws.id, { isHistorical: true })} className="text-[10px] font-black uppercase text-gold hover:text-slate-900 transition-colors px-6 py-3 bg-gold/10 rounded-xl">Selesaikan Batch</button>
                          <button onClick={() => removeItem('workshops', ws.id)} className="text-[9px] font-black uppercase text-red-500 hover:underline">Hapus Batch</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ACADEMY TAB */}
            {activeTab === 'recorded' && (
              <div className="space-y-8">
                <button onClick={() => addItem('recordedClasses', { id: `rc-${Date.now()}`, title: 'New Recorded Class', description: 'Video module description...', price: 499000, image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?q=80&w=800', type: ClassType.RECORDED, duration: '5 Modules', level: 'Beginner', soldCount: 0 })} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full">+ Add Video Course</button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {(data.recordedClasses || []).map(rc => (
                    <div key={rc.id} className="bg-white p-8 rounded-[3rem] border border-stone-200 flex flex-col gap-6">
                      <div className="aspect-video rounded-2xl overflow-hidden bg-stone-100 shadow-lg"><img src={rc.image} className="w-full h-full object-cover" alt="" /></div>
                      <div className="space-y-4">
                        <input className="w-full font-serif font-black text-lg bg-stone-50 p-3 rounded-xl" value={rc.title} onChange={(e) => updateListItem('recordedClasses', rc.id, { title: e.target.value })} />
                        <FileUploader label="Update Thumbnail" sizeGuidance="Max 1.5MB" onUpload={(b) => updateListItem('recordedClasses', rc.id, { image: b })} />
                        <button onClick={() => removeItem('recordedClasses', rc.id)} className="text-red-500 text-[10px] font-black uppercase hover:underline">Hapus Kelas</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* REVIEWS TAB */}
            {activeTab === 'reviews' && (
              <div className="space-y-8">
                <button onClick={() => addItem('reviews', { id: `r-${Date.now()}`, name: 'Reviewer Name', role: 'Executive Chef', comment: 'Amazing session...', avatar: 'https://i.pravatar.cc/150?u=new', category: 'Live Workshop' as ReviewCategory })} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full shadow-lg">+ Add Review</button>
                <div className="space-y-6">
                  {data.reviews.map(r => (
                    <div key={r.id} className="bg-white p-10 rounded-[3.5rem] border border-stone-200 flex flex-col md:flex-row gap-10 items-start shadow-sm">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-stone-100"><img src={r.avatar} className="w-full h-full object-cover" alt="" /></div>
                      <div className="flex-grow space-y-4 w-full">
                        <input className="w-full font-black text-sm uppercase bg-stone-50 p-3 rounded-xl" value={r.name} onChange={(e) => updateListItem('reviews', r.id, { name: e.target.value })} />
                        <textarea className="w-full text-xs italic bg-stone-50 p-4 rounded-xl h-32" value={r.comment} onChange={(e) => updateListItem('reviews', r.id, { comment: e.target.value })} />
                        <FileUploader label="Update Foto Avatar" sizeGuidance="Max 200KB" onUpload={(b) => updateListItem('reviews', r.id, { avatar: b })} />
                        <button onClick={() => removeItem('reviews', r.id)} className="text-red-500 text-[8px] uppercase font-black hover:underline">Hapus Testimoni</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PARTNERS TAB */}
            {activeTab === 'partners' && (
              <div className="space-y-8">
                <button onClick={() => addItem('partners', { id: `p-${Date.now()}`, name: 'New Partner', logo: '🏢' })} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full">+ Add Partner</button>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {(data.partners || []).map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-3xl border border-stone-200 flex flex-col items-center gap-4 group">
                      <div className="text-4xl">{p.logo.length < 50 ? p.logo : '🖼️'}</div>
                      <input className="text-center text-[10px] font-black uppercase w-full bg-stone-50 p-2" value={p.name} onChange={(e) => updateListItem('partners', p.id, { name: e.target.value })} />
                      <FileUploader label="Logo" sizeGuidance="Max 500KB" onUpload={(b) => updateListItem('partners', p.id, { logo: b })} />
                      <button onClick={() => removeItem('partners', p.id)} className="text-[8px] text-red-500 uppercase font-black opacity-0 group-hover:opacity-100 transition-opacity">Remove</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PORTFOLIO TAB */}
            {activeTab === 'portfolio' && (
              <div className="space-y-8">
                <button onClick={() => addItem('portfolio', { id: `p-${Date.now()}`, title: 'New Project', category: 'Hotel', image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=800', aiPrompt: '' })} className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase rounded-full">+ Add Portfolio</button>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {(data.portfolio || []).map(p => (
                    <div key={p.id} className="bg-white p-6 rounded-[2.5rem] border border-stone-200 space-y-4">
                      <div className="aspect-square rounded-2xl overflow-hidden"><img src={p.image} className="w-full h-full object-cover" alt="" /></div>
                      <input className="w-full text-[10px] font-black uppercase bg-stone-50 p-2 rounded-lg" value={p.title} onChange={(e) => updateListItem('portfolio', p.id, { title: e.target.value })} />
                      <FileUploader label="Gambar Project" sizeGuidance="Max 2MB" onUpload={(b) => updateListItem('portfolio', p.id, { image: b })} />
                      <button onClick={() => removeItem('portfolio', p.id)} className="text-red-500 text-[8px] uppercase font-black hover:underline">Hapus</button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminCMS;
