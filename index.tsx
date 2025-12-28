
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import AdminCMS from './components/AdminCMS';

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
      {/* CMS View hanya aktif jika URL hash sesuai dengan path portal */}
      {route === '#/portal-chef' ? (
        <AdminCMS onExit={() => { window.location.hash = ''; }} />
      ) : (
        <App />
      )}
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
