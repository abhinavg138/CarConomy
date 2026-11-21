import React, { useState } from 'react';
import { Car, Library, Scale, MoreHorizontal, Sun, Moon, Plus, ArrowLeft, Wrench, Users, ShieldAlert, Sparkles, X, Settings } from 'lucide-react';
import { Vehicle } from '../types';
import { useTheme } from './theme';
import { cx } from './kit';

export type Tab = 'overview' | 'mycar' | 'decide' | 'services' | 'profile' | 'browse';

interface PrimaryNav {
  id: Tab;
  label: string;
  icon: React.ElementType;
  mode?: 'keep' | 'buy';
}

const PRIMARY_NAV: PrimaryNav[] = [
  { id: 'overview', label: 'My Car', icon: Car },
  { id: 'browse', label: 'Buying a Car', icon: Library },
  { id: 'decide', label: 'Compare Cars', icon: Scale, mode: 'buy' },
];

export const Shell: React.FC<{
  tab: Tab;
  onTab: (t: Tab, mode?: 'keep' | 'buy') => void;
  vehicles: Vehicle[];
  activeId: string;
  onPick: (id: string) => void;
  onOpenAddCar?: () => void;
  onRunDemo?: () => void;
  isDemoMode?: boolean;
  children: React.ReactNode;
}> = ({ tab, onTab, vehicles, activeId, onPick, onOpenAddCar, onRunDemo, isDemoMode, children }) => {
  const { theme, toggle } = useTheme();
  const [isMoreOpen, setIsMoreOpen] = useState(false);

  const custom = vehicles.filter(v => v.isCustom);
  const mainstream = vehicles.filter(v => !v.isCustom && v.purchasePrice <= 3000000);
  const luxury = vehicles.filter(v => !v.isCustom && v.purchasePrice > 3000000);

  const activeCar = vehicles.find(v => v.id === activeId) || vehicles[0];

  const picker = (
    <label className="block">
      <span className="sr-only">Active vehicle</span>
      <select
        value={activeId}
        onChange={e => {
          if (e.target.value === '__add_custom__') {
            onOpenAddCar?.();
          } else {
            onPick(e.target.value);
          }
        }}
        className="w-full bg-transparent border border-line rounded-full px-4 min-h-11 text-sm cursor-pointer focus:border-ink"
      >
        {custom.length > 0 && (
          <optgroup label="Your Custom Cars">
            {custom.map(v => (
              <option key={v.id} value={v.id} className="bg-surface text-ink">
                ⭐ {v.make} {v.model} ({v.year})
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label="Mainstream Indian Cars (₹5–25L)">
          {mainstream.map(v => (
            <option key={v.id} value={v.id} className="bg-surface text-ink">
              {v.make} {v.model} · {v.variant}
            </option>
          ))}
        </optgroup>
        {luxury.length > 0 && (
          <optgroup label="Retained Luxury / Executive">
            {luxury.map(v => (
              <option key={v.id} value={v.id} className="bg-surface text-ink">
                {v.make} {v.model} · {v.variant}
              </option>
            ))}
          </optgroup>
        )}
        <optgroup label="Actions">
          <option value="__add_custom__" className="bg-surface text-accent font-medium">
            + Add Custom Car...
          </option>
        </optgroup>
      </select>
    </label>
  );

  const ThemeBtn = (
    <button
      onClick={toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
      className="w-11 h-11 rounded-full border border-line flex items-center justify-center hover:border-ink cursor-pointer shrink-0"
    >
      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
    </button>
  );

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[17rem_1fr]">
      {/* Desktop sidebar rail */}
      <aside className="hidden lg:flex flex-col sticky top-0 h-screen border-r border-line px-6 py-8 justify-between">
        <div>
          {/* Brand header */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => onTab('overview')}
              className="text-left font-display text-3xl tracking-tight cursor-pointer"
            >
              Car<span className="text-accent">conomy</span>
            </button>
          </div>
          <p className="text-xs text-mute mt-1">Know what your car really costs</p>

          {/* Demo Mode Badge for Judges */}
          {onRunDemo && (
            <div className="mt-6">
              <button
                onClick={onRunDemo}
                className={cx(
                  'w-full py-2 px-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors',
                  isDemoMode
                    ? 'bg-accent/15 border-accent text-accent'
                    : 'bg-sunk border-line text-mute hover:text-ink hover:border-ink'
                )}
              >
                <Sparkles className="w-3.5 h-3.5 text-accent" />
                {isDemoMode ? 'Demo Mode Active' : '⚡ Load Judge Demo Mode'}
              </button>
            </div>
          )}

          {/* Simplified 3-Item Primary Nav */}
          <nav className="mt-8 space-y-1.5" aria-label="Primary">
            <p className="text-[11px] uppercase tracking-[0.16em] text-mute mb-2">Navigation</p>
            {PRIMARY_NAV.map(n => {
              const active = tab === n.id;
              return (
                <button
                  key={n.id}
                  onClick={() => onTab(n.id, n.mode)}
                  aria-current={active ? 'page' : undefined}
                  className={cx(
                    'w-full flex items-center gap-3 px-3.5 min-h-11 rounded-2xl text-sm font-medium cursor-pointer transition-colors',
                    active ? 'bg-ink text-paper font-semibold' : 'text-mute hover:text-ink hover:bg-sunk'
                  )}
                >
                  <n.icon className="w-4 h-4" />
                  {n.label}
                </button>
              );
            })}

            {/* More Menu Trigger */}
            <button
              onClick={() => setIsMoreOpen(true)}
              aria-expanded={isMoreOpen}
              className={cx(
                'w-full flex items-center gap-3 px-3.5 min-h-11 rounded-2xl text-sm font-medium cursor-pointer transition-colors',
                ['services', 'profile', 'mycar'].includes(tab)
                  ? 'bg-sunk text-accent font-semibold'
                  : 'text-mute hover:text-ink hover:bg-sunk'
              )}
            >
              <MoreHorizontal className="w-4 h-4" />
              More Options...
            </button>
          </nav>
        </div>

        {/* Bottom controls */}
        <div className="space-y-3 pt-6 border-t border-line">
          <div className="text-xs text-mute mb-1">Active Car:</div>
          {picker}
          {onOpenAddCar && (
            <button
              onClick={onOpenAddCar}
              className="w-full flex items-center justify-center gap-2 min-h-10 rounded-full border border-line hover:border-ink text-xs font-medium text-mute hover:text-ink cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Custom Car
            </button>
          )}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => onTab('profile')}
              className="text-xs text-mute hover:text-ink inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Settings className="w-3.5 h-3.5" /> Financial Profile
            </button>
            {ThemeBtn}
          </div>
        </div>
      </aside>

      <div className="min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-30 bg-paper/95 backdrop-blur border-b border-line px-4 py-2.5 flex items-center justify-between gap-3">
          <button
            onClick={() => onTab('overview')}
            className="font-display text-2xl tracking-tight shrink-0 cursor-pointer text-ink"
          >
            Car<span className="text-accent">conomy</span>
          </button>

          <div className="flex items-center gap-2">
            {onRunDemo && (
              <button
                onClick={onRunDemo}
                className={cx(
                  'px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1 cursor-pointer',
                  isDemoMode ? 'bg-accent/15 border-accent text-accent' : 'bg-sunk border-line text-mute'
                )}
              >
                <Sparkles className="w-3 h-3 text-accent" /> Demo
              </button>
            )}
            {ThemeBtn}
          </div>
        </header>

        {/* Breadcrumb / Back button on inner screens */}
        {tab !== 'overview' && (
          <div className="px-5 sm:px-8 lg:px-12 pt-6">
            <button
              onClick={() => onTab('overview')}
              className="inline-flex items-center gap-2 text-xs font-medium text-mute hover:text-ink cursor-pointer transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to My Car Calculator
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <main className="px-5 sm:px-8 lg:px-12 py-6 sm:py-8 pb-28 lg:pb-16 max-w-5xl flex-1">{children}</main>

        {/* Mobile bottom nav: 3 Primary Items + More */}
        <nav
          aria-label="Primary"
          className="lg:hidden fixed bottom-0 inset-x-0 z-30 bg-paper/95 backdrop-blur border-t border-line grid grid-cols-4 pb-[env(safe-area-inset-bottom)]"
        >
          {PRIMARY_NAV.map(n => {
            const active = tab === n.id;
            return (
              <button
                key={n.id}
                onClick={() => onTab(n.id, n.mode)}
                aria-current={active ? 'page' : undefined}
                className={cx(
                  'flex flex-col items-center justify-center gap-1 py-2 text-[11px] min-h-14 cursor-pointer transition-colors',
                  active ? 'text-accent font-semibold' : 'text-mute'
                )}
              >
                <n.icon className="w-5 h-5" />
                {n.label}
              </button>
            );
          })}

          <button
            onClick={() => setIsMoreOpen(true)}
            className={cx(
              'flex flex-col items-center justify-center gap-1 py-2 text-[11px] min-h-14 cursor-pointer transition-colors',
              ['services', 'profile', 'mycar'].includes(tab) ? 'text-accent font-semibold' : 'text-mute'
            )}
          >
            <MoreHorizontal className="w-5 h-5" />
            More
          </button>
        </nav>
      </div>

      {/* "MORE" SLIDE-OVER SHEET / MODAL */}
      {isMoreOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-paper border border-line rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-6 shadow-2xl relative animate-in fade-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-line">
              <div>
                <h3 className="font-display text-xl sm:text-2xl text-ink">More Features</h3>
                <p className="text-xs text-mute">Advanced tools & household modeling</p>
              </div>
              <button
                onClick={() => setIsMoreOpen(false)}
                className="w-9 h-9 rounded-full border border-line flex items-center justify-center text-mute hover:text-ink cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onTab('decide', 'keep');
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-sunk hover:bg-line/50 border border-line flex items-center gap-3.5 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0">
                  <ShieldAlert className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-ink">Keep or Sell Decision</p>
                  <p className="text-xs text-mute">12-month forward break-even analysis</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onTab('mycar');
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-sunk hover:bg-line/50 border border-line flex items-center gap-3.5 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-ink">Multi-Driver Household Wear</p>
                  <p className="text-xs text-mute">Split usage by driver styles & city congestion</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onTab('services');
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-sunk hover:bg-line/50 border border-line flex items-center gap-3.5 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-ink">Maintenance Packages & Booking</p>
                  <p className="text-xs text-mute">OEM scheduled service & repair estimates</p>
                </div>
              </button>

              <button
                onClick={() => {
                  setIsMoreOpen(false);
                  onTab('profile');
                }}
                className="w-full text-left p-3.5 rounded-2xl bg-sunk hover:bg-line/50 border border-line flex items-center gap-3.5 cursor-pointer transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-paper flex items-center justify-center text-accent shrink-0">
                  <Settings className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-medium text-sm text-ink">Household Income & Affordability</p>
                  <p className="text-xs text-mute">Edit salary, EMIs, and credit profile</p>
                </div>
              </button>
            </div>

            {onRunDemo && (
              <div className="pt-2 border-t border-line">
                <button
                  onClick={() => {
                    setIsMoreOpen(false);
                    onRunDemo();
                  }}
                  className="w-full py-2.5 rounded-full bg-accent/15 border border-accent text-accent font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Load Complete Demo Scenario for Judges
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
