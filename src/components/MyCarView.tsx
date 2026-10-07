import React, { useState } from 'react';
import { 
  ShieldCheck, 
  ChevronDown, 
  ChevronUp, 
  Plus,
  Camera,
  Box,
  Wrench,
  TrendingDown,
  DollarSign,
  Users,
  Info,
  X,
  Gauge,
  Calendar,
  Fuel,
  FileText
} from 'lucide-react';
import { Vehicle, CalculatedEconomics, OwnershipProfile } from '../types';
import { ThreeCarViewer } from './ThreeCarViewer';
import { formatINR } from '../utils/formatters';

interface MyCarViewProps {
  vehicle: Vehicle;
  allVehicles: Vehicle[];
  economics: CalculatedEconomics;
  ownership: OwnershipProfile;
  onSelectVehicle: (id: string) => void;
  onOpenAddCar: () => void;
  onUpdateVehicle: (updated: Vehicle) => void;
  onOpenKeepSell: () => void;
  onNavigateTab?: (tab: string) => void;
}

export const MyCarView: React.FC<MyCarViewProps> = ({
  vehicle,
  allVehicles,
  economics,
  onSelectVehicle,
  onOpenAddCar,
  onOpenKeepSell,
  onNavigateTab,
}) => {
  const [viewMode, setViewMode] = useState<'STUDIO_PHOTO' | '3D_VIEWER'>('STUDIO_PHOTO');
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isSpecsOpen, setIsSpecsOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const isKeep = economics.keepSellDecision === 'KEEP';

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* 1. TOP CAR SWITCHER & ADD CAR */}
      <div className="flex items-center justify-between gap-2.5 pb-0.5">
        <div className="relative flex-1">
          <select
            value={vehicle.id}
            onChange={(e) => onSelectVehicle(e.target.value)}
            className="w-full bg-[#12161E] text-white font-bold text-xs sm:text-sm px-3.5 py-2.5 rounded-2xl border border-white/10 appearance-none focus:outline-none focus:border-[#CCFF00]/50 cursor-pointer pr-8 truncate"
          >
            {allVehicles.map((v) => (
              <option key={v.id} value={v.id} className="bg-zinc-900 text-white">
                {v.make} {v.model} ({v.year})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-zinc-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        <button
          onClick={onOpenAddCar}
          className="px-3.5 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 shrink-0 cursor-pointer min-h-[42px] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#CCFF00]" />
          <span>Add Car</span>
        </button>
      </div>

      {/* 2. DIGITAL GARAGE HERO SHOWCASE (~35% SCREEN HEIGHT) */}
      <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-b from-[#131822] via-[#0D1117] to-[#0A0D12] shadow-xl group">
        {viewMode === '3D_VIEWER' ? (
          <div className="h-60 sm:h-72 w-full">
            <ThreeCarViewer
              carName={`${vehicle.make} ${vehicle.model}`}
              variant={vehicle.variant}
              year={vehicle.year}
              initialColor={vehicle.color}
            />
          </div>
        ) : (
          <div 
            onClick={() => setIsSpecsOpen(true)}
            className="relative h-60 sm:h-72 w-full overflow-hidden cursor-pointer"
            title="Tap to view vehicle specifications"
          >
            <img
              src={vehicle.image}
              alt={`${vehicle.make} ${vehicle.model}`}
              className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D12] via-transparent to-black/20 pointer-events-none" />
            
            {/* Tap to inspect badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-black/70 backdrop-blur-md text-[10px] font-bold text-zinc-300 border border-white/10">
              <Info className="w-3 h-3 text-[#CCFF00]" />
              <span>Tap for specs</span>
            </div>
          </div>
        )}

        {/* View mode toggle button overlay */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1 bg-black/60 backdrop-blur-md p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setViewMode('STUDIO_PHOTO')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === 'STUDIO_PHOTO'
                ? 'bg-white/20 text-white'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Camera className="w-3 h-3" />
            <span>Photo</span>
          </button>
          <button
            onClick={() => setViewMode('3D_VIEWER')}
            className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-all cursor-pointer flex items-center gap-1 ${
              viewMode === '3D_VIEWER'
                ? 'bg-[#CCFF00] text-black font-extrabold'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Box className="w-3 h-3" />
            <span>3D</span>
          </button>
        </div>
      </div>

      {/* 3. VEHICLE NAME & KEY IDENTIFIERS */}
      <div className="text-center pt-0.5">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {vehicle.make.toUpperCase()} {vehicle.model.toUpperCase()}
        </h2>
        <span className="text-xs text-zinc-400 font-medium block mt-0.5">
          {vehicle.variant} • {vehicle.year} • {vehicle.odometerKm.toLocaleString('en-IN')} km
        </span>
      </div>

      {/* 4. DOMINANT TWIN FINANCIAL METRICS */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3.5 rounded-2xl bg-[#0F131A] border border-white/8 text-center">
          <span className="text-2xl sm:text-3xl font-black text-white font-mono-numbers block">
            {formatINR(vehicle.currentValue)}
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1 block">
            CURRENT MARKET VALUE
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-[#0F131A] border border-white/8 text-center">
          <span className="text-2xl sm:text-3xl font-black text-[#CCFF00] font-mono-numbers block">
            ₹{economics.costPerKm.toFixed(1)}/km
          </span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mt-1 block">
            TRUE COST / KM
          </span>
        </div>
      </div>

      {/* 5. FAST-ACCESS ACTION TILES (4 TOUCH-FRIENDLY TILES) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        {/* Tile 1: Keep or Sell */}
        <button
          onClick={onOpenKeepSell}
          className="p-3 rounded-2xl bg-[#121620] hover:bg-[#18202E] border border-white/10 hover:border-[#CCFF00]/40 transition-all text-left flex flex-col justify-between min-h-[78px] cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
            <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-md ${
              isKeep ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
            }`}>
              {economics.keepSellDecision}
            </span>
          </div>
          <div>
            <span className="text-xs font-black text-white block">Keep or Sell</span>
            <span className="text-[10px] text-zinc-400 block">12M Verdict</span>
          </div>
        </button>

        {/* Tile 2: Service Due */}
        <button
          onClick={() => onNavigateTab?.('SERVICES')}
          className="p-3 rounded-2xl bg-[#121620] hover:bg-[#18202E] border border-white/10 hover:border-blue-400/40 transition-all text-left flex flex-col justify-between min-h-[78px] cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <Wrench className="w-4 h-4 text-blue-400" />
            <span className="text-[10px] font-bold text-blue-400 font-mono-numbers">
              ~3 Mos
            </span>
          </div>
          <div>
            <span className="text-xs font-black text-white block">Service Due</span>
            <span className="text-[10px] text-zinc-400 block">{formatINR(vehicle.maintenanceEstimate)} est.</span>
          </div>
        </button>

        {/* Tile 3: Ownership Costs */}
        <button
          onClick={() => onNavigateTab?.('COSTS')}
          className="p-3 rounded-2xl bg-[#121620] hover:bg-[#18202E] border border-white/10 hover:border-amber-400/40 transition-all text-left flex flex-col justify-between min-h-[78px] cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <DollarSign className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 font-mono-numbers">
              {formatINR(economics.annualTotalCost)}
            </span>
          </div>
          <div>
            <span className="text-xs font-black text-white block">Ownership Costs</span>
            <span className="text-[10px] text-zinc-400 block">4 Cost Pillars</span>
          </div>
        </button>

        {/* Tile 4: Drivers */}
        <button
          onClick={() => onNavigateTab?.('DRIVERS')}
          className="p-3 rounded-2xl bg-[#121620] hover:bg-[#18202E] border border-white/10 hover:border-purple-400/40 transition-all text-left flex flex-col justify-between min-h-[78px] cursor-pointer"
        >
          <div className="flex items-center justify-between w-full">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-[10px] font-bold text-purple-400 font-mono-numbers">
              +{formatINR(economics.householdAdditionalWear)}
            </span>
          </div>
          <div>
            <span className="text-xs font-black text-white block">Driver Impact</span>
            <span className="text-[10px] text-zinc-400 block">Commute Wear</span>
          </div>
        </button>
      </div>

      {/* 6. SECONDARY EXPANDABLE SECTIONS (COLLAPSED BY DEFAULT) */}
      <div className="space-y-2 pt-1">
        {/* Accordion 1: ODOMETER & REGISTRATION */}
        <div className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden">
          <button
            onClick={() => toggleSection('REGISTRATION')}
            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
          >
            <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#CCFF00]" />
              ODOMETER, REGISTRATION & INSURANCE
            </span>
            {openSection === 'REGISTRATION' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {openSection === 'REGISTRATION' && (
            <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-2 text-xs animate-in fade-in">
              <div className="flex justify-between text-zinc-300">
                <span>Odometer Reading</span>
                <span className="font-bold font-mono-numbers text-white">{vehicle.odometerKm.toLocaleString('en-IN')} km</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Registration State / City</span>
                <span className="font-bold text-white">MH 02 (Mumbai)</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Comprehensive Insurance IDV</span>
                <span className="font-bold font-mono-numbers text-white">{formatINR(Math.round(vehicle.currentValue * 0.95))}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Policy Validity</span>
                <span className="font-bold text-emerald-400">Active (Renews in 5 months)</span>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 2: ANNUAL COST BREAKDOWN */}
        <div className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden">
          <button
            onClick={() => toggleSection('COSTS')}
            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
          >
            <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#CCFF00]" />
              COSTS BREAKDOWN
            </span>
            {openSection === 'COSTS' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {openSection === 'COSTS' && (
            <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-2 text-xs animate-in fade-in">
              <div className="flex justify-between text-zinc-300">
                <span>Annual Fuel ({economics.effectiveMileage} km/L)</span>
                <span className="font-bold font-mono-numbers text-white">{formatINR(economics.annualFuelCost)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Annual Maintenance</span>
                <span className="font-bold font-mono-numbers text-white">{formatINR(economics.annualMaintenance)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Comprehensive Insurance</span>
                <span className="font-bold font-mono-numbers text-white">{formatINR(economics.annualInsurance)}</span>
              </div>
              <div className="flex justify-between text-zinc-300">
                <span>Annual Depreciation</span>
                <span className="font-bold font-mono-numbers text-rose-400">{formatINR(economics.annualDepreciation)}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between font-bold text-white">
                <span>Total Annual Burn</span>
                <span className="text-[#CCFF00] font-mono-numbers">{formatINR(economics.annualTotalCost)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Accordion 3: DEPRECIATION CURVE */}
        <div className="rounded-2xl bg-[#0F131A] border border-white/8 overflow-hidden">
          <button
            onClick={() => toggleSection('DEPRECIATION')}
            className="w-full p-3.5 flex items-center justify-between text-left cursor-pointer"
          >
            <span className="text-xs font-bold text-white tracking-wide uppercase flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-rose-400" />
              DEPRECIATION CURVE
            </span>
            {openSection === 'DEPRECIATION' ? <ChevronUp className="w-4 h-4 text-zinc-400" /> : <ChevronDown className="w-4 h-4 text-zinc-400" />}
          </button>

          {openSection === 'DEPRECIATION' && (
            <div className="px-4 pb-4 pt-1 border-t border-white/5 space-y-2 text-xs animate-in fade-in">
              <p className="text-zinc-300 leading-relaxed">
                Your {vehicle.model} depreciates at approximately <strong className="text-white font-mono-numbers">{(vehicle.depreciationRate * 100).toFixed(0)}%/year</strong>. Next 12 months equity loss is estimated at <strong className="text-rose-400 font-mono-numbers">{formatINR(economics.keepSellDetails.depreciation12M)}</strong>.
              </p>
              <div className="pt-1 flex justify-between text-zinc-400">
                <span>Projected 5-Year Residual Value:</span>
                <span className="text-white font-bold font-mono-numbers">{formatINR(economics.fiveYearValueRemaining)}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7. VEHICLE SPECS BOTTOM SHEET / MODAL */}
      {isSpecsOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsSpecsOpen(false)}
        >
          <div 
            className="w-full max-w-md bg-[#0D1016] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-4 max-h-[85vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00]">
                  SPECIFICATION SHEET
                </span>
                <h3 className="text-lg font-black text-white">
                  {vehicle.make} {vehicle.model}
                </h3>
              </div>
              <button 
                onClick={() => setIsSpecsOpen(false)} 
                className="p-1.5 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2.5">
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">Fuel Type</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{vehicle.fuelType}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">ARAI Mileage</span>
                  <span className="text-sm font-bold text-[#CCFF00] font-mono-numbers mt-0.5 block">{vehicle.expectedMileage} km/L</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">Manufacturing Year</span>
                  <span className="text-sm font-bold text-white mt-0.5 block">{vehicle.year}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">Odometer</span>
                  <span className="text-sm font-bold text-white font-mono-numbers mt-0.5 block">{vehicle.odometerKm.toLocaleString('en-IN')} km</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">Purchase Price</span>
                  <span className="text-sm font-bold text-white font-mono-numbers mt-0.5 block">{formatINR(vehicle.purchasePrice)}</span>
                </div>
                <div className="p-3 rounded-xl bg-zinc-900 border border-white/5">
                  <span className="text-[10px] text-zinc-400 block">Current Market Value</span>
                  <span className="text-sm font-bold text-[#CCFF00] font-mono-numbers mt-0.5 block">{formatINR(vehicle.currentValue)}</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#121620] border border-white/10 space-y-1">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block">Maintenance Cycle</span>
                <p className="text-zinc-300 text-xs">
                  Annual scheduled servicing: <strong className="text-white font-mono-numbers">{formatINR(vehicle.maintenanceEstimate)}</strong> per annum.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
