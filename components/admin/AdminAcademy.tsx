
import React from 'react';
import { CMSData } from '../../services/dataService';
import { ClassType } from '../../types';
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

const AdminAcademy: React.FC<Props> = ({ data, updateListItem, removeItem, addItem, uploadingField, handleImageUpload, localPreviews }) => {
  return (
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
        {data.recordedClasses.map(rc => (
          <div key={rc.id} className="bg-white p-10 rounded-[4rem] border border-stone-200 flex flex-col gap-10 shadow-sm hover:shadow-2xl transition-all group overflow-hidden">
             <div className="aspect-video w-full rounded-[3rem] overflow-hidden bg-stone-100 border-8 border-white shadow-2xl group-hover:scale-[1.03] transition-transform duration-700">
               <img src={localPreviews[`recordedClasses:${rc.id}`] || rc.image} className="w-full h-full object-cover" alt="" />
               {uploadingField === `recordedClasses:${rc.id}` && (
                 <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                 </div>
               )}
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
               </div>
               <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-stone-100">
                 <FileUploader label="Update Cover" sizeGuidance="16:9 Landscape" isUploading={uploadingField === `recordedClasses:${rc.id}`} onUpload={(file) => handleImageUpload(`recordedClasses:${rc.id}`, file, 'academy-cover.jpg')} />
                 <button onClick={() => removeItem('recordedClasses', rc.id)} className="px-8 py-4 text-red-400 text-[10px] font-black uppercase hover:bg-red-50 rounded-2xl ml-auto transition-all">❌ Remove</button>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminAcademy;
