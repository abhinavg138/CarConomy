export type FuelType = 'Petrol' | 'Diesel' | 'Hybrid' | 'EV';

export type DrivingStyle = 'CONSERVATIVE' | 'MODERATE' | 'AGGRESSIVE';

export type DriverRole = 'Me' | 'Wife / Husband' | 'Children' | 'Parents' | 'Chauffeur' | 'Other';

export type KeepSellDecision = 'KEEP' | 'SELL';

export type FinancialFitTier = 'COMFORTABLE' | 'STRETCHED' | 'AGGRESSIVE';

export interface VehicleImages {
  hero: string;
  front?: string;
  rear?: string;
  side?: string;
  interior?: string;
  gallery?: string[];
  sourceAttribution?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  variant: string;
  year: number;
  generation?: string;
  fuelType: FuelType;
  purchasePrice: number; // in INR
  currentValue: number; // in INR (for current car)
  expectedMileage: number; // km/L or km/kWh
  maintenanceEstimate: number; // annual in INR
  insuranceEstimate: number; // annual in INR
  depreciationRate: number; // annual rate e.g. 0.11
  firstYearDepreciationRate?: number; // e.g. 0.18 for brand new cars
  resaleEstimate?: number;
  image: string;
  images?: VehicleImages;
  color?: string;
  colorName?: string;
  odometerKm: number;
  purchaseDate: string;
  specs: {
    engine: string;
    power: string;
    torque: string;
    transmission: string;
    zeroToHundred: string;
    fuelTankLiters: number;
    warrantyYears: number;
  };
}

export interface Driver {
  id: string;
  name: string;
  role: DriverRole;
  dailyKm: number;
  cityHighwaySplit: number; // % city e.g. 70 means 70% city, 30% highway
  drivingStyle: DrivingStyle;
}

export interface FinancialProfile {
  monthlyIncome: number; // in INR
  householdIncome: number; // in INR
  existingEmis: number; // in INR monthly
  otherCommitments: number; // in INR monthly
  downPayment: number; // in INR (applied when evaluating target car)
  downPaymentPercent?: number; // e.g. 25%
  loanAmount?: number; // in INR
  interestRate: number; // % annual e.g. 8.85
  loanTenureYears: number;
}

export interface OwnershipProfile {
  annualKm: number;
  fuelPrice: number; // per liter in INR
  ownershipYears: number;
  city: string; // e.g. "Mumbai", "NCR", "Bengaluru", "Pune", "Expressway"
  maintenanceAnnual?: number;
  insuranceAnnual?: number;
  repairsAnnual?: number;
  tyresAnnual?: number;
  parkingTollsAnnual?: number;
}

export interface IndividualDriverImpact {
  driverId: string;
  name: string;
  role: DriverRole;
  dailyKm: number;
  annualKm: number;
  effectiveMileage: number;
  annualFuelCost: number;
  annualWearCost: number;
  totalCostShare: number;
  drivingStyle: DrivingStyle;
}

export interface KeepSellAnalysis {
  costToKeep12M: number;
  depreciation12M: number;
  maintenance12M: number;
  insurance12M: number;
  fuel12M: number;
  loanInterest12M: number;
  costToSellNow: number;
  costToSellReplace12M: number;
  sellTodayValue: number;
  currentNetResale: number;
  expectedValueAfterOneYear: number;
  transactionCost: number;
  replacementCost12M: number;
  replacementDepreciation12M: number;
  replacementInterest12M: number;
  replacementMaintenance12M: number;
  replacementInsurance12M: number;
  breakEvenDifference: number; // Difference in INR
  breakEvenMonths: number;
  breakEvenHorizon: string;
  decision: KeepSellDecision;
  headlineReason: string;
  detailedReason: string;
}

export interface LoanAmortization {
  principal: number;
  monthlyEMI: number;
  totalPayments: number;
  totalInterest: number;
  totalLoanCost: number;
  paymentsDuringOwnership: number;
  principalPaidDuringOwnership: number;
  interestPaidDuringOwnership: number;
  remainingPrincipalAtExit: number;
}

export interface CalculatedEconomics {
  // Annual figures (Year 1)
  annualKm: number;
  effectiveMileage: number;
  annualFuelCost: number;
  monthlyFuelCost: number;
  annualMaintenance: number;
  annualInsurance: number;
  annualDepreciation: number;
  annualFinancingInterest: number;
  annualRepairs: number;
  annualTyres: number;
  annualTotalCost: number;
  costPerKm: number;
  monthlyOwnershipCost: number;

  // Household driver impacts
  householdDailyKm: number;
  householdAdditionalWear: number; // in INR
  aggressiveDriversCount: number;
  driverImpacts: IndividualDriverImpact[];

  // Real Loan calculation for THIS specific vehicle
  loan: LoanAmortization;

  // Ownership tenure projections (based on ownershipYears)
  tenureYears: number;
  totalTenureCost: number;
  totalTenureDepreciation: number;
  tenureResaleValue: number;
  tenureCostPerKm: number;

  // 5 Year Projections
  fiveYearTotalCost: number;
  fiveYearValueRemaining: number;
  fiveYearCostPerKm: number;
  fiveYearDepreciationTotal: number;
  fiveYearFuelTotal: number;
  fiveYearMaintenanceTotal: number;
  fiveYearInsuranceTotal: number;
  fiveYearInterestTotal: number;
  yearlyCumulativeTCO: number[]; // [yr1, yr2, yr3, yr4, yr5]

  // Keep or Sell analysis
  nextYearValue: number;
  nextYearDepreciation: number;
  nextYearMaintenance: number;
  nextYearKeepingCost: number;
  keepSellDecision: KeepSellDecision;
  keepSellReason: string;
  keepSellDetails: KeepSellAnalysis;

  // Financial Fit
  monthlyCarPayment: number; // Loan EMI for this car
  totalMonthlyCarCommitment: number; // EMI + Fuel + Maintenance + Insurance
  incomeAllocationPercent: number; // (Car commitments + existing EMIs) / household income
  financialFitTier: FinancialFitTier;
  financialFitSummary: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  categoryName: string;
  providerName: string;
  providerType: 'Authorized Service' | 'Premium Independent' | 'Verified Local Garage';
  price: number;
  rating: number;
  reviewsCount: number;
  distanceKm: number;
  estimatedTime: string;
  verified: boolean;
  warrantyMonths: number;
  features: string[];
}

export interface ConsultancyPackage {
  id: string;
  title: string;
  price: number;
  originalPrice?: number;
  duration: string;
  badge?: string;
  description: string;
  deliverables: string[];
  recommendedFor: string;
}
