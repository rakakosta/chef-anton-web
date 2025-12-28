
import React from 'react';
import { CMSData } from '../services/dataService';

interface Props {
  data: CMSData;
}

const Footer: React.FC<Props> = ({ data }) => {
  return (
    <footer className="bg-stone-50 border-t border-stone-100 py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-20 mb-20">
          <div className="col-span-1 md:col-span-2">
            <span className="text-3xl font-black tracking-tighter text-slate-900 font-serif mb-8 block uppercase">
              CHEF<span className="text-gold ml-1">{data.chefName.split(' ').slice(1).join(' ').toUpperCase()}</span>
            </span>
            <p className="text-slate-500 max-w-sm mb-6 leading-relaxed text-sm italic font-serif">
              "{data.chefBioQuote}"
            </p>
            <p className="text-slate-400 max-w-md mb-10 text-xs leading-relaxed font-medium uppercase tracking-wider">
              {data.chefTitle}
            </p>
            <div className="flex gap-6">
              {['Instagram', 'LinkedIn', 'YouTube'].map(platform => (
                <a key={platform} href="#" className="w-12 h-12 rounded-2xl bg-white border border-stone-100 flex items-center justify-center text-slate-400 hover:text-gold hover:border-gold transition-all shadow-sm">
                  <span className="sr-only">{platform}</span>
                  <div className="w-5 h-5 bg-current rounded-sm"></div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px]">{data.footerEducation.title}</h4>
            <ul className="space-y-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              {data.footerEducation.links.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="hover:text-gold transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-black text-slate-900 mb-8 uppercase tracking-[0.2em] text-[10px]">{data.footerB2B.title}</h4>
            <ul className="space-y-4 text-[11px] font-bold text-slate-500 uppercase tracking-widest">
              {data.footerB2B.links.map(link => (
                <li key={link.id}>
                  <a href={link.url} className="hover:text-gold transition-colors">{link.label}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-stone-200 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-slate-400 text-[9px] font-bold uppercase tracking-[0.2em]">
            &copy; {new Date().getFullYear()} {data.chefName}. The Gold Standard in Culinary Mentorship & Operations.
          </p>
          <div className="flex gap-10 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400">
            <a href="#" className="hover:text-gold transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-gold transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
