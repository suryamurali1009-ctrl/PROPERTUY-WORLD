import React from 'react';
import { Property } from '../types';
import { MapPin, Phone, ShieldCheck, TreePine, CalendarDays, ExternalLink, Calculator } from 'lucide-react';

interface PropertyCardProps {
  key?: string | number;
  property: Property;
  onInquire: (property: Property) => void;
  isAdmin?: boolean;
  onDelete?: (id: string) => void;
}

export default function PropertyCard({ property, onInquire, isAdmin, onDelete }: PropertyCardProps) {
  // Determine badge colors based on property type
  const getTypeDetails = (type: string) => {
    switch (type) {
      case 'resort':
        return { label: 'Resort Plot', color: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' };
      case 'farmhouse':
        return { label: 'Farm Estate', color: 'bg-amber-500/20 text-amber-300 border-amber-500/30' };
      case 'site':
        return { label: 'Approved Site', color: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' };
      case 'apartment':
        return { label: 'Apartment', color: 'bg-teal-500/20 text-teal-300 border-teal-500/30' };
      case 'villa':
        return { label: 'Luxury Villa', color: 'bg-rose-500/20 text-rose-350 border-rose-500/30' };
      case 'commercial':
        return { label: 'Commercial Land', color: 'bg-purple-500/20 text-purple-350 border-purple-500/30' };
      case 'industrial':
        return { label: 'Industrial Plot', color: 'bg-slate-500/20 text-slate-350 border-slate-500/30' };
      default:
        return { label: 'Property', color: 'bg-white/10 text-white border-white/20' };
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'bg-blue-500/25 text-blue-300 border-blue-500/30';
      case 'Ready to Construct':
        return 'bg-green-500/25 text-green-300 border-green-500/30';
      case 'Proposed':
        return 'bg-purple-500/25 text-purple-300 border-purple-500/30';
      case 'Completed':
        return 'bg-emerald-500/25 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-white/10 text-white';
    }
  };

  const typeInfo = getTypeDetails(property.type);

  const handleBookTourClick = () => {
    onInquire(property);
    const formattedCategory = typeInfo.label;
    const messageText = `Hello Property World Estate, I would like to book a physical site tour/visit slot for the following development:

🏰 *Development*: ${property.title}
📍 *Location*: ${property.location} - ${property.subLocation}
🏷️ *Classification*: ${formattedCategory}
📈 *Investment/Pricing*: ${property.priceText}
💎 *Highlights*: 
${property.features.map(h => `  • ${h}`).join('\n')}

Please share coordinate mappings, layout sketches, and guide availability timings with me on WhatsApp.`;

    const encodedText = encodeURIComponent(messageText);
    const waUrl = `https://wa.me/919342420855?text=${encodedText}`;
    window.open(waUrl, '_blank', 'noreferrer,noopener');
  };

  return (
    <div
      id={`property-card-${property.id}`}
      className="group relative bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200/80 overflow-hidden shadow-lg h-full flex flex-col hover:border-emerald-500/30 hover:shadow-[0_10px_25px_rgba(16,185,129,0.06)] transition-all duration-500"
    >
      {/* Background ambient light */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors duration-500"></div>

      {/* Image Container with Hover zoom */}
      <div className="relative h-56 w-full overflow-hidden">
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent z-10"></div>
        <img
          src={property.image}
          alt={property.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Floating Badges */}
        <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono uppercase tracking-widest border font-semibold backdrop-blur-md bg-white/90 shadow-sm text-slate-800 border-slate-250`}>
            {typeInfo.label}
          </span>
          {property.isPremium && (
            <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 px-2.5 py-1 rounded-lg text-[9px] font-mono font-bold uppercase tracking-widest border border-amber-300 shadow-sm">
              👑 Premium Choice
            </span>
          )}
        </div>

        <div className="absolute top-4 right-4 z-20">
          <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-semibold uppercase tracking-widest border backdrop-blur-md bg-white/90 shadow-sm text-slate-800 border-slate-250`}>
            {property.developmentStatus}
          </span>
        </div>

        {/* Bottom Title on Image */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <p className="text-[10px] font-mono text-emerald-400 tracking-wider uppercase mb-1 flex items-center gap-1 font-bold">
            <MapPin className="w-3 h-3 text-emerald-400" />
            {property.location}
          </p>
          <h3 className="text-white text-lg font-sans font-bold leading-tight group-hover:text-emerald-300 transition-colors">
            {property.title}
          </h3>
        </div>
      </div>

      {/* Main Details Body */}
      <div className="p-5 flex-grow flex flex-col justify-between">
        <div>
          {/* Sublocation snippet */}
          <p className="text-xs text-slate-500 italic mb-3 line-clamp-1 font-medium">
            {property.subLocation}
          </p>

          {/* Pricing Banner */}
          <div className="mb-4 bg-slate-50 border border-slate-200/60 rounded-xl px-4 py-2.5 flex items-center justify-between shadow-sm">
            <div>
              <span className="block text-[9px] font-mono tracking-widest text-emerald-700 uppercase font-bold">
                Base Investment Rate
              </span>
              <span className="text-base font-sans font-extrabold text-slate-900">
                {property.priceText}
              </span>
            </div>
            {property.installmentsAvailable && (
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                Installment OK
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-600 leading-relaxed font-sans mb-4 min-h-[48px] line-clamp-3">
            {property.description}
          </p>

          {/* Primary Features Highlight */}
          <div className="mb-5">
            <span className="block text-[10px] font-mono tracking-wider text-slate-400 uppercase mb-2 font-bold">
              Premium Infrastructure Perks
            </span>
            <div className="grid grid-cols-1 gap-1.5">
              {property.features.slice(0, 3).map((feat, idx) => (
                <div key={idx} className="flex items-start space-x-2 text-[11px] text-slate-700">
                  <div className="mt-0.5 rounded bg-emerald-50 p-0.5 border border-emerald-100">
                    <TreePine className="w-3 h-3 text-emerald-600" />
                  </div>
                  <span className="line-clamp-1 font-medium">{feat}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100">

          {isAdmin && onDelete && (
            <button
              onClick={() => onDelete(property.id)}
              className="w-full mb-3 flex items-center justify-center space-x-1 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-98 cursor-pointer"
            >
              <span>🗑️ Delete Current Listing</span>
            </button>
          )}

          <button
            onClick={handleBookTourClick}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 rounded-xl text-xs font-black uppercase tracking-widest shadow-md shadow-emerald-500/10 transition-all active:scale-98 cursor-pointer font-sans"
          >
            <CalendarDays className="w-4 h-4 text-slate-950" />
            <span>Book Site Tour</span>
          </button>
        </div>
      </div>
    </div>
  );
}
