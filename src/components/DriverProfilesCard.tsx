import React, { useState } from 'react';
import { Plus, Trash2, X, AlertTriangle, ShieldCheck, Car, Flame, Sparkles } from 'lucide-react';
import { Driver, DriverRole, DrivingStyle, CalculatedEconomics } from '../types';
import { formatINR, formatNumber } from '../utils/formatters';

interface DriverProfilesCardProps {
  drivers: Driver[];
  onUpdateDrivers: (drivers: Driver[]) => void;
  economics: CalculatedEconomics;
}

const DRIVER_ROLES: DriverRole[] = ['Me', 'Wife / Husband', 'Children', 'Parents', 'Chauffeur', 'Other'];
const DRIVING_STYLES: DrivingStyle[] = ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'];

export const DriverProfilesCard: React.FC<DriverProfilesCardProps> = ({
  drivers,
  onUpdateDrivers,
  economics,
}) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingNameId, setEditingNameId] = useState<string | null>(null);

  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id'>>({
    name: 'New Driver',
    role: 'Other',
    dailyKm: 20,
    cityHighwaySplit: 70,
    drivingStyle: 'MODERATE',
  });

  const handleUpdateDriver = (id: string, updates: Partial<Driver>) => {
    const updatedList = drivers.map((d) => (d.id === id ? { ...d, ...updates } : d));
    onUpdateDrivers(updatedList);
  };

  const handleAddDriver = () => {
    const created: Driver = {
      ...newDriver,
      id: `driver-${Date.now()}`,
    };
    onUpdateDrivers([...drivers, created]);
    setIsAdding(false);
    setNewDriver({
      name: 'New Driver',
      role: 'Other',
      dailyKm: 20,
      cityHighwaySplit: 70,
      drivingStyle: 'MODERATE',
    });
  };

  const handleRemoveDriver = (id: string) => {
    if (drivers.length <= 1) return;
    onUpdateDrivers(drivers.filter((d) => d.id !== id));
  };

  const efficiencyUnit = economics.energyMetricLabel === 'Energy' ? 'km/kWh' : 'km/L';

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. SCREEN TITLE */}
      <div className="flex items-center justify-between pt-1">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
            HOUSEHOLD ATTRIBUTION
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
            Who drives your car?
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Adjusting drivers dynamically recalculates fuel burn, wear & tear, and ownership costs.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-3.5 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer min-h-[40px] transition-colors"
        >
          <Plus className="w-3.5 h-3.5 text-[#CCFF00]" />
          <span>Add</span>
        </button>
      </div>

      {/* 2. HOUSEHOLD SUMMARY HERO POD */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#18131B] via-[#120F16] to-[#0A0D12] border border-purple-500/30 shadow-xl space-y-3">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block">
              HOUSEHOLD WEAR & TEAR IMPACT
            </span>
            <div className="text-3xl sm:text-4xl font-black text-white font-mono-numbers mt-0.5">
              +{formatINR(economics.householdAdditionalWear)}
              <span className="text-sm font-normal text-zinc-400"> / year</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-extrabold text-zinc-400 uppercase tracking-widest block">
              COMBINED COMMUTE
            </span>
            <div className="text-lg font-black text-white font-mono-numbers mt-0.5">
              {economics.householdDailyKm} km/day
            </div>
            <span className="text-[10px] text-zinc-400 font-mono-numbers block">
              ≈ {formatNumber(economics.annualKm)} km/year
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-purple-500/20 grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block">Effective Efficiency:</span>
            <span className="font-bold text-[#CCFF00] font-mono-numbers text-sm">
              {economics.effectiveMileage} {efficiencyUnit}
            </span>
          </div>
          <div className="p-2.5 rounded-xl bg-black/40 border border-white/5">
            <span className="text-[10px] text-zinc-400 block">Aggressive Drivers:</span>
            <span className={`font-bold font-mono-numbers text-sm ${
              economics.aggressiveDriversCount > 0 ? 'text-rose-400' : 'text-emerald-400'
            }`}>
              {economics.aggressiveDriversCount} active
            </span>
          </div>
        </div>
      </div>

      {/* 3. INTERACTIVE DRIVER CARDS */}
      <div className="space-y-3.5">
        {drivers.map((driver) => {
          const impact = economics.driverImpacts.find((di) => di.driverId === driver.id);
          const isEditingName = editingNameId === driver.id;

          return (
            <div
              key={driver.id}
              className="p-4 rounded-3xl bg-[#0F131A] border border-white/10 hover:border-white/20 transition-all space-y-3"
            >
              {/* Header: Driver Name & Role */}
              <div className="flex items-center justify-between">
                <div className="flex-1 mr-2">
                  {isEditingName ? (
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={driver.name}
                        onChange={(e) => handleUpdateDriver(driver.id, { name: e.target.value })}
                        className="bg-black/60 border border-white/20 text-white font-bold text-xs px-2.5 py-1 rounded-lg"
                        autoFocus
                      />
                      <button
                        onClick={() => setEditingNameId(null)}
                        className="text-[10px] font-bold text-[#CCFF00] hover:underline"
                      >
                        Done
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-baseline gap-2">
                      <span 
                        onClick={() => setEditingNameId(driver.id)}
                        className="text-sm font-black text-white hover:text-[#CCFF00] cursor-pointer transition-colors"
                        title="Click to rename driver"
                      >
                        {driver.name}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-semibold">({driver.role})</span>
                    </div>
                  )}
                </div>

                {drivers.length > 1 && (
                  <button
                    onClick={() => handleRemoveDriver(driver.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
                    title="Remove driver"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Slider 1: Daily Kilometers (Interactive) */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-zinc-400 font-medium">Daily Driving</span>
                  <div className="text-right">
                    <span className="text-white font-black font-mono-numbers text-sm">
                      {driver.dailyKm} km/day
                    </span>
                    <span className="text-[10px] text-zinc-400 font-mono-numbers block">
                      ≈ {formatNumber(driver.dailyKm * 365)} km/yr
                    </span>
                  </div>
                </div>

                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={driver.dailyKm}
                  onChange={(e) => handleUpdateDriver(driver.id, { dailyKm: Number(e.target.value) })}
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Selector: Driving Style (Interactive Buttons) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] text-zinc-400 font-medium">
                  <span>Driving Style</span>
                  <span className="text-[10px] text-zinc-400">
                    {driver.drivingStyle === 'CONSERVATIVE' && '🌱 Gentle on brakes & tyres'}
                    {driver.drivingStyle === 'MODERATE' && '⚖️ Balanced urban commute'}
                    {driver.drivingStyle === 'AGGRESSIVE' && '⚡ Hard braking & acceleration (+wear)'}
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1.5">
                  {DRIVING_STYLES.map((style) => {
                    const isSelected = driver.drivingStyle === style;
                    return (
                      <button
                        key={style}
                        onClick={() => handleUpdateDriver(driver.id, { drivingStyle: style })}
                        className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-all cursor-pointer ${
                          isSelected
                            ? style === 'CONSERVATIVE'
                              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-md shadow-emerald-500/10'
                              : style === 'MODERATE'
                              ? 'bg-blue-500/20 text-blue-300 border-blue-500/50 shadow-md shadow-blue-500/10'
                              : 'bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-md shadow-rose-500/10'
                            : 'bg-zinc-900/60 text-zinc-400 border-white/5 hover:border-white/20'
                        }`}
                      >
                        {style}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Slider 2: City / Highway Split */}
              <div className="p-3 rounded-2xl bg-black/40 border border-white/5 space-y-1.5">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-zinc-400 font-medium">Traffic Exposure</span>
                  <span className="text-white font-bold font-mono-numbers text-xs">
                    {driver.cityHighwaySplit}% City • {100 - driver.cityHighwaySplit}% Hwy
                  </span>
                </div>

                <input
                  type="range"
                  min="20"
                  max="90"
                  step="5"
                  value={driver.cityHighwaySplit}
                  onChange={(e) => handleUpdateDriver(driver.id, { cityHighwaySplit: Number(e.target.value) })}
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Dynamic Impact Badges for this Driver */}
              {impact && (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                  <div className="text-zinc-400">
                    Efficiency: <strong className="text-white font-mono-numbers">{impact.effectiveMileage} {efficiencyUnit}</strong>
                  </div>
                  <div className="text-zinc-400">
                    Wear: <strong className="text-purple-300 font-mono-numbers">+{formatINR(impact.annualWearCost)}/yr</strong>
                  </div>
                  <div className="text-zinc-400">
                    Cost Share: <strong className="text-[#CCFF00] font-mono-numbers">{formatINR(impact.totalCostShare)}/yr</strong>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 4. MODAL: ADD DRIVER */}
      {isAdding && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setIsAdding(false)}
        >
          <div 
            className="w-full max-w-md bg-[#0F131A] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Add Household Driver</h3>
              <button onClick={() => setIsAdding(false)} className="p-1 text-zinc-400 hover:text-white cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Driver Name</label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  placeholder="e.g. Daughter, Chauffeur"
                  className="w-full bg-zinc-900 px-3.5 py-2.5 rounded-xl border border-white/10 text-white font-semibold focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Role / Relationship</label>
                <select
                  value={newDriver.role}
                  onChange={(e) => setNewDriver({ ...newDriver, role: e.target.value as DriverRole })}
                  className="w-full bg-zinc-900 px-3.5 py-2.5 rounded-xl border border-white/10 text-white font-semibold focus:outline-none focus:border-[#CCFF00]"
                >
                  {DRIVER_ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Daily Commute</span>
                  <span className="text-white font-bold font-mono-numbers">{newDriver.dailyKm} km/day</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={newDriver.dailyKm}
                  onChange={(e) => setNewDriver({ ...newDriver, dailyKm: Number(e.target.value) })}
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1.5">Driving Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {DRIVING_STYLES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => setNewDriver({ ...newDriver, drivingStyle: st })}
                      className={`py-2 rounded-xl text-[10px] font-black uppercase tracking-wider border transition-colors cursor-pointer ${
                        newDriver.drivingStyle === st
                          ? 'bg-[#CCFF00] text-black border-[#CCFF00]'
                          : 'bg-zinc-900 text-zinc-400 border-white/10'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleAddDriver}
              className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors cursor-pointer mt-2"
            >
              Add Driver to Household
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
