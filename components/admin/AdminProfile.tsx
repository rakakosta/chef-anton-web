
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

const AdminProfile: React.FC<Props> = ({ data, updateField, uploadingField, handleImageUpload, localPreviews }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="lg:col-span-7 bg-white p-12 rounded-[4rem] border border-stone-200 space-y-10 shadow-sm">
        <SectionHeader title="Professional Profile" subtitle="Profil biografi lengkap Chef Anton." />
        <InputWrapper label="Chef Full Name">
          <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm font-black tracking-[0.2em] focus:bg-white focus:border-gold outline-none transition-all" value={data.chefName} onChange={(e) => updateField('chefName', e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Professional Title (Gelar)">
          <input className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm font-bold focus:bg-white focus:border-gold outline-none transition-all" value={data.chefTitle} onChange={(e) => updateField('chefTitle', e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Signature Bio Quote">
          <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-32 italic font-serif leading-relaxed focus:bg-white focus:border-gold outline-none transition-all" value={data.chefBioQuote} onChange={(e) => updateField('chefBioQuote', e.target.value)} />
        </InputWrapper>
        <InputWrapper label="Detailed Biography (Legacy)">
          <textarea className="w-full bg-stone-50 border border-stone-100 rounded-2xl px-6 py-5 text-sm h-96 leading-relaxed font-medium focus:bg-white focus:border-gold outline-none transition-all" value={data.chefBio} onChange={(e) => updateField('chefBio', e.target.value)} />
        </InputWrapper>
      </div>
      <div className="lg:col-span-5 bg-white p-12 rounded-[4rem] border border-stone-200 flex flex-col items-center shadow-sm h-fit sticky top-40">
        <SectionHeader title="Official Portrait" />
        <div className="aspect-[3/4] w-80 rounded-[3.5rem] overflow-hidden shadow-2xl mb-12 bg-stone-100 border-8 border-white hover:rotate-2 transition-transform duration-500">
          <img src={localPreviews['chefProfileImage'] || data.chefProfileImage} className="w-full h-full object-cover object-top" alt="Chef Profile" />
        </div>
        <FileUploader label="Upload Bio Photo" sizeGuidance="Portrait 3:4" isUploading={uploadingField === 'chefProfileImage'} onUpload={(file) => handleImageUpload('chefProfileImage', file, 'chef-portrait.jpg')} />
      </div>
    </div>
  );
};

export default AdminProfile;
