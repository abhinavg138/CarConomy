import { 
  Driver, 
  FinancialProfile, 
  OwnershipProfile, 
  Vehicle, 
  CalculatedEconomics, 
  KeepSellDecision, 
  FinancialFitTier,
  LoanAmortization,
  IndividualDriverImpact,
  KeepSellAnalysis
} from '../types';

/**
 * City-specific traffic and road congestion modifier coefficients
 */
const CITY_FACTORS: Record<string, { mileageMult: number; wearMult: number }> = {
  'Mumbai': { mileageMult: 0.88, wearMult: 1.25 },
  'Bengaluru': { mileageMult: 0.86, wearMult: 1.30 },
  'NCR / Delhi': { mileageMult: 0.92, wearMult: 1.15 },
  'NCR': { mileageMult: 0.92, wearMult: 1.15 },
  'Hyderabad': { mileageMult: 0.94, wearMult: 1.10 },
  'Chennai': { mileageMult: 0.93, wearMult: 1.12 },
  'Pune': { mileageMult: 0.91, wearMult: 1.18 },
  'Tier-2 / Highway': { mileageMult: 1.05, wearMult: 0.90 },
};

/**
 * 1. P0 #2: Standard Amortization Loan & EMI Calculator
 */
export function calculateEMI(principal: number, annualRatePercent: number, tenureYears: number): number {
  if (principal <= 0 || tenureYears <= 0) return 0;
  if (annualRatePercent <= 0) return Math.round(principal / (tenureYears * 12));

  const monthlyRate = annualRatePercent / 12 / 100;
  const totalMonths = tenureYears * 12;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
              (Math.pow(1 + monthlyRate, totalMonths) - 1);
  return Math.round(emi);
}

export function calculateLoan(
  purchasePrice: number,
  downPaymentInput: number,
  annualRatePercent: number,
  tenureYears: number,
  ownershipYears: number
): LoanAmortization {
  // Principal is strictly bounded by vehicle's own purchase price
  const downPayment = Math.min(purchasePrice, Math.max(0, downPaymentInput));
  const principal = Math.max(0, purchasePrice - downPayment);
  
  if (principal === 0 || tenureYears <= 0) {
    return {
      principal: 0,
      monthlyEMI: 0,
      totalPayments: 0,
      totalInterest: 0,
      totalLoanCost: 0,
      paymentsDuringOwnership: 0,
      principalPaidDuringOwnership: 0,
      interestPaidDuringOwnership: 0,
      remainingPrincipalAtExit: 0,
    };
  }

  const monthlyEMI = calculateEMI(principal, annualRatePercent, tenureYears);
  const totalMonths = tenureYears * 12;
  const totalPayments = monthlyEMI * totalMonths;
  const totalInterest = Math.max(0, totalPayments - principal);

  // Month-by-month amortization schedule to calculate balance at exit
  const monthlyRate = annualRatePercent / 12 / 100;
  let balance = principal;
  let cumPrincipal = 0;
  let cumInterest = 0;
  const ownershipMonths = Math.min(totalMonths, Math.max(1, Math.round(ownershipYears * 12)));

  for (let m = 1; m <= ownershipMonths; m++) {
    const interestPart = balance * monthlyRate;
    const principalPart = monthlyEMI - interestPart;
    cumInterest += interestPart;
    cumPrincipal += principalPart;
    balance = Math.max(0, balance - principalPart);
  }

  const paymentsDuringOwnership = monthlyEMI * ownershipMonths;

  return {
    principal,
    monthlyEMI,
    totalPayments,
    totalInterest,
    totalLoanCost: totalPayments,
    paymentsDuringOwnership: Math.round(paymentsDuringOwnership),
    principalPaidDuringOwnership: Math.round(cumPrincipal),
    interestPaidDuringOwnership: Math.round(cumInterest),
    remainingPrincipalAtExit: Math.round(balance),
  };
}

/**
 * 2. Fuel Cost Calculator
 */
export function calculateFuelCost(annualKm: number, effectiveMileage: number, fuelPrice: number): number {
  if (effectiveMileage <= 0) return 0;
  return Math.round((annualKm / effectiveMileage) * fuelPrice);
}

/**
 * 3. Driver & Household Intelligence Calculator
 */
