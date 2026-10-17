import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { Vehicle, FuelType, EnergyType } from '../types';
import { Btn, Eyebrow, H1 } from './kit';
import { formatINR } from '../utils/formatters';

interface CustomCarModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveVehicle: (vehicle: Vehicle) => void;
  initialVehicle?: Vehicle | null; // If editing
}

export const CustomCarModal: React.FC<CustomCarModalProps> = ({
  isOpen,
  onClose,
  onSaveVehicle,
  initialVehicle,
}) => {
  const isEditing = !!initialVehicle && !!initialVehicle.isCustom;

  const [make, setMake] = useState('Maruti Suzuki');
  const [model, setModel] = useState('Swift');
  const [variant, setVariant] = useState('VXi');
  const [year, setYear] = useState(2023);
  const [fuelType, setFuelType] = useState<FuelType>('Petrol');
  const [purchasePrice, setPurchasePrice] = useState(780000);
  const [currentValue, setCurrentValue] = useState(650000);
  const [purchaseDate, setPurchaseDate] = useState('2023-06-15');
  const [odometerKm, setOdometerKm] = useState(22000);
  const [expectedEfficiency, setExpectedEfficiency] = useState(20.5);

  const [error, setError] = useState('');

  useEffect(() => {
    if (initialVehicle) {
      setMake(initialVehicle.make);
      setModel(initialVehicle.model);
      setVariant(initialVehicle.variant || '');
      setYear(initialVehicle.year);
      setFuelType(initialVehicle.fuelType);
      setPurchasePrice(initialVehicle.purchasePrice);
      setCurrentValue(initialVehicle.currentValue);
      setPurchaseDate(initialVehicle.purchaseDate || '2023-01-01');
      setOdometerKm(initialVehicle.odometerKm || 0);
      setExpectedEfficiency(initialVehicle.expectedMileage || (initialVehicle.fuelType === 'EV' ? 7.2 : 18.0));
    } else {
      // Default to common Indian car
      setMake('Maruti Suzuki');
      setModel('Swift');
      setVariant('VXi');
      setYear(2023);
      setFuelType('Petrol');
      setPurchasePrice(780000);
      setCurrentValue(650000);
      setPurchaseDate('2023-06-15');
      setOdometerKm(22000);
      setExpectedEfficiency(20.5);
    }
    setError('');
  }, [initialVehicle, isOpen]);

  if (!isOpen) return null;

  // Auto-suggest current value when purchase price or year changes (if not editing an existing car)
  const handlePriceChange = (val: number) => {
    setPurchasePrice(val);
    if (!initialVehicle) {
      const currentYear = new Date().getFullYear();
      const age = Math.max(0, currentYear - year);
      const estDrop = age === 0 ? 0.85 : Math.max(0.4, 0.85 * Math.pow(0.9, age));
      setCurrentValue(Math.round(val * estDrop));
    }
  };

  const handleYearChange = (yr: number) => {
    setYear(yr);
    if (!initialVehicle) {
      const currentYear = new Date().getFullYear();
      const age = Math.max(0, currentYear - yr);
      const estDrop = age === 0 ? 0.85 : Math.max(0.4, 0.85 * Math.pow(0.9, age));
      setCurrentValue(Math.round(purchasePrice * estDrop));
    }
  };

  const handleFuelChange = (ft: FuelType) => {
    setFuelType(ft);
    if (ft === 'EV') {
      setExpectedEfficiency(7.0); // 7 km/kWh typical for Indian EVs
    } else if (ft === 'CNG') {
      setExpectedEfficiency(28.0); // 28 km/kg typical for CNG
    } else if (ft === 'Diesel') {
      setExpectedEfficiency(18.5);
    } else if (ft === 'Hybrid') {
      setExpectedEfficiency(25.0);
    } else {
      setExpectedEfficiency(18.0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!make.trim()) { setError('Make is required.'); return; }
    if (!model.trim()) { setError('Model is required.'); return; }
    if (purchasePrice <= 0) { setError('Purchase price must be greater than 0.'); return; }
    if (expectedEfficiency <= 0) { setError('Efficiency must be greater than 0.'); return; }

    const isEV = fuelType === 'EV';
    const isCNG = fuelType === 'CNG';
    const isHybrid = fuelType === 'Hybrid';
    const isDiesel = fuelType === 'Diesel';
    const energyType: EnergyType = isEV ? 'ELECTRIC' : isCNG ? 'CNG' : isHybrid ? 'HYBRID' : isDiesel ? 'DIESEL' : 'PETROL';

    const efficiency = Number(expectedEfficiency);
    const kwhPer100 = isEV ? Number((100 / Math.max(0.1, efficiency)).toFixed(1)) : undefined;

    const vehicleId = initialVehicle?.id || `custom-${Date.now()}`;

    const newVehicle: Vehicle = {
      id: vehicleId,
      make: make.trim(),
      model: model.trim(),
      variant: variant.trim() || 'Standard',
      year: Number(year),
      fuelType,
      energyType,
      isCustom: true,
      purchasePrice: Number(purchasePrice),
      currentValue: Number(currentValue) || Math.round(Number(purchasePrice) * 0.8),
      expectedMileage: efficiency,
      energyConsumptionKwhPer100Km: kwhPer100,
      maintenanceEstimate: Math.round(purchasePrice * (isEV ? 0.006 : 0.009) + 6000),
      insuranceEstimate: Math.round(purchasePrice * 0.012 + 6000),
      depreciationRate: make.toLowerCase().includes('maruti') || make.toLowerCase().includes('toyota') ? 0.075 : 0.09,
      firstYearDepreciationRate: 0.15,
      odometerKm: Number(odometerKm) || 0,
      purchaseDate: purchaseDate || `${year}-01-01`,
      image: '',
      colorName: 'Custom Entry',
      specs: {
        engine: isEV ? 'Electric Motor (Custom Entry)' : `${fuelType} Engine (User Defined)`,
        power: 'Not provided',
        torque: 'Not provided',
        transmission: 'Standard / Not provided',
        zeroToHundred: 'Not provided',
        fuelTankLiters: isEV ? 0 : 40,
        warrantyYears: 3,
      },
    };

    onSaveVehicle(newVehicle);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-surface border border-line rounded-3xl p-6 sm:p-8 shadow-2xl text-ink my-8">
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-5 right-5 w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <Eyebrow>{isEditing ? 'Edit Vehicle Details' : 'Add Your Vehicle'}</Eyebrow>
        <H1 className="!text-3xl mt-1">{isEditing ? `${make} ${model}` : 'Enter Car Information'}</H1>
        <p className="text-xs text-mute mt-1">
          Custom entries use honest estimates. No fake engine specs are invented.
        </p>

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-bad/10 border border-bad/30 text-bad text-xs font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-mute mb-1">Make / Brand *</label>
              <input
                type="text"
                required
                value={make}
                onChange={e => setMake(e.target.value)}
                placeholder="e.g. Maruti Suzuki, Tata, Hyundai"
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink focus:border-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-mute mb-1">Model *</label>
              <input
                type="text"
                required
                value={model}
                onChange={e => setModel(e.target.value)}
                placeholder="e.g. Swift, Punch, Brezza, Nexon"
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink focus:border-ink"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-mute mb-1">Variant / Trim</label>
              <input
                type="text"
                value={variant}
                onChange={e => setVariant(e.target.value)}
                placeholder="e.g. VXi, Creative, SX"
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink focus:border-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-mute mb-1">Model Year *</label>
              <input
                type="number"
                min={2005}
                max={2026}
                value={year}
                onChange={e => handleYearChange(Number(e.target.value))}
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink num focus:border-ink"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <label className="block text-xs font-medium text-mute mb-1">Fuel / Energy *</label>
              <select
                value={fuelType}
                onChange={e => handleFuelChange(e.target.value as FuelType)}
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink focus:border-ink cursor-pointer"
              >
                <option value="Petrol">Petrol</option>
                <option value="Diesel">Diesel</option>
                <option value="CNG">CNG</option>
                <option value="EV">Electric (EV)</option>
                <option value="Hybrid">Strong Hybrid</option>
              </select>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-mute mb-1">Purchase Price (₹) *</label>
              <input
                type="number"
                min={50000}
                step={5000}
                required
                value={purchasePrice}
                onChange={e => handlePriceChange(Number(e.target.value))}
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink num focus:border-ink"
              />
              <span className="text-[11px] text-mute mt-0.5 block">{formatINR(purchasePrice)}</span>
            </div>
            <div>
              <label className="block text-xs font-medium text-mute mb-1">Estimated Current Value (₹)</label>
              <input
                type="number"
                min={20000}
                step={5000}
                required
                value={currentValue}
                onChange={e => setCurrentValue(Number(e.target.value))}
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink num focus:border-ink"
              />
              <span className="text-[11px] text-mute mt-0.5 block">{formatINR(currentValue)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-mute mb-1">Odometer (Current km)</label>
              <input
                type="number"
                min={0}
                step={500}
                value={odometerKm}
                onChange={e => setOdometerKm(Number(e.target.value))}
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink num focus:border-ink"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-mute mb-1">
                {fuelType === 'EV' ? 'Efficiency (km / kWh) *' : fuelType === 'CNG' ? 'Efficiency (km / kg) *' : 'Mileage (km / L) *'}
              </label>
              <input
                type="number"
                step={0.1}
                min={1}
                max={60}
                required
                value={expectedEfficiency}
                onChange={e => setExpectedEfficiency(Number(e.target.value))}
                className="w-full bg-sunk border border-line rounded-xl px-3.5 py-2.5 text-sm text-ink num focus:border-ink"
              />
              {fuelType === 'EV' && (
                <span className="text-[11px] text-mute mt-0.5 block">
                  ~{(100 / Math.max(0.1, expectedEfficiency)).toFixed(1)} kWh/100 km
                </span>
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-line flex items-center justify-end gap-3">
            <Btn type="button" variant="ghost" onClick={onClose}>
              Cancel
            </Btn>
            <Btn type="submit" variant="solid">
              <Check className="w-4 h-4 mr-1.5" />
              {isEditing ? 'Save Changes' : 'Add to My Garage'}
            </Btn>
          </div>
        </form>
      </div>
    </div>
  );
};
