import React, { useState, useEffect } from 'react';
import { Property, Inquiry } from '../types';
import { BUILDER_BIO } from '../data';
import { 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Sparkles, 
  Plus, 
  LogOut, 
  Search, 
  X, 
  Activity, 
  TrendingUp, 
  Briefcase, 
  Edit3, 
  Save, 
  Compass, 
  Globe,
  MessageSquare,
  Lock,
  ArrowLeft,
  DollarSign,
  TreePine
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SecretAdminPageProps {
  properties: Property[];
  setProperties: React.Dispatch<React.SetStateAction<Property[]>>;
  inquiries: Inquiry[];
  setInquiries: React.Dispatch<React.SetStateAction<Inquiry[]>>;
  onClose: () => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function SecretAdminPage({
  properties,
  setProperties,
  inquiries,
  setInquiries,
  onClose,
  isAdminLoggedIn,
  setIsAdminLoggedIn
}: SecretAdminPageProps) {
  // Tabs: 'overview' | 'inquiries' | 'properties' | 'add'
  const [activeTab, setActiveTab] = useState<'overview' | 'inquiries' | 'properties' | 'add'>('overview');

  // Login credentials state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Search & Filter state for Inquiries
  const [inquirySearch, setInquirySearch] = useState('');
  const [inquiryStatusFilter, setInquiryStatusFilter] = useState<string>('all');

  // Search & Filter state for Properties
  const [propertySearch, setPropertySearch] = useState('');
  const [propertyTypeFilter, setPropertyTypeFilter] = useState<string>('all');

  // Editing Property State
  const [editingPropertyId, setEditingPropertyId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Property>>({});

  // Safety confirmation states for non-blocking deletes
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteInquiryId, setConfirmDeleteInquiryId] = useState<string | null>(null);

  // Adding Property State (Mirror layout of standard portfolio creator)
  const [newProp, setNewProp] = useState({
    title: '',
    tagline: '',
    type: 'resort' as Property['type'],
    location: '',
    subLocation: '',
    priceText: '',
    basePrice: 1500000,
    unitLabel: 'cent' as 'cent' | 'sqft',
    description: '',
    features: '',
    image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
    developmentStatus: 'Approved' as Property['developmentStatus'],
    installmentsAvailable: true,
  });

  const PRESET_IMAGES = [
    { name: 'Luxury Cabin', url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800' },
    { name: 'Modern Villa', url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800' },
    { name: 'Pristine Plot', url: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=800' },
    { name: 'Sandalwood Estate', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=800' },
    { name: 'Aesthetic Dwelling', url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800' }
  ];

  // Auto-authenticate if credentials matching
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'Admin' && password === 'Admin@123') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('property_world_admin_auth', 'true');
      setLoginError('');
    } else {
      setLoginError('Invalid credentials. Double check password rules.');
    }
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('property_world_admin_auth');
  };

  // Change Inquiry Status
  const handleUpdateInquiryStatus = (id: string, newStatus: Inquiry['status']) => {
    setInquiries(prev => 
      prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq)
    );
  };

  // Delete Inquiry
  const handleDeleteInquiry = (id: string) => {
    if (confirmDeleteInquiryId === id) {
      setInquiries(prev => prev.filter(inq => inq.id !== id));
      setConfirmDeleteInquiryId(null);
    } else {
      setConfirmDeleteInquiryId(id);
      setTimeout(() => setConfirmDeleteInquiryId(null), 4000);
    }
  };

  // Delete Property
  const handleDeleteProperty = (id: string) => {
    if (confirmDeleteId === id) {
      setProperties(prev => prev.filter(p => p.id !== id));
      setConfirmDeleteId(null);
    } else {
      setConfirmDeleteId(id);
      setTimeout(() => setConfirmDeleteId(null), 4000);
    }
  };

  // Edit property handlers
  const startEditing = (p: Property) => {
    setEditingPropertyId(p.id);
    setEditForm({ ...p });
  };

  const savePropertyEdit = () => {
    if (!editForm.title || !editForm.id) return;
    setProperties(prev => 
      prev.map(p => p.id === editForm.id ? { ...p, ...editForm } as Property : p)
    );
    setEditingPropertyId(null);
    setEditForm({});
  };

  // Adding new property
  const handleCreateProperty = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProp.title || !newProp.location || !newProp.priceText) return;

    const added: Property = {
      id: `prop-${Date.now()}`,
      title: newProp.title,
      tagline: newProp.tagline || 'Exquisite Estate Layout',
      type: newProp.type,
      location: newProp.location,
      subLocation: newProp.subLocation || 'Premium Suburb',
      priceText: newProp.priceText,
      basePrice: newProp.basePrice,
      basePricePerUnit: Math.round(newProp.basePrice / 10),
      unitLabel: newProp.unitLabel,
      sizeText: newProp.unitLabel === 'cent' ? '12.5 - 50 Cents Layout' : '1,200 - 4,000 Sqft',
      sizesAvailable: newProp.unitLabel === 'cent' ? [5445, 10890, 21780] : [1200, 2400, 4000],
      description: newProp.description || 'Pristine agricultural layouts beautifully procured and validated.',
      longDescription: newProp.description || 'Beautiful estate property offered by Property World with clean titles.',
      features: newProp.features ? newProp.features.split(',').map(f => f.trim()) : ['Clear Title', 'Paved Roads', 'Water Supply'],
      image: newProp.image,
      contactNumbers: BUILDER_BIO.phones,
      installmentsAvailable: newProp.installmentsAvailable,
      developmentStatus: newProp.developmentStatus,
    };

    setProperties(prev => [added, ...prev]);
    
    // Reset additions form fields
    setNewProp({
      title: '',
      tagline: '',
      type: 'resort',
      location: '',
      subLocation: '',
      priceText: '',
      basePrice: 1500000,
      unitLabel: 'cent',
      description: '',
      features: '',
      image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800',
      developmentStatus: 'Approved',
      installmentsAvailable: true,
    });

    setActiveTab('properties');
  };

  // Filter inquiry records
  const filteredInquiries = inquiries.filter(inq => {
    const matchesSearch = 
      inq.userName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.propertyName.toLowerCase().includes(inquirySearch.toLowerCase()) ||
      inq.userPhone.includes(inquirySearch) ||
      (inq.message || '').toLowerCase().includes(inquirySearch.toLowerCase());
      
    const matchesStatus = inquiryStatusFilter === 'all' || inq.status === inquiryStatusFilter;
    
    return matchesSearch && matchesStatus;
  });

  // Filter property records
  const filteredProperties = properties.filter(p => {
    const matchesSearch = 
      p.title.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.location.toLowerCase().includes(propertySearch.toLowerCase()) ||
      p.subLocation.toLowerCase().includes(propertySearch.toLowerCase());
      
    const matchesType = propertyTypeFilter === 'all' || p.type === propertyTypeFilter;
    
    return matchesSearch && matchesType;
  });

  // Business statistics calculators
  const totalValuation = properties.reduce((acc, p) => acc + p.basePrice, 0);
  const hotCategory = properties.reduce((acc, curr) => {
    acc[curr.type] = (acc[curr.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const mostListedType = Object.keys(hotCategory).reduce((a, b) => hotCategory[a] > hotCategory[b] ? a : b, 'resort');

  // Trigger file uploader inside admin panel
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) {
          setNewProp(prev => ({ ...prev, image: ev.target!.result as string }));
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans relative overflow-x-hidden antialiased">
      
      {/* Background neon orbs mimicking professional dark command panel */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/10 blur-[130px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-teal-500/10 blur-[120px] pointer-events-none"></div>

      {/* LOGIN CARD IF NOT AUTHENTICATED */}
      {!isAdminLoggedIn ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          
          <motion.div 
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md bg-slate-950/80 border border-slate-800 rounded-3xl p-8 shadow-2xl relative backdrop-blur-md"
          >
            {/* Top glass lighting tab */}
            <div className="absolute top-0 inset-x-0 h-[2.5px] bg-gradient-to-r from-emerald-500 to-teal-500"></div>

            <div className="flex flex-col items-center text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/10 mb-4 text-slate-950">
                <Lock className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase font-sans">
                Property World Admin
              </h2>
              <p className="text-xs text-slate-400 font-mono tracking-widest mt-1 font-bold uppercase">
                Secure Administrative Gateway
              </p>
            </div>

            <form onSubmit={handleLoginSubmit} className="space-y-5">
              {loginError && (
                <div className="p-3.5 bg-rose-950/40 border border-rose-800/40 rounded-xl text-xs text-rose-350 font-bold font-mono">
                  ⚠️ {loginError}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Administrative Username
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter Username"
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-xs font-semibold text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  Secure Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input 
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-900/90 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded-xl py-2.5 pl-11 pr-4 text-xs text-white placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-4 py-3.5 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-98 transition-all cursor-pointer mt-2"
              >
                Authenticate & Access Desk
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-900 text-center space-y-3.5">
              <button 
                type="button"
                onClick={onClose}
                className="text-xs text-slate-500 hover:text-slate-300 transition-colors inline-flex items-center space-x-1 font-bold underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Return to Public Website</span>
              </button>
            </div>

          </motion.div>
        </div>
      ) : (
        
        /* AUTHENTICATED SECRET ADMINISTRATIVE COMMAND workspace */
        <div className="flex-1 flex flex-col md:flex-row relative z-10 w-full max-w-7xl mx-auto px-4 py-6 gap-6">
          
          {/* LEFT COMMAND SIDEBAR */}
          <aside className="w-full md:w-64 bg-slate-950/60 border border-slate-800/80 rounded-3xl p-5 flex flex-col justify-between backdrop-blur-md shrink-0 h-fit md:sticky top-4">
            <div className="space-y-6">
              
              {/* Profile card */}
              <div className="flex items-center space-x-3 pb-5 border-b border-slate-900">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-slate-950 font-bold relative">
                  👑
                  <span className="absolute bottom-[-2px] right-[-2px] w-3 h-3 bg-green-500 rounded-full border-2 border-slate-950"></span>
                </div>
                <div className="min-w-0">
                  <span className="block text-xs font-black text-white uppercase tracking-tight truncate">Rajan M (Director)</span>
                  <span className="block text-[9px] font-mono text-emerald-400 font-bold uppercase tracking-widest">Office Chief Admin</span>
                </div>
              </div>

              {/* Navigation Menu Links */}
              <div className="space-y-1.5">
                <span className="block text-[8px] font-mono text-slate-500 uppercase tracking-widest px-3 font-bold">DESK SECTIONS</span>
                <button
                  onClick={() => setActiveTab('overview')}
                  className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-3 transition-all ${
                    activeTab === 'overview' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>Overview & KPI</span>
                </button>
                <button
                  onClick={() => setActiveTab('inquiries')}
                  className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-between transition-all ${
                    activeTab === 'inquiries' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="w-4 h-4" />
                    <span>Inquiries / Leads</span>
                  </div>
                  {inquiries.length > 0 && (
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black ${
                      activeTab === 'inquiries' ? 'bg-slate-950 text-emerald-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {inquiries.length}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => setActiveTab('properties')}
                  className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-3 transition-all ${
                    activeTab === 'properties' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Briefcase className="w-4 h-4" />
                  <span>Property Catalogue</span>
                </button>
                <button
                  onClick={() => setActiveTab('add')}
                  className={`w-full text-left px-4.5 py-3 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center space-x-3 transition-all ${
                    activeTab === 'add' ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  <span>Publish Estate</span>
                </button>
              </div>

            </div>

            <div className="pt-6 border-t border-slate-900 mt-6 space-y-3">
              <button
                onClick={onClose}
                className="w-full text-center py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 rounded-xl text-[10px] font-mono uppercase tracking-widest font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Exit Workspace</span>
              </button>
              <button
                onClick={handleLogout}
                className="w-full text-center py-2 bg-rose-950/20 hover:bg-rose-950/40 text-rose-450 border border-rose-900/30 rounded-xl text-[10px] font-mono uppercase tracking-widest font-black flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>

          </aside>

          {/* MAIN DESK WORKSPACE PANEL */}
          <main className="flex-1 bg-slate-950/40 border border-slate-800/80 rounded-3xl p-6 md:p-8 backdrop-blur-md relative min-w-0">
            
            {/* 1. OVERVIEW & KPI TAB */}
            {activeTab === 'overview' && (
              <div className="space-y-8 animate-fade-in">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-900">
                  <div>
                    <h2 className="text-2xl font-black text-white font-sans uppercase">Administrative Overview</h2>
                    <p className="text-xs text-slate-400">Total metrics and dynamic performance indicators across Property World catalog.</p>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/20 px-3.5 py-1.5 rounded-xl text-xs font-mono text-emerald-400 flex items-center space-x-2 font-bold">
                    <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
                    <span>Synchronized with Local Storage</span>
                  </div>
                </div>

                {/* KPI stats blocks */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-450 font-bold mb-2">Total Managed Valuation</span>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-2xl font-sans font-black text-emerald-400">₹{(totalValuation / 10000000).toFixed(2)}Cr</span>
                    </div>
                    <span className="block text-[8px] text-slate-500 mt-1">Based on base rate calculations</span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-455 font-bold mb-2">Total Inquiries Logged</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-sans font-black text-amber-400">{inquiries.length}</span>
                      <span className="text-[10px] text-slate-400">submissions</span>
                    </div>
                    <span className="block text-[8px] text-green-400 mt-1">100% responsive rate</span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-455 font-bold mb-2">Listed Communities</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-sans font-black text-white">{properties.length}</span>
                      <span className="text-[10px] text-slate-400">outcomes</span>
                    </div>
                    <span className="block text-[8px] text-slate-500 mt-1">Live in client layouts</span>
                  </div>

                  <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
                    <span className="block text-[9px] font-mono uppercase tracking-wider text-slate-455 font-bold mb-2">Hot Category Sector</span>
                    <div className="flex items-baseline space-x-1">
                      <span className="text-2xl font-sans font-black text-rose-450 uppercase truncate">{mostListedType}s</span>
                    </div>
                    <span className="block text-[8px] text-slate-500 mt-1">Highest frequency of posting</span>
                  </div>

                </div>

                {/* Grid for Recent Inquests & System State */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                  
                  {/* Left block - recent leads */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">Latest Incoming Inquiries</span>
                      <button onClick={() => setActiveTab('inquiries')} className="text-[10px] text-emerald-400 hover:underline hover:text-emerald-300 font-mono font-bold">Manage All ↗</button>
                    </div>

                    <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
                      {inquiries.length === 0 ? (
                        <div className="text-center py-10">
                          <p className="text-xs text-slate-500 italic">No inquiries registered in database yet.</p>
                        </div>
                      ) : (
                        inquiries.slice(0, 4).map(inq => (
                          <div key={inq.id} className="p-3.5 bg-slate-950/80 rounded-xl border border-slate-800/80 flex items-center justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <span className="block text-xs font-sans font-bold text-white truncate">{inq.userName}</span>
                              <span className="block text-[9px] text-slate-400 truncate">Interested: {inq.propertyName}</span>
                              <span className="text-[8.5px] font-mono text-slate-550 block mt-1">Contact: {inq.userPhone}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8.5px] font-mono font-bold ${
                              inq.status === 'Received' ? 'bg-blue-500/10 text-blue-400' :
                              inq.status === 'Scheduled' ? 'bg-amber-500/10 text-amber-400' : 'bg-emerald-500/10 text-emerald-400'
                            }`}>
                              {inq.status}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Right block - state details */}
                  <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <span className="text-xs font-mono uppercase tracking-wider text-white font-bold">Director Guidelines</span>
                      <span className="text-[9px] font-mono text-emerald-500 font-bold">AUTHORIZED DEEDS</span>
                    </div>

                    <div className="space-y-3.5 font-mono text-[10.5px] text-slate-350 leading-relaxed">
                      <p>
                        🔍 <strong className="text-white">CLEAR TITLE AUDITING:</strong> Cross-check standard Gram Panchayat clearances before changing land listings to "Ready to Construct".
                      </p>
                      <p>
                        📅 <strong className="text-white">CRM TASKING:</strong> Keep contact details updated on local disk. Call clients directly using direct mobile links to establish physical tour slots.
                      </p>
                      <p>
                        💎 <strong className="text-white">PREMIUM PLOTS:</strong> Add proper acreage and cent valuation rates. EnsureSandwood/Rosewood planting lists are clear.
                      </p>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. LEADS/INQUIRIES MANAGER */}
            {activeTab === 'inquiries' && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-900">
                  <div>
                    <h2 className="text-2xl font-black text-white font-sans uppercase">Leads & Inquiries Desk</h2>
                    <p className="text-xs text-slate-400 mb-1">Process customer submissions, book visits, and manage relationship states.</p>
                  </div>
                  
                  {/* Search bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search inquiries..."
                      value={inquirySearch}
                      onChange={(e) => setInquirySearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white placeholder:text-slate-650"
                    />
                  </div>
                </div>

                {/* Filter and reset options */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest mr-1 font-bold">Category state:</span>
                  {['all', 'Received', 'Scheduled', 'Followed Up'].map(st => (
                    <button
                      key={st}
                      onClick={() => setInquiryStatusFilter(st)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        inquiryStatusFilter === st 
                          ? 'bg-emerald-500 text-slate-950 font-black shadow-sm' 
                          : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                {/* Inquiries List */}
                <div className="space-y-4">
                  {filteredInquiries.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/20 border border-slate-850/80 rounded-2xl">
                      <p className="text-xs text-slate-500 italic">No inquiry records found matching search queries.</p>
                    </div>
                  ) : (
                    filteredInquiries.map(inq => (
                      <div 
                        key={inq.id}
                        className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-5 hover:border-slate-700 transition-colors space-y-4 relative overflow-hidden"
                      >
                        {/* Glow indicator based on status */}
                        <div className={`absolute top-0 left-0 w-1.5 h-full ${
                          inq.status === 'Received' ? 'bg-blue-500' :
                          inq.status === 'Scheduled' ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}></div>

                        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                          
                          {/* Client Info Grid */}
                          <div className="space-y-1.5 pl-2">
                            <div className="flex items-center space-x-2.5">
                              <span className="text-sm font-sans font-black text-white">{inq.userName}</span>
                              <span className="text-[9px] font-mono text-slate-500">[{new Date(inq.timestamp).toLocaleString()}]</span>
                            </div>
                            
                            {/* Tags for location preferences */}
                            <div className="flex flex-col sm:flex-row gap-1 sm:gap-4 text-[10.5px] text-slate-350">
                              <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-emerald-500" /> +91 {inq.userPhone}</span>
                              {inq.userEmail && <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-emerald-500" /> {inq.userEmail}</span>}
                            </div>
                          </div>

                          {/* Controls Row */}
                          <div className="flex items-center space-x-2 self-start sm:self-center">
                            
                            <span className="text-[10px] font-mono text-slate-500 mr-1.5 font-bold">STATE:</span>
                            <div className="flex bg-slate-950 border border-slate-850 rounded-xl p-0.5">
                              {(['Received', 'Scheduled', 'Followed Up'] as const).map(opt => (
                                <button
                                  key={opt}
                                  onClick={() => handleUpdateInquiryStatus(inq.id, opt)}
                                  className={`px-2.5 py-1 rounded-lg text-[9px] font-mono font-black uppercase transition-all cursor-pointer ${
                                    inq.status === opt 
                                      ? opt === 'Received' ? 'bg-blue-600 text-white' : opt === 'Scheduled' ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                                      : 'text-slate-500 hover:text-slate-300'
                                  }`}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>

                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                                confirmDeleteInquiryId === inq.id
                                  ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                                  : 'bg-rose-950/20 text-rose-450 border-rose-900/30 hover:bg-rose-600 hover:text-white'
                              }`}
                              title={confirmDeleteInquiryId === inq.id ? "Click again to confirm immediate deletion!" : "Delete enquiry permanent"}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                              {confirmDeleteInquiryId === inq.id && <span>Confirm?</span>}
                            </button>
                          </div>

                        </div>

                        {/* Inquiry Description Card */}
                        <div className="bg-slate-950/70 border border-slate-900 rounded-xl p-4 space-y-2">
                          <span className="block text-[10px] font-mono text-emerald-400 font-extrabold uppercase tracking-wide flex items-center gap-1.5 border-b border-slate-900 pb-1.5 mb-1.5">
                            <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></span>
                            <span>Requested Property / Segment: {inq.propertyName}</span>
                          </span>
                          
                          <p className="text-xs text-slate-300 leading-normal font-sans whitespace-pre-line">
                            {inq.message}
                          </p>
                        </div>

                        {/* Direct CRM Communications Action Row */}
                        <div className="flex items-center gap-2 pl-2">
                          <a 
                            href={`tel:${inq.userPhone}`}
                            className="inline-flex items-center space-x-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-350 hover:text-white px-3.5 py-1.5 rounded-xl text-[10px] font-bold tracking-wide transition-all"
                          >
                            <Phone className="w-3 h-3 text-emerald-500" />
                            <span>Call Client</span>
                          </a>
                          <a 
                            href={`https://wa.me/91${inq.userPhone}?text=Hello%20${encodeURIComponent(inq.userName)}%2C%20this%20is%20the%20Property%20World%20Customer%20Support%20service.%20We%20received%20your%20investment%20survey%20and%20would%20like%20to%20discuss%20further.`}
                            target="_blank"
                            rel="noreferrer noopener"
                            className="inline-flex items-center space-x-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/40 text-slate-350 hover:text-white px-3.5 py-1.5 rounded-xl text-[10px] font-bold tracking-wide transition-all"
                          >
                            <MessageSquare className="w-3 h-3 text-emerald-500" />
                            <span>Write WhatsApp</span>
                          </a>
                        </div>

                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* 3. PROPERTY CATALOGUE MANAGER */}
            {activeTab === 'properties' && (
              <div className="space-y-6 animate-fade-in">
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-900">
                  <div>
                    <h2 className="text-2xl font-black text-white font-sans uppercase">Portfolio & Estate Catalog</h2>
                    <p className="text-xs text-slate-400">Edit, modify, or delete current client-side land offerings instantly.</p>
                  </div>
                  
                  {/* Search bar */}
                  <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-2.5 w-3.5 h-3.5 text-slate-500" />
                    <input 
                      type="text"
                      placeholder="Search by title, location..."
                      value={propertySearch}
                      onChange={(e) => setPropertySearch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 focus:border-emerald-500 focus:outline-none rounded-xl py-2 pl-9 pr-4 text-xs font-semibold text-white placeholder:text-slate-650"
                    />
                  </div>
                </div>

                {/* Filter list */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-550 uppercase tracking-widest mr-1 font-bold">Category filtering:</span>
                  {['all', 'resort', 'farmhouse', 'site', 'apartment', 'villa', 'commercial', 'industrial'].map(cat => (
                    <button
                      key={cat}
                      onClick={() => setPropertyTypeFilter(cat)}
                      className={`px-3 py-1 rounded-lg text-[10px] font-mono font-bold uppercase transition-all cursor-pointer ${
                        propertyTypeFilter === cat ? 'bg-emerald-500 text-slate-950 font-black shadow-sm' : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-850'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Catalog Listing List/Grid */}
                <div className="space-y-4">
                  {filteredProperties.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/20 border border-slate-850/80 rounded-2xl">
                      <p className="text-xs text-slate-500 italic">No land property listed matching filter rules.</p>
                    </div>
                  ) : (
                    filteredProperties.map(prop => (
                      <div 
                        key={prop.id}
                        className="bg-slate-900/50 border border-slate-800/80 hover:border-slate-700 p-4 rounded-2xl transition-all"
                      >
                        {editingPropertyId === prop.id ? (
                          
                          /* IN-LINE PROPERTY EDITOR LAYOUT */
                          <div className="space-y-4 animate-fade-in">
                            <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                              <span className="text-xs font-mono font-bold text-emerald-400 uppercase">🖊️ Edit Property Listing Data</span>
                              <div className="flex space-x-1.5">
                                <button 
                                  onClick={savePropertyEdit}
                                  className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1"
                                >
                                  <Save className="w-3.5 h-3.5" />
                                  <span>Save Changes</span>
                                </button>
                                <button 
                                  onClick={() => setEditingPropertyId(null)}
                                  className="px-3 px-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-[10px] font-mono uppercase transition-all cursor-pointer"
                                >
                                  Cancel ✕
                                </button>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div>
                                <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-1">Title</label>
                                <input 
                                  type="text"
                                  value={editForm.title || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-1">Tagline</label>
                                <input 
                                  type="text"
                                  value={editForm.tagline || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, tagline: e.target.value }))}
                                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-1">Classification Status</label>
                                <select 
                                  value={editForm.developmentStatus || 'Approved'}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, developmentStatus: e.target.value as any }))}
                                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                >
                                  <option value="Approved">Approved / KHATA</option>
                                  <option value="Ready to Construct">Ready to Construct</option>
                                  <option value="Proposed">Proposed</option>
                                  <option value="Completed">Completed</option>
                                </select>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                              <div>
                                <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-1">Location District</label>
                                <input 
                                  type="text"
                                  value={editForm.location || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-1">Sublocation Layout</label>
                                <input 
                                  type="text"
                                  value={editForm.subLocation || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, subLocation: e.target.value }))}
                                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-1">Price Label</label>
                                <input 
                                  type="text"
                                  value={editForm.priceText || ''}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, priceText: e.target.value }))}
                                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                />
                              </div>
                              <div>
                                <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-1">Base Price Numeric (₹)</label>
                                <input 
                                  type="number"
                                  value={editForm.basePrice || 0}
                                  onChange={(e) => setEditForm(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                                  className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-xs font-semibold text-white"
                                />
                              </div>
                            </div>

                            <div>
                              <label className="block text-[9.5px] font-mono font-bold text-slate-400 uppercase mb-1">Infrastructure Description</label>
                              <textarea 
                                value={editForm.description || ''}
                                onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                                rows={2}
                                className="w-full bg-slate-950 border border-slate-800 focus:outline-none focus:border-emerald-500 rounded-xl p-3 text-xs font-medium text-white resize-none"
                              />
                            </div>

                          </div>
                        ) : (
                          
                          /* REGULAR CATALOG CARD LISTING */
                          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                            
                            <div className="flex items-center space-x-4 min-w-0 flex-1">
                              <img 
                                src={prop.image} 
                                alt={prop.title} 
                                className="w-16 h-16 rounded-xl object-contain border border-slate-800 bg-slate-950 shrink-0" 
                              />
                              <div className="min-w-0">
                                <span className="block text-sm font-black text-white hover:text-emerald-400 transition-colors truncate">{prop.title}</span>
                                <span className="block text-xs text-slate-400 truncate">{prop.location} — {prop.subLocation}</span>
                                <p className="text-[10.5px] font-mono font-bold text-emerald-400 mt-1">{prop.priceText} <span className="text-[9px] text-slate-600 font-normal">| {prop.developmentStatus}</span></p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-2 shrink-0 self-end sm:self-center">
                              <button
                                onClick={() => startEditing(prop)}
                                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded-xl text-[10px] font-mono font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>Modify</span>
                              </button>
                              <button
                                onClick={() => handleDeleteProperty(prop.id)}
                                className={`px-2.5 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1 font-mono text-[10px] font-bold uppercase tracking-wider ${
                                  confirmDeleteId === prop.id
                                    ? 'bg-rose-600 border-rose-500 text-white animate-pulse'
                                    : 'bg-rose-950/20 text-rose-450 border-rose-900/30 hover:bg-rose-600 hover:text-white'
                                }`}
                                title={confirmDeleteId === prop.id ? "Click again to confirm immediate deletion!" : "Delete entire property permanent"}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                                {confirmDeleteId === prop.id && <span>Confirm?</span>}
                              </button>
                            </div>

                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

            {/* 4. PUBLISHING FORM TAB */}
            {activeTab === 'add' && (
              <div className="space-y-6 animate-fade-in font-sans">
                
                <div className="pb-4 border-b border-slate-900">
                  <h2 className="text-2xl font-black text-white font-sans uppercase">Publish Layout / Estate</h2>
                  <p className="text-xs text-slate-400">Introduce a brand new residential tract or apartment listing coordinates into active catalogs.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                  
                  {/* Left Column: Form Controls */}
                  <div className="lg:col-span-7 xl:col-span-8">
                    <form onSubmit={handleCreateProperty} className="space-y-5">
                      
                      {/* Row 1 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Estate/Plot Title</label>
                          <input 
                            type="text" 
                            required
                            value={newProp.title}
                            onChange={(e) => setNewProp(prev => ({ ...prev, title: e.target.value }))}
                            placeholder="e.g., Whitefield Gated Meadows"
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-650"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Selling Tagline</label>
                          <input 
                            type="text" 
                            value={newProp.tagline}
                            onChange={(e) => setNewProp(prev => ({ ...prev, tagline: e.target.value }))}
                            placeholder="e.g., Premium plots with custom orchards"
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-650"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Property Category</label>
                          <select 
                            value={newProp.type}
                            onChange={(e) => setNewProp(prev => ({ ...prev, type: e.target.value as any }))}
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="resort">Resort Plot</option>
                            <option value="farmhouse">Farmhouse Estate</option>
                            <option value="site">BIAAPA Approved Site</option>
                            <option value="apartment">Apartment</option>
                            <option value="villa">Luxury Villa</option>
                            <option value="commercial">Commercial Land</option>
                            <option value="industrial">Industrial Plot</option>
                          </select>
                        </div>
                      </div>

                      {/* Row 2 */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">District / Region</label>
                          <input 
                            type="text" 
                            required
                            value={newProp.location}
                            onChange={(e) => setNewProp(prev => ({ ...prev, location: e.target.value }))}
                            placeholder="e.g., Devanahalli, Bangalore"
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-650"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Layout Sublocality</label>
                          <input 
                            type="text" 
                            value={newProp.subLocation}
                            onChange={(e) => setNewProp(prev => ({ ...prev, subLocation: e.target.value }))}
                            placeholder="e.g., Sector 12B Near Highway Gate"
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-650"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Display Pricing Rate</label>
                          <input 
                            type="text" 
                            required
                            value={newProp.priceText}
                            onChange={(e) => setNewProp(prev => ({ ...prev, priceText: e.target.value }))}
                            placeholder="e.g., ₹1.8 Lakhs / cent onwards"
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-650"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Numeric Base Value (INR)</label>
                          <input 
                            type="number" 
                            required
                            value={newProp.basePrice}
                            onChange={(e) => setNewProp(prev => ({ ...prev, basePrice: Number(e.target.value) }))}
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                          />
                        </div>
                      </div>

                      {/* Row 3 */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5 font-bold">Acreage Features (Comma Separated)</label>
                          <textarea 
                            value={newProp.features}
                            onChange={(e) => setNewProp(prev => ({ ...prev, features: e.target.value }))}
                            rows={2}
                            placeholder="e.g., Individual Boundary Stones, 40ft Metalled Roads, Sandalwood Crop"
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl p-3 text-xs text-white resize-none placeholder:text-slate-650"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5 font-bold">Tract Description</label>
                          <textarea 
                            value={newProp.description}
                            onChange={(e) => setNewProp(prev => ({ ...prev, description: e.target.value }))}
                            rows={2}
                            placeholder="Provide details about structural legal clearances, local road connectivity, available parks etc..."
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl p-3 text-xs text-white resize-none placeholder:text-slate-650"
                          />
                        </div>
                      </div>

                      {/* Image picker details */}
                      <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl space-y-4">
                        <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase">
                          Select or Image URL
                        </label>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Presets */}
                          <div className="flex flex-wrap gap-2">
                            {PRESET_IMAGES.map(item => (
                              <button
                                type="button"
                                key={item.name}
                                onClick={() => setNewProp(prev => ({ ...prev, image: item.url }))}
                                className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all font-bold cursor-pointer ${
                                  newProp.image === item.url ? 'bg-emerald-500 border-emerald-600 text-slate-950' : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                                }`}
                              >
                                {item.name}
                              </button>
                            ))}
                          </div>

                          {/* File uploader trigger */}
                          <label className="flex items-center justify-center border border-dashed border-slate-800 hover:border-emerald-500/55 rounded-xl cursor-pointer p-2.5 transition-all text-slate-400 hover:bg-slate-950/40 select-none">
                            <span className="text-[11px] font-sans font-extrabold uppercase mr-2 flex items-center gap-1">📁 Upload Custom Image</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={handleImageFileChange}
                              className="hidden" 
                            />
                          </label>
                        </div>

                        <input 
                          type="text" 
                          value={newProp.image}
                          onChange={(e) => setNewProp(prev => ({ ...prev, image: e.target.value }))}
                          placeholder="Paste direct visual URL link..."
                          className="w-full bg-slate-950 border border-slate-850 focus:outline-none focus:border-emerald-500 rounded-xl px-3 py-2 text-[10px] font-mono text-slate-400"
                        />
                      </div>

                      {/* Row 4 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pb-2">
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Measurement Unit</label>
                          <select 
                            value={newProp.unitLabel}
                            onChange={(e) => setNewProp(prev => ({ ...prev, unitLabel: e.target.value as any }))}
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="cent">Cents (Agricultural plots)</option>
                            <option value="sqft">Square Feet (Standard Layout)</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-mono font-bold text-slate-400 uppercase mb-1.5">Khata/Building Status</label>
                          <select 
                            value={newProp.developmentStatus}
                            onChange={(e) => setNewProp(prev => ({ ...prev, developmentStatus: e.target.value as any }))}
                            className="w-full bg-slate-900/80 border border-slate-850 focus:border-emerald-500 focus:outline-none rounded-xl px-3 py-2 text-xs text-white"
                          >
                            <option value="Approved">KHATA Approved</option>
                            <option value="Ready to Construct">Ready to Construct</option>
                            <option value="Proposed">Proposed</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                        <div className="flex items-center pt-6">
                          <input 
                            type="checkbox"
                            id="installOk"
                            checked={newProp.installmentsAvailable}
                            onChange={(e) => setNewProp(prev => ({ ...prev, installmentsAvailable: e.target.checked }))}
                            className="w-4 h-4 text-emerald-600 border-slate-800 rounded focus:ring-emerald-500 accent-emerald-500 mr-2.5"
                          />
                          <label htmlFor="installOk" className="text-xs font-bold text-slate-400 select-none cursor-pointer">
                            Installments Scheme Available
                          </label>
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-500/10 active:scale-98 transition-all cursor-pointer"
                        >
                          🚀 Publish to Active Catalog
                        </button>
                      </div>

                    </form>
                  </div>

                  {/* Right Column: Live User-View Preview */}
                  <div className="lg:col-span-5 xl:col-span-4 space-y-4">
                    <div className="sticky top-6">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-850 mb-4">
                        <span className="text-[10px] font-mono font-black text-emerald-400 uppercase tracking-widest flex items-center gap-1.5">
                          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></span>
                          Live User-View Preview
                        </span>
                        <span className="text-[9px] font-mono text-slate-500 uppercase font-bold tracking-wider">[Interactive]</span>
                      </div>

                      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 overflow-hidden shadow-2xl flex flex-col hover:border-emerald-500/30 transition-all duration-300 text-slate-800">
                        {/* Image Container */}
                        <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/80 to-transparent z-10"></div>
                          {newProp.image ? (
                            <img
                              src={newProp.image}
                              alt={newProp.title || 'Property Preview'}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=800';
                              }}
                            />
                          ) : (
                            <div className="w-full h-full bg-slate-900 flex items-center justify-center text-slate-550 text-xs font-mono">
                              No image selected
                            </div>
                          )}

                          {/* Floating Badges */}
                          <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono uppercase tracking-widest border font-bold bg-white/95 text-slate-850 border-slate-200 shadow-sm">
                              {newProp.type === 'resort' ? 'Resort Plot' :
                               newProp.type === 'farmhouse' ? 'Farm Estate' :
                               newProp.type === 'site' ? 'Approved Site' :
                               newProp.type === 'apartment' ? 'Apartment' :
                               newProp.type === 'villa' ? 'Luxury Villa' :
                               newProp.type === 'commercial' ? 'Commercial Land' :
                               newProp.type === 'industrial' ? 'Industrial Plot' : 'Property'}
                            </span>
                            {newProp.basePrice >= 3000000 && (
                              <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-2.5 py-0.5 rounded-lg text-[8px] font-mono font-bold uppercase tracking-widest border border-amber-300 shadow-sm w-fit">
                                👑 Premium Choice
                              </span>
                            )}
                          </div>

                          <div className="absolute top-3 right-3 z-20">
                            <span className="px-2 py-0.5 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest border bg-white/95 text-slate-850 border-slate-200 shadow-sm">
                              {newProp.developmentStatus}
                            </span>
                          </div>

                          {/* Bottom Location & Title */}
                          <div className="absolute bottom-3 left-3 right-3 z-20">
                            <p className="text-[9px] font-mono text-emerald-400 tracking-wider uppercase mb-0.5 flex items-center gap-1 font-bold">
                              <MapPin className="w-2.5 h-2.5 text-emerald-400" />
                              {newProp.location || <span className="italic text-slate-400">[Location Region]</span>}
                            </p>
                            <h3 className="text-white text-base font-sans font-bold leading-tight truncate">
                              {newProp.title || <span className="italic text-slate-350 bg-slate-900/40 px-1 rounded">[Property Title]</span>}
                            </h3>
                          </div>
                        </div>

                        {/* Details Body */}
                        <div className="p-4 flex-grow flex flex-col justify-between">
                          <div>
                            {/* Sublocation description */}
                            <p className="text-[11px] text-slate-500 italic mb-2.5 min-h-[16px] truncate font-medium">
                              {newProp.subLocation || <span className="text-slate-400/75">[Sublocality Layout Area]</span>}
                            </p>

                            {/* Price details banner */}
                            <div className="mb-3 bg-slate-50 border border-slate-150 rounded-xl px-3 py-2 flex items-center justify-between shadow-sm">
                              <div>
                                <span className="block text-[8px] font-mono tracking-widest text-emerald-700 uppercase font-black">
                                  Base Investment Rate
                                </span>
                                <span className="text-sm font-sans font-black text-slate-900">
                                  {newProp.priceText || <span className="italic text-slate-400 font-bold">₹Rate on request</span>}
                                </span>
                              </div>
                              {newProp.installmentsAvailable && (
                                <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                                  Installment OK
                                </span>
                              )}
                            </div>

                            {/* Description summary */}
                            <p className="text-[11px] text-slate-600 leading-normal font-sans mb-3.5 min-h-[36px] line-clamp-2">
                              {newProp.description || (
                                <span className="text-slate-450 italic">[Describe amenities, physical access clearances, boundaries, and plantation yields here...]</span>
                              )}
                            </p>

                            {/* Perimeter features bullets */}
                            <div className="mb-4">
                              <span className="block text-[9px] font-mono tracking-wider text-slate-400 uppercase mb-1.5 font-bold">
                                Premium Infrastructure Perks
                              </span>
                              <div className="grid grid-cols-1 gap-1">
                                {(newProp.features ? newProp.features.split(',').map(f => f.trim()).filter(Boolean) : ['Clear Title Certifications', 'Standard Electricity Feeder', 'Demarcation Boundaries Set']).slice(0, 3).map((feat, idx) => (
                                  <div key={idx} className="flex items-center space-x-1.5 text-[10px] text-slate-700 font-medium">
                                    <div className="rounded bg-emerald-50 p-0.5 border border-emerald-100 flex-shrink-0">
                                      <TreePine className="w-2.5 h-2.5 text-emerald-600" />
                                    </div>
                                    <span className="truncate">{feat}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="pt-3.5 border-t border-slate-100">
                            <button
                              type="button"
                              className="w-full flex items-center justify-center space-x-1.5 px-3 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-sm pointer-events-none"
                            >
                              <Clock className="w-3.5 h-3.5 text-slate-950 animate-pulse" />
                              <span>Book Site Tour (Preview Only)</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

          </main>

        </div>
      )}

    </div>
  );
}
