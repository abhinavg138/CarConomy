import React, { useState } from 'react';
import { Check, X, PhoneCall, FileText } from 'lucide-react';
import { formatINR } from '../utils/formatters';

export const ConsultancySection: React.FC = () => {
  const [booked, setBooked] = useState<string | null>(null);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. SCREEN TITLE */}
      <div className="pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
          AUTOMOTIVE ADVISORY
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          Not sure which car to buy?
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Get unbiased, dealer-free financial advisory before signing a multi-lakh loan.
        </p>
      </div>

      {/* 2. ADVISORY CARD: ₹999 */}
      <div className="p-5 rounded-3xl bg-gradient-to-b from-[#131922] via-[#0E1219] to-[#0A0D12] border border-white/10 shadow-xl space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#CCFF00] block">
              1-ON-1 STRATEGY
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              Talk to an Advisor
            </h3>
          </div>
          <span className="text-2xl font-black text-[#CCFF00] font-mono-numbers">
            ₹999
          </span>
        </div>

        <div className="space-y-1.5 text-xs text-zinc-300">
          <p className="font-semibold text-white">Your personalized report includes:</p>
          <div className="space-y-1 pt-1 text-zinc-400">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span className="text-zinc-200">Budget & affordability fit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span className="text-zinc-200">Loan EMI & amortization audit</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span className="text-zinc-200">True 5-year ownership cost</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span className="text-zinc-200">Resale value retention curve</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-[#CCFF00]" />
              <span className="text-zinc-200">Best financial alternatives</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => setBooked('999')}
          className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-[#CCFF00]/15 hover:bg-[#b8e600] transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[48px]"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Talk to an Advisor</span>
        </button>
      </div>

      {/* 3. COMPLETE BUYING REPORT: ₹2,499 */}
      <div className="p-5 rounded-3xl bg-[#0F131A] border border-white/8 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
              COMPREHENSIVE DOSSIER
            </span>
            <h3 className="text-lg font-black text-white tracking-tight">
              Complete Buying Report
            </h3>
          </div>
          <span className="text-2xl font-black text-white font-mono-numbers">
            ₹2,499
          </span>
        </div>

        <p className="text-xs text-zinc-300 leading-relaxed">
          Comprehensive 25-page customized dossier auditing dealer quotations, hidden insurance markups, accessory bundles, and 5-year depreciation forecasts.
        </p>

        <button
          onClick={() => setBooked('2499')}
          className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider border border-white/10 transition-colors flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
        >
          <FileText className="w-4 h-4" />
          <span>Inspect Sample Report</span>
        </button>
      </div>

      {/* Honest Prototype Booking / Sample Dossier Dialog */}
      {booked && (
        <div 
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md"
          onClick={() => setBooked(null)}
        >
          <div 
            className="w-full max-w-lg bg-[#0F131A] border-t sm:border border-white/15 rounded-t-3xl sm:rounded-3xl p-6 text-white space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00]">
                  SAMPLE ADVISORY DOSSIER (LIVE ENGINE)
                </span>
                <h3 className="text-base font-bold text-white mt-0.5">Automotive Financial Strategy Brief</h3>
              </div>
              <button onClick={() => setBooked(null)} className="p-1 text-zinc-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200">
              <span className="font-bold">Prototype Demonstration:</span> In production, this service connects you with a certified automotive fiduciary. Below is the automated dossier generated from your active Carconomy numbers.
            </div>

            {/* Generated Deliverables Preview */}
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] block">
                  1. Affordability & Cashflow Verdict
                </span>
                <p className="text-zinc-300">
                  BMW 330i commits ₹1.46L/mo (36.0% net income) — <strong>STRETCHED</strong> tier. Hyundai Creta commits ₹69K/mo (18.1%) — <strong>COMFORTABLE</strong>.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] block">
                  2. 5-Year Reconciled Capital Outlay
                </span>
                <p className="text-zinc-300">
                  BMW 3 Series: ₹58.60 Lakh total burn (₹80.3/km). Hyundai Creta: ₹27.65 Lakh (₹37.9/km). Switching saves ₹30.95 Lakh over 5 years.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#CCFF00] block">
                  3. Dealer Invoice Markup Audit
                </span>
                <ul className="list-disc list-inside text-zinc-300 space-y-1">
                  <li>Mandatory dealer insurance premium inflated by ~₹38,000 vs direct zero-dep IDV</li>
                  <li>Dealer handling & logistics fee (₹25,000) challenged under RTO guidelines</li>
                  <li>Optional accessory pack (₹65,000) recommended for deletion</li>
                </ul>
              </div>
            </div>

            <button
              onClick={() => setBooked(null)}
              className="w-full py-3.5 rounded-2xl bg-[#CCFF00] text-black font-black text-xs uppercase tracking-wider hover:bg-[#b8e600] transition-colors cursor-pointer"
            >
              Close Sample Dossier
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
