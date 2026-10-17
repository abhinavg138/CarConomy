import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { INITIAL_VEHICLES, INITIAL_DRIVERS, INITIAL_FINANCIAL_PROFILE, INITIAL_OWNERSHIP_PROFILE } from './data/mockData';
import { Vehicle, Driver, FinancialProfile, OwnershipProfile } from './types';
import { calculateTrueCost } from './utils/calculator';
import { runEngineTests } from './utils/calculator.test';
import { SplashLoader } from './components/SplashLoader';
import { ThemeProvider } from './ui/theme';
import { Shell, Tab } from './ui/Shell';
import { Overview } from './ui/Overview';
import { MyCar } from './ui/MyCar';
import { Decide } from './ui/Decide';
import { Services } from './ui/Services';
import { Profile } from './ui/Profile';
import { CustomCarModal } from './ui/CustomCarModal';

const KEY = 'carconomy_v5';
function load<T>(k: string, fallback: T): T {
  try {
    const s = localStorage.getItem(`${KEY}_${k}`);
    return s ? (JSON.parse(s) as T) : fallback;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [tab, setTab] = useState<Tab>('overview');
  const [booting, setBooting] = useState(() => {
    try {
      return !sessionStorage.getItem('cc_booted');
    } catch {
      return false;
    }
  });
  const handleBooted = useCallback(() => {
    try {
      sessionStorage.setItem('cc_booted', '1');
    } catch {}
    setBooting(false);
  }, []);

  // Custom vehicles created/edited by user, persisted in localStorage
  const [customVehicles, setCustomVehicles] = useState<Vehicle[]>(() => load('custom_vehicles', []));
  const vehicles: Vehicle[] = useMemo(() => [...customVehicles, ...INITIAL_VEHICLES], [customVehicles]);

  const [activeId, setActiveId] = useState<string>(() => {
    const id = load<string>('active', 'tata-nexon');
    // If old cached id was bmw-3-series, switch to mainstream default
    if (id === 'bmw-3-series') return 'tata-nexon';
    return vehicles.some(v => v.id === id) ? id : INITIAL_VEHICLES[0].id;
  });

  const [drivers, setDrivers] = useState<Driver[]>(() => load('drivers', INITIAL_DRIVERS));
  const [finance, setFinance] = useState<FinancialProfile>(() => load('finance', INITIAL_FINANCIAL_PROFILE));
  const [ownership, setOwnership] = useState<OwnershipProfile>(() => load('ownership', INITIAL_OWNERSHIP_PROFILE));

  const [isAddCarModalOpen, setIsAddCarModalOpen] = useState(false);

  useEffect(() => {
    if (import.meta.env.DEV) {
      const r = runEngineTests();
      if (!r.success) console.warn('Engine tests:', r.results);
    }
  }, []);

  useEffect(() => {
    try {
      [
        ['active', activeId],
        ['custom_vehicles', customVehicles],
        ['drivers', drivers],
        ['finance', finance],
        ['ownership', ownership],
      ].forEach(([k, v]) => localStorage.setItem(`${KEY}_${k}`, JSON.stringify(v)));
    } catch {}
  }, [activeId, customVehicles, drivers, finance, ownership]);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [tab]);

  const vehicle = vehicles.find(v => v.id === activeId) || vehicles[0];
  const eco = useMemo(
    () => calculateTrueCost(vehicle, drivers, ownership, finance, 'CURRENT_CAR'),
    [vehicle, drivers, ownership, finance]
  );

  const handleAddVehicle = (newV: Vehicle) => {
    setCustomVehicles(prev => [newV, ...prev.filter(v => v.id !== newV.id)]);
    setActiveId(newV.id);
  };

  const handleUpdateVehicle = (updatedV: Vehicle) => {
    setCustomVehicles(prev => {
      const exists = prev.some(v => v.id === updatedV.id);
      if (exists) {
        return prev.map(v => (v.id === updatedV.id ? updatedV : v));
      } else {
        return [updatedV, ...prev];
      }
    });
    setActiveId(updatedV.id);
  };

  const handleDeleteVehicle = (id: string) => {
    setCustomVehicles(prev => prev.filter(v => v.id !== id));
    if (activeId === id) {
      setActiveId(INITIAL_VEHICLES[0].id);
    }
  };

  const reset = () => {
    setActiveId('tata-nexon');
    setCustomVehicles([]);
    setDrivers(INITIAL_DRIVERS);
    setFinance(INITIAL_FINANCIAL_PROFILE);
    setOwnership(INITIAL_OWNERSHIP_PROFILE);
    setTab('overview');
  };

  return (
    <ThemeProvider>
      {booting && <SplashLoader onDone={handleBooted} />}
      <Shell
        tab={tab}
        onTab={setTab}
        vehicles={vehicles}
        activeId={vehicle.id}
        onPick={setActiveId}
        onOpenAddCar={() => setIsAddCarModalOpen(true)}
      >
        {tab === 'overview' && (
          <Overview
            vehicle={vehicle}
            vehicles={vehicles}
            finance={finance}
            drivers={drivers}
            ownership={ownership}
            eco={eco}
            onGo={setTab}
            onPickVehicle={setActiveId}
          />
        )}
        {tab === 'mycar' && (
          <MyCar
            vehicle={vehicle}
            vehicles={vehicles}
            eco={eco}
            drivers={drivers}
            ownership={ownership}
            finance={finance}
            onDrivers={setDrivers}
            onOwnership={setOwnership}
            onFinance={setFinance}
            onPickVehicle={setActiveId}
            onAddVehicle={handleAddVehicle}
            onUpdateVehicle={handleUpdateVehicle}
            onDeleteVehicle={handleDeleteVehicle}
            onGo={setTab}
          />
        )}
        {tab === 'decide' && (
          <Decide
            vehicle={vehicle}
            vehicles={vehicles}
            eco={eco}
            drivers={drivers}
            ownership={ownership}
            finance={finance}
            onGo={setTab}
          />
        )}
        {tab === 'services' && <Services vehicle={vehicle} />}
        {tab === 'profile' && (
          <Profile
            vehicle={vehicle}
            eco={eco}
            drivers={drivers}
            vehicles={vehicles}
            finance={finance}
            ownership={ownership}
            onDrivers={setDrivers}
            onFinance={setFinance}
            onOwnership={setOwnership}
            onReset={reset}
          />
        )}
      </Shell>

      <CustomCarModal
        isOpen={isAddCarModalOpen}
        onClose={() => setIsAddCarModalOpen(false)}
        onSaveVehicle={handleAddVehicle}
      />
    </ThemeProvider>
  );
}
