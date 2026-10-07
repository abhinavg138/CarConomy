import React, { useState } from 'react';
import { Trophy, CheckCircle2, ChevronDown, Plus, X, Sliders, Sparkles, AlertCircle } from 'lucide-react';
import { Vehicle, Driver, FinancialProfile, OwnershipProfile } from '../types';
import { calculateComparison, calculateTrueCost } from '../utils/calculator';
import { formatINR, formatNumber } from '../utils/formatters';
import { CumulativeComparisonChart } from './charts/FinancialCharts';

interface CarComparisonViewProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  finance: FinancialProfile;
  ownership: OwnershipProfile;
  defaultCarIdA?: string;
  defaultCarIdB?: string;
  onSelectCarToOwn?: (vehicle: Vehicle) => void;
  onUpdateOwnership?: (ownership: OwnershipProfile) => void;
  onUpdateFinance?: (finance: FinancialProfile) => void;
}

export const CarComparisonView: React.FC<CarComparisonViewProps> = ({
  vehicles,
  drivers,
  finance,
  ownership,
  defaultCarIdA = 'bmw-3-series',
  defaultCarIdB = 'mercedes-c-class',
  onSelectCarToOwn,
  onUpdateOwnership,
  onUpdateFinance,
}) => {
  const [carAId, setCarAId] = useState(defaultCarIdA);
  const [carBId, setCarBId] = useState(defaultCarIdB);
  const [carCId, setCarCId] = useState<string | null>(null);
  const [showScenarioControls, setShowScenarioControls] = useState(false);

  const carA = vehicles.find((v) => v.id === carAId) || vehicles[0];
  const carB = vehicles.find((v) => v.id === carBId) || vehicles[1];
  const carC = carCId ? vehicles.find((v) => v.id === carCId) : undefined;

  // Authoritative comparison engine
  const comparison = calculateComparison(
    carA,
    carB,
    drivers,
    ownership,
    finance,
    carC
  );

  const { ecoA, ecoB, ecoC, winnerIsA, winnerCar, savings, verdictTitle, verdictExplanation } = comparison;

  // Comparison Rows
  const comparisonSections = [
    {
      sectionTitle: 'PURCHASE & FINANCING',
      rows: [
        {
          label: 'PURCHASE PRICE',
          valA: formatINR(carA.purchasePrice),
          valB: formatINR(carB.purchasePrice),
          valC: carC ? formatINR(carC.purchasePrice) : undefined,
          isBestA: carA.purchasePrice <= carB.purchasePrice,
        },
        {
          label: 'MONTHLY LOAN EMI',
          valA: `${formatINR(ecoA.monthlyCarPayment)}/mo`,
          valB: `${formatINR(ecoB.monthlyCarPayment)}/mo`,
          valC: ecoC ? `${formatINR(ecoC.monthlyCarPayment)}/mo` : undefined,
          isBestA: ecoA.monthlyCarPayment <= ecoB.monthlyCarPayment,
        },
        {
          label: '5-YEAR FINANCING INTEREST',
          valA: formatINR(ecoA.fiveYearInterestTotal),
          valB: formatINR(ecoB.fiveYearInterestTotal),
          valC: ecoC ? formatINR(ecoC.fiveYearInterestTotal) : undefined,
          isBestA: ecoA.fiveYearInterestTotal <= ecoB.fiveYearInterestTotal,
        },
      ],
    },
    {
      sectionTitle: 'RUNNING & ENERGY OUTLAY',
      rows: [
        {
          label: 'ENERGY / FUEL EFFICIENCY',
          valA: ecoA.energyEfficiencyDisplay,
          valB: ecoB.energyEfficiencyDisplay,
          valC: ecoC ? ecoC.energyEfficiencyDisplay : undefined,
          isBestA: (ecoA.annualFuelCost <= ecoB.annualFuelCost),
        },
        {
          label: 'ANNUAL ENERGY / FUEL BURN',
          valA: formatINR(ecoA.annualFuelCost),
          valB: formatINR(ecoB.annualFuelCost),
          valC: ecoC ? formatINR(ecoC.annualFuelCost) : undefined,
          isBestA: ecoA.annualFuelCost <= ecoB.annualFuelCost,
        },
        {
          label: 'ANNUAL MAINTENANCE & WEAR',
          valA: formatINR(ecoA.annualMaintenance + ecoA.annualTyres),
          valB: formatINR(ecoB.annualMaintenance + ecoB.annualTyres),
          valC: ecoC ? formatINR(ecoC.annualMaintenance + ecoC.annualTyres) : undefined,
          isBestA: (ecoA.annualMaintenance + ecoA.annualTyres) <= (ecoB.annualMaintenance + ecoB.annualTyres),
        },
        {
          label: 'ANNUAL COMPREHENSIVE INSURANCE',
          valA: formatINR(ecoA.annualInsurance),
          valB: formatINR(ecoB.annualInsurance),
          valC: ecoC ? formatINR(ecoC.annualInsurance) : undefined,
          isBestA: ecoA.annualInsurance <= ecoB.annualInsurance,
        },
      ],
    },
    {
      sectionTitle: '5-YEAR WEALTH RETENTION & TOTAL COST',
      rows: [
        {
          label: '5-YEAR TOTAL OWNERSHIP COST',
          valA: formatINR(ecoA.fiveYearTotalCost),
          valB: formatINR(ecoB.fiveYearTotalCost),
          valC: ecoC ? formatINR(ecoC.fiveYearTotalCost) : undefined,
          isBestA: ecoA.fiveYearTotalCost <= ecoB.fiveYearTotalCost,
          isHighlight: true,
        },
        {
          label: 'TRUE COST / KM',
          valA: `₹${ecoA.costPerKm.toFixed(1)}/km`,
          valB: `₹${ecoB.costPerKm.toFixed(1)}/km`,
          valC: ecoC ? `₹${ecoC.costPerKm.toFixed(1)}/km` : undefined,
          isBestA: ecoA.costPerKm <= ecoB.costPerKm,
          isHighlight: true,
        },
        {
          label: '5-YEAR ESTIMATED RESALE VALUE',
          valA: formatINR(ecoA.fiveYearValueRemaining),
          valB: formatINR(ecoB.fiveYearValueRemaining),
          valC: ecoC ? formatINR(ecoC.fiveYearValueRemaining) : undefined,
          isBestA: ecoA.fiveYearValueRemaining >= ecoB.fiveYearValueRemaining,
        },
        {
          label: '5-YEAR TOTAL DEPRECIATION LOSS',
          valA: formatINR(ecoA.fiveYearDepreciationTotal),
          valB: formatINR(ecoB.fiveYearDepreciationTotal),
          valC: ecoC ? formatINR(ecoC.fiveYearDepreciationTotal) : undefined,
          isBestA: ecoA.fiveYearDepreciationTotal <= ecoB.fiveYearDepreciationTotal,
        },
      ],
    },
    {
      sectionTitle: 'AFFORDABILITY & CASHFLOW FIT',
      rows: [
        {
          label: 'FINANCIAL FIT STATUS',
          valA: `${ecoA.financialFitTier} (${ecoA.incomeAllocationPercent}%)`,
          valB: `${ecoB.financialFitTier} (${ecoB.incomeAllocationPercent}%)`,
          valC: ecoC ? `${ecoC.financialFitTier} (${ecoC.incomeAllocationPercent}%)` : undefined,
          isBestA: ecoA.incomeAllocationPercent <= ecoB.incomeAllocationPercent,
        },
        {
          label: 'HOUSEHOLD WEAR CONTRIBUTION',
          valA: `+${formatINR(ecoA.householdAdditionalWear)}/yr`,
          valB: `+${formatINR(ecoB.householdAdditionalWear)}/yr`,
          valC: ecoC ? `+${formatINR(ecoC.householdAdditionalWear)}/yr` : undefined,
          isBestA: ecoA.householdAdditionalWear <= ecoB.householdAdditionalWear,
        },
      ],
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. SCREEN TITLE */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
            HEAD-TO-HEAD INTELLIGENCE
          </span>
          <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Which car makes more financial sense?
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Evaluated against your household commute ({formatNumber(ecoA.annualKm)} km/yr) and finance profile.
          </p>
        </div>

        <button
          onClick={() => setShowScenarioControls(!showScenarioControls)}
          className={`p-2 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
            showScenarioControls 
              ? 'bg-[#CCFF00] text-black border-[#CCFF00]' 
              : 'bg-white/5 text-zinc-300 border-white/10 hover:text-white'
          }`}
          title="Adjust comparison scenario"
        >
          <Sliders className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Scenario</span>
        </button>
      </div>

      {/* QUICK SCENARIO ADJUSTMENT DRAWER */}
      {showScenarioControls && (
        <div className="p-4 rounded-3xl bg-[#0F131A] border border-white/15 space-y-3 text-xs animate-in fade-in">
          <div className="flex justify-between items-center pb-2 border-b border-white/10">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#CCFF00]" />
              Scenario Assumptions
            </span>
            <button
              onClick={() => setShowScenarioControls(false)}
              className="text-zinc-400 hover:text-white"
            >
              Close
            </button>
          </div>

          <div className="space-y-3">
            {/* Ownership Tenure */}
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Ownership Horizon</span>
                <span className="text-white font-bold font-mono-numbers">{ownership.ownershipYears} Years</span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={ownership.ownershipYears}
                onChange={(e) => onUpdateOwnership?.({ ...ownership, ownershipYears: Number(e.target.value) })}
                className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Fuel Price */}
            <div className="space-y-1">
              <div className="flex justify-between text-zinc-400">
                <span>Fuel Benchmark Tariff</span>
                <span className="text-white font-bold font-mono-numbers">₹{ownership.fuelPrice.toFixed(1)}/L</span>
              </div>
              <input
                type="range"
                min="85"
                max="125"
                step="1"
                value={ownership.fuelPrice}
                onChange={(e) => onUpdateOwnership?.({ ...ownership, fuelPrice: Number(e.target.value) })}
                className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* 2. CAR SWITCHER SELECTORS (2 OR 3 CARS) */}
      <div className={`grid gap-2 ${carCId ? 'grid-cols-3' : 'grid-cols-2'}`}>
        {/* Slot A */}
        <div className="p-2.5 rounded-2xl bg-[#12161E] border border-white/10 space-y-1">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
            SLOT A
          </span>
          <div className="relative">
            <select
              value={carAId}
              onChange={(e) => setCarAId(e.target.value)}
              className="w-full bg-transparent text-white font-bold text-xs appearance-none focus:outline-none cursor-pointer pr-5 truncate"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id} className="bg-zinc-900 text-white">
                  {v.make} {v.model}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span className="text-[10px] text-zinc-400 font-mono-numbers block">
            {formatINR(carA.purchasePrice)} • {carA.fuelType}
          </span>
        </div>

        {/* Slot B */}
        <div className="p-2.5 rounded-2xl bg-[#12161E] border border-white/10 space-y-1">
          <span className="text-[9px] font-extrabold uppercase tracking-widest text-blue-400 block">
            SLOT B
          </span>
          <div className="relative">
            <select
              value={carBId}
              onChange={(e) => setCarBId(e.target.value)}
              className="w-full bg-transparent text-white font-bold text-xs appearance-none focus:outline-none cursor-pointer pr-5 truncate"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id} className="bg-zinc-900 text-white">
                  {v.make} {v.model}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
          <span className="text-[10px] text-zinc-400 font-mono-numbers block">
            {formatINR(carB.purchasePrice)} • {carB.fuelType}
          </span>
        </div>

        {/* Optional Slot C */}
        {carCId ? (
          <div className="p-2.5 rounded-2xl bg-[#12161E] border border-white/10 space-y-1 relative">
            <div className="flex justify-between items-center">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-purple-400 block">
                SLOT C
              </span>
              <button 
                onClick={() => setCarCId(null)}
                className="text-zinc-500 hover:text-white"
                title="Remove third car"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <div className="relative">
              <select
                value={carCId}
                onChange={(e) => setCarCId(e.target.value)}
                className="w-full bg-transparent text-white font-bold text-xs appearance-none focus:outline-none cursor-pointer pr-5 truncate"
              >
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id} className="bg-zinc-900 text-white">
                    {v.make} {v.model}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <span className="text-[10px] text-zinc-400 font-mono-numbers block">
              {carC ? `${formatINR(carC.purchasePrice)} • ${carC.fuelType}` : ''}
            </span>
          </div>
        ) : (
          <button
            onClick={() => {
              const third = vehicles.find((v) => v.id !== carAId && v.id !== carBId) || vehicles[2];
              setCarCId(third?.id || 'bmw-i4');
            }}
            className="hidden sm:flex p-2.5 rounded-2xl bg-white/5 border border-dashed border-white/15 items-center justify-center gap-1.5 text-zinc-400 hover:text-white hover:border-white/30 transition-all cursor-pointer text-xs font-semibold"
          >
            <Plus className="w-3.5 h-3.5 text-[#CCFF00]" />
            <span>Add Car C</span>
          </button>
        )}
      </div>

      {/* 3. DYNAMIC FINANCIAL VERDICT POD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#172314] via-[#0E150F] to-[#0A0D12] border border-[#CCFF00]/40 shadow-xl space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/15 text-[#CCFF00] text-[10px] font-extrabold uppercase tracking-widest border border-[#CCFF00]/30">
            <Trophy className="w-3 h-3" />
            <span>FINANCIAL VERDICT</span>
          </div>
          <span className="text-[10px] font-bold text-zinc-400 font-mono-numbers">
            {ownership.ownershipYears}-Year Horizon
          </span>
        </div>

        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            {verdictTitle}
          </h2>
          <div className="text-lg font-black text-[#CCFF00] font-mono-numbers mt-0.5">
            Saves {formatINR(savings)} over 5 years
          </div>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed pt-1 border-t border-[#CCFF00]/15">
          {verdictExplanation}
        </p>
      </div>

      {/* CUMULATIVE 5-YEAR CHART */}
      <div className="pt-1">
        <CumulativeComparisonChart
          carAName={`${carA.make} ${carA.model}`}
          carBName={`${carB.make} ${carB.model}`}
          tcoA={ecoA.yearlyCumulativeTCO}
          tcoB={ecoB.yearlyCumulativeTCO}
          winnerIsA={winnerIsA}
        />
      </div>

      {/* 4. COMPARISON PILLARS */}
      <div className="space-y-4 pt-1">
        {comparisonSections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block px-1">
              {section.sectionTitle}
            </span>

            <div className="space-y-2">
              {section.rows.map((row, rIdx) => (
                <div
                  key={rIdx}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    row.isHighlight
                      ? 'bg-[#121824] border-[#CCFF00]/30 shadow-md'
                      : 'bg-[#0F131A] border-white/8'
                  }`}
                >
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-2">
                    {row.label}
                  </span>

                  <div className={`grid gap-2 text-xs ${row.valC ? 'grid-cols-3' : 'grid-cols-2'}`}>
                    {/* Val A */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-500 truncate block">{carA.model}</span>
                      <span className={`font-mono-numbers font-black text-xs sm:text-sm block truncate ${
                        row.isBestA ? 'text-[#CCFF00]' : 'text-zinc-300'
                      }`}>
                        {row.valA}
                      </span>
                    </div>

                    {/* Val B */}
                    <div className="space-y-0.5">
                      <span className="text-[10px] text-zinc-500 truncate block">{carB.model}</span>
                      <span className={`font-mono-numbers font-black text-xs sm:text-sm block truncate ${
                        !row.isBestA ? 'text-[#CCFF00]' : 'text-zinc-300'
                      }`}>
                        {row.valB}
                      </span>
                    </div>

                    {/* Val C */}
                    {row.valC && (
                      <div className="space-y-0.5">
                        <span className="text-[10px] text-zinc-500 truncate block">{carC?.model}</span>
                        <span className="font-mono-numbers font-black text-xs sm:text-sm text-zinc-300 block truncate">
                          {row.valC}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 5. PRIMARY ADOPT ACTION */}
      {onSelectCarToOwn && (
        <button
          onClick={() => onSelectCarToOwn(winnerCar)}
          className="w-full py-4 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#CCFF00]/15 hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px] mt-2"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Adopt {winnerCar.make} {winnerCar.model} into My Garage</span>
        </button>
      )}
    </div>
  );
};
