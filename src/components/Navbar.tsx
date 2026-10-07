import React from 'react';
import { Car, ShieldCheck } from 'lucide-react';
import { Vehicle, CalculatedEconomics } from '../types';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  activeVehicle: Vehicle;
  economics: CalculatedEconomics;
  onOpenKeepSell: () => void;
  onResetDemo?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  activeVehicle,
  economics,
  onOpenKeepSell,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-[#08090C]/90 backdrop-blur-xl border-b border-white/8 transition-all">
      <div className="max-w-md md:max-w-xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
        {/* Brand / Logo */}
        <button
          onClick={() => onSelectTab('HOME')}
          className="flex items-center gap-2 group text-left cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#CCFF00] to-[#88B800] flex items-center justify-center text-black font-black text-xs shadow-md shadow-[#CCFF00]/20">
            C
          </div>
          <div className="flex items-center gap-1.5">
            <span className="font-black tracking-tight text-white text-sm">
              CARCONOMY
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#CCFF00] animate-pulse" />
          </div>
        </button>

        {/* Right Action: Active Vehicle Quick Pill */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onSelectTab('MY_CAR')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-zinc-300 transition-colors cursor-pointer"
          >
            <Car className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span className="max-w-[120px] truncate">{activeVehicle.model}</span>
          </button>

          <button
            onClick={onOpenKeepSell}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold border transition-colors cursor-pointer flex items-center gap-1 ${
              economics.keepSellDecision === 'KEEP'
                ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25'
                : 'bg-amber-500/10 text-amber-400 border-amber-500/25'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{economics.keepSellDecision}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
