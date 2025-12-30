import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, useNavigate, useLocation, useParams } from 'react-router-dom';
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
import AdminCMS from './components/AdminCMS';
import { getCMSData, CMSData, DEFAULT_DATA } from './services/dataService';

// --- Components ---

const TopLineProgressBar = () => {
  const location = useLocation();
  const [width, setWidth] = useState(0);
  const [visible, setVisible] = useState(false);
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Start progress animation on route change
    setOpacity(1);
    setVisible(true);
    setWidth(0);
    
    // Smoothly animate to 100%
    const timerStart = setTimeout(() => {
      setWidth(100);
    }, 50);
    
    // Fade out and reset after animation completes (800ms - 1s)
    const timerEnd = setTimeout(() => {
      setOpacity(0);
      const timerHide = setTimeout(() => {
        setVisible(false);
        setWidth(0);
      }, 400);
      return () => clearTimeout(timerHide);
    }, 900);

    return () => {
      clearTimeout(timerStart);
      clearTimeout(timerEnd);
    };
  }, [location.pathname]);

  if (!visible) return null;

  return (
    <div 
      className="fixed top-0 left-0 h-[3px] bg-gold z-[10000] progress-bar-transition pointer-events-none"
      style={{ 
        width: `${width}%`,
        opacity: opacity,
        boxShadow: '0 0 10px rgba(212, 175, 55, 0.6)'
      }}
    />
  );
};

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
};

// --- Page Views ---

const HomeView = ({ data }: { data: CMSData }) => {
  const navigate = useNavigate();
  
  // SEO Native Dynamic Title
  useEffect(() => {
    document.title = "Chef Anton Pradipta | Culinary Business Consultant & Academy";
  }, []);

  const workshopsData = useMemo(() => {
    const now = new Date();
    const list = data.workshops || [];
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
  }, [data.workshops]);

  const categorizedReviews = useMemo(() => {
    const reviews = data.reviews || [];
    return {
      all: reviews,
      workshop: reviews.filter(r => r.category === 'Live Workshop'),
      recorded: reviews.filter(r => r.category === 'Kelas Rekaman'),
      consultancy: reviews.filter(r => r.category === 'Private Consultancy')
    };
  }, [data.reviews]);

  return (
    <div id="home">
      <Hero 
        cmsData={data}
        onWorkshopClick={() => {
          if (workshopsData.active.length > 0) navigate(`/workshop/${workshopsData.active[0].id}`);
          else document.getElementById('live-workshops')?.scrollIntoView({ behavior: 'smooth' });
        }} 
        onRecordedClick={() => navigate('/academy')}
        onConsultancyClick={() => navigate('/consultancy')}
      />
      
      {/* Chef Bio Section */}
      <section className="py-20 md:py-32 bg-white overflow-hidden border-b border-stone-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center">
            <div className="relative group">
              <div className="absolute -inset-4 bg-gold/5 rounded-[4rem] blur-2xl group-hover:bg-gold/10 transition-colors"></div>
              <div className="relative aspect-[3/4] rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-4 border-white">
                <img src={data.chefProfileImage} alt={data.chefName} className="w-full h-full object-cover object-top" />
              </div>
            </div>
            <div>
              <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">The Legacy of Excellence</span>
              <h2 className="text-4xl md:text-6xl font-serif text-slate-900 mb-8 leading-tight">{data.chefName}</h2>
              <p className="font-serif italic text-slate-900 border-l-4 border-gold pl-6 text-xl md:text-2xl mb-8 leading-relaxed">"{data.chefBioQuote}"</p>
              <p className="text-slate-500 leading-relaxed text-sm md:text-lg mb-10">{data.chefBio}</p>
            </div>
          </div>
        </div>
      </section>

      <Partners partners={data.partners} />

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
              workshopsData.active.map(item => (
                <ClassCard 
                  key={item.id} 
                  item={item} 
                  onViewDetail={(id) => navigate(`/workshop/${id}`)} 
                />
              ))
            ) : (
              <div className="col-span-full py-20 bg-stone-50 rounded-[3rem] border-2 border-dashed border-stone-200 text-center">
                <p className="text-slate-400 font-serif italic mb-6">Batch baru sedang dalam perencanaan strategis.</p>
                <button onClick={() => navigate('/academy')} className="px-8 py-4 bg-gold text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">Lihat Kelas Rekaman</button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 2. Portfolio Section */}
      <Portfolio items={data.portfolio} />

      {/* 3. Academy Section */}
      <section id="recorded-classes" className="py-20 md:py-32 bg-stone-50/50 scroll-mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <span className="text-gold font-black uppercase tracking-[0.3em] text-[10px] mb-4 block">On-Demand Mastery</span>
              <h2 className="text-4xl md:text-6xl font-serif text-slate-900">Academy Masterclasses</h2>
            </div>
            <button onClick={() => navigate('/academy')} className="px-10 py-5 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-full hover:bg-gold transition-all shadow-xl">Semua Masterclass</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {(data.recordedClasses || []).length > 0 ? (
              (data.recordedClasses || []).slice(0, 3).map(item => (
                <div key={item.id} onClick={() => navigate(`/recorded-class/${item.id}`)} className="cursor-pointer">
                  <ClassCard item={item} />
                </div>
              ))
            ) : (
              <div className="bg-slate-50 aspect-[3/4] rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-8 text-center transition-all group hover:border-gold/30">
                <span className="text-4xl mb-4 grayscale group-hover:grayscale-0 transition-all">🔒</span>
                <p className="text-lg md:text-xl font-serif font-black text-slate-400 mb-2 uppercase tracking-tighter">COMING SOON</p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 leading-relaxed max-w-[200px] mx-auto">Materi eksklusif sedang dalam proses produksi.</p>
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
            <button onClick={() => navigate('/consultancy')} className="px-12 py-6 bg-gold text-white text-[11px] font-black uppercase tracking-widest rounded-2xl hover:bg-white hover:text-slate-950 transition-all gold-glow">Request Business Audit</button>
          </div>
        </div>
      </section>

      {/* 5. Testimonials Section */}
      <Reviews customReviews={categorizedReviews.all} />
    </div>
  );
};

const WorkshopDetailView = ({ data }: { data: CMSData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const workshop = useMemo(() => {
    return data.workshops.find(w => String(w.id) === String(id)) || null;
  }, [data.workshops, id]);

  // SEO Native Dynamic Title
  useEffect(() => {
    if (workshop) {
      document.title = `${workshop.title} | Chef Anton Pradipta Workshop`;
    }
  }, [workshop]);

  const historical = useMemo(() => {
    return data.workshops.filter(w => w.isHistorical);
  }, [data.workshops]);

  const reviews = useMemo(() => {
    return data.reviews.filter(r => r.category === 'Live Workshop');
  }, [data.reviews]);

  if (!workshop) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-4xl font-serif mb-6">Sesi Tidak Ditemukan</h2>
        <button onClick={() => navigate('/')} className="px-8 py-4 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Kembali Ke Beranda</button>
      </div>
    );
  }

  return (
    <LiveWorkshopDetail 
      workshop={workshop} 
      historicalWorkshops={historical}
      reviews={reviews}
      onBack={() => navigate('/')}
      onViewWorkshop={(wsId) => navigate(`/workshop/${wsId}`)}
    />
  );
};

