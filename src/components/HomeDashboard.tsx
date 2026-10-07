import React from 'react';
import { ArrowRight, Fuel, Wrench, Shield, TrendingDown, ShieldCheck, AlertTriangle } from 'lucide-react';
import { Vehicle, Driver, FinancialProfile, OwnershipProfile, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';

interface HomeDashboardProps {
  vehicle: Vehicle;
  drivers: Driver[];
  finance: FinancialProfile;
  ownership: OwnershipProfile;
  economics: CalculatedEconomics;
  onOpenKeepSell: () => void;
  onUpdateDrivers?: (drivers: Driver[]) => void;
  onUpdateFinance?: (finance: FinancialProfile) => void;
  onNavigateTab: (tab: string) => void;
}

export const HomeDashboard: React.FC<HomeDashboardProps> = ({
  vehicle,
  economics,
  onOpenKeepSell,
  onNavigateTab,
}) => {
  const isKeep = economics.keepSellDecision === 'KEEP';

  // Calculate percentages for stacked visualization
  const total = Math.max(1, economics.annualTotalCost);
  const fuelPct = Math.round((economics.annualFuelCost / total) * 100);
  const maintPct = Math.round((economics.annualMaintenance / total) * 100);
  const insPct = Math.round((economics.annualInsurance / total) * 100);
  const depPct = Math.max(5, 100 - (fuelPct + maintPct + insPct));

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. TOP GREETING */}
      <div className="pt-1">
        <span className="text-xs font-medium text-zinc-400 block tracking-wide">
          Good morning, Abhinav
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          Your {vehicle.make} {vehicle.model}
        </h1>
      </div>

      {/* 2. HERO METRIC POD (ONE DOMINANT NUMBER) */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#131822] via-[#0E1219] to-[#0A0D12] border border-white/10 shadow-xl relative overflow-hidden">
        {/* Subtle ambient glow */}
        <div className="absolute top-0 right-0 w-56 h-56 bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div>
            <div className="text-4xl sm:text-5xl font-black text-white tracking-tight font-mono-numbers flex items-baseline gap-1">
              <span className="text-[#CCFF00]">₹{economics.costPerKm.toFixed(1)}</span>
              <span className="text-lg font-light text-zinc-400 font-sans tracking-normal">
                / km
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 mt-1 block">
              TRUE COST / KM
            </span>
          </div>

          <div className="pt-2 border-t border-white/8 flex items-baseline justify-between">
            <div>
              <span className="text-xl font-extrabold text-white font-mono-numbers">
                {formatINR(economics.annualTotalCost)}
              </span>
              <span className="text-zinc-400 text-xs"> / year</span>
              <span className="text-[11px] text-zinc-500 block">
                Estimated ownership cost
              </span>
            </div>

            <button
              onClick={() => onNavigateTab('COSTS')}
              className="text-xs font-bold text-[#CCFF00] hover:underline flex items-center gap-1 cursor-pointer py-1"
            >
              <span>View details</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* COMPACT STACKED VISUALIZATION */}
          <div className="pt-3 space-y-2.5">
            {/* Multi-segment progress bar */}
            <div className="h-2 w-full rounded-full bg-zinc-800 flex overflow-hidden">
              <div style={{ width: `${fuelPct}%` }} className="bg-amber-400 h-full" title={`Fuel ${fuelPct}%`} />
              <div style={{ width: `${maintPct}%` }} className="bg-blue-400 h-full" title={`Maintenance ${maintPct}%`} />
              <div style={{ width: `${insPct}%` }} className="bg-emerald-400 h-full" title={`Insurance ${insPct}%`} />
              <div style={{ width: `${depPct}%` }} className="bg-rose-400 h-full" title={`Depreciation ${depPct}%`} />
            </div>

            {/* 4 Clean Breakdown Numbers */}
            <div className="grid grid-cols-4 gap-1 pt-1 text-left">
              <div>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" /> Fuel
                </span>
                <span className="text-xs font-bold text-white font-mono-numbers block mt-0.5">
                  {formatINR(economics.annualFuelCost)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-400" /> Maint.
                </span>
                <span className="text-xs font-bold text-white font-mono-numbers block mt-0.5">
                  {formatINR(economics.annualMaintenance)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> Insure
                </span>
                <span className="text-xs font-bold text-white font-mono-numbers block mt-0.5">
                  {formatINR(economics.annualInsurance)}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" /> Depr.
                </span>
                <span className="text-xs font-bold text-white font-mono-numbers block mt-0.5">
                  {formatINR(economics.annualDepreciation)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. ONE MAJOR DECISION CARD: KEEP OR SELL? */}
      <div className={`p-5 rounded-3xl border transition-all ${
        isKeep 
          ? 'bg-gradient-to-br from-[#121B13] via-[#0E1410] to-[#0A0D12] border-emerald-500/30'
          : 'bg-gradient-to-br from-[#1B1612] via-[#14100E] to-[#0A0D12] border-amber-500/30'
      }`}>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block">
              KEEP OR SELL?
            </span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black tracking-tight ${
                isKeep ? 'text-[#CCFF00]' : 'text-amber-400'
              }`}>
                {isKeep ? 'KEEP' : 'SELL'}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-white/10 text-zinc-300 font-semibold font-mono-numbers">
                12M Verdict
              </span>
            </div>
          </div>

          <div className={`w-9 h-9 rounded-2xl flex items-center justify-center ${
            isKeep ? 'bg-[#CCFF00]/15 text-[#CCFF00]' : 'bg-amber-400/15 text-amber-400'
          }`}>
            {isKeep ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-300 leading-snug mt-2.5">
          {isKeep
            ? `Keeping your ${vehicle.model} for another year looks financially better.`
            : `Selling your ${vehicle.model} now avoids upcoming steep depreciation.`}
        </p>

        <button
          onClick={onOpenKeepSell}
          className="w-full mt-4 py-3 rounded-2xl bg-white/10 hover:bg-[#CCFF00] text-white hover:text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
        >
          <span>See why</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* 4. ONE USEFUL INSIGHT CARD */}
      <div className="p-4 rounded-2xl bg-[#0F131A] border border-white/8 flex items-center justify-between gap-3">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-wider block">
            HOUSEHOLD INSIGHT
          </span>
          <p className="text-xs text-zinc-300 leading-tight">
            Household driving pattern adds <strong className="text-white font-mono-numbers">+{formatINR(economics.householdAdditionalWear)}/year</strong> in wear.
          </p>
        </div>

        <button
          onClick={() => onNavigateTab('DRIVERS')}
          className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white text-xs font-semibold whitespace-nowrap border border-white/10 transition-colors cursor-pointer shrink-0"
        >
          Drivers &rarr;
        </button>
      </div>
    </div>
  );
};
