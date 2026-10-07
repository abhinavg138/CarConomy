/**
 * Formatting utilities for Indian Currency (INR Lakhs, Crores, Thousands)
 * and automotive units
 */

export function formatINR(val: number, options?: { showDecimal?: boolean }): string {
  if (isNaN(val) || val === null || val === undefined) return '₹0';
  
  const abs = Math.abs(val);
  const sign = val < 0 ? '-' : '';

  if (abs >= 10000000) {
    // Crores (Cr)
    const cr = val / 10000000;
    return `${sign}₹${cr.toFixed(2)}Cr`;
  } else if (abs >= 100000) {
    // Lakhs (L)
    const lakhs = val / 100000;
    const formatted = (options?.showDecimal === false || lakhs >= 100)
      ? lakhs.toFixed(1)
      : lakhs.toFixed(2);
    return `${sign}₹${formatted}L`;
  } else if (abs >= 1000) {
    // Thousands (K)
    const k = val / 1000;
    return `${sign}₹${k.toFixed(k >= 10 ? 0 : 1)}K`;
  }
  
  return `${sign}₹${Math.round(val).toLocaleString('en-IN')}`;
}

export function formatINRFull(val: number): string {
  if (isNaN(val)) return '₹0';
  return `₹${Math.round(val).toLocaleString('en-IN')}`;
}

export function formatCostPerKm(val: number): string {
  if (isNaN(val)) return '₹0.0 / km';
  return `₹${val.toFixed(1)} / km`;
}

export function formatMileage(val: number, fuelType: string = 'Petrol'): string {
  const isEV = fuelType === 'EV' || fuelType === 'ELECTRIC';
  if (isEV) {
    const kwhPer100 = 100 / Math.max(0.1, val);
    return `${kwhPer100.toFixed(1)} kWh/100 km (${val.toFixed(1)} km/kWh)`;
  }
  if (fuelType === 'CNG') {
    return `${val.toFixed(1)} km/kg`;
  }
  return `${val.toFixed(1)} km/L`;
}

export function formatEnergyEfficiency(val: number, energyOrFuelType: string = 'Petrol'): string {
  const isEV = energyOrFuelType === 'EV' || energyOrFuelType === 'ELECTRIC';
  if (isEV) {
    const kwhPer100 = 100 / Math.max(0.1, val);
    return `${kwhPer100.toFixed(1)} kWh/100 km`;
  }
  if (energyOrFuelType === 'CNG') {
    return `${val.toFixed(1)} km/kg`;
  }
  return `${val.toFixed(1)} km/L`;
}

export function formatEnergyTariff(rate: number, energyOrFuelType: string = 'Petrol'): string {
  const isEV = energyOrFuelType === 'EV' || energyOrFuelType === 'ELECTRIC';
  if (isEV) {
    return `₹${rate.toFixed(2)}/kWh`;
  }
  if (energyOrFuelType === 'CNG') {
    return `₹${rate.toFixed(2)}/kg`;
  }
  return `₹${rate.toFixed(2)}/L`;
}

export function formatEnergyLabel(energyOrFuelType: string = 'Petrol'): string {
  const isEV = energyOrFuelType === 'EV' || energyOrFuelType === 'ELECTRIC';
  return isEV ? 'Energy' : 'Fuel';
}

export function formatNumber(val: number): string {
  return Math.round(val).toLocaleString('en-IN');
}
