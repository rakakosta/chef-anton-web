
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Partners from './components/Partners';
import Reviews from './components/Reviews';
import Portfolio from './components/Portfolio';
import ClassCard from './components/ClassCard';
import Footer from './components/Footer';
import LiveWorkshopDetail from './pages/LiveWorkshopDetail';
import RecordedClassDetail from './pages/RecordedClassDetail';
import ConsultancyDetail from './pages/ConsultancyDetail';
import { getCMSData, CMSData } from './services/dataService';

const App: React.FC = () => {
  const [cmsData, setCmsData] = useState<CMSData>(getCMSData());
  const [currentPage, setCurrentPage] = useState<'home' | 'workshop-detail' | 'recorded-detail' | 'consultancy-detail'>('home');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

  // Sync state with CMS updates and page changes
  useEffect(() => {
    const data = getCMSData();
    setCmsData(data);
  }, [currentPage]);

  // Process workshops to separate active from historical based on date
  const workshopsData = useMemo(() => {
    const now = new Date();
    const list = cmsData.workshops || [];
    const processed = [...list].map(ws => {
      // Auto-move to historical if date passed, unless explicitly set
      if (ws.date && !ws.isHistorical) {
        const wsDate = new Date(ws.date);
        if (wsDate < now) return { ...ws, isHistorical: true };
      }
      return ws;
    });

    return {
      active: processed.filter(ws => !ws.isHistorical),
      historical: processed.filter(ws => ws.isHistorical)
    };
  }, [cmsData.workshops]);

  // Combined search for detail view - search in both active and historical
  const selectedWorkshop = useMemo(() => {
    if (currentPage === 'workshop-detail' && !selectedWorkshopId && workshopsData.active.length > 0) {
      return workshopsData.active[0];
    }
    
    if (!selectedWorkshopId) return null;
    const allWorkshops = [...workshopsData.active, ...workshopsData.historical];
    return allWorkshops.find(w => String(w.id) === String(selectedWorkshopId)) || null;
  }, [workshopsData, selectedWorkshopId, currentPage]);

  const categorizedReviews = useMemo(() => {
    const reviews = cmsData.reviews || [];
    return {
      all: reviews,
      workshop: reviews.filter(r => r.category === 'Live Workshop'),
      recorded: reviews.filter(r => r.category === 'Kelas Rekaman'),
      consultancy: reviews.filter(r => r.category === 'Private Consultancy')
    };
  }, [cmsData.reviews]);

  const handleViewWorkshopDetail = (id: string | null) => {
    setSelectedWorkshopId(id);
    setCurrentPage('workshop-detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goToHome = () => {
    setCurrentPage('home');
    setSelectedWorkshopId(null);
  };

  const handleNavWorkshopClick = () => {
    const active = workshopsData.active;
    if (active.length > 0) {
      handleViewWorkshopDetail(active[0].id);
    } else {
      handleViewWorkshopDetail(null);
    }
  };

  const commonNavProps = {
    onHomeClick: goToHome,
    onWorkshopClick: handleNavWorkshopClick,
    onRecordedClick: () => {
      setCurrentPage('recorded-detail');
      window.scrollTo({ top: 0, behavior: 'instant' });
    },
    onConsultancyClick: () => {
      setCurrentPage('consultancy-detail');
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  };

  const renderContent = () => {
    if (currentPage === 'workshop-detail') {
      return (
        <LiveWorkshopDetail 
          workshop={selectedWorkshop} 
          historicalWorkshops={workshopsData.historical}
          reviews={categorizedReviews.workshop}
          onBack={goToHome}
          onRecordedClick={commonNavProps.onRecordedClick}
          onConsultancyClick={commonNavProps.onConsultancyClick}
          onViewWorkshop={handleViewWorkshopDetail}
        />
      );
    }

    if (currentPage === 'recorded-detail') {
      return (
        <RecordedClassDetail 
          onBack={goToHome} 
          reviews={categorizedReviews.recorded} 
        />
      );
    }

    if (currentPage === 'consultancy-detail') {
      return (
        <ConsultancyDetail 
          onBack={goToHome} 
          reviews={categorizedReviews.consultancy} 
          partners={cmsData.partners}
        />
      );
    }

    return (
      <div id="home" className="scroll-mt-20">
        <Hero 
          cmsData={cmsData}
          onWorkshopClick={handleNavWorkshopClick} 
          onRecordedClick={commonNavProps.onRecordedClick}
          onConsultancyClick={commonNavProps.onConsultancyClick}
        />
        
        <section className="py-16 md:py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-20 items-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-32 md:w-48 h-32 md:h-48 bg-orange-100 rounded-full blur-3xl opacity-40"></div>
                <div className="relative aspect-[4/5] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-xl border-4 border-white bg-slate-50">
                  <img src={cmsData.chefProfileImage} alt="Chef" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="relative">
                <span className="text-orange-600 font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-4 md:mb-6 block">Maestro of Operations</span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-slate-900 mb-6 md:mb-10 leading-tight">{cmsData.chefName}</h2>
                <p className="font-serif italic text-slate-900 border-l-4 border-orange-500 pl-6 md:pl-8 text-lg md:text-2xl mb-6 md:mb-8 leading-relaxed">"{cmsData.chefBioQuote}"</p>
                <p className="text-slate-500 leading-relaxed text-sm md:text-lg">{cmsData.chefBio}</p>
              </div>
            </div>
          </div>
        </section>

        <Partners partners={cmsData.partners} />
        <Portfolio items={cmsData.portfolio} />
        <Reviews customReviews={categorizedReviews.all} />

        <section id="live-workshops" className="py-16 md:py-32 bg-white scroll-mt-20 border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-4 md:gap-8 text-center md:text-left">
              <div>
                <span className="text-gold font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-2 md:mb-4 block">Enrollment Ongoing</span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif text-slate-900">Live Workshops</h2>
                <p className="mt-2 text-slate-400 italic text-sm md:text-lg">"Belajar langsung dengan simulasi operasional nyata."</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {workshopsData.active.length > 0 ? (
                workshopsData.active.map(item => (
                  <ClassCard key={item.id} item={item} onViewDetail={handleViewWorkshopDetail} />
                ))
              ) : (
                <div className="col-span-full py-16 px-6 bg-stone-50 rounded-[2rem] md:rounded-[4rem] border-2 md:border-4 border-dashed border-stone-100 flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-3xl shadow-lg mb-6">⏳</div>
                  <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-4">Belum Ada Sesi Aktif</h3>
                  <p className="text-slate-500 text-sm max-w-md mb-8">Saat ini Chef sedang memantau operasional. Sambil menunggu jadwal baru, silakan eksplorasi opsi berikut:</p>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={commonNavProps.onRecordedClick} className="px-6 py-3.5 bg-gold text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all shadow-md">Kelas Rekaman</button>
                    <button onClick={commonNavProps.onConsultancyClick} className="px-6 py-3.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all shadow-md">Private Konsultasi</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="recorded-classes" className="py-16 md:py-32 bg-slate-950 text-white relative rounded-[2rem] md:rounded-[5rem] mx-2 md:mx-4 mb-20 md:mb-32 overflow-hidden shadow-2xl scroll-mt-20">
          <div className="absolute inset-0 opacity-10 dot-pattern-gold pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12 md:mb-20 gap-6 md:gap-10">
              <div className="text-center md:text-left">
                <span className="text-gold font-black uppercase tracking-[0.3em] text-[8px] md:text-[10px] mb-2 md:mb-4 block">Academy Access</span>
                <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-4">Masterclass Academy</h2>
                <p className="text-slate-400 text-sm md:text-lg max-w-xl">Kuasai standar bintang lima secara mandiri.</p>
              </div>
              <button onClick={commonNavProps.onRecordedClick} className="bg-gold text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-xl">Katalog Lengkap</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
              {(cmsData.recordedClasses || []).slice(0, 4).map(item => <ClassCard key={item.id} item={item} />)}
            </div>
          </div>
        </section>

        {workshopsData.historical.length > 0 && (
          <section className="py-16 md:py-32 bg-stone-50 border-t border-stone-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16 md:mb-24">
                <span className="text-gold font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] mb-2 md:mb-4 block">Our Legacy</span>
                <h2 className="text-3xl md:text-5xl font-serif text-slate-900">Workshop Sebelumnya</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10">
                {workshopsData.historical.map(pw => (
                  <div key={pw.id} onClick={() => handleViewWorkshopDetail(pw.id)} className="group bg-white rounded-[2rem] md:rounded-[4rem] border border-stone-100 p-5 md:p-8 flex gap-5 md:gap-8 items-center hover:shadow-xl cursor-pointer transition-all">
                    <div className="w-24 md:w-40 h-24 md:h-40 rounded-2xl md:rounded-[2.5rem] overflow-hidden flex-shrink-0">
                      <img src={pw.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-2xl font-serif text-slate-900 group-hover:text-gold transition-colors">{pw.title}</h3>
                      <p className="text-[8px] md:text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1 md:mt-2">{pw.displayDate || new Date(pw.date || '').toLocaleDateString('id-ID')}</p>
                      <span className="inline-block mt-2 md:mt-4 text-[7px] md:text-[9px] font-black uppercase text-gold px-3 py-1.5 md:px-4 md:py-2 bg-gold/5 rounded-full border border-gold/10">
                        {pw.realAttendance || 0} Alumni
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div id="consultancy" className="scroll-mt-20 bg-white pb-16 md:pb-32">
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-stone-50 rounded-[2.5rem] md:rounded-[5rem] p-8 md:p-24 border border-stone-100 flex flex-col lg:flex-row gap-12 md:gap-20 items-center">
               <div className="flex-grow text-center lg:text-left">
                 <span className="text-orange-600 font-black uppercase tracking-widest text-[8px] md:text-[10px] mb-4 md:mb-6 block">Professional Strategy</span>
                 <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif mb-6 md:mb-8 leading-tight">Executive Consultancy</h2>
                 <p className="text-slate-500 max-w-lg mx-auto lg:mx-0 mb-8 md:mb-12 text-base md:text-xl italic leading-relaxed">"Transformasi operasional bisnis FnB Anda dengan standar akurasi industri global."</p>
                 <button onClick={commonNavProps.onConsultancyClick} className="px-10 py-5 md:px-12 md:py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[9px] md:text-[11px] rounded-2xl hover:bg-gold transition-all shadow-xl">Inquiry Sekarang</button>
               </div>
               <div className="w-full lg:w-[400px] aspect-square bg-white rounded-[2rem] md:rounded-[4rem] shadow-xl p-8 md:p-12 flex flex-col justify-center text-center">
                  <div className="text-5xl md:text-7xl mb-6 md:mb-8">📈</div>
                  <h4 className="font-serif text-2xl md:text-3xl mb-3 md:mb-4 text-slate-900">Strategic Audit</h4>
                  <p className="text-[8px] text-slate-400 uppercase font-black leading-relaxed tracking-widest">Optimalisasi margin berbasis data.</p>
               </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white selection:bg-gold/30">
      <Navbar {...commonNavProps} />
      {renderContent()}
      <Footer data={cmsData} />
    </div>
  );
};

export default App;
