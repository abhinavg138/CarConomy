import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Car, Sparkles } from 'lucide-react';
import { Vehicle, Driver, OwnershipProfile, FinancialProfile, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';
import { Eyebrow, H1, Row, Segmented, NextStep, Btn, VehicleImage } from './kit';
import { NumField } from './fields';
import { Tab } from './Shell';
import { CustomCarModal } from './CustomCarModal';

type Sub = 'costs' | 'drivers' | 'assumptions';

interface MyCarProps {
  vehicle: Vehicle | null;
  vehicles: Vehicle[];
  eco: CalculatedEconomics | null;
  drivers: Driver[];
  ownership: OwnershipProfile;
  finance: FinancialProfile;
  onDrivers: (d: Driver[]) => void;
  onOwnership: (o: OwnershipProfile) => void;
  onFinance?: (f: FinancialProfile) => void;
  onPickVehicle: (id: string) => void;
  onAddVehicle: (v: Vehicle) => void;
  onUpdateVehicle: (v: Vehicle) => void;
  onDeleteVehicle?: (id: string) => void;
  onGo: (t: Tab) => void;
}

export const MyCar: React.FC<MyCarProps> = ({
  vehicle,
  vehicles,
  eco,
  drivers,
  ownership,
  finance,
  onDrivers,
  onOwnership,
  onFinance,
  onPickVehicle,
  onAddVehicle,
  onUpdateVehicle,
  onDeleteVehicle,
  onGo,
}) => {
  const [sub, setSub] = useState<Sub>('costs');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);

  const handleOpenAdd = () => {
    setEditingVehicle(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = () => {
    if (vehicle) {
      setEditingVehicle(vehicle);
      setIsModalOpen(true);
    }
  };

  const handleSaveModal = (v: Vehicle) => {
    if (editingVehicle) {
      onUpdateVehicle(v);
    } else {
      onAddVehicle(v);
    }
  };

  // FIRST-TIME EMPTY STATE
  if (!vehicle || !eco) {
    const popularPicks = vehicles.filter(v => !v.isCustom && v.purchasePrice <= 2000000).slice(0, 6);
    return (
      <div className="space-y-10 max-w-3xl">
        <div className="p-8 sm:p-12 rounded-3xl bg-surface border border-line text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-sunk border border-line flex items-center justify-center text-accent">
            <Car className="w-8 h-8" />
          </div>
          <div>
            <Eyebrow>Garage Setup</Eyebrow>
            <H1 className="mt-1">Know What Your Car Really Costs</H1>
            <p className="text-sm text-mute mt-3 max-w-lg mx-auto leading-relaxed">
              Start by picking a popular Indian car from our verified database or enter your own custom car to calculate true ₹/km and 5-year ownership costs.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Btn variant="solid" onClick={handleOpenAdd}>
              <Plus className="w-4 h-4 mr-1.5" />
              + Add Custom Car
            </Btn>
          </div>

          <div className="pt-8 border-t border-line text-left">
            <Eyebrow className="mb-4">Or select from popular Indian models</Eyebrow>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {popularPicks.map(p => (
                <button
                  key={p.id}
                  onClick={() => onPickVehicle(p.id)}
                  className="p-3.5 rounded-2xl bg-sunk hover:border-ink border border-line text-left cursor-pointer transition-colors space-y-2.5"
                >
                  <VehicleImage vehicle={p} className="aspect-[16/10] w-full" />
                  <div>
                    <p className="font-medium text-sm text-ink">{p.make} {p.model}</p>
                    <p className="text-xs text-mute mt-0.5">{p.variant} · {formatINR(p.purchasePrice)}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <CustomCarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSaveVehicle={handleSaveModal}
          initialVehicle={editingVehicle}
        />
      </div>
    );
  }

  const max = Math.max(...eco.yearlyData.map(y => y.cumulativeTCO), 1);

  return (
    <div className="space-y-8">
      {/* Header with car title, photo, and actions */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-line">
        <div className="space-y-4 max-w-xl">
          <div>
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <Eyebrow>Know · My car</Eyebrow>
              {vehicle.isCustom && (
                <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-accent/15 text-accent border border-accent/30">
                  Custom Entry
                </span>
              )}
              <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-sunk text-mute border border-line">
                {vehicle.fuelType} · {eco.energyEfficiencyDisplay}
              </span>
            </div>
            <H1>
              {vehicle.make} {vehicle.model} <span className="text-mute text-2xl italic font-normal">{vehicle.variant}</span>
            </H1>
          </div>

          <div className="flex items-center gap-2">
            <Btn variant="ghost" onClick={handleOpenEdit} className="text-xs">
              <Edit3 className="w-3.5 h-3.5 mr-1" />
              Edit Car
            </Btn>
            <Btn variant="ghost" onClick={handleOpenAdd} className="text-xs">
              <Plus className="w-3.5 h-3.5 mr-1" />
              Add Another Car
            </Btn>
            {vehicle.isCustom && onDeleteVehicle && (
              <button
                onClick={() => onDeleteVehicle(vehicle.id)}
                aria-label="Delete custom car"
                className="p-2.5 rounded-full border border-line text-mute hover:text-bad hover:border-bad cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        <div className="w-full md:w-80 shrink-0">
          <VehicleImage vehicle={vehicle} priority className="w-full shadow-lg" />
        </div>
      </div>

      <Segmented
        value={sub}
        onChange={setSub}
        options={[
          { id: 'costs', label: 'Cost over time' },
          { id: 'drivers', label: 'Drivers' },
          { id: 'assumptions', label: 'Assumptions & Loan' },
        ]}
      />

      {sub === 'costs' && (
        <section className="space-y-8">
          <div className="flex items-end gap-2 h-40" role="img" aria-label="Cumulative cost by year">
            {eco.yearlyData.map(y => (
              <div key={y.year} className="flex-1 flex flex-col justify-end items-center gap-2 h-full">
                <span className="text-xs num text-mute">{formatINR(y.cumulativeTCO)}</span>
                <div
                  className="w-full bg-accent rounded-t-md"
                  style={{
                    height: `${(y.cumulativeTCO / max) * 100}%`,
                    opacity: 0.35 + 0.65 * (y.year / eco.yearlyData.length),
                  }}
                />
                <span className="text-xs text-mute">Y{y.year}</span>
              </div>
            ))}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm num min-w-[560px]">
              <thead>
                <tr className="text-left text-xs text-mute">
                  <th className="py-2 font-medium">Year</th>
                  <th className="font-medium text-right">{eco.energyMetricLabel}</th>
                  <th className="font-medium text-right">Maintenance & Wear</th>
                  <th className="font-medium text-right">Financing Interest</th>
                  <th className="font-medium text-right">Depreciation</th>
                  <th className="font-medium text-right">Year Total</th>
                  <th className="font-medium text-right">Estimated Car Value</th>
                </tr>
              </thead>
              <tbody>
                {eco.yearlyData.map(y => (
                  <tr key={y.year} className="border-t border-line">
                    <td className="py-3">Year {y.year}</td>
                    <td className="text-right">{formatINR(y.fuel)}</td>
                    <td className="text-right">{formatINR(y.maintenance + y.repairsAndTyres)}</td>
                    <td className="text-right">{formatINR(y.financingInterest)}</td>
                    <td className="text-right">{formatINR(y.depreciation)}</td>
                    <td className="text-right font-semibold">{formatINR(y.yearTotal)}</td>
                    <td className="text-right text-mute">{formatINR(y.vehicleValueAtYearEnd)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid sm:grid-cols-2 gap-6 max-w-xl">
            <Row
              strong
              label="Five-year total cost"
              value={formatINR(eco.fiveYearTotalCost)}
              sub="Includes depreciation, running fuel, maintenance, insurance & loan interest"
            />
            <Row
              strong
              label="Estimated Year-5 Resale"
              value={formatINR(eco.fiveYearValueRemaining)}
              sub="Projected market residual value after 5 years"
            />
          </div>
        </section>
      )}

      {sub === 'drivers' && (
        <section className="max-w-2xl">
          <p className="text-sm text-mute mb-2">
            Who drives changes wear, fuel efficiency, and household outlay. Adjust daily km to see live updates.
          </p>
          {eco.driverImpacts.map(di => {
            const d = drivers.find(x => x.id === di.driverId);
            return (
              <div key={di.driverId} className="py-5 border-b border-line">
                <div className="flex justify-between gap-4">
                  <div>
                    <p className="font-medium">{di.name}</p>
                    <p className="text-xs text-mute capitalize">
                      {di.role} · {di.drivingStyle.toLowerCase()} style · {di.effectiveMileage.toFixed(1)} {vehicle.fuelType === 'EV' ? 'km/kWh' : vehicle.fuelType === 'CNG' ? 'km/kg' : 'km/L'}
                    </p>
                  </div>
                  <p className="num text-sm text-right">
                    {formatINR(di.totalCostShare)}
                    <span className="block text-xs text-mute">per year</span>
                  </p>
                </div>
                {d && (
                  <label className="mt-3 flex items-center gap-4 text-xs text-mute">
                    <span className="w-20 num">{d.dailyKm} km/day</span>
                    <input
                      type="range"
                      min={0}
                      max={150}
                      value={d.dailyKm}
                      aria-label={`${d.name} daily km`}
                      className="flex-1 accent-[var(--accent)]"
                      onChange={e =>
                        onDrivers(drivers.map(x => (x.id === d.id ? { ...x, dailyKm: +e.target.value } : x)))
                      }
                    />
                  </label>
                )}
              </div>
            );
          })}
          {eco.aggressiveDriversCount > 0 && (
            <p className="text-sm text-warn mt-4">
              Aggressive driving style adds {formatINR(eco.householdAdditionalWear)} in extra tyre & brake wear per year.
            </p>
          )}
        </section>
      )}

      {sub === 'assumptions' && (
        <section className="space-y-8 max-w-3xl">
          <div>
            <Eyebrow className="mb-4">Operating Assumptions</Eyebrow>
            <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
              <NumField
                label="Annual driving distance"
                suffix="km"
                value={ownership.annualKm}
                onChange={n => onOwnership({ ...ownership, annualKm: n })}
              />
              <NumField
                label="Ownership tenure"
                suffix="years"
                value={ownership.ownershipYears}
                onChange={n => onOwnership({ ...ownership, ownershipYears: Math.max(1, Math.min(10, n)) })}
              />
              {vehicle.fuelType === 'EV' ? (
                <NumField
                  label="Electricity tariff"
                  prefix="₹"
                  suffix="/kWh"
                  value={ownership.electricityPrice ?? 8.5}
                  onChange={n => onOwnership({ ...ownership, electricityPrice: n })}
                />
              ) : vehicle.fuelType === 'CNG' ? (
                <NumField
                  label="CNG price"
                  prefix="₹"
                  suffix="/kg"
                  value={ownership.cngPrice ?? 78.5}
                  onChange={n => onOwnership({ ...ownership, cngPrice: n })}
                />
              ) : (
                <NumField
                  label="Fuel price"
                  prefix="₹"
                  suffix="/L"
                  value={ownership.fuelPrice}
                  onChange={n => onOwnership({ ...ownership, fuelPrice: n })}
                />
              )}
              <NumField
                label="Maintenance per year"
                prefix="₹"
                value={ownership.maintenanceAnnual ?? vehicle.maintenanceEstimate}
                onChange={n => onOwnership({ ...ownership, maintenanceAnnual: n })}
              />
              <NumField
                label="Insurance per year"
                prefix="₹"
                value={ownership.insuranceAnnual ?? vehicle.insuranceEstimate}
                onChange={n => onOwnership({ ...ownership, insuranceAnnual: n })}
              />
            </div>
          </div>

          {onFinance && (
            <div className="pt-6 border-t border-line">
              <Eyebrow className="mb-4">Financing & Loan Parameters</Eyebrow>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
                <NumField
                  label="Down payment"
                  prefix="₹"
                  value={finance.downPayment}
                  onChange={n => onFinance({ ...finance, downPayment: n })}
                />
                <NumField
                  label="Loan interest rate"
                  suffix="% p.a."
                  value={finance.interestRate}
                  onChange={n => onFinance({ ...finance, interestRate: n })}
                />
                <NumField
                  label="Loan tenure"
                  suffix="years"
                  value={finance.loanTenureYears}
                  onChange={n => onFinance({ ...finance, loanTenureYears: Math.max(1, Math.min(7, n)) })}
                />
                <div className="p-4 rounded-2xl bg-sunk border border-line flex flex-col justify-center">
                  <span className="text-xs text-mute">Calculated Monthly EMI</span>
                  <span className="text-xl font-bold num mt-0.5">{formatINR(eco.monthlyCarPayment)} / mo</span>
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      <NextStep label="Decide" title="Keep, sell, or compare with another car?" onClick={() => onGo('decide')} />

      <CustomCarModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSaveVehicle={handleSaveModal}
        initialVehicle={editingVehicle}
      />
    </div>
  );
};
