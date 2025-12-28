
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
  const [cmsData, setCmsData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<'home' | 'workshop-detail' | 'recorded-detail' | 'consultancy-detail'>('home');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getCMSData();
      setCmsData(data);
      setLoading(false);
    };
    loadData();
  }, [currentPage]);

  const workshopsData = useMemo(() => {
    if (!cmsData) return { active: [], historical: [] };
    const now = new Date();
    const list = cmsData.workshops || [];
    const processed = [...list].map(ws => {
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
  }, [cmsData]);

  const selectedWorkshop = useMemo(() => {
    if (!cmsData) return null;
    if (currentPage === 'workshop-detail' && !selectedWorkshopId && workshopsData.active.length > 0) {
      return workshopsData.active[0];
    }
    
    if (!selectedWorkshopId) return null;
    const allWorkshops = [...workshopsData.active, ...workshopsData.historical];
    return allWorkshops.find(w => String(w.id) === String(selectedWorkshopId)) || null;
  }, [workshopsData, selectedWorkshopId, currentPage, cmsData]);

  const categorizedReviews = useMemo(() => {
    const reviews = cmsData?.reviews || [];
    return {
      all: reviews,
      workshop: reviews.filter(r => r.category === 'Live Workshop'),
      recorded: reviews.filter(r => r.category === 'Kelas Rekaman'),
      consultancy: reviews.filter(r => r.category === 'Private Consultancy')
    };
  }, [cmsData]);

  if (loading || !cmsData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Menghubungkan ke Database Chef...</p>
      </div>
    );
  }

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
                <div className="relative aspect-[3/4] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-xl border-4 border-white bg-slate-50">
                  <img src={cmsData.chefProfileImage} alt={cmsData.chefName} className="w-full h-full object-cover object-top" />
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
                  <h3 className="text-xl md:text-2xl font-serif text-slate-900 mb-4">Sesi Baru Segera Hadir</h3>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button onClick={commonNavProps.onRecordedClick} className="px-6 py-3.5 bg-gold text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-slate-900 transition-all shadow-md">Kelas Rekaman</button>
                    <button onClick={commonNavProps.onConsultancyClick} className="px-6 py-3.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-gold transition-all shadow-md">Private Konsultasi</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
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
