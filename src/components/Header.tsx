import React from 'react';
import { LocationId } from '../types';

interface HeaderProps {
  currentLocation: LocationId;
  onLocationChange: (loc: LocationId) => void;
  onOpenQuickOrder: () => void;
  onToggleNotifications: () => void;
  onOpenMobileMenu: () => void;
  notificationCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onLocationChange,
  onOpenQuickOrder,
  onToggleNotifications,
  onOpenMobileMenu,
  notificationCount = 3,
}) => {
  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-[#0d0e0f]/85 backdrop-blur-xl z-30 flex items-center justify-between px-4 sm:px-6 border-b border-[#292a2b] shadow-sm">
      {/* Left zone: Mobile toggle & Location Selector & Sync Status */}
      <div className="flex items-center gap-3 sm:gap-6">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-lg text-[#d8c3ad] hover:text-[#e3e2e3] hover:bg-[#292a2b] transition-colors"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Location Dropdown */}
        <div className="relative flex items-center">
          <span className="material-symbols-outlined absolute left-3 text-[#a08e7a] pointer-events-none text-lg">
            storefront
          </span>
          <select
            value={currentLocation}
            onChange={(e) => onLocationChange(e.target.value as LocationId)}
            className="bg-[#292a2b] text-[#e3e2e3] font-semibold text-xs sm:text-sm pl-9 pr-8 py-2 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#ffc174] hover:bg-[#343536] transition-colors border border-[#343536]"
          >
            <option value="all">All Locations (6 Active)</option>
            <option value="mumbai">Mumbai BKC Flagship</option>
            <option value="delhi">New Delhi Lutyens</option>
            <option value="bengaluru">Bengaluru Indiranagar</option>
            <option value="hyderabad">Hyderabad Jubilee Hills</option>
            <option value="kolkata">Kolkata Park Street</option>
            <option value="chennai">Chennai Nungambakkam</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 text-[#a08e7a] pointer-events-none text-base">
            expand_more
          </span>
        </div>

        {/* Real-time Cloud Sync Pill (Desktop) */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#292a2b]/80 border border-[#343536]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#56e5a9] opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#56e5a9] shadow-[0_0_6px_#56e5a9]" />
          </span>
          <span className="text-[11px] font-semibold text-[#56e5a9] tracking-wider uppercase">
            Real-time Cloud Sync Active
          </span>
        </div>
      </div>

      {/* Right zone: Actions, Notifications, Profile */}
      <div className="flex items-center gap-2.5 sm:gap-4">
        {/* Quick Order / Reserve CTA */}
        <button
          onClick={onOpenQuickOrder}
          type="button"
          className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] font-bold text-xs sm:text-sm shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
        >
          <span className="material-symbols-outlined text-base sm:text-lg">add_circle</span>
          <span>+ Quick Order / Reserve</span>
        </button>

        {/* Notification Bell */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={onToggleNotifications}
            aria-label="Notifications"
            className="p-2 rounded-lg text-[#d8c3ad] hover:text-[#e3e2e3] hover:bg-[#292a2b] transition-colors relative"
            type="button"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {notificationCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#cc003c] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#cc003c] ring-2 ring-[#0d0e0f] shadow-[0_0_6px_#cc003c]" />
              </span>
            )}
          </button>
        </div>

        {/* Divider */}
        <div className="h-7 w-px bg-[#343536] hidden sm:block" />

        {/* Profile Card */}
        <div className="flex items-center gap-3 pl-1">
          <div className="flex flex-col text-right hidden md:flex">
            <span className="text-xs sm:text-sm text-[#e3e2e3] font-bold leading-tight">
              Kenjiro Vance
            </span>
            <span className="text-[10px] text-[#ffc174] tracking-wider uppercase font-semibold">
              Managing Partner / Syndicate Admin
            </span>
          </div>
          <div className="relative">
            <img
              alt="Kenjiro Vance avatar"
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#ffc174]/40"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcfiJf9IlXt2orZyBIY-Sop-V4nL67t_fmxtYijpcrVE3aT5XIwb1CKK99FwYHYfVNKCuwB_Q1QLu0s7LCjBg3wSHrQP8BxFEA-2F2PnRzM6dzEcAwWyjcdNesihmiFx7ZstzVlvvUgQiNXJ4lfNyY2BclIFTyS160SgyGLIm0SrFHy__pRVoLagOoruUbiYJauhPtM7kUP_OTEfqCuySQCYZEurWwUlDGpqAJnNFaARNwAYhnMYbXtg"
              referrerPolicy="no-referrer"
              onError={(e) => {
                // Fallback to stylized monogram if blocked
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#56e5a9] ring-2 ring-[#0d0e0f]" />
          </div>
        </div>
      </div>
    </header>
  );
};
