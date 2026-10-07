import React, { useState } from 'react';
import { 
  Fuel, 
  Wrench, 
  Shield, 
  TrendingDown, 
  DollarSign, 
  ChevronDown, 
  ChevronUp, 
  Gauge, 
  Sliders, 
  Zap, 
  Car, 
  Users, 
  ParkingMeter, 
  Info 
} from 'lucide-react';
import { Vehicle, Driver, FinancialProfile, OwnershipProfile, CalculatedEconomics, DrivingStyle } from '../types';
import { formatINR, formatNumber, formatEnergyTariff, formatEnergyLabel, formatEnergyEfficiency } from '../utils/formatters';
import { YearlyCostBreakdownChart } from './charts/FinancialCharts';

interface CostsViewProps {
  vehicle: Vehicle;
  drivers: Driver[];
  finance: FinancialProfile;
  ownership: OwnershipProfile;
  economics: CalculatedEconomics;
  onUpdateVehicle?: (vehicle: Vehicle) => void;
  onUpdateDrivers?: (drivers: Driver[]) => void;
  onUpdateFinance?: (finance: FinancialProfile) => void;
  onUpdateOwnership?: (ownership: OwnershipProfile) => void;
}

export const CostsView: React.FC<CostsViewProps> = ({
  vehicle,
  drivers,
  finance,
  ownership,
  economics,
  onUpdateVehicle,
  onUpdateDrivers,
  onUpdateFinance,
  onUpdateOwnership,
}) => {
  // Collapsible control sections: DRIVING, ENERGY, USAGE, FINANCING
  const [openSection, setOpenSection] = useState<'NONE' | 'DRIVING' | 'ENERGY' | 'USAGE' | 'FINANCE' | 'BREAKDOWN'>('DRIVING');
  const [expandedBreakdownItem, setExpandedBreakdownItem] = useState<string | null>(null);

  const toggleSection = (section: 'DRIVING' | 'ENERGY' | 'USAGE' | 'FINANCE' | 'BREAKDOWN') => {
    setOpenSection(openSection === section ? 'NONE' : section);
  };

  const isEV = economics.energyType === 'ELECTRIC';
  const total = Math.max(1, economics.annualTotalCost);
  const annualLoanInterest = economics.annualFinancingInterest || Math.round(economics.loan.totalInterest / Math.max(1, economics.tenureYears));

  // Primary driver helper for single-slider adjustment
  const primaryDriver = drivers[0] || {
    id: 'driver-default',
    name: 'You',
    role: 'Me',
    dailyKm: 30,
    cityHighwaySplit: 70,
    drivingStyle: 'MODERATE',
  };

  const handleUpdatePrimaryDriver = (updates: Partial<Driver>) => {
    if (!onUpdateDrivers) return;
    if (drivers.length === 0) {
      onUpdateDrivers([{ ...primaryDriver, ...updates }]);
      return;
    }
    const updated = drivers.map((d, idx) => (idx === 0 ? { ...d, ...updates } : d));
    onUpdateDrivers(updated);
  };

  const items = [
    {
      id: 'fuel',
      name: isEV ? 'Energy Outlay' : 'Fuel Burn',
      icon: isEV ? Zap : Fuel,
      color: isEV ? 'text-[#CCFF00]' : 'text-amber-400',
      bgColor: isEV ? 'bg-[#CCFF00]' : 'bg-amber-400',
      amount: economics.annualFuelCost,
      pct: Math.round((economics.annualFuelCost / total) * 100),
      explanation: isEV
        ? `Energy consumption calculated across ${economics.annualKm.toLocaleString('en-IN')} km at ${economics.energyEfficiencyDisplay} with an electricity tariff of ${economics.energyTariffDisplay}.`
        : `Fuel consumption calculated across ${economics.annualKm.toLocaleString('en-IN')} km at ${economics.effectiveMileage} km/L with fuel price at ${economics.energyTariffDisplay}.`,
    },
    {
      id: 'maintenance',
      name: 'Maintenance & Service',
      icon: Wrench,
      color: 'text-blue-400',
      bgColor: 'bg-blue-400',
      amount: economics.annualMaintenance,
      pct: Math.round((economics.annualMaintenance / total) * 100),
      explanation: `Scheduled service, fluid replacements, plus +${formatINR(economics.householdAdditionalWear)}/yr in additional wear from household commute patterns at ${vehicle.odometerKm.toLocaleString('en-IN')} km odometer.`,
    },
    {
      id: 'insurance',
      name: 'Insurance (IDV)',
      icon: Shield,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-400',
      amount: economics.annualInsurance,
      pct: Math.round((economics.annualInsurance / total) * 100),
      explanation: `Zero-depreciation comprehensive coverage benchmarked to the vehicle's Insured Declared Value (IDV) of ₹${(vehicle.currentValue / 100000).toFixed(1)}L.`,
    },
    {
      id: 'depreciation',
      name: 'Depreciation Loss',
      icon: TrendingDown,
      color: 'text-rose-400',
      bgColor: 'bg-rose-400',
      amount: economics.annualDepreciation,
      pct: Math.round((economics.annualDepreciation / total) * 100),
      explanation: `Silent capital depreciation of ${(vehicle.depreciationRate * 100).toFixed(1)}%/yr on secondary market value.`,
    },
    {
      id: 'finance',
      name: 'Financing & Loan Interest',
      icon: DollarSign,
      color: 'text-purple-400',
      bgColor: 'bg-purple-400',
      amount: annualLoanInterest,
      pct: Math.max(1, Math.round((annualLoanInterest / total) * 100)),
      explanation: `Amortized loan cost based on monthly EMI of ${formatINR(economics.monthlyCarPayment)} across a ${finance.loanTenureYears}-year tenure at ${finance.interestRate}% interest.`,
    },
    {
      id: 'tolls',
      name: 'Parking & Tolls',
      icon: ParkingMeter,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-400',
      amount: ownership.parkingTollsAnnual || 12000,
      pct: Math.max(1, Math.round(((ownership.parkingTollsAnnual || 12000) / total) * 100)),
      explanation: `FASTag tolls, monthly office parking subscriptions, and municipal access fees.`,
    },
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. SCREEN TITLE */}
      <div className="pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
          FINANCIAL CONTROL CENTER
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          Why does your car cost this much?
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Tune your actual commute, energy tariffs, and financing. Calculations update live.
        </p>
      </div>

      {/* 2. DYNAMIC HERO METRIC POD */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#131822] via-[#0E1219] to-[#0A0D12] border border-white/10 shadow-xl space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <div className="text-4xl sm:text-5xl font-black text-[#CCFF00] font-mono-numbers flex items-baseline gap-1">
              <span>₹{economics.costPerKm.toFixed(1)}</span>
              <span className="text-base font-light text-zinc-400 font-sans tracking-normal">
                / km
              </span>
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-zinc-400 block mt-0.5">
              TRUE COST OF OWNERSHIP
            </span>
          </div>

          <div className="text-right">
            <span className="text-xs text-zinc-400 block">Annual Outlay:</span>
            <span className="text-white font-bold font-mono-numbers text-base sm:text-lg">
              {formatINR(economics.annualTotalCost)} / yr
            </span>
            <span className="text-[10px] text-zinc-500 font-mono-numbers block">
              {formatINR(economics.monthlyOwnershipCost)} / month
            </span>
          </div>
        </div>

        {/* Multi-segment stacked progress bar */}
        <div className="h-2.5 w-full rounded-full bg-zinc-800 flex overflow-hidden mt-3">
          {items.map((it) => (
            <div
              key={it.id}
              style={{ width: `${it.pct}%` }}
              className={`${it.bgColor} h-full transition-all duration-300`}
              title={`${it.name}: ${it.pct}%`}
            />
          ))}
        </div>
      </div>

      {/* 3. PROGRESSIVE DISCLOSURE INTERACTIVE CONTROLS */}
      <div className="space-y-2.5">
        {/* SECTION A: DRIVING PROFILE */}
        <div className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden transition-all">
          <button
            onClick={() => toggleSection('DRIVING')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#CCFF00]/15 flex items-center justify-center text-[#CCFF00]">
                <Car className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Driving Profile & Commute
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono-numbers">
                  {economics.householdDailyKm} km/day • {formatNumber(economics.annualKm)} km/yr total
                </span>
              </div>
            </div>
            {openSection === 'DRIVING' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {openSection === 'DRIVING' && (
            <div className="p-4 pt-1 border-t border-white/5 space-y-3.5 text-xs animate-in fade-in">
              {/* Daily km slider */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400 font-medium">Primary Daily Driving</span>
                  <div className="text-right">
                    <span className="text-white font-black font-mono-numbers text-sm">
                      {primaryDriver.dailyKm} km/day
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono-numbers block">
                      Household Total: {formatNumber(economics.annualKm)} km/year
                    </span>
                  </div>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={primaryDriver.dailyKm}
                  onChange={(e) => handleUpdatePrimaryDriver({ dailyKm: Number(e.target.value) })}
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Driving Style Toggle */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
                  <span>Driving Temperament</span>
                  <span className="text-[#CCFF00] font-mono-numbers">
                    Effective: {economics.effectiveMileage} {isEV ? 'km/kWh' : 'km/L'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'] as DrivingStyle[]).map((style) => (
                    <button
                      key={style}
                      onClick={() => handleUpdatePrimaryDriver({ drivingStyle: style })}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                        primaryDriver.drivingStyle === style
                          ? 'bg-[#CCFF00] text-black border-[#CCFF00] font-black'
                          : 'bg-zinc-900 text-zinc-400 border-white/10 hover:border-white/20'
                      }`}
                    >
                      {style}
                    </button>
                  ))}
                </div>
              </div>

              {/* City / Highway Split */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400 font-medium">City / Highway Distribution</span>
                  <span className="text-white font-bold font-mono-numbers">
                    {primaryDriver.cityHighwaySplit}% City • {100 - primaryDriver.cityHighwaySplit}% Hwy
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={primaryDriver.cityHighwaySplit}
                  onChange={(e) => handleUpdatePrimaryDriver({ cityHighwaySplit: Number(e.target.value) })}
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* SECTION B: ENERGY & TARIFF (EV vs ICE branched) */}
        <div className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden transition-all">
          <button
            onClick={() => toggleSection('ENERGY')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${isEV ? 'bg-[#CCFF00]/15 text-[#CCFF00]' : 'bg-amber-400/15 text-amber-400'}`}>
                {isEV ? <Zap className="w-4 h-4" /> : <Fuel className="w-4 h-4" />}
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  {isEV ? 'Electric Energy & Charging' : 'Fuel & Mileage'}
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono-numbers">
                  {economics.energyEfficiencyDisplay} • {economics.energyTariffDisplay}
                </span>
              </div>
            </div>
            {openSection === 'ENERGY' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {openSection === 'ENERGY' && (
            <div className="p-4 pt-1 border-t border-white/5 space-y-3.5 text-xs animate-in fade-in">
              {isEV ? (
                /* EV CONTROLS */
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-zinc-400 font-medium">Electricity Tariff (INR / kWh)</span>
                      <span className="text-[#CCFF00] font-black font-mono-numbers text-sm">
                        ₹{(ownership.electricityPrice || 9.5).toFixed(2)} / kWh
                      </span>
                    </div>
                    <input
                      type="range"
                      min="5.0"
                      max="20.0"
                      step="0.5"
                      value={ownership.electricityPrice || 9.5}
                      onChange={(e) => onUpdateOwnership?.({ ...ownership, electricityPrice: Number(e.target.value) })}
                      className="w-full accent-[#CCFF00] bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono-numbers">
                      <span>Home Solar (₹5.0)</span>
                      <span>Discom Grid (₹9.5)</span>
                      <span>Fast DC Hub (₹20.0)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#121620] border border-white/8 space-y-1">
                    <div className="flex justify-between text-zinc-300">
                      <span>Rated Efficiency:</span>
                      <span className="font-bold text-white font-mono-numbers">{vehicle.expectedMileage} km/kWh</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Energy Consumption:</span>
                      <span className="font-bold text-white font-mono-numbers">{vehicle.energyConsumptionKwhPer100Km || (100 / vehicle.expectedMileage).toFixed(1)} kWh/100 km</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Running Energy Cost:</span>
                      <span className="font-bold text-[#CCFF00] font-mono-numbers">₹{((ownership.electricityPrice || 9.5) / economics.effectiveMileage).toFixed(2)} / km</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* ICE / HYBRID CONTROLS */
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                    <div className="flex justify-between items-baseline">
                      <span className="text-zinc-400 font-medium">Fuel Benchmark Price (INR / Litre)</span>
                      <span className="text-amber-400 font-black font-mono-numbers text-sm">
                        ₹{ownership.fuelPrice.toFixed(1)} / L
                      </span>
                    </div>
                    <input
                      type="range"
                      min="85.0"
                      max="130.0"
                      step="1.0"
                      value={ownership.fuelPrice}
                      onChange={(e) => onUpdateOwnership?.({ ...ownership, fuelPrice: Number(e.target.value) })}
                      className="w-full accent-amber-400 bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-zinc-500 font-mono-numbers">
                      <span>Diesel (₹88)</span>
                      <span>Petrol (₹100)</span>
                      <span>Premium (₹115+)</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-[#121620] border border-white/8 space-y-1">
                    <div className="flex justify-between text-zinc-300">
                      <span>Rated ARAI Mileage:</span>
                      <span className="font-bold text-white font-mono-numbers">{vehicle.expectedMileage} km/L</span>
                    </div>
                    <div className="flex justify-between text-zinc-300">
                      <span>Fuel Cost per km:</span>
                      <span className="font-bold text-amber-400 font-mono-numbers">₹{(ownership.fuelPrice / economics.effectiveMileage).toFixed(2)} / km</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* SECTION C: VEHICLE USAGE & ODOMETER */}
        <div className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden transition-all">
          <button
            onClick={() => toggleSection('USAGE')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/15 flex items-center justify-center text-blue-400">
                <Gauge className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Odometer & Ownership Horizon
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono-numbers">
                  {vehicle.odometerKm.toLocaleString('en-IN')} km odometer • {ownership.ownershipYears}-Year horizon
                </span>
              </div>
            </div>
            {openSection === 'USAGE' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {openSection === 'USAGE' && (
            <div className="p-4 pt-1 border-t border-white/5 space-y-3.5 text-xs animate-in fade-in">
              {/* Odometer Adjustment Slider */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400 font-medium">Current Odometer Reading</span>
                  <span className="text-white font-black font-mono-numbers text-sm">
                    {vehicle.odometerKm.toLocaleString('en-IN')} km
                  </span>
                </div>
                <input
                  type="range"
                  min="5000"
                  max="150000"
                  step="2500"
                  value={vehicle.odometerKm}
                  onChange={(e) => onUpdateVehicle?.({ ...vehicle, odometerKm: Number(e.target.value) })}
                  className="w-full accent-blue-400 bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <span className="text-[10px] text-zinc-500 block">
                  Higher mileage triggers service & suspension wear milestones.
                </span>
              </div>

              {/* Ownership Tenure Slider (1-5 Years strictly bounded) */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400 font-medium">Planned Ownership Period</span>
                  <span className="text-[#CCFF00] font-black font-mono-numbers text-sm">
                    {ownership.ownershipYears} {ownership.ownershipYears === 1 ? 'Year' : 'Years'}
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="1"
                  value={ownership.ownershipYears}
                  onChange={(e) => onUpdateOwnership?.({ ...ownership, ownershipYears: Number(e.target.value) })}
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono-numbers">
                  <span>1 Yr</span>
                  <span>2 Yrs</span>
                  <span>3 Yrs</span>
                  <span>4 Yrs</span>
                  <span>5 Yrs</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* SECTION D: FINANCING & DOWN PAYMENT */}
        <div className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden transition-all">
          <button
            onClick={() => toggleSection('FINANCE')}
            className="w-full p-4 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-purple-500/15 flex items-center justify-center text-purple-400">
                <DollarSign className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Financing, Loan & Down Payment
                </h3>
                <span className="text-[10px] text-zinc-400 font-mono-numbers">
                  EMI: {formatINR(economics.monthlyCarPayment)}/mo • {finance.interestRate}% for {finance.loanTenureYears} yrs
                </span>
              </div>
            </div>
            {openSection === 'FINANCE' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {openSection === 'FINANCE' && (
            <div className="p-4 pt-1 border-t border-white/5 space-y-3.5 text-xs animate-in fade-in">
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-zinc-400 font-medium">Down Payment Contribution</span>
                  <span className="text-white font-black font-mono-numbers text-sm">
                    {formatINR(finance.downPayment)} ({Math.round((finance.downPayment / vehicle.purchasePrice) * 100)}%)
                  </span>
                </div>
                <input
                  type="range"
                  min={Math.round(vehicle.purchasePrice * 0.1)}
                  max={Math.round(vehicle.purchasePrice * 0.8)}
                  step="50000"
                  value={finance.downPayment}
                  onChange={(e) => onUpdateFinance?.({ ...finance, downPayment: Number(e.target.value) })}
                  className="w-full accent-purple-400 bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-400 block">Interest Rate (% p.a.)</span>
                  <input
                    type="number"
                    step="0.1"
                    min="6.0"
                    max="15.0"
                    value={finance.interestRate}
                    onChange={(e) => onUpdateFinance?.({ ...finance, interestRate: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2 text-white font-bold font-mono-numbers text-sm"
                  />
                </div>
                <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                  <span className="text-[10px] text-zinc-400 block">Loan Tenure (Years)</span>
                  <select
                    value={finance.loanTenureYears}
                    onChange={(e) => onUpdateFinance?.({ ...finance, loanTenureYears: Number(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/10 rounded-xl p-2 text-white font-bold text-sm cursor-pointer"
                  >
                    {[1, 2, 3, 4, 5, 7].map((y) => (
                      <option key={y} value={y}>{y} Years</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. 5-YEAR MULTI-YEAR CHART */}
      {economics.yearlyData && economics.yearlyData.length > 0 && (
        <div className="pt-2">
          <YearlyCostBreakdownChart yearlyData={economics.yearlyData} />
        </div>
      )}

      {/* 5. DETAILED EXPENDITURE ACCORDIONS */}
      <div className="space-y-2 pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-400 block px-1">
          DETAILED COST BREAKDOWN
        </span>
        {items.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedBreakdownItem === item.id;

          return (
            <div
              key={item.id}
              className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden transition-all"
            >
              <button
                onClick={() => setExpandedBreakdownItem(isExpanded ? null : item.id)}
                className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer hover:bg-white/5 transition-colors"
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
                      {item.pct}% of total outlay
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
