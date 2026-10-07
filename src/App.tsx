import React, { useState, useEffect } from 'react';
import { 
  INITIAL_VEHICLES, 
  INITIAL_DRIVERS, 
  INITIAL_FINANCIAL_PROFILE, 
  INITIAL_OWNERSHIP_PROFILE,
  INITIAL_SERVICES
} from './data/mockData';
import { Vehicle, Driver, FinancialProfile, OwnershipProfile } from './types';
import { calculateTrueCost } from './utils/calculator';
import { runEngineTests } from './utils/calculator.test';
import { Navbar } from './components/Navbar';
import { BottomNav } from './components/BottomNav';
import { HomeDashboard } from './components/HomeDashboard';
import { MyCarView } from './components/MyCarView';
import { BuyCarWizard } from './components/BuyCarWizard';
import { ServicesMarketplace } from './components/ServicesMarketplace';
import { ConsultancySection } from './components/ConsultancySection';
import { ProfileView } from './components/ProfileView';
import { CarComparisonView } from './components/CarComparisonView';
import { CostsView } from './components/CostsView';
import { InsightsView } from './components/InsightsView';
import { KeepOrSellModal } from './components/KeepOrSellModal';
import { AddCarModal } from './components/AddCarModal';
import { MoreMenuView } from './components/MoreMenuView';
import { DriverProfilesCard } from './components/DriverProfilesCard';
import { LandingPage } from './components/LandingPage';
import { ArrowLeft } from 'lucide-react';

