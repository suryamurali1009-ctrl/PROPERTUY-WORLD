import { useState, useEffect } from 'react';
import { Home, Phone, Compass, Info, FileText, Clock, Menu, X } from 'lucide-react';
import { BUILDER_BIO } from '../data';

interface NavbarProps {
  onNavigate: (section: string) => void;
  activeSection: string;
  onAdminClick: () => void;
  isAdminLoggedIn: boolean;
  onAdminLogout: () => void;
}

export default function Navbar({ 
  onNavigate, 
  activeSection, 
  onAdminClick, 
  isAdminLoggedIn, 
  onAdminLogout 
}: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [timeStr, setTimeStr] = useState('');

  // Keep a digital clock ticking in the header (gorgeous aesthetic detail)
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Exquisite Estates', id: 'properties', icon: Compass },
    { label: 'About Director', id: 'about', icon: Info },
    { label: 'Established Catalog', id: 'dashboard', icon: FileText },
  ];

  return (
    <nav
      id="main-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/70 backdrop-blur-xl border-b border-slate-200/40 shadow-md py-3'
          : 'bg-white/40 backdrop-blur-md py-4 border-b border-slate-100/10'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Logo */}
          <div 
            onClick={() => onNavigate('hero')} 
            className="flex items-center space-x-2 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
              <Home className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5 leading-none">
                <span className="font-sans font-black tracking-tight text-slate-900 text-sm sm:text-base">
                  PROPERTY WORLD
                </span>
                <span className="px-1.5 py-0.5 text-[8px] font-mono tracking-widest uppercase bg-emerald-50 text-emerald-700 rounded border border-emerald-250 font-bold leading-none shrink-0">
                  SINCE 1983
                </span>
              </div>
              <span className="block text-[8px] sm:text-[9.5px] font-mono font-black uppercase text-slate-500 tracking-widest leading-none mt-0.5">
                Builders & Developers
              </span>
              <span className="block text-[9.5px] sm:text-xs font-serif italic text-emerald-650 font-black tracking-wide capitalize antialiased mt-0.5">
                "{BUILDER_BIO.slogan}"
              </span>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden md:flex items-center space-x-6">
            <div className="flex items-center space-x-1 bg-slate-100 border border-slate-200/60 rounded-full p-1.5 shadow-inner">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                const handleSelection = () => {
                  onNavigate(item.id);
                };
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={handleSelection}
                    className={`flex items-center space-x-1 px-4 py-2 rounded-full text-xs font-bold tracking-wide transition-all duration-300 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/15'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-white/80'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>



            {/* Admin Center Control Button */}
            {isAdminLoggedIn && (
              <button
                onClick={() => { window.location.hash = '#/secret-admin-portal'; }}
                className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-xl text-xs font-black transition-all cursor-pointer shadow-md"
              >
                Go to Secret Desk (👑 Active)
              </button>
            )}

            {/* WhatsApp Connect Header button */}
            <a
              href="https://wa.me/919342420855?text=Hello%20Property%20World%2C%20I%20would%20like%20to%20connect%20on%20WhatsApp%20to%20discuss%20fine%20estates."
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-102 shadow-md shadow-emerald-600/10"
            >
              <svg 
                className="w-4 h-4 fill-white" 
                viewBox="0 0 448 512"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 512l145.4-38.2c32.7 17.8 69.4 27.2 107.1 27.2 122.4 0 222-99.6 222-222 0-59.3-23.1-115.1-65-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-86.2 22.7 23.1-84-4.4-7C38 312 27.8 281.4 27.8 250c0-108 87.7-195.7 195.7-195.7 52.3 0 101.4 20.4 138.4 57.4 37 37 57.4 86.1 57.4 138.3 0 108-87.7 195.7-195.5 195.7zm109.5-149.3c-6-3-35.6-17.5-41.1-19.5-5.5-2-9.6-3-13.7 3-4.1 6-16 20.1-19.6 24.1-3.6 4-7.2 4.5-13.2 1.5-6-3-25.4-9.4-48.4-30-17.9-16-30-35.8-33.5-41.7-3.6-6-.4-9.2 2.6-12.2 2.7-2.7 6-7 9-10.5 3-3.5 4-6 6-10 2-4 1-7.5-.5-10.5-1.5-3-13.7-33-18.8-45.2-5-12.2-10.1-10.5-13.8-10.7-3.6-.2-7.7-.2-11.7-.2-4.1 0-10.7 1.5-16.3 7.5-5.7 6-21.6 21.1-21.6 51.5s22.1 59.7 25.1 63.7c3 4 43.5 66.4 105.4 93 14.7 6.3 26.2 10.1 35.1 12.9 14.8 4.7 28.2 4 38.9 2.4 11.9-1.8 35.6-14.5 40.6-28.5 5-14 5-26 3.5-28.5-1.5-2.5-5.5-4-11.5-7z"/>
              </svg>
              <span>WhatsApp</span>
            </a>

            {/* Direct Dial Header button */}
            <a
              href={`tel:${BUILDER_BIO.phones[0].replace(/\s+/g, '')}`}
              id="header-call-btn"
              className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-55 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-2 rounded-xl text-xs font-black tracking-wide shadow-md shadow-emerald-500/15 group transition-all duration-300 hover:scale-102"
            >
              <Phone className="w-3.5 h-3.5 animate-bounce group-hover:scale-110 text-slate-950" />
              <span>DIAL: +91 {BUILDER_BIO.phones[0]}</span>
            </a>
          </div>

          {/* Mobile Menu Action */}
          <div className="md:hidden flex items-center space-x-2.5">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              id="mobile-menu-toggle"
              className="p-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-800 border border-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 mt-2 mx-4 bg-white/95 border border-slate-200/80 rounded-2xl p-4 shadow-xl backdrop-blur-xl animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex flex-col space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              const handleMobileSelection = () => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              };
              return (
                <button
                  key={item.id}
                  id={`nav-mob-${item.id}`}
                  onClick={handleMobileSelection}
                  className={`flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-500 text-slate-950'
                      : 'text-slate-700 hover:text-slate-950 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="pt-2 border-t border-slate-100 mt-2 flex flex-col gap-2">
              {/* Admin Button on Mobile */}
              {isAdminLoggedIn && (
                <button
                  onClick={() => {
                    window.location.hash = '#/secret-admin-portal';
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 bg-emerald-500 text-slate-950 rounded-xl text-xs font-bold"
                >
                  Go to Secret Desk (👑 Active)
                </button>
              )}

              <a
                href={`tel:${BUILDER_BIO.phones[0].replace(/\s+/g, '')}`}
                className="flex items-center justify-center space-x-2 w-full bg-emerald-500 text-slate-950 py-3 rounded-xl text-xs font-black tracking-wider"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>DIAL +91 {BUILDER_BIO.phones[0]}</span>
              </a>
              <div className="mt-3 text-center">
                <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-medium">
                  {BUILDER_BIO.experience}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