const AcademyDetailView = ({ data }: { data: CMSData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // SEO Native Dynamic Title
  useEffect(() => {
    document.title = "Culinary Academy Masterclasses | Chef Anton Pradipta";
  }, []);

  const reviews = useMemo(() => data.reviews.filter(r => r.category === 'Kelas Rekaman'), [data.reviews]);
  
  return (
    <RecordedClassDetail 
      onBack={() => navigate('/')} 
      reviews={reviews} 
      recordedClasses={data.recordedClasses} 
    />
  );
};

const ConsultancyDetailView = ({ data }: { data: CMSData }) => {
  const navigate = useNavigate();

  // SEO Native Dynamic Title
  useEffect(() => {
    document.title = "Private B2B Consultancy | Chef Anton Pradipta";
  }, []);

  return (
    <ConsultancyDetail 
      onBack={() => navigate('/')} 
      reviews={data.reviews.filter(r => r.category === 'Private Consultancy')} 
      partners={data.partners} 
    />
  );
}

// --- App Root ---

const AppContent = () => {
  const [data, setData] = useState<CMSData | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      try {
        const d = await getCMSData();
        setData(d);
      } catch (err) {
        setData(DEFAULT_DATA);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  if (location.pathname === '/portal-chef') {
    return <AdminCMS onExit={() => navigate('/')} />;
  }

  // Initial Data Loading
  if (loading && !data) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Preparing the Kitchen...</p>
      </div>
    );
  }

  const finalData = data || DEFAULT_DATA;

  return (
    <div className="min-h-screen bg-white selection:bg-gold/30">
      <ScrollToTop />
      <TopLineProgressBar />
      
      <Navbar 
        onHomeClick={() => navigate('/')}
        onWorkshopClick={() => {
          const active = finalData.workshops.find(w => !w.isHistorical);
          if (active) navigate(`/workshop/${active.id}`);
          else navigate('/#live-workshops');
        }}
        onRecordedClick={() => navigate('/academy')}
        onConsultancyClick={() => navigate('/consultancy')}
      />

      <Routes>
        <Route path="/" element={<HomeView data={finalData} />} />
        <Route path="/workshop/:id" element={<WorkshopDetailView data={finalData} />} />
        <Route path="/academy" element={<AcademyDetailView data={finalData} />} />
        <Route path="/recorded-class/:id" element={<AcademyDetailView data={finalData} />} />
        <Route path="/consultancy" element={<ConsultancyDetailView data={finalData} />} />
      </Routes>

      <Footer data={finalData} />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <AppContent />
    </HashRouter>
  );
};

export default App;