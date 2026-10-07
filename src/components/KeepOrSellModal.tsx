import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Vehicle, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';
import { ValuationCurveChart } from './charts/FinancialCharts';

interface KeepOrSellModalProps {
  isOpen: boolean;
  onClose: () => void;
  vehicle: Vehicle;
  economics: CalculatedEconomics;
  onNavigateBuy?: () => void;
}

export const KeepOrSellModal: React.FC<KeepOrSellModalProps> = ({
  isOpen,
  onClose,
  vehicle,
  economics,
}) => {
  const [showDetailedNumbers, setShowDetailedNumbers] = useState(false);

  if (!isOpen) return null;

  const details = economics.keepSellDetails;
  const isKeep = details.decision === 'KEEP';

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#0D1016] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl text-white overflow-hidden max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Drag Handle & Close */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="w-8" />
          <div className="w-10 h-1 rounded-full bg-zinc-700 sm:hidden" />
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="pt-4 space-y-5">
          {/* 1. TOP: VEHICLE & DECISION */}
          <div className="text-center space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block">
              {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
            </span>
            <div className={`text-4xl sm:text-5xl font-black tracking-tight ${
              isKeep ? 'text-[#CCFF00]' : 'text-amber-400'
            }`}>
              {isKeep ? 'KEEP' : 'SELL'}
            </div>
            <span className="text-xs text-zinc-500 font-mono-numbers block">
              12-Month Holding Verdict
            </span>
          </div>

          {/* 2. WHY? COMPACT BREAKDOWN */}
          <div className="p-4 rounded-2xl bg-[#121620] border border-white/8 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-wider block">
                12-MONTH LIKE-FOR-LIKE COMPARISON
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-md bg-white/10 text-zinc-300 font-mono-numbers">
                Break-even: {details.breakEvenHorizon}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className={`p-2.5 rounded-xl border ${
                isKeep ? 'bg-[#CCFF00]/10 border-[#CCFF00]/30' : 'bg-black/30 border-white/5'
              }`}>
                <span className="text-[10px] text-zinc-400 block font-medium">Keep 12M Cost</span>
                <span className={`text-base font-black font-mono-numbers ${
                  isKeep ? 'text-[#CCFF00]' : 'text-zinc-300'
                }`}>
                  {formatINR(details.costToKeep12M)}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Depr + Maint + Loan</span>
              </div>

              <div className={`p-2.5 rounded-xl border ${
                !isKeep ? 'bg-amber-400/10 border-amber-400/30' : 'bg-black/30 border-white/5'
              }`}>
                <span className="text-[10px] text-zinc-400 block font-medium">Sell & Replace 12M</span>
                <span className={`text-base font-black font-mono-numbers ${
                  !isKeep ? 'text-amber-400' : 'text-zinc-300'
                }`}>
                  {formatINR(details.costToSellReplace12M)}
                </span>
                <span className="text-[9px] text-zinc-400 block mt-0.5">Friction + New Depr</span>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-1 border-t border-white/5">
              <div className="flex justify-between items-center text-zinc-300">
                <span>Sell Today Market Value:</span>
                <span className="font-bold font-mono-numbers text-white">
                  {formatINR(details.sellTodayValue)}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span>Expected Value After 1 Year:</span>
                <span className="font-bold font-mono-numbers text-white">
                  {formatINR(details.expectedValueAfterOneYear)}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span>12M Depreciation Loss:</span>
                <span className="font-bold font-mono-numbers text-rose-400">
                  -{formatINR(details.depreciation12M)}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span>12M Financing Interest Impact:</span>
                <span className="font-bold font-mono-numbers text-amber-300">
                  {details.loanInterest12M > 0 ? formatINR(details.loanInterest12M) : '₹0 (Paid / Cash)'}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center font-bold text-white">
                <span>Net 12-Month Financial Advantage:</span>
                <span className="text-[#CCFF00] font-mono-numbers text-sm">
                  {formatINR(details.breakEvenDifference)}
                </span>
              </div>
            </div>
          </div>

          {/* 3. ONE SENTENCE SUMMARY (NEVER CONTRADICTS) */}
          <div className="p-3 rounded-xl bg-white/5 border border-white/5">
            <p className="text-xs sm:text-sm text-zinc-200 leading-snug">
              {details.headlineReason}
            </p>
          </div>

          {/* VALUATION CURVE CHART */}
          {economics.yearlyData && economics.yearlyData.length >= 5 && (
            <ValuationCurveChart
              vehicleName={`${vehicle.make} ${vehicle.model}`}
              startValue={details.sellTodayValue}
              yearlyValues={economics.yearlyData.map((d) => d.vehicleValueAtYearEnd)}
              breakEvenHorizon={details.breakEvenHorizon}
              decision={details.decision}
            />
          )}

          {/* 4. PRIMARY CTA: SEE THE NUMBERS */}
          <button
            onClick={() => setShowDetailedNumbers(!showDetailedNumbers)}
            className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#CCFF00]/15 hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[48px]"
          >
            <span>{showDetailedNumbers ? 'Hide Detailed Breakdown' : 'See Detailed Breakdown'}</span>
            {showDetailedNumbers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* 5. EXPANDABLE DETAILED NUMBERS (BELOW THE FOLD) */}
          {showDetailedNumbers && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/8 space-y-3 text-xs animate-in fade-in">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block">
                Itemized 12-Month Like-For-Like Breakdown
              </span>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-zinc-300 block">Cost to KEEP {vehicle.model}:</span>
                <div className="pl-2 space-y-1 text-zinc-400 border-l border-white/10">
                  <div className="flex justify-between">
                    <span>12M Value Depreciation:</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.depreciation12M)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maintenance & Ageing Cliff:</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.maintenance12M)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Insurance (IDV Amortized):</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.insurance12M)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fuel Consumption:</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.fuel12M)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Financing Interest:</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.loanInterest12M)}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-white/5">
                <span className="text-[11px] font-bold text-zinc-300 block">Cost to SELL & REPLACE:</span>
                <div className="pl-2 space-y-1 text-zinc-400 border-l border-white/10">
                  <div className="flex justify-between">
                    <span>Sale Broker & Transaction (3.5%):</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.transactionCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Replacement Vehicle Year-1 Depr:</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.replacementDepreciation12M)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Replacement Loan Year-1 Interest:</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.replacementInterest12M)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Replacement Year-1 Maintenance:</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.replacementMaintenance12M)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Replacement Zero-Dep Insurance:</span>
                    <span className="font-mono-numbers text-zinc-200">{formatINR(details.replacementInsurance12M)}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-white/5 text-[11px] text-zinc-400 leading-relaxed">
                {details.detailedReason}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
