import React, { useState } from 'react';
import { Plus, Trash2, X, UserCheck, ShieldAlert } from 'lucide-react';
import { Driver, DriverRole, DrivingStyle, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';

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
  const [editingDriver, setEditingDriver] = useState<Driver | null>(null);

  const [newDriver, setNewDriver] = useState<Omit<Driver, 'id'>>({
    name: 'New Driver',
    role: 'Other',
    dailyKm: 20,
    cityHighwaySplit: 70,
    drivingStyle: 'MODERATE',
  });

  const handleAddDriver = () => {
    const created: Driver = {
      ...newDriver,
      id: `driver-${Date.now()}`,
    };
    onUpdateDrivers([...drivers, created]);
    setIsAdding(false);
  };

  const handleRemoveDriver = (id: string) => {
    if (drivers.length <= 1) return;
    onUpdateDrivers(drivers.filter((d) => d.id !== id));
    setEditingDriver(null);
  };

  const handleSaveEdit = (updated: Driver) => {
    onUpdateDrivers(drivers.map((d) => (d.id === updated.id ? updated : d)));
    setEditingDriver(null);
  };

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
        </div>

        <button
          onClick={() => setIsAdding(true)}
          className="px-3 py-2 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center gap-1.5 cursor-pointer min-h-[40px]"
        >
          <Plus className="w-3.5 h-3.5 text-[#CCFF00]" />
          <span>Add</span>
        </button>
      </div>

      {/* 2. DRIVER CARDS */}
      <div className="space-y-2.5">
        {drivers.map((driver) => {
          return (
            <div
              key={driver.id}
              onClick={() => setEditingDriver(driver)}
              className="p-3.5 rounded-2xl bg-[#0F131A] border border-white/8 flex items-center justify-between hover:border-white/20 transition-colors cursor-pointer"
            >
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-white uppercase tracking-wide">
                    {driver.name}
                  </span>
                  <span className="text-[10px] text-zinc-400">({driver.role})</span>
                </div>
                <span className="text-xs font-bold text-zinc-300 font-mono-numbers block">
                  {driver.dailyKm} km/day
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-xl text-[10px] font-extrabold uppercase tracking-wider border ${
                  driver.drivingStyle === 'CONSERVATIVE'
                    ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/25'
                    : driver.drivingStyle === 'MODERATE'
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/25'
                    : 'bg-rose-500/15 text-rose-300 border-rose-500/25'
                }`}>
                  {driver.drivingStyle}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. HOUSEHOLD EFFECT POD */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#18131B] via-[#120F16] to-[#0A0D12] border border-purple-500/30 shadow-xl space-y-1">
        <span className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest block">
          HOUSEHOLD EFFECT
        </span>
        <div className="text-2xl sm:text-3xl font-black text-white font-mono-numbers">
          +{formatINR(economics.householdAdditionalWear)}/year
        </div>
        <p className="text-xs text-zinc-300 leading-snug pt-1">
          Your household driving pattern increases estimated running costs by <strong className="text-white font-mono-numbers">{formatINR(economics.householdAdditionalWear)}/year</strong>.
        </p>
      </div>

      {/* 4. MODAL: EDIT DRIVER */}
      {editingDriver && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setEditingDriver(null)}
        >
          <div 
            className="w-full max-w-md bg-[#0F131A] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h3 className="text-base font-bold text-white">Edit Driver Profile</h3>
              <button onClick={() => setEditingDriver(null)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Driver Name</label>
                <input
                  type="text"
                  value={editingDriver.name}
                  onChange={(e) => setEditingDriver({ ...editingDriver, name: e.target.value })}
                  className="w-full bg-zinc-900 px-3 py-2 rounded-xl border border-white/10 text-white font-semibold"
                />
              </div>

              <div>
                <div className="flex justify-between text-zinc-400 mb-1">
                  <span>Daily Commute</span>
                  <span className="text-white font-bold font-mono-numbers">{editingDriver.dailyKm} km/day</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="5"
                  value={editingDriver.dailyKm}
                  onChange={(e) => setEditingDriver({ ...editingDriver, dailyKm: Number(e.target.value) })}
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Driving Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {DRIVING_STYLES.map((st) => (
                    <button
                      key={st}
                      onClick={() => setEditingDriver({ ...editingDriver, drivingStyle: st })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
                        editingDriver.drivingStyle === st
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

            <div className="flex gap-2 pt-2">
              {drivers.length > 1 && (
                <button
                  onClick={() => handleRemoveDriver(editingDriver.id)}
                  className="px-4 py-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => handleSaveEdit(editingDriver)}
                className="flex-1 py-3 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase"
              >
                Save Driver
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. MODAL: ADD DRIVER */}
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
              <button onClick={() => setIsAdding(false)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Name</label>
                <input
                  type="text"
                  value={newDriver.name}
                  onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })}
                  className="w-full bg-zinc-900 px-3 py-2 rounded-xl border border-white/10 text-white font-semibold"
                />
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
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div>
                <label className="text-zinc-400 block mb-1">Driving Style</label>
                <div className="grid grid-cols-3 gap-2">
                  {DRIVING_STYLES.map((st) => (
                    <button
                      key={st}
                      onClick={() => setNewDriver({ ...newDriver, drivingStyle: st })}
                      className={`py-2 rounded-xl text-xs font-bold border transition-colors ${
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
              className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider"
            >
              Add Driver
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
