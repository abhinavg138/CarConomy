import React from 'react';
import { 
  Wrench, 
  PhoneCall, 
  Users, 
  Sparkles, 
  PieChart, 
  ShieldCheck, 
  Settings2, 
  Plus, 
  RotateCcw,
  ChevronRight
} from 'lucide-react';
import { Vehicle, CalculatedEconomics } from '../types';
import { formatINR } from '../utils/formatters';

interface MoreMenuViewProps {
  vehicle: Vehicle;
  economics: CalculatedEconomics;
  onNavigateSubTab: (tab: string) => void;
  onOpenKeepSell: () => void;
  onOpenAddCar: () => void;
  onResetDemo: () => void;
}

export const MoreMenuView: React.FC<MoreMenuViewProps> = ({
  vehicle,
  economics,
  onNavigateSubTab,
  onOpenKeepSell,
  onOpenAddCar,
  onResetDemo,
}) => {
  const menuItems = [
    {
      id: 'SERVICES',
      title: 'Services & Upkeep',
      subtitle: 'Maintenance, tyres, batteries, detailing',
      icon: Wrench,
      color: 'text-blue-400',
      action: () => onNavigateSubTab('SERVICES'),
    },
    {
      id: 'CONSULTANCY',
      title: 'Carconomy Advisory',
      subtitle: '₹999 private strategy session & dossiers',
      icon: PhoneCall,
      color: 'text-[#CCFF00]',
      action: () => onNavigateSubTab('CONSULTANCY'),
    },
    {
      id: 'DRIVERS',
      title: 'Household Drivers',
      subtitle: `Who drives your car (${economics.householdDailyKm} km/day)`,
      icon: Users,
      color: 'text-purple-400',
      action: () => onNavigateSubTab('DRIVERS'),
    },
    {
      id: 'INSIGHTS',
      title: 'Strategic Insights',
      subtitle: 'Biggest costs & fuel saving opportunities',
      icon: Sparkles,
      color: 'text-amber-400',
      action: () => onNavigateSubTab('INSIGHTS'),
    },
    {
      id: 'COSTS',
      title: 'Cost Breakdown',
      subtitle: `₹${economics.costPerKm.toFixed(1)}/km itemized expense architecture`,
      icon: PieChart,
      color: 'text-emerald-400',
      action: () => onNavigateSubTab('COSTS'),
    },
    {
      id: 'KEEPOSELL',
      title: 'Keep or Sell Audit',
      subtitle: `12-month verdict: ${economics.keepSellDecision}`,
      icon: ShieldCheck,
      color: 'text-[#CCFF00]',
      action: onOpenKeepSell,
    },
    {
      id: 'PROFILE',
      title: 'Financial Assumptions',
      subtitle: 'Income, existing EMIs, fuel tariff & city',
      icon: Settings2,
      color: 'text-zinc-400',
      action: () => onNavigateSubTab('PROFILE'),
    },
    {
      id: 'LANDING',
      title: 'Product Tour & Pitch Landing',
      subtitle: 'Pitch Ignite presentation & real engine overview',
      icon: Sparkles,
      color: 'text-[#CCFF00]',
      action: () => onNavigateSubTab('LANDING'),
    },
  ];

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* 1. SCREEN TITLE */}
      <div className="pt-1">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#CCFF00] block">
          CARCONOMY SUITE
        </span>
        <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight mt-0.5">
          More Intelligence
        </h1>
        <p className="text-xs text-zinc-400 mt-0.5">
          Dedicated tools, services, and household settings for your {vehicle.model}.
        </p>
      </div>

      {/* 2. MENU LIST */}
      <div className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={item.action}
              className="w-full p-3.5 rounded-2xl bg-[#0F131A] hover:bg-[#131922] border border-white/8 flex items-center justify-between text-left transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className={`w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center ${item.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-xs font-bold text-white tracking-wide group-hover:text-[#CCFF00] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    {item.subtitle}
                  </p>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors" />
            </button>
          );
        })}
      </div>

      {/* 3. QUICK ACTIONS */}
      <div className="pt-3 border-t border-white/8 space-y-2">
        <button
          onClick={onOpenAddCar}
          className="w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4 text-[#CCFF00]" />
          <span>Add New Vehicle to Garage</span>
        </button>

        <button
          onClick={onResetDemo}
          className="w-full py-2.5 rounded-2xl text-zinc-400 hover:text-zinc-200 text-[11px] font-medium flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Presentation Demo State</span>
        </button>
      </div>
    </div>
  );
};
