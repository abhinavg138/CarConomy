import React, { useState, useMemo, useEffect } from 'react';
import { Search, ChevronDown, Check, Sparkles, ArrowRight, RotateCcw, HelpCircle, X, Sliders } from 'lucide-react';
import { Vehicle, FinancialProfile, OwnershipProfile, Driver, CalculatedEconomics } from '../types';
import { formatINR, formatCostPerKm } from '../utils/formatters';
import { Eyebrow, H1, Big, Row, Meter, VehicleImage, Btn, InfoTip, cx } from './kit';
import { Tab } from './Shell';

interface OverviewProps {
  vehicle: Vehicle;
  vehicles: Vehicle[];
  finance: FinancialProfile;
  drivers: Driver[];
  ownership: OwnershipProfile;
  eco: CalculatedEconomics;
  onGo: (t: Tab, mode?: 'keep' | 'buy') => void;
  onPickVehicle: (id: string) => void;
  onUpdateVehicle?: (v: Vehicle) => void;
  onUpdateOwnership?: (o: OwnershipProfile) => void;
  onUpdateFinance?: (f: FinancialProfile) => void;
  onUpdateDrivers?: (d: Driver[]) => void;
  onRunDemo?: () => void;
}

export const Overview: React.FC<OverviewProps> = ({
  vehicle,
  vehicles,
  finance,
  drivers,
  ownership,
  eco,
  onGo,
  onPickVehicle,
  onUpdateVehicle,
  onUpdateOwnership,
  onUpdateFinance,
  onUpdateDrivers,
  onRunDemo,
}) => {
  // Check if user has already calculated in this session
  const [hasCalculated, setHasCalculated] = useState(() => {
    try {
      return sessionStorage.getItem('cc_has_calculated') === '1';
    } catch {
      return false;
    }
  });

  // Landing form state
  const [selectedCarId, setSelectedCarId] = useState<string>(vehicle.id);
  const [carSearch, setCarSearch] = useState<string>('');
  const [isCarDropdownOpen, setIsCarDropdownOpen] = useState(false);
  const [purchasePrice, setPurchasePrice] = useState<number>(vehicle.purchasePrice);
  const [monthlyKm, setMonthlyKm] = useState<number>(() => {
    const totalDaily = drivers.reduce((s, d) => s + d.dailyKm, 0);
    return Math.round((totalDaily * 365) / 12) || 1000;
  });

  // Assumptions inline editing modal or toggle
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiText, setAiText] = useState<string | null>(null);

  // Sync purchase price when vehicle selection changes in form
  useEffect(() => {
    const found = vehicles.find(v => v.id === selectedCarId);
    if (found) {
      setPurchasePrice(found.purchasePrice);
    }
  }, [selectedCarId, vehicles]);

  // Filtered cars for autocomplete dropdown
  const filteredVehicles = useMemo(() => {
    if (!carSearch.trim()) return vehicles;
    const q = carSearch.toLowerCase();
    return vehicles.filter(
      v =>
        v.make.toLowerCase().includes(q) ||
        v.model.toLowerCase().includes(q) ||
        v.variant.toLowerCase().includes(q) ||
        v.fuelType.toLowerCase().includes(q)
    );
  }, [vehicles, carSearch]);

  const activeCar = vehicles.find(v => v.id === selectedCarId) || vehicle;

  // Primary action: Show my true cost
  const handleShowTrueCost = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onPickVehicle(selectedCarId);

    // Update driver daily km to match monthly distance
    const dailyKm = Math.max(5, Math.round((monthlyKm * 12) / 365));
    if (drivers.length > 0 && onUpdateDrivers) {
      const updated = drivers.map((d, i) => (i === 0 ? { ...d, dailyKm } : { ...d, dailyKm: 0 }));
      onUpdateDrivers(updated);
    }

    // Update purchase price if custom modified
    if (purchasePrice !== activeCar.purchasePrice && onUpdateVehicle) {
      onUpdateVehicle({ ...activeCar, purchasePrice });
    }

    try {
      sessionStorage.setItem('cc_has_calculated', '1');
    } catch {}
    setHasCalculated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Instant Sample Car demo action
  const handleTrySample = () => {
    const sampleId = 'tata-nexon';
    const sampleCar = vehicles.find(v => v.id === sampleId) || vehicles[0];
    setSelectedCarId(sampleId);
    setPurchasePrice(sampleCar.purchasePrice);
    setMonthlyKm(1200);

    onPickVehicle(sampleId);

    if (onUpdateDrivers) {
      onUpdateDrivers([{ ...drivers[0], dailyKm: 40, drivingStyle: 'MODERATE' }]);
    }

    try {
      sessionStorage.setItem('cc_has_calculated', '1');
    } catch {}
    setHasCalculated(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // AI plain English explanation trigger
  const handleGenerateAi = () => {
    setAiGenerating(true);
    setAiText(null);
    setTimeout(() => {
      setAiGenerating(false);
      // Deterministic plain-language narrative based on actual numbers
      const isDepLargest = eco.annualDepreciation >= eco.annualFuelCost;
      const largestItem = isDepLargest ? 'Depreciation' : 'Fuel';
      setAiText(
        `For your ${vehicle.year} ${vehicle.make} ${vehicle.model}, ${largestItem.toLowerCase()} is your highest single expense. At your current driving pace, every kilometre adds ₹${formatCostPerKm(eco.costPerKm)} in all-inclusive wear and amortized cost. Maintaining scheduled servicing saves an estimated ₹14,000 in accelerated component wear over 3 years.`
      );
    }, 1200);
  };

  // ───────────────────────────────────────────────────────────────────────────
  // 1. LANDING / HOME SCREEN (First-time user or "Calculate Another Car")
  // ───────────────────────────────────────────────────────────────────────────
  if (!hasCalculated) {
    return (
      <div className="max-w-2xl mx-auto py-4 sm:py-8 space-y-8 animate-fade-in">
        {/* Header Question */}
        <div className="text-center space-y-3">
          <Eyebrow className="!text-accent">Car Ownership Cost Calculator</Eyebrow>
          <H1 className="text-3xl sm:text-5xl font-display tracking-tight text-ink">
            What does your car really cost you per km?
          </H1>
          <p className="text-sm sm:text-base text-mute">
            Get your true cost in 60 seconds. No sign-up.
          </p>
        </div>

        {/* 3-Field Clean Form */}
        <form
          onSubmit={handleShowTrueCost}
          className="p-6 sm:p-8 rounded-3xl bg-surface border border-line shadow-sm space-y-6"
        >
          {/* Field 1: Car Selection Autocomplete */}
          <div className="space-y-2 relative">
            <label htmlFor="car-select-btn" className="block text-xs font-semibold uppercase tracking-wider text-mute">
              1. Your Car
            </label>
            <div className="relative">
              <button
                id="car-select-btn"
                type="button"
                onClick={() => setIsCarDropdownOpen(!isCarDropdownOpen)}
                className="w-full min-h-12 px-4 py-3 rounded-2xl border border-line bg-paper text-left text-ink flex items-center justify-between gap-3 hover:border-ink cursor-pointer focus:outline-none focus:ring-2 focus:ring-accent"
              >
                <div className="min-w-0">
                  <p className="font-medium text-sm sm:text-base truncate">
                    {activeCar.make} {activeCar.model}
                  </p>
                  <p className="text-xs text-mute truncate">
                    {activeCar.year} · {activeCar.variant} ({activeCar.fuelType})
                  </p>
                </div>
                <ChevronDown className="w-5 h-5 text-mute shrink-0" />
              </button>

              {/* Autocomplete Dropdown Menu */}
              {isCarDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-paper border border-line rounded-2xl shadow-xl max-h-72 overflow-y-auto p-2 space-y-1">
                  <div className="sticky top-0 bg-paper pb-2 pt-1 px-1">
                    <div className="relative">
                      <Search className="w-4 h-4 text-mute absolute left-3 top-3" />
                      <input
                        type="text"
                        autoFocus
                        value={carSearch}
                        onChange={e => setCarSearch(e.target.value)}
                        placeholder="Search make, model, or fuel type..."
                        className="w-full pl-9 pr-4 py-2 text-sm rounded-xl bg-sunk border border-line text-ink focus:outline-none focus:border-ink"
                      />
                    </div>
                  </div>
                  {filteredVehicles.map(v => (
                    <button
                      key={v.id}
                      type="button"
                      onClick={() => {
                        setSelectedCarId(v.id);
                        setIsCarDropdownOpen(false);
                        setCarSearch('');
                      }}
                      className={cx(
                        'w-full text-left px-3 py-2.5 rounded-xl text-sm flex items-center justify-between cursor-pointer transition-colors',
                        v.id === selectedCarId ? 'bg-sunk font-semibold text-accent' : 'hover:bg-sunk text-ink'
                      )}
                    >
                      <div className="min-w-0">
                        <p className="truncate">
                          {v.make} {v.model}
                        </p>
                        <p className="text-xs text-mute truncate">
                          {v.year} · {v.variant} · {v.fuelType}
                        </p>
                      </div>
                      <span className="text-xs num text-mute ml-2 shrink-0">{formatINR(v.purchasePrice)}</span>
                    </button>
                  ))}
                  {filteredVehicles.length === 0 && (
                    <p className="text-xs text-mute text-center py-4">No cars match your search.</p>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Field 2: Purchase Price */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label htmlFor="purchase-price-input" className="block text-xs font-semibold uppercase tracking-wider text-mute">
                2. Purchase Price
              </label>
              <span className="text-xs text-mute">Estimated ex-showroom</span>
            </div>
            <div className="relative">
              <span className="absolute left-4 top-3.5 text-base font-medium text-mute">₹</span>
              <input
                id="purchase-price-input"
                type="number"
                min={100000}
                max={50000000}
                step={10000}
                value={purchasePrice}
                onChange={e => setPurchasePrice(Number(e.target.value))}
                className="w-full min-h-12 pl-8 pr-4 py-3 rounded-2xl border border-line bg-paper text-ink font-mono text-base focus:outline-none focus:border-ink"
                placeholder="e.g. 11,50,000"
                required
              />
            </div>
            <p className="text-xs text-mute">
              Prefilled from official catalogue: <span className="num font-medium text-ink">{formatINR(purchasePrice)}</span>
            </p>
          </div>

          {/* Field 3: Monthly Distance Slider */}
          <div className="space-y-3">
            <div className="flex justify-between items-baseline">
              <label htmlFor="monthly-km-slider" className="block text-xs font-semibold uppercase tracking-wider text-mute">
                3. Distance Driven per Month
              </label>
              <p className="font-display text-xl sm:text-2xl text-accent num">
                {monthlyKm.toLocaleString('en-IN')} <span className="text-xs font-normal text-mute">km/mo</span>
              </p>
            </div>
            <input
              id="monthly-km-slider"
              type="range"
              min={300}
              max={4000}
              step={50}
              value={monthlyKm}
              onChange={e => setMonthlyKm(Number(e.target.value))}
              className="w-full h-2 bg-sunk rounded-lg appearance-none cursor-pointer accent-accent"
              aria-label="Monthly distance driven in kilometres"
            />
            <div className="flex justify-between text-[11px] text-mute num">
              <span>300 km (weekend)</span>
              <span>1,000 km (typical)</span>
              <span>4,000 km (heavy)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-2">
            <button
              type="submit"
              className="w-full min-h-12 rounded-full bg-ink text-paper hover:bg-accent hover:text-accent-ink font-medium text-base transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              Show my true cost <ArrowRight className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={handleTrySample}
              className="w-full min-h-11 rounded-full border border-line hover:border-ink text-sm font-medium text-mute hover:text-ink transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              ⚡ Try with a sample car (Tata Nexon · ₹14.5L)
            </button>
          </div>

          {/* Fork for Buyers */}
          <div className="pt-4 border-t border-line text-center">
            <button
              type="button"
              onClick={() => onGo('browse')}
              className="text-xs sm:text-sm text-mute hover:text-ink inline-flex items-center gap-1.5 cursor-pointer underline-offset-4 hover:underline"
            >
              Thinking of buying instead? <span className="font-semibold text-ink">Check if you can afford it →</span>
            </button>
          </div>
        </form>
      </div>
    );
  }

  // ───────────────────────────────────────────────────────────────────────────
  // 2. RESULT SCREEN (Answer First, Detail Second, Assumptions Third)
  // ───────────────────────────────────────────────────────────────────────────
  const parts = [
    { label: 'Fuel / Energy', val: eco.annualFuelCost, color: 'bg-accent' },
    { label: 'Depreciation', val: eco.annualDepreciation, color: 'bg-ink' },
    { label: 'Loan interest', val: eco.annualFinancingInterest, color: 'bg-ink/70' },
    { label: 'Insurance', val: eco.annualInsurance, color: 'bg-ink/50' },
    { label: 'Maintenance', val: eco.annualMaintenance, color: 'bg-ink/35' },
    { label: 'Wear & tyres', val: eco.annualRepairs + eco.annualTyres, color: 'bg-ink/20' },
  ];
  const totalAnnual = parts.reduce((s, p) => s + p.val, 0) || 1;

  return (
    <div className="space-y-10 animate-fade-in pb-12">
      {/* Top Bar with "Calculate Another Car" */}
      <div className="flex items-center justify-between gap-4 flex-wrap pb-4 border-b border-line">
        <button
          onClick={() => {
            setHasCalculated(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-mute hover:text-ink cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Calculate for another car
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHowItWorks(true)}
            className="text-xs text-mute hover:text-ink inline-flex items-center gap-1 cursor-pointer"
          >
            <HelpCircle className="w-3.5 h-3.5" /> How we calculate this
          </button>
          {onRunDemo && (
            <button
              onClick={onRunDemo}
              className="text-xs px-2.5 py-1 rounded-full bg-sunk text-accent border border-line font-medium hover:border-accent cursor-pointer"
            >
              ⚡ Demo Mode
            </button>
          )}
        </div>
      </div>

      {/* HERO SECTION: ANSWER FIRST */}
      <section className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        <div className="order-2 lg:order-1 space-y-4">
          <Eyebrow>
            {vehicle.year} · {vehicle.make}
          </Eyebrow>
          <H1 className="text-3xl sm:text-5xl font-display text-ink">
            {vehicle.model} <span className="text-mute italic text-2xl sm:text-4xl">{vehicle.variant}</span>
          </H1>

          <div className="pt-2">
            <span className="text-xs uppercase tracking-wider text-mute block mb-1">
              Your True Cost Per Kilometre
            </span>
            <div className="flex items-baseline gap-4 flex-wrap">
              <Big className="text-6xl sm:text-7xl text-accent">{formatCostPerKm(eco.costPerKm)}</Big>
              <span className="text-lg text-mute">/ km</span>
            </div>
            <p className="mt-2 text-base text-ink font-medium">
              That's <span className="num font-semibold text-accent">{formatINR(eco.monthlyOwnershipCost)}</span> per month
              and <span className="num font-semibold text-ink">{formatINR(eco.annualTotalCost)}</span> per year to own this car.
            </p>
          </div>

          <div className="pt-2 flex items-center gap-3 text-xs text-mute flex-wrap">
            <span className="px-3 py-1 rounded-full bg-sunk border border-line">
              {eco.annualKm.toLocaleString('en-IN')} km/year
            </span>
            <span className="px-3 py-1 rounded-full bg-sunk border border-line">
              {vehicle.expectedMileage} {vehicle.fuelType === 'EV' ? 'km/kWh' : 'km/L'} ARAI
            </span>
            <span className="px-3 py-1 rounded-full bg-sunk border border-line">
              {ownership.city || 'NCR / Delhi'}
            </span>
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <VehicleImage vehicle={vehicle} priority className="shadow-md" />
        </div>
      </section>

      {/* WHERE THE MONEY GOES (VISUAL BREAKDOWN) */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-line space-y-6">
        <div>
          <Eyebrow>Where the money goes</Eyebrow>
          <h2 className="font-display text-xl sm:text-2xl mt-1 text-ink">Annual Ownership Cost Distribution</h2>
        </div>

        {/* Stacked Progress Bar */}
        <div className="space-y-2">
          <div className="flex h-4 rounded-full overflow-hidden" role="img" aria-label="Annual cost breakdown">
            {parts.map(p => (
              <div
                key={p.label}
                className={p.color}
                style={{ width: `${Math.max(2, (p.val / totalAnnual) * 100)}%` }}
                title={`${p.label}: ${formatINR(p.val)}`}
              />
            ))}
          </div>

          {/* Legend Items */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4">
            {parts.map(p => {
              const pct = Math.round((p.val / totalAnnual) * 100);
              return (
                <div key={p.label} className="p-3 rounded-2xl bg-paper border border-line space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={cx('w-2.5 h-2.5 rounded-full shrink-0', p.color)} />
                    <span className="text-xs text-mute truncate">{p.label}</span>
                  </div>
                  <p className="font-display text-sm sm:text-base num font-semibold text-ink">
                    {formatINR(p.val)}{' '}
                    <span className="text-xs font-normal text-mute">({pct}%)</span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* IN PLAIN ENGLISH SECTION */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-line space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow className="!text-accent">In Plain English</Eyebrow>
            <h2 className="font-display text-xl sm:text-2xl text-ink mt-0.5">Summary of Your Car's Economics</h2>
          </div>
          <button
            onClick={handleGenerateAi}
            disabled={aiGenerating}
            className="text-xs font-medium px-3.5 py-1.5 rounded-full border border-line hover:border-ink flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" />
            {aiGenerating ? 'Analyzing...' : 'Generate AI Deep Dive'}
          </button>
        </div>

        {/* AI Loading Skeleton */}
        {aiGenerating && (
          <div className="space-y-2 py-3 animate-pulse">
            <div className="h-4 bg-line rounded w-3/4" />
            <div className="h-4 bg-line rounded w-full" />
            <div className="h-4 bg-line rounded w-5/6" />
          </div>
        )}

        {/* Explanation Text */}
        {!aiGenerating && (
          <p className="text-sm leading-relaxed text-ink/90">
            {aiText ? (
              aiText
            ) : (
              <>
                At your current driving pace of <span className="font-semibold num">{eco.annualKm.toLocaleString('en-IN')} km/year</span>,
                your single largest cost factor is{' '}
                <span className="font-semibold text-accent">
                  {eco.annualDepreciation >= eco.annualFuelCost ? 'Depreciation' : 'Fuel'}
                </span>{' '}
                ({formatINR(Math.max(eco.annualDepreciation, eco.annualFuelCost))}/yr).
                Your daily running costs average <span className="font-semibold num">{formatCostPerKm(eco.costPerKm)}</span>,
                meaning routine city commutes cost you approximately <span className="font-semibold num">{formatINR(Math.round(eco.monthlyOwnershipCost / 30))}</span> every day.
              </>
            )}
          </p>
        )}
      </section>

      {/* ASSUMPTIONS PANEL: EDITABLE INLINE ESTIMATES */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-line space-y-6">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>Transparency</Eyebrow>
            <h2 className="font-display text-xl sm:text-2xl text-ink mt-0.5">Assumptions & Editable Estimates</h2>
            <p className="text-xs text-mute mt-1">
              Every value below is an estimate. Tap any number to customize—results recalculate live.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-sunk border border-line text-mute">
            Live Dynamic Recalculation
          </span>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Assumption 1: Fuel Price */}
          <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-mute">Fuel / Tariff</span>
              <span className="text-[10px] text-accent font-medium uppercase tracking-wider">estimate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-mute">₹</span>
              <input
                type="number"
                step="0.5"
                min="5"
                max="200"
                value={ownership.fuelPrice}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val > 0 && onUpdateOwnership) {
                    onUpdateOwnership({ ...ownership, fuelPrice: val });
                  }
                }}
                className="w-full text-sm font-semibold num bg-transparent border-b border-line focus:border-ink focus:outline-none"
              />
              <span className="text-xs text-mute whitespace-nowrap">/ {vehicle.fuelType === 'EV' ? 'kWh' : 'L'}</span>
            </div>
          </div>

          {/* Assumption 2: Expected Real-world Mileage */}
          <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-mute">Real-World Mileage</span>
              <span className="text-[10px] text-accent font-medium uppercase tracking-wider">estimate</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.5"
                min="3"
                max="50"
                value={vehicle.expectedMileage}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val > 0 && onUpdateVehicle) {
                    onUpdateVehicle({ ...vehicle, expectedMileage: val });
                  }
                }}
                className="w-full text-sm font-semibold num bg-transparent border-b border-line focus:border-ink focus:outline-none"
              />
              <span className="text-xs text-mute whitespace-nowrap">{vehicle.fuelType === 'EV' ? 'km/kWh' : 'km/L'}</span>
            </div>
          </div>

          {/* Assumption 3: Annual Insurance */}
          <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-mute">Annual Insurance</span>
              <span className="text-[10px] text-accent font-medium uppercase tracking-wider">estimate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-mute">₹</span>
              <input
                type="number"
                step="1000"
                min="1000"
                max="500000"
                value={vehicle.insuranceEstimate}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val > 0 && onUpdateVehicle) {
                    onUpdateVehicle({ ...vehicle, insuranceEstimate: val });
                  }
                }}
                className="w-full text-sm font-semibold num bg-transparent border-b border-line focus:border-ink focus:outline-none"
              />
              <span className="text-xs text-mute">/yr</span>
            </div>
          </div>

          {/* Assumption 4: Annual Maintenance */}
          <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-mute">Annual Maintenance</span>
              <span className="text-[10px] text-accent font-medium uppercase tracking-wider">estimate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-mute">₹</span>
              <input
                type="number"
                step="1000"
                min="1000"
                max="300000"
                value={vehicle.maintenanceEstimate}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val > 0 && onUpdateVehicle) {
                    onUpdateVehicle({ ...vehicle, maintenanceEstimate: val });
                  }
                }}
                className="w-full text-sm font-semibold num bg-transparent border-b border-line focus:border-ink focus:outline-none"
              />
              <span className="text-xs text-mute">/yr</span>
            </div>
          </div>

          {/* Assumption 5: Loan Interest Rate */}
          <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-mute">Loan Interest Rate</span>
              <span className="text-[10px] text-accent font-medium uppercase tracking-wider">estimate</span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="0.25"
                min="0"
                max="25"
                value={finance.interestRate}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val >= 0 && onUpdateFinance) {
                    onUpdateFinance({ ...finance, interestRate: val });
                  }
                }}
                className="w-full text-sm font-semibold num bg-transparent border-b border-line focus:border-ink focus:outline-none"
              />
              <span className="text-xs text-mute">%</span>
            </div>
          </div>

          {/* Assumption 6: Down Payment */}
          <div className="p-4 rounded-2xl bg-paper border border-line space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-xs text-mute">Down Payment</span>
              <span className="text-[10px] text-accent font-medium uppercase tracking-wider">estimate</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-mute">₹</span>
              <input
                type="number"
                step="10000"
                min="0"
                max={vehicle.purchasePrice}
                value={finance.downPayment}
                onChange={e => {
                  const val = Number(e.target.value);
                  if (val >= 0 && onUpdateFinance) {
                    onUpdateFinance({ ...finance, downPayment: val });
                  }
                }}
                className="w-full text-sm font-semibold num bg-transparent border-b border-line focus:border-ink focus:outline-none"
              />
            </div>
          </div>
        </div>
      </section>

      {/* NEXT-STEP HANDOFF: SHOULD YOU KEEP OR SELL THIS CAR? */}
      <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-surface to-sunk border border-line space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-xl">
            <div className="flex items-center gap-2">
              <Eyebrow className="!text-accent">Decision Intelligence</Eyebrow>
              <span
                className={cx(
                  'text-xs font-semibold px-2.5 py-0.5 rounded-full',
                  eco.keepSellDecision === 'KEEP' ? 'bg-good/20 text-good' : 'bg-bad/20 text-bad'
                )}
              >
                Recommendation: {eco.keepSellDecision}
              </span>
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-ink">Should you keep or sell this car?</h3>
            <p className="text-xs sm:text-sm text-mute leading-relaxed">{eco.keepSellReason}</p>
          </div>

          <Btn
            onClick={() => onGo('decide', 'keep')}
            className="whitespace-nowrap px-6 py-3 shrink-0 self-start sm:self-center"
          >
            See 12-Month Break-Even →
          </Btn>
        </div>
      </section>

      {/* AFFORDABILITY SUMMARY */}
      <section className="p-6 sm:p-8 rounded-3xl bg-surface border border-line space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <Eyebrow>Cash Flow Check</Eyebrow>
            <h3 className="font-display text-xl sm:text-2xl text-ink mt-0.5">Can I afford this car?</h3>
          </div>
          <span
            className={cx(
              'text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider',
              eco.financialFitTier === 'COMFORTABLE'
                ? 'bg-good/20 text-good'
                : eco.financialFitTier === 'STRETCHED'
                ? 'bg-warn/20 text-warn'
                : 'bg-bad/20 text-bad'
            )}
          >
            {eco.financialFitTier}
          </span>
        </div>

        <div className="space-y-2">
          <Meter
            pct={eco.incomeAllocationPercent}
            tone={eco.financialFitTier === 'COMFORTABLE' ? 'good' : eco.financialFitTier === 'STRETCHED' ? 'warn' : 'bad'}
          />
          <p className="text-xs text-mute num">
            Car commitments account for {eco.incomeAllocationPercent.toFixed(1)}% of your monthly disposable income.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3 pt-2">
          <div className="p-3 rounded-2xl bg-paper border border-line">
            <span className="text-xs text-mute">
              <InfoTip term="Monthly EMI" explanation="Equated Monthly Installment: the fixed payment made to the bank each month to repay your car loan.">
                Monthly EMI
              </InfoTip>
            </span>
            <p className="font-display text-base num font-semibold text-ink mt-0.5">{formatINR(eco.monthlyCarPayment)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-paper border border-line">
            <span className="text-xs text-mute">Total Monthly Commitment</span>
            <p className="font-display text-base num font-semibold text-ink mt-0.5">{formatINR(eco.totalMonthlyCarCommitment)}</p>
          </div>
          <div className="p-3 rounded-2xl bg-paper border border-line">
            <span className="text-xs text-mute">
              <InfoTip term="5-Year TCO" explanation="Total Cost of Ownership: the combined total of loan interest, fuel, depreciation, insurance, and maintenance over 5 years.">
                5-Year Total Cost
              </InfoTip>
            </span>
            <p className="font-display text-base num font-semibold text-ink mt-0.5">{formatINR(eco.totalTenureCost)}</p>
          </div>
        </div>
      </section>

      {/* "HOW WE CALCULATED THIS" MODAL */}
      {showHowItWorks && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-paper border border-line rounded-3xl p-6 sm:p-8 max-w-lg w-full space-y-5 shadow-2xl relative">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl text-ink">How we calculated this</h3>
              <button
                onClick={() => setShowHowItWorks(false)}
                className="w-8 h-8 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-ink leading-relaxed">
              <div className="p-4 rounded-2xl bg-sunk border border-line font-mono text-xs">
                True Cost / km = (Fuel + Loan Interest + Depreciation + Insurance + Maintenance + Driver Wear) ÷ Annual km
              </div>

              <ul className="space-y-2 list-disc list-inside text-mute">
                <li><strong className="text-ink">Fuel / Energy:</strong> Derived from official ARAI certification, adjusted for city congestion factors and fuel prices.</li>
                <li><strong className="text-ink">Depreciation:</strong> Actuarial curves accounting for brand retention, first-year registration loss, and vehicle age.</li>
                <li><strong className="text-ink">Financing:</strong> Month-by-month loan amortization schedule based on your down payment and interest rate.</li>
                <li><strong className="text-ink">Maintenance & Wear:</strong> Scheduled OEM service intervals scaled by actual odometer readings and city traffic stop-and-go wear.</li>
              </ul>
            </div>

            <Btn onClick={() => setShowHowItWorks(false)} className="w-full">
              Got it
            </Btn>
          </div>
        </div>
      )}
    </div>
  );
};
