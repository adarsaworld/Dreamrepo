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
    {
      id: 'user-profile',
      label: 'User Profile & Team',
      sublabel: 'Dossier, Payroll & Roster',
      icon: 'account_circle',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden transition-opacity"
          onClick={onCloseMobile}
          aria-hidden="true"
        />
      )}

      {/* Sidebar Rail with vibrant luxury styling */}
      <aside
        className={`fixed left-0 top-0 h-screen w-72 bg-white/95 backdrop-blur-2xl z-50 flex flex-col justify-between border-r border-[#e8decb] shadow-xl transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col flex-1 min-h-0">
          {/* Logo & Brand Header with animated subtle gold gleam */}
          <div className="h-16 px-6 flex items-center justify-between bg-[#f5f0e6]/70 border-b border-[#e8decb]">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#f59e0b] via-[#ea580c] to-[#b45309] p-0.5 shadow-md flex items-center justify-center animate-pulse-subtle">
                <div className="w-full h-full bg-[#faf8f5] rounded-[10px] flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#b45309] text-xl">ramen_dining</span>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-title text-base text-[#1c1917] font-bold tracking-wider uppercase leading-tight">
                  Kizen Empire
                </span>
                <span className="font-body text-[10px] text-[#b45309] tracking-widest uppercase font-bold">
                  Executive Suite
                </span>
              </div>
            </div>

            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#f4eee2] transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* Section Kicker */}
          <div className="px-4 py-2.5">
            <span className="px-2 font-body text-[10px] uppercase tracking-wider text-[#78716c] font-bold">
              Operations Fleet
            </span>
          </div>

          {/* Navigation Links with animated hover transitions */}
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
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-all duration-200 group text-left cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] font-bold shadow-[0_2px_12px_rgba(245,158,11,0.25)] border border-[#fde68a] translate-x-1'
                      : 'text-[#57534e] hover:bg-[#f5efe4] hover:text-[#1c1917] hover:translate-x-0.5'
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-xl transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-[#b45309]' : 'text-[#78716c] group-hover:text-[#b45309]'
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
                        <span className="h-2 w-2 rounded-full bg-[#dc2626] animate-pulse" />
                      )}
                    </div>
                    <span
                      className={`text-[11px] truncate mt-0.5 ${
                        isActive ? 'text-[#b45309]/80' : 'text-[#78716c]'
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

        {/* Live Syndicate Network Telemetry Widget with animated pulse */}
        <div className="p-4 m-3 rounded-2xl bg-gradient-to-br from-[#faf8f5] to-[#f5f0e6] border border-[#e8decb] shadow-sm">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#047857] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#047857]" />
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#78716c] font-bold">
                Syndicate Network
              </span>
            </div>
            <span className="text-[10px] text-[#047857] font-bold uppercase tracking-wider bg-[#ecfdf5] border border-[#a7f3d0] px-1.5 py-0.5 rounded-full">
              Live
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[#57534e]">Tables Occupied</span>
              <span className="text-[#1c1917] font-bold tabular-nums font-mono">
                {tablesOccupiedPercent}%
              </span>
            </div>
            <div className="w-full bg-[#e8ded0] rounded-full h-2 overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#f59e0b] to-[#ea580c] h-full rounded-full transition-all duration-1000 shadow-sm"
                style={{ width: `${tablesOccupiedPercent}%` }}
              />
            </div>
            <div className="flex items-center justify-between pt-0.5 text-xs">
              <span className="text-[#78716c]">Dispatch Velocity</span>
              <span className="text-[#b45309] font-bold tabular-nums font-mono">
                {dispatchVelocity} ord/min
              </span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