export function calculateDriverImpact(
  drivers: Driver[],
  baseMileage: number,
  fuelPrice: number,
  city: string = 'NCR / Delhi'
): {
  totalDailyKm: number;
  totalAnnualKm: number;
  effectiveMileage: number;
  additionalWearAnnual: number;
  aggressiveCount: number;
  driverImpacts: IndividualDriverImpact[];
} {
  const cityFactor = CITY_FACTORS[city] || { mileageMult: 0.94, wearMult: 1.12 };

  if (!drivers || drivers.length === 0) {
    const dailyKm = 40;
    const annualKm = dailyKm * 365;
    const effMileage = Math.max(5, Number((baseMileage * cityFactor.mileageMult).toFixed(1)));
    const annualFuel = calculateFuelCost(annualKm, effMileage, fuelPrice);
    
    return {
      totalDailyKm: dailyKm,
      totalAnnualKm: annualKm,
      effectiveMileage: effMileage,
      additionalWearAnnual: 0,
      aggressiveCount: 0,
      driverImpacts: [
        {
          driverId: 'default',
          name: 'Primary Driver',
          role: 'Me',
          dailyKm,
          annualKm,
          effectiveMileage: effMileage,
          annualFuelCost: annualFuel,
          annualWearCost: 0,
          totalCostShare: annualFuel,
          drivingStyle: 'MODERATE',
        },
      ],
    };
  }

  const totalDailyKm = drivers.reduce((acc, d) => acc + d.dailyKm, 0);
  const totalAnnualKm = Math.max(1000, totalDailyKm * 365);

  let totalWeightedMileageRatio = 0;
  let aggressiveCount = 0;
  let totalHouseholdWear = 0;

  const driverImpacts: IndividualDriverImpact[] = drivers.map((driver) => {
    const driverAnnualKm = driver.dailyKm * 365;

    // Driving style coefficients
    let styleMileageMult = 1.0;
    let driverWearCost = 0;

    if (driver.drivingStyle === 'CONSERVATIVE') {
      styleMileageMult = 1.07;
      driverWearCost = Math.round(driverAnnualKm * 0.4); // gentle on brakes/tyres
    } else if (driver.drivingStyle === 'AGGRESSIVE') {
      styleMileageMult = 0.83;
      driverWearCost = Math.round(driverAnnualKm * 1.5 + 8500); // aggressive braking, hard acceleration
      aggressiveCount++;
    } else {
      styleMileageMult = 1.0;
      driverWearCost = Math.round(driverAnnualKm * 0.75);
    }

    // City vs Highway split
    const cityRatio = driver.cityHighwaySplit / 100;
    const splitMileageFactor = 1.04 - (cityRatio * 0.16); // High city driving reduces efficiency
    const driverEffMileage = Math.max(
      4.5,
      Number((baseMileage * styleMileageMult * splitMileageFactor * cityFactor.mileageMult).toFixed(1))
    );

    const driverFuelCost = calculateFuelCost(driverAnnualKm, driverEffMileage, fuelPrice);
    totalHouseholdWear += driverWearCost;

    const weight = totalDailyKm > 0 ? driver.dailyKm / totalDailyKm : 1 / drivers.length;
    totalWeightedMileageRatio += weight * (styleMileageMult * splitMileageFactor * cityFactor.mileageMult);

    return {
      driverId: driver.id,
      name: driver.name,
      role: driver.role,
      dailyKm: driver.dailyKm,
      annualKm: driverAnnualKm,
      effectiveMileage: driverEffMileage,
      annualFuelCost: driverFuelCost,
      annualWearCost: driverWearCost,
      totalCostShare: driverFuelCost + driverWearCost,
      drivingStyle: driver.drivingStyle,
    };
  });

  const effectiveMileage = Math.max(4.5, Number((baseMileage * totalWeightedMileageRatio).toFixed(1)));

  return {
    totalDailyKm,
    totalAnnualKm,
    effectiveMileage,
    additionalWearAnnual: Math.round(totalHouseholdWear),
    aggressiveCount,
    driverImpacts,
  };
}

/**
 * 4. P0 #3: Depreciation Engine separating BUYING CAR vs CURRENT CAR
 */
