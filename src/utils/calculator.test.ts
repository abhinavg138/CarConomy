/**
 * Unit verification & regression test suite for Carconomy calculation engine
 * Tests: EMI calculation, Loan Amortization, True Cost consistency,
 * Keep vs Sell regression scenarios (KEEP cheaper, SELL cheaper, equal, financed, fully paid),
 * Driver Impact, Mainstream Segment calibration, EV kWh/100km, CNG km/kg,
 * Custom vehicle creation, and Comparative fairness invariants.
 */
import { 
  calculateEMI, 
  calculateLoan, 
  calculateFuelCost, 
  calculateDepreciation, 
  calculateTrueCost,
  calculateDriverImpact,
  calculateKeepSell,
  calculateComparison,
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
    make: 'Tata',
    model: 'Nexon',
    variant: 'Fearless+ DCA',
    year: 2025,
    fuelType: 'Petrol',
    purchasePrice: 1450000,
    currentValue: 1250000,
    expectedMileage: 16.5,
    maintenanceEstimate: 12500,
    insuranceEstimate: 18000,
    depreciationRate: 0.09,
    firstYearDepreciationRate: 0.16,
    image: '',
    odometerKm: 14200,
    purchaseDate: '2024-07-28',
    specs: {
      engine: '1.2L Turbo',
      power: '120 hp',
      torque: '170 Nm',
      transmission: '7-Speed DCA',
      zeroToHundred: '10.4s',
      fuelTankLiters: 44,
      warrantyYears: 3,
    },
  };

  const depBuying = calculateDepreciation(testCar, 5, 'BUYING_CAR');
  const depCurrent = calculateDepreciation(testCar, 5, 'CURRENT_CAR');
  const depModeCorrect = depBuying.yearlyValues[0] < 1450000 && depCurrent.yearlyValues[0] < 1250000;
  results.push(`Test 4 (calculateDepreciation modes): Buying starts from ₹14.5L, Current from ₹12.5L [${depModeCorrect ? 'PASS' : 'FAIL'}]`);

  // 5. Driver Impact test: Aggressive driver increases wear
  const drivers: Driver[] = [
    { id: 'd1', name: 'You', role: 'Me', dailyKm: 30, cityHighwaySplit: 70, drivingStyle: 'MODERATE' },
    { id: 'd2', name: 'Son', role: 'Children', dailyKm: 20, cityHighwaySplit: 50, drivingStyle: 'AGGRESSIVE' },
  ];
  const driverImpact = calculateDriverImpact(drivers, 16.5, 96.72, 'NCR / Delhi');
  const driverWearCorrect = driverImpact.additionalWearAnnual > 0 && driverImpact.aggressiveCount === 1;
  results.push(`Test 5 (calculateDriverImpact): Household wear reflects aggressive driver (+₹${driverImpact.additionalWearAnnual.toLocaleString()}) [${driverWearCorrect ? 'PASS' : 'FAIL'}]`);

  // 6. Keep/Sell: KEEP cheaper scenario (Healthy car, passed initial steep depreciation)
  const dummyLoan = calculateLoan(testCar.purchasePrice, 300000, 8.75, 5, 5);
  const keepCheaperRes = calculateKeepSell(testCar, 12500, 18000, 65000, dummyLoan, 8.75, 5);
  const keepCheaperPass = keepCheaperRes.decision === 'KEEP' && 
                          keepCheaperRes.costToKeep12M <= keepCheaperRes.costToSellReplace12M &&
                          keepCheaperRes.headlineReason.includes('Keeping is estimated to cost');
  results.push(`Test 6 (Keep/Sell: KEEP cheaper): Decision is ${keepCheaperRes.decision}, Keep ₹${(keepCheaperRes.costToKeep12M/100000).toFixed(2)}L vs Replace ₹${(keepCheaperRes.costToSellReplace12M/100000).toFixed(2)}L [${keepCheaperPass ? 'PASS' : 'FAIL'}]`);

  // 7. Keep/Sell: SELL cheaper scenario (Aged luxury car with impending heavy service cliff and high depreciation)
  const agingCar: Vehicle = {
    ...testCar,
    currentValue: 600000,
    year: 2017,
    purchaseDate: '2017-03-01',
    odometerKm: 110000,
    depreciationRate: 0.25,
    maintenanceEstimate: 95000,
    insuranceEstimate: 22000,
  };
  const sellCheaperRes = calculateKeepSell(agingCar, 95000, 22000, 80000, dummyLoan, 8.75, 5);
  const sellCheaperPass = sellCheaperRes.decision === 'SELL' && 
                          sellCheaperRes.costToKeep12M > sellCheaperRes.costToSellReplace12M &&
                          sellCheaperRes.headlineReason.includes('Selling is estimated to save');
  results.push(`Test 7 (Keep/Sell: SELL cheaper): Decision is ${sellCheaperRes.decision}, Keep ₹${(sellCheaperRes.costToKeep12M/100000).toFixed(2)}L vs Replace ₹${(sellCheaperRes.costToSellReplace12M/100000).toFixed(2)}L [${sellCheaperPass ? 'PASS' : 'FAIL'}]`);

  // 7b. Keep/Sell: Invariant Test - decision MUST strictly equal (keepCost <= replaceCost ? 'KEEP' : 'SELL')
  const invariantPass = (keepCheaperRes.decision === 'KEEP') === (keepCheaperRes.costToKeep12M <= keepCheaperRes.costToSellReplace12M) &&
                        (sellCheaperRes.decision === 'SELL') === (sellCheaperRes.costToKeep12M > sellCheaperRes.costToSellReplace12M);
  results.push(`Test 7b (Keep/Sell: Strict Invariant No-Contradiction): [${invariantPass ? 'PASS' : 'FAIL'}]`);

  // 8. Keep/Sell: Financed vs Fully Paid test
  const financedInterest = calculateNext12MonthsLoanInterest(800000, 8.75, 5, 12);
  const financedPass = financedInterest.interestNext12M > 0 && financedInterest.remainingPrincipalNow > 0;
  results.push(`Test 8 (Loan: Financed at 1yr): Next 12M interest ₹${financedInterest.interestNext12M.toLocaleString()}, balance ₹${financedInterest.remainingPrincipalNow.toLocaleString()} [${financedPass ? 'PASS' : 'FAIL'}]`);

  // Fully Paid: 65 months into a 5-year loan (60 months) -> interest must be 0
  const paidInterest = calculateNext12MonthsLoanInterest(800000, 8.75, 5, 65);
  const paidPass = paidInterest.interestNext12M === 0 && paidInterest.remainingPrincipalNow === 0;
  results.push(`Test 9 (Loan: Fully paid at 65mo): Interest ₹${paidInterest.interestNext12M}, balance ₹${paidInterest.remainingPrincipalNow} [${paidPass ? 'PASS' : 'FAIL'}]`);

  // 10. Mainstream Profile Calibration: WagonR (₹6.8L) is COMFORTABLE, BMW 3 Series (₹55L) is AGGRESSIVE/UNSUSTAINABLE
  const wagonr = INITIAL_VEHICLES.find(v => v.id === 'maruti-wagonr') || INITIAL_VEHICLES[5];
  const bmw = INITIAL_VEHICLES.find(v => v.id === 'bmw-3-series') || INITIAL_VEHICLES[INITIAL_VEHICLES.length - 5];
  
  const wagonrEco = calculateTrueCost(wagonr, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE, 'BUYING_CAR');
  const bmwEco = calculateTrueCost(bmw, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE, 'BUYING_CAR');

  const profileNarrativePass = wagonrEco.financialFitTier === 'COMFORTABLE' && bmwEco.financialFitTier === 'AGGRESSIVE';
  results.push(`Test 10 (Mainstream Profile Calibration): WagonR ₹6.8L is ${wagonrEco.financialFitTier} (${wagonrEco.incomeAllocationPercent}%), BMW 3 Series is ${bmwEco.financialFitTier} (${bmwEco.incomeAllocationPercent}%) [${profileNarrativePass ? 'PASS' : 'FAIL'}]`);

  // 11. Financial Reconciliation Test: Component totals must sum up to headline 5-year total to the rupee
  const nexon = INITIAL_VEHICLES[0];
  const nexonEco = calculateTrueCost(nexon, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE, 'BUYING_CAR');
  const componentSum = nexonEco.fiveYearFuelTotal + 
                       nexonEco.fiveYearMaintenanceTotal + 
                       nexonEco.fiveYearInsuranceTotal + 
                       nexonEco.fiveYearDepreciationTotal + 
                       nexonEco.fiveYearInterestTotal + 
                       nexonEco.fiveYearRepairsTyresTotal + 
                       nexonEco.fiveYearParkingTollsTotal;
  const reconciliationPass = componentSum === nexonEco.fiveYearTotalCost && 
                             nexonEco.yearlyCumulativeTCO[4] === nexonEco.fiveYearTotalCost;
  results.push(`Test 11 (Financial Reconciliation): Components ₹${componentSum.toLocaleString()} === Headline ₹${nexonEco.fiveYearTotalCost.toLocaleString()} [${reconciliationPass ? 'PASS' : 'FAIL'}]`);

  // 12. EV Economics Test: Punch EV must never produce km/L, must use kWh/100 km and electricity price
  const punchEv = INITIAL_VEHICLES.find(v => v.id === 'tata-punch-ev') || INITIAL_VEHICLES.find(v => v.energyType === 'ELECTRIC')!;
  const evEco = calculateTrueCost(punchEv, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE, 'BUYING_CAR');
  const evPass = evEco.energyType === 'ELECTRIC' && 
                 !evEco.energyEfficiencyDisplay.includes('km/L') &&
                 evEco.energyEfficiencyDisplay.includes('kWh/100 km') &&
                 evEco.energyMetricLabel === 'Energy' &&
                 evEco.annualFuelCost < 30000; // Electricity is ~₹14K for 12,000km vs ~₹75K for petrol
  results.push(`Test 12 (EV Economics: Punch EV): Metric = ${evEco.energyEfficiencyDisplay}, Annual Energy = ₹${evEco.annualFuelCost.toLocaleString()} [${evPass ? 'PASS' : 'FAIL'}]`);

  // 13. Driver Daily Km Slider Test: Increasing daily km must increase annual km and total cost
  const lowKmDrivers: Driver[] = [
    { id: 'd1', name: 'You', role: 'Me', dailyKm: 15, cityHighwaySplit: 70, drivingStyle: 'MODERATE' },
  ];
  const highKmDrivers: Driver[] = [
    { id: 'd1', name: 'You', role: 'Me', dailyKm: 50, cityHighwaySplit: 70, drivingStyle: 'MODERATE' },
  ];
  const lowEco = calculateTrueCost(testCar, lowKmDrivers, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const highEco = calculateTrueCost(testCar, highKmDrivers, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const driverKmPass = highEco.annualKm > lowEco.annualKm && highEco.annualTotalCost > lowEco.annualTotalCost;
  results.push(`Test 13 (Driver Daily Km): 15km/d (₹${lowEco.annualTotalCost.toLocaleString()}) vs 50km/d (₹${highEco.annualTotalCost.toLocaleString()}) [${driverKmPass ? 'PASS' : 'FAIL'}]`);

  // 14. Driving Style Test: Conservative vs Aggressive alters wear and efficiency
  const consDrivers: Driver[] = [
    { id: 'd1', name: 'You', role: 'Me', dailyKm: 30, cityHighwaySplit: 70, drivingStyle: 'CONSERVATIVE' },
  ];
  const aggrDrivers: Driver[] = [
    { id: 'd1', name: 'You', role: 'Me', dailyKm: 30, cityHighwaySplit: 70, drivingStyle: 'AGGRESSIVE' },
  ];
  const consEco = calculateTrueCost(testCar, consDrivers, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const aggrEco = calculateTrueCost(testCar, aggrDrivers, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const stylePass = aggrEco.householdAdditionalWear > consEco.householdAdditionalWear && 
                    aggrEco.effectiveMileage < consEco.effectiveMileage;
  results.push(`Test 14 (Driving Style): Conservative (${consEco.effectiveMileage} km/L, +₹${consEco.householdAdditionalWear}) vs Aggressive (${aggrEco.effectiveMileage} km/L, +₹${aggrEco.householdAdditionalWear}) [${stylePass ? 'PASS' : 'FAIL'}]`);

  // 15. Odometer Scaling Test: Higher odometer increases maintenance and repairs
  const lowOdoCar = { ...testCar, odometerKm: 15000 };
  const highOdoCar = { ...testCar, odometerKm: 75000 };
  const lowOdoEco = calculateTrueCost(lowOdoCar, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const highOdoEco = calculateTrueCost(highOdoCar, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const odoPass = highOdoEco.annualMaintenance > lowOdoEco.annualMaintenance && 
                  highOdoEco.annualTotalCost > lowOdoEco.annualTotalCost;
  results.push(`Test 15 (Odometer Scaling): 15k km (Maint ₹${lowOdoEco.annualMaintenance.toLocaleString()}) vs 75k km (Maint ₹${highOdoEco.annualMaintenance.toLocaleString()}) [${odoPass ? 'PASS' : 'FAIL'}]`);

  // 16. Fuel Price Slider Test: ₹96.72/L vs ₹115/L
  const ownBase = { ...INITIAL_OWNERSHIP_PROFILE, fuelPrice: 96.72 };
  const ownHigh = { ...INITIAL_OWNERSHIP_PROFILE, fuelPrice: 115 };
  const ecoBase = calculateTrueCost(testCar, INITIAL_DRIVERS, ownBase, INITIAL_FINANCIAL_PROFILE);
  const ecoHigh = calculateTrueCost(testCar, INITIAL_DRIVERS, ownHigh, INITIAL_FINANCIAL_PROFILE);
  const fuelPricePass = ecoHigh.annualFuelCost > ecoBase.annualFuelCost;
  results.push(`Test 16 (Fuel Price): ₹96.72/L (₹${ecoBase.annualFuelCost.toLocaleString()}) vs ₹115/L (₹${ecoHigh.annualFuelCost.toLocaleString()}) [${fuelPricePass ? 'PASS' : 'FAIL'}]`);

  // 17. CNG Economics Test: WagonR CNG must use km/kg and cngPrice
  const wagonrCng = INITIAL_VEHICLES.find(v => v.id === 'maruti-wagonr-cng')!;
  const cngEco = calculateTrueCost(wagonrCng, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const cngPass = cngEco.energyType === 'CNG' &&
                  cngEco.energyMetricLabel === 'CNG' &&
                  cngEco.energyEfficiencyDisplay.includes('km/kg') &&
                  cngEco.annualFuelCost < 50000;
  results.push(`Test 17 (CNG Economics: WagonR CNG): Metric = ${cngEco.energyEfficiencyDisplay}, Annual CNG = ₹${cngEco.annualFuelCost.toLocaleString()} [${cngPass ? 'PASS' : 'FAIL'}]`);

  // 18. Custom Vehicle Creation & Honest Specs Test: Custom vehicle gets 'Not provided' specs, computes live TCO
  const customCar: Vehicle = {
    id: 'custom-user-swift-2021',
    make: 'Maruti Suzuki',
    model: 'Swift',
    variant: 'VXi 1.2 MT',
    year: 2021,
    fuelType: 'Petrol',
    isCustom: true,
    purchasePrice: 620000,
    currentValue: 490000,
    expectedMileage: 21.0,
    maintenanceEstimate: 7500,
    insuranceEstimate: 10500,
    depreciationRate: 0.08,
    odometerKm: 38000,
    purchaseDate: '2021-04-10',
    image: '',
    specs: {
      engine: '1.2L DualJet (User Defined)',
      power: 'Not provided',
      torque: 'Not provided',
      transmission: 'Manual',
      zeroToHundred: 'Not provided',
      fuelTankLiters: 37,
      warrantyYears: 2,
    },
  };
  const customEco = calculateTrueCost(customCar, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const customPass = customCar.isCustom === true &&
                     customCar.specs.power === 'Not provided' &&
                     customEco.costPerKm > 0 &&
                     customEco.monthlyOwnershipCost > 0;
  results.push(`Test 18 (Custom Vehicle Creation): Custom Swift cost per km = ₹${customEco.costPerKm}/km, specs honest = [${customPass ? 'PASS' : 'FAIL'}]`);

  // 19. Compare Invariant Test: Comparing Nexon vs Punch EV uses identical assumptions & determines winner mathematically
  const cmpResult = calculateComparison(nexon, punchEv, INITIAL_DRIVERS, INITIAL_OWNERSHIP_PROFILE, INITIAL_FINANCIAL_PROFILE);
  const cmpPass = cmpResult.winnerCar.id === (cmpResult.ecoA.fiveYearTotalCost <= cmpResult.ecoB.fiveYearTotalCost ? nexon.id : punchEv.id) &&
                  cmpResult.savings >= 0 &&
                  cmpResult.ecoA.annualKm === cmpResult.ecoB.annualKm;
  results.push(`Test 19 (Comparative Invariant): ${cmpResult.winnerCar.make} ${cmpResult.winnerCar.model} wins, 5yr savings ₹${cmpResult.savings.toLocaleString()} [${cmpPass ? 'PASS' : 'FAIL'}]`);

  const allPassed = emiCorrect && cretaPrincipalCorrect && fuelCorrect && depModeCorrect && 
                    driverWearCorrect && keepCheaperPass && sellCheaperPass && invariantPass && 
                    financedPass && paidPass && profileNarrativePass && reconciliationPass &&
                    evPass && driverKmPass && stylePass && odoPass && fuelPricePass &&
                    cngPass && customPass && cmpPass;

  return {
    success: allPassed,
    results,
  };
}
