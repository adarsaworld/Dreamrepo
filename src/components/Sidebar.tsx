import React from 'react';
import { NavigationTab } from '../types';

interface SidebarProps {
  currentTab: NavigationTab;
  onTabChange: (tab: NavigationTab) => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
  tablesOccupiedPercent?: number;
  dispatchVelocity?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onTabChange,
  mobileOpen,
  onCloseMobile,
  tablesOccupiedPercent = 84,
  dispatchVelocity = 142,
}) => {
  const navItems: Array<{
    id: NavigationTab;
    label: string;
    sublabel: string;
    icon: string;
    badge?: boolean;
  }> = [
    {
      id: 'branch-overview',
      label: 'Branch Overview',
      sublabel: 'Sales & Foot Traffic',
      icon: 'apartment',
    },
    {
      id: 'preferred-flavors',
      label: 'Preferred Flavors',
      sublabel: 'Taste Trends & Rankings',
      icon: 'restaurant',
    },
    {
      id: 'menu-studio',
      label: 'Menu Studio',
      sublabel: 'Multi-Branch Curation',
      icon: 'menu_book',
    },
    {
      id: 'staff-payroll',
      label: 'Staff & Payroll',
      sublabel: 'Roster & Settlements',
      icon: 'badge',
    },
    {
      id: 'inventory-supply',
      label: 'Inventory & Supply',
      sublabel: 'Cellar & Larder Alerts',
      icon: 'inventory_2',
      badge: true,
    },
    {
      id: 'settings-integrations',
      label: 'Settings & Integrations',
      sublabel: 'POS & Delivery APIs',
      icon: 'hub',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Rail */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-[#1b1c1d]/95 backdrop-blur-2xl z-50 flex flex-col justify-between border-r border-[#292a2b] shadow-2xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between bg-[#0d0e0f]/60 border-b border-[#292a2b]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-[#f59e0b] to-[#b45309] p-0.5 shadow-md flex items-center justify-center">
                <div className="w-full h-full bg-[#121314] rounded-md flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#ffc174] text-xl">ramen_dining</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-title text-base text-[#e3e2e3] font-bold tracking-wider uppercase leading-tight">
                  Kizen Empire
                </span>
                <span className="font-body text-[10px] text-[#ffc174] tracking-widest uppercase font-semibold">
                  Executive Suite
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3] hover:bg-[#292a2b] transition-colors"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Section Kicker */}
          <div className="px-4 py-2.5">
            <span className="px-2 font-body text-[10px] uppercase tracking-wider text-[#a08e7a] font-bold">
              Operations Fleet
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all group text-left ${
                    isActive
                      ? 'bg-[#ffc174] text-[#472a00] font-semibold shadow-[0_0_20px_rgba(245,158,11,0.25)]'
                      : 'text-[#d8c3ad] hover:bg-[#292a2b] hover:text-[#e3e2e3]'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl transition-colors ${
                      isActive ? 'text-[#472a00]' : 'text-[#a08e7a] group-hover:text-[#ffc174]'
                    }`}
                  >
                    {item.icon}
                  </span>
                  <div className="flex flex-col flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold truncate leading-tight">
                        {item.label}
                      </span>
                      {item.badge && !isActive && (
                        <span className="h-2 w-2 rounded-full bg-[#cc003c] animate-pulse" />
                      )}
                    </div>
                    <span
                      className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-[#472a00]/80' : 'text-[#a08e7a]'
                      }`}
                    >
                      {item.sublabel}
                    </span>
                  </div>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Live Syndicate Network Telemetry Widget */}
        <div className="p-4 m-3 rounded-xl bg-[#0d0e0f]/90 border border-[#292a2b] backdrop-blur-md shadow-lg">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-[#56e5a9] shadow-[0_0_8px_#56e5a9] animate-pulse" />
              <span className="text-[10px] uppercase tracking-wider text-[#a08e7a] font-bold">
                Syndicate Network
              </span>
            </div>
            <span className="text-[10px] text-[#56e5a9] font-semibold uppercase tracking-wider bg-[#56e5a9]/10 px-1.5 py-0.5 rounded">
              Live
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#d8c3ad]">Tables Occupied</span>
              <span className="text-[#e3e2e3] font-bold tabular-nums">
                {tablesOccupiedPercent}%
              </span>
            </div>
            <div className="w-full bg-[#343536] rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-[#f59e0b] h-full rounded-full transition-all duration-700 shadow-[0_0_8px_rgba(245,158,11,0.5)]"
                style={{ width: `${tablesOccupiedPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <span className="text-[#a08e7a]">Dispatch Velocity</span>
              <span className="text-[#ffc174] font-semibold tabular-nums">
                {dispatchVelocity} ord/min
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
