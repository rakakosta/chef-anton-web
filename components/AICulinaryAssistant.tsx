
import React, { useState } from 'react';
import { getCulinaryAdvice } from '../services/geminiService';

const AICulinaryAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setResponse(null);
    try {
      const result = await getCulinaryAdvice(query);
      setResponse(result);
    } catch (err) {
      setResponse("Maaf, terjadi masalah teknis saat menghubungi Chef Anton. Silakan hubungi admin.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
      {/* Visual background element */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-culinary-gold/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-serif mb-4">Konsultasi Virtual Bersama Chef Anton</h2>
        <p className="text-slate-400 mb-8">
          Ajukan pertanyaan teknis seputar COGS, SOP, atau manajemen dapur. Dapatkan perspektif strategis dari 30+ tahun pengalaman industri.
        </p>

        <form onSubmit={handleSubmit} className="mb-10">
          <div className="relative">
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: Bagaimana cara mengatur Organizational Structure dapur hotel yang efisien?"
              className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-culinary-gold transition-all"
              disabled={loading}
            />
            <button 
              type="submit"
              disabled={loading}
              className="absolute right-2 top-2 bottom-2 px-6 bg-culinary-gold hover:bg-white hover:text-slate-900 rounded-xl font-bold transition-all disabled:opacity-50"
            >
              {loading ? 'Menganalisis...' : 'Kirim'}
            </button>
          </div>
        </form>

        {response && (
          <div className="bg-slate-800/50 border border-white/10 rounded-2xl p-6 text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-culinary-gold rounded-full flex items-center justify-center font-bold text-xs">AP</div>
              <span className="text-sm font-bold text-culinary-gold">Expert Advice - Chef Anton Pradipta:</span>
            </div>
            <div className="text-slate-300 leading-relaxed whitespace-pre-wrap italic">
              "{response}"
            </div>
            <div className="mt-6 pt-4 border-t border-white/5 text-center">
              <p className="text-xs text-slate-500 mb-3 uppercase tracking-widest font-bold">Ingin Mentoring Langsung atau In-House Training?</p>
              <a href="#consultancy" className="text-culinary-gold font-bold hover:underline">Jadwalkan Sesi Privat &rarr;</a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AICulinaryAssistant;
