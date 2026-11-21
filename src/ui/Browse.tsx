import React, { useMemo, useState } from 'react';
import { Search, Zap, Fuel, Settings2, ArrowRight, ChevronRight } from 'lucide-react';
import { Vehicle, VehicleVariant, FuelType } from '../types';
import { INITIAL_VEHICLES } from '../data/mockData';
import { VEHICLE_VARIANTS, getVariantsForModel, getModelCoverage } from '../data/vehicleVariants';
import { formatINR } from '../utils/formatters';
import { Eyebrow, H1, VehicleImage, Chip, cx } from './kit';
import { Tab } from './Shell';

// ─── Types ───────────────────────────────────────────────────────────────────

interface BrowseProps {
  onGo: (t: Tab) => void;
  /** Called when the user clicks "Check affordability" on a vehicle+variant */
  onCheckAffordability: (vehicleId: string, variantId: string | null) => void;
  onOpenAddCar?: () => void;
}

type FuelFilter = 'All' | FuelType;
type TransmissionFilter = 'All' | 'Manual' | 'Automatic' | 'EV/CVT';
type BudgetFilter = 'All' | 'Under ₹10L' | '₹10–20L' | '₹20–40L' | 'Above ₹40L';

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Derive the entry-level (lowest) price for a model:
 * - If the model has registered variants, the min across all variant prices + base price.
 * - Otherwise just the base Vehicle purchasePrice.
 */
function entryPrice(vehicle: Vehicle): number {
  const variants = getVariantsForModel(vehicle.id);
  const validPrices = variants.map(v => v.purchasePrice).filter((p): p is number => p !== null);
  const variantMin = validPrices.length
    ? Math.min(...validPrices)
    : Infinity;
  return Math.min(vehicle.purchasePrice, variantMin);
}

/**
 * Build a flat list of all fuel types available for a model
 * (base vehicle + any variants).
 */
function modelFuelTypes(vehicle: Vehicle): Set<FuelType> {
  const types = new Set<FuelType>([vehicle.fuelType]);
  getVariantsForModel(vehicle.id).forEach(v => types.add(v.fuelType));
  return types;
}

/**
 * Build all transmission types available across the model.
 */
function modelTransmissions(vehicle: Vehicle): string[] {
  const txns: string[] = [vehicle.specs.transmission];
  getVariantsForModel(vehicle.id).forEach(v => txns.push(v.transmission));
  return txns;
}

function transmissionCategory(txn: string): TransmissionFilter {
  const l = txn.toLowerCase();
  if (l.includes('manual') && !l.includes('auto')) return 'Manual';
  if (
    l.includes('automatic') || l.includes('dct') || l.includes('ags') ||
    l.includes('cvt') || l.includes('amt') || l.includes('at') || l.includes('ivt')
  ) return 'Automatic';
  if (l.includes('single-speed') || l.includes('ev')) return 'EV/CVT';
  return 'Automatic';
}

function budgetCategory(price: number): BudgetFilter {
  if (price < 1000000) return 'Under ₹10L';
  if (price < 2000000) return '₹10–20L';
  if (price < 4000000) return '₹20–40L';
  return 'Above ₹40L';
}

function fuelIcon(ft: FuelType) {
  if (ft === 'EV') return <Zap className="w-3 h-3" />;
  if (ft === 'Hybrid') return <Zap className="w-3 h-3 opacity-60" />;
  return <Fuel className="w-3 h-3" />;
}

// ─── Deduplicate: WagonR CNG is a separate id but logically a WagonR variant ─
// We expose the CNG entry through the WagonR card via VEHICLE_VARIANTS, so we
// skip it as a standalone card to avoid a duplicate model listing.
const SKIP_AS_STANDALONE = new Set(['maruti-wagonr-cng']);

// ─── Grouped catalogue ────────────────────────────────────────────────────────

interface ModelGroup {
  make: string;
  models: Vehicle[];
}

function groupByMake(vehicles: Vehicle[]): ModelGroup[] {
  const map = new Map<string, Vehicle[]>();
  for (const v of vehicles) {
    if (SKIP_AS_STANDALONE.has(v.id)) continue;
    const arr = map.get(v.make) ?? [];
    arr.push(v);
    map.set(v.make, arr);
  }
  // Sort makes alphabetically; sort models within each make by entry price
  return [...map.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([make, models]) => ({
      make,
      models: models.sort((a, b) => entryPrice(a) - entryPrice(b)),
    }));
}

// ─── Main component ───────────────────────────────────────────────────────────

