import React, { useState } from 'react';
import { Star, ShieldCheck, X, Check } from 'lucide-react';
import { ServiceItem, Vehicle, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';

interface ServicesMarketplaceProps {
  services: ServiceItem[];
  activeVehicle: Vehicle;
  economics?: CalculatedEconomics;
}

export const ServicesMarketplace: React.FC<ServicesMarketplaceProps> = ({
  services,
  activeVehicle,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [bookingItem, setBookingItem] = useState<ServiceItem | null>(null);
  const [bookedSuccess, setBookedSuccess] = useState(false);

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'cat-service', name: 'Service' },
    { id: 'cat-tyres', name: 'Tyres' },
    { id: 'cat-battery', name: 'Battery' },
    { id: 'cat-ac', name: 'AC' },
    { id: 'cat-detailing', name: 'Detailing' },
  ];

  const filtered = selectedCategory === 'all'
    ? services
    : services.filter((s) => s.categoryId === selectedCategory);

  const handleConfirm = () => {
    setBookedSuccess(true);
    setTimeout(() => {
      setBookedSuccess(false);
      setBookingItem(null);
    }, 2000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. SCREEN HEADER */}
      <div className="pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
          AUTOMOTIVE UPKEEP
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          Service your car
        </h1>
      </div>

      {/* 2. HORIZONTAL CATEGORIES */}
      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === cat.id
                ? 'bg-[#CCFF00] text-black shadow-md shadow-[#CCFF00]/15'
                : 'bg-[#12161E] text-zinc-400 hover:text-white border border-white/8'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* 3. RECOMMENDED LIST (COMPACT CARDS) */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
          RECOMMENDED FOR YOUR {activeVehicle.model.toUpperCase()}
        </span>

        {filtered.map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-2xl bg-[#0F131A] border border-white/8 flex items-center justify-between gap-3"
          >
            <div className="space-y-0.5 flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white truncate">
                  {item.categoryName}
                </h4>
                {item.verified && (
                  <ShieldCheck className="w-3.5 h-3.5 text-[#CCFF00] shrink-0" />
                )}
              </div>
              <p className="text-[10px] text-zinc-400 truncate">
                {item.providerName} • <span className="text-amber-400 font-bold">{item.rating} ★</span>
              </p>
              <span className="text-xs font-black text-white font-mono-numbers block pt-0.5">
                {formatINR(item.price)}
              </span>
            </div>

            <button
              onClick={() => setBookingItem(item)}
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-[#CCFF00] text-white hover:text-black text-xs font-bold transition-colors cursor-pointer shrink-0"
            >
              View
            </button>
          </div>
        ))}
      </div>

      {/* 4. BOOKING BOTTOM SHEET */}
      {bookingItem && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setBookingItem(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0F131A] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">{bookingItem.categoryName}</h3>
              <button onClick={() => setBookingItem(null)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-300">
                <span>Provider:</span>
                <span className="font-bold text-white">{bookingItem.providerName}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Estimated Price:</span>
                <span className="font-bold text-[#CCFF00] font-mono-numbers">{formatINR(bookingItem.price)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Rating:</span>
                <span className="text-amber-400 font-bold">{bookingItem.rating} ★</span>
              </div>
            </div>

            {bookedSuccess ? (
              <div className="p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-center text-xs font-bold text-emerald-400 flex items-center justify-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Service Scheduled for {activeVehicle.model}</span>
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider cursor-pointer"
              >
                Schedule Service
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
