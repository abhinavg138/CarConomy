import React, { useMemo, useState } from 'react';
import { Vehicle, Driver, OwnershipProfile, FinancialProfile, CalculatedEconomics } from '../types';
import { calculateComparison, evaluateJudgeProfileRecommendation } from '../utils/calculator';
import { formatINR, formatCostPerKm } from '../utils/formatters';
import { Eyebrow, H1, Big, Row, Segmented, Chip, NextStep, VehicleImage, Meter, cx } from './kit';
import { Tab } from './Shell';

export const Decide: React.FC<{
  vehicle: Vehicle;
  vehicles: Vehicle[];
  eco: CalculatedEconomics;
  drivers: Driver[];
  ownership: OwnershipProfile;
  finance: FinancialProfile;
  onGo: (t: Tab) => void;
}> = ({ vehicle, vehicles, eco, drivers, ownership, finance, onGo }) => {
  const [mode, setMode] = useState<'keep' | 'buy'>('keep');
  return (
    <div className="space-y-8">
      <div>
        <Eyebrow>Decide</Eyebrow>
        <H1>{mode === 'keep' ? 'Keep or sell' : 'Buy & compare'}</H1>
      </div>
      <Segmented
        value={mode}
        onChange={setMode}
        options={[
          { id: 'keep', label: `Your ${vehicle.model}: keep or sell` },
          { id: 'buy', label: 'Compare with another car' },
        ]}
      />
      {mode === 'keep' ? (
        <KeepSell eco={eco} />
      ) : (
        <Buy vehicle={vehicle} vehicles={vehicles} drivers={drivers} ownership={ownership} finance={finance} />
      )}
      <NextStep label="Act" title="Explore service quotes or talk to an advisor" onClick={() => onGo('services')} />
    </div>
  );
};

const KeepSell: React.FC<{ eco: CalculatedEconomics }> = ({ eco }) => {
  const k = eco.keepSellDetails;
  const keep = k.decision === 'KEEP';
  return (
    <section className="grid lg:grid-cols-2 gap-10 lg:gap-14">
      <div>
        <Big className={cx('text-7xl sm:text-8xl', keep ? 'text-good' : 'text-bad')}>{k.decision}</Big>
        <p className="font-display text-2xl mt-4 leading-snug">{k.headlineReason}</p>
        <p className="text-sm text-mute mt-3 leading-relaxed">{k.detailedReason}</p>
        <p className="text-sm mt-4 num">
          Break-even: <b>{k.breakEvenMonths > 0 ? `${k.breakEvenMonths} months` : k.breakEvenHorizon}</b> · difference {formatINR(Math.abs(k.breakEvenDifference))}
        </p>
        <p className="text-[11px] text-mute mt-4 italic">
          * Note: Maintenance cliffs and resale predictions are modeled estimates based on vehicle age and odometer progression, not guaranteed dealer buyback quotes.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-x-10 gap-y-8">
        <div>
          <Eyebrow>Keep · next 12 months</Eyebrow>
          <Row label="Depreciation" value={formatINR(k.depreciation12M)} />
          <Row label="Fuel / energy" value={formatINR(k.fuel12M)} />
          <Row label="Maintenance & wear" value={formatINR(k.maintenance12M)} />
          <Row label="Insurance" value={formatINR(k.insurance12M)} />
          <Row label="Loan interest" value={formatINR(k.loanInterest12M)} />
          <Row strong label="Total 12M Outlay" value={formatINR(k.costToKeep12M)} />
        </div>

        <div>
          <Eyebrow>Sell & replace (12M)</Eyebrow>
          <Row label="Estimated sell value" value={formatINR(k.sellTodayValue)} />
          <Row label="Transaction friction" value={formatINR(k.transactionCost)} />
          <Row label="Replacement 12M drop" value={formatINR(k.replacementDepreciation12M)} />
          <Row
            label="Replacement running"
            value={formatINR(k.replacementMaintenance12M + k.replacementInsurance12M + k.replacementInterest12M)}
          />
          <Row strong label="Total 12M Outlay" value={formatINR(k.costToSellReplace12M)} />
        </div>
      </div>
    </section>
  );
};

