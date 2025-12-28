
import React, { useState, useEffect, useMemo } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Partners from './components/Partners';
import Reviews from './components/Reviews';
import Portfolio from './components/Portfolio';
import ClassCard from './components/ClassCard';
import AICulinaryAssistant from './components/AICulinaryAssistant';
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
        
        <section className="py-32 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="absolute -top-10 -left-10 w-48 h-48 bg-orange-100 rounded-full blur-3xl opacity-40"></div>
                <div className="relative aspect-[4/5] rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white bg-slate-50">
                  <img src={cmsData.chefProfileImage} alt="Chef" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="relative">
                <span className="text-orange-600 font-black uppercase tracking-[0.3em] text-[10px] mb-6 block">Maestro of Operations</span>
                <h2 className="text-5xl md:text-6xl font-serif text-slate-900 mb-10 leading-tight">{cmsData.chefName}</h2>
                <p className="font-serif italic text-slate-900 border-l-4 border-orange-500 pl-8 text-2xl mb-8 leading-relaxed">"{cmsData.chefBioQuote}"</p>
                <p className="text-slate-500 leading-relaxed text-lg">{cmsData.chefBio}</p>
              </div>
            </div>
          </div>
        </section>

        <Partners partners={cmsData.partners} />
        <Portfolio items={cmsData.portfolio} />
        <Reviews customReviews={categorizedReviews.all} />

        <section id="live-workshops" className="py-32 bg-white scroll-mt-20 border-t border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8 text-center md:text-left">
              <div>
                <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Enrollment Ongoing</span>
                <h2 className="text-5xl md:text-6xl font-serif text-slate-900">Live Professional Workshops</h2>
                <p className="mt-4 text-slate-400 italic text-lg">"Belajar langsung dengan simulasi operasional nyata."</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {workshopsData.active.length > 0 ? (
                workshopsData.active.map(item => (
                  <ClassCard key={item.id} item={item} onViewDetail={handleViewWorkshopDetail} />
                ))
              ) : (
                <div className="col-span-full py-20 px-10 bg-stone-50 rounded-[4rem] border-4 border-dashed border-stone-100 flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-4xl shadow-xl mb-8">⏳</div>
                  <h3 className="text-2xl font-serif text-slate-900 mb-4">Belum Ada Sesi Aktif Terdekat</h3>
                  <p className="text-slate-500 max-w-md mb-10">Saat ini Chef Anton sedang memantau operasional di lapangan. Sambil menunggu jadwal baru, Anda dapat mengeksplorasi opsi berikut:</p>
                  
                  <div className="flex flex-col sm:flex-row gap-6">
                    <button onClick={commonNavProps.onRecordedClick} className="px-8 py-4 bg-gold text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-slate-900 transition-all shadow-xl">Beli Kelas Rekaman</button>
                    <button onClick={commonNavProps.onConsultancyClick} className="px-8 py-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl hover:bg-gold transition-all shadow-xl">Private Konsultasi</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        <section id="recorded-classes" className="py-32 bg-slate-950 text-white relative rounded-[5rem] mx-4 mb-32 overflow-hidden shadow-2xl scroll-mt-20">
          <div className="absolute inset-0 opacity-10 dot-pattern-gold pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row items-center justify-between mb-20 gap-10">
              <div>
                <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">Academy Access</span>
                <h2 className="text-4xl md:text-6xl font-serif mb-6">Video Masterclass Academy</h2>
                <p className="text-slate-400 text-lg max-w-xl">Kuasai standar bintang lima secara mandiri.</p>
              </div>
              <button onClick={commonNavProps.onRecordedClick} className="bg-gold text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl">Katalog Lengkap</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {(cmsData.recordedClasses || []).slice(0, 4).map(item => <ClassCard key={item.id} item={item} />)}
            </div>
          </div>
        </section>

        {workshopsData.historical.length > 0 && (
          <section className="py-32 bg-stone-50 border-t border-stone-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-24">
                <span className="text-gold font-black uppercase tracking-[0.4em] text-[10px] mb-4 block">Our Legacy</span>
                <h2 className="text-5xl font-serif text-slate-900">Workshop Sebelumnya</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                {workshopsData.historical.map(pw => (
                  <div key={pw.id} onClick={() => handleViewWorkshopDetail(pw.id)} className="group bg-white rounded-[4rem] border border-stone-100 p-8 flex gap-8 items-center hover:shadow-2xl cursor-pointer transition-all">
                    <div className="w-40 h-40 rounded-[2.5rem] overflow-hidden flex-shrink-0">
                      <img src={pw.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-serif text-slate-900 group-hover:text-gold transition-colors">{pw.title}</h3>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{pw.displayDate || new Date(pw.date || '').toLocaleDateString('id-ID')}</p>
                      <span className="inline-block mt-4 text-[9px] font-black uppercase text-gold px-4 py-2 bg-gold/5 rounded-full border border-gold/10">
                        {pw.realAttendance || 0} Alumni Terdaftar
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <div id="consultancy" className="scroll-mt-20 bg-white pb-32">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
             <AICulinaryAssistant />
          </div>
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-stone-50 rounded-[5rem] p-10 md:p-24 border border-stone-100 flex flex-col lg:flex-row gap-20 items-center">
               <div className="flex-grow">
                 <span className="text-orange-600 font-black uppercase tracking-widest text-[10px] mb-6 block">Professional Strategy</span>
                 <h2 className="text-5xl md:text-6xl font-serif mb-8 leading-tight">Private Executive Consultancy</h2>
                 <p className="text-slate-500 max-w-lg mb-12 text-xl italic">"Transformasi operasional bisnis FnB Anda dengan standar akurasi industri hotel bintang lima global."</p>
                 <button onClick={commonNavProps.onConsultancyClick} className="px-12 py-6 bg-slate-900 text-white font-black uppercase tracking-[0.3em] text-[11px] rounded-2xl hover:bg-gold transition-all shadow-2xl">Inquiry Sekarang</button>
               </div>
               <div className="w-full lg:w-[400px] aspect-square bg-white rounded-[4rem] shadow-2xl p-12 flex flex-col justify-center text-center">
                  <div className="text-7xl mb-8">📈</div>
                  <h4 className="font-serif text-3xl mb-4 text-slate-900">Strategic Audit</h4>
                  <p className="text-xs text-slate-400 uppercase font-black leading-relaxed tracking-widest">Optimalisasi margin berbasis data.</p>
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
