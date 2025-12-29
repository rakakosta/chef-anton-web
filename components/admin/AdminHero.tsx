
import React from 'react';
import { CMSData } from '../../services/dataService';
import { InputWrapper, SectionHeader, FileUploader } from './Shared';

interface Props {
  data: CMSData;
  updateField: (field: keyof CMSData, value: any) => void;
  uploadingField: string | null;
  handleImageUpload: (field: string, file: File, filename: string) => void;
  localPreviews: Record<string, string>;
}

const AdminHero: React.FC<Props> = ({ data, updateField, uploadingField, handleImageUpload, localPreviews }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="lg:col-span-7 bg-white p-12 rounded-[4rem] border border-stone-200 space-y-10 shadow-sm">
        <SectionHeader title="Hero Branding" subtitle="Konfigurasi visual dan teks utama pada landing page." />
        
        <InputWrapper label="Landing Title (Headline Utama)">
          <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-2xl font-serif font-black focus:bg-white focus:ring-8 focus:ring-gold/5 focus:border-gold outline-none transition-all" value={data.heroTitle} onChange={(e) => updateField('heroTitle', e.target.value)} />
        </InputWrapper>
        
        <InputWrapper label="Landing Subtitle (Penjelasan Singkat)">
          <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-44 leading-relaxed font-medium focus:bg-white focus:ring-8 focus:ring-gold/5 focus:border-gold outline-none transition-all" value={data.heroSubtitle} onChange={(e) => updateField('heroSubtitle', e.target.value)} />
        </InputWrapper>
        
        <div className="pt-10 border-t border-stone-100 space-y-10">
          <h3 className="text-[10px] font-black uppercase tracking-[0.5em] text-gold flex items-center gap-4">
            <span className="w-10 h-0.5 bg-gold/30"></span> Feature Navigation Cards
          </h3>
          
          {[
            { title: 'heroCTA_Workshop_Title', desc: 'heroCTA_Workshop_Desc', icon: '🎥', label: 'Workshop Session', color: 'bg-red-50', text: 'text-red-600' },
            { title: 'heroCTA_Recorded_Title', desc: 'heroCTA_Recorded_Desc', icon: '📀', label: 'Academy Series', color: 'bg-gold/10', text: 'text-gold' },
            { title: 'heroCTA_Consultancy_Title', desc: 'heroCTA_Consultancy_Desc', icon: '🛡️', label: 'B2B Consultancy', color: 'bg-slate-100', text: 'text-slate-900' }
          ].map((card, idx) => (
            <div key={idx} className="bg-stone-50/50 p-10 rounded-[3rem] border border-stone-100 space-y-6 transition-all hover:bg-white hover:shadow-xl group">
              <div className="flex items-center gap-5">
                 <div className={`w-14 h-14 ${card.color} ${card.text} rounded-2xl flex items-center justify-center text-2xl shadow-sm group-hover:scale-110 transition-transform`}>{card.icon}</div>
                 <span className="text-[12px] font-black uppercase tracking-[0.3em] text-slate-900">{card.label}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputWrapper label="Card Title">
                  <input className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 text-xs font-bold focus:border-gold outline-none transition-all" value={(data as any)?.[card.title]} onChange={(e) => updateField(card.title as any, e.target.value)} />
                </InputWrapper>
                <InputWrapper label="Card Description">
                  <input className="w-full bg-white border border-stone-200 rounded-xl px-5 py-4 text-xs font-medium focus:border-gold outline-none transition-all" value={(data as any)?.[card.desc]} onChange={(e) => updateField(card.desc as any, e.target.value)} />
                </InputWrapper>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="lg:col-span-5 bg-white p-12 rounded-[4rem] border border-stone-200 flex flex-col items-center shadow-sm h-fit sticky top-40">
        <SectionHeader title="Visual Assets" />
        <div className="relative group mb-12">
          <div className="absolute -inset-6 bg-gold/10 rounded-[4rem] blur-3xl group-hover:bg-gold/20 transition-all"></div>
          <div className="relative aspect-[3/4] w-80 rounded-[3.5rem] overflow-hidden shadow-2xl bg-stone-100 border-8 border-white group-hover:scale-[1.03] transition-transform duration-700">
            <img src={localPreviews['heroImage'] || data.heroImage} className="w-full h-full object-cover object-top" alt="Hero" />
          </div>
        </div>
        <FileUploader label="Upload Hero Portrait" sizeGuidance="Portrait 3:4" isUploading={uploadingField === 'heroImage'} onUpload={(file) => handleImageUpload('heroImage', file, 'hero-image.jpg')} />
      </div>
    </div>
  );
};

export default AdminHero;