export default function App() {
  // 1. Primary Bottom Navigation Tabs: HOME | MY_CAR | BUY | COMPARE | MORE
  const [activeTab, setActiveTab] = useState<string>('HOME');

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    try {
      const saved = localStorage.getItem('carconomy_vehicles_v4');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= INITIAL_VEHICLES.length) {
          return parsed;
        }
      }
      return INITIAL_VEHICLES;
    } catch {
      return INITIAL_VEHICLES;
    }
  });

  const [activeVehicleId, setActiveVehicleId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('carconomy_active_vehicle_id');
      return saved || 'bmw-3-series';
    } catch {
      return 'bmw-3-series';
    }
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => {
    try {
      const saved = localStorage.getItem('carconomy_drivers');
      return saved ? JSON.parse(saved) : INITIAL_DRIVERS;
    } catch {
      return INITIAL_DRIVERS;
    }
  });

  const [financialProfile, setFinancialProfile] = useState<FinancialProfile>(() => {
    try {
      const saved = localStorage.getItem('carconomy_finance_v4');
      return saved ? JSON.parse(saved) : INITIAL_FINANCIAL_PROFILE;
    } catch {
      return INITIAL_FINANCIAL_PROFILE;
    }
  });

  const [ownershipProfile, setOwnershipProfile] = useState<OwnershipProfile>(() => {
    try {
      const saved = localStorage.getItem('carconomy_ownership_v4');
      return saved ? JSON.parse(saved) : INITIAL_OWNERSHIP_PROFILE;
    } catch {
      return INITIAL_OWNERSHIP_PROFILE;
    }
  });

  const [isKeepSellModalOpen, setIsKeepSellModalOpen] = useState(false);
  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);

  // Run calculation engine unit tests on initialization
  useEffect(() => {
    const testResult = runEngineTests();
    if (!testResult.success) {
      console.warn('Carconomy Engine Tests Notice:', testResult.results);
    }
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('carconomy_vehicles_v4', JSON.stringify(vehicles));
      localStorage.setItem('carconomy_active_vehicle_id_v4', activeVehicleId);
      localStorage.setItem('carconomy_drivers_v4', JSON.stringify(drivers));
      localStorage.setItem('carconomy_finance_v4', JSON.stringify(financialProfile));
      localStorage.setItem('carconomy_ownership_v4', JSON.stringify(ownershipProfile));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [vehicles, activeVehicleId, drivers, financialProfile, ownershipProfile]);

  const activeVehicle = vehicles.find((v) => v.id === activeVehicleId) || vehicles[0];

  // 2. Single Authoritative True Cost Calculation Engine
  const currentEconomics = calculateTrueCost(
    activeVehicle,
    drivers,
    ownershipProfile,
    financialProfile,
    'CURRENT_CAR'
  );

  const handleAddNewCar = (newCar: Vehicle) => {
    setVehicles((prev) => [newCar, ...prev]);
    setActiveVehicleId(newCar.id);
    setActiveTab('MY_CAR');
  };

  const handleUpdateVehicle = (updated: Vehicle) => {
    setVehicles((prev) => prev.map((v) => (v.id === updated.id ? updated : v)));
  };

  const handleResetDemo = () => {
    setVehicles(INITIAL_VEHICLES);
    setActiveVehicleId('bmw-3-series');
    setDrivers(INITIAL_DRIVERS);
    setFinancialProfile(INITIAL_FINANCIAL_PROFILE);
    setOwnershipProfile(INITIAL_OWNERSHIP_PROFILE);
    setActiveTab('HOME');
  };

  const isSubTab = ['SERVICES', 'CONSULTANCY', 'DRIVERS', 'COSTS', 'INSIGHTS', 'PROFILE', 'LANDING'].includes(activeTab);

  return (
    <div className="min-h-screen bg-[#08090C] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#CCFF00] selection:text-black">
      {/* Primary Top Navigation */}
      <Navbar
        currentTab={activeTab}
        onSelectTab={setActiveTab}
        activeVehicle={activeVehicle}
        economics={currentEconomics}
        onOpenKeepSell={() => setIsKeepSellModalOpen(true)}
      />

      {/* Main Content View Container (Mobile First Sizing: 390x844 reference) */}
      <main className="flex-1 max-w-md md:max-w-xl w-full mx-auto px-4 pt-3 pb-24">
        {/* Sub-tab Back Navigation */}
        {isSubTab && (
          <button
            onClick={() => setActiveTab('MORE')}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-400 hover:text-white py-1.5 mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-[#CCFF00]" />
            <span>Back to More</span>
          </button>
        )}

        {/* 1. HOME */}
        {activeTab === 'HOME' && (
          <HomeDashboard
            vehicle={activeVehicle}
            drivers={drivers}
            finance={financialProfile}
            ownership={ownershipProfile}
            economics={currentEconomics}
            onOpenKeepSell={() => setIsKeepSellModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {/* 2. MY CAR */}
        {activeTab === 'MY_CAR' && (
          <MyCarView
            vehicle={activeVehicle}
            allVehicles={vehicles}
            economics={currentEconomics}
            ownership={ownershipProfile}
            onSelectVehicle={setActiveVehicleId}
            onOpenAddCar={() => setIsAddCarModalOpen(true)}
            onUpdateVehicle={handleUpdateVehicle}
            onOpenKeepSell={() => setIsKeepSellModalOpen(true)}
          />
        )}

        {/* 3. BUY */}
        {activeTab === 'BUY' && (
          <BuyCarWizard
            vehicles={vehicles}
            onSelectCarToOwn={(newCar) => {
              setActiveVehicleId(newCar.id);
              setActiveTab('MY_CAR');
            }}
            initialFinance={financialProfile}
            initialOwnership={ownershipProfile}
            initialDrivers={drivers}
            onNavigateCompare={(carAId, carBId) => {
              setActiveTab('COMPARE');
            }}
          />
        )}

        {/* 4. COMPARE */}
        {activeTab === 'COMPARE' && (
          <CarComparisonView
            vehicles={vehicles}
            drivers={drivers}
            finance={financialProfile}
            ownership={ownershipProfile}
            defaultCarIdA={activeVehicleId}
            defaultCarIdB="mercedes-c-class"
            onSelectCarToOwn={(winner) => {
              setActiveVehicleId(winner.id);
              setActiveTab('MY_CAR');
            }}
          />
        )}

        {/* 5. MORE */}
        {activeTab === 'MORE' && (
          <MoreMenuView
            vehicle={activeVehicle}
            economics={currentEconomics}
            onNavigateSubTab={setActiveTab}
            onOpenKeepSell={() => setIsKeepSellModalOpen(true)}
            onOpenAddCar={() => setIsAddCarModalOpen(true)}
            onResetDemo={handleResetDemo}
          />
        )}

        {/* SUB-TABS (ACCESSIBLE VIA MORE OR DEEP LINKS) */}
        {activeTab === 'SERVICES' && (
          <ServicesMarketplace
            services={INITIAL_SERVICES}
            activeVehicle={activeVehicle}
            economics={currentEconomics}
          />
        )}

        {activeTab === 'CONSULTANCY' && (
          <ConsultancySection />
        )}

        {activeTab === 'DRIVERS' && (
          <DriverProfilesCard
            drivers={drivers}
            onUpdateDrivers={setDrivers}
            economics={currentEconomics}
          />
        )}

        {activeTab === 'COSTS' && (
          <CostsView
            vehicle={activeVehicle}
            drivers={drivers}
            finance={financialProfile}
            ownership={ownershipProfile}
            economics={currentEconomics}
          />
        )}

        {activeTab === 'INSIGHTS' && (
          <InsightsView
            vehicle={activeVehicle}
            economics={currentEconomics}
            onOpenKeepSell={() => setIsKeepSellModalOpen(true)}
            onNavigateTab={setActiveTab}
          />
        )}

        {activeTab === 'PROFILE' && (
          <ProfileView
            finance={financialProfile}
            ownership={ownershipProfile}
            activeVehicle={activeVehicle}
            onUpdateFinance={setFinancialProfile}
            onUpdateOwnership={setOwnershipProfile}
            onResetDemo={handleResetDemo}
          />
        )}

        {/* 6. LANDING PAGE OVERVIEW */}
        {activeTab === 'LANDING' && (
          <LandingPage
            vehicles={vehicles}
            drivers={drivers}
            financialProfile={financialProfile}
            ownershipProfile={ownershipProfile}
            onOpenDashboard={() => setActiveTab('HOME')}
            onOpenKeepSell={() => setIsKeepSellModalOpen(true)}
            onOpenComparison={() => setActiveTab('COMPARE')}
            onOpenConsultancy={() => setActiveTab('CONSULTANCY')}
          />
        )}
      </main>

      {/* KEEP OR SELL DECISION BOTTOM SHEET / MODAL */}
      <KeepOrSellModal
        isOpen={isKeepSellModalOpen}
        onClose={() => setIsKeepSellModalOpen(false)}
        vehicle={activeVehicle}
        economics={currentEconomics}
        onNavigateBuy={() => {
          setIsKeepSellModalOpen(false);
          setActiveTab('BUY');
        }}
      />

      {/* ADD CAR ONBOARDING MODAL */}
      <AddCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onAddCar={handleAddNewCar}
      />

      {/* FIXED 5-ITEM MOBILE BOTTOM NAVIGATION */}
      <BottomNav
        currentTab={isSubTab ? 'MORE' : activeTab}
        onSelectTab={setActiveTab}
      />
    </div>
  );
}
