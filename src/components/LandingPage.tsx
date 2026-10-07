import React, { useState } from 'react';
import { 
  ArrowRight, 
  ShieldCheck, 
  TrendingDown, 
  Users, 
  Gauge, 
  Scale, 
  Wallet, 
  Car, 
  Sparkles, 
  Check, 
  AlertTriangle, 
  HelpCircle,
  PhoneCall,
  CheckCircle2,
  ChevronDown,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Vehicle } from '../types';
import { formatINR, formatCostPerKm } from '../utils/formatters';

interface LandingPageProps {
  vehicles: Vehicle[];
  onOpenDashboard: () => void;
  onOpenKeepSell: () => void;
  onOpenComparison: () => void;
  onOpenConsultancy: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  vehicles,
  onOpenDashboard,
  onOpenKeepSell,
  onOpenComparison,
  onOpenConsultancy,
}) => {
  // Quick Calculator State
  const [selectedCarId, setSelectedCarId] = useState<string>(vehicles[0].id);
  const [quickDailyKm, setQuickDailyKm] = useState<number>(40);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const selectedCar = vehicles.find((v) => v.id === selectedCarId) || vehicles[0];

  // Deterministic quick estimate for the hero widget
  const annualKm = quickDailyKm * 365;
  const annualFuel = Math.round((annualKm / selectedCar.expectedMileage) * 100);
  const annualDep = Math.round(selectedCar.currentValue * selectedCar.depreciationRate);
  const annualMaint = selectedCar.maintenanceEstimate;
  const annualIns = selectedCar.insuranceEstimate;
  const annualTotal = annualFuel + annualDep + annualMaint + annualIns;
  const quickCostPerKm = (annualTotal / annualKm).toFixed(1);
  const fiveYearEst = annualTotal * 5;

  const faqs = [
    {
      q: 'Does Carconomy require an OBD-II device or vehicle GPS tracking?',
      a: 'No. Carconomy is strictly an automotive financial intelligence platform. It runs on deterministic mathematical models, real-world Indian pre-owned market transactions, and your household driving assumptions. We do not invent fake telemetry or access vehicle ECUs.',
    },
    {
      q: 'How does the "KEEP or SELL" algorithm work?',
      a: 'Our engine evaluates your vehicle’s specific depreciation curve inflection point against upcoming scheduled maintenance cliffs. When residual value loss and scheduled maintenance exceed the cost of replacing the vehicle, our algorithm flags a SELL recommendation with exact rupee savings.',
    },
    {
      q: 'Can Carconomy help me before buying a new or used car?',
      a: 'Yes! The BUY A CAR guided wizard and head-to-head Comparison engine calculate the exact 5-year ownership cost, monthly EMI, fuel burn, and financial affordability fit for any prospective car before you sign a loan.',
    },
    {
      q: 'What is the Household Driver Profile feature?',
      a: 'Vehicles driven by multiple family members or a chauffeur experience unique wear profiles. Carconomy models driving styles (Conservative, Moderate, Aggressive) and city/highway splits to calculate real-world mileage drop and extra annual wear down to the rupee.',
    },
    {
      q: 'Is Carconomy regulated financial advice?',
      a: 'Carconomy provides budgeting, cashflow modeling, and automotive asset depreciation intelligence. It is designed as a consumer decision support tool for smart car owners and buyers.',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 py-4 sm:py-8">
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative rounded-3xl bg-gradient-to-b from-[#131924] via-[#0E1219] to-[#08090C] border border-white/10 p-6 sm:p-10 lg:p-14 overflow-hidden shadow-2xl">
        {/* Ambient neon glows */}
        <div className="absolute -top-32 right-10 w-[500px] h-[500px] bg-[#CCFF00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-20 w-[400px] h-[400px] bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Hero Left Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-widest bg-[#CCFF00]/15 text-[#CCFF00] border border-[#CCFF00]/30 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
              Automotive Financial Intelligence
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.1]">
              Know what your car <br className="hidden sm:inline" />
              <span className="text-[#CCFF00] underline decoration-[#CCFF00]/30 decoration-wavy underline-offset-8">
                really costs.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
              Purchase price is just 38% of your real 5-year automotive capital outlay. Carconomy
              calculates your true cost per kilometre, unmasks depreciation cliffs, and tells you
              whether to <strong className="text-white">KEEP</strong> or <strong className="text-white">SELL</strong>.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onOpenDashboard}
                className="px-7 py-3.5 rounded-2xl bg-[#CCFF00] hover:bg-[#b8f000] text-black font-extrabold text-sm tracking-wide transition-all shadow-xl shadow-[#CCFF00]/25 flex items-center justify-center gap-2.5 group"
              >
                <span>Launch Live Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={onOpenKeepSell}
                className="px-6 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-4 h-4 text-[#CCFF00]" />
                <span>Keep or Sell Algorithm</span>
              </button>
            </div>

            {/* Quick Stat Trust Badges */}
            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-white/10 max-w-lg">
              <div>
                <span className="text-xl sm:text-2xl font-black text-white font-mono-numbers">₹18.4</span>
                <span className="text-[10px] text-zinc-400 block font-medium">True Cost / km Baseline</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-[#CCFF00] font-mono-numbers">₹3.3L</span>
                <span className="text-[10px] text-zinc-400 block font-medium">Avg 5-Yr Savings Found</span>
              </div>
              <div>
                <span className="text-xl sm:text-2xl font-black text-white font-mono-numbers">0%</span>
                <span className="text-[10px] text-zinc-400 block font-medium">ECU or GPS Telemetry</span>
              </div>
            </div>
          </div>

          {/* Hero Right: Live Interactive Quick-Estimator Card */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-3xl bg-[#12161E]/95 border border-white/15 backdrop-blur-xl shadow-2xl space-y-5 relative">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-[#CCFF00] animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider text-white">
                    Instant Cost / km Estimator
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono-numbers">Live Engine</span>
              </div>

              {/* Car Selection */}
              <div>
                <label className="text-[11px] font-semibold text-zinc-400 block mb-1.5 uppercase">
                  Select Vehicle Model
                </label>
                <select
                  value={selectedCarId}
                  onChange={(e) => setSelectedCarId(e.target.value)}
                  className="w-full bg-[#1A202C] text-xs font-semibold text-white px-3.5 py-2.5 rounded-xl border border-white/10 focus:border-[#CCFF00] focus:outline-none"
                >
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.make} {v.model} ({formatINR(v.purchasePrice)})
                    </option>
                  ))}
                </select>
              </div>

              {/* Daily Distance Slider */}
              <div>
                <div className="flex justify-between items-center text-xs mb-1.5">
                  <span className="text-zinc-400">Daily Commute Distance</span>
                  <span className="text-white font-bold font-mono-numbers">{quickDailyKm} km/day</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  step="5"
                  value={quickDailyKm}
                  onChange={(e) => setQuickDailyKm(Number(e.target.value))}
                  className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1 font-mono-numbers">
                  <span>10 km/day</span>
                  <span>{(quickDailyKm * 365).toLocaleString('en-IN')} km / year</span>
                  <span>100 km/day</span>
                </div>
              </div>

              {/* Calculated Results Callout */}
              <div className="p-4 rounded-2xl bg-black/50 border border-[#CCFF00]/25 space-y-3">
                <div className="flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-medium">
                      Your True Cost
                    </span>
                    <span className="text-3xl font-black text-[#CCFF00] font-mono-numbers">
                      ₹{quickCostPerKm}
                    </span>
                    <span className="text-xs text-zinc-400 font-sans"> / km</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-zinc-400 uppercase tracking-widest block font-medium">
                      Annual Burn
                    </span>
                    <span className="text-xl font-bold text-white font-mono-numbers">
                      {formatINR(annualTotal)}
                    </span>
                  </div>
                </div>

                <div className="pt-2.5 border-t border-white/10 flex items-center justify-between text-xs text-zinc-400">
                  <span>5-Year Cumulative Outlay:</span>
                  <span className="text-white font-bold font-mono-numbers">{formatINR(fiveYearEst)}</span>
                </div>
              </div>

              <button
                onClick={onOpenDashboard}
                className="w-full py-3 rounded-xl bg-white/10 hover:bg-[#CCFF00] text-white hover:text-black font-extrabold text-xs transition-colors flex items-center justify-center gap-2"
              >
                <span>View Full Household Breakdown</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. THE PROBLEM: THE HIDDEN AUTOMOTIVE ICEBERG             */}
      {/* ======================================================== */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest">
            The Financial Reality
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            The Invisible ₹6,00,000 Capital Leak
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            Most owners budget only for fuel and monthly loan payments. Here is what actually consumes
            your wealth across 5 years of ownership.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {/* Card A: What people think */}
          <div className="p-6 sm:p-7 rounded-3xl bg-[#12161D] border border-white/8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 block mb-2">
                Traditional Flawed Perspective
              </span>
              <h3 className="text-xl font-bold text-white">What Most Buyers Budget For</h3>
              <p className="text-xs text-zinc-400 mt-1 mb-5">
                Sticker price, basic fuel bills, and occasional oil changes.
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">Down Payment & Sticker Price</span>
                  <span className="text-white font-bold font-mono-numbers">₹15,00,000</span>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">Basic Monthly Petrol</span>
                  <span className="text-white font-bold font-mono-numbers">₹8,000 / mo</span>
                </div>
                <div className="p-3 rounded-xl bg-black/30 border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">Annual Standard Service</span>
                  <span className="text-white font-bold font-mono-numbers">₹15,000 / yr</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/5 text-xs text-rose-300/90 font-medium">
              &times; Ignores ₹4.6L annual depreciation, ₹18K driver wear, and insurance spikes.
            </div>
          </div>

          {/* Card B: What Carconomy reveals */}
          <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#18202C] to-[#10141C] border border-[#CCFF00]/30 shadow-xl shadow-[#CCFF00]/5 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#CCFF00] block mb-2">
                The Carconomy Truth
              </span>
              <h3 className="text-xl font-bold text-white">What The Car Actually Costs You</h3>
              <p className="text-xs text-zinc-300 mt-1 mb-5">
                Full deterministic modeling of capital depreciation, financing, wear, and insurance.
              </p>

              <div className="space-y-2.5">
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">Annual Depreciation Loss (Unseen)</span>
                  <span className="text-rose-400 font-bold font-mono-numbers">-₹2,80,000 / yr</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">Household Driving & Wear Multiplier</span>
                  <span className="text-[#CCFF00] font-bold font-mono-numbers">+₹18,700 / yr</span>
                </div>
                <div className="p-3 rounded-xl bg-black/40 border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-zinc-300">Scheduled Service, Tyres & Zero-Dep Insurance</span>
                  <span className="text-white font-bold font-mono-numbers">₹83,000 / yr</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-zinc-300 font-medium">True Amortized Reality:</span>
              <span className="text-lg font-black text-[#CCFF00] font-mono-numbers">₹18.4 / km</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. CORE INTELLIGENCE PILLARS (SIX CARDS)                  */}
      {/* ======================================================== */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest">
            Capabilities & Architecture
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Six Pillars of Automotive Intelligence
          </h2>
          <p className="text-sm text-zinc-400">
            Engineered like a financial Bloomberg terminal for your personal automotive assets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Pillar 1 */}
          <div className="p-6 rounded-2xl bg-[#12161D] border border-white/8 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#CCFF00]/15 text-[#CCFF00] flex items-center justify-center font-bold">
              <Gauge className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">True Cost / km Engine</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consolidates fuel, insurance, tyres, maintenance, and capital depreciation into a single
              definitive rupee-per-kilometre metric.
            </p>
          </div>

          {/* Pillar 2 */}
          <div className="p-6 rounded-2xl bg-[#12161D] border border-white/8 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/15 text-amber-300 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">KEEP or SELL Algorithm</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Calculates your upcoming 12-month depreciation curve and maintenance cliff to decide whether
              holding the car builds equity or destroys capital.
            </p>
          </div>

          {/* Pillar 3 */}
          <div className="p-6 rounded-2xl bg-[#12161D] border border-white/8 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 text-blue-300 flex items-center justify-center font-bold">
              <Users className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">Household Multi-Driver Profile</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Model wife, children, parents, and chauffeurs with unique daily km, city/highway splits,
              and driving styles (Conservative, Moderate, Aggressive).
            </p>
          </div>

          {/* Pillar 4 */}
          <div className="p-6 rounded-2xl bg-[#12161D] border border-white/8 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-300 flex items-center justify-center font-bold">
              <Wallet className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">Financial Affordability Fit</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Evaluates monthly car commitment against household income. Classifies financial burden as
              Comfortable (&lt;22%), Stretched (22-33%), or Aggressive (&gt;33%).
            </p>
          </div>

          {/* Pillar 5 */}
          <div className="p-6 rounded-2xl bg-[#12161D] border border-white/8 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/15 text-purple-300 flex items-center justify-center font-bold">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">Head-to-Head Comparison</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Compare BMW 3 Series vs Mercedes C-Class vs Audi A4 based on YOUR exact driving distance,
              producing a definitive 5-year savings verdict.
            </p>
          </div>

          {/* Pillar 6 */}
          <div className="p-6 rounded-2xl bg-[#12161D] border border-white/8 hover:border-white/20 transition-all space-y-3">
            <div className="w-10 h-10 rounded-xl bg-zinc-700 text-zinc-200 flex items-center justify-center font-bold">
              <Car className="w-5 h-5" />
            </div>
            <h4 className="text-lg font-bold text-white tracking-tight">3D Luxury Garage Studio</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Interactive 360° Three.js vehicle configurator with studio turntable lighting, paint
              swatches, LED headlights, and aerodynamic inspection.
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. ADVISORY CONSULTANCY CALLOUT BANNER                   */}
      {/* ======================================================== */}
      <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-[#171D27] via-[#10141D] to-[#141B18] border border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-xl">
          <span className="text-[10px] font-bold tracking-widest text-[#CCFF00] uppercase block">
            Carconomy Advisory
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            “Buying a car? Let us do the math.”
          </h3>
          <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
            1-on-1 strategic sessions with veteran automotive financial analysts. We evaluate dealer margins,
            resale drop curves, and variant traps before you commit.
          </p>
        </div>

        <button
          onClick={onOpenConsultancy}
          className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-[#CCFF00] text-white hover:text-black font-extrabold text-xs transition-colors flex items-center gap-2 shrink-0"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Book ₹999 Advisory Session</span>
        </button>
      </section>

      {/* ======================================================== */}
      {/* 5. FREQUENTLY ASKED QUESTIONS                            */}
      {/* ======================================================== */}
      <section className="max-w-3xl mx-auto space-y-6">
        <div className="text-center space-y-1.5">
          <span className="text-xs font-bold text-[#CCFF00] uppercase tracking-widest">
            Transparency
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaqIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-[#12161D] border border-white/8 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${
                      isOpen ? 'rotate-180 text-[#CCFF00]' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. FINAL BOTTOM CTA BANNER                                */}
      {/* ======================================================== */}
      <section className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-[#18202A] to-[#0A0D12] border border-[#CCFF00]/40 text-center space-y-6 shadow-2xl shadow-[#CCFF00]/5">
        <div className="max-w-xl mx-auto space-y-3">
          <span className="text-xs font-bold tracking-widest uppercase text-[#CCFF00]">
            Stop Guessing. Start Calculating.
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
            Take Control Of Your Car's Financial Life.
          </h2>
          <p className="text-sm text-zinc-300">
            Join discerning car owners who benchmark true cost/km, depreciation rate, and household wear.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onOpenDashboard}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#CCFF00] hover:bg-[#b8f000] text-black font-extrabold text-sm transition-all shadow-xl shadow-[#CCFF00]/25 flex items-center justify-center gap-2"
          >
            <span>Open Carconomy Live Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenComparison}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-bold text-sm border border-white/10 transition-colors"
          >
            Compare 2 Cars Now
          </button>
        </div>
      </section>
    </div>
  );
};
