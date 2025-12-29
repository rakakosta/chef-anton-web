
import React from 'react';

export const InputWrapper = ({ label, children, hint }: { label: string, children: React.ReactNode, hint?: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between items-end px-1">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">{label}</label>
      {hint && <span className="text-[8px] text-slate-300 font-bold uppercase">{hint}</span>}
    </div>
    {children}
  </div>
);

export const SectionHeader = ({ title, subtitle, action }: { title: string, subtitle?: string, action?: React.ReactNode }) => (
  <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pb-8 border-b border-stone-100">
    <div>
      <h3 className="text-3xl font-serif font-black text-slate-900 tracking-tight">{title}</h3>
      {subtitle && <p className="text-xs text-slate-400 mt-1 italic font-medium">{subtitle}</p>}
    </div>
    {action && <div className="flex-shrink-0">{action}</div>}
  </div>
);

export const FileUploader = ({ label, sizeGuidance, onUpload, isUploading }: { label: string, sizeGuidance: string, onUpload: (file: File) => void, isUploading?: boolean }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onUpload(file);
    }
  };

  return (
    <div className="space-y-2 w-full">
      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 ml-1 block">{label}</label>
      <div className="flex flex-col gap-3">
        <div className="relative group w-full">
          <input 
            type="file" 
            accept="image/*"
            disabled={isUploading}
            className="w-full text-[10px] text-slate-500 file:mr-4 file:py-2.5 file:px-5 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:uppercase file:bg-stone-100 file:text-slate-900 hover:file:bg-gold hover:file:text-white transition-all cursor-pointer disabled:opacity-50"
            onChange={handleFile}
          />
          {isUploading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-gold border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        <div className="px-3 py-2 bg-stone-50 rounded-xl border border-stone-100 w-fit">
          <p className="text-[8px] text-slate-400 uppercase font-black tracking-widest">Ratio: <span className="text-gold">{sizeGuidance}</span></p>
        </div>
      </div>
    </div>
  );
};
