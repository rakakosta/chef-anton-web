
import React from 'react';
import { CMSData } from '../../services/dataService';
import { ReviewCategory } from '../../types';
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

const AdminReviews: React.FC<Props> = ({ data, updateListItem, removeItem, addItem, uploadingField, handleImageUpload, localPreviews }) => {
  return (
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
        {data.reviews.map(rev => (
          <div key={rev.id} className="bg-white p-12 rounded-[4.5rem] border border-stone-200 flex flex-col md:flex-row gap-16 shadow-sm hover:shadow-2xl transition-all group relative">
            <div className="flex flex-col items-center gap-8 flex-shrink-0">
               <div className="w-44 h-44 rounded-[3.5rem] overflow-hidden border-8 border-stone-50 shadow-2xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-3 relative">
                 <img src={localPreviews[`reviews:${rev.id}`] || rev.avatar} className="w-full h-full object-cover" alt="" />
                 {uploadingField === `reviews:${rev.id}` && (
                   <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                      <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                   </div>
                 )}
               </div>
               <FileUploader label="Alumni Photo" sizeGuidance="Square 1:1" isUploading={uploadingField === `reviews:${rev.id}`} onUpload={(file) => handleImageUpload(`reviews:${rev.id}`, file, 'avatar.jpg')} />
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
              <InputWrapper label="Review Message">
                <textarea className="w-full bg-stone-50 p-8 rounded-[3rem] text-sm h-48 italic border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all leading-loose" value={rev.comment} onChange={(e) => updateListItem('reviews', rev.id, { comment: e.target.value })} />
              </InputWrapper>
              <div className="flex flex-wrap items-center gap-12 pt-10 border-t border-stone-100">
                 <InputWrapper label="Review Category">
                   <select className="bg-slate-950 text-white px-10 py-5 rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.3em] shadow-2xl outline-none border border-white/10 cursor-pointer" value={rev.category} onChange={(e) => updateListItem('reviews', rev.id, { category: e.target.value as ReviewCategory })}>
                     <option>Live Workshop</option>
                     <option>Kelas Rekaman</option>
                     <option>Private Consultancy</option>
                   </select>
                 </InputWrapper>
                 <button onClick={() => removeItem('reviews', rev.id)} className="ml-auto px-8 py-4 bg-red-50 text-red-400 text-[10px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-red-500 hover:text-white transition-all">❌ Remove</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminReviews;
