
import React from 'react';
import { CMSData, Partner } from '../../services/dataService';
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

const AdminPartners: React.FC<Props> = ({ data, updateListItem, removeItem, addItem, uploadingField, handleImageUpload, localPreviews }) => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <SectionHeader 
        title="Trusted Partners" 
        subtitle="Kelola daftar klien dan kolaborasi institusi." 
        action={
          <button onClick={() => addItem('partners', { id: `p-${Date.now()}`, name: 'New Partner', logo: '🏢' })} className="px-10 py-5 bg-gold text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-2xl hover:bg-slate-900 transition-all shadow-xl transform active:scale-95">
             + Add New Partner
          </button>
        }
      />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        {data.partners.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-[3.5rem] border border-stone-200 flex flex-col gap-8 shadow-sm group hover:shadow-2xl hover:border-gold/40 transition-all">
            <div className="w-full h-44 bg-stone-50 rounded-[2.5rem] flex items-center justify-center text-7xl border border-stone-100 overflow-hidden relative group-hover:bg-white transition-colors">
              {(localPreviews[`partners:${p.id}`] || p.logo).length < 20 ? p.logo : <img src={localPreviews[`partners:${p.id}`] || p.logo} className="w-full h-full object-contain p-8" alt="" />}
              {uploadingField === `partners:${p.id}` && (
                <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            <div className="space-y-6 flex-grow flex flex-col">
              <InputWrapper label="Partner Name">
                 <input className="w-full bg-stone-50 border border-stone-100 rounded-xl px-5 py-5 text-[11px] font-black uppercase tracking-[0.3em] text-center focus:bg-white focus:border-gold outline-none transition-all" value={p.name} placeholder="Name" onChange={(e) => updateListItem('partners', p.id, { name: e.target.value })} />
              </InputWrapper>
              
              <div className="flex-grow">
                <FileUploader 
                  label="Update Logo" 
                  sizeGuidance="PNG Transparent" 
                  isUploading={uploadingField === `partners:${p.id}`} 
                  onUpload={(file) => handleImageUpload(`partners:${p.id}`, file, 'partner-logo.png')} 
                />
              </div>

              <button onClick={() => removeItem('partners', p.id)} className="w-full text-red-400 text-[10px] font-black uppercase tracking-widest py-4 hover:bg-red-50 rounded-2xl transition-all border border-transparent hover:border-red-100">
                ❌ Remove Partner
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPartners;
