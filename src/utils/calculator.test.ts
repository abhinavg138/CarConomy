/**
 * Unit verification & regression test suite for Carconomy calculation engine
 * Tests: EMI calculation, Loan Amortization, True Cost consistency,
 * Keep vs Sell regression scenarios (KEEP cheaper, SELL cheaper, equal, financed, fully paid),
 * Driver Impact, and Financial Profile narrative calibration.
 */
import { 
  calculateEMI, 
  calculateLoan, 
  calculateFuelCost, 
  calculateDepreciation, 
  calculateTrueCost,
  calculateDriverImpact,
  calculateKeepSell,
  calculateNext12MonthsLoanInterest
} from './calculator';
import { Vehicle, Driver, OwnershipProfile, FinancialProfile } from '../types';
import { INITIAL_VEHICLES, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE } from '../data/mockData';

export function runEngineTests(): { success: boolean; results: string[] } {
  const results: string[] = [];

  // 1. EMI Test: standard ₹40L loan @ 8.85% p.a. for 5 years
  const principal = 4000000;
  const rate = 8.85;
  const tenure = 5;
  const emi = calculateEMI(principal, rate, tenure);
  const emiCorrect = emi > 80000 && emi < 85000;
  results.push(`Test 1 (calculateEMI): Principal ₹40L @ 8.85% for 5yr -> EMI: ₹${emi.toLocaleString()} [${emiCorrect ? 'PASS' : 'FAIL'}]`);

  // 2. Real loan principal test: Creta (₹19.8L) with ₹5L down -> principal must be ₹14.8L, not hardcoded ₹40L
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

  // 6. Keep/Sell: KEEP cheaper scenario (Healthy car, passed initial steep depreciation)
  const dummyLoan = calculateLoan(testCar.purchasePrice, 1500000, 8.85, 5, 5);
  const keepCheaperRes = calculateKeepSell(testCar, 42000, 41000, 105000, dummyLoan, 8.85, 5);
  const keepCheaperPass = keepCheaperRes.decision === 'KEEP' && 
                          keepCheaperRes.costToKeep12M <= keepCheaperRes.costToSellReplace12M &&
                          keepCheaperRes.headlineReason.includes('Keeping is estimated to cost');
  results.push(`Test 6 (Keep/Sell: KEEP cheaper): Decision is ${keepCheaperRes.decision}, Keep ₹${(keepCheaperRes.costToKeep12M/100000).toFixed(2)}L vs Replace ₹${(keepCheaperRes.costToSellReplace12M/100000).toFixed(2)}L [${keepCheaperPass ? 'PASS' : 'FAIL'}]`);

  // 7. Keep/Sell: SELL cheaper scenario (Aged luxury car with impending heavy service cliff and high depreciation)
  const agingCar: Vehicle = {
    ...testCar,
    currentValue: 1800000,
    year: 2019,
    purchaseDate: '2019-03-01',
    odometerKm: 92000,
    depreciationRate: 0.28,
    maintenanceEstimate: 220000,
    insuranceEstimate: 52000,
  };
  const sellCheaperRes = calculateKeepSell(agingCar, 220000, 52000, 150000, dummyLoan, 8.85, 5);
  const sellCheaperPass = sellCheaperRes.decision === 'SELL' && 
                          sellCheaperRes.costToKeep12M > sellCheaperRes.costToSellReplace12M &&
                          sellCheaperRes.headlineReason.includes('Selling is estimated to save');
  results.push(`Test 7 (Keep/Sell: SELL cheaper): Decision is ${sellCheaperRes.decision}, Keep ₹${(sellCheaperRes.costToKeep12M/100000).toFixed(2)}L vs Replace ₹${(sellCheaperRes.costToSellReplace12M/100000).toFixed(2)}L [${sellCheaperPass ? 'PASS' : 'FAIL'}]`);

  // 7b. Keep/Sell: Invariant Test - decision MUST strictly equal (keepCost <= replaceCost ? 'KEEP' : 'SELL')
  const invariantPass = (keepCheaperRes.decision === 'KEEP') === (keepCheaperRes.costToKeep12M <= keepCheaperRes.costToSellReplace12M) &&
                        (sellCheaperRes.decision === 'SELL') === (sellCheaperRes.costToKeep12M > sellCheaperRes.costToSellReplace12M);
  results.push(`Test 7b (Keep/Sell: Strict Invariant No-Contradiction): [${invariantPass ? 'PASS' : 'FAIL'}]`);

  // 8. Keep/Sell: Financed vs Fully Paid test
  // Financed: 1 year into a 5-year loan -> interest must be positive
  const financedInterest = calculateNext12MonthsLoanInterest(4000000, 8.85, 5, 12);
  const financedPass = financedInterest.interestNext12M > 0 && financedInterest.remainingPrincipalNow > 0;
  results.push(`Test 8 (Loan: Financed at 1yr): Next 12M interest ₹${financedInterest.interestNext12M.toLocaleString()}, balance ₹${financedInterest.remainingPrincipalNow.toLocaleString()} [${financedPass ? 'PASS' : 'FAIL'}]`);

  // Fully Paid: 65 months into a 5-year loan (60 months) -> interest must be 0
  const paidInterest = calculateNext12MonthsLoanInterest(4000000, 8.85, 5, 65);
  const paidPass = paidInterest.interestNext12M === 0 && paidInterest.remainingPrincipalNow === 0;
  results.push(`Test 9 (Loan: Fully paid at 65mo): Interest ₹${paidInterest.interestNext12M}, balance ₹${paidInterest.remainingPrincipalNow} [${paidPass ? 'PASS' : 'FAIL'}]`);

  // 9. Demo Profile Narrative Test: BMW Stretched, Creta Comfortable
  const bmw = INITIAL_VEHICLES.find(v => v.id === 'bmw-3-series') || INITIAL_VEHICLES[0];
  const creta = INITIAL_VEHICLES.find(v => v.id === 'hyundai-creta') || INITIAL_VEHICLES[3];
  
  const bmwEco = calculateTrueCost(bmw, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE, 'BUYING_CAR');
  const cretaEco = calculateTrueCost(creta, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE, 'BUYING_CAR');

  // 10. Demo Profile Narrative Test: BMW Stretched, Creta Comfortable
  const demoNarrativePass = bmwEco.financialFitTier === 'STRETCHED' && cretaEco.financialFitTier === 'COMFORTABLE';
  results.push(`Test 10 (Demo Profile Narrative): BMW 3 Series is ${bmwEco.financialFitTier} (${bmwEco.incomeAllocationPercent}%), Creta is ${cretaEco.financialFitTier} (${cretaEco.incomeAllocationPercent}%) [${demoNarrativePass ? 'PASS' : 'FAIL'}]`);

  // 11. Financial Reconciliation Test: Component totals must sum up to headline 5-year total to the rupee
  const componentSum = bmwEco.fiveYearFuelTotal + 
                       bmwEco.fiveYearMaintenanceTotal + 
                       bmwEco.fiveYearInsuranceTotal + 
                       bmwEco.fiveYearDepreciationTotal + 
                       bmwEco.fiveYearInterestTotal + 
                       bmwEco.fiveYearRepairsTyresTotal + 
                       bmwEco.fiveYearParkingTollsTotal;
  const reconciliationPass = componentSum === bmwEco.fiveYearTotalCost && 
                             bmwEco.yearlyCumulativeTCO[4] === bmwEco.fiveYearTotalCost;
  results.push(`Test 11 (Financial Reconciliation): Components ₹${componentSum.toLocaleString()} === Headline ₹${bmwEco.fiveYearTotalCost.toLocaleString()} [${reconciliationPass ? 'PASS' : 'FAIL'}]`);

  const allPassed = emiCorrect && cretaPrincipalCorrect && fuelCorrect && depModeCorrect && 
                    driverWearCorrect && keepCheaperPass && sellCheaperPass && invariantPass && 
                    financedPass && paidPass && demoNarrativePass && reconciliationPass;

  return {
    success: allPassed,
    results,
  };
}
