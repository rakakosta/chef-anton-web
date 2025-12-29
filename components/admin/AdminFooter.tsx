
import React from 'react';
import { CMSData } from '../../services/dataService';
import { InputWrapper, SectionHeader } from './Shared';

interface Props {
  data: CMSData;
  updateField: (field: keyof CMSData, value: any) => void;
}

const AdminFooter: React.FC<Props> = ({ data, updateField }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-8 duration-700">
      {[data.footerEducation, data.footerB2B].map((cat, idx) => {
        const targetField = idx === 0 ? 'footerEducation' : 'footerB2B';
        return (
          <div key={idx} className="bg-white p-12 rounded-[4rem] border border-stone-200 space-y-12 shadow-sm transition-all hover:shadow-2xl group">
            <SectionHeader title={cat.title || 'Navigation'} subtitle="Kelola link cepat di bagian bawah website." />
            <div className="space-y-8">
              {cat.links.map(link => (
                <div key={link.id} className="flex flex-col md:flex-row gap-6 p-8 bg-stone-50 rounded-[2.5rem] border border-stone-100 group/link hover:bg-white hover:border-gold/30 transition-all shadow-sm">
                  <div className="flex-grow space-y-3">
                     <InputWrapper label="Display Label">
                       <input className="w-full bg-white border border-stone-200 p-5 rounded-2xl text-[11px] font-black uppercase tracking-widest focus:border-gold outline-none transition-all" value={link.label} onChange={(e) => {
                        const newLinks = (data[targetField] as any).links.map((l: any) => l.id === link.id ? { ...l, label: e.target.value } : l);
                        updateField(targetField, { ...(data[targetField] as any), links: newLinks });
                      }} />
                     </InputWrapper>
                  </div>
                  <div className="md:w-72 space-y-3">
                     <InputWrapper label="Destination URL">
                       <input className="w-full bg-stone-100 p-5 rounded-2xl text-[10px] text-slate-500 font-mono focus:bg-white focus:border-gold outline-none transition-all border border-stone-200" value={link.url} onChange={(e) => {
                        const newLinks = (data[targetField] as any).links.map((l: any) => l.id === link.id ? { ...l, url: e.target.value } : l);
                        updateField(targetField, { ...(data[targetField] as any), links: newLinks });
                      }} />
                     </InputWrapper>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AdminFooter;
