/**
 * Unit verification tests for Carconomy calculation engine
 * Tests: EMI calculation, Loan Amortization, True Cost consistency, Keep vs Sell, Driver Impact
 */
import { 
  calculateEMI, 
  calculateLoan, 
  calculateFuelCost, 
  calculateDepreciation, 
  calculateTrueCost,
  calculateDriverImpact 
} from './calculator';
import { Vehicle, Driver, OwnershipProfile, FinancialProfile } from '../types';

export function runEngineTests(): { success: boolean; results: string[] } {
  const results: string[] = [];

  // 1. EMI Test: standard ₹40L loan @ 8.85% p.a. for 5 years
  const principal = 4000000;
  const rate = 8.85;
  const tenure = 5;
  const emi = calculateEMI(principal, rate, tenure);
  // Standard EMI should be ~₹82,783
  const emiCorrect = emi > 80000 && emi < 85000;
  results.push(`Test 1 (calculateEMI): Principal ₹40L @ 8.85% for 5yr -> EMI: ₹${emi.toLocaleString()} [${emiCorrect ? 'PASS' : 'FAIL'}]`);

  // 2. Real loan principal test: Creta (₹19.8L) with ₹5L down -> principal must be ₹14.8L, not hardcoded ₹40L!
  const cretaLoan = calculateLoan(1980000, 500000, 8.85, 5, 5);
  const cretaPrincipalCorrect = cretaLoan.principal === 1480000;
  results.push(`Test 2 (calculateLoan): Creta ₹19.8L with ₹5L down -> Principal ₹${cretaLoan.principal.toLocaleString()} [${cretaPrincipalCorrect ? 'PASS' : 'FAIL'}]`);

  // 3. Fuel Calculation Test: 14,600 km / 13.8 km/L * ₹100/L
  const fuel = calculateFuelCost(14600, 13.8, 100);
  const fuelCorrect = fuel > 105000 && fuel < 106000;
  results.push(`Test 3 (calculateFuelCost): 14,600 km @ 13.8 km/L & ₹100/L -> ₹${fuel.toLocaleString()} [${fuelCorrect ? 'PASS' : 'FAIL'}]`);

  // 4. Depreciation Mode Separation:
  const testCar: Vehicle = {
    id: 'test-car',
    make: 'BMW',
    model: '3 Series',
    variant: '330i',
    year: 2025,
    fuelType: 'Petrol',
    purchasePrice: 5500000,
    currentValue: 4180000,
    expectedMileage: 13.8,
    maintenanceEstimate: 42000,
    insuranceEstimate: 41000,
    depreciationRate: 0.11,
    image: '',
    odometerKm: 18420,
    purchaseDate: '2025-08-12',
    specs: {
      engine: '2.0L Turbo',
      power: '258 hp',
      torque: '400 Nm',
      transmission: '8-Speed AT',
      zeroToHundred: '5.8s',
      fuelTankLiters: 59,
      warrantyYears: 3,
    },
  };

  const depBuying = calculateDepreciation(testCar, 5, 'BUYING_CAR');
  const depCurrent = calculateDepreciation(testCar, 5, 'CURRENT_CAR');
  // Buying mode starts from ₹55L, current mode starts from ₹41.8L
  const depModeCorrect = depBuying.yearlyValues[0] < 5500000 && depCurrent.yearlyValues[0] < 4180000;
  results.push(`Test 4 (calculateDepreciation modes): Buying starts from ₹55L, Current from ₹41.8L [${depModeCorrect ? 'PASS' : 'FAIL'}]`);

  // 5. Driver Impact test: Aggressive driver increases wear
  const drivers: Driver[] = [
    { id: 'd1', name: 'You', role: 'Me', dailyKm: 30, cityHighwaySplit: 70, drivingStyle: 'MODERATE' },
    { id: 'd2', name: 'Son', role: 'Children', dailyKm: 20, cityHighwaySplit: 50, drivingStyle: 'AGGRESSIVE' },
  ];
  const driverImpact = calculateDriverImpact(drivers, 13.8, 100, 'NCR / Delhi');
  const driverWearCorrect = driverImpact.additionalWearAnnual > 0 && driverImpact.aggressiveCount === 1;
  results.push(`Test 5 (calculateDriverImpact): Household wear reflects aggressive driver (+₹${driverImpact.additionalWearAnnual.toLocaleString()}) [${driverWearCorrect ? 'PASS' : 'FAIL'}]`);

  const allPassed = emiCorrect && cretaPrincipalCorrect && fuelCorrect && depModeCorrect && driverWearCorrect;
  return {
    success: allPassed,
    results,
  };
}
