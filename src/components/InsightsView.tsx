import React from 'react';
import { TrendingDown, Fuel, Users, ArrowRight } from 'lucide-react';
import { Vehicle, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';

interface InsightsViewProps {
  vehicle: Vehicle;
  economics: CalculatedEconomics;
  onOpenKeepSell: () => void;
  onNavigateTab: (tab: string) => void;
}

export const InsightsView: React.FC<InsightsViewProps> = ({
  vehicle,
  economics,
  onOpenKeepSell,
  onNavigateTab,
}) => {
  const potentialFuelSavings = Math.round(economics.annualFuelCost * 0.15);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. SCREEN TITLE */}
      <div className="pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
          FINANCIAL INTELLIGENCE
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          Strategic Insights
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          The 3 highest-leverage actions to protect your automotive net worth.
        </p>
      </div>

      {/* 2. THREE HIGH-VALUE ACTIONABLE INSIGHTS */}
      <div className="space-y-3">
        {/* Insight 1: BIGGEST COST */}
        <div className="p-5 rounded-3xl bg-[#0F131A] border border-rose-500/25 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-rose-400 uppercase tracking-widest flex items-center gap-1.5">
              <TrendingDown className="w-3.5 h-3.5" />
              YOUR BIGGEST COST
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 font-bold">
              Capital Loss
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Depreciation
            </h3>
            <span className="text-2xl font-black text-rose-400 font-mono-numbers block mt-0.5">
              {formatINR(economics.annualDepreciation)} / year
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Your {vehicle.model}’s steepest ongoing cost is silent asset depreciation, consuming more than fuel or maintenance.
          </p>

          <button
            onClick={onOpenKeepSell}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Review Keep or Sell Verdict</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#CCFF00]" />
          </button>
        </div>

        {/* Insight 2: BIGGEST OPPORTUNITY */}
        <div className="p-5 rounded-3xl bg-[#0F131A] border border-[#CCFF00]/25 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-[#CCFF00] uppercase tracking-widest flex items-center gap-1.5">
              <Fuel className="w-3.5 h-3.5" />
              YOUR BIGGEST OPPORTUNITY
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-[#CCFF00]/10 text-[#CCFF00] font-bold">
              Potential Saving
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Fuel Efficiency
            </h3>
            <span className="text-2xl font-black text-[#CCFF00] font-mono-numbers block mt-0.5">
              Save {formatINR(potentialFuelSavings)} / year
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Optimizing commute departure times and gentle highway throttle can improve your real mileage by ~15%, directly cutting monthly fuel bills.
          </p>

          <button
            onClick={() => onNavigateTab('BUY')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Simulate Efficiency Controller</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#CCFF00]" />
          </button>
        </div>

        {/* Insight 3: HOUSEHOLD EFFECT */}
        <div className="p-5 rounded-3xl bg-[#0F131A] border border-purple-500/25 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              HOUSEHOLD EFFECT
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/10 text-purple-300 font-bold">
              Driving Behavior
            </span>
          </div>

          <div>
            <h3 className="text-lg font-black text-white tracking-tight">
              Driving Behaviour
            </h3>
            <span className="text-2xl font-black text-purple-300 font-mono-numbers block mt-0.5">
              +{formatINR(economics.householdAdditionalWear)} / year
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-relaxed">
            Spirited acceleration and aggressive braking across multiple household drivers accelerate brake pad and tyre replacement cycles.
          </p>

          <button
            onClick={() => onNavigateTab('DRIVERS')}
            className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>Manage Household Drivers</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#CCFF00]" />
          </button>
        </div>
      </div>
    </div>
  );
};
