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
    { id: 'all', label: 'All Metros (6)' },
    { id: 'mumbai', label: 'Mumbai BKC' },
    { id: 'delhi', label: 'New Delhi CP' },
    { id: 'bengaluru', label: 'Bengaluru Indiranagar' },
    { id: 'hyderabad', label: 'Hyderabad Jubilee' },
    { id: 'kolkata', label: 'Kolkata Park St' },
    { id: 'chennai', label: 'Chennai Nungambakkam' },
  ];

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Top Navigation & Strategic Header */}
      <section className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-[#b45309]">
              <span className="material-symbols-outlined text-lg animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                insights
              </span>
              <span className="text-[11px] uppercase tracking-widest font-bold">
                Intelligence Stream // Indian Gastronomic Demand
              </span>
            </div>
            <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
              Preferred Flavors & Dining Behavior Analytics
            </h1>
            <p className="text-xs sm:text-sm text-[#57534e] max-w-3xl leading-relaxed">
              Aggregated palate telemetry across 6 premier Indian metropolitan outposts. Correlating royal Awadhi, coastal Malabar, and Kashmiri flavor signatures with guest re-order propensity, channel economics, and seasonal festival surges.
            </p>
          </div>

          {/* Live Channel Switcher */}
          <div className="inline-flex p-1 rounded-2xl bg-white border border-[#e8decb] gap-1 self-start lg:self-auto shrink-0 shadow-xs">
            <button
              onClick={() => {
                setActiveChannel('omni');
                onShowToast('Omnichannel Scope', 'Displaying blended dine-in, royal banqueting, and delivery telemetry.');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChannel === 'omni'
                  ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
              }`}
              type="button"
            >
              Omnichannel
            </button>
            <button
              onClick={() => {
                setActiveChannel('dinein');
                onShowToast('Dine-In Scope', 'Filtering for Royal Durbar table-side and tasting courses.');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChannel === 'dinein'
                  ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
              }`}
              type="button"
            >
              Dine-In Experiences
            </button>
            <button
              onClick={() => {
                setActiveChannel('delivery');
                onShowToast('Delivery Scope', 'Filtering for Swiggy Gourmet, Zomato Legends, and Concierge app.');
              }}
              className={`px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeChannel === 'delivery'
                  ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
              }`}
              type="button"
            >
              Online Delivery
            </button>
          </div>
        </div>

        {/* Outpost Selector Filter Bar */}
        <div className="flex items-center justify-between flex-wrap gap-3 p-3 rounded-2xl bg-white border border-[#e8decb] shadow-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c] px-2 hidden sm:inline-block">
              Metro Filter:
            </span>
            {locationButtons.map((btn) => (
              <button
                key={btn.id}
                onClick={() => {
                  setActiveLocationFilter(btn.id);
                  onShowToast('Metro Filter Applied', `Viewing culinary metrics for ${btn.label}.`);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeLocationFilter === btn.id
                    ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] shadow-xs border border-[#fde68a]'
                    : 'bg-[#faf8f5] text-[#57534e] hover:text-[#1c1917] hover:bg-[#f5efe4] border border-[#e8decb]'
                }`}
                type="button"
              >
                {btn.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-[#78716c] text-xs font-mono pr-2">
            <span className="flex h-2 w-2 rounded-full bg-[#047857] animate-pulse" />
            <span>
              Telemetry Refresh: <span className="text-[#1c1917] font-bold">T-00:{secondsRefresh < 10 ? `0${secondsRefresh}` : secondsRefresh}s</span>
            </span>
          </div>
        </div>

        {/* High Impact Strategic Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#fef3c7] via-[#fffbeb] to-[#fef3c7] border border-[#fde68a] p-6 shadow-sm">
          <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-[#f59e0b]/15 blur-3xl pointer-events-none" />
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="flex items-start sm:items-center gap-4">
              <div className="p-3.5 rounded-2xl bg-white text-[#b45309] flex items-center justify-center shrink-0 border border-[#fde68a] shadow-sm">
                <span className="material-symbols-outlined text-3xl animate-pulse" style={{ fontVariationSettings: "'FILL' 1" }}>
                  local_fire_department
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-[10px] uppercase tracking-widest text-[#92400e] font-bold">
                    Primary Flavor Gravity Index
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-white text-[#b45309] text-[10px] font-bold uppercase tracking-wider border border-[#fde68a] shadow-2xs">
                    High Intensity
                  </span>
                </div>
                <h2 className="font-headline font-bold text-lg sm:text-xl text-[#1c1917]">
                  Most Demanded Profile: Smoky Tandoor-Charred Truffle & Slow-Braised Nihari Reductions
                </h2>
                <p className="text-xs sm:text-sm text-[#57534e]">
                  Accounts for{' '}
                  <span className="text-[#b45309] font-bold">34% of syndicate aggregate order volume</span> with 89.2% repeat ordering cadence across premier evening dinner seatings.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-6 border-t md:border-t-0 border-[#fde68a] pt-3 md:pt-0 shrink-0">
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#78716c] block font-bold">
                  Flavor Delta (MoM)
                </span>
                <span className="font-headline font-bold text-xl sm:text-2xl text-[#047857] font-mono">
                  +18.4%
                </span>
              </div>
              <div className="h-10 w-px bg-[#fde68a]" />
              <div className="text-right">
                <span className="text-[10px] uppercase tracking-wider text-[#78716c] block font-bold">
                  Avg Ticket Boost
                </span>
                <span className="font-headline font-bold text-xl sm:text-2xl text-[#b45309] font-mono">
                  +₹1,850
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
            <h2 className="font-headline font-bold text-base sm:text-lg text-[#1c1917] tracking-tight">
              Customer Most Preferred Dishes Leaderboard
            </h2>
            <p className="text-xs text-[#57534e]">
              Live volume ordering rank across Indian metros, channel yield margins, and taste profile attribution.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-[#57534e]">
            <span>Sort By:</span>
            <button
              onClick={() => onShowToast('Sorted by Velocity', 'Ordering data ordered by daily ticket frequency in Indian metros.')}
              className="px-3 py-1.5 rounded-xl bg-white text-[#b45309] font-bold border border-[#e8decb] hover:border-[#b45309]/40 cursor-pointer shadow-xs"
              type="button"
            >
              Velocity (Orders/Day)
            </button>
          </div>
        </div>

        {/* Asymmetric Bento Header: Dish #1 & Dish #2 High Visibility Spotlights */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Dish #1 Hero Card */}
          <div className="lg:col-span-7 rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] relative overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-8px_rgba(217,119,6,0.18)] hover:border-[#f59e0b] transition-all duration-300">
            <div
              className="absolute top-0 right-0 w-3/5 h-full opacity-20 group-hover:opacity-30 transition-opacity duration-700 bg-cover bg-center pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuB3BGDAprHORnm-5kBNkR-ZTTmQKsZrUcfev0nZyBa0W_vHo_ySs9gAPjNX2Iw96yVW3oLFGXYDVKTv_RojB4M2Q7HRXrsy5uoYduUTQqFVYZyCaLPtA4_Udh_YOpczu8OdjNYSZgdz6k-24H8u8ZeLpa31jCA6t1Lod1aguu3EptYJPxUhv1_UIsnPQUNciaVLjRA_tVOW5bHcs8LXlBXoI5gukRNx9brJnbidbnS0KpOK142O0unymg')",
              }}
            />

            <div className="relative z-20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Rank #1 National
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[10px] font-bold border border-[#fde68a]">
                    Awadhi Signature
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#b45309]">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-sm text-[#1c1917]">4.96</span>
                  <span className="text-xs text-[#78716c]">(840 reviews)</span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#1c1917] tracking-tight group-hover:text-[#b45309] transition-colors">
                  Truffle Galouti Tartlet & 24K Gold Vark
                </h3>
                <p className="text-sm text-[#b45309] font-bold mt-1">
                  with 30-Year Aged Black Truffle Nihari & Saffron Sheermal
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#faf8f5] text-[11px] text-[#1c1917] font-semibold border border-[#e8decb]">
                    Awadhi Dum Pukht
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#faf8f5] text-[11px] text-[#1c1917] font-semibold border border-[#e8decb]">
                    Binchotan Smoked
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#faf8f5] text-[11px] text-[#1c1917] font-semibold border border-[#e8decb]">
                    Kashmiri Saffron
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#f0ece1] mt-5">
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Sales Velocity</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#1c1917] font-mono">
                  542 <span className="text-xs text-[#b45309] font-bold">ord/day</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Unit Price</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#1c1917] font-mono">
                  ₹4,850<span className="text-xs text-[#78716c] font-normal">.00</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Margin Yield</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#047857] font-mono">
                  74%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Repeat Order</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#b45309] font-mono">
                  44.8%
                </span>
              </div>
            </div>
          </div>

          {/* Dish #2 Hero Card */}
          <div className="lg:col-span-5 rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] relative overflow-hidden flex flex-col justify-between group hover:-translate-y-1.5 hover:shadow-[0_20px_35px_-8px_rgba(217,119,6,0.18)] hover:border-[#f59e0b] transition-all duration-300">
            <div
              className="absolute top-0 right-0 w-3/4 h-full opacity-20 group-hover:opacity-30 transition-opacity duration-700 bg-cover bg-center pointer-events-none"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCKWa2vQhwc4kevP4bhvQSAiL9x7iw7hn1s2Bj5z05-chEtAEGpLGPuAa-VaeAqKDoMkg9ojV8XEjsqMlh7fvZ6uMhyGxHmWQFrN_JZidcl_AFGymDkLfn4xzsHUL4Bb1mXsS7oOdBGOgTb_g5NDuEufor0E2zozGNdMnehxfj5aKNeZFb8bMlQ3YE0F5emejhiQlbjc7blHOfTWLj22c-JL_-9U00YRzbXTlzx3CIA1RlEI2nrI-Nu4g')",
              }}
            />

            <div className="relative z-20 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-[10px] font-bold uppercase tracking-wider shadow-sm">
                    Rank #2 National
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#fef2f2] text-[#991b1b] text-[10px] font-bold border border-[#fecaca] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">bolt</span>
                    Viral Delivery Hit
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[#b45309]">
                  <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>
                    star
                  </span>
                  <span className="font-bold text-sm text-[#1c1917]">4.92</span>
                </div>
              </div>

              <div className="pt-4">
                <h3 className="font-headline font-bold text-xl sm:text-2xl text-[#1c1917] tracking-tight group-hover:text-[#b45309] transition-colors">
                  Tandoori Truffle Lobster on Bun Maska
                </h3>
                <p className="text-sm text-[#b45309] font-bold mt-1">
                  Tellicherry Pepper Butter on Toasted Irani Bun Maska
                </p>
                <div className="flex flex-wrap gap-1.5 mt-3">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#faf8f5] text-[11px] text-[#1c1917] font-semibold border border-[#e8decb]">
                    Bay of Bengal
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#faf8f5] text-[11px] text-[#1c1917] font-semibold border border-[#e8decb]">
                    Curry Leaf Emulsion
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#faf8f5] text-[11px] text-[#1c1917] font-semibold border border-[#e8decb]">
                    Coastal Spiced
                  </span>
                </div>
              </div>
            </div>

            <div className="relative z-20 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-5 border-t border-[#f0ece1] mt-5">
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Sales Velocity</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#1c1917] font-mono">
                  489 <span className="text-xs text-[#b45309] font-bold">/day</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Unit Price</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#1c1917] font-mono">
                  ₹3,200<span className="text-xs text-[#78716c] font-normal">.00</span>
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Margin Yield</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#047857] font-mono">
                  74%
                </span>
              </div>
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">Delivery Score</span>
                <span className="font-headline font-bold text-base sm:text-lg text-[#b45309] font-mono">
                  99.1%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Ranked Leaderboard Data Table (#3, #4, #5) */}
        <div className="rounded-2xl bg-white border border-[#e8decb] overflow-hidden shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)]">
          <div className="px-6 py-4 bg-[#faf8f5] border-b border-[#e8decb] flex items-center justify-between">
            <span className="font-headline font-bold text-sm text-[#1c1917]">
              Subsequent Flavor Leaders (#3 - #5)
            </span>
            <span className="text-[10px] text-[#78716c] uppercase tracking-wider font-semibold font-mono">
              Metrics normalized across 24h metro cycle
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#f5efe4] text-[#78716c] text-[10px] uppercase tracking-wider border-b border-[#e8decb]">
                  <th className="py-3 px-6">Rank & Signature Dish</th>
                  <th className="py-3 px-4">Flavor Profile Tags</th>
                  <th className="py-3 px-4 text-right">Orders / Day</th>
                  <th className="py-3 px-4 text-right">Price</th>
                  <th className="py-3 px-4 text-right">Gross Margin</th>
                  <th className="py-3 px-4 text-center">Guest Sentiment</th>
                  <th className="py-3 px-6 text-right">Branch Lead Outpost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece1] text-xs text-[#1c1917]">
                {/* Dish #3 */}
                <tr className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-headline font-bold text-base text-[#b45309] font-mono">
                        03
                      </span>
                      <div>
                        <span className="font-bold text-sm text-[#1c1917] block">
                          Charred Kashmiri Morel Khichdi Arancini
                        </span>
                        <span className="text-[11px] text-[#57534e]">
                          Wild Guchhi mushrooms from Anantnag, 24-month aged Rajasthani cheese
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[10px] font-bold border border-[#fde68a]">
                        Guchhi Morel
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#faf8f5] text-[#57534e] text-[10px] font-medium border border-[#e8decb]">
                        Gobindobhog
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-sm">412</td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-sm text-[#b45309]">₹2,450.00</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono font-bold text-[#047857] text-sm">72%</span>
                    <span className="block text-[10px] text-[#78716c]">Low waste</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[#b45309]">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-bold text-[#1c1917]">4.89</span>
                      <span className="text-[10px] text-[#78716c]">/ 5.0</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="space-y-1">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1917]">Mumbai BKC</span>
                        <span className="text-xs text-[#b45309] font-bold font-mono">41%</span>
                      </div>
                      <div className="w-28 ml-auto bg-[#f0ece1] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '41%' }} />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Dish #4 */}
                <tr className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-headline font-bold text-base text-[#b45309] font-mono">
                        04
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#1c1917]">
                            Dum Pukht Smoked Duck Kakori Bao
                          </span>
                          <span className="px-2 py-0.5 rounded-full bg-[#fef2f2] text-[#991b1b] text-[10px] font-bold border border-[#fecaca]">
                            Late Night Favorite
                          </span>
                        </div>
                        <span className="text-[11px] text-[#57534e]">
                          Slow-braised Awadhi duck, tamarind reduction, heirloom pickled daikon
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[10px] font-bold border border-[#fde68a]">
                        Kakori Spiced
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#faf8f5] text-[#57534e] text-[10px] font-medium border border-[#e8decb]">
                        Sweet & Tangy
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-sm">380</td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-sm text-[#b45309]">₹1,850.00</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono font-bold text-[#047857] text-sm">78%</span>
                    <span className="block text-[10px] text-[#78716c]">High throughput</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[#b45309]">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-bold text-[#1c1917]">4.88</span>
                      <span className="text-[10px] text-[#78716c]">/ 5.0</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="space-y-1">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1917]">New Delhi Lutyens</span>
                        <span className="text-xs text-[#b45309] font-bold font-mono">52%</span>
                      </div>
                      <div className="w-28 ml-auto bg-[#f0ece1] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '52%' }} />
                      </div>
                    </div>
                  </td>
                </tr>

                {/* Dish #5 */}
                <tr className="hover:bg-[#faf8f5] transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <span className="font-headline font-bold text-base text-[#b45309] font-mono">
                        05
                      </span>
                      <div>
                        <span className="font-bold text-sm text-[#1c1917] block">
                          Golden Saffron & Pistachio Baklava Tart with 24k Gold
                        </span>
                        <span className="text-[11px] text-[#57534e]">
                          Pampore ceremonial saffron core with Iranian pistachio & malai rabri
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="flex items-center gap-1 flex-wrap">
                      <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] text-[10px] font-bold border border-[#fde68a]">
                        Kashmiri Saffron
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-[#faf8f5] text-[#57534e] text-[10px] font-medium border border-[#e8decb]">
                        Pistachio Rabri
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-sm">340</td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-sm text-[#b45309]">₹1,450.00</td>
                  <td className="py-4 px-4 text-right">
                    <span className="font-mono font-bold text-[#047857] text-sm">81%</span>
                    <span className="block text-[10px] text-[#78716c]">Halwai batching</span>
                  </td>
                  <td className="py-4 px-4 text-center">
                    <div className="inline-flex items-center gap-1 text-[#b45309]">
                      <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>
                        star
                      </span>
                      <span className="font-bold text-[#1c1917]">4.98</span>
                      <span className="text-[10px] text-[#78716c]">/ 5.0</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="space-y-1">
                      <div className="flex justify-end items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1917]">Bengaluru Indiranagar</span>
                        <span className="text-xs text-[#b45309] font-bold font-mono">66%</span>
                      </div>
                      <div className="w-28 ml-auto bg-[#f0ece1] rounded-full h-1.5 overflow-hidden">
                        <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '66%' }} />
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
            <h2 className="font-headline font-bold text-base sm:text-lg text-[#1c1917] tracking-tight">
              Online Food Ordering Traffic & Delivery Conversion Funnel
            </h2>
            <p className="text-xs text-[#57534e]">
              Live telemetry from syndicate white-label web portals, royal concierge app, and Swiggy Gourmet / Zomato Legends.
            </p>
          </div>
          <span className="px-3 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-bold flex items-center gap-1.5 border border-[#a7f3d0] shadow-xs">
            <span className="h-2 w-2 rounded-full bg-[#047857] animate-pulse" />
            Funnel Sync Live
          </span>
        </div>

        {/* 4 High Level Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl bg-white border border-[#e8decb] p-5 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-1 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c]">
                Total Digital Traffic
              </span>
              <span className="material-symbols-outlined text-[#b45309] text-lg">visibility</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-[#1c1917] font-mono">
                28,450
              </span>
              <span className="text-xs text-[#047857] font-bold font-mono">+14.2%</span>
            </div>
            <span className="text-[11px] text-[#78716c] block">Unique digital sessions recorded today across India</span>
          </div>

          <div className="rounded-2xl bg-white border border-[#e8decb] p-5 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-1 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c]">
                Add to Cart Rate
              </span>
              <span className="material-symbols-outlined text-[#b45309] text-lg">add_shopping_cart</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-[#1c1917] font-mono">
                34.8%
              </span>
              <span className="text-xs text-[#047857] font-bold font-mono">+2.8%</span>
            </div>
            <span className="text-[11px] text-[#78716c] block">Benchmark luxury dining average: 21.5%</span>
          </div>

          <div className="rounded-2xl bg-white border border-[#e8decb] p-5 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-1 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c]">
                Checkout Conversion
              </span>
              <span className="material-symbols-outlined text-[#047857] text-lg">check_circle</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-[#047857] font-mono">
                78.4%
              </span>
              <span className="text-xs text-[#047857] font-bold font-mono">+4.1%</span>
            </div>
            <span className="text-[11px] text-[#78716c] block">UPI & Card authorization success rate 99.8%</span>
          </div>

          <div className="rounded-2xl bg-white border border-[#e8decb] p-5 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-1 hover:-translate-y-1 transition-all">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c]">
                Avg Order Dispatch Time
              </span>
              <span className="material-symbols-outlined text-[#b45309] text-lg">timer</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-headline font-bold text-2xl text-[#b45309] font-mono">
                18.4
              </span>
              <span className="text-xs text-[#57534e]">mins</span>
            </div>
            <span className="text-[11px] text-[#78716c] block">KOT kitchen fire to premium chauffeur dispatch</span>
          </div>
        </div>

        {/* Funnel Visualization & Peak Hours Graph Combo */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Peak Rush Hours Graph */}
          <div className="lg:col-span-8 rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-4 flex flex-col justify-between">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#b45309] font-bold">
                  Temporal Demand Telemetry
                </span>
                <h3 className="font-headline font-bold text-base text-[#1c1917]">
                  Peak Rush Hour Traffic: Lunch Rush vs. Dinner Surge
                </h3>
              </div>
              <div className="flex items-center gap-4 text-xs font-bold">
                <div className="flex items-center gap-1.5 text-[#b45309]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#f59e0b]" />
                  <span>Today's Curve</span>
                </div>
                <div className="flex items-center gap-1.5 text-[#78716c]">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d6cebe]" />
                  <span>30D Baseline</span>
                </div>
              </div>
            </div>

            {/* Inline SVG Chart */}
            <div className="relative w-full h-64 pt-2">
              <svg className="w-full h-full overflow-visible" fill="none" preserveAspectRatio="none" viewBox="0 0 650 200">
                <defs>
                  <linearGradient id="curveGlow2" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                <line x1="0" y1="40" x2="650" y2="40" stroke="#f0ece1" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="90" x2="650" y2="90" stroke="#f0ece1" strokeWidth="1" strokeDasharray="4 4" />
                <line x1="0" y1="140" x2="650" y2="140" stroke="#f0ece1" strokeWidth="1" strokeDasharray="4 4" />

                <path
                  d="M 0,170 Q 70,165 130,120 T 260,140 T 390,70 T 520,35 T 650,110"
                  fill="none"
                  stroke="#d6cebe"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />

                <path
                  d="M 0,175 Q 60,170 120,95 T 230,125 T 380,45 T 510,18 T 650,85 L 650,200 L 0,200 Z"
                  fill="url(#curveGlow2)"
                />
                <path
                  d="M 0,175 Q 60,170 120,95 T 230,125 T 380,45 T 510,18 T 650,85"
                  fill="none"
                  stroke="#d97706"
                  strokeWidth="3"
                  strokeLinecap="round"
                />

                <circle cx="120" cy="95" r="5" fill="#f59e0b" className="animate-pulse" />
                <circle cx="120" cy="95" r="9" fill="none" stroke="#f59e0b" strokeWidth="1.5" />

                <circle cx="510" cy="18" r="6" fill="#ea580c" className="animate-pulse" />
                <circle cx="510" cy="18" r="11" fill="none" stroke="#ea580c" strokeWidth="1.5" />
              </svg>

              <div className="absolute left-[16%] top-[34%] -translate-x-1/2 p-2 rounded-xl bg-white border border-[#fde68a] shadow-md pointer-events-none">
                <span className="text-[10px] text-[#1c1917] font-bold block leading-tight">
                  Lunch Apex
                </span>
                <span className="text-[10px] text-[#b45309] font-mono font-bold">
                  12:45 PM • 482 orders/hr
                </span>
              </div>

              <div className="absolute left-[78%] top-[8%] -translate-x-1/2 p-2.5 rounded-xl bg-white border border-[#a7f3d0] shadow-md pointer-events-none">
                <span className="text-[10px] text-[#047857] font-bold block leading-tight">
                  Dinner Mega-Surge
                </span>
                <span className="text-[10px] text-[#1c1917] font-mono font-bold">
                  8:15 PM • 1,180 orders/hr
                </span>
              </div>
            </div>

            <div className="flex justify-between w-full text-[#78716c] text-[10px] font-mono px-2 pt-2 border-t border-[#f0ece1]">
              <span>11:00 AM</span>
              <span>1:00 PM</span>
              <span>3:00 PM</span>
              <span>5:00 PM</span>
              <span>7:00 PM</span>
              <span>9:00 PM</span>
              <span>11:00 PM</span>
            </div>

            {/* Weather Impact Factor */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center justify-between text-xs text-[#57534e]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b45309] text-lg">rainy</span>
                <span>
                  <strong className="text-[#1c1917]">Monsoon Impact Factor:</strong> Heavy precipitation in Mumbai & Delhi shifted +38% orders into private delivery channels during 6PM-8PM.
                </span>
              </div>
              <span className="text-[10px] text-[#92400e] font-bold shrink-0 uppercase tracking-wider bg-[#fef3c7] px-2.5 py-0.5 rounded-full border border-[#fde68a]">
                Correlated
              </span>
            </div>
          </div>

          {/* Delivery Platform Breakdown & Conversion Stages */}
          <div className="lg:col-span-4 rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-4 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#b45309] font-bold">
                Channel Arbitrage
              </span>
              <h3 className="font-headline font-bold text-base text-[#1c1917]">
                Platform Share & Margin Split
              </h3>
            </div>

            {/* Platform Bars */}
            <div className="space-y-3">
              {/* Direct Kizen Concierge */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1c1917] font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Direct Concierge App
                  </span>
                  <span className="text-[#b45309] font-bold font-mono">
                    45% <span className="text-[#78716c] font-normal">(₹4,850 avg)</span>
                  </span>
                </div>
                <div className="w-full bg-[#f0ece1] rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '45%' }} />
                </div>
                <span className="text-[10px] text-[#047857] font-bold block">
                  0% aggregator fee • Highest profit density
                </span>
              </div>

              {/* Swiggy Gourmet */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1c1917] font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#047857]" /> Swiggy Gourmet Priority
                  </span>
                  <span className="text-[#1c1917] font-bold font-mono">
                    28% <span className="text-[#78716c] font-normal">(₹3,400 avg)</span>
                  </span>
                </div>
                <div className="w-full bg-[#f0ece1] rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-[#047857] h-full rounded-full" style={{ width: '28%' }} />
                </div>
                <span className="text-[10px] text-[#78716c] block">
                  Exclusive Michelin-tier restaurant badge
                </span>
              </div>

              {/* Zomato Legends */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1c1917] font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#ea580c]" /> Zomato Legends / Gold
                  </span>
                  <span className="text-[#1c1917] font-bold font-mono">
                    18% <span className="text-[#78716c] font-normal">(₹2,950 avg)</span>
                  </span>
                </div>
                <div className="w-full bg-[#f0ece1] rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-[#ea580c] h-full rounded-full" style={{ width: '18%' }} />
                </div>
              </div>

              {/* DotPe */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#1c1917] font-bold flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-[#78716c]" /> DotPe Luxury Delivery
                  </span>
                  <span className="text-[#1c1917] font-bold font-mono">
                    9% <span className="text-[#78716c] font-normal">(₹3,600 avg)</span>
                  </span>
                </div>
                <div className="w-full bg-[#f0ece1] rounded-full h-2 overflow-hidden shadow-inner">
                  <div className="bg-[#78716c] h-full rounded-full" style={{ width: '9%' }} />
                </div>
              </div>
            </div>

            {/* Order Drop-off Diagnosis */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1 text-xs">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c] block">
                Order Drop-off Diagnosis
              </span>
              <div className="flex items-center justify-between">
                <span className="text-[#57534e]">Cart Abandonment:</span>
                <span className="text-[#1c1917] font-bold font-mono">21.6%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#57534e]">Promo Code Redemption:</span>
                <span className="text-[#047857] font-bold font-mono">3.2% (Healthy low)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Flavor Sentiment & Dietary Demands Radar */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Natural Language Review Telemetry */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-4 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] uppercase tracking-widest text-[#b45309] font-bold">
                Guest Sentiment Synthesis
              </span>
              <h3 className="font-headline font-bold text-base text-[#1c1917]">
                Natural Language Review Telemetry
              </h3>
            </div>
            <div className="text-right">
              <span className="font-headline font-bold text-2xl text-[#047857] font-mono">
                98%
              </span>
              <span className="text-[10px] uppercase tracking-wider text-[#78716c] block font-bold">
                Positive Sentiment
              </span>
            </div>
          </div>

          {/* Highlight Keywords */}
          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-wider text-[#78716c] block font-bold">
              Dominant Guest Feedback Highlights
            </span>
            <div className="flex flex-wrap gap-2">
              <div className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center gap-2 shadow-xs">
                <span className="material-symbols-outlined text-[#b45309] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  thumb_up
                </span>
                <span className="text-xs font-bold text-[#1c1917]">"Melt-in-Mouth Galouti"</span>
                <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[10px] font-bold text-[#92400e] font-mono">
                  1,420 mentions
                </span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center gap-2 shadow-xs">
                <span className="material-symbols-outlined text-[#047857] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  verified
                </span>
                <span className="text-xs font-bold text-[#1c1917]">"Chauffeur Temp Transit"</span>
                <span className="px-2 py-0.5 rounded-full bg-[#ecfdf5] text-[10px] font-bold text-[#047857] font-mono">
                  982 mentions
                </span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center gap-2 shadow-xs">
                <span className="material-symbols-outlined text-[#b45309] text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                  camera
                </span>
                <span className="text-xs font-bold text-[#1c1917]">"24K Vark Presentation"</span>
                <span className="px-2 py-0.5 rounded-full bg-[#fef3c7] text-[10px] font-bold text-[#92400e] font-mono">
                  870 mentions
                </span>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center gap-2 shadow-xs">
                <span className="material-symbols-outlined text-[#78716c] text-base">restaurant</span>
                <span className="text-xs font-bold text-[#1c1917]">"Subtle Kokum Acidity"</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[10px] font-bold text-[#78716c] font-mono border border-[#e8decb]">
                  610 mentions
                </span>
              </div>
            </div>
          </div>

          {/* Sample Review Quote */}
          <div className="p-4 rounded-xl bg-[#faf8f5] border-l-4 border-[#f59e0b] border-t border-r border-b border-[#e8decb] space-y-1.5 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#b45309] font-bold">
                Verified VIP Guest • Mumbai BKC Outpost
              </span>
              <span className="text-[10px] text-[#78716c]">2 hours ago</span>
            </div>
            <p className="text-xs text-[#1c1917] italic leading-relaxed">
              "The Kashmiri saffron and Awadhi galouti glaze balances the smokiness without muting the delicate lamb texture. Even in temperature-controlled transit packaging to Worli Sea Face, the tartlet arrived impeccably warm and crisp."
            </p>
          </div>
        </div>

        {/* Dietary Trends & Demand Radar */}
        <div className="lg:col-span-5 rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-4 flex flex-col justify-between">
          <div className="space-y-1">
            <span className="text-[10px] uppercase tracking-widest text-[#b45309] font-bold">
              Evolutionary Gastronomy
            </span>
            <h3 className="font-headline font-bold text-base text-[#1c1917]">
              Dietary Trends & Demand Radar
            </h3>
          </div>

          <div className="space-y-3">
            {/* Jain Gastronomy */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#047857] text-base">spa</span>
                  <span className="text-xs font-bold text-[#1c1917]">Jain Haute Cuisine Curations</span>
                </div>
                <span className="text-sm font-bold text-[#047857] font-mono">
                  +28% <span className="text-[10px] font-normal text-[#78716c]">YoY</span>
                </span>
              </div>
              <div className="w-full bg-[#f0ece1] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#047857] h-full rounded-full" style={{ width: '78%' }} />
              </div>
              <span className="text-[11px] text-[#57534e] block">
                No root vegetables, raw plantain galouti, and hing-tempered morel biryani surge.
              </span>
            </div>

            {/* Sattvic & Organic */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b91c1c] text-base">energy_savings_leaf</span>
                  <span className="text-xs font-bold text-[#1c1917]">Sattvic A2 Ghee Preparations</span>
                </div>
                <span className="text-sm font-bold text-[#047857] font-mono">
                  +19% <span className="text-[10px] font-normal text-[#78716c]">YoY</span>
                </span>
              </div>
              <div className="w-full bg-[#f0ece1] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#b91c1c] h-full rounded-full" style={{ width: '64%' }} />
              </div>
              <span className="text-[11px] text-[#57534e] block">
                Surge in Bilona ghee confit morels and Himalayan pink salt cold-pressed curations.
              </span>
            </div>

            {/* Zero-Proof */}
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#b45309] text-base">local_bar</span>
                  <span className="text-xs font-bold text-[#1c1917]">Zero-Proof Fermented Botanical Shrubs</span>
                </div>
                <span className="text-sm font-bold text-[#b45309] font-mono">
                  +35% <span className="text-[10px] font-normal text-[#78716c]">Surge</span>
                </span>
              </div>
              <div className="w-full bg-[#f0ece1] rounded-full h-1.5 overflow-hidden">
                <div className="bg-[#f59e0b] h-full rounded-full" style={{ width: '86%' }} />
              </div>
              <span className="text-[11px] text-[#57534e] block">
                Smoked Darjeeling first flush infusions and spiced kokum cumin elixirs commanding ₹850/glass.
              </span>
            </div>
          </div>

          <div className="pt-1">
            <button
              onClick={() => onNavigateTab('menu-studio')}
              className="w-full py-2.5 rounded-xl bg-[#faf8f5] text-[#1c1917] hover:text-[#b45309] hover:bg-[#f4eee2] text-xs font-bold flex items-center justify-center gap-2 transition-all border border-[#e8decb] hover:border-[#b45309]/30 cursor-pointer shadow-xs"
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
