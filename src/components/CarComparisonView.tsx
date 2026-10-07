import React, { useState } from 'react';
import { Trophy, CheckCircle2, ChevronDown } from 'lucide-react';
import { Vehicle, Driver, FinancialProfile, OwnershipProfile } from '../types';
import { calculateComparison } from '../utils/calculator';
import { formatINR } from '../utils/formatters';

import { CumulativeComparisonChart } from './charts/FinancialCharts';

interface CarComparisonViewProps {
  vehicles: Vehicle[];
  drivers: Driver[];
  finance: FinancialProfile;
  ownership: OwnershipProfile;
  defaultCarIdA?: string;
  defaultCarIdB?: string;
  onSelectCarToOwn?: (vehicle: Vehicle) => void;
}

export const CarComparisonView: React.FC<CarComparisonViewProps> = ({
  vehicles,
  drivers,
  finance,
  ownership,
  defaultCarIdA = 'bmw-3-series',
  defaultCarIdB = 'mercedes-c-class',
  onSelectCarToOwn,
}) => {
  const [carAId, setCarAId] = useState(defaultCarIdA);
  const [carBId, setCarBId] = useState(defaultCarIdB);

  const carA = vehicles.find((v) => v.id === carAId) || vehicles[0];
  const carB = vehicles.find((v) => v.id === carBId) || vehicles[1];

  // Authoritative comparison engine
  const { ecoA, ecoB, winnerIsA, winnerCar, savings } = calculateComparison(
    carA,
    carB,
    drivers,
    ownership,
    finance
  );

  const comparisonRows = [
    {
      label: '5-YEAR OWNERSHIP COST',
      valA: formatINR(ecoA.fiveYearTotalCost),
      valB: formatINR(ecoB.fiveYearTotalCost),
      numA: ecoA.fiveYearTotalCost,
      numB: ecoB.fiveYearTotalCost,
      isBetterA: ecoA.fiveYearTotalCost < ecoB.fiveYearTotalCost,
    },
    {
      label: 'TRUE COST / KM',
      valA: `₹${ecoA.costPerKm.toFixed(1)}/km`,
      valB: `₹${ecoB.costPerKm.toFixed(1)}/km`,
      numA: ecoA.costPerKm,
      numB: ecoB.costPerKm,
      isBetterA: ecoA.costPerKm < ecoB.costPerKm,
    },
    {
      label: '5-YEAR RESALE VALUE',
      valA: formatINR(ecoA.fiveYearValueRemaining),
      valB: formatINR(ecoB.fiveYearValueRemaining),
      numA: ecoA.fiveYearValueRemaining,
      numB: ecoB.fiveYearValueRemaining,
      isBetterA: ecoA.fiveYearValueRemaining > ecoB.fiveYearValueRemaining,
    },
    {
      label: 'HOUSEHOLD DRIVER WEAR IMPACT',
      valA: `+${formatINR(ecoA.householdAdditionalWear)}/yr`,
      valB: `+${formatINR(ecoB.householdAdditionalWear)}/yr`,
      numA: ecoA.householdAdditionalWear,
      numB: ecoB.householdAdditionalWear,
      isBetterA: ecoA.householdAdditionalWear <= ecoB.householdAdditionalWear,
    },
    {
      label: 'EFFECTIVE REAL-WORLD MILEAGE',
      valA: `${ecoA.effectiveMileage} km/L`,
      valB: `${ecoB.effectiveMileage} km/L`,
      numA: ecoA.effectiveMileage,
      numB: ecoB.effectiveMileage,
      isBetterA: ecoA.effectiveMileage > ecoB.effectiveMileage,
    },
    {
      label: 'FINANCIAL AFFORDABILITY FIT',
      valA: `${ecoA.financialFitTier} (${ecoA.incomeAllocationPercent}%)`,
      valB: `${ecoB.financialFitTier} (${ecoB.incomeAllocationPercent}%)`,
      numA: ecoA.incomeAllocationPercent,
      numB: ecoB.incomeAllocationPercent,
      isBetterA: ecoA.incomeAllocationPercent < ecoB.incomeAllocationPercent,
    },
    {
      label: 'ANNUAL FUEL BURN',
      valA: formatINR(ecoA.annualFuelCost),
      valB: formatINR(ecoB.annualFuelCost),
      numA: ecoA.annualFuelCost,
      numB: ecoB.annualFuelCost,
      isBetterA: ecoA.annualFuelCost < ecoB.annualFuelCost,
    },
    {
      label: 'ANNUAL MAINTENANCE & TYRES',
      valA: formatINR(ecoA.annualMaintenance + ecoA.annualTyres),
      valB: formatINR(ecoB.annualMaintenance + ecoB.annualTyres),
      numA: ecoA.annualMaintenance + ecoA.annualTyres,
      numB: ecoB.annualMaintenance + ecoB.annualTyres,
      isBetterA: (ecoA.annualMaintenance + ecoA.annualTyres) < (ecoB.annualMaintenance + ecoB.annualTyres),
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. SCREEN QUESTION */}
      <div className="pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
          HEAD-TO-HEAD INTELLIGENCE
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          Which car makes more financial sense?
        </h1>
      </div>

      {/* 2. COMPACT CAR SWITCHERS */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="relative">
          <select
            value={carAId}
            onChange={(e) => setCarAId(e.target.value)}
            className="w-full bg-[#12161E] text-white font-bold text-xs p-2.5 rounded-2xl border border-white/10 appearance-none focus:outline-none cursor-pointer pr-6 truncate"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id} className="bg-zinc-900 text-white">
                {v.make} {v.model}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <div className="relative">
          <select
            value={carBId}
            onChange={(e) => setCarBId(e.target.value)}
            className="w-full bg-[#12161E] text-white font-bold text-xs p-2.5 rounded-2xl border border-white/10 appearance-none focus:outline-none cursor-pointer pr-6 truncate"
          >
            {vehicles.map((v) => (
              <option key={v.id} value={v.id} className="bg-zinc-900 text-white">
                {v.make} {v.model}
              </option>
            ))}
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-zinc-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      {/* 3. PROMINENT WINNER POD */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#172314] via-[#0E150F] to-[#0A0D12] border border-[#CCFF00]/40 shadow-xl text-center space-y-1 relative overflow-hidden">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#CCFF00]/15 text-[#CCFF00] text-[10px] font-extrabold uppercase tracking-widest border border-[#CCFF00]/30">
          <Trophy className="w-3 h-3" />
          <span>VERDICT</span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight pt-1">
          {winnerCar.make.toUpperCase()} {winnerCar.model.toUpperCase()} WINS
        </h2>

        <p className="text-sm font-black text-[#CCFF00] font-mono-numbers">
          {formatINR(savings)} cheaper over 5 years
        </p>
      </div>

      {/* CUMULATIVE 5-YEAR CHART */}
      <CumulativeComparisonChart
        carAName={carA.model}
        carBName={carB.model}
        tcoA={ecoA.yearlyCumulativeTCO}
        tcoB={ecoB.yearlyCumulativeTCO}
        winnerIsA={winnerIsA}
      />

      {/* 4. VERTICAL COMPARISON CARDS */}
      <div className="space-y-2.5">
        {comparisonRows.map((row, idx) => {
          const maxVal = Math.max(row.numA, row.numB, 1);
          const barPctA = Math.round((row.numA / maxVal) * 100);
          const barPctB = Math.round((row.numB / maxVal) * 100);

          return (
            <div key={idx} className="p-3.5 rounded-2xl bg-[#0F131A] border border-white/8 space-y-2">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">
                {row.label}
              </span>

              {/* Bar for Car A */}
              <div className="space-y-1">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold truncate max-w-[140px] ${row.isBetterA ? 'text-white' : 'text-zinc-400'}`}>
                    {carA.model}
                  </span>
                  <span className={`font-bold font-mono-numbers ${row.isBetterA ? 'text-[#CCFF00]' : 'text-zinc-300'}`}>
                    {row.valA}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barPctA}%` }}
                    className={`h-full rounded-full ${row.isBetterA ? 'bg-[#CCFF00]' : 'bg-zinc-500'}`}
                  />
                </div>
              </div>

              {/* Bar for Car B */}
              <div className="space-y-1 pt-1">
                <div className="flex justify-between items-center text-xs">
                  <span className={`font-semibold truncate max-w-[140px] ${!row.isBetterA ? 'text-white' : 'text-zinc-400'}`}>
                    {carB.model}
                  </span>
                  <span className={`font-bold font-mono-numbers ${!row.isBetterA ? 'text-[#CCFF00]' : 'text-zinc-300'}`}>
                    {row.valB}
                  </span>
                </div>
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    style={{ width: `${barPctB}%` }}
                    className={`h-full rounded-full ${!row.isBetterA ? 'bg-[#CCFF00]' : 'bg-zinc-500'}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. PRIMARY ACTION */}
      {onSelectCarToOwn && (
        <button
          onClick={() => onSelectCarToOwn(winnerCar)}
          className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#CCFF00]/15 hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Adopt {winnerCar.model} into My Garage</span>
        </button>
      )}
    </div>
  );
};
