import React from 'react';
import { Wallet, CheckCircle2, AlertTriangle, AlertOctagon, TrendingUp, HelpCircle } from 'lucide-react';
import { FinancialProfile, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';

interface FinancialFitCardProps {
  finance: FinancialProfile;
  economics: CalculatedEconomics;
  onUpdateFinance: (finance: FinancialProfile) => void;
}

export const FinancialFitCard: React.FC<FinancialFitCardProps> = ({
  finance,
  economics,
  onUpdateFinance,
}) => {
  const tier = economics.financialFitTier;
  const allocation = economics.incomeAllocationPercent;

  const tierColor =
    tier === 'COMFORTABLE'
      ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10'
      : tier === 'STRETCHED'
      ? 'text-amber-300 border-amber-500/30 bg-amber-500/10'
      : 'text-rose-400 border-rose-500/30 bg-rose-500/10';

  const TierIcon =
    tier === 'COMFORTABLE'
      ? CheckCircle2
      : tier === 'STRETCHED'
      ? AlertTriangle
      : AlertOctagon;

  const monthlyMaintenance = Math.round(economics.annualMaintenance / 12);
  const monthlyInsurance = Math.round(economics.annualInsurance / 12);

  return (
    <div className="bg-[#12151B]/90 border border-white/8 rounded-2xl p-6 transition-all space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
            <Wallet className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Financial Affordability & Cashflow Fit
            </h3>
            <p className="text-xs text-zinc-400">
              Household automotive burden & risk sensitivity
            </p>
          </div>
        </div>

        {/* Tier Pill */}
        <div className={`px-3 py-1 rounded-full border text-xs font-bold tracking-wider uppercase flex items-center gap-1.5 ${tierColor}`}>
          <TierIcon className="w-3.5 h-3.5" />
          <span>{tier}</span>
        </div>
      </div>

      {/* ITEMIZED 6-FACTOR MONTHLY BURDEN TABLE */}
      <div className="p-4 rounded-xl bg-[#0D1015] border border-white/5 space-y-2.5 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] block mb-2">
          Monthly Household Automotive Commitment Breakdown
        </span>

        <div className="flex justify-between items-center py-1 border-b border-white/5">
          <span className="text-zinc-400">1. Monthly Household Income:</span>
          <span className="text-white font-bold font-mono-numbers">{formatINR(finance.householdIncome)} / mo</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/5">
          <span className="text-zinc-400">2. Existing Recurring EMIs (Home / Other):</span>
          <span className="text-zinc-300 font-bold font-mono-numbers">{formatINR(finance.existingEmis)} / mo</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/5">
          <span className="text-zinc-400">3. New Car Loan EMI:</span>
          <span className="text-white font-bold font-mono-numbers">{formatINR(economics.monthlyCarPayment)} / mo</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/5">
          <span className="text-zinc-400">4. Monthly Fuel Burn (Est.):</span>
          <span className="text-zinc-300 font-bold font-mono-numbers">{formatINR(economics.monthlyFuelCost)} / mo</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/5">
          <span className="text-zinc-400">5. Monthly Maintenance & Wear Reserve:</span>
          <span className="text-zinc-300 font-bold font-mono-numbers">{formatINR(monthlyMaintenance)} / mo</span>
        </div>

        <div className="flex justify-between items-center py-1 border-b border-white/5">
          <span className="text-zinc-400">6. Monthly Insurance Sinking Fund:</span>
          <span className="text-zinc-300 font-bold font-mono-numbers">{formatINR(monthlyInsurance)} / mo</span>
        </div>

        {/* Totals */}
        <div className="flex justify-between items-center pt-2 text-sm font-bold">
          <span className="text-white">Total Monthly Automotive Burden:</span>
          <span className="text-[#CCFF00] font-mono-numbers text-base">{formatINR(economics.totalMonthlyCarCommitment)} / mo</span>
        </div>

        <div className="flex justify-between items-center text-xs">
          <span className="text-zinc-400">Total Commitments (Car + Existing EMIs):</span>
          <span className="text-white font-mono-numbers font-bold">
            {formatINR(finance.existingEmis + economics.totalMonthlyCarCommitment)} / mo ({allocation}%)
          </span>
        </div>
      </div>

      {/* INCOME ALLOCATION PROGRESS BAR */}
      <div className="p-4 rounded-xl bg-[#161B22] border border-white/5">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-zinc-300 font-medium">Income Allocation Ratio</span>
            <span className="text-zinc-500 text-[10px]">(Safe threshold: &lt; 24%)</span>
          </div>
          <span className="text-white font-extrabold font-mono-numbers text-sm">
            {allocation}%
          </span>
        </div>

        {/* Multi-segment Bar */}
        <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden flex">
          <div 
            style={{ width: `${Math.min(100, (finance.existingEmis / finance.householdIncome) * 100)}%` }} 
            className="bg-zinc-500 h-full transition-all"
            title="Existing EMIs"
          />
          <div 
            style={{ width: `${Math.min(100 - ((finance.existingEmis / finance.householdIncome) * 100), (economics.totalMonthlyCarCommitment / finance.householdIncome) * 100)}%` }} 
            className={`h-full transition-all ${
              tier === 'COMFORTABLE' ? 'bg-[#CCFF00]' : tier === 'STRETCHED' ? 'bg-amber-400' : 'bg-rose-500'
            }`}
            title="Total Monthly Car Commitment"
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-zinc-400 mt-2">
          <span>Existing EMIs: {((finance.existingEmis / finance.householdIncome) * 100).toFixed(1)}%</span>
          <span>Car Burden: {((economics.totalMonthlyCarCommitment / finance.householdIncome) * 100).toFixed(1)}%</span>
        </div>
      </div>

      {/* SUMMARY NOTE */}
      <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 text-xs text-zinc-300 leading-relaxed">
        <p>
          <strong className="text-white font-semibold">Carconomy Assessment: </strong>
          {economics.financialFitSummary}
        </p>
      </div>

      {/* INTERACTIVE HOUSEHOLD INCOME SLIDER */}
      <div className="pt-3 border-t border-white/5">
        <div className="flex items-center justify-between text-xs mb-1.5">
          <span className="text-zinc-400">Simulate Household Monthly Income:</span>
          <span className="text-white font-bold font-mono-numbers">
            {formatINR(finance.householdIncome)} / month
          </span>
        </div>
        <input
          type="range"
          min="100000"
          max="1000000"
          step="25000"
          value={finance.householdIncome}
          onChange={(e) => onUpdateFinance({ ...finance, householdIncome: Number(e.target.value) })}
          className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono-numbers">
          <span>₹1.0L / mo</span>
          <span>₹5.0L / mo</span>
          <span>₹10.0L / mo</span>
        </div>
      </div>

      <p className="text-[10px] text-zinc-500 leading-normal">
        * Budgeting and affordability estimate only. Not regulated investment or financial advice.
      </p>
    </div>
  );
};