export function calculateDepreciation(
  vehicle: Vehicle,
  ownershipYears: number,
  mode: 'CURRENT_CAR' | 'BUYING_CAR' = 'CURRENT_CAR'
): {
  annualDepreciation: number;
  fiveYearValueRemaining: number;
  fiveYearDepreciationTotal: number;
  tenureResaleValue: number;
  tenureDepreciationTotal: number;
  yearlyDepreciations: number[];
  yearlyValues: number[];
} {
  const years = Math.max(1, Math.min(10, Math.round(ownershipYears)));
  const baseRate = vehicle.depreciationRate || 0.11;

  if (mode === 'BUYING_CAR') {
    // BUYING MODE: starts strictly from purchasePrice
    const startValue = vehicle.purchasePrice;
    const year1Rate = vehicle.firstYearDepreciationRate || (baseRate * 1.55); // Brand new drop is steeper

    let currentValue = startValue;
    const yearlyDepreciations: number[] = [];
    const yearlyValues: number[] = [];

    for (let y = 1; y <= 5; y++) {
      let rate = baseRate;
      if (y === 1) rate = year1Rate;
      else if (y === 2) rate = baseRate * 1.05;
      else if (y === 3) rate = baseRate * 0.92;
      else if (y === 4) rate = baseRate * 0.82;
      else rate = baseRate * 0.72;

      const loss = Math.round(currentValue * rate);
      currentValue = Math.max(Math.round(startValue * 0.15), currentValue - loss);
      yearlyDepreciations.push(loss);
      yearlyValues.push(currentValue);
    }

    // For tenure specifically
    let tenureVal = startValue;
    for (let y = 1; y <= years; y++) {
      const idx = Math.min(y - 1, yearlyDepreciations.length - 1);
      tenureVal = yearlyValues[idx] || (tenureVal * 0.9);
    }

    return {
      annualDepreciation: yearlyDepreciations[0],
      fiveYearValueRemaining: yearlyValues[4],
      fiveYearDepreciationTotal: startValue - yearlyValues[4],
      tenureResaleValue: tenureVal,
      tenureDepreciationTotal: startValue - tenureVal,
      yearlyDepreciations,
      yearlyValues,
    };
  } else {
    // CURRENT CAR MODE: starts from current estimated market value
    const startValue = vehicle.currentValue;
    let currentValue = startValue;
    const yearlyDepreciations: number[] = [];
    const yearlyValues: number[] = [];

    for (let y = 1; y <= 5; y++) {
      // Car is already aged, depreciation curve is stabilizing
      const rate = Math.max(0.065, baseRate * Math.pow(0.88, y - 1));
      const loss = Math.round(currentValue * rate);
      currentValue = Math.max(Math.round(startValue * 0.2), currentValue - loss);
      yearlyDepreciations.push(loss);
      yearlyValues.push(currentValue);
    }

    const tenureVal = yearlyValues[Math.min(years - 1, 4)] || Math.round(startValue * 0.5);

    return {
      annualDepreciation: yearlyDepreciations[0],
      fiveYearValueRemaining: yearlyValues[4],
      fiveYearDepreciationTotal: startValue - yearlyValues[4],
      tenureResaleValue: tenureVal,
      tenureDepreciationTotal: startValue - tenureVal,
      yearlyDepreciations,
      yearlyValues,
    };
  }
}

/**
 * 5. P1 #1: Real Keep vs Sell Economic Comparison
 */
