
import React, { useState } from 'react';
import { NAV_ITEMS } from '../constants';

interface NavbarProps {
  onHomeClick?: () => void;
  onWorkshopClick?: () => void;
  onRecordedClick?: () => void;
  onConsultancyClick?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onHomeClick, onWorkshopClick, onRecordedClick, onConsultancyClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed w-full z-50 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex-shrink-0 cursor-pointer" onClick={onHomeClick}>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-slate-900 font-serif uppercase">
              CHEF<span className="text-gold ml-1">ANTON PRADIPTA</span>
            </span>
          </div>
          
          <div className="hidden lg:flex space-x-12">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-gold transition-colors duration-200"
                onClick={(e) => {
                  if (item.label === 'Home' && onHomeClick) {
                    e.preventDefault();
                    onHomeClick();
                  } else if (item.label === 'Live Workshop' && onWorkshopClick) {
                    e.preventDefault();
                    onWorkshopClick();
                  } else if (item.label === 'Kelas Rekaman' && onRecordedClick) {
                    e.preventDefault();
                    onRecordedClick();
                  } else if (item.label === 'Private Konsultasi' && onConsultancyClick) {
                    e.preventDefault();
                    onConsultancyClick();
                  }
                }}
              >
                {item.label}
              </a>
            ))}
          </div>

          <div className="lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-slate-600 p-2"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100 shadow-2xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="block px-3 py-4 text-sm font-bold text-slate-600 hover:bg-stone-50 hover:text-gold border-b border-stone-50"
                onClick={(e) => {
                  setIsOpen(false);
                  if (item.label === 'Home' && onHomeClick) {
                    e.preventDefault();
                    onHomeClick();
                  } else if (item.label === 'Live Workshop' && onWorkshopClick) {
                    e.preventDefault();
                    onWorkshopClick();
                  } else if (item.label === 'Kelas Rekaman' && onRecordedClick) {
                    e.preventDefault();
                    onRecordedClick();
                  } else if (item.label === 'Private Konsultasi' && onConsultancyClick) {
                    e.preventDefault();
                    onConsultancyClick();
                  }
                }}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
