import React, { useState, useEffect } from 'react';
import { Inquiry, Property } from '../types';
import { BUILDER_BIO } from '../data';
import { 
  Building, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle, 
  Trash2, 
  Sparkles, 
  Send,
  UserCheck,
  FileText,
  Map,
  Compass,
  Heart,
  Globe
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InquiryDashboardProps {
  properties: Property[];
  savedInquiries: Inquiry[];
  onDeleteInquiry: (id: string) => void;
  onAddNewInquiry: (inquiry: Omit<Inquiry, 'id' | 'timestamp' | 'status'>) => void;
  preSelectedQuote?: {
    propertyId: string;
    propertyName: string;
    size: number;
    unit: string;
    totalPrice: number;
    downPayment: number;
    tenureMonths: number;
    monthlyInstallment: number;
  } | null;
  onClearQuote: () => void;
}

export default function InquiryDashboard({
  properties,
  savedInquiries,
  onDeleteInquiry,
  onAddNewInquiry,
  preSelectedQuote,
  onClearQuote,
}: InquiryDashboardProps) {
  // Survey state reflecting the handwriting form completely
  const [formData, setFormData] = useState({
    userName: '',
    userPhone: '',
    userEmail: '',
    userWhatsapp: '',
    preferredAreas: [] as string[],
    plotLandKinds: [] as string[],
    apartmentKinds: [] as string[],
    commercialKinds: [] as string[],
    industrialKinds: [] as string[],
    agriculturalKinds: [] as string[],
    requirements: '',
  });

  // Automatically integrate active quote calculations into requirements if selected
  useEffect(() => {
    if (preSelectedQuote) {
      setFormData((prev) => ({
        ...prev,
        requirements: `Applied smart quote calculations for ${preSelectedQuote.propertyName}:\n• Size: ${preSelectedQuote.size} ${preSelectedQuote.unit}\n• Total Price: INR ${preSelectedQuote.totalPrice.toLocaleString()}\n• Down Payment: INR ${preSelectedQuote.downPayment.toLocaleString()}\n• Tenure: ${preSelectedQuote.tenureMonths} Months\n• Monthly EMI Plan: INR ${preSelectedQuote.monthlyInstallment.toLocaleString()} per month.`,
      }));
    }
  }, [preSelectedQuote]);

  const [formSubmitted, setFormSubmitted] = useState(false);

  // Toggle values in array
  const handleToggleArea = (area: string) => {
    setFormData((prev) => {
      const preferredAreas = prev.preferredAreas.includes(area)
        ? prev.preferredAreas.filter((a) => a !== area)
        : [...prev.preferredAreas, area];
      return { ...prev, preferredAreas };
    });
  };

  const handleToggleKind = (category: 'plot' | 'apartment' | 'commercial' | 'industrial' | 'agricultural', item: string) => {
    setFormData((prev) => {
      let currentList: string[] = [];
      if (category === 'plot') currentList = prev.plotLandKinds;
      if (category === 'apartment') currentList = prev.apartmentKinds;
      if (category === 'commercial') currentList = prev.commercialKinds;
      if (category === 'industrial') currentList = prev.industrialKinds;
      if (category === 'agricultural') currentList = prev.agriculturalKinds;

      const updatedList = currentList.includes(item)
        ? currentList.filter((i) => i !== item)
        : [...currentList, item];

      return {
        ...prev,
        plotLandKinds: category === 'plot' ? updatedList : prev.plotLandKinds,
        apartmentKinds: category === 'apartment' ? updatedList : prev.apartmentKinds,
        commercialKinds: category === 'commercial' ? updatedList : prev.commercialKinds,
        industrialKinds: category === 'industrial' ? updatedList : prev.industrialKinds,
        agriculturalKinds: category === 'agricultural' ? updatedList : prev.agriculturalKinds,
      };
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.userName || !formData.userPhone) {
      alert('Please fill out your Name and Mobile / Contact Number to submit the survey.');
      return;
    }

    // Format a beautiful text overview of selected choices
    const hasAreas = formData.preferredAreas.length > 0;
    const hasPlot = formData.plotLandKinds.length > 0;
    const hasApartment = formData.apartmentKinds.length > 0;
    const hasComm = formData.commercialKinds.length > 0;
    const hasInd = formData.industrialKinds.length > 0;
    const hasAgri = formData.agriculturalKinds.length > 0;

    const propertyNameSummary = hasPlot 
      ? `Plot (${formData.plotLandKinds.join(', ')})` 
      : hasApartment 
      ? `Apartment (${formData.apartmentKinds.join(', ')})`
      : 'Gated Bangalore Land';

    // Add new inquiry to cache (under generic local dynamic list)
    onAddNewInquiry({
      userName: formData.userName,
      userEmail: formData.userEmail || 'client@propertyworld.in',
      userPhone: formData.userPhone,
      propertyId: 'survey-interest',
      propertyName: propertyNameSummary,
      visitDate: new Date().toISOString().split('T')[0],
      message: `Preferred Areas: ${formData.preferredAreas.join(', ') || 'Any Region'}. Requirements: ${formData.requirements}`,
    });

    setFormSubmitted(true);
    onClearQuote();

    // ----------------------------------------------------
    // BUILD DYNAMIC COMPACT WHATSAPP PRE-MESSAGE (AUTHENTIC SURVEY REDIRECT)
    // ----------------------------------------------------
    let msg = `*PROPERTY WORLD BANGALORE INVESTMENT SURVEY*\n`;
    msg += `-------------------------------------------\n`;
    msg += `👤 *CLIENT DETAILS*:\n`;
    msg += `• *Name*: ${formData.userName}\n`;
    msg += `• *Mobile*: ${formData.userPhone}\n`;
    if (formData.userEmail) msg += `• *E-mail*: ${formData.userEmail}\n`;
    if (formData.userWhatsapp) msg += `• *WhatsApp*: ${formData.userWhatsapp}\n\n`;

    msg += `📍 *PREFERRED INVESTMENT AREAS*:\n`;
    msg += `• ${hasAreas ? formData.preferredAreas.join(', ') : 'Any Sector / Place in Bangalore'}\n\n`;

    msg += `🏢 *DESIRED COMPREHENSIVE LAND / PROPERTY KINDS*:\n`;
    let itemsFound = false;

    if (hasPlot) {
      msg += `  • *Plot / Land*: ${formData.plotLandKinds.join(', ')}\n`;
      itemsFound = true;
    }
    if (hasApartment) {
      msg += `  • *Apartments*: ${formData.apartmentKinds.join(', ')}\n`;
      itemsFound = true;
    }
    if (hasComm) {
      msg += `  • *Commercial Option*: ${formData.commercialKinds.join(', ')}\n`;
      itemsFound = true;
    }
    if (hasInd) {
      msg += `  • *Industrial Option*: ${formData.industrialKinds.join(', ')}\n`;
      itemsFound = true;
    }
    if (hasAgri) {
      msg += `  • *Agricultural / Farm Land*: ${formData.agriculturalKinds.join(', ')}\n`;
      itemsFound = true;
    }
    if (!itemsFound) {
      msg += `  • *Not specified* (Open to all layout configurations)\n`;
    }
    msg += `\n`;

    if (formData.requirements.trim()) {
      msg += `📝 *ADDITIONAL LAID OUT REQUIREMENTS*:\n`;
      msg += `"${formData.requirements.trim()}"\n\n`;
    }

    msg += `_Submitted via verified Bangalore Survey Portal_`;

    const encodedText = encodeURIComponent(msg);
    const waUrl = `https://wa.me/919342420855?text=${encodedText}`;

    // Redirect to official company WhatsApp desk
    window.open(waUrl, '_blank', 'noreferrer,noopener');

    // Reset some state
    setTimeout(() => {
      setFormSubmitted(false);
    }, 5000);
  };

  const [activeBankCat, setActiveBankCat] = useState<'nationalised' | 'private' | 'housingFinance'>('nationalised');

  // Bank categories lists for Loans Available catalog
  const BANK_LOANS_CATALOG = {
    nationalised: [
      { name: 'State Bank of India (SBI)', loanType: 'SBI Realty Plot Loan', rate: '8.40% p.a.', maxTenure: '15 Yrs', ltv: '75%' },
      { name: 'Canara Bank', loanType: 'Canara Site Loan', rate: '8.60% p.a.', maxTenure: '10 Yrs', ltv: '70%' },
      { name: 'Bank of Baroda', loanType: 'Baroda Reality Plot', rate: '8.60% p.a.', maxTenure: '15 Yrs', ltv: '75%' },
      { name: 'Union Bank of India', loanType: 'Union Smart Plot', rate: '8.70% p.a.', maxTenure: '15 Yrs', ltv: '75%' }
    ],
    private: [
      { name: 'HDFC Bank', loanType: 'HDFC Plot Purchase Loan', rate: '8.50% p.a.', maxTenure: '15 Yrs', ltv: '80%' },
      { name: 'ICICI Bank', loanType: 'ICICI Plot Loan Product', rate: '8.65% p.a.', maxTenure: '20 Yrs', ltv: '75%' },
      { name: 'Axis Bank', loanType: 'Axis Land Purchase', rate: '8.75% p.a.', maxTenure: '15 Yrs', ltv: '75%' },
      { name: 'IDFC First Bank', loanType: 'IDFC Plot + Build', rate: '8.80% p.a.', maxTenure: '25 Yrs', ltv: '80%' }
    ],
    housingFinance: [
      { name: 'LIC Housing Finance (LICHFL)', loanType: 'LIC Plot Scheme', rate: '8.55% p.a.', maxTenure: '15 Yrs', ltv: '75%' },
      { name: 'PNB Housing Finance', loanType: 'PNB Plot & Build Loan', rate: '8.75% p.a.', maxTenure: '20 Yrs', ltv: '75%' },
      { name: 'Bajaj Housing Finance', loanType: 'Bajaj Plot Purchase', rate: '8.80% p.a.', maxTenure: '20 Yrs', ltv: '80%' },
      { name: 'Tata Capital HFL', loanType: 'Tata Plot Advantage', rate: '8.90% p.a.', maxTenure: '15 Yrs', ltv: '70%' }
    ]
  };

  return (
    <div className="max-w-4xl mx-auto w-full">
      
      {/* AUTHENTIC SURVEY FORM AS REQUESTED IN IMAGE (Centered full format for premium scannability) */}
      <div id="survey-form-container" className="bg-zinc-100 rounded-3xl border border-zinc-250 p-6 sm:p-8 shadow-md relative overflow-hidden text-zinc-900">
        
        {/* Subtle decorative background blur */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-emerald-600/5 rounded-full blur-2xl pointer-events-none"></div>

        {/* SURVEY HEADER & LETTERHEAD COMBINED (Horizontal dividers removed) */}
        <div className="pb-5 mb-6 relative">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-emerald-700 font-extrabold bg-emerald-100 border border-emerald-250 px-3 py-1 rounded-full">
              Investment Survey Panel
            </span>
            <h2 className="text-3xl font-sans font-black text-zinc-950 tracking-tight mt-2 italic uppercase">
              SURVEY FORM
            </h2>
            <p className="text-xs text-rose-600 font-black leading-snug tracking-tight uppercase">
              IF YOU LIKE TO INVEST IN BANGALORE, PLEASE FILL THE FORM Below
            </p>
          </div>
        </div>

        {preSelectedQuote && (
          <div className="mb-5 bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 text-xs backdrop-blur-sm relative">
            <button 
              onClick={onClearQuote}
              className="absolute top-2 right-3 text-[10px] text-amber-800 underline font-mono hover:text-amber-950 font-bold"
            >
              Clear estimate selection
            </button>
            <h4 className="text-amber-800 font-bold mb-1 flex items-center gap-1 uppercase tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-amber-750" />
              Interactive Quote Loaded
            </h4>
            <span className="text-amber-900/90">
              Your questionnaire is auto-filled with plot dimensions for <strong>{preSelectedQuote.propertyName}</strong>. Click submit to redirect to Rajan M directly!
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          
          {/* 1. CONTACT MATRIX */}
          <div id="survey-contact-matrix" className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-mono font-black text-zinc-800 uppercase tracking-widest mb-4">
              Client Contact Information
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              <div>
                <label className="block text-[10.5px] font-mono text-zinc-550 uppercase tracking-wider mb-1 font-bold">
                  NAME :
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="userName"
                    placeholder="Enter your full name"
                    value={formData.userName}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-zinc-550 uppercase tracking-wider mb-1 font-bold">
                  MOBILE :
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="userPhone"
                    placeholder="Enter contact number"
                    value={formData.userPhone}
                    onChange={handleInputChange}
                    required
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-zinc-550 uppercase tracking-wider mb-1 font-bold">
                  E-MAIL :
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="userEmail"
                    placeholder="client@propertyworld.in"
                    value={formData.userEmail}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10.5px] font-mono text-zinc-550 uppercase tracking-wider mb-1 font-bold">
                  WHATSAPP :
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-[11px] font-bold text-emerald-600">WA</span>
                  <input
                    type="tel"
                    name="userWhatsapp"
                    placeholder="WhatsApp number"
                    value={formData.userWhatsapp}
                    onChange={handleInputChange}
                    className="w-full bg-zinc-50 border border-zinc-250 rounded-xl py-2 pl-10 pr-4 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* 2. REGION PREFERENCES */}
          <div id="survey-region-preferences" className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5">
            <h3 className="text-xs font-mono font-black text-zinc-800 uppercase tracking-widest mb-3">
              WHICH AREA WOULD YOU PREFER TO INVEST IN BANGALORE?
            </h3>
            <div className="flex flex-wrap gap-2.5 pt-1.5">
              {['NORTH', 'SOUTH', 'EAST', 'WEST', 'ANY PLACE'].map((area) => {
                const isSelected = formData.preferredAreas.includes(area);
                return (
                  <button
                    key={area}
                    type="button"
                    onClick={() => handleToggleArea(area)}
                    className={`px-4 py-2 rounded-xl text-xs font-black tracking-wider transition-all duration-200 border-2 flex items-center gap-1.5 cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-600 border-emerald-700 text-white shadow-md'
                        : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-emerald-650 hover:bg-zinc-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      readOnly
                      className="accent-white h-3.5 w-3.5 pointer-events-none rounded cursor-pointer"
                    />
                    {area}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. KIND OF PROPERTY MATRIX (TIGHT INTEGRATION OF HANDWRITING STRUCTURES) */}
          <div id="survey-property-kinds" className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 space-y-4">
            <h3 className="text-xs font-mono font-black text-zinc-800 uppercase tracking-widest mb-2">
              WHAT KIND OF PROPERTY WOULD YOU LIKE TO PURCHASE?
            </h3>

            {/* PLOT / LAND Category */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] font-sans font-black text-emerald-700 tracking-wider uppercase block">
                • PLOT / LAND
              </span>
              <div className="flex flex-wrap gap-2">
                {['RESIDENSIAL', 'COMMERCIAL', 'FARM PLOTS', 'INDUSTRIAL', 'OTHERS'].map((item) => {
                  const isSelected = formData.plotLandKinds.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleKind('plot', item)}
                      className={`px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-650 text-emerald-800 shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-sm border ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-zinc-300'}`}></span>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* APARTMENTS Category */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] font-sans font-black text-emerald-700 tracking-wider uppercase block">
                • APARTMENTS
              </span>
              <div className="flex flex-wrap gap-2">
                {['STUDIO', '1 BHK', '2 BHK', '3 BHK', 'PENTHOUSE', 'OTHERS'].map((item) => {
                  const isSelected = formData.apartmentKinds.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleKind('apartment', item)}
                      className={`px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-650 text-emerald-800 shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-sm border ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-zinc-300'}`}></span>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* COMMERCIAL Category */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] font-sans font-black text-emerald-700 tracking-wider uppercase block">
                • COMMERCIAL
              </span>
              <div className="flex flex-wrap gap-2">
                {['SHOPS', 'BUILDING', 'PLOTS', 'OTHERS'].map((item) => {
                  const isSelected = formData.commercialKinds.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleKind('commercial', item)}
                      className={`px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-650 text-emerald-800 shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-sm border ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-zinc-300'}`}></span>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* INDUSTRIAL Category */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] font-sans font-black text-emerald-700 tracking-wider uppercase block">
                • INDUSTRIAL
              </span>
              <div className="flex flex-wrap gap-2">
                {['BUILDING', 'PLOTS', 'LAND + SHED', 'OTHERS'].map((item) => {
                  const isSelected = formData.industrialKinds.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleKind('industrial', item)}
                      className={`px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-650 text-emerald-800 shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-sm border ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-zinc-300'}`}></span>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* AGRICULTURAL / FARM LAND Category */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-3.5 space-y-2">
              <span className="text-[11px] font-sans font-black text-emerald-700 tracking-wider uppercase block">
                • AGRICULTURAL / FARM LAND
              </span>
              <div className="flex flex-wrap gap-2">
                {['FARM HOUSE', 'FARM PLOT', 'LAND', 'YELLOW ZONE', 'OTHERS'].map((item) => {
                  const isSelected = formData.agriculturalKinds.includes(item);
                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => handleToggleKind('agricultural', item)}
                      className={`px-3 py-1.5 rounded-xl text-[10.5px] font-extrabold transition-all border flex items-center gap-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-emerald-50 border-emerald-650 text-emerald-800 shadow-sm'
                          : 'bg-white border-zinc-200 text-zinc-650 hover:bg-zinc-100'
                      }`}
                    >
                      <span className={`w-2.5 h-2.5 rounded-sm border ${isSelected ? 'bg-emerald-600 border-emerald-600' : 'bg-white border-zinc-300'}`}></span>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>

          </div>

          {/* 4. CUSTOM REQUIREMENTS TEXTAREA */}
          <div id="survey-requirements" className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5">
            <label className="block text-[11px] font-mono text-zinc-500 uppercase tracking-widest mb-2.5 font-bold">
              YOUR REQUIREMENTS :
            </label>
            <textarea
              name="requirements"
              rows={4}
              placeholder="Indicate your custom budget ceiling, layouts desired, timing parameters, or need of direct negotiation with Chief Director Rajan M..."
              value={formData.requirements}
              onChange={handleInputChange}
              className="w-full bg-zinc-50 border border-zinc-200 rounded-2xl p-4 text-xs text-zinc-900 focus:outline-none focus:border-emerald-600 transition-colors resize-none placeholder:text-zinc-400"
            />
          </div>

          {/* SUBMIT SURVEY ACTION BUTTON */}
          <div className="flex justify-end pt-1">
            <button
              type="submit"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white min-w-[240px] py-3.5 px-8 rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-emerald-600/10 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Submit Survey & WhatsApp</span>
            </button>
          </div>

        </form>

        <AnimatePresence>
          {formSubmitted && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 p-4 bg-emerald-50 border border-emerald-250 rounded-2xl text-xs text-emerald-900"
            >
              <div className="flex items-center space-x-2 font-black mb-1 text-emerald-850 uppercase">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Survey Sent & Cached!</span>
              </div>
              <span className="font-semibold leading-relaxed">
                Thank you! Your verified requirements have been successfully registered under our system database. Representative <strong>Rajan M</strong> or our senior customer desk will immediately verify details. Opening your WhatsApp app right now...
              </span>
            </motion.div>
          )}
        </AnimatePresence>

      </div>

    </div>
  );
}