export function calculateKeepSell(
  vehicle: Vehicle,
  annualMaintenance: number,
  annualInsurance: number,
  annualFuelCost: number,
  loan: LoanAmortization
): KeepSellAnalysis {
  // Option A: KEEP the vehicle for another 12 months
  // Next 12 months depreciation based on current market curve
  const nextYearDepRate = Math.max(0.075, vehicle.depreciationRate * 0.94);
  const depreciation12M = Math.round(vehicle.currentValue * nextYearDepRate);
  
  // As car ages (odometer > 30k or age > 2 years), maintenance incurs scheduled service cliff
  const ageYears = Math.max(0, 2026 - vehicle.year);
  const odometerCliff = vehicle.odometerKm > 30000 ? 1.25 : 1.0;
  const ageCliff = ageYears >= 3 ? 1.3 : ageYears >= 2 ? 1.15 : 1.0;
  const maintenance12M = Math.round(annualMaintenance * ageCliff * odometerCliff);

  const insurance12M = Math.round(annualInsurance * 0.93); // slight depreciation on IDV
  const fuel12M = annualFuelCost;
  const loanInterest12M = loan.interestPaidDuringOwnership > 0 
    ? Math.round(loan.interestPaidDuringOwnership / Math.max(1, loan.totalPayments / 12)) 
    : 0;

  const costToKeep12M = depreciation12M + maintenance12M + insurance12M + fuel12M + loanInterest12M;

  // Option B: SELL NOW
  // Transaction fees, pre-sale inspection & pre-owned marketplace broker margin (~3.5%)
  const transactionCost = Math.round(vehicle.currentValue * 0.035);
  const currentNetResale = Math.max(0, vehicle.currentValue - transactionCost - loan.remainingPrincipalAtExit);
  
  // Replacement friction: cost of acquiring alternative car or new car 1st year depreciation hit
  const replacementCost12M = Math.round(vehicle.currentValue * 0.16);
  const costToSellNow = transactionCost + replacementCost12M;

  const breakEvenDifference = Math.abs(costToKeep12M - costToSellNow);

  let decision: KeepSellDecision = 'KEEP';
  let headlineReason = '';
  let detailedReason = '';

  // Decision logic rooted in actual numbers:
  // If holding cost for 12 months is significantly lower than replacing and resale loss has stabilized -> KEEP
  // If upcoming depreciation + maintenance is burning an excessively high fraction (> 16%) of current value -> SELL
  const holdingBurnRatio = (depreciation12M + maintenance12M) / Math.max(1, vehicle.currentValue);

  if (holdingBurnRatio <= 0.14) {
    decision = 'KEEP';
    headlineReason = `Keeping the car for another 12 months costs ₹${(costToKeep12M / 100000).toFixed(1)}L, whereas selling now exposes you to ₹${(costToSellNow / 100000).toFixed(1)}L in replacement and transaction friction.`;
    detailedReason = `Your ${vehicle.make} ${vehicle.model}'s depreciation curve has stabilized at ~${(nextYearDepRate * 100).toFixed(1)}%/yr. Selling prematurely resets you into a steep year-1 depreciation cycle on a replacement car.`;
  } else {
    decision = 'SELL';
    headlineReason = `Selling now limits your ₹${(depreciation12M / 100000).toFixed(1)}L upcoming value loss and ₹${(maintenance12M / 100000).toFixed(1)}L scheduled service cliff.`;
    detailedReason = `Expected 12-month capital loss (₹${(costToKeep12M / 100000).toFixed(1)}L) represents ${(holdingBurnRatio * 100).toFixed(1)}% of residual market value. Exit now to capture peak pre-owned market liquidity.`;
  }

  return {
    costToKeep12M,
    depreciation12M,
    maintenance12M,
    insurance12M,
    fuel12M,
    loanInterest12M,
    costToSellNow,
    currentNetResale,
    replacementCost12M,
    decision,
    headlineReason,
    detailedReason,
    breakEvenDifference,
  };
}

/**
 * 6. P1 #5: Financial Fit & Affordability Breakdown
 */
export function calculateFinancialFit(
  monthlyCarPayment: number,
  monthlyFuelCost: number,
  annualMaintenance: number,
  annualInsurance: number,
  householdIncome: number,
  existingEmis: number,
  otherCommitments: number = 0
): {
  monthlyAutomotiveBurden: number;
  totalMonthlyCommitments: number;
  incomeAllocationPercent: number;
  tier: FinancialFitTier;
  summary: string;
} {
  const monthlyMaintenanceReserve = Math.round((annualMaintenance + annualInsurance) / 12);
  const monthlyAutomotiveBurden = monthlyCarPayment + monthlyFuelCost + monthlyMaintenanceReserve;
  const totalMonthlyCommitments = monthlyAutomotiveBurden + existingEmis + otherCommitments;

  const incomeAllocationPercent = Number(
    ((totalMonthlyCommitments / Math.max(1, householdIncome)) * 100).toFixed(1)
  );

  let tier: FinancialFitTier = 'COMFORTABLE';
  let summary = '';

  if (incomeAllocationPercent <= 24) {
    tier = 'COMFORTABLE';
    summary = `Healthy cashflow allocation: car commitments represent ${incomeAllocationPercent}% of household income, leaving ample buffer for wealth building.`;
  } else if (incomeAllocationPercent <= 36) {
    tier = 'STRETCHED';
    summary = `This car is affordable, but consumes ${incomeAllocationPercent}% of your household monthly income across EMI, fuel, and upkeep.`;
  } else {
    tier = 'AGGRESSIVE';
    summary = `High exposure warning: ${incomeAllocationPercent}% of monthly household income is committed to EMIs and automotive overhead.`;
  }

  return {
    monthlyAutomotiveBurden,
    totalMonthlyCommitments,
    incomeAllocationPercent,
    tier,
    summary,
  };
}

