
import React from 'react';
import { CMSData } from '../../services/dataService';
import { CulinaryClass, ClassType } from '../../types';
import { ACTUAL_CHEF_PHOTO } from '../../constants';
import { InputWrapper, SectionHeader, FileUploader } from './Shared';

interface Props {
  data: CMSData;
  updateListItem: (field: keyof CMSData, id: string, updates: any) => void;
  removeItem: (field: keyof CMSData, id: string) => void;
  addItem: (field: keyof CMSData, newItem: any) => void;
  uploadingField: string | null;
  handleImageUpload: (field: string, file: File, filename: string) => void;
  localPreviews: Record<string, string>;
}

const AdminWorkshops: React.FC<Props> = ({ data, updateListItem, removeItem, addItem, uploadingField, handleImageUpload, localPreviews }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <SectionHeader 
        title="Workshop Masterlist" 
        subtitle="Manajemen sesi workshop aktif maupun batch historis."
        action={
          <button onClick={() => addItem('workshops', { id: `ws-${Date.now()}`, title: 'Sesi Kuliner Baru', description: 'Intensive culinary training.', price: 1500000, type: ClassType.LIVE, image: ACTUAL_CHEF_PHOTO, duration: '4 Hours', level: 'Professional', isHistorical: false, curriculum: [], slots: 10, displayDate: '', location: '', realAttendance: 0 })} className="group px-12 py-5 bg-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl shadow-gold/20 transform active:scale-95">
             <span className="inline-block transition-transform group-hover:rotate-90 mr-3">+</span> Create New Batch
          </button>
        }
      />
      
      <div className="space-y-4">
        {data.workshops.map(ws => (
          <div key={ws.id} className={`group bg-white p-8 md:p-10 rounded-[3rem] border border-stone-200 flex flex-col lg:flex-row gap-12 shadow-sm transition-all duration-500 hover:shadow-2xl hover:border-gold/30 mb-10 animate-in fade-in slide-in-from-bottom-6 ${ws.isHistorical ? 'bg-stone-50/30' : ''}`}>
            <div className="w-full lg:w-80 flex-shrink-0 flex flex-col gap-4">
              <div className={`relative aspect-[3/4] rounded-[2.5rem] overflow-hidden bg-stone-100 shadow-2xl border-8 border-white transition-all duration-700 ${ws.isHistorical ? 'grayscale opacity-60 scale-95' : 'group-hover:scale-105'}`}>
                <img src={localPreviews[`workshops:${ws.id}`] || ws.image} className="w-full h-full object-cover" alt="" />
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
                {uploadingField === `workshops:${ws.id}` && (
                  <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm flex items-center justify-center">
                     <div className="flex flex-col items-center gap-3">
                       <div className="w-10 h-10 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                       <p className="text-[9px] text-white font-black uppercase tracking-widest">Uploading...</p>
                     </div>
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/80 p-6">
                   <p className="text-white font-serif text-lg leading-tight line-clamp-2">{ws.title || 'Draft Title'}</p>
                </div>
              </div>
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
                      <input className="w-full bg-stone-50/50 border border-stone-100 p-4 rounded-xl text-sm font-bold focus:bg-white focus:border-gold outline-none transition-all" type="number" value={ws.slots || 0} onChange={(e) => updateListItem('workshops', ws.id, { slots: Number(e.target.value) })} />
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
                  onUpload={(file) => handleImageUpload(`workshops:${ws.id}`, file, 'workshop.jpg')} 
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
        ))}
      </div>
    </div>
  );
};

export default AdminWorkshops;
