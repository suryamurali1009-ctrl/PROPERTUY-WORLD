import React, { useState, useEffect } from 'react';
import { PROPERTIES, TESTIMONIALS, BUILDER_BIO } from './data';
import { Property, Inquiry, Testimonial } from './types';
import Navbar from './components/Navbar';
import PropertyCard from './components/PropertyCard';
import InquiryDashboard from './components/InquiryDashboard';
import SecretAdminPage from './components/SecretAdminPage';
import globeBackgroundImage from './assets/images/globe_background_1781544456786.jpg';
import hero3dEarthGlobe from './assets/images/hero_3d_earth_globe_1781544956007.jpg';

import { 
  Compass, 
  MapPin, 
  User, 
  Phone, 
  Mail, 
  Globe, 
  Building, 
  Sparkles, 
  HelpCircle, 
  CheckCircle,
  Award,
  ChevronDown,
  ExternalLink,
  ChevronRight,
  Shield,
  Clock,
  ArrowUpRight,
  FileText
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const slowScrollRevealVariant = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 1.4, ease: [0.25, 0.1, 0.25, 1.0] } 
  }
};

const extraSlowScrollRevealVariant = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 2.5, ease: [0.25, 0.1, 0.25, 1.0] } 
  }
};

const staggerContainerVariant = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05
    }
  }
};

const staggerItemVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.2, ease: [0.25, 0.1, 0.25, 1.0] }
  }
};

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSection, setActiveSection] = useState<string>('properties');

  // Secret URL routing state
  const [isAdminView, setIsAdminView] = useState<boolean>(false);

  useEffect(() => {
    const handleRouteCheck = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      const params = new URLSearchParams(window.location.search);
      
      const isSecretRoute = 
        path === '/secret-admin-portal' || 
        hash === '#/secret-admin-portal' || 
        hash === '#secret-admin-portal' ||
        params.has('secret-admin');
        
      setIsAdminView(isSecretRoute);
    };

    handleRouteCheck();
    window.addEventListener('popstate', handleRouteCheck);
    window.addEventListener('hashchange', handleRouteCheck);
    
    return () => {
      window.removeEventListener('popstate', handleRouteCheck);
      window.removeEventListener('hashchange', handleRouteCheck);
    };
  }, []);
  
  // Dynamic houses/properties for sales state
  const [properties, setProperties] = useState<Property[]>(() => {
    const saved = localStorage.getItem('property_world_properties');
    return saved ? JSON.parse(saved) : PROPERTIES;
  });

  useEffect(() => {
    localStorage.setItem('property_world_properties', JSON.stringify(properties));
  }, [properties]);

  // Admin authentication state
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('property_world_admin_auth') === 'true';
  });
  const [adminModalOpen, setAdminModalOpen] = useState<boolean>(false);
  const [adminUsername, setAdminUsername] = useState<string>('');
  const [adminPassword, setAdminPassword] = useState<string>('');
  const [adminError, setAdminError] = useState<string>('');

  // Form states to add new property
  const [newPropTitle, setNewPropTitle] = useState<string>('');
  const [newPropTagline, setNewPropTagline] = useState<string>('');
  const [newPropType, setNewPropType] = useState<'resort' | 'farmhouse' | 'site' | 'apartment' | 'villa' | 'commercial' | 'industrial'>('resort');
  const [newPropLocation, setNewPropLocation] = useState<string>('');
  const [newPropSubLocation, setNewPropSubLocation] = useState<string>('');
  const [newPropPriceText, setNewPropPriceText] = useState<string>('');
  const [newPropBasePrice, setNewPropBasePrice] = useState<number>(1500000);
  const [newPropUnitLabel, setNewPropUnitLabel] = useState<'cent' | 'sqft'>('cent');
  const [newPropDescription, setNewPropDescription] = useState<string>('');
  const [newPropFeatures, setNewPropFeatures] = useState<string>('');
  const [newPropImage, setNewPropImage] = useState<string>('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800');
  const [newPropDevelopmentStatus, setNewPropDevelopmentStatus] = useState<'Ready to Construct' | 'Proposed' | 'Approved' | 'Completed'>('Approved');
  const [newPropInstallmentsAvailable, setNewPropInstallmentsAvailable] = useState<boolean>(true);

  // File picker handler for loading custom images from user's device
  const handleDeviceImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setNewPropImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Ready template images for high user-friendliness
  const PRESET_IMAGES = [
    { name: 'Luxury Cabin', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800' },
    { name: 'Modern Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { name: 'Pristine Plot', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sandalwood Estate', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
    { name: 'Aesthetic Dwelling', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800' }
  ];

  // Interactive selected quote (transfers cost calculations to inquiry form)
  const [selectedQuote, setSelectedQuote] = useState<any>(null);

  // Load inquiries from localStorage
  const [inquiries, setInquiries] = useState<Inquiry[]>(() => {
    const saved = localStorage.getItem('property_world_inquiries');
    return saved ? JSON.parse(saved) : [];
  });

  // Keep localStorage updated
  useEffect(() => {
    localStorage.setItem('property_world_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Handle section scrolling
  const handleScrollToSection = (sectionId: string) => {
    setActiveSection(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const topOffset = element.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({
        top: topOffset,
        behavior: 'smooth'
      });
    }
  };

  // Filter properties based on active tab
  const filteredProperties = selectedCategory === 'all'
    ? properties
    : properties.filter(p => p.type === selectedCategory);

  // Trigger site tour booking handler
  const handleInquireProperty = (property: Property) => {
    setSelectedQuote({
      propertyId: property.id,
      propertyName: property.title,
      size: property.sizesAvailable[0],
      unit: property.unitLabel,
      totalPrice: property.basePrice,
      downPayment: Math.round(property.basePrice * 0.2),
      tenureMonths: property.installmentsAvailable ? 24 : 0,
      monthlyInstallment: property.installmentsAvailable ? Math.round((property.basePrice * 0.8) / 24) : property.basePrice,
    });
    handleScrollToSection('dashboard');
  };

  // Register a new user inquiry booking
  const handleAddNewInquiry = (newInq: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => {
    const inquiry: Inquiry = {
      ...newInq,
      id: `inq-${Date.now()}`,
      status: 'Received',
      timestamp: Date.now()
    };
    setInquiries(prev => [inquiry, ...prev]);
  };

  // Cancel an existing tour booking
  const handleDeleteInquiry = (id: string) => {
    setInquiries(prev => prev.filter(inq => inq.id !== id));
  };

  // Admin management actions
  const handleAdminVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminUsername === 'Admin' && adminPassword === 'Admin@123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('property_world_admin_auth', 'true');
      setAdminError('');
    } else {
      setAdminError('Invalid credentials. Check user/password constraints.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('property_world_admin_auth');
  };

  const handleAddProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPropTitle || !newPropLocation || !newPropPriceText) return;

    const newHomeItem: Property = {
      id: `prop-${Date.now()}`,
      title: newPropTitle,
      tagline: newPropTagline || 'Pre-designed Luxury Layout',
      type: newPropType,
      location: newPropLocation,
      subLocation: newPropSubLocation || 'Premium Suburb Zone',
      priceText: newPropPriceText,
      basePrice: newPropBasePrice,
      basePricePerUnit: Math.round(newPropBasePrice / 10),
      unitLabel: newPropUnitLabel,
      sizeText: newPropUnitLabel === 'cent' ? '10 - 50 Cents Layout' : '1,200 - 4,000 Sqft',
      sizesAvailable: newPropUnitLabel === 'cent' ? [4360, 8720, 13080] : [1200, 2400, 4000],
      description: newPropDescription || 'A spectacular housing development project custom designed with fine roads, utilities, water channels under Rajan M direction.',
      longDescription: newPropDescription || 'Premium land parcel with clean legal clearances.',
      features: newPropFeatures ? newPropFeatures.split(',').map(f => f.trim()) : ['Water Tap Tap', 'Internal roads & parks', 'Individual Survey boundaries', 'Clear title Khata certificate'],
      image: newPropImage,
      contactNumbers: BUILDER_BIO.phones,
      installmentsAvailable: newPropInstallmentsAvailable,
      minInstallmentMonths: 12,
      maxInstallmentMonths: 36,
      developmentStatus: newPropDevelopmentStatus
    };

    setProperties(prev => [newHomeItem, ...prev]);
    
    // Reset additions form fields
    setNewPropTitle('');
    setNewPropTagline('');
    setNewPropLocation('');
    setNewPropSubLocation('');
    setNewPropPriceText('');
    setNewPropDescription('');
    setNewPropFeatures('');
  };

  const handleRemoveProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
  };

  const previewProperty: Property = {
    id: 'preview',
    title: newPropTitle || 'Spacious Luxury Estate Title',
    tagline: newPropTagline || 'Authentic Premium Scheme',
    type: newPropType,
    location: newPropLocation || 'Lepakshi Border',
    subLocation: newPropSubLocation || 'Layout Sector A',
    priceText: newPropPriceText || '₹15 Lakhs Onwards',
    basePrice: newPropBasePrice || 1500000,
    basePricePerUnit: Math.round((newPropBasePrice || 1500000) / 1200),
    unitLabel: newPropUnitLabel,
    sizeText: newPropUnitLabel === 'cent' ? '12.5 Cents' : '1,200 Sqft',
    sizesAvailable: [1200],
    description: newPropDescription || 'Experience pristine tranquility under transparent title, pre-planted timber woodlands, and custom gated security systems.',
    longDescription: newPropDescription || 'Experience pristine tranquility under transparent title, pre-planted timber woodlands, and custom gated security systems.',
    features: newPropFeatures ? newPropFeatures.split(',').map(f => f.trim()).filter(Boolean) : ['Clear Title', 'Sandalwood Crop', 'Installments'],
    image: newPropImage || 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    contactNumbers: BUILDER_BIO.phones,
    installmentsAvailable: newPropInstallmentsAvailable,
    minInstallmentMonths: 12,
    maxInstallmentMonths: 36,
    developmentStatus: newPropDevelopmentStatus,
    isPremium: true
  };

  if (isAdminView) {
    return (
      <SecretAdminPage 
        properties={properties}
        setProperties={setProperties}
        inquiries={inquiries}
        setInquiries={setInquiries}
        isAdminLoggedIn={isAdminLoggedIn}
        setIsAdminLoggedIn={setIsAdminLoggedIn}
        onClose={() => {
          if (window.history.pushState) {
            window.history.pushState('', document.title, '/');
          } else {
            window.location.pathname = '/';
            window.location.hash = '';
          }
          setIsAdminView(false);
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 selection:bg-emerald-500 selection:text-slate-950 font-sans relative antialiased overflow-x-hidden">
      
      {/* GLOWING ORBS: Giant drifting glowing background circles representing modern glassmorphic look */}
      <div className="absolute top-[-5%] left-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/5 blur-[130px] animate-pulse pointer-events-none"></div>
      <div className="absolute top-[25%] right-[-15%] w-[600px] h-[600px] rounded-full bg-teal-500/5 blur-[150px] pointer-events-none"></div>
      <div className="absolute top-[60%] left-[-20%] w-[550px] h-[550px] rounded-full bg-slate-200/40 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-10%] w-[500px] h-[500px] rounded-full bg-emerald-500/3 blur-[100px] pointer-events-none"></div>

      {/* FIXED GLASS NAVIGATION BAR */}
      <Navbar 
        onNavigate={handleScrollToSection} 
        activeSection={activeSection}
        onAdminClick={() => setAdminModalOpen(true)}
        isAdminLoggedIn={isAdminLoggedIn}
        onAdminLogout={handleAdminLogout}
      />

      {/* HERO HERO HERO HERO SECTION */}
      <section 
        id="hero" 
        className="relative pt-32 pb-24 md:pt-40 md:pb-32 w-full px-4 sm:px-6 lg:px-8 overflow-hidden text-white bg-[#01030e]"
        style={{
          backgroundImage: `linear-gradient(to right, #01030e 10%, rgba(1, 3, 14, 0.45) 50%, rgba(255, 255, 255, 0.1) 85%, rgba(255, 255, 255, 0.95) 100%), url(${hero3dEarthGlobe})`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* Soft, beautiful white-fading gradient overlays to blend the globe image smoothly into white/light theme at the bottom and right edges */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none z-10" />
        <div className="absolute top-0 right-0 bottom-0 w-28 bg-gradient-to-r from-transparent to-white/70 pointer-events-none z-10 hidden sm:block" />
        
        {/* Left Aligned Hero Wrapper with ample negative space for the 3D globe on the right */}
        <div className="relative max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center py-4 z-20">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={slowScrollRevealVariant}
            className="lg:col-span-7 space-y-8 text-left z-10"
          >
            
            {/* Tagline Badge - Premium Glass Design */}
            <div className="inline-flex items-center space-x-2 bg-emerald-950/40 border border-emerald-800/40 shadow-lg backdrop-blur-xl px-4 py-2 rounded-full text-xs font-mono font-bold tracking-widest text-emerald-400 uppercase transition-all hover:bg-emerald-900/50">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Established in 1983 • Over 40 Years of Service across Karnataka</span>
            </div>

            {/* Premium Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tight text-white leading-[1.08] max-w-3xl drop-shadow-md">
              Exclusive plots, <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">luxury farmhouses</span> & approved sites.
            </h1>

            {/* Supporting Statement */}
            <p className="text-slate-300 font-sans text-sm sm:text-base leading-relaxed max-w-2xl font-medium">
              Experience the masterwork of **Property World Builders & Developers**. Established in 1983, our values in land-registry and transparent, budget-friendly installment schemes have enabled hundreds to own real estate. Direct service under authority of **Rajan M, Founder & Director**.
            </p>

            {/* Glowing stats strip - Ultra Glassmorphism Design */}
            <div className="grid grid-cols-3 gap-6 py-6 bg-slate-950/65 backdrop-blur-md border border-slate-800/60 rounded-3xl p-6 shadow-xl relative overflow-hidden max-w-xl">
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 pointer-events-none"></div>
              
              <div className="text-center sm:pl-3 relative z-10 flex flex-col justify-center items-center">
                <span className="block text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tighter text-emerald-400 leading-none drop-shadow-sm">40+</span>
                <span className="text-[10px] sm:text-xs font-sans font-extrabold text-slate-400 uppercase tracking-widest mt-2">Years Trust</span>
              </div>
              <div className="text-center border-x border-slate-800 relative z-10 flex flex-col justify-center items-center">
                <span className="block text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tighter text-teal-400 leading-none drop-shadow-sm">100%</span>
                <span className="text-[10px] sm:text-xs font-sans font-extrabold text-slate-400 uppercase tracking-widest mt-2 px-1">Khata Approved</span>
              </div>
              <div className="text-center sm:pr-3 relative z-10 flex flex-col justify-center items-center">
                <span className="block text-4xl sm:text-5xl md:text-6xl font-sans font-black tracking-tighter text-white leading-none drop-shadow-sm">4.8★</span>
                <span className="text-[10px] sm:text-xs font-sans font-extrabold text-slate-400 uppercase tracking-widest mt-2">Reviews</span>
              </div>
            </div>

            {/* Quick action triggers */}
            <div className="flex pt-2">
              <button
                onClick={() => handleScrollToSection('properties')}
                id="hero-view-estates-btn"
                className="flex items-center justify-center space-x-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-8 py-3.5 rounded-xl text-xs font-extrabold uppercase tracking-widest shadow-lg shadow-emerald-500/20 active:scale-98 transition-all cursor-pointer"
              >
                <span>Explore Fine Estates</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

          </motion.div>

          {/* Right spacer to preserve 60-70% visible globe on the right side of the screen */}
          <div className="hidden lg:block lg:col-span-5"></div>
        </div>
      </section>

      {/* BRAND INTRODUCTION SECTION - ABOUT PROPERTY WORLD BUSINESS AND DEVELOPERS */}
      <section id="about-brand" className="py-20 bg-slate-150 w-full relative">
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative grid grid-cols-1 lg:grid-cols-12 gap-12 items-center z-20">
          
          {/* Left Column: Rich Typography and Mission Statement */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center space-x-1 text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-250 text-xs font-mono font-extrabold uppercase tracking-wide">
              <span>ESTD 1983 • LEGACY OF TRUST</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-slate-950 leading-tight">
              ABOUT <span className="text-emerald-700">PROPERTY WORLD</span> Business & Developers
            </h2>
            
            <p className="text-sm text-slate-950 leading-relaxed font-sans font-bold">
              For over four decades, Property World has stood as a beacon of reliability and legal clarity in Karnataka's real estate domain. Founded with a vision to make direct land ownership safe, accessible, and structured, we specialize in high-growth gated complexes, serene resort farmlands, and premium villa site layouts.
            </p>
            
            <p className="text-sm text-slate-950 leading-relaxed font-sans font-bold">
              Under the rigorous legal ethics and direct leadership of Founder **Rajan M**, we maintain <span className="text-black font-black underline decoration-emerald-500/50 decoration-2">100% litigation-free titles, clear Gram Panchayat Khata certifications, and complete boundary fencing</span> on every single development site. By connecting customers directly with our corporate team, we eliminate unvetted middleman costs, handing over complete value and safety to hundreds of families.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <div className="flex items-center space-x-3 bg-slate-100/95 hover:bg-black active:bg-black border border-slate-250 hover:border-black rounded-2xl p-4 flex-1 shadow-sm group transition-all duration-500 ease-out cursor-pointer">
                <span className="text-2xl text-emerald-600 group-hover:text-emerald-400 transition-colors duration-500">🗺️</span>
                <div>
                  <span className="block text-xs font-sans font-black text-slate-950 group-hover:text-white transition-colors duration-500">ISO 9001:2015 Approved</span>
                  <span className="text-[10px] text-slate-905 group-hover:text-emerald-400 font-mono font-black transition-colors duration-500">Strict title validation systems</span>
                </div>
              </div>
              <div className="flex items-center space-x-3 bg-slate-100/95 hover:bg-black active:bg-black border border-slate-250 hover:border-black rounded-2xl p-4 flex-1 shadow-sm group transition-all duration-500 ease-out cursor-pointer">
                <span className="text-2xl text-emerald-600 group-hover:text-emerald-400 transition-colors duration-500">🤝</span>
                <div>
                  <span className="block text-xs font-sans font-black text-slate-950 group-hover:text-white transition-colors duration-500">No Broker Commission</span>
                  <span className="text-[10px] text-slate-905 group-hover:text-emerald-400 font-mono font-black transition-colors duration-500">Direct transactions with Rajan M</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Key Stats Bento Grid */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Stat Card 1 */}
            <div className="p-6 bg-slate-100/90 hover:bg-black active:bg-black border border-slate-250 hover:border-black rounded-3xl shadow-sm space-y-3 group transition-all duration-700 ease-out cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-zinc-800 border border-slate-250 group-hover:border-zinc-700 flex items-center justify-center font-mono font-bold text-lg transition-all duration-700">
                👨‍💼
              </div>
              <div>
                <span className="text-[10px] font-mono font-black text-slate-500 group-hover:text-emerald-400 uppercase tracking-wider block transition-colors duration-700">Founder</span>
                <span className="text-base font-sans font-black text-slate-950 group-hover:text-white block mt-0.5 transition-colors duration-700">Rajan M</span>
              </div>
              <p className="text-[11px] text-slate-955 group-hover:text-emerald-200 leading-normal font-sans font-bold transition-colors duration-700">
                Pioneering leader in Karnataka land banking and development. Personal authority, transparent negotiations, and dedicated customer alignment.
              </p>
            </div>

            {/* Stat Card 2 */}
            <div className="p-6 bg-slate-100/90 hover:bg-black active:bg-black border border-slate-250 hover:border-black rounded-3xl shadow-sm space-y-3 group transition-all duration-700 ease-out cursor-pointer">
              <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-zinc-800 border border-slate-250 group-hover:border-zinc-700 flex items-center justify-center text-emerald-700 group-hover:text-emerald-400 font-mono font-black text-lg transition-all duration-700">
                40+
              </div>
              <div>
                <span className="text-[10px] font-mono font-black text-slate-500 group-hover:text-emerald-400 uppercase tracking-wider block transition-colors duration-700">Experience</span>
                <span className="text-base font-sans font-black text-slate-950 group-hover:text-white block mt-0.5 transition-colors duration-700">40+ Years of Service</span>
              </div>
              <p className="text-[11px] text-slate-955 group-hover:text-emerald-200 leading-normal font-sans font-bold transition-colors duration-700">
                Established in 1983, supporting hundreds of direct buyers with flexible, low-pressure installment schemes and seamless registrations.
              </p>
            </div>

            {/* Stat Card 3 */}
            <div className="p-6 bg-slate-100/90 hover:bg-black active:bg-black border border-slate-250 hover:border-black rounded-3xl shadow-sm space-y-4 group transition-all duration-700 ease-out cursor-pointer sm:col-span-2">
              <div className="flex items-center space-x-3 mb-1">
                <div className="w-10 h-10 rounded-xl bg-white group-hover:bg-zinc-800 border border-slate-250 group-hover:border-zinc-700 flex items-center justify-center text-lg font-mono transition-all duration-700">
                  🏘️
                </div>
                <div>
                  <span className="text-[10px] font-mono font-black text-slate-500 group-hover:text-emerald-400 uppercase tracking-wider block transition-colors duration-700">Proven Track Record</span>
                  <span className="text-base font-sans font-black text-slate-950 group-hover:text-white block mt-0.5 transition-colors duration-700">50+ Completed Projects</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-3 transition-all duration-700">
                <div>
                  <span className="block text-[11px] font-sans text-slate-950 group-hover:text-emerald-400 font-extrabold transition-colors duration-700">Region Coverage</span>
                  <p className="text-[10.5px] text-slate-950 group-hover:text-emerald-200 leading-relaxed font-bold transition-colors duration-700">All over Karnataka (Sahakar Nagar, Devanahalli, Lepakshi border sites, and premium urban zones).</p>
                </div>
                <div>
                  <span className="block text-[11px] font-sans text-slate-950 group-hover:text-emerald-400 font-extrabold transition-colors duration-700">Registration Assurance</span>
                  <p className="text-[10.5px] text-slate-950 group-hover:text-emerald-200 leading-relaxed font-bold transition-colors duration-700">Clear physical demarcation, concrete milestones, prompt titles delivery under governmental rules.</p>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* PROPERTIES SECTION - LISTINGS TABS */}
      <section id="properties" className="py-20 bg-white relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01 }}
            variants={slowScrollRevealVariant}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <div className="inline-flex items-center space-x-1 text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 text-xs font-mono mb-3 font-extrabold">
              <Compass className="w-4 h-4" />
              <span>EXQUISITE PORTFOLIO GALLERY</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-slate-900">
              Curated Gated Plots & <span className="text-emerald-700">Premium Developments</span>
            </h2>
        </motion.div>

        {/* ACTIVE ADMIN SECTION: Add new property listings (PORTFOLIO EDITOR) */}
        {false && (
          <div className="mb-12 bg-white/95 rounded-2xl border-2 border-emerald-500/20 p-6 sm:p-8 shadow-xl max-w-6xl mx-auto relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 font-mono text-[9px] font-black px-3.5 py-1 uppercase rounded-bl-xl tracking-wider">
              👑 PORTFOLIO MANAGER ACTIVE
            </div>
            
            <div className="flex items-center space-x-2.5 mb-6 pb-4 border-b border-slate-100">
              <span className="text-xl">🛠️</span>
              <div>
                <h3 className="text-base font-extrabold text-slate-900">Add Premium Estate Listing</h3>
                <p className="text-[11px] text-slate-500 font-medium">Create a new gate layout element. It will sync with localized installment lists immediately.</p>
              </div>
            </div>

            {/* Two-column layout: Inputs on left, Real-time preview Card on right */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-8">
                <form onSubmit={handleAddProperty} className="space-y-6">
              
              {/* Row 1 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Estate Title</label>
                  <input 
                    type="text" 
                    value={newPropTitle}
                    onChange={(e) => setNewPropTitle(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Tagline</label>
                  <input 
                    type="text" 
                    value={newPropTagline}
                    onChange={(e) => setNewPropTagline(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Property Category</label>
                  <select 
                    value={newPropType}
                    onChange={(e) => setNewPropType(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  >
                    <option value="resort">Resort Plot</option>
                    <option value="farmhouse">Farmhouse Estate</option>
                    <option value="site">BIAAPA Site</option>
                    <option value="apartment">2BHK Apartment</option>
                    <option value="villa">Luxury Villa</option>
                    <option value="commercial">Commercial Land</option>
                    <option value="industrial">Industrial Plot</option>
                  </select>
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">District / City</label>
                  <input 
                    type="text" 
                    value={newPropLocation}
                    onChange={(e) => setNewPropLocation(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Sublocation Layout</label>
                  <input 
                    type="text" 
                    value={newPropSubLocation}
                    onChange={(e) => setNewPropSubLocation(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Display Pricing Label</label>
                  <input 
                    type="text" 
                    value={newPropPriceText}
                    onChange={(e) => setNewPropPriceText(e.target.value)}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Numeric Base Price (₹)</label>
                  <input 
                    type="number" 
                    value={newPropBasePrice}
                    onChange={(e) => setNewPropBasePrice(Number(e.target.value))}
                    required
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Base Measurement Unit</label>
                  <select 
                    value={newPropUnitLabel}
                    onChange={(e) => setNewPropUnitLabel(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  >
                    <option value="cent">Cents (Traditional agricultural rate)</option>
                    <option value="sqft">Square Feet (Standard BIAAPA layout)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Construction Status</label>
                  <select 
                    value={newPropDevelopmentStatus}
                    onChange={(e) => setNewPropDevelopmentStatus(e.target.value as any)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  >
                    <option value="Approved">KHATA Approved</option>
                    <option value="Ready to Construct">Ready to Construct</option>
                    <option value="Proposed">Proposed Development</option>
                    <option value="Completed">Completed Masterwork</option>
                  </select>
                </div>
                <div className="flex items-center pt-5">
                  <input 
                    type="checkbox" 
                    id="installBool"
                    checked={newPropInstallmentsAvailable}
                    onChange={(e) => setNewPropInstallmentsAvailable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500"
                  />
                  <label htmlFor="installBool" className="ml-2 text-xs font-bold text-slate-700 select-none cursor-pointer">
                    Installment schemes available
                  </label>
                </div>
              </div>

              {/* Preset Image Selection Carousel & Device Image Upload option */}
              <div className="space-y-3">
                <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">
                  Premium Visual Asset (Choose preset OR upload from device)
                </label>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Presets Grid */}
                  <div className="md:col-span-3 grid grid-cols-5 gap-2">
                    {PRESET_IMAGES.map((imgItem) => (
                      <button
                        type="button"
                        key={imgItem.name}
                        onClick={() => setNewPropImage(imgItem.url)}
                        className={`relative rounded-xl overflow-hidden h-14 border-2 transition-all cursor-pointer ${
                          newPropImage === imgItem.url ? 'border-emerald-500 scale-102 ring-2 ring-emerald-500/20' : 'border-transparent opacity-75 hover:opacity-100'
                        }`}
                      >
                        <img src={imgItem.url} alt={imgItem.name} className="w-full h-full object-cover" />
                        <div className="absolute inset-x-0 bottom-0 bg-slate-950/70 py-0.5 text-center">
                          <span className="text-[7.5px] font-bold text-white tracking-widest uppercase">{imgItem.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Device upload container */}
                  <div className="md:col-span-2 flex items-center justify-center">
                    <label className="w-full h-14 flex items-center justify-center border-2 border-dashed border-slate-350 hover:border-emerald-500/50 bg-slate-50 hover:bg-emerald-50/20 rounded-xl cursor-pointer transition-all px-3 py-1 group select-none">
                      <div className="flex items-center space-x-2 text-slate-600 group-hover:text-emerald-700 transition-colors">
                        <span className="text-lg">📁</span>
                        <div className="text-left">
                          <span className="block text-[10px] font-black uppercase tracking-wider">Device Upload</span>
                          <span className="block text-[8px] text-slate-400 font-medium">Select image file</span>
                        </div>
                      </div>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleDeviceImageUpload}
                        className="hidden" 
                      />
                    </label>
                  </div>
                </div>

                {/* Show custom-loaded base64 info if active */}
                {newPropImage && !PRESET_IMAGES.some(img => img.url === newPropImage) && (
                  <div className="p-2 border border-emerald-500/20 bg-emerald-50/15 rounded-xl flex items-center justify-between shadow-sm">
                    <div className="flex items-center space-x-3">
                      <img src={newPropImage} className="w-10 h-10 object-cover rounded-lg border border-slate-200" alt="Loaded thumbnail" />
                      <div>
                        <span className="block text-[9px] font-mono text-emerald-600 uppercase font-black">⚙️ Custom device image loaded</span>
                        <span className="block text-[8px] text-slate-400 font-mono truncate max-w-xs">{newPropImage.substring(0, 50)}...</span>
                      </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setNewPropImage(PRESET_IMAGES[2].url)} 
                      className="text-[9px] font-mono font-bold text-slate-400 hover:text-slate-600 px-2.5 py-1 hover:bg-slate-100 rounded-lg transition-all"
                    >
                      Clear custom ✕
                    </button>
                  </div>
                )}

                <input 
                  type="text" 
                  value={newPropImage}
                  onChange={(e) => setNewPropImage(e.target.value)}
                  placeholder="Or paste direct image URL here..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-[10px] font-mono focus:outline-none focus:border-emerald-500 text-slate-650 shadow-inner"

                />
              </div>

              {/* Textareas */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Short Description</label>
                  <textarea 
                    value={newPropDescription}
                    onChange={(e) => setNewPropDescription(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-mono font-bold text-slate-700 uppercase mb-1">Acreage Features (Comma Separated)</label>
                  <textarea 
                    value={newPropFeatures}
                    onChange={(e) => setNewPropFeatures(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-emerald-500 text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-sans font-black uppercase tracking-wider text-xs px-6 py-3 rounded-xl shadow-lg shadow-emerald-500/10 active:scale-98 transition-all cursor-pointer"
                >
                  🚀 Publish To Active Listings
                </button>
              </div>

            </form>
          </div>

          {/* Column 2: Live Property Card Preview (1/3 width on large screens) */}
          <div className="lg:col-span-4 sticky top-24 bg-slate-100/60 border border-slate-200/80 p-5 rounded-2xl shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-200/50">
              <span className="text-[10px] font-mono tracking-widest uppercase text-emerald-700 font-bold flex items-center space-x-1.5">
                <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                <span>Live Card Preview</span>
              </span>
              <span className="text-[9px] font-mono font-medium text-slate-400">Updates instantly</span>
            </div>
            
            <div className="scale-95 origin-top transition-transform duration-300">
              <PropertyCard property={previewProperty} onInquire={() => {}} />
            </div>
          </div>

        </div> {/* Close columns grid */}
      </div>
    )}

        {/* Dynamic Category Filtering Nav Tabs (HIGH DESIGN) */}
        <div className="flex flex-wrap justify-center items-center gap-2 mb-10 max-w-3xl mx-auto bg-slate-200/50 border border-slate-200 p-1.5 rounded-2xl shadow-inner">
          {[
            { id: 'all', label: 'All Developments' },
            { id: 'resort', label: 'Resort Plots' },
            { id: 'farmhouse', label: 'Farm Estates' },
            { id: 'site', label: 'BIAAPA Sites' },
            { id: 'apartment', label: '2BHK Apartments' },
            { id: 'villa', label: 'Luxury Villas' },
            { id: 'commercial', label: 'Commercial' },
            { id: 'industrial', label: 'Industrial' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all cursor-pointer ${
                selectedCategory === tab.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md'
                  : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Real Estate Grid and Cards */}
        {filteredProperties.length === 0 ? (
          <div className="text-center py-16 bg-slate-900/40 border border-slate-800 rounded-3xl p-8 max-w-md mx-auto">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-base font-bold text-white uppercase tracking-wider">No Properties Found</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
              We currently don't have active listings matching the selected category. Contact Rajan M directly or submit a requirements survey below to get custom listings matched!
            </p>
          </div>
        ) : (
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01 }}
            variants={staggerContainerVariant}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredProperties.map((property) => (
              <motion.div 
                key={property.id}
                variants={staggerItemVariant}
              >
                <PropertyCard
                  property={property}
                  onInquire={handleInquireProperty}
                  isAdmin={isAdminLoggedIn}
                  onDelete={handleRemoveProperty}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
        </div>
      </section>

      {/* ESTABLISHED CATALOG & REAL-TIME DASHBOARD (LOCAL CRM & CHAT) */}
      <section id="dashboard" className="py-20 bg-slate-50/50 relative w-full">
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-white to-transparent pointer-events-none z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.01 }}
            variants={extraSlowScrollRevealVariant}
          >
            <InquiryDashboard
              properties={properties}
              savedInquiries={inquiries}
              onDeleteInquiry={handleDeleteInquiry}
              onAddNewInquiry={handleAddNewInquiry}
              preSelectedQuote={selectedQuote}
              onClearQuote={() => setSelectedQuote(null)}
            />
          </motion.div>
        </div>
      </section>

      {/* DIRECTOR SPOTLIGHT SECTION (REPRESENTING THE VISITING CARD REAL DETAIL) */}
      <section id="about" className="py-24 bg-gradient-to-b from-white via-slate-900 to-slate-950 relative text-white overflow-hidden">
        {/* Soft white-fading top gradient overlay to blend into the light section above */}
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-white via-white/40 to-transparent pointer-events-none z-10" />
        {/* Elegant light ambient glow overlay within the Director cabinet to fade the black with a touch of white */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.08)_0%,transparent_70%)] pointer-events-none z-0" />
        
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.01 }}
          variants={slowScrollRevealVariant}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Bio text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center space-x-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-widest">
                <Award className="w-3.5 h-3.5" />
                <span>MEET THE CHIEF DIRECTOR</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-sans font-black tracking-tight text-white leading-tight">
                About Chief Director <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-450 to-emerald-300">Rajan M</span>
                <span className="block text-lg text-emerald-400 font-sans mt-3 font-semibold font-bold">Founder of Property World Builders & Developers</span>
              </h2>
              
              <blockquote className="border-l-2 border-emerald-500 pl-4 py-1 text-slate-350 font-serif italic text-sm">
                "Real estate purchase is not just about signing legal Khata books. It is about laying down roots, creating legacy plantations, and fostering absolute confidence. Our 40-year presence in Bangalore guarantees a flawless title verification pipeline."
              </blockquote>

              <p className="text-xs text-slate-350 leading-relaxed font-sans font-semibold">
                Under Rajan M's strict supervision, Property World Builders & Developers has designed, secured, and handed over high-yield gated communities like the Lepakshi Resorts, approved layouts in Devanahalli, and boutique residential complexes in Horamavu. We clear titles directly at the registrar's office. No middlemen, no Hidden charges.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm">
                  <Shield className="w-5 h-5 text-emerald-450" />
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">LEGALLY COMPLIANT</span>
                    <span className="text-white font-bold text-[11px]">BIAAPA & GP Approved</span>
                  </div>
                </div>
                <div className="flex items-center space-x-3 bg-slate-900 p-3 rounded-xl border border-slate-800 shadow-sm">
                  <Clock className="w-5 h-5 text-emerald-450" />
                  <div>
                    <span className="block text-slate-400 text-[10px] uppercase font-bold">DEVELOPMENT PACE</span>
                    <span className="text-white font-bold text-[11px]">On-Time Roads & Water</span>
                  </div>
                </div>
              </div>
                        {/* Right: Glassmorphic interpretation of the Builder's card (HIGH DESIGN) */}
            <div className="lg:col-span-6 flex justify-center">
              <div className="relative w-full max-w-md bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-xl relative overflow-hidden group text-white">
                {/* Visual glass sheen overlay */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none"></div>

                {/* Card Top Block */}
                <div className="flex justify-between items-start pb-6 mb-6 font-bold text-white">
                  <div>
                    <h3 className="text-xl font-bold tracking-tight text-white mb-0.5">{BUILDER_BIO.name}</h3>
                    <p className="text-xs font-mono text-emerald-400 tracking-wider uppercase font-bold">{BUILDER_BIO.role}</p>
                    <p className="text-[10px] text-slate-400 mt-1 font-sans">{BUILDER_BIO.experience}</p>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center font-bold text-slate-900 shadow-md">
                    👑
                  </div>
                </div>

                {/* Card Body Grid */}
                <div className="space-y-4 text-xs font-semibold text-slate-300">
                  <div className="flex items-start space-x-3">
                    <Building className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[8.5px] font-mono text-slate-400 uppercase tracking-widest font-bold">BUILDER FIRM</span>
                      <span className="text-white font-bold font-sans">{BUILDER_BIO.company}</span>
                      <span className="block text-[9px] text-emerald-400 italic font-mono font-bold">"A Name You Can Trust"</span>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <MapPin className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-[8.5px] font-mono text-slate-400 uppercase tracking-widest font-bold">OFFICE HEADQUARTERS</span>
                      <span className="text-slate-350 leading-normal font-sans text-[11px] block mb-1">{BUILDER_BIO.office}</span>
                      <a 
                        href={(BUILDER_BIO as any).officeMapUrl || "https://maps.google.com"} 
                        target="_blank" 
                        rel="noreferrer noopener" 
                        className="inline-flex items-center space-x-1.5 text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400 hover:text-emerald-350 hover:underline transition-all"
                      >
                        <span>📍 Open in Google Maps ↗</span>
                      </a>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex items-start space-x-3">
                      <Mail className="w-4 h-4 text-emerald-450 shrink-0 mt-0.5" />
                      <div>
                        <span className="block text-[8.5px] font-mono text-slate-400 uppercase tracking-widest font-bold">EMAIL ADDRESS</span>
                        <a href={`mailto:${BUILDER_BIO.email}`} className="text-emerald-400 hover:underline text-[11px] font-mono font-bold">{BUILDER_BIO.email}</a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Card Footer Phone actions */}
                <div className="mt-8 pt-6">
                  <span className="block text-[9px] font-mono text-slate-400 uppercase tracking-widest mb-3 font-bold">Direct Hotlines (Click to dial)</span>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {BUILDER_BIO.phones.map((phone) => (
                      <a
                        key={phone}
                        href={`tel:${phone.replace(/\s+/g, '')}`}
                        className="flex items-center space-x-1.5 px-3 py-2 bg-slate-950 border border-slate-800 hover:border-emerald-500/30 rounded-xl text-[11px] font-mono text-slate-300 transition-all hover:bg-slate-850 hover:text-white font-bold"
                      >
                        <Phone className="w-3 h-3 text-emerald-450" />
                        <span>+91 {phone}</span>
                      </a>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
    </motion.div>
  </section>





      {/* FOOTER FOOTER FOOTER DESIGN */}
      <footer className="bg-slate-950 py-12 relative overflow-hidden">
        {/* Elegant top fade-to-white overlay to transition smoothly from the light section above */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-white via-white/12 to-transparent pointer-events-none z-10 opacity-80" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Column A */}
            <div className="md:col-span-2 space-y-4">
               <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center font-bold text-slate-900">
                  P
                </div>
                <span className="font-sans font-extrabold tracking-tight text-white uppercase text-sm">
                  PROPERTY WORLD
                </span>
              </div>
              <p className="text-[11px] text-gray-400 max-w-sm leading-normal">
                Property World Builders & Developers is a premium land banking and development firm registered in Bangalore. Under leadership of managing partner **Rajan M**, we design beautiful gated ecosystems that yield reliable agricultural appreciate curves.
              </p>
              
              {/* PROPERTY WORLD REGISTERED ADDRESS BLOCK IN BOTTOM SECTION */}
              <div className="pt-3 space-y-1.5 text-[10px] font-mono text-gray-450 leading-relaxed max-w-sm">
                <span className="block font-black text-white uppercase text-[11px] tracking-wide mb-1">PROPERTY WORLD OFFICE:</span>
                <p className="font-bold text-gray-300"># 2380 2nd Floor 1st Main Next to</p>
                <p className="font-bold text-gray-350">State Bank of Mysore 'E' Block</p>
                <p className="font-bold text-gray-350">Sahakarnagar Bangalore - 560 092</p>
                <p className="pt-1 text-slate-400">Ph: 080 4173 5951 / 52 / 53 &nbsp;&bull;&nbsp; Fax: 4173 5950</p>
                <p className="text-slate-400">e-mail: <a href="mailto:propertyworld1986@yahoo.in" className="text-emerald-400 hover:underline">propertyworld1986@yahoo.in</a></p>
                <p className="text-slate-400">www.propertyworldind.com</p>
              </div>

              <p className="text-[10.5px] text-emerald-400 font-mono font-medium pt-2">
                ISO 9001:2015 certified processes • 100% litigate-free ownership guarantee.
              </p>
            </div>

            {/* Column B */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-3">LISTED PORTFOLIOS</h4>
              <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
                <li>
                  <button onClick={() => { setSelectedCategory('resort'); handleScrollToSection('properties'); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Lepakshi Resort Plots
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('farmhouse'); handleScrollToSection('properties'); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Devanahalli Farmhouses
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('site'); handleScrollToSection('properties'); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    BIAAPA Approved Sites
                  </button>
                </li>
                <li>
                  <button onClick={() => { setSelectedCategory('apartment'); handleScrollToSection('properties'); }} className="hover:text-white transition-colors cursor-pointer text-left">
                    Horamavu 2BHK Flats
                  </button>
                </li>
              </ul>
            </div>

            {/* Column C */}
            <div>
              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-white mb-3">LEGAL COMPLIANCES</h4>
              <ul className="space-y-2 text-[11px] text-gray-400 font-sans">
                <li>BIAAPA Approved Framework</li>
                <li>Panchayat Khata Approved Sites</li>
                <li>Individual Survey Stones</li>
                <li>Free legal title audit sheets</li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] text-gray-600 font-mono">
            <p>
              © 2026 Property World Builders & Developers. All rights reserved. Slogan "A Name You Can Trust" is legal property of Rajan M, Bangalore.
            </p>
            <div className="flex items-center space-x-4">
              <span className="flex items-center space-x-1">
                <span>Security verified</span>
                <button 
                  onClick={() => { window.location.hash = '#/secret-admin-portal'; }}
                  className="opacity-20 hover:opacity-100 transition-opacity p-0.5 cursor-pointer text-slate-700"
                  title="Administrative Control Center"
                >
                  🔒
                </button>
              </span>
              <span>•</span>
              <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="text-emerald-500 hover:underline">
                Back to high altitude
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* ADMIN PORTAL LOGIN MODAL OVERLAY */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-sm bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-2xl overflow-hidden animate-scale-up">
            <div className="absolute top-0 inset-x-0 h-[3px] bg-gradient-to-r from-emerald-500 to-teal-500"></div>
            
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center space-x-2">
                <span className="text-lg">👑</span>
                <h3 className="text-base font-extrabold text-slate-900">Admin Authentication</h3>
              </div>
              <button 
                onClick={() => { setAdminModalOpen(false); setAdminError(''); }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-bold"
              >
                ✕ Close
              </button>
            </div>

            <form onSubmit={(e) => {
              handleAdminVerify(e);
              if (adminUsername === 'Admin' && adminPassword === 'Admin@123') {
                setAdminModalOpen(false);
                setAdminUsername('');
                setAdminPassword('');
              }
            }} className="space-y-4">
              {adminError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-[11px] text-rose-600 font-bold leading-normal">
                  ⚠️ {adminError}
                </div>
              )}

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Username</label>
                <input 
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono font-bold text-slate-500 uppercase mb-1">Password</label>
                <input 
                  type="password"
                  required
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-bold text-slate-800"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-emerald-500/10 active:scale-98 transition-all cursor-pointer"
                >
                  Verify Credentials
                </button>
              </div>

              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-mono font-medium">Authorized staff access only</p>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FLOATING WHATSAPP BUTTON */}
      <a
        href="https://wa.me/919342420855?text=Hello%20Property%20World%2C%20I%20would%20like%20to%20connect%20on%20WhatsApp%20to%20discuss%20fine%20estates."
        target="_blank"
        rel="noreferrer noopener"
        className="fixed bottom-6 right-6 z-50 p-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center group transition-all duration-300 hover:scale-110 active:scale-95 border border-white/20 hover:shadow-emerald-500/20"
        title="Connect on WhatsApp"
      >
        <svg 
          className="w-6 h-6 fill-white" 
          viewBox="0 0 448 512"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 512l145.4-38.2c32.7 17.8 69.4 27.2 107.1 27.2 122.4 0 222-99.6 222-222 0-59.3-23.1-115.1-65-157.1zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-86.2 22.7 23.1-84-4.4-7C38 312 27.8 281.4 27.8 250c0-108 87.7-195.7 195.7-195.7 52.3 0 101.4 20.4 138.4 57.4 37 37 57.4 86.1 57.4 138.3 0 108-87.7 195.7-195.5 195.7zm109.5-149.3c-6-3-35.6-17.5-41.1-19.5-5.5-2-9.6-3-13.7 3-4.1 6-16 20.1-19.6 24.1-3.6 4-7.2 4.5-13.2 1.5-6-3-25.4-9.4-48.4-30-17.9-16-30-35.8-33.5-41.7-3.6-6-.4-9.2 2.6-12.2 2.7-2.7 6-7 9-10.5 3-3.5 4-6 6-10 2-4 1-7.5-.5-10.5-1.5-3-13.7-33-18.8-45.2-5-12.2-10.1-10.5-13.8-10.7-3.6-.2-7.7-.2-11.7-.2-4.1 0-10.7 1.5-16.3 7.5-5.7 6-21.6 21.1-21.6 51.5s22.1 59.7 25.1 63.7c3 4 43.5 66.4 105.4 93 14.7 6.3 26.2 10.1 35.1 12.9 14.8 4.7 28.2 4 38.9 2.4 11.9-1.8 35.6-14.5 40.6-28.5 5-14 5-26 3.5-28.5-1.5-2.5-5.5-4-11.5-7z"/>
        </svg>
        <span className="absolute right-full mr-3 bg-slate-900 text-white font-sans font-bold text-[10px] px-2.5 py-1.5 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none shadow-md border border-slate-750">
          Connect on WhatsApp
        </span>
      </a>

    </div>
  );
}