const Buy: React.FC<{
  vehicle: Vehicle;
  vehicles: Vehicle[];
  drivers: Driver[];
  ownership: OwnershipProfile;
  finance: FinancialProfile;
}> = ({ vehicle, vehicles, drivers, ownership, finance }) => {
  const others = vehicles.filter(v => v.id !== vehicle.id);
  const judgeRec = useMemo(
    () => evaluateJudgeProfileRecommendation(vehicles, finance, drivers, ownership),
    [vehicles, finance, drivers, ownership]
  );
  const defaultTargetId =
    judgeRec.topCar && judgeRec.topCar.id !== vehicle.id
      ? judgeRec.topCar.id
      : others[0]?.id || vehicles[0].id;
  const [bId, setBId] = useState(defaultTargetId);
  const b = others.find(v => v.id === bId) || others[0] || vehicles[0];

  const cmp = useMemo(
    () => (b ? calculateComparison(vehicle, b, drivers, ownership, finance) : null),
    [vehicle, b, drivers, ownership, finance]
  );
  if (!cmp || !b) return null;
  const { ecoA, ecoB } = cmp;

  // Separate purchase, running, maintenance, financing, depreciation and resale
  const rows: {
    l: string;
    sub?: string;
    a: number;
    z: number;
    f: (n: number) => string;
    lowerBetter?: boolean;
  }[] = [
    { l: 'Purchase Price', a: vehicle.purchasePrice, z: b.purchasePrice, f: formatINR, lowerBetter: true },
    {
      l: '5-Year Running (Fuel/Energy)',
      sub: `${ecoA.energyEfficiencyDisplay} vs ${ecoB.energyEfficiencyDisplay}`,
      a: ecoA.fiveYearFuelTotal,
      z: ecoB.fiveYearFuelTotal,
      f: formatINR,
      lowerBetter: true,
    },
    {
      l: '5-Year Maintenance & Wear',
      sub: 'Routine service, tyres & wear',
      a: ecoA.fiveYearMaintenanceTotal + ecoA.fiveYearRepairsTyresTotal,
      z: ecoB.fiveYearMaintenanceTotal + ecoB.fiveYearRepairsTyresTotal,
      f: formatINR,
      lowerBetter: true,
    },
    {
      l: '5-Year Financing Interest',
      sub: `Estimated @ ${finance.interestRate}% p.a.`,
      a: ecoA.fiveYearInterestTotal,
      z: ecoB.fiveYearInterestTotal,
      f: formatINR,
      lowerBetter: true,
    },
    {
      l: '5-Year Depreciation Loss',
      sub: 'Market value lost over 5 years',
      a: ecoA.fiveYearDepreciationTotal,
      z: ecoB.fiveYearDepreciationTotal,
      f: formatINR,
      lowerBetter: true,
    },
    {
      l: 'Estimated Year-5 Resale Value',
      sub: 'Projected value remaining (higher is better)',
      a: ecoA.fiveYearValueRemaining,
      z: ecoB.fiveYearValueRemaining,
      f: formatINR,
      lowerBetter: false,
    },
    {
      l: 'Total 5-Year Ownership Cost',
      sub: 'True cost of ownership to the family',
      a: ecoA.fiveYearTotalCost,
      z: ecoB.fiveYearTotalCost,
      f: formatINR,
      lowerBetter: true,
    },
    {
      l: 'True Cost per km',
      sub: 'All-inclusive cost per km driven',
      a: ecoA.costPerKm,
      z: ecoB.costPerKm,
      f: formatCostPerKm,
      lowerBetter: true,
    },
    {
      l: 'Monthly Loan EMI',
      a: ecoA.monthlyCarPayment,
      z: ecoB.monthlyCarPayment,
      f: formatINR,
      lowerBetter: true,
    },
  ];

  const win = (r: typeof rows[0], side: 'a' | 'z') => {
    if (r.a === r.z) return false;
    const lower = side === 'a' ? r.a < r.z : r.z < r.a;
    return r.lowerBetter !== false ? lower : !lower;
  };

  const tone = (e: CalculatedEconomics) =>
    e.financialFitTier === 'COMFORTABLE' ? 'good' : e.financialFitTier === 'STRETCHED' ? 'warn' : 'bad';

  return (
    <section className="space-y-8">
      <div>
        <Eyebrow className="mb-3">Compare {vehicle.model} with</Eyebrow>
        <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0 sm:flex-wrap">
          {others.map(o => (
            <Chip key={o.id} active={o.id === b.id} onClick={() => setBId(o.id)}>
              {o.make} {o.model}
            </Chip>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-8">
        {[vehicle, b].map(v => (
          <div key={v.id}>
            <VehicleImage vehicle={v} priority />
            <p className="mt-3 font-display text-xl sm:text-2xl">
              {v.make} {v.model}
            </p>
            <p className="text-xs text-mute">
              {v.variant} · {v.year} · {v.fuelType}
            </p>
          </div>
        ))}
      </div>

      <div className="max-w-3xl">
        {rows.map(r => (
          <div
            key={r.l}
            className="grid grid-cols-[1.4fr_1fr_1fr] gap-2 py-3 border-b border-line text-sm items-baseline"
          >
            <div>
              <span className="text-mute text-xs sm:text-sm font-medium">{r.l}</span>
              {r.sub && <span className="block text-[11px] text-mute/80">{r.sub}</span>}
            </div>
            <span className={cx('num text-right', win(r, 'a') && 'text-good font-semibold')}>
              {r.f(r.a)}
            </span>
            <span className={cx('num text-right', win(r, 'z') && 'text-good font-semibold')}>
              {r.f(r.z)}
            </span>
          </div>
        ))}

        <div className="grid grid-cols-2 gap-6 mt-5 text-xs text-mute">
          <div>
            <Meter pct={ecoA.incomeAllocationPercent} tone={tone(ecoA)} />
            <p className="mt-1 capitalize">
              {ecoA.financialFitTier.toLowerCase()} ({ecoA.incomeAllocationPercent.toFixed(1)}% income)
            </p>
          </div>
          <div>
            <Meter pct={ecoB.incomeAllocationPercent} tone={tone(ecoB)} />
            <p className="mt-1 capitalize">
              {ecoB.financialFitTier.toLowerCase()} ({ecoB.incomeAllocationPercent.toFixed(1)}% income)
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-ink pt-6 max-w-3xl">
        <Eyebrow>Financial Comparison Verdict</Eyebrow>
        <p className="font-display text-3xl mt-1">
          {cmp.winnerCar.make} {cmp.winnerCar.model} costs less over 5 years
        </p>
        <p className="text-sm mt-2 num text-good font-semibold">
          {typeof cmp.savings === 'number' ? `Saves ${formatINR(Math.abs(cmp.savings))} in total 5-year outlay` : ''}
        </p>
        <p className="text-sm text-mute mt-3 leading-relaxed">{cmp.verdictExplanation}</p>
        <p className="text-[11px] text-mute/80 mt-2 italic">
          * Based strictly on identical financial profile ({finance.interestRate}% loan rate, ₹{formatINR(finance.downPayment)} down payment) and {ownership.annualKm.toLocaleString()} annual km across both cars.
        </p>
      </div>
    </section>
  );
};
