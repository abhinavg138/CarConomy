import React, { useState } from 'react';
import { User, Wallet, Bell, Shield, Sliders, Save, Check, RefreshCw } from 'lucide-react';
import { FinancialProfile, OwnershipProfile, Vehicle } from '../types';
import { formatINR } from '../utils/formatters';

interface ProfileViewProps {
  finance: FinancialProfile;
  ownership: OwnershipProfile;
  activeVehicle: Vehicle;
  onUpdateFinance: (finance: FinancialProfile) => void;
  onUpdateOwnership: (ownership: OwnershipProfile) => void;
  onResetDemo: () => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  finance,
  ownership,
  activeVehicle,
  onUpdateFinance,
  onUpdateOwnership,
  onResetDemo,
}) => {
  const [localFinance, setLocalFinance] = useState(finance);
  const [localOwnership, setLocalOwnership] = useState(ownership);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = () => {
    onUpdateFinance(localFinance);
    onUpdateOwnership(localOwnership);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-[#12161D] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-700 to-zinc-900 border border-white/10 flex items-center justify-center text-xl font-bold text-[#CCFF00]">
            AG
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">Abhinav Gupta</h2>
            <p className="text-xs text-zinc-400">abhinavgupta8c2@gmail.com • Executive Member</p>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#CCFF00]/15 text-[#CCFF00] font-bold">
                PRO AUTOMOTIVE INTELLIGENCE
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={onResetDemo}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 transition-colors"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Reset Demo Defaults</span>
        </button>
      </div>

      {/* Financial Assumptions Form */}
      <div className="p-6 sm:p-8 rounded-3xl bg-[#0F131A] border border-white/10 space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-[#CCFF00]/15 flex items-center justify-center text-[#CCFF00]">
              <Wallet className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Household Financial Assumptions
              </h3>
              <p className="text-xs text-zinc-400">
                These numbers drive all True Cost per km & Financial Fit models.
              </p>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-[#CCFF00] text-black hover:bg-[#b8e600] transition-colors shadow-md shadow-[#CCFF00]/15"
          >
            {savedSuccess ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            <span>{savedSuccess ? 'Saved!' : 'Save Assumptions'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Household Monthly Inflow */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <label className="text-xs text-zinc-400 font-medium block mb-1">
              Household Monthly Income (INR)
            </label>
            <div className="text-lg font-bold text-white font-mono-numbers mb-2">
              {formatINR(localFinance.householdIncome)} / month
            </div>
            <input
              type="range"
              min="100000"
              max="1000000"
              step="25000"
              value={localFinance.householdIncome}
              onChange={(e) =>
                setLocalFinance({ ...localFinance, householdIncome: Number(e.target.value) })
              }
              className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Existing EMIs */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <label className="text-xs text-zinc-400 font-medium block mb-1">
              Existing Monthly EMIs (Home/Other Loans)
            </label>
            <div className="text-lg font-bold text-zinc-300 font-mono-numbers mb-2">
              {formatINR(localFinance.existingEmis)} / month
            </div>
            <input
              type="range"
              min="0"
              max="200000"
              step="5000"
              value={localFinance.existingEmis}
              onChange={(e) =>
                setLocalFinance({ ...localFinance, existingEmis: Number(e.target.value) })
              }
              className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Fuel Price Assumption */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <label className="text-xs text-zinc-400 font-medium block mb-1">
              Fuel Benchmark Tariff (INR / Litre)
            </label>
            <div className="text-lg font-bold text-white font-mono-numbers mb-2">
              ₹{localOwnership.fuelPrice.toFixed(1)} / L
            </div>
            <input
              type="range"
              min="85"
              max="125"
              step="0.5"
              value={localOwnership.fuelPrice}
              onChange={(e) =>
                setLocalOwnership({ ...localOwnership, fuelPrice: Number(e.target.value) })
              }
              className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Loan Interest Rate */}
          <div className="p-4 rounded-xl bg-black/40 border border-white/5">
            <label className="text-xs text-zinc-400 font-medium block mb-1">
              Automotive Loan Interest Rate
            </label>
            <div className="text-lg font-bold text-white font-mono-numbers mb-2">
              {localFinance.interestRate.toFixed(2)}% p.a.
            </div>
            <input
              type="range"
              min="7.5"
              max="12.0"
              step="0.25"
              value={localFinance.interestRate}
              onChange={(e) =>
                setLocalFinance({ ...localFinance, interestRate: Number(e.target.value) })
              }
              className="w-full accent-[#CCFF00] bg-zinc-800 h-1.5 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Preferences & Privacy Controls */}
      <div className="p-6 rounded-3xl bg-[#12161D] border border-white/10 space-y-4">
        <h3 className="text-base font-bold text-white">System Settings & Governance</h3>
        <div className="space-y-3 text-xs">
          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
            <div className="flex items-center gap-2 text-zinc-300">
              <Shield className="w-4 h-4 text-[#CCFF00]" />
              <span>Zero-Telemetry Enforcement (Strictly Local Computation)</span>
            </div>
            <span className="text-[#CCFF00] font-bold">ACTIVE</span>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-black/30 border border-white/5">
            <div className="flex items-center gap-2 text-zinc-300">
              <Bell className="w-4 h-4 text-zinc-400" />
              <span>Depreciation Curve Alerts (Quarterly Residual Updates)</span>
            </div>
            <input type="checkbox" defaultChecked className="accent-[#CCFF00] w-4 h-4 rounded" />
          </div>
        </div>
      </div>

      {/* 4. METHODOLOGY & DATA SOURCE TRANSPARENCY */}
      <div className="p-6 rounded-3xl bg-[#0F131A] border border-white/10 space-y-4">
        <div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
            FINANCIAL FIDUCIARY STANDARDS
          </span>
          <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
            Methodology & Source Data Transparency
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            Every figure in Carconomy is engine-derived from explicit formulas. No marketing estimates or arbitrary multipliers.
          </p>
        </div>

        <div className="space-y-2.5 text-xs">
          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Fuel Consumption Model</span>
              <span className="px-2 py-0.5 rounded-md bg-blue-500/15 text-blue-300 text-[10px] font-semibold">
                ARAI + Driving Style Degradation
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Base efficiency indexed to factory ARAI standards. Degraded dynamically by household driving style (-0% Efficient, -12% Moderate, -25% Aggressive) and urban split.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Depreciation & Residual Value</span>
              <span className="px-2 py-0.5 rounded-md bg-rose-500/15 text-rose-300 text-[10px] font-semibold">
                Secondary Market Actuarial Curve
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              New car purchase models an initial 18% Year 1 drive-off step down, compounded by brand-specific secondary retention rates (Toyota 8%, Hyundai 8.5%, Luxury Euro 11.5%).
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Keep or Sell Verdict Algorithm</span>
              <span className="px-2 py-0.5 rounded-md bg-[#CCFF00]/15 text-[#CCFF00] text-[10px] font-semibold">
                12-Month Like-for-Like Simulation
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Simulates exact 12-month capital requirements: (Current Car 12M Depr + Maintenance + Loan Interest) vs (Replacement Car 12M Friction + Year 1 Depr + New Loan Interest). Strict invariant: if Keep Cost &le; Sell Cost &rarr; KEEP, else SELL.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-white">Insurance & Financing</span>
              <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-300 text-[10px] font-semibold">
                IDV Zero-Dep + Reducing EMI
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Insurance amortized on Insured Declared Value (IDV) with 5% annual NCB reduction. Loans use mathematical reducing balance formula [P &times; r &times; (1+r)^n / ((1+r)^n - 1)].
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