/**
 * 7. P0 #1: Master Authoritative Carconomy True Cost Engine
 */
export function calculateTrueCost(
  vehicle: Vehicle,
  drivers: Driver[],
  ownership: OwnershipProfile,
  finance: FinancialProfile,
  mode: 'CURRENT_CAR' | 'BUYING_CAR' = 'CURRENT_CAR'
): CalculatedEconomics {
  // 1. Driver & Household calculation
  const household = calculateDriverImpact(drivers, vehicle.expectedMileage, ownership.fuelPrice, ownership.city);
  const annualKm = household.totalAnnualKm;
  const effectiveMileage = household.effectiveMileage;

  // 2. Fuel cost
  const annualFuelCost = calculateFuelCost(annualKm, effectiveMileage, ownership.fuelPrice);
  const monthlyFuelCost = Math.round(annualFuelCost / 12);

  // 3. Maintenance & Wear
  const baseMaint = ownership.maintenanceAnnual || vehicle.maintenanceEstimate;
  const annualMaintenance = Math.round(baseMaint + household.additionalWearAnnual);

  // 4. Insurance
  const annualInsurance = ownership.insuranceAnnual || vehicle.insuranceEstimate;

  // 5. Real Loan Amortization tailored specifically to THIS vehicle's price
  const downPaymentForThisCar = finance.downPaymentPercent 
    ? Math.round(vehicle.purchasePrice * (finance.downPaymentPercent / 100))
    : Math.min(vehicle.purchasePrice * 0.9, Math.max(vehicle.purchasePrice * 0.1, finance.downPayment));

  const loan = calculateLoan(
    vehicle.purchasePrice,
    downPaymentForThisCar,
    finance.interestRate,
    finance.loanTenureYears,
    ownership.ownershipYears
  );

  // 6. Depreciation & Resale Projections
  const dep = calculateDepreciation(vehicle, ownership.ownershipYears, mode);
  const annualDepreciation = dep.annualDepreciation;

  // 7. Repairs & Tyres
  const annualRepairs = ownership.repairsAnnual || Math.round(vehicle.purchasePrice * 0.0035 + 8000);
  const annualTyres = ownership.tyresAnnual || Math.round(annualKm * 0.95);

  // 8. Annual Financed Interest (Year 1)
  const annualFinancingInterest = loan.interestPaidDuringOwnership > 0
    ? Math.round(loan.interestPaidDuringOwnership / Math.min(ownership.ownershipYears, Math.max(1, finance.loanTenureYears)))
    : 0;

  // 9. Total Annual Ownership Cost (Year 1)
  const annualTotalCost = 
    annualFuelCost +
    annualMaintenance +
    annualInsurance +
    annualDepreciation +
    annualFinancingInterest +
    annualRepairs +
    annualTyres +
    (ownership.parkingTollsAnnual || 0);

  const costPerKm = Number((annualTotalCost / Math.max(1, annualKm)).toFixed(1));
  const monthlyOwnershipCost = Math.round(annualTotalCost / 12);

  // 10. Multi-year Cumulative Total Cost of Ownership (5-Year TCO)
  const yearlyCumulativeTCO: number[] = [];
  let cumTCO = 0;
  for (let yr = 1; yr <= 5; yr++) {
    const inflation = Math.pow(1.04, yr - 1);
    const yrFuel = annualFuelCost * inflation;
    const yrMaint = annualMaintenance * (1 + (yr - 1) * 0.08) * inflation;
    const yrIns = annualInsurance * (1 - (yr - 1) * 0.05) * inflation;
    const yrDep = dep.yearlyDepreciations[yr - 1] || annualDepreciation * 0.8;
    const yrInterest = yr <= finance.loanTenureYears ? annualFinancingInterest : 0;
    const yrTotal = yrFuel + yrMaint + yrIns + yrDep + yrInterest + annualRepairs + annualTyres;
    cumTCO += yrTotal;
    yearlyCumulativeTCO.push(Math.round(cumTCO));
  }

  const fiveYearTotalCost = yearlyCumulativeTCO[4];
  const fiveYearValueRemaining = dep.fiveYearValueRemaining;
  const fiveYearTotalKm = annualKm * 5;
  const fiveYearCostPerKm = Number((fiveYearTotalCost / Math.max(1, fiveYearTotalKm)).toFixed(1));

  // 11. Ownership Tenure Cost (based on ownershipYears slider)
  const tenureIdx = Math.min(4, Math.max(0, Math.round(ownership.ownershipYears) - 1));
  const totalTenureCost = yearlyCumulativeTCO[tenureIdx] || Math.round(annualTotalCost * ownership.ownershipYears);
  const tenureKm = annualKm * ownership.ownershipYears;
  const tenureCostPerKm = Number((totalTenureCost / Math.max(1, tenureKm)).toFixed(1));

  // 12. Keep or Sell Analysis
  const keepSellDetails = calculateKeepSell(
    vehicle,
    annualMaintenance,
    annualInsurance,
    annualFuelCost,
    loan
  );

  // 13. Financial Affordability Fit
  const fit = calculateFinancialFit(
    loan.monthlyEMI,
    monthlyFuelCost,
    annualMaintenance,
    annualInsurance,
    finance.householdIncome,
    finance.existingEmis,
    finance.otherCommitments
  );

  return {
    annualKm,
    effectiveMileage,
    annualFuelCost,
    monthlyFuelCost,
    annualMaintenance,
    annualInsurance,
    annualDepreciation,
    annualFinancingInterest,
    annualRepairs,
    annualTyres,
    annualTotalCost,
    costPerKm,
    monthlyOwnershipCost,

    householdDailyKm: household.totalDailyKm,
    householdAdditionalWear: household.additionalWearAnnual,
    aggressiveDriversCount: household.aggressiveCount,
    driverImpacts: household.driverImpacts,

    loan,

    tenureYears: ownership.ownershipYears,
    totalTenureCost,
    totalTenureDepreciation: dep.tenureDepreciationTotal,
    tenureResaleValue: dep.tenureResaleValue,
    tenureCostPerKm,

    fiveYearTotalCost,
    fiveYearValueRemaining,
    fiveYearCostPerKm,
    fiveYearDepreciationTotal: dep.fiveYearDepreciationTotal,
    fiveYearFuelTotal: Math.round(annualFuelCost * 5 * 1.08),
    fiveYearMaintenanceTotal: Math.round(annualMaintenance * 5 * 1.15),
    fiveYearInsuranceTotal: Math.round(annualInsurance * 5 * 0.9),
    fiveYearInterestTotal: loan.interestPaidDuringOwnership,
    yearlyCumulativeTCO,

    nextYearValue: keepSellDetails.currentNetResale,
    nextYearDepreciation: keepSellDetails.depreciation12M,
    nextYearMaintenance: keepSellDetails.maintenance12M,
    nextYearKeepingCost: keepSellDetails.costToKeep12M,
    keepSellDecision: keepSellDetails.decision,
    keepSellReason: keepSellDetails.headlineReason,
    keepSellDetails,

    monthlyCarPayment: loan.monthlyEMI,
    totalMonthlyCarCommitment: fit.monthlyAutomotiveBurden,
    incomeAllocationPercent: fit.incomeAllocationPercent,
    financialFitTier: fit.tier,
    financialFitSummary: fit.summary,
  };
}

/**
 * 8. Comparison Engine between 2 cars
 */
export function calculateComparison(
  carA: Vehicle,
  carB: Vehicle,
  drivers: Driver[],
  ownership: OwnershipProfile,
  finance: FinancialProfile
) {
  const ecoA = calculateTrueCost(carA, drivers, ownership, finance, 'BUYING_CAR');
  const ecoB = calculateTrueCost(carB, drivers, ownership, finance, 'BUYING_CAR');

  const diff5Year = Math.abs(ecoA.fiveYearTotalCost - ecoB.fiveYearTotalCost);
  const winnerIsA = ecoA.fiveYearTotalCost <= ecoB.fiveYearTotalCost;
  const winnerCar = winnerIsA ? carA : carB;
  const loserCar = winnerIsA ? carB : carA;
  const savings = diff5Year;

  return {
    carA,
    carB,
    ecoA,
    ecoB,
    winnerIsA,
    winnerCar,
    loserCar,
    savings,
  };
}
