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
    </div>
  );
};
