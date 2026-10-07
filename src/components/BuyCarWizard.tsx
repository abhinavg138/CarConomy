import React, { useState, useMemo } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Sliders, 
  Gauge, 
  RotateCcw, 
  Scale, 
  CheckCircle2, 
  Search 
} from 'lucide-react';
import { Vehicle, Driver, FinancialProfile, OwnershipProfile } from '../types';
import { calculateTrueCost } from '../utils/calculator';
import { formatINR } from '../utils/formatters';

interface BuyCarWizardProps {
  vehicles: Vehicle[];
  onSelectCarToOwn: (vehicle: Vehicle) => void;
  initialFinance: FinancialProfile;
  initialOwnership: OwnershipProfile;
  initialDrivers: Driver[];
  onNavigateCompare?: (carAId: string, carBId: string) => void;
}

export const BuyCarWizard: React.FC<BuyCarWizardProps> = ({
  vehicles,
  onSelectCarToOwn,
  initialFinance,
  initialOwnership,
  onNavigateCompare,
}) => {
  const [selectedCarId, setSelectedCarId] = useState<string>(vehicles[0]?.id || 'bmw-3-series');
  const [isPersonalizing, setIsPersonalizing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Expected mileage override
  const [customMileage, setCustomMileage] = useState<number | null>(null);

  // Personalization fields
  const [dailyKm, setDailyKm] = useState(40);
  const [city, setCity] = useState(initialOwnership.city || 'NCR / Delhi');
  const [fuelPrice, setFuelPrice] = useState(initialOwnership.fuelPrice || 100);
  const [ownershipYears, setOwnershipYears] = useState(initialOwnership.ownershipYears || 5);
  const [downPayment, setDownPayment] = useState(1500000);
  const [loanTenureYears, setLoanTenureYears] = useState(5);
  const [householdIncome, setHouseholdIncome] = useState(initialFinance.householdIncome || 350000);
  const [existingEmis, setExistingEmis] = useState(initialFinance.existingEmis || 55000);

  const selectedCar = vehicles.find((v) => v.id === selectedCarId) || vehicles[0];

  const activeExpectedMileage = Number((customMileage ?? selectedCar.expectedMileage).toFixed(1));
  const isEV = selectedCar.fuelType === 'EV';
  const mileageUnit = isEV ? 'km/kWh' : 'km/L';
  const factoryARAI = selectedCar.expectedMileage;

  // Filtered cars for quick search
  const filteredVehicles = useMemo(() => {
    if (!searchQuery.trim()) return vehicles;
    const q = searchQuery.toLowerCase();
    return vehicles.filter(
      (c) => c.make.toLowerCase().includes(q) || c.model.toLowerCase().includes(q)
    );
  }, [vehicles, searchQuery]);

  // Construct simulated vehicle & profiles
  const simulatedCar: Vehicle = useMemo(() => ({
    ...selectedCar,
    expectedMileage: activeExpectedMileage,
  }), [selectedCar, activeExpectedMileage]);

  const simulatedDrivers: Driver[] = useMemo(() => [
    {
      id: 'buy-driver-1',
      name: 'Primary Driver',
      role: 'Me',
      dailyKm,
      cityHighwaySplit: 70,
      drivingStyle: 'MODERATE',
    },
  ], [dailyKm]);

  const simulatedOwnership: OwnershipProfile = useMemo(() => ({
    ...initialOwnership,
    annualKm: dailyKm * 365,
    fuelPrice,
    ownershipYears,
    city,
  }), [initialOwnership, dailyKm, fuelPrice, ownershipYears, city]);

  const simulatedFinance: FinancialProfile = useMemo(() => ({
    ...initialFinance,
    householdIncome,
    monthlyIncome: householdIncome,
    existingEmis,
    downPayment,
    loanTenureYears,
  }), [initialFinance, householdIncome, existingEmis, downPayment, loanTenureYears]);

  // Authoritative calculation in BUYING_CAR mode
  const economics = useMemo(() => calculateTrueCost(
    simulatedCar,
    simulatedDrivers,
    simulatedOwnership,
    simulatedFinance,
    'BUYING_CAR'
  ), [simulatedCar, simulatedDrivers, simulatedOwnership, simulatedFinance]);

  const handleSelectCar = (car: Vehicle) => {
    setSelectedCarId(car.id);
    setCustomMileage(null);
    setDownPayment(Math.round(car.purchasePrice * 0.25));
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. SCREEN QUESTION */}
      <div className="pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
          PRE-PURCHASE AFFORDABILITY
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          Can I afford this car?
        </h1>
      </div>

      {/* 2. CHOOSE A CAR (HORIZONTAL SCROLLING CHIPS) */}
      <div className="space-y-2">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search make or model..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#12161E] border border-white/10 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#CCFF00]/50"
          />
        </div>

        <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar">
          {filteredVehicles.map((car) => {
            const isSelected = car.id === selectedCarId;
            return (
              <button
                key={car.id}
                onClick={() => handleSelectCar(car)}
                className={`p-2.5 rounded-2xl border text-left shrink-0 w-36 transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#18212D] border-[#CCFF00] shadow-md shadow-[#CCFF00]/15 ring-1 ring-[#CCFF00]'
                    : 'bg-[#101318] border-white/8 hover:border-white/20'
                }`}
              >
                <div className="h-16 w-full rounded-xl overflow-hidden bg-zinc-900 mb-1.5">
                  <img src={car.image} alt={car.model} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h4 className="text-xs font-bold text-white truncate leading-tight">
                  {car.make} {car.model}
                </h4>
                <span className="text-[10px] text-zinc-400 font-mono-numbers block mt-0.5">
                  {formatINR(car.purchasePrice)}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. PRIMARY HERO: MONTHLY COMMITMENT & AFFORDABILITY FIT */}
      <div className="p-6 rounded-3xl bg-gradient-to-b from-[#131922] via-[#0E1219] to-[#0A0D12] border border-white/10 shadow-xl space-y-4">
        <div>
          <span className="text-xs font-medium text-zinc-400 block">
            {selectedCar.make} {selectedCar.model} • Ex-showroom {formatINR(selectedCar.purchasePrice)}
          </span>
          <div className="text-3xl sm:text-4xl font-black text-[#CCFF00] font-mono-numbers mt-1 flex items-baseline gap-1.5">
            <span>{formatINR(economics.totalMonthlyCarCommitment)}</span>
            <span className="text-sm font-light text-zinc-400 font-sans tracking-normal">
              / month
            </span>
          </div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block mt-0.5">
            ESTIMATED TOTAL MONTHLY CAR COST
          </span>
        </div>

        {/* Fit Badge & Income Share */}
        <div className="pt-3 border-t border-white/8 space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black tracking-wider uppercase border ${
              economics.financialFitTier === 'COMFORTABLE'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : economics.financialFitTier === 'STRETCHED'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/30'
            }`}>
              {economics.financialFitTier}
            </span>
            <span className="text-xs text-zinc-300 font-bold font-mono-numbers">
              {economics.incomeAllocationPercent}% of household income
            </span>
          </div>

          <p className="text-xs text-zinc-300 leading-snug">
            {economics.financialFitTier === 'COMFORTABLE'
              ? 'Healthy cashflow buffer with ample room for savings and investments.'
              : economics.financialFitTier === 'STRETCHED'
              ? 'Comfortable, but this car will consume a large part of your monthly income.'
              : 'High financial commitment: EMI and maintenance exceed 36% of monthly income.'}
          </p>
        </div>

        {/* 5-Year Cost & Cost/km */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block font-medium">5-Year Total Cost</span>
            <span className="text-lg font-black text-white font-mono-numbers mt-0.5 block">
              {formatINR(economics.fiveYearTotalCost)}
            </span>
          </div>

          <div className="p-3 rounded-2xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block font-medium">Estimated Cost / km</span>
            <span className="text-lg font-black text-white font-mono-numbers mt-0.5 block">
              ₹{economics.costPerKm.toFixed(1)}/km
            </span>
          </div>
        </div>
      </div>

      {/* 4. EXPECTED MILEAGE CONTROLLER (COMPACT MOBILE DESIGN) */}
      <div className="p-4 rounded-2xl bg-[#0F131A] border border-white/8 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-4 h-4 text-[#CCFF00]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Expected Mileage
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm font-black text-[#CCFF00] font-mono-numbers">
              {activeExpectedMileage} {mileageUnit}
            </span>
            {customMileage !== null && (
              <button
                onClick={() => setCustomMileage(null)}
                className="text-[10px] text-zinc-400 hover:text-white flex items-center gap-0.5 cursor-pointer"
                title="Reset to ARAI"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>

        <input
          type="range"
          min={isEV ? 3.0 : 6.0}
          max={isEV ? 9.5 : 28.0}
          step="0.5"
          value={activeExpectedMileage}
          onChange={(e) => setCustomMileage(Number(e.target.value))}
          className="w-full accent-[#CCFF00] bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
        />

        {/* 3 Quick Chips */}
        <div className="flex gap-1.5 pt-0.5 text-[10px]">
          <button
            onClick={() => setCustomMileage(factoryARAI)}
            className={`flex-1 py-1 rounded-lg border font-semibold ${
              activeExpectedMileage === factoryARAI
                ? 'bg-[#CCFF00]/15 text-[#CCFF00] border-[#CCFF00]/30'
                : 'bg-zinc-900 text-zinc-400 border-white/5'
            }`}
          >
            ARAI ({factoryARAI})
          </button>
          <button
            onClick={() => setCustomMileage(Number((factoryARAI * 0.8).toFixed(1)))}
            className="flex-1 py-1 rounded-lg bg-zinc-900 text-zinc-400 border border-white/5 hover:text-white"
          >
            City Traffic (-20%)
          </button>
          <button
            onClick={() => setCustomMileage(Number((factoryARAI * 1.15).toFixed(1)))}
            className="flex-1 py-1 rounded-lg bg-zinc-900 text-zinc-400 border border-white/5 hover:text-white"
          >
            Highway (+15%)
          </button>
        </div>
      </div>

      {/* 5. PRIMARY CTAS */}
      <div className="space-y-2 pt-1">
        <button
          onClick={() => onNavigateCompare?.(selectedCar.id, 'mercedes-c-class')}
          className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#CCFF00]/15 hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          <Scale className="w-4 h-4" />
          <span>Compare Options</span>
        </button>

        <button
          onClick={() => onSelectCarToOwn(simulatedCar)}
          className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-xs border border-white/10 transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
        >
          <CheckCircle2 className="w-4 h-4 text-[#CCFF00]" />
          <span>Adopt {selectedCar.model} into My Garage</span>
        </button>
      </div>

      {/* 6. PROGRESSIVE DISCLOSURE: PERSONALIZE */}
      <div className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden">
        <button
          onClick={() => setIsPersonalizing(!isPersonalizing)}
          className="w-full p-4 flex items-center justify-between text-left cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-[#CCFF00]" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              {isPersonalizing ? 'Hide Assumptions' : 'Personalize Assumptions'}
            </span>
          </div>
          {isPersonalizing ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
        </button>

        {isPersonalizing && (
          <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-4 text-xs animate-in fade-in">
            {/* Daily Commute */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Daily Commute</span>
                <span className="text-white font-bold font-mono-numbers">{dailyKm} km/day</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                step="5"
                value={dailyKm}
                onChange={(e) => setDailyKm(Number(e.target.value))}
                className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Down Payment */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Down Payment</span>
                <span className="text-white font-bold font-mono-numbers">{formatINR(downPayment)}</span>
              </div>
              <input
                type="range"
                min={Math.round(selectedCar.purchasePrice * 0.1)}
                max={Math.round(selectedCar.purchasePrice * 0.7)}
                step="50000"
                value={downPayment}
                onChange={(e) => setDownPayment(Number(e.target.value))}
                className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Loan Tenure */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Loan Tenure</span>
                <span className="text-white font-bold font-mono-numbers">{loanTenureYears} Years</span>
              </div>
              <input
                type="range"
                min="3"
                max="7"
                step="1"
                value={loanTenureYears}
                onChange={(e) => setLoanTenureYears(Number(e.target.value))}
                className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Monthly Household Income */}
            <div>
              <div className="flex justify-between text-zinc-400 mb-1">
                <span>Monthly Household Income</span>
                <span className="text-white font-bold font-mono-numbers">{formatINR(householdIncome)}/mo</span>
              </div>
              <input
                type="range"
                min="100000"
                max="1000000"
                step="25000"
                value={householdIncome}
                onChange={(e) => setHouseholdIncome(Number(e.target.value))}
                className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
