
import React from 'react';
import { CMSData } from '../../services/dataService';
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

const AdminPortfolio: React.FC<Props> = ({ data, updateListItem, removeItem, addItem, uploadingField, handleImageUpload, localPreviews }) => {
  return (
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
        {data.portfolio.map(item => (
          <div key={item.id} className="bg-white p-10 rounded-[4rem] border border-stone-200 space-y-10 shadow-sm group hover:shadow-2xl transition-all">
            <div className="aspect-[16/10] rounded-[3rem] overflow-hidden bg-stone-100 border-8 border-white shadow-2xl group-hover:scale-[1.02] transition-transform duration-700 relative">
              <img src={localPreviews[`portfolio:${item.id}`] || item.image} className="w-full h-full object-cover" alt="" />
              {uploadingField === `portfolio:${item.id}` && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="space-y-8">
              <InputWrapper label="Project Title (Nama Proyek)">
                <input className="w-full font-serif font-black text-3xl bg-stone-50 p-6 rounded-2xl border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={item.title} onChange={(e) => updateListItem('portfolio', item.id, { title: e.target.value })} />
              </InputWrapper>
              <InputWrapper label="Industry / Legacy Category">
                <input className="w-full text-[11px] font-black uppercase tracking-[0.4em] text-gold bg-stone-50 p-6 rounded-2xl border border-stone-100 focus:bg-white focus:border-gold outline-none transition-all" value={item.category} onChange={(e) => updateListItem('portfolio', item.id, { category: e.target.value })} />
              </InputWrapper>
              <div className="flex flex-wrap items-center gap-10 pt-8 border-t border-stone-100">
                <FileUploader label="Update Image Asset" sizeGuidance="16:10 Landscape" isUploading={uploadingField === `portfolio:${item.id}`} onUpload={(file) => handleImageUpload(`portfolio:${item.id}`, file, 'portfolio.jpg')} />
                <button onClick={() => removeItem('portfolio', item.id)} className="px-8 py-4 text-red-400 text-[10px] font-black uppercase hover:bg-red-50 rounded-2xl ml-auto transition-all">❌ Delete Item</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPortfolio;
