import React, { useState } from 'react';
import { X, ShieldCheck, AlertTriangle, ChevronDown, ChevronUp } from 'lucide-react';
import { Vehicle, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';

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
          <div className="p-4 rounded-2xl bg-[#121620] border border-white/8 space-y-2.5">
            <span className="text-[10px] font-bold text-[#CCFF00] uppercase tracking-wider block">
              WHY?
            </span>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between items-center text-zinc-300">
                <span>Expected value in 12 months:</span>
                <span className="font-bold font-mono-numbers text-white">
                  {formatINR(vehicle.currentValue - details.depreciation12M)}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span>Expected depreciation:</span>
                <span className="font-bold font-mono-numbers text-rose-400">
                  {formatINR(details.depreciation12M)}
                </span>
              </div>

              <div className="flex justify-between items-center text-zinc-300">
                <span>Expected maintenance:</span>
                <span className="font-bold font-mono-numbers text-blue-400">
                  {formatINR(details.maintenance12M)}
                </span>
              </div>

              <div className="pt-2 border-t border-white/10 flex justify-between items-center font-bold text-white">
                <span>Cost of keeping:</span>
                <span className="text-[#CCFF00] font-mono-numbers">
                  {formatINR(details.costToKeep12M)}
                </span>
              </div>
            </div>
          </div>

          {/* 3. ONE SENTENCE SUMMARY */}
          <p className="text-xs sm:text-sm text-zinc-300 leading-snug px-1">
            {isKeep
              ? `Keeping your ${vehicle.model} for another year looks financially better than absorbing premature replacement and transaction friction.`
              : `Selling now is estimated to save you ${formatINR(details.breakEvenDifference)} over the next 12 months by avoiding upcoming steep depreciation.`}
          </p>

          {/* 4. PRIMARY CTA: SEE THE NUMBERS */}
          <button
            onClick={() => setShowDetailedNumbers(!showDetailedNumbers)}
            className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#CCFF00]/15 hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[48px]"
          >
            <span>{showDetailedNumbers ? 'Hide Numbers' : 'See The Numbers'}</span>
            {showDetailedNumbers ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {/* 5. EXPANDABLE DETAILED NUMBERS (BELOW THE FOLD) */}
          {showDetailedNumbers && (
            <div className="p-4 rounded-2xl bg-black/40 border border-white/8 space-y-2.5 text-xs animate-in fade-in">
              <div className="flex justify-between text-zinc-300">
                <span>Current Market Value:</span>
                <span className="font-bold font-mono-numbers text-white">{formatINR(vehicle.currentValue)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Annual Fuel Estimate:</span>
                <span className="font-bold font-mono-numbers text-white">{formatINR(details.fuel12M)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Annual Insurance (IDV):</span>
                <span className="font-bold font-mono-numbers text-white">{formatINR(details.insurance12M)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Transaction & Broker Margin (3.5%):</span>
                <span className="font-bold font-mono-numbers text-zinc-400">{formatINR(Math.round(vehicle.currentValue * 0.035))}</span>
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
