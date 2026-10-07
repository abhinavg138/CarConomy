import React, { useState } from 'react';
import { X, Car, Check, Calendar, Gauge, DollarSign, Sparkles, ArrowRight } from 'lucide-react';
import { Vehicle, FuelType } from '../types';

interface AddCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCar: (newVehicle: Vehicle) => void;
}

const PRESET_POPULAR_MODELS = [
  { make: 'BMW', model: '3 Series', variant: '330i M Sport', price: 5500000, mileage: 13.8, fuel: 'Petrol' as FuelType, img: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Mercedes-Benz', model: 'C-Class', variant: 'C 200', price: 6150000, mileage: 12.4, fuel: 'Petrol' as FuelType, img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Audi', model: 'A4', variant: '40 TFSI', price: 4650000, mileage: 13.2, fuel: 'Petrol' as FuelType, img: 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Toyota', model: 'Camry', variant: 'Hybrid 2.5', price: 4620000, mileage: 19.1, fuel: 'Hybrid' as FuelType, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Porsche', model: 'Macan', variant: 'GTS Performance', price: 8800000, mileage: 10.2, fuel: 'Petrol' as FuelType, img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1400&q=85' },
  { make: 'BMW', model: 'i4', variant: 'eDrive40 Gran Coupe', price: 7250000, mileage: 5.8, fuel: 'EV' as FuelType, img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Toyota', model: 'Fortuner', variant: 'Legender 4x4 AT', price: 4450000, mileage: 12.2, fuel: 'Diesel' as FuelType, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Mahindra', model: 'XUV700', variant: 'AX7L Diesel AT', price: 2650000, mileage: 14.5, fuel: 'Diesel' as FuelType, img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Hyundai', model: 'Creta', variant: 'SX(O) 1.5 Turbo', price: 1980000, mileage: 15.4, fuel: 'Petrol' as FuelType, img: 'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Tata', model: 'Nexon', variant: 'Fearless+ DCA', price: 1450000, mileage: 16.5, fuel: 'Petrol' as FuelType, img: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Skoda', model: 'Superb', variant: 'L&K 2.0 TSI', price: 3850000, mileage: 14.8, fuel: 'Petrol' as FuelType, img: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=1400&q=85' },
  { make: 'Hyundai', model: 'Ioniq 5', variant: 'Long Range RWD', price: 4600000, mileage: 6.2, fuel: 'EV' as FuelType, img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&w=1400&q=85' },
];

export const AddCarModal: React.FC<AddCarModalProps> = ({ isOpen, onClose, onAddCar }) => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState<number>(0);
  const [isCustom, setIsCustom] = useState(false);

  // Form fields
  const [make, setMake] = useState('BMW');
  const [model, setModel] = useState('3 Series');
  const [variant, setVariant] = useState('330i M Sport');
  const [year, setYear] = useState(2024);
  const [purchasePrice, setPurchasePrice] = useState(5500000);
  const [currentValue, setCurrentValue] = useState(4300000);
  const [purchaseDate, setPurchaseDate] = useState('2024-06-15');
  const [odometerKm, setOdometerKm] = useState(16500);
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [expectedMileage, setExpectedMileage] = useState(13.8);

  const [stepSuccess, setStepSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (idx: number) => {
    setSelectedPresetIndex(idx);
    setIsCustom(false);
    const p = PRESET_POPULAR_MODELS[idx];
    setMake(p.make);
    setModel(p.model);
    setVariant(p.variant);
    setPurchasePrice(p.price);
    setCurrentValue(Math.round(p.price * 0.82));
    setFuelType(p.fuel);
    setExpectedMileage(p.mileage);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newCar: Vehicle = {
      id: `car-${Date.now()}`,
      make,
      model,
      variant,
      year: Number(year),
      fuelType,
      purchasePrice: Number(purchasePrice),
      currentValue: Number(currentValue) || Math.round(Number(purchasePrice) * 0.82),
      expectedMileage: Number(expectedMileage),
      maintenanceEstimate: Math.round(Number(purchasePrice) * 0.009 + 8000),
      insuranceEstimate: Math.round(Number(purchasePrice) * 0.008 + 6000),
      depreciationRate: make === 'Toyota' ? 0.08 : make === 'Hyundai' || make === 'Tata' ? 0.09 : 0.115,
      firstYearDepreciationRate: 0.18,
      odometerKm: Number(odometerKm),
      purchaseDate,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1200&q=80',
      specs: {
        engine: `${expectedMileage > 18 ? '2.5L Hybrid' : '2.0L Turbocharged'}`,
        power: '250 hp approx',
        torque: '380 Nm approx',
        transmission: 'Automatic Transmission',
        zeroToHundred: '6.5 sec',
        fuelTankLiters: 55,
        warrantyYears: 3,
      },
    };

    setStepSuccess(true);
    setTimeout(() => {
      onAddCar(newCar);
      setStepSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div 
        className="relative w-full max-w-xl bg-[#0F131A] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl text-white my-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {stepSuccess ? (
          <div className="text-center py-10 space-y-3">
            <div className="w-16 h-16 rounded-full bg-[#CCFF00]/20 text-[#CCFF00] mx-auto flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white">Your Car is Ready</h3>
            <p className="text-sm text-zinc-400">
              Generated True Cost/km, dynamic depreciation curve, and Keep or Sell verdict for your {make} {model}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-[#CCFF00] tracking-widest uppercase">
                  Garage Asset Onboarding
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight mt-1">
                ADD YOUR CAR
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                4 quick questions. Our calculation engine will immediately model its full financial profile.
              </p>
            </div>

            {/* Step 1: Select Popular Vehicle or Custom */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-zinc-300">1. Select Vehicle Model</label>
                <button
                  type="button"
                  onClick={() => setIsCustom(!isCustom)}
                  className="text-[11px] text-[#CCFF00] font-medium hover:underline"
                >
                  {isCustom ? '← Pick from list' : '+ Enter custom vehicle'}
                </button>
              </div>

              {isCustom ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    placeholder="Make (e.g. BMW)"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                    className="bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                  <input
                    type="text"
                    placeholder="Model (e.g. 3 Series)"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                    className="bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                  <input
                    type="text"
                    placeholder="Variant (e.g. 330i)"
                    value={variant}
                    onChange={(e) => setVariant(e.target.value)}
                    className="bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                  <input
                    type="number"
                    placeholder="Year"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    min="2010"
                    max="2026"
                    className="bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {PRESET_POPULAR_MODELS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPreset(idx)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        selectedPresetIndex === idx && !isCustom
                          ? 'bg-[#18212D] border-[#CCFF00] text-white font-bold'
                          : 'bg-[#12161D] border-white/5 text-zinc-400 hover:text-white hover:border-white/15'
                      }`}
                    >
                      <span className="block font-bold truncate">{preset.make} {preset.model}</span>
                      <span className="text-[10px] text-zinc-500 font-normal truncate block">{preset.variant}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Step 2: Purchase Price & Current Valuation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  2. Purchase Price (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setPurchasePrice(val);
                      setCurrentValue(Math.round(val * 0.82));
                    }}
                    required
                    className="w-full bg-[#161B22] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Ex-showroom or pre-owned invoice price
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  Estimated Current Market Value (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-zinc-500 text-xs font-bold">₹</span>
                  <input
                    type="number"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(Number(e.target.value))}
                    required
                    className="w-full bg-[#161B22] border border-white/10 rounded-xl pl-7 pr-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                  />
                </div>
                <span className="text-[10px] text-zinc-500 block mt-1">
                  Current resale asset value
                </span>
              </div>
            </div>

            {/* Step 3 & 4: Purchase Date & Odometer */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  3. Purchase Date
                </label>
                <input
                  type="date"
                  value={purchaseDate}
                  onChange={(e) => setPurchaseDate(e.target.value)}
                  required
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#CCFF00]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-zinc-300 block mb-1">
                  4. Current Odometer (km)
                </label>
                <input
                  type="number"
                  value={odometerKm}
                  onChange={(e) => setOdometerKm(Number(e.target.value))}
                  required
                  min="0"
                  step="500"
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl px-3 py-2 text-xs text-white font-mono-numbers focus:outline-none focus:border-[#CCFF00]"
                />
              </div>
            </div>

            {/* Optional Specs */}
            <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
              <div className="flex items-center gap-3">
                <span className="text-[11px]">Fuel: <strong className="text-white">{fuelType}</strong></span>
                <span className="text-[11px]">Rated Mileage: <strong className="text-white">{expectedMileage} km/L</strong></span>
              </div>
            </div>

            {/* Submit */}
            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs text-zinc-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl text-xs font-bold bg-[#CCFF00] text-black hover:bg-[#b8e600] transition-colors shadow-lg shadow-[#CCFF00]/15 flex items-center gap-2"
              >
                <span>Add Car & Calculate</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
