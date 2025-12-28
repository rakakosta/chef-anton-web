
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminCMS from './components/AdminCMS';

const DevViewSwitcher = ({ currentRoute }: { currentRoute: string }) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999] flex p-1.5 bg-slate-900/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl scale-90 md:scale-100 transition-all hover:scale-105">
      <button
        onClick={() => { window.location.hash = ''; }}
        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
          currentRoute !== '#/portal-chef' 
            ? 'bg-gold text-white shadow-lg' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        🌐 Live Website
      </button>
      <button
        onClick={() => { window.location.hash = '#/portal-chef'; }}
        className={`px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
          currentRoute === '#/portal-chef' 
            ? 'bg-gold text-white shadow-lg' 
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        👨‍🍳 Chef CMS
      </button>
    </div>
  );
};

const RootSelector = () => {
  const [route, setRoute] = useState(window.location.hash);

  useEffect(() => {
    const handleHashChange = () => {
      setRoute(window.location.hash);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <>
      {/* CMS View */}
      {route === '#/portal-chef' ? (
        <AdminCMS onExit={() => { window.location.hash = ''; }} />
      ) : (
        <App />
      )}
      
      {/* Floating Toolbar for Preview/Dev Only */}
      <DevViewSwitcher currentRoute={route} />
    </>
  );
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <RootSelector />
  </React.StrictMode>
);
