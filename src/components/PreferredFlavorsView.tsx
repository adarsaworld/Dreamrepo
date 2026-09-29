import React, { useState, useEffect } from 'react';
import { LocationId } from '../types';

interface PreferredFlavorsViewProps {
  currentLocation: LocationId;
  onNavigateTab: (tab: any) => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const PreferredFlavorsView: React.FC<PreferredFlavorsViewProps> = ({
  currentLocation,
  onNavigateTab,
  onShowToast,
}) => {
  const [activeChannel, setActiveChannel] = useState<'omni' | 'dinein' | 'delivery'>('omni');
  const [activeLocationFilter, setActiveLocationFilter] = useState<string>(
    currentLocation === 'all' ? 'all' : currentLocation
  );
  const [secondsRefresh, setSecondsRefresh] = useState<number>(42);

  // Sync internal filter if header location changes
  useEffect(() => {
    if (currentLocation !== 'all') {
      setActiveLocationFilter(currentLocation);
    }
  }, [currentLocation]);

  // Telemetry countdown simulation
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsRefresh((prev) => (prev > 1 ? prev - 1 : 60));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const locationButtons = [
    { id: 'all', label: 'All Outposts (6)' },
    { id: 'tokyo', label: 'Tokyo Roppongi' },
    { id: 'nyc', label: 'NYC SoHo' },
    { id: 'london', label: 'London Mayfair' },
    { id: 'dubai', label: 'Dubai Marina' },
    { id: 'paris', label: 'Paris Le Marais' },
  ];

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Top Navigation & Strategic Header */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#ffc174]">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                insights
              </span>
              <span className="text-[11px] uppercase tracking-widest font-bold">
                Intelligence Stream // Gastronomic Demand
              </span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight">
              Preferred Flavors & Dining Behavior Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#d8c3ad] max-w-3xl leading-relaxed">
              Aggregated palate telemetry across 6 global metropolitan outposts. Correlating culinary flavor signatures with guest re-order propensity, channel economics, and seasonal palate surges.
            </p>
          </div>

          {/* Live Channel Switcher */}
          <div className="inline-flex p-1 rounded-xl bg-[#292a2b] border border-[#343536] gap-1 self-start lg:self-auto shrink-0 shadow-inner">
            <button
              onClick={() => {
                setActiveChannel('omni');
                onShowToast('Omnichannel Scope', 'Displaying blended dine-in, web portal, and delivery telemetry.');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeChannel === 'omni'
                  ? 'bg-[#f59e0b] text-[#472a00] shadow-sm'
                  : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
              }`}
              type="button"
            >
              Omnichannel
            </button>
            <button
              onClick={() => {
                setActiveChannel('dinein');
                onShowToast('Dine-In Scope', 'Filtering for table-side orders and tasting courses.');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeChannel === 'dinein'
                  ? 'bg-[#f59e0b] text-[#472a00] shadow-sm'
                  : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
              }`}
              type="button"
            >
              Dine-In Experiences
            </button>
            <button
              onClick={() => {
                setActiveChannel('delivery');
                onShowToast('Delivery Scope', 'Filtering for Deliverect, UberEats Priority, and direct app.');
              }}
              className={`px-3 sm:px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeChannel === 'delivery'
                  ? 'bg-[#f59e0b] text-[#472a00] shadow-sm'
                  : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
              }`}
              type="button"
            >
              Online Delivery Platforms
            </button>
          </div>
        </div>

        {/* Outpost Selector Filter Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 p-2.5 rounded-xl bg-[#1b1c1d] border border-[#292a2b] shadow-sm">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a] px-2 hidden sm:inline-block">
              Location Filter:
            </span>
            {locationButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setActiveLocationFilter(btn.id);
                  onShowToast('Filter Applied', `Viewing culinary metrics for ${btn.label}.`);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                  activeLocationFilter === btn.id
                    ? 'bg-[#39393a] text-[#ffc174] shadow-sm border border-[#ffc174]/30'
                    : 'bg-[#1f2021] text-[#d8c3ad] hover:text-[#e3e2e3] border border-[#292a2b]'
                }`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#a08e7a] text-xs font-mono pr-2">
            <span className="flex h-2 w-2 rounded-full bg-[#56e5a9] animate-pulse" />
            <span>
              Telemetry Refresh: <span className="text-[#e3e2e3] font-bold">T-00:{secondsRefresh < 10 ? `0${secondsRefresh}` : secondsRefresh}s</span>
            </span>
          </div>
        </div>

        {/* High Impact Strategic Banner */}
        <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#292a2b] via-[#1f2021] to-[#292a2b] border border-[#343536] p-6 shadow-xl">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#f59e0b]/10 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3.5 rounded-xl bg-[#ffc174]/10 text-[#ffc174] flex items-center justify-center shrink-0 border border-[#ffc174]/20">
                <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-widest text-[#ffc174] font-bold">
                    Primary Flavor Gravity Index
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/20 text-[#ffc174] text-[10px] font-bold uppercase tracking-wider">
                    High Intensity
                  </span>
                </div>
                <h2 className="font-headline font-bold text-lg sm:text-xl text-[#e3e2e3]">
                  Most Demanded Profile: Umami Wood-Fired Wagyu & Truffle Infusions
                </h2>
                <p className="text-xs sm:text-sm text-[#d8c3ad]">
                  Accounts for{' '}
                  <span className="text-[#ffc174] font-semibold">34% of syndicate aggregate order volume</span> with 89.2% repeat ordering cadence across premier evening shifts.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 border-[#343536] pt-3 md:pt-0 shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#a08e7a] block font-bold">
                  Flavor Delta (MoM)
                </span>
                <span className="font-headline font-bold text-xl sm:text-2xl text-[#56e5a9] font-mono">
                  +18.4%
                </span>
              </div>
              <div className="h-10 w-px bg-[#343536]" />
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#a08e7a] block font-bold">
                  Avg Ticket Boost
                </span>
                <span className="font-headline font-bold text-xl sm:text-2xl text-[#e3e2e3] font-mono">
                  +$42.50
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dishes Leaderboard: Bento Top 2 Showcase + Deep Roster */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-base sm:text-lg text-[#e3e2e3] tracking-tight">
              Customer Most Preferred Dishes Leaderboard
            </h2>
            <p className="text-xs text-[#d8c3ad]">
              Live volume ordering rank, channel yield margins, and taste profile attribution.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#d8c3ad]">
            <span>Sort By:</span>
            <button
              onClick={() => onShowToast('Sorted by Velocity', 'Ordering data ordered by daily ticket frequency.')}
              className="px-2.5 py-1 rounded bg-[#292a2b] text-[#ffc174] font-semibold border border-[#343536] cursor-pointer"
              type="button"
            >
              Velocity (Orders/Day)
            </button>
          </div>
        </div>

        {/* Asymmetric Bento Header: Dish #1 & Dish #2 High Visibility Spotlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Dish #1 Hero Card */}
          <div className="lg:col-span-7 rounded-xl bg-[#1f2021] border border-[#292a2b] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group">
            {/* Background dish visual with gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0f] via-[#1f2021]/80 to-transparent z-10 pointer-events-none" />
            <div
              className="absolute top-0 right-0 w-3/5 h-full opacity-40 group-hover:opacity-55 transition-opacity duration-700 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3BGDAprHORnm-5kBNkR-ZTTmQKsZrUcfev0nZyBa0W_vHo_ySs9gAPjNX2Iw96yVW3oLFGXYDVKTv_RojB4M2Q7HRXrsy5uoYduUTQqFVYZyCaLPtA4_Udh_YOpczu8OdjNYSZgdz6k-24H8u8ZeLpa31jCA6t1Lod1aguu3EptYJPxUhv1_UIsnPQUNciaVLjRA_tVOW5bHcs8LXlBXoI5gukRNx9brJnbidbnS0KpOK142O0unymg')",
              }}
            />

            <div className="relative z-20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#f59e0b] text-[#472a00] text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Rank #1 Global
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#343536]/80 backdrop-blur-sm text-[#ffc174] text-[10px] font-semibold border border-[#ffc174]/20">
                    Dine-in Signature
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#ffc174]">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-sm text-[#e3e2e3]">4.96</span>
                  <span className="text-xs text-[#a08e7a]">(840 reviews)</span>
                </div>
              </div>

              <div className="pt-6">
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#e3e2e3] tracking-tight">
                  A5 Miyazaki Wagyu Ribeye
                </h3>
                <p className="text-sm text-[#ffc174] font-semibold mt-1">
                  with 30-Year Aged Black Truffle Tare
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2 py-0.5 rounded bg-[#39393a]/80 text-[10px] text-[#e3e2e3] font-medium border border-[#534434]">
                    Umami Depth
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#39393a]/80 text-[10px] text-[#e3e2e3] font-medium border border-[#534434]">
                    Wood-Fired Smoke
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#39393a]/80 text-[10px] text-[#e3e2e3] font-medium border border-[#534434]">
                    Earthy Truffle
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#343536]/60 mt-4">
              <div>
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold block">Sales Velocity</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#e3e2e3] font-mono">
                  542 <span className="text-xs text-[#ffc174] font-normal">ord/day</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold block">Unit Price</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#e3e2e3] font-mono">
                  $128<span className="text-xs text-[#a08e7a] font-normal">.00</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold block">Margin Yield</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#56e5a9] font-mono">
                  68%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold block">Repeat Order</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#ffc174] font-mono">
                  44.8%
                </span>
              </div>
            </div>
          </div>

          {/* Dish #2 Hero Card */}
          <div className="lg:col-span-5 rounded-xl bg-[#1f2021] border border-[#292a2b] p-6 shadow-xl relative overflow-hidden flex flex-col justify-between group">
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0f] via-[#1f2021]/80 to-transparent z-10 pointer-events-none" />
            <div
              className="absolute top-0 right-0 w-3/4 h-full opacity-40 group-hover:opacity-55 transition-opacity duration-700 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKWa2vQhwc4kevP4bhvQSAiL9x7iw7hn1s2Bj5z05-chEtAEGpLGPuAa-VaeAqKDoMkg9ojV8XEjsqMlh7fvZ6uMhyGxHmWQFrN_JZidcl_AFGymDkLfn4xzsHUL4Bb1mXsS7oOdBGOgTb_g5NDuEufor0E2zozGNdMnehxfj5aKNeZFb8bMlQ3YE0F5emejhiQlbjc7blHOfTWLj22c-JL_-9U00YRzbXTlzx3CIA1RlEI2nrI-Nu4g')",
              }}
            />

            <div className="relative z-20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-[#39393a] text-[#ffc174] text-[10px] font-bold uppercase tracking-wider border border-[#ffc174]/30">
                    Rank #2 Global
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-[#cc003c] text-white text-[10px] font-bold flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">bolt</span>
                    Viral Delivery Hit
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#ffc174]">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-sm text-[#e3e2e3]">4.92</span>
                </div>
              </div>

              <div className="pt-5">
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#e3e2e3] tracking-tight">
                  Truffle Lobster Sando
                </h3>
                <p className="text-sm text-[#ffc174] font-semibold mt-1">
                  Oscietra Caviar Butter on Hokkaido Shokupan
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2 py-0.5 rounded bg-[#39393a]/80 text-[10px] text-[#e3e2e3] font-medium border border-[#534434]">
                    Rich Butter
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#39393a]/80 text-[10px] text-[#e3e2e3] font-medium border border-[#534434]">
                    Ocean Brine
                  </span>
                  <span className="px-2 py-0.5 rounded bg-[#39393a]/80 text-[10px] text-[#e3e2e3] font-medium border border-[#534434]">
                    Sweet Crustacean
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#343536]/60 mt-4">
              <div>
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold block">Sales Velocity</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#e3e2e3] font-mono">
                  489 <span className="text-xs text-[#ffc174] font-normal">/day</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold block">Unit Price</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#e3e2e3] font-mono">
                  $64<span className="text-xs text-[#a08e7a] font-normal">.00</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold block">Margin Yield</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#56e5a9] font-mono">
                  72%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold block">Delivery Pkg Score</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#ffc174] font-mono">
                  99.1%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ranked Leaderboard Data Table (#3, #4, #5) */}
        <div className="rounded-xl bg-[#1f2021] border border-[#292a2b] overflow-hidden shadow-xl">
          <div className="px-6 py-3.5 bg-[#292a2b]/60 border-b border-[#343536] flex items-center justify-between">
            <span className="font-headline font-semibold text-sm text-[#e3e2e3]">
              Subsequent Flavor Leaders (#3 - #5)
            </span>
            <span className="text-[10px] text-[#a08e7a] uppercase tracking-wider font-semibold font-mono">
              Metrics normalized across 24h cycle
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#0d0e0f]/50 text-[#a08e7a] text-[10px] uppercase tracking-wider border-b border-[#343536]">
                  <th className="py-3 px-6">Rank & Signature Dish</th>
                  <th className="py-3 px-4">Flavor Profile Tags</th>
                  <th className="py-3 px-4 text-right">Orders / Day</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Gross Margin</th>
                  <th className="py-3 px-4 text-center">Guest Sentiment</th>
                  <th className="py-3 px-6 text-right">Branch Lead Outpost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#343536]/30 text-xs text-[#e3e2e3]">
                {/* Dish #3 */}
                <tr className="hover:bg-[#292a2b]/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-headline font-bold text-base text-[#a08e7a] font-mono">
                        03
                      </span>
                      <div>
                        <span className="font-semibold text-sm text-[#e3e2e3] block">
                          Charred Miso Sea Bass & Yuzu Emulsion
                        </span>
                        <span className="text-[11px] text-[#d8c3ad]">
                          Sustainably sourced Chilean Sea Bass marinated for 72 hrs
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#343536] text-[#ffc174] text-[10px] font-semibold">
                        Citrus Accent
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#343536] text-[#d8c3ad] text-[10px]">
                        Charred Sweet
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-sm">412</td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-sm">$56.00</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono font-semibold text-[#56e5a9] text-sm">65%</span>
                    <span className="block text-[10px] text-[#a08e7a]">Low waste</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[#ffc174]">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-bold text-[#e3e2e3]">4.89</span>
                      <span className="text-[10px] text-[#a08e7a]">/ 5.0</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="space-y-1">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs font-semibold text-[#e3e2e3]">London Mayfair</span>
                        <span className="text-xs text-[#ffc174] font-semibold font-mono">41%</span>
                      </div>
                      <div className="w-28 ml-auto bg-[#343536] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#ffc174] h-full rounded-full" style={{ width: '41%' }} />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Dish #4 */}
                <tr className="hover:bg-[#292a2b]/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-headline font-bold text-base text-[#a08e7a] font-mono">
                        04
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#e3e2e3]">
                            Smoked Duck Breast Bao
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#cc003c]/20 text-[#ffb3b6] text-[10px] font-semibold">
                            Late Night Favorite
                          </span>
                        </div>
                        <span className="text-[11px] text-[#d8c3ad]">
                          Hoisin plum reduction, pickled heirloom daikon, steam bun
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#343536] text-[#ffc174] text-[10px] font-semibold">
                        Smoky
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#343536] text-[#d8c3ad] text-[10px]">
                        Sweet & Savory
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-sm">380</td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-sm">$28.00</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono font-semibold text-[#56e5a9] text-sm">78%</span>
                    <span className="block text-[10px] text-[#a08e7a]">High throughput</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[#ffc174]">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-bold text-[#e3e2e3]">4.88</span>
                      <span className="text-[10px] text-[#a08e7a]">/ 5.0</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="space-y-1">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs font-semibold text-[#e3e2e3]">NYC SoHo</span>
                        <span className="text-xs text-[#ffc174] font-semibold font-mono">52%</span>
                      </div>
                      <div className="w-28 ml-auto bg-[#343536] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#ffc174] h-full rounded-full" style={{ width: '52%' }} />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Dish #5 */}
                <tr className="hover:bg-[#292a2b]/40 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-headline font-bold text-base text-[#a08e7a] font-mono">
                        05
                      </span>
                      <div>
                        <span className="font-semibold text-sm text-[#e3e2e3] block">
                          Golden Matcha Lava Tart with 24k Gold Leaf
                        </span>
                        <span className="text-[11px] text-[#d8c3ad]">
                          Uji ceremonial grade matcha core with black sesame crust
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded bg-[#343536] text-[#ffc174] text-[10px] font-semibold">
                        Earthy Bitter
                      </span>
                      <span className="px-2 py-0.5 rounded bg-[#343536] text-[#d8c3ad] text-[10px]">
                        Sweet Silky
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-sm">340</td>
                  <td className="py-4 px-4 text-right font-mono font-semibold text-sm">$22.00</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono font-semibold text-[#56e5a9] text-sm">81%</span>
                    <span className="block text-[10px] text-[#a08e7a]">Pastry batching</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[#ffc174]">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-bold text-[#e3e2e3]">4.98</span>
                      <span className="text-[10px] text-[#a08e7a]">/ 5.0</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="space-y-1">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs font-semibold text-[#e3e2e3]">Tokyo Roppongi</span>
                        <span className="text-xs text-[#ffc174] font-semibold font-mono">66%</span>
                      </div>
                      <div className="w-28 ml-auto bg-[#343536] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#ffc174] h-full rounded-full" style={{ width: '66%' }} />
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Online Food Ordering Traffic & Delivery Conversion Funnel */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline font-bold text-base sm:text-lg text-[#e3e2e3] tracking-tight">
              Online Food Ordering Traffic & Delivery Conversion Funnel
            </h2>
            <p className="text-xs text-[#d8c3ad]">
              Live telemetry from syndicate white-label web portals, mobile application, and third-party delivery aggregators.
            </p>
          </div>
          <span className="px-2.5 py-1 rounded bg-[#56e5a9]/10 text-[#56e5a9] text-xs font-semibold flex items-center gap-1.5 border border-[#56e5a9]/20">
            <span className="h-2 w-2 rounded-full bg-[#56e5a9] animate-pulse" />
            Funnel Sync Live
          </span>
        </div>

        {/* 4 High Level Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-xl bg-[#1f2021] border border-[#292a2b] p-4 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a]">
                Total Digital Traffic
              </span>
              <span className="material-symbols-outlined text-[#a08e7a] text-lg">visibility</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-[#e3e2e3] font-mono">
                28,450
              </span>
              <span className="text-xs text-[#56e5a9] font-semibold font-mono">+14.2%</span>
            </div>
            <span className="text-[11px] text-[#a08e7a] block">Unique digital sessions recorded today</span>
          </div>

          <div className="rounded-xl bg-[#1f2021] border border-[#292a2b] p-4 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a]">
                Add to Cart Rate
              </span>
              <span className="material-symbols-outlined text-[#a08e7a] text-lg">add_shopping_cart</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-[#e3e2e3] font-mono">
                34.8%
              </span>
              <span className="text-xs text-[#56e5a9] font-semibold font-mono">+2.8%</span>
            </div>
            <span className="text-[11px] text-[#a08e7a] block">Benchmark fine dining average: 21.5%</span>
          </div>

          <div className="rounded-xl bg-[#1f2021] border border-[#292a2b] p-4 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a]">
                Checkout Conversion
              </span>
              <span className="material-symbols-outlined text-[#a08e7a] text-lg">check_circle</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-[#56e5a9] font-mono">
                78.4%
              </span>
              <span className="text-xs text-[#56e5a9] font-semibold font-mono">+4.1%</span>
            </div>
            <span className="text-[11px] text-[#a08e7a] block">Payment authorization success rate 99.8%</span>
          </div>

          <div className="rounded-xl bg-[#1f2021] border border-[#292a2b] p-4 shadow-md space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a]">
                Avg Order Dispatch Time
              </span>
              <span className="material-symbols-outlined text-[#a08e7a] text-lg">timer</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-[#ffc174] font-mono">
                18.4
              </span>
              <span className="text-xs text-[#d8c3ad]">mins</span>
            </div>
            <span className="text-[11px] text-[#a08e7a] block">Ticket kitchen fire to courier dispatch</span>
          </div>
        </div>

        {/* Funnel Visualization & Peak Hours Graph Combo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Peak Rush Hours Graph */}
          <div className="lg:col-span-8 rounded-xl bg-[#1f2021] border border-[#292a2b] p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#ffc174] font-bold">
                  Temporal Demand Telemetry
                </span>
                <h3 className="font-headline font-bold text-base text-[#e3e2e3]">
                  Peak Rush Hour Traffic: Lunch Rush vs. Dinner Surge
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-medium">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ffc174]" />
                  <span className="text-[#d8c3ad]">Today's Curve</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#534434]" />
                  <span className="text-[#a08e7a]">30D Rolling Baseline</span>
                </div>
              </div>
            </div>

            {/* Inline SVG Chart */}
            <div className="relative w-full h-64 pt-2">
              <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 650 200">
                <defs>
                  <linearGradient id="curveGlow2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#ffc174" stopOpacity="0.4" />
                    <stop offset="100%" stopColor="#ffc174" stopOpacity="0.0" />
                  </linearGradient>
                  <linearGradient id="baselineGlow2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#343536" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#343536" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Grid lines */}
                <line x1="0" y1="40" x2="650" y2="40" stroke="#292a2b" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="650" y2="90" stroke="#292a2b" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="650" y2="140" stroke="#292a2b" strokeWidth="1" strokeDasharray="4 4" />

                {/* Baseline path */}
                <path
                  d="M 0,170 Q 70,165 130,120 T 260,140 T 390,70 T 520,35 T 650,110 L 650,200 L 0,200 Z"
                  fill="url(#baselineGlow2)"
                />
                <path
                  d="M 0,170 Q 70,165 130,120 T 260,140 T 390,70 T 520,35 T 650,110"
                  fill="none"
                  stroke="#534434"
                  strokeWidth="2"
                />

                {/* Active curve path */}
                <path
                  d="M 0,175 Q 60,170 120,95 T 230,125 T 380,45 T 510,18 T 650,85 L 650,200 L 0,200 Z"
                  fill="url(#curveGlow2)"
                />
                <path
                  d="M 0,175 Q 60,170 120,95 T 230,125 T 380,45 T 510,18 T 650,85"
                  fill="none"
                  stroke="#ffc174"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                {/* Lunch Apex Annotation Circle */}
                <circle cx="120" cy="95" r="5" fill="#f59e0b" className="animate-pulse" />
                <circle cx="120" cy="95" r="9" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

                {/* Dinner Surge Annotation Circle */}
                <circle cx="510" cy="18" r="6" fill="#ffc174" className="animate-pulse" />
                <circle cx="510" cy="18" r="11" fill="none" stroke="#ffc174" strokeWidth="1.5" />
              </svg>

              {/* Floating badges over chart */}
              <div className="absolute left-[16%] top-[34%] -translate-x-1/2 p-2 rounded-lg bg-[#292a2b]/95 border border-[#ffc174]/40 backdrop-blur-md shadow-xl pointer-events-none">
                <span className="text-[10px] text-[#e3e2e3] font-bold block leading-tight">
                  Lunch Apex
                </span>
                <span className="text-[10px] text-[#ffc174] font-mono">
                  12:45 PM • 482 orders/hr
                </span>
              </div>

              <div className="absolute left-[78%] top-[8%] -translate-x-1/2 p-2.5 rounded-lg bg-[#292a2b]/95 border border-[#56e5a9]/40 backdrop-blur-md shadow-xl pointer-events-none">
                <span className="text-[10px] text-[#56e5a9] font-bold block leading-tight">
                  Dinner Mega-Surge
                </span>
                <span className="text-[10px] text-[#e3e2e3] font-mono">
                  8:15 PM • 1,180 orders/hr
                </span>
              </div>
            </div>

            {/* Timestamps */}
            <div className="flex justify-between w-full text-[#a08e7a] text-[10px] font-mono px-2 pt-2 border-t border-[#343536]/40">
              <span>11:00 AM</span>
              <span>1:00 PM</span>
              <span>3:00 PM</span>
              <span>5:00 PM</span>
              <span>7:00 PM</span>
              <span>9:00 PM</span>
              <span>11:00 PM</span>
            </div>

            {/* Weather Impact Factor */}
            <div className="p-3 rounded-lg bg-[#1b1c1d] border border-[#292a2b] flex items-center justify-between text-xs text-[#d8c3ad]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffc174] text-lg">rainy</span>
                <span>
                  <strong className="text-[#e3e2e3]">Weather Impact Factor:</strong> Heavy precipitation in London & NYC shifted +38% orders into private delivery channels during 6PM-8PM.
                </span>
              </div>
              <span className="text-[10px] text-[#ffc174] font-bold shrink-0 uppercase tracking-wider bg-[#f59e0b]/15 px-2 py-0.5 rounded border border-[#f59e0b]/30">
                Correlated
              </span>
            </div>
          </div>

          {/* Delivery Platform Breakdown & Conversion Stages */}
          <div className="lg:col-span-4 rounded-xl bg-[#1f2021] border border-[#292a2b] p-6 shadow-xl space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#ffc174] font-bold">
                Channel Arbitrage
              </span>
              <h3 className="font-headline font-bold text-base text-[#e3e2e3]">
                Platform Share & Margin Split
              </h3>
            </div>

            {/* Platform Bars */}
            <div className="space-y-3">
              {/* Direct Kizen App */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e3e2e3] font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ffc174]" /> Direct Kizen App & Web
                  </span>
                  <span className="text-[#ffc174] font-bold font-mono">
                    45% <span className="text-[#a08e7a] font-normal">($128 avg)</span>
                  </span>
                </div>
                <div className="w-full bg-[#343536] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#ffc174] h-full rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-[10px] text-[#56e5a9] font-medium block">
                  0% aggregator fee • Highest profit density
                </span>
              </div>

              {/* UberEats Priority */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e3e2e3] font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#56e5a9]" /> UberEats Priority
                  </span>
                  <span className="text-[#e3e2e3] font-semibold font-mono">
                    28% <span className="text-[#a08e7a] font-normal">($94 avg)</span>
                  </span>
                </div>
                <div className="w-full bg-[#343536] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#56e5a9] h-full rounded-full" style={{ width: '28%' }} />
                </div>
                <span className="text-[10px] text-[#a08e7a] block">
                  Exclusive high-tier restaurant badge
                </span>
              </div>

              {/* DoorDash Caviar */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e3e2e3] font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ffb3b6]" /> DoorDash Caviar / Pass
                  </span>
                  <span className="text-[#e3e2e3] font-semibold font-mono">
                    18% <span className="text-[#a08e7a] font-normal">($88 avg)</span>
                  </span>
                </div>
                <div className="w-full bg-[#343536] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#ffb3b6] h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              {/* Deliveroo */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#e3e2e3] font-semibold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#a08e7a]" /> Deliveroo Signature
                  </span>
                  <span className="text-[#e3e2e3] font-semibold font-mono">
                    9% <span className="text-[#a08e7a] font-normal">($102 avg)</span>
                  </span>
                </div>
                <div className="w-full bg-[#343536] rounded-full h-2 overflow-hidden">
                  <div className="bg-[#a08e7a] h-full rounded-full" style={{ width: '9%' }} />
                </div>
              </div>
            </div>

            {/* Order Drop-off Diagnosis */}
            <div className="p-3 rounded-xl bg-[#1b1c1d] border border-[#292a2b] space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a] block">
                Order Drop-off Diagnosis
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[#d8c3ad]">Cart Abandonment:</span>
                <span className="text-[#e3e2e3] font-bold font-mono">21.6%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#d8c3ad]">Promo Code Redemption:</span>
                <span className="text-[#56e5a9] font-bold font-mono">3.2% (Healthy low)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flavor Sentiment & Dietary Demands Radar */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Natural Language Review Telemetry */}
        <div className="lg:col-span-7 rounded-xl bg-[#1f2021] border border-[#292a2b] p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#ffc174] font-bold">
                Guest Sentiment Synthesis
              </span>
              <h3 className="font-headline font-bold text-base text-[#e3e2e3]">
                Natural Language Review Telemetry
              </h3>
            </div>
            <div className="text-right">
              <span className="font-headline font-bold text-2xl text-[#56e5a9] font-mono">
                98%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#a08e7a] block font-semibold">
                Positive Sentiment
              </span>
            </div>
          </div>

          {/* Highlight Keywords */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#a08e7a] block font-bold">
              Dominant Guest Feedback Highlights
            </span>
            <div className="flex flex-wrap gap-2">
              <div className="px-3 py-2 rounded-xl bg-[#292a2b] border border-[#343536] flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[#ffc174] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  thumb_up
                </span>
                <span className="text-xs font-semibold text-[#e3e2e3]">"Perfect Seared Crust"</span>
                <span className="px-1.5 py-0.5 rounded bg-[#39393a] text-[10px] font-bold text-[#ffc174] font-mono">
                  1,420 mentions
                </span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#292a2b] border border-[#343536] flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[#56e5a9] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="text-xs font-semibold text-[#e3e2e3]">"Express Packaging Delivery"</span>
                <span className="px-1.5 py-0.5 rounded bg-[#39393a] text-[10px] font-bold text-[#56e5a9] font-mono">
                  982 mentions
                </span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#292a2b] border border-[#343536] flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[#ffc174] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  camera
                </span>
                <span className="text-xs font-semibold text-[#e3e2e3]">"Mouthwatering Presentation"</span>
                <span className="px-1.5 py-0.5 rounded bg-[#39393a] text-[10px] font-bold text-[#ffc174] font-mono">
                  870 mentions
                </span>
              </div>
              <div className="px-3 py-2 rounded-xl bg-[#292a2b] border border-[#343536] flex items-center gap-2 shadow-sm">
                <span className="material-symbols-outlined text-[#a08e7a] text-base">restaurant</span>
                <span className="text-xs font-semibold text-[#e3e2e3]">"Balanced Acidity"</span>
                <span className="px-1.5 py-0.5 rounded bg-[#39393a] text-[10px] font-bold text-[#d8c3ad] font-mono">
                  610 mentions
                </span>
              </div>
            </div>
          </div>

          {/* Sample Review Quote */}
          <div className="p-4 rounded-xl bg-[#1b1c1d] border-l-4 border-[#ffc174] border-t border-r border-b border-[#292a2b] space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#ffc174] font-semibold">
                Verified VIP Guest • Dubai Marina Outpost
              </span>
              <span className="text-[10px] text-[#a08e7a]">2 hours ago</span>
            </div>
            <p className="text-xs text-[#e3e2e3] italic leading-relaxed">
              "The Wagyu tare glaze balances the smokiness without muting the natural marbling fat. Even in temperature-controlled transit packaging, the sando arrived impeccably crisp."
            </p>
          </div>
        </div>

        {/* Dietary Trends & Demand Radar */}
        <div className="lg:col-span-5 rounded-xl bg-[#1f2021] border border-[#292a2b] p-6 shadow-xl space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#ffc174] font-bold">
              Evolutionary Gastronomy
            </span>
            <h3 className="font-headline font-bold text-base text-[#e3e2e3]">
              Dietary Trends & Demand Radar
            </h3>
          </div>

          <div className="space-y-3">
            {/* Gluten-Free */}
            <div className="p-3 rounded-xl bg-[#292a2b] border border-[#343536] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174] text-base">grain</span>
                  <span className="text-xs font-bold text-[#e3e2e3]">Gluten-Free Substitutions</span>
                </div>
                <span className="text-sm font-bold text-[#56e5a9] font-mono">
                  +22% <span className="text-[10px] font-normal text-[#a08e7a]">YoY</span>
                </span>
              </div>
              <div className="w-full bg-[#343536] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#56e5a9] h-full rounded-full" style={{ width: '72%' }} />
              </div>
              <span className="text-[11px] text-[#d8c3ad] block">
                Driven by tamari-cured sashimi and gluten-free tempura alternatives.
              </span>
            </div>

            {/* Pescatarian */}
            <div className="p-3 rounded-xl bg-[#292a2b] border border-[#343536] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffb3b6] text-base">set_meal</span>
                  <span className="text-xs font-bold text-[#e3e2e3]">Pescatarian Curations</span>
                </div>
                <span className="text-sm font-bold text-[#56e5a9] font-mono">
                  +14% <span className="text-[10px] font-normal text-[#a08e7a]">YoY</span>
                </span>
              </div>
              <div className="w-full bg-[#343536] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#ffb3b6] h-full rounded-full" style={{ width: '58%' }} />
              </div>
              <span className="text-[11px] text-[#d8c3ad] block">
                Surge in cold-water king crab and black cod special requests.
              </span>
            </div>

            {/* Zero-Proof */}
            <div className="p-3 rounded-xl bg-[#292a2b] border border-[#343536] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#ffc174] text-base">local_bar</span>
                  <span className="text-xs font-bold text-[#e3e2e3]">Premium Zero-Proof Pairings</span>
                </div>
                <span className="text-sm font-bold text-[#ffc174] font-mono">
                  +35% <span className="text-[10px] font-normal text-[#a08e7a]">Surge</span>
                </span>
              </div>
              <div className="w-full bg-[#343536] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#ffc174] h-full rounded-full" style={{ width: '86%' }} />
              </div>
              <span className="text-[11px] text-[#d8c3ad] block">
                Smoked lapsang souchong infusions and fermented yuzu elixirs commanding $24/glass.
              </span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => onNavigateTab('menu-studio')}
              className="w-full py-2.5 rounded-lg bg-[#39393a] text-[#e3e2e3] hover:text-[#ffc174] hover:bg-[#343536] text-xs font-bold flex items-center justify-center gap-2 transition-all border border-[#343536] cursor-pointer"
              type="button"
            >
              <span className="material-symbols-outlined text-base">tune</span>
              <span>Deploy Menu Studio Adjustments</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
