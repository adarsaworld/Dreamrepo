import React, { useState, useEffect } from 'react';
import { LocationId } from '../types';

interface HeaderProps {
  currentLocation: LocationId;
  onLocationChange: (loc: LocationId) => void;
  onOpenQuickOrder: () => void;
  onToggleNotifications: () => void;
  onOpenMobileMenu: () => void;
  notificationCount?: number;
  onOpenProfile: () => void;
  userName?: string;
  userRole?: string;
  avatarUrl?: string;
  onShowToast?: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onLocationChange,
  onOpenQuickOrder,
  onToggleNotifications,
  onOpenMobileMenu,
  notificationCount = 4,
  onOpenProfile,
  userName = 'Adarsa Parida',
  userRole = 'Managing Partner / Executive Director',
  avatarUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuBcfiJf9IlXt2orZyBIY-Sop-V4nL67t_fmxtYijpcrVE3aT5XIwb1CKK99FwYHYfVNKCuwB_Q1QLu0s7LCjBg3wSHrQP8BxFEA-2F2PnRzM6dzEcAwWyjcdNesihmiFx7ZstzVlvvUgQiNXJ4lfNyY2BclIFTyS160SgyGLIm0SrFHy__pRVoLagOoruUbiYJauhPtM7kUP_OTEfqCuySQCYZEurWwUlDGpqAJnNFaARNwAYhnMYbXtg',
  onShowToast,
}) => {
  // Real-Time Cloud Sync State & Dynamic Timer
  const [secondsAgo, setSecondsAgo] = useState(2);
  const [isSyncing, setIsSyncing] = useState(false);
  const [latencyMs, setLatencyMs] = useState(18);

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsAgo((prev) => {
        if (prev >= 18) {
          // Trigger subtle automatic background sync
          setLatencyMs(Math.floor(14 + Math.random() * 8));
          return 1;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleManualSync = () => {
    setIsSyncing(true);
    setLatencyMs(Math.floor(12 + Math.random() * 6));
    setTimeout(() => {
      setIsSyncing(false);
      setSecondsAgo(0);
      if (onShowToast) {
        onShowToast(
          'National Cloud Synchronized',
          'Consolidated database sync active across BOM-HQ, DEL-01, BLR-01, HYD-01, CCU-01 & MAA-01.',
          'success'
        );
      }
    }, 900);
  };

  return (
    <header className="fixed top-0 left-0 lg:left-72 right-0 h-16 bg-white/95 backdrop-blur-2xl z-30 flex items-center justify-between px-3 sm:px-6 border-b border-[#e8decb] shadow-[0_4px_20px_-4px_rgba(217,119,6,0.06)] transition-all duration-300">
      {/* Left zone: Mobile toggle & Location Selector */}
      <div className="flex items-center gap-2 sm:gap-4 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="lg:hidden p-2 rounded-xl text-[#57534e] hover:text-[#1c1917] hover:bg-[#f4eee2] transition-colors cursor-pointer shrink-0"
          aria-label="Open navigation menu"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>

        {/* Location Dropdown with warm luxury styling */}
        <div className="relative flex items-center group max-w-[200px] sm:max-w-none">
          <span className="material-symbols-outlined absolute left-3 text-[#b45309] pointer-events-none text-lg transition-transform group-hover:scale-110">
            location_on
          </span>
          <select
            value={currentLocation}
            onChange={(e) => onLocationChange(e.target.value as LocationId)}
            className="bg-[#faf8f5] text-[#1c1917] font-bold text-xs sm:text-sm pl-9 pr-8 py-2 rounded-xl appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50 hover:bg-[#f5f0e6] transition-all border border-[#e8decb] shadow-xs truncate"
          >
            <option value="all">All Metro Outposts (6 Active)</option>
            <option value="mumbai">Mumbai BKC Flagship (BOM-HQ)</option>
            <option value="delhi">New Delhi Lutyens (DEL-01)</option>
            <option value="bengaluru">Bengaluru Indiranagar (BLR-01)</option>
            <option value="hyderabad">Hyderabad Jubilee Hills (HYD-01)</option>
            <option value="kolkata">Kolkata Park Street (CCU-01)</option>
            <option value="chennai">Chennai Nungambakkam (MAA-01)</option>
          </select>
          <span className="material-symbols-outlined absolute right-2 text-[#78716c] pointer-events-none text-base">
            expand_more
          </span>
        </div>

        {/* Real-Time Cloud Sync Widget (Prominent, Animated & Interactive) */}
        <div className="hidden xl:flex items-center">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            type="button"
            title="Click to force real-time sync across Indian metro outposts"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#ecfdf5] via-[#f0fdf4] to-[#f0fdfa] border border-[#a7f3d0] hover:border-[#047857]/50 shadow-xs hover:shadow-md transition-all cursor-pointer group"
          >
            {/* Pulsing Beacon with Spinning Cloud Icon */}
            <div className="relative flex items-center justify-center">
              <span className={`material-symbols-outlined text-base text-[#047857] transition-transform ${isSyncing ? 'animate-spin text-[#059669]' : 'group-hover:scale-110'}`}>
                {isSyncing ? 'sync' : 'cloud_sync'}
              </span>
              {!isSyncing && (
                <span className="absolute -top-1 -right-1 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#10b981] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#047857]" />
                </span>
              )}
            </div>

            <div className="flex flex-col text-left">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#065f46] tracking-tight">
                  {isSyncing ? 'Synchronizing Metros...' : 'Cloud Sync Live'}
                </span>
                <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-full bg-white/80 text-[#047857] font-semibold border border-[#a7f3d0]/60">
                  {latencyMs}ms
                </span>
              </div>
              <span className="text-[9px] text-[#047857]/80 font-mono">
                {isSyncing ? 'Pacing 6 Nodes' : `Updated ${secondsAgo === 0 ? 'just now' : `${secondsAgo}s ago`}`}
              </span>
            </div>

            <span className="material-symbols-outlined text-xs text-[#059669]/60 group-hover:text-[#059669] transition-colors ml-0.5">
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* Right zone: Actions, Redesigned Modern Luxury Notification Icon, Profile */}
      <div className="flex items-center gap-2 sm:gap-3.5 shrink-0">
        {/* Compact Real-Time Cloud Sync Indicator for Medium Screens */}
        <div className="flex xl:hidden items-center">
          <button
            onClick={handleManualSync}
            disabled={isSyncing}
            type="button"
            title="Real-time Cloud Sync"
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#ecfdf5] border border-[#a7f3d0] text-[#047857] hover:bg-[#d1fae5] transition-all cursor-pointer"
          >
            <span className={`material-symbols-outlined text-base ${isSyncing ? 'animate-spin' : ''}`}>
              cloud_sync
            </span>
            <span className="text-[10px] font-bold hidden sm:inline font-mono">
              {isSyncing ? 'Syncing' : 'Live'}
            </span>
          </button>
        </div>

        {/* Quick Order / Reserve CTA with animated shimmer & hover lift */}
        <button
          onClick={onOpenQuickOrder}
          type="button"
          className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white font-bold text-xs sm:text-sm shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_22px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap cursor-pointer"
        >
          <span className="material-symbols-outlined text-base sm:text-lg animate-pulse-subtle">
            add_circle
          </span>
          <span className="hidden sm:inline">+ Quick Order / Reserve</span>
          <span className="sm:hidden">+ Order</span>
        </button>

        {/* Upgraded Modern Luxury Notification Center Icon */}
        <div className="relative flex items-center justify-center">
          <button
            onClick={onToggleNotifications}
            aria-label="Syndicate Priority Notifications"
            title="Syndicate Priority Notifications & Real-Time Alerts"
            className="relative p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e] hover:text-[#1c1917] border border-[#e8decb] hover:border-[#f59e0b]/50 transition-all duration-300 cursor-pointer shadow-xs hover:shadow-[0_4px_16px_rgba(245,158,11,0.18)] group"
            type="button"
          >
            {/* Modern Bespoke Curved Bell Icon with sound resonance waves */}
            <div className="transition-transform duration-300 group-hover:scale-110">
              <svg
                className="w-5 h-5 text-[#b45309] group-hover:text-[#ea580c] transition-colors group-hover:animate-bell-ring"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {/* Curved Modern Bell Dome */}
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
                {/* Floating Clapper Highlight */}
                <circle cx="12" cy="18.5" r="1.2" fill="#b45309" className="group-hover:fill-[#ea580c]" />
                {/* Resonance Soundwave Arcs */}
                <path
                  strokeLinecap="round"
                  strokeWidth="1.5"
                  d="M18.5 7.5a6.5 6.5 0 011.5 4M5.5 7.5a6.5 6.5 0 00-1.5 4"
                  className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 stroke-[#ea580c]"
                />
              </svg>
            </div>

            {/* Glowing Modern Badge with Ripple Ring */}
            {notificationCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dc2626] opacity-75" />
                <span className="relative inline-flex items-center justify-center rounded-full h-4 w-4 bg-gradient-to-tr from-[#dc2626] via-[#ea580c] to-[#b91c1c] text-white text-[9px] font-bold font-mono shadow-sm ring-2 ring-white">
                  {notificationCount}
                </span>
              </span>
            )}
          </button>
        </div>

        {/* Vertical Divider */}
        <div className="h-7 w-px bg-[#e8decb] hidden sm:block" />

        {/* User Profile Card (Clickable to open User Profile & My Team) */}
        <button
          type="button"
          onClick={onOpenProfile}
          title="Open User Profile & My Team Management"
          className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-xl hover:bg-[#f4eee2] transition-all cursor-pointer group text-left"
        >
          <div className="flex flex-col text-right hidden md:flex">
            <span className="text-xs sm:text-sm text-[#1c1917] font-bold leading-tight group-hover:text-[#b45309] transition-colors">
              {userName}
            </span>
            <span className="text-[10px] text-[#b45309] tracking-wider uppercase font-bold">
              {userRole}
            </span>
          </div>
          <div className="relative">
            <img
              alt={`${userName} avatar`}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#f59e0b]/50 group-hover:ring-[#f59e0b] group-hover:scale-105 transition-all shadow-md"
              src={avatarUrl}
              referrerPolicy="no-referrer"
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-[#047857] ring-2 ring-white" />
          </div>
        </button>
      </div>
    </header>
  );
};
