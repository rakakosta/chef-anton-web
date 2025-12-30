
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
import { getCMSData, CMSData, DEFAULT_DATA } from './services/dataService';

const App: React.FC = () => {
  const [cmsData, setCmsData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'workshop-detail' | 'recorded-detail' | 'consultancy-detail'>('home');
  const [selectedWorkshopId, setSelectedWorkshopId] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getCMSData();
        setCmsData(data);
      } catch (err) {
        setError("Failed to connect to database. Using offline data.");
        setCmsData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
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

  if (loading && !cmsData) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-gold border-t-transparent rounded-full animate-spin mb-6"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 italic">Chef Anton is preparing the kitchen...</p>
      </div>
    );
  }

  const finalCmsData = cmsData || DEFAULT_DATA;

  const handleViewWorkshopDetail = (id: string | null) => {
    setSelectedWorkshopId(id);
    setCurrentPage('workshop-detail');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const goToHome = () => {
    setCurrentPage('home');
    setSelectedWorkshopId(null);
  };

  const commonNavProps = {
    onHomeClick: goToHome,
    onWorkshopClick: () => {
      const active = workshopsData.active;
      handleViewWorkshopDetail(active.length > 0 ? active[0].id : null);
    },
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
          recordedClasses={finalCmsData.recordedClasses} 
        />
      );
    }

    if (currentPage === 'consultancy-detail') {
      return <ConsultancyDetail onBack={goToHome} reviews={categorizedReviews.consultancy} partners={finalCmsData.partners} />;
    }

    return (
      <div id="home">
        <Hero 
          cmsData={finalCmsData}
          onWorkshopClick={commonNavProps.onWorkshopClick} 
          onRecordedClick={commonNavProps.onRecordedClick}
          onConsultancyClick={commonNavProps.onConsultancyClick}
        />
        
        {/* Chef Bio Section */}
        <section className="py-20 md:py-32 bg-white overflow-hidden border-b border-stone-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gold/5 rounded-[4rem] blur-2xl group-hover:bg-gold/10 transition-colors"></div>
                <div className="relative aspect-[3/4] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white">
                  <img src={finalCmsData.chefProfileImage} alt={finalCmsData.chefName} className="w-full h-full object-cover object-top" />
                </div>
              </div>
              <div>
                <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">The Legacy of Excellence</span>
                <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight">{finalCmsData.chefName}</h2>
                <p className="font-serif italic text-slate-900 border-l-4 border-gold pl-6 text-xl md:text-2xl mb-8 leading-relaxed">"{finalCmsData.chefBioQuote}"</p>
                <p className="text-slate-500 leading-relaxed text-sm md:text-lg mb-10">{finalCmsData.chefBio}</p>
              </div>
            </div>
          </div>
        </section>

        <Partners partners={finalCmsData.partners} />

        {/* 1. Live Workshop Section */}
        <section id="live-workshops" className="py-20 md:py-32 bg-white scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center md:text-left mb-16">
              <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">In-Person Experience</span>
              <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-6">Live Workshops</h2>
              <p className="text-slate-400 max-w-2xl italic">"Belajar langsung teknik dan strategi operasional dalam sesi intensif tatap muka."</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12">
              {workshopsData.active.length > 0 ? (
                workshopsData.active.map(item => <ClassCard key={item.id} item={item} onViewDetail={handleViewWorkshopDetail} />)
              ) : (
                <div className="col-span-full py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200 text-center">
                  <p className="text-slate-400 font-serif italic mb-6">Batch baru sedang dalam perencanaan strategis.</p>
                  <button onClick={commonNavProps.onRecordedClick} className="px-8 py-4 bg-gold text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Lihat Kelas Rekaman</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. Portfolio Section */}
        <Portfolio items={finalCmsData.portfolio} />

        {/* 3. Academy Section */}
        <section id="recorded-classes" className="py-20 md:py-32 bg-stone-50/50 scroll-mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
              <div>
                <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">On-Demand Mastery</span>
                <h2 className="text-4xl md:text-6xl font-serif text-slate-900">Academy Masterclasses</h2>
              </div>
              <button onClick={commonNavProps.onRecordedClick} className="px-10 py-5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gold transition-all shadow-xl">Semua Masterclass</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {(finalCmsData.recordedClasses || []).length > 0 ? (
                (finalCmsData.recordedClasses || []).slice(0, 3).map(item => <ClassCard key={item.id} item={item} />)
              ) : (
                <div className="col-span-full">
                  <div className="bg-white rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-lg border border-stone-100 opacity-60 flex flex-col">
                    <div className="aspect-[4/3] bg-stone-200 flex flex-col items-center justify-center p-10 text-center">
                      <p className="text-3xl md:text-4xl font-serif font-black text-slate-400 mb-2">COMING SOON</p>
                      <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] text-slate-400">Materi eksklusif sedang dalam proses produksi.</p>
                    </div>
                    <div className="p-8 md:p-10 space-y-4">
                      <div className="h-4 bg-stone-100 rounded-full w-3/4"></div>
                      <div className="h-4 bg-stone-100 rounded-full w-1/2"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 4. Private Consultancy Section */}
        <section id="consultancy" className="py-20 md:py-40 bg-slate-950 text-white relative overflow-hidden scroll-mt-20">
          <div className="absolute inset-0 opacity-10 dot-pattern-gold"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-8 block">B2B Elite Advisory</span>
              <h2 className="text-5xl md:text-7xl font-serif mb-10 leading-tight">Private Audit & Executive Consultancy</h2>
              <p className="text-slate-400 text-xl mb-12 italic leading-relaxed font-serif">"Optimalkan profitabilitas dapur Anda dengan sistem manajemen standar internasional."</p>
              <button onClick={commonNavProps.onConsultancyClick} className="px-12 py-6 bg-gold text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-slate-950 transition-all gold-glow">Request Business Audit</button>
            </div>
          </div>
        </section>

        {/* 5. Testimonials Section */}
        <Reviews customReviews={categorizedReviews.all} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white selection:bg-gold/30">
      <Navbar {...commonNavProps} />
      {renderContent()}
      <Footer data={finalCmsData} />
    </div>
  );
};

export default App;