export const Browse: React.FC<BrowseProps> = ({ onGo, onCheckAffordability, onOpenAddCar }) => {
  const [query, setQuery] = useState('');
  const [fuelFilter, setFuelFilter] = useState<FuelFilter>('All');
  const [txFilter, setTxFilter] = useState<TransmissionFilter>('All');
  const [budgetFilter, setBudgetFilter] = useState<BudgetFilter>('All');
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const catalogue = useMemo(
    () => INITIAL_VEHICLES.filter(v => !v.isCustom),
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return catalogue.filter(v => {
      if (SKIP_AS_STANDALONE.has(v.id)) return false;
      if (q && !`${v.make} ${v.model} ${v.variant}`.toLowerCase().includes(q)) return false;
      if (fuelFilter !== 'All' && !modelFuelTypes(v).has(fuelFilter as FuelType)) return false;
      if (txFilter !== 'All') {
        const cats = modelTransmissions(v).map(transmissionCategory);
        if (!cats.includes(txFilter)) return false;
      }
      if (budgetFilter !== 'All' && budgetCategory(entryPrice(v)) !== budgetFilter) return false;
      return true;
    });
  }, [catalogue, query, fuelFilter, txFilter, budgetFilter]);

  const groups = useMemo(() => groupByMake(filtered), [filtered]);
  const selectedVehicle = selectedId ? catalogue.find(v => v.id === selectedId) ?? null : null;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Eyebrow>Catalogue</Eyebrow>
        <H1>Browse Cars</H1>
        <p className="text-sm text-mute mt-2">
          {catalogue.filter(v => !SKIP_AS_STANDALONE.has(v.id)).length} verified models ·{' '}
          {Object.values(VEHICLE_VARIANTS).reduce((s, vs) => s + vs.length, 0) +
            catalogue.filter(v => !SKIP_AS_STANDALONE.has(v.id)).length} total trims
        </p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-mute pointer-events-none" />
        <input
          type="search"
          id="browse-search"
          placeholder="Search make, model or variant…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="w-full pl-11 pr-4 min-h-11 rounded-full border border-line bg-surface text-sm placeholder:text-mute focus:outline-none focus:border-ink"
        />
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Budget */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['All', 'Under ₹10L', '₹10–20L', '₹20–40L', 'Above ₹40L'] as BudgetFilter[]).map(b => (
            <Chip key={b} active={budgetFilter === b} onClick={() => setBudgetFilter(b)}>{b}</Chip>
          ))}
        </div>
        {/* Fuel */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['All', 'Petrol', 'Diesel', 'EV', 'Hybrid', 'CNG'] as FuelFilter[]).map(f => (
            <Chip key={f} active={fuelFilter === f} onClick={() => setFuelFilter(f)}>
              <span className="flex items-center gap-1.5">
                {f !== 'All' && fuelIcon(f as FuelType)}
                {f}
              </span>
            </Chip>
          ))}
        </div>
        {/* Transmission */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {(['All', 'Manual', 'Automatic', 'EV/CVT'] as TransmissionFilter[]).map(t => (
            <Chip key={t} active={txFilter === t} onClick={() => setTxFilter(t)}>
              <span className="flex items-center gap-1.5">
                {t !== 'All' && <Settings2 className="w-3 h-3" />}
                {t}
              </span>
            </Chip>
          ))}
        </div>
      </div>

      {/* Results count */}
      {(query || fuelFilter !== 'All' || txFilter !== 'All' || budgetFilter !== 'All') && (
        <p className="text-sm text-mute">
          {filtered.filter(v => !SKIP_AS_STANDALONE.has(v.id)).length} model
          {filtered.filter(v => !SKIP_AS_STANDALONE.has(v.id)).length !== 1 ? 's' : ''} found
        </p>
      )}

      {/* Detail panel (if model selected) */}
      {selectedVehicle && (
        <ModelDetail
          vehicle={selectedVehicle}
          onClose={() => setSelectedId(null)}
          onCheckAffordability={onCheckAffordability}
          onOpenAddCar={onOpenAddCar}
        />
      )}

      {/* Grid */}
      {groups.length === 0 ? (
        <div className="py-20 text-center text-mute">
          <p className="font-display text-2xl">No models match</p>
          <p className="text-sm mt-2">Try different filters or clear the search.</p>
        </div>
      ) : (
        <div className="space-y-10">
          {groups.map(g => (
            <section key={g.make} aria-label={g.make}>
              <h2 className="font-display text-2xl mb-4">{g.make}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {g.models.map(v => (
                  <ModelCard
                    key={v.id}
                    vehicle={v}
                    isSelected={selectedId === v.id}
                    onSelect={() => setSelectedId(v.id === selectedId ? null : v.id)}
                    onCheckAffordability={onCheckAffordability}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Model Card ───────────────────────────────────────────────────────────────

const ModelCard: React.FC<{
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: () => void;
  onCheckAffordability: (vid: string, varid: string | null) => void;
}> = ({ vehicle, isSelected, onSelect, onCheckAffordability }) => {
  const variants = getVariantsForModel(vehicle.id);
  const allFuels = modelFuelTypes(vehicle);
  const ep = entryPrice(vehicle);
  const variantCount = variants.length; // count of *alternative* trims (not counting base)

  return (
    <article
      className={cx(
        'rounded-2xl border transition-all cursor-pointer',
        isSelected
          ? 'border-ink bg-surface ring-1 ring-ink'
          : 'border-line bg-surface hover:border-ink'
      )}
      onClick={onSelect}
      aria-selected={isSelected}
    >
      {/* Image */}
      <div className="px-4 pt-4">
        <VehicleImage vehicle={vehicle} priority={isSelected} className="rounded-xl" />
      </div>

      {/* Info */}
      <div className="px-4 pb-4 pt-3 space-y-2">
        <div>
          <p className="font-display text-xl leading-tight">{vehicle.model}</p>
          <p className="text-xs text-mute mt-0.5">
            {vehicle.year} · {vehicle.generation ?? ''}
          </p>
        </div>

        {/* Fuel badges */}
        <div className="flex flex-wrap gap-1">
          {[...allFuels].map(f => (
            <span
              key={f}
              className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] border border-line text-mute"
            >
              {fuelIcon(f)}{f}
            </span>
          ))}
          {variantCount > 0 && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] bg-sunk text-ink border border-line">
              +{variantCount} trim{variantCount > 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Price */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] text-mute">From ex-showroom</p>
            <p className="font-display text-lg num">{formatINR(ep)}</p>
          </div>
          <button
            id={`browse-afford-${vehicle.id}`}
            onClick={e => {
              e.stopPropagation();
              onCheckAffordability(vehicle.id, null);
            }}
            className="flex items-center gap-1 text-xs font-medium text-accent hover:underline cursor-pointer"
            aria-label={`Check affordability for ${vehicle.make} ${vehicle.model}`}
          >
            Afford? <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};

// ─── Model Detail Panel ───────────────────────────────────────────────────────

const ModelDetail: React.FC<{
  vehicle: Vehicle;
  onClose: () => void;
  onCheckAffordability: (vid: string, varid: string | null) => void;
  onOpenAddCar?: () => void;
}> = ({ vehicle, onClose, onCheckAffordability, onOpenAddCar }) => {
  const catalogueVariants = getVariantsForModel(vehicle.id);
  const coverage = getModelCoverage(vehicle.id);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

  const selectedVariant: VehicleVariant | null =
    catalogueVariants.find(v => v.variantId === selectedVariantId) ?? null;

  // The active price: base vehicle or selected variant
  const activePrice = selectedVariant?.purchasePrice ?? vehicle.purchasePrice;
  const activeMileage = selectedVariant?.expectedMileage ?? vehicle.expectedMileage;
  const activeFuel = selectedVariant?.fuelType ?? vehicle.fuelType;
  const activeTxn = selectedVariant?.transmission ?? vehicle.specs.transmission;
  const activeEngine = selectedVariant?.engineLabel ?? vehicle.specs.engine;
  const activePower = selectedVariant?.powerLabel ?? vehicle.specs.power;
  const activeTorque = selectedVariant?.torqueLabel ?? vehicle.specs.torque;

  const mileageUnit = activeFuel === 'EV' ? 'km/kWh' : activeFuel === 'CNG' ? 'km/kg' : 'km/L';

  // When switching to a CNG variant that points to a different base model id,
  // the affordability handoff must use the variant's baseModelId as vehicleId.
  const affordVehicleId = selectedVariant?.baseModelId ?? vehicle.id;
  const affordVariantId = selectedVariantId;

  return (
    <div
      className="rounded-2xl border border-ink bg-surface p-6 space-y-6 animate-in fade-in slide-in-from-top-2 duration-150"
      role="region"
      aria-label={`${vehicle.make} ${vehicle.model} details`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <Eyebrow>{vehicle.make} · {vehicle.year}</Eyebrow>
          <p className="font-display text-3xl mt-1">{vehicle.model}</p>
        </div>
        <button
          onClick={onClose}
          className="text-mute hover:text-ink text-sm cursor-pointer shrink-0 mt-1"
          aria-label="Close detail"
        >
          ✕ Close
        </button>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.4fr] gap-6">
        {/* Image */}
        <VehicleImage vehicle={vehicle} priority className="rounded-xl" />

        {/* Variant selector + specs */}
        <div className="space-y-5">
          {/* Variant chips */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-mute uppercase tracking-wider">
              Select Trim / Variant
            </p>
            <div className="flex flex-wrap gap-2">
              {/* Base catalogue entry = "top spec" */}
              <button
                id={`variant-base-${vehicle.id}`}
                onClick={() => setSelectedVariantId(null)}
                className={cx(
                  'px-3 py-1.5 rounded-full text-xs border font-medium cursor-pointer transition-colors',
                  selectedVariantId === null
                    ? 'bg-ink text-paper border-ink'
                    : 'border-line text-mute hover:border-ink hover:text-ink'
                )}
              >
                {vehicle.variant}
                <span className="block text-[10px] opacity-70">{formatINR(vehicle.purchasePrice)}</span>
              </button>
              {catalogueVariants.map(v => (
                <button
                  key={v.variantId}
                  id={`variant-${v.variantId}`}
                  onClick={() => setSelectedVariantId(v.variantId)}
                  className={cx(
                    'px-3 py-1.5 rounded-full text-xs border font-medium cursor-pointer transition-colors',
                    selectedVariantId === v.variantId
                      ? 'bg-ink text-paper border-ink'
                      : 'border-line text-mute hover:border-ink hover:text-ink'
                  )}
                >
                  {v.label}
                  <span className="block text-[10px] opacity-70">
                    {v.purchasePrice != null ? formatINR(v.purchasePrice) : 'Price unverified'}
                  </span>
                </button>
              ))}
            </div>
            {coverage && coverage.coverage === 'partial' && (
              <p className="text-xs text-mute mt-2" data-testid="coverage-label">
                Showing {coverage.listedTrims} of {coverage.knownTrims ?? 'all'} trims. Not listed?{' '}
                {onOpenAddCar ? (
                  <button
                    type="button"
                    onClick={onOpenAddCar}
                    className="underline text-accent hover:text-ink cursor-pointer font-medium"
                  >
                    Enter your own details
                  </button>
                ) : (
                  <span>Enter your own details in custom car</span>
                )}
                .
              </p>
            )}
            {catalogueVariants.length === 0 && (
              <p className="text-xs text-mute italic">
                Only one verified trim available for this model.
              </p>
            )}
          </div>

          {/* Key specs for selected variant */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            <SpecRow label="Ex-showroom" value={formatINR(activePrice)} />
            <SpecRow
              label={activeFuel === 'EV' ? 'Efficiency' : 'ARAI mileage'}
              value={`${activeMileage} ${mileageUnit}`}
            />
            <SpecRow label="Fuel type" value={activeFuel} />
            <SpecRow label="Transmission" value={activeTxn} />
            <SpecRow label="Engine" value={activeEngine} />
            <SpecRow label="Power" value={activePower} />
            <SpecRow label="Torque" value={activeTorque} />
            <SpecRow label="Warranty" value={`${vehicle.specs.warrantyYears} years`} />
          </div>

          <p className="text-[11px] text-mute italic">
            * Specs shown are from the selected trim. Prices are ex-showroom, 
            Delhi 2025. ARAI figures are certified ratings; real-world mileage varies.
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-line">
        <button
          id={`browse-afford-detail-${vehicle.id}`}
          onClick={() => onCheckAffordability(affordVehicleId, affordVariantId)}
          className="flex-1 inline-flex items-center justify-center gap-2 min-h-11 rounded-full bg-ink text-paper text-sm font-medium hover:bg-accent hover:text-accent-ink transition-colors cursor-pointer"
        >
          Check affordability <ArrowRight className="w-4 h-4" />
        </button>
        <button
          onClick={onClose}
          className="flex-1 inline-flex items-center justify-center min-h-11 rounded-full border border-line text-sm text-mute hover:border-ink hover:text-ink transition-colors cursor-pointer"
        >
          Back to catalogue
        </button>
      </div>
    </div>
  );
};

const SpecRow: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div className="rounded-lg bg-sunk px-3 py-2">
    <p className="text-[10px] text-mute uppercase tracking-wider">{label}</p>
    <p className="text-sm font-medium mt-0.5 leading-snug">{value}</p>
  </div>
);
