import React, { useState } from 'react';
import { Fuel, Wrench, Shield, TrendingDown, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';
import { Vehicle, Driver, FinancialProfile, OwnershipProfile, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';

interface CostsViewProps {
  vehicle: Vehicle;
  drivers: Driver[];
  finance: FinancialProfile;
  ownership: OwnershipProfile;
  economics: CalculatedEconomics;
  onUpdateDrivers?: (drivers: Driver[]) => void;
  onUpdateOwnership?: (ownership: OwnershipProfile) => void;
}

export const CostsView: React.FC<CostsViewProps> = ({
  vehicle,
  economics,
}) => {
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleItem = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const total = Math.max(1, economics.annualTotalCost);
  const annualLoanInterest = economics.annualFinancingInterest || Math.round(economics.loan.totalInterest / Math.max(1, economics.tenureYears));

  const items = [
    {
      id: 'fuel',
      name: 'Fuel',
      icon: Fuel,
      color: 'text-amber-400',
      bgColor: 'bg-amber-400',
      amount: economics.annualFuelCost,
      pct: Math.round((economics.annualFuelCost / total) * 100),
      explanation: `Calculated from ${economics.annualKm.toLocaleString('en-IN')} annual km at ${economics.effectiveMileage} km/L effective fuel efficiency.`,
    },
    {
      id: 'maintenance',
      name: 'Maintenance',
      icon: Wrench,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400',
      amount: economics.annualMaintenance,
      pct: Math.round((economics.annualMaintenance / total) * 100),
      explanation: `Routine OEM scheduled service plus +${formatINR(economics.householdAdditionalWear)}/yr in additional wear from household driving patterns.`,
    },
    {
      id: 'insurance',
      name: 'Insurance',
      icon: Shield,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400',
      amount: economics.annualInsurance,
      pct: Math.round((economics.annualInsurance / total) * 100),
      explanation: `Comprehensive zero-depreciation coverage benchmarked to the vehicle's Insured Declared Value (IDV).`,
    },
    {
      id: 'depreciation',
      name: 'Depreciation',
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-400',
      amount: economics.annualDepreciation,
      pct: Math.round((economics.annualDepreciation / total) * 100),
      explanation: `Silent capital loss of ${(vehicle.depreciationRate * 100).toFixed(0)}%/year on your car's residual secondary market value.`,
    },
    {
      id: 'finance',
      name: 'Finance & Loan Interest',
      icon: DollarSign,
      color: 'text-[#CCFF00]',
      bgColor: 'bg-[#CCFF00]',
      amount: annualLoanInterest,
      pct: Math.max(1, Math.round((annualLoanInterest / total) * 100)),
      explanation: `Amortized loan cost based on monthly EMI of ${formatINR(economics.monthlyCarPayment)} across ${economics.tenureYears} years.`,
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. SCREEN TITLE */}
      <div className="pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
          EXPENSE ARCHITECTURE
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          Cost Breakdown
        </h1>
      </div>

      {/* 2. HERO METRIC */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#131822] via-[#0E1219] to-[#0A0D12] border border-white/10 shadow-xl space-y-3">
        <div>
          <div className="text-4xl sm:text-5xl font-black text-[#CCFF00] font-mono-numbers flex items-baseline gap-1">
            <span>₹{economics.costPerKm.toFixed(1)}</span>
            <span className="text-lg font-light text-zinc-400 font-sans tracking-normal">
              / km
            </span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block mt-0.5">
            TRUE COST OF OWNERSHIP
          </span>
        </div>

        <div className="pt-2 border-t border-white/8 flex items-baseline justify-between text-xs">
          <span className="text-zinc-400">Annual Outlay:</span>
          <span className="text-white font-bold font-mono-numbers text-base">
            {formatINR(economics.annualTotalCost)} / year
          </span>
        </div>

        {/* Multi-segment stacked progress bar */}
        <div className="h-2.5 w-full rounded-full bg-zinc-800 flex overflow-hidden mt-3">
          {items.map((it) => (
            <div
              key={it.id}
              style={{ width: `${it.pct}%` }}
              className={`${it.bgColor} h-full`}
              title={`${it.name} ${it.pct}%`}
            />
          ))}
        </div>
      </div>

      {/* 3. ITEM LIST (TAP TO EXPAND) */}
      <div className="space-y-2">
        {items.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedItem === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden transition-all"
            >
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-wide">
                      {item.name}
                    </h4>
                    <span className="text-[10px] text-zinc-400 font-mono-numbers">
                      {item.pct}% of total
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-white font-mono-numbers">
                    {formatINR(item.amount)}
                  </span>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
                </div>
              </button>

              {isExpanded && (
                <div className="px-4 pb-3.5 pt-1 border-t border-white/5 text-xs text-zinc-300 leading-relaxed animate-in fade-in">
                  {item.explanation}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
