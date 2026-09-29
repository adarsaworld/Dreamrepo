import React, { useState } from 'react';
import { LocationInfo, LocationId } from '../types';
import { LOCATIONS, LIVE_ORDERS } from '../data/mockData';

interface BranchOverviewViewProps {
  currentLocation: LocationId;
  onNavigateTab: (tab: any) => void;
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const BranchOverviewView: React.FC<BranchOverviewViewProps> = ({
  currentLocation,
  onNavigateTab,
  onShowToast,
}) => {
  const [timeframe, setTimeframe] = useState<'today' | 'yesterday' | '7d'>('today');
  const [autonomousPacing, setAutonomousPacing] = useState(true);
  const [selectedBranchForModal, setSelectedBranchForModal] = useState<LocationInfo | null>(null);
  const [isThrottled, setIsThrottled] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [broadcastPromptOpen, setBroadcastPromptOpen] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState('Notice: Evening surge expected across all outposts at 19:30. Prioritize Wagyu restock.');

  // Filtered nodes
  const displayLocations = currentLocation === 'all' 
    ? LOCATIONS 
    : LOCATIONS.filter(l => l.id === currentLocation);

  // Dynamic calculations based on location
  const totalRevenue = displayLocations.reduce((acc, curr) => acc + curr.revenueToday, 0);
  const totalOccupied = displayLocations.reduce((acc, curr) => acc + curr.tables.occupied, 0);
  const totalTables = displayLocations.reduce((acc, curr) => acc + curr.tables.total, 0);
  const occupancyPercent = Math.round((totalOccupied / (totalTables || 1)) * 100);

  const handleExportCSV = () => {
    const rows = [
      ['Node Code', 'Location', 'Gross Revenue USD', 'Tables Occupied', 'Kitchen Latency Min', 'Orders Per Hour'],
      ...displayLocations.map(l => [
        l.code,
        l.name,
        l.revenueToday,
        `${l.tables.occupied}/${l.tables.total}`,
        l.kitchenLatency,
        l.ordersPerHour,
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map(e => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kizen_fleet_telemetry_${timeframe}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('CSV Audit Exported', 'Telemetry snapshot generated and downloaded.');
  };

  const handleGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onShowToast('Global Catalog Synchronized', 'Price books and 86-exclusions pushed to all 6 edge nodes.');
    }, 1200);
  };

  const handleToggleThrottle = () => {
    const nextState = !isThrottled;
    setIsThrottled(nextState);
    if (nextState) {
      onShowToast('15-Min Delivery Throttle Activated', 'Third-party pickup staggered to protect line-cook latency.', 'warning');
    } else {
      onShowToast('Normal Pacing Restored', 'Delivery throttle lifted across all aggregator gates.', 'success');
    }
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    setBroadcastPromptOpen(false);
    onShowToast('Kitchen Broadcast Dispatched', `Memo sent to Roppongi, SoHo, Mayfair & Marina KDS monitors: "${broadcastMsg}"`);
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Top Banner & Timeframe controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full bg-[#292a2b] text-[#ffc174] text-xs uppercase tracking-wider flex items-center gap-1.5 border border-[#343536]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ffc174] animate-ping" />
              Live Telemetry Active
            </span>
            <span className="text-xs text-[#a08e7a] flex items-center gap-1">
              <span className="material-symbols-outlined text-sm">schedule</span>
              Real-Time Sync: 4s ago
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight">
            Multi-Branch Command & Global Performance
          </h1>
          <p className="text-xs sm:text-sm text-[#d8c3ad] max-w-2xl leading-relaxed">
            Autonomous telemetry, aggregate yield pacing, and live kitchen dispatch load across luxury portfolio locations.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-[#1b1c1d] p-1 rounded-xl border border-[#292a2b] flex items-center gap-1">
            <button
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'today'
                  ? 'bg-[#292a2b] text-[#ffc174] shadow-sm'
                  : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeframe('yesterday')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === 'yesterday'
                  ? 'bg-[#292a2b] text-[#ffc174] shadow-sm'
                  : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
              }`}
            >
              Yesterday
            </button>
            <button
              onClick={() => setTimeframe('7d')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === '7d'
                  ? 'bg-[#292a2b] text-[#ffc174] shadow-sm'
                  : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
              }`}
            >
              7D Rolling
            </button>
          </div>

          <button
            onClick={() => onShowToast('Node Filter Ready', 'Displaying all currently operational metropolitan nodes.')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#a08e7a]">tune</span>
            <span>Filter Nodes</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#ffc174]">download</span>
            <span>Audit CSV</span>
          </button>
        </div>
      </div>

      {/* 4 High-Density Bento Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {/* Card 1: Gross Network Yield */}
        <div className="relative overflow-hidden rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-5 shadow-xl group hover:border-[#ffc174]/40 transition-all">
          <div className="absolute -right-8 -top-8 w-28 h-28 rounded-full bg-[#f59e0b]/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#a08e7a] font-bold">
              Gross Network Yield
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#56e5a9]/10 text-[#56e5a9] text-[11px] font-semibold flex items-center gap-1">
              <span className="material-symbols-outlined text-xs">trending_up</span> +14.2%
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight font-mono">
              ${totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-[#a08e7a]">USD</span>
          </div>
          {/* Sparkline curve */}
          <div className="mt-3 flex items-end justify-between h-9 pt-1">
            <svg className="w-full h-8 overflow-visible" fill="none" viewBox="0 0 160 36">
              <defs>
                <linearGradient id="amberGradient2" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#ffc174" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#ffc174" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 32 L20 28 L40 30 L60 21 L80 24 L100 12 L120 18 L140 8 L160 3 L160 36 L0 36 Z"
                fill="url(#amberGradient2)"
              />
              <path
                d="M0 32 L20 28 L40 30 L60 21 L80 24 L100 12 L120 18 L140 8 L160 3"
                stroke="#ffc174"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#d8c3ad] pt-1 border-t border-[#292a2b]">
            <span>Vs. prior cycle: $161,900</span>
            <span className="text-[#56e5a9] font-semibold">99.4% target hit</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <div className="relative overflow-hidden rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-5 shadow-xl group hover:border-[#ffc174]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#a08e7a] font-bold">
              Total Orders
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#f59e0b]/10 text-[#ffc174] text-[11px] font-semibold font-mono">
              3,420 tix
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight font-mono">
              3,420
            </span>
            <span className="text-xs text-[#d8c3ad]">checks</span>
          </div>
          <div className="mt-3">
            <div className="flex items-center justify-between text-[11px] mb-1.5">
              <span className="text-[#ffc174] flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#ffc174]" /> Dine-In (62%)
              </span>
              <span className="text-[#d8c3ad] flex items-center gap-1 font-medium">
                <span className="w-2 h-2 rounded-full bg-[#39393a]" /> Delivery (38%)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-[#343536] overflow-hidden flex">
              <div className="h-full bg-[#f59e0b]" style={{ width: '62%' }} />
              <div className="h-full bg-[#39393a]" style={{ width: '38%' }} />
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#d8c3ad] pt-1 border-t border-[#292a2b]">
            <span>Avg check size: 3.4 covers</span>
            <span className="text-[#ffc174] font-medium">84.2% pos rating</span>
          </div>
        </div>

        {/* Card 3: Live Digital Funnel */}
        <div className="relative overflow-hidden rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-5 shadow-xl group hover:border-[#ffc174]/40 transition-all">
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#56e5a9]/10 blur-xl pointer-events-none" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#a08e7a] font-bold">
              Live Digital Funnel
            </span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#56e5a9] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#56e5a9]" />
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight font-mono">
              12,480
            </span>
            <span className="text-xs text-[#56e5a9] font-semibold">sessions</span>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-[#1f2021] p-1.5 rounded-lg border border-[#292a2b]">
              <div className="text-[10px] text-[#a08e7a]">Deliverect</div>
              <div className="text-xs font-bold text-[#e3e2e3] font-mono">54%</div>
            </div>
            <div className="bg-[#1f2021] p-1.5 rounded-lg border border-[#292a2b]">
              <div className="text-[10px] text-[#a08e7a]">UberEats</div>
              <div className="text-xs font-bold text-[#e3e2e3] font-mono">31%</div>
            </div>
            <div className="bg-[#1f2021] p-1.5 rounded-lg border border-[#292a2b]">
              <div className="text-[10px] text-[#a08e7a]">Direct App</div>
              <div className="text-xs font-bold text-[#ffc174] font-mono">15%</div>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#d8c3ad] pt-1 border-t border-[#292a2b]">
            <span>Cart abandon: 8.1%</span>
            <span className="text-[#56e5a9] font-medium">High conversion</span>
          </div>
        </div>

        {/* Card 4: AOV & Table Velocity */}
        <div className="relative overflow-hidden rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-5 shadow-xl group hover:border-[#ffc174]/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#a08e7a] font-bold">
              AOV & Table Velocity
            </span>
            <span className="px-2 py-0.5 rounded-full bg-[#292a2b] text-[#d8c3ad] text-[11px] font-semibold">
              Efficiency
            </span>
          </div>
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#ffc174] tracking-tight font-mono">
              $89.50
            </span>
            <span className="text-xs text-[#a08e7a]">/ cover</span>
          </div>
          <div className="mt-2.5 flex items-center gap-3">
            <div className="relative w-11 h-11 shrink-0 flex items-center justify-center">
              <svg className="w-11 h-11 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#292a2b" strokeWidth="4" />
                <circle
                  cx="22"
                  cy="22"
                  r="18"
                  fill="none"
                  stroke="#ffc174"
                  strokeWidth="4"
                  strokeDasharray="113"
                  strokeDashoffset="36"
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute text-[11px] font-bold text-[#e3e2e3] font-mono">44m</span>
            </div>
            <div className="flex flex-col">
              <span className="text-xs text-[#e3e2e3] font-medium">Turnover Velocity</span>
              <span className="text-[11px] text-[#a08e7a]">Benchmark: 48 mins</span>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-[#d8c3ad] pt-1 border-t border-[#292a2b]">
            <span>Cellar attach: 34%</span>
            <span className="text-[#56e5a9] font-medium">+4.1m faster</span>
          </div>
        </div>
      </div>

      {/* Active Flagship Hubs & Fleet Nodes Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="font-headline font-bold text-lg text-[#e3e2e3] flex items-center gap-2">
              <span>Active Flagship Hubs & Fleet Nodes</span>
              <span className="h-2 w-2 rounded-full bg-[#56e5a9]" />
            </h2>
            <p className="text-xs text-[#d8c3ad]">
              Real-time floor occupancy, kitchen ticket latency, and multi-channel fulfillment splits
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#a08e7a] uppercase tracking-wider font-semibold">
              Autonomous Pacing
            </span>
            <button
              type="button"
              onClick={() => setAutonomousPacing(!autonomousPacing)}
              className={`w-10 h-5 rounded-full p-0.5 transition-colors relative flex items-center ${
                autonomousPacing ? 'bg-[#f59e0b] justify-end' : 'bg-[#343536] justify-start'
              }`}
            >
              <span className="w-4 h-4 rounded-full bg-[#121314] shadow-md" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {displayLocations.map((loc) => {
            const isHighLatency = loc.kitchenLatency > 15;
            const topBarColor =
              loc.status === 'Peak Rush'
                ? 'bg-[#cc003c]'
                : loc.status === 'Surge Delivery'
                ? 'bg-[#f59e0b]'
                : loc.status === 'Optimal'
                ? 'bg-[#56e5a9]'
                : 'bg-[#a08e7a]';

            return (
              <div
                key={loc.id}
                className="rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-5 shadow-xl flex flex-col justify-between relative overflow-hidden group hover:border-[#ffc174]/40 transition-all"
              >
                {/* Status indicator top bar */}
                <div className={`absolute top-0 left-0 right-0 h-1 ${topBarColor}`} />

                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a]">
                        {loc.region}
                      </span>
                      <h3 className="font-headline font-bold text-base text-[#e3e2e3] mt-0.5">
                        {loc.name}
                      </h3>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        loc.status === 'Peak Rush'
                          ? 'bg-[#cc003c]/20 text-[#ffb3b6]'
                          : loc.status === 'Surge Delivery'
                          ? 'bg-[#f59e0b]/20 text-[#ffc174]'
                          : loc.status === 'Optimal'
                          ? 'bg-[#56e5a9]/20 text-[#56e5a9]'
                          : 'bg-[#343536] text-[#d8c3ad]'
                      }`}
                    >
                      {loc.status}
                    </span>
                  </div>

                  <div className="mt-3.5 flex items-baseline justify-between">
                    <span className="font-headline font-bold text-xl text-[#ffc174] font-mono">
                      ${loc.revenueToday.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#d8c3ad] font-mono">
                      {loc.ordersPerHour} orders/hr
                    </span>
                  </div>

                  <div className="mt-3.5 space-y-2.5">
                    <div>
                      <div className="flex justify-between text-xs mb-1 text-[#d8c3ad]">
                        <span>Floor Occupancy</span>
                        <span className="text-[#e3e2e3] font-semibold font-mono">
                          {loc.tables.occupied} / {loc.tables.total} Tables (
                          {Math.round((loc.tables.occupied / loc.tables.total) * 100)}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#343536] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            loc.tables.occupied / loc.tables.total > 0.9
                              ? 'bg-[#cc003c]'
                              : 'bg-[#f59e0b]'
                          }`}
                          style={{
                            width: `${(loc.tables.occupied / loc.tables.total) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-xs mb-1 text-[#d8c3ad]">
                        <span>Channel Distribution</span>
                        <span className="font-mono text-[11px]">
                          {loc.channelSplit.dineIn}% Dine-in / {loc.channelSplit.delivery}% Delivery
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#343536] overflow-hidden flex">
                        <div
                          className="bg-[#f59e0b] h-full"
                          style={{ width: `${loc.channelSplit.dineIn}%` }}
                        />
                        <div
                          className="bg-[#39393a] h-full"
                          style={{ width: `${loc.channelSplit.delivery}%` }}
                        />
                      </div>
                    </div>

                    <div className="pt-1 flex items-center justify-between bg-[#1f2021] p-2 rounded-lg border border-[#292a2b]">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`material-symbols-outlined text-base ${
                            isHighLatency ? 'text-[#ffb3b6]' : 'text-[#56e5a9]'
                          }`}
                        >
                          skillet
                        </span>
                        <span className="text-xs text-[#d8c3ad]">Kitchen Latency</span>
                      </div>
                      <span
                        className={`text-xs font-bold font-mono ${
                          isHighLatency ? 'text-[#ffb3b6]' : 'text-[#56e5a9]'
                        }`}
                      >
                        {loc.kitchenLatency} min prep
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedBranchForModal(loc)}
                  className="mt-4 w-full py-2 px-3 rounded-lg bg-[#292a2b] hover:bg-[#ffc174] hover:text-[#472a00] text-[#e3e2e3] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>Branch Cockpit</span>
                  <span className="material-symbols-outlined text-base">arrow_forward</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hourly Customer Surge Dynamics & Live Order Pulse (2-Column Grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5 items-start">
        {/* Left: Hourly Customer Surge Dynamics */}
        <div className="xl:col-span-8 rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-6 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-headline font-bold text-base text-[#e3e2e3]">
                Hourly Customer Surge Dynamics
              </h2>
              <p className="text-xs text-[#d8c3ad]">
                In-House Dining Covers vs. Aggregator Fulfillment volume (24h Window)
              </p>
            </div>
            <div className="flex items-center gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-[#e3e2e3]">
                <span className="w-3 h-3 rounded-sm bg-[#f59e0b]" /> In-House Dining
              </span>
              <span className="flex items-center gap-1.5 text-[#d8c3ad]">
                <span className="w-3 h-3 rounded-sm bg-[#39393a]" /> Delivery Network
              </span>
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="pt-2">
            <div className="h-60 w-full flex items-end justify-between gap-1.5 px-2 relative border-b border-[#292a2b]">
              {/* Guidelines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
                <div className="w-full h-px bg-[#e3e2e3]" />
                <div className="w-full h-px bg-[#e3e2e3]" />
                <div className="w-full h-px bg-[#e3e2e3]" />
                <div className="w-full h-px bg-[#e3e2e3]" />
              </div>

              {[
                { time: '10am', dine: 18, del: 22 },
                { time: '11am', dine: 48, del: 40 },
                { time: '12pm', dine: 88, del: 74, peak: 'Lunch Peak', highlight: true },
                { time: '1pm', dine: 84, del: 80 },
                { time: '2pm', dine: 42, del: 45 },
                { time: '3pm', dine: 25, del: 30 },
                { time: '4pm', dine: 30, del: 38 },
                { time: '5pm', dine: 52, del: 58 },
                { time: '6pm', dine: 75, del: 82 },
                { time: '7pm', dine: 98, del: 90, peak: 'Dinner Rush', rush: true },
                { time: '8pm', dine: 94, del: 95 },
                { time: '9pm', dine: 82, del: 78 },
                { time: '10pm', dine: 60, del: 62 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative">
                  {bar.peak && (
                    <span
                      className={`absolute -top-7 px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap opacity-90 group-hover:opacity-100 transition-opacity ${
                        bar.rush
                          ? 'bg-[#cc003c]/30 text-[#ffb3b6] border border-[#cc003c]/40'
                          : 'bg-[#f59e0b]/30 text-[#ffc174] border border-[#f59e0b]/40'
                      }`}
                    >
                      {bar.peak}
                    </span>
                  )}
                  <div className="w-full flex items-end justify-center gap-1 h-full">
                    <div
                      className={`w-2.5 rounded-t transition-all group-hover:brightness-125 ${
                        bar.highlight
                          ? 'bg-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : bar.rush
                          ? 'bg-[#f59e0b] shadow-[0_0_12px_rgba(245,158,11,0.7)]'
                          : 'bg-[#f59e0b]'
                      }`}
                      style={{ height: `${bar.dine}%` }}
                    />
                    <div
                      className="w-2.5 rounded-t bg-[#39393a] transition-all group-hover:brightness-125"
                      style={{ height: `${bar.del}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-1 ${
                      bar.rush
                        ? 'text-[#ffb3b6] font-bold'
                        : bar.highlight
                        ? 'text-[#ffc174] font-bold'
                        : 'text-[#a08e7a]'
                    }`}
                  >
                    {bar.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <div className="p-3 rounded-lg bg-[#1f2021] border border-[#292a2b] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Peak Service Window</span>
                <span className="text-sm font-bold text-[#e3e2e3] font-mono">19:30 - 20:45</span>
              </div>
              <span className="material-symbols-outlined text-[#ffc174] text-xl">wb_twilight</span>
            </div>
            <div className="p-3 rounded-lg bg-[#1f2021] border border-[#292a2b] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Delivery Throttling</span>
                <span
                  className={`text-sm font-bold font-mono ${
                    isThrottled ? 'text-[#ffb3b6]' : 'text-[#56e5a9]'
                  }`}
                >
                  {isThrottled ? 'Surge Active' : 'Normal pacing'}
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-xl ${
                  isThrottled ? 'text-[#ffb3b6]' : 'text-[#56e5a9]'
                }`}
              >
                speed
              </span>
            </div>
            <div className="p-3 rounded-lg bg-[#1f2021] border border-[#292a2b] flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Avg Ticket Lead</span>
                <span className="text-sm font-bold text-[#e3e2e3] font-mono">14.6 mins</span>
              </div>
              <span className="material-symbols-outlined text-[#a08e7a] text-xl">timer</span>
            </div>
          </div>
        </div>

        {/* Right: Live Order Pulse */}
        <div className="xl:col-span-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-1 border-b border-[#292a2b]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc174] text-xl">sensors</span>
              <h2 className="font-headline font-bold text-base text-[#e3e2e3]">Live Order Pulse</h2>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#292a2b] text-[#56e5a9] text-[10px] font-semibold flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#56e5a9] animate-pulse" />
              Auto-updating
            </span>
          </div>

          <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
            {LIVE_ORDERS.map((ord) => (
              <div
                key={ord.id}
                className="p-3 rounded-xl bg-[#1f2021] border border-[#292a2b] flex items-center justify-between gap-3 hover:border-[#ffc174]/40 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                      ord.type === 'dine-in'
                        ? 'bg-[#f59e0b]/20 text-[#ffc174]'
                        : 'bg-[#292a2b] text-[#d8c3ad]'
                    }`}
                  >
                    {ord.type === 'dine-in' ? (
                      'T12'
                    ) : (
                      <span className="material-symbols-outlined text-base">moped</span>
                    )}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-semibold text-[#e3e2e3] truncate">
                        {ord.tableOrAddress}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          ord.type === 'dine-in'
                            ? 'bg-[#f59e0b]/20 text-[#ffc174]'
                            : 'bg-[#56e5a9]/20 text-[#56e5a9]'
                        }`}
                      >
                        {ord.channel}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#a08e7a] truncate">
                      {ord.outpost} • {ord.itemsSummary}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#ffc174] font-mono">
                    ${ord.totalAmount}
                  </div>
                  <span
                    className={`text-[10px] font-semibold ${
                      ord.statusColor === 'tertiary'
                        ? 'text-[#56e5a9]'
                        : ord.statusColor === 'secondary'
                        ? 'text-[#ffb3b6]'
                        : 'text-[#a08e7a]'
                    }`}
                  >
                    {ord.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-1">
            <button
              onClick={() => onNavigateTab('menu-studio')}
              className="w-full py-2 px-3 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#ffc174] text-xs font-semibold transition-all flex items-center justify-center gap-1 border border-[#343536] cursor-pointer"
            >
              <span>View Kitchen Display System (KDS) Stream</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Override & Fleet Operations Hub */}
      <div className="rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 pb-1 border-b border-[#292a2b]">
          <div>
            <h2 className="font-headline font-bold text-base text-[#e3e2e3] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc174] text-xl">bolt</span>
              Executive Override & Fleet Operations Hub
            </h2>
            <p className="text-xs text-[#d8c3ad]">
              Immediate syndicate-wide operational interventions with audit trail logging
            </p>
          </div>
          <span className="text-xs text-[#a08e7a] font-mono">Tier 1 Authorization Granted</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Action 1: Global Catalog Sync */}
          <div className="p-4 rounded-xl bg-[#1f2021] border border-[#292a2b] flex flex-col justify-between space-y-3 hover:border-[#ffc174]/40 transition-all">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#e3e2e3]">Global Catalog Sync</span>
                <span className="material-symbols-outlined text-[#ffc174] text-lg">sync_saved_locally</span>
              </div>
              <p className="text-xs text-[#d8c3ad] leading-relaxed">
                Broadcast revised prices, vintage allocation locks, and sold-out 86-item exclusions across POS terminals & aggregators.
              </p>
            </div>
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleGlobalSync}
              className="w-full py-2 px-3 rounded-lg bg-[#292a2b] hover:bg-[#ffc174] hover:text-[#472a00] text-[#e3e2e3] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm border border-[#343536] cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-base ${isSyncing ? 'animate-spin' : ''}`}>
                cloud_sync
              </span>
              <span>{isSyncing ? 'Syncing 6 Nodes...' : 'Deploy Menu Push (6 Nodes)'}</span>
            </button>
          </div>

          {/* Action 2: 15-Min Delivery Throttle */}
          <div className="p-4 rounded-xl bg-[#1f2021] border border-[#292a2b] flex flex-col justify-between space-y-3 hover:border-[#ffc174]/40 transition-all">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#e3e2e3]">15-Min Delivery Throttle</span>
                <span className="material-symbols-outlined text-[#cc003c] text-lg">hourglass_top</span>
              </div>
              <p className="text-xs text-[#d8c3ad] leading-relaxed">
                Temporarily stagger third-party pickup windows to alleviate line-cook pressure during peak dining room courses.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleThrottle}
              className={`w-full py-2 px-3 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm border cursor-pointer ${
                isThrottled
                  ? 'bg-[#cc003c] text-white border-[#cc003c]'
                  : 'bg-[#cc003c]/20 hover:bg-[#cc003c] text-[#ffb3b6] hover:text-white border-[#cc003c]/30'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isThrottled ? 'pause_circle_filled' : 'pause_circle'}
              </span>
              <span>{isThrottled ? 'Throttle Active (Paced)' : 'Activate Surge Throttle'}</span>
            </button>
          </div>

          {/* Action 3: Kitchen Broadcast Audio */}
          <div className="p-4 rounded-xl bg-[#1f2021] border border-[#292a2b] flex flex-col justify-between space-y-3 hover:border-[#ffc174]/40 transition-all">
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#e3e2e3]">Kitchen Broadcast Audio</span>
                <span className="material-symbols-outlined text-[#56e5a9] text-lg">campaign</span>
              </div>
              <p className="text-xs text-[#d8c3ad] leading-relaxed">
                Dispatch an audible priority chime and custom message directly onto head chef station display screens.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBroadcastPromptOpen(true)}
              className="w-full py-2 px-3 rounded-lg bg-[#292a2b] hover:bg-[#56e5a9] hover:text-[#003824] text-[#e3e2e3] text-xs font-semibold transition-all flex items-center justify-center gap-1.5 shadow-sm border border-[#343536] cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">volume_up</span>
              <span>Broadcast Message</span>
            </button>
          </div>
        </div>
      </div>

      {/* Branch Cockpit Modal */}
      {selectedBranchForModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#1b1c1d] border border-[#292a2b] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#292a2b]">
              <div>
                <span className="text-[10px] text-[#ffc174] uppercase tracking-widest font-bold">
                  Branch Node Cockpit // {selectedBranchForModal.code}
                </span>
                <h3 className="font-headline font-bold text-xl text-[#e3e2e3]">
                  {selectedBranchForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBranchForModal(null)}
                className="p-1.5 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3] hover:bg-[#292a2b] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-[#1f2021] border border-[#292a2b] rounded-xl text-center">
                <div className="text-[10px] text-[#a08e7a] uppercase font-bold">Gross Today</div>
                <div className="text-base font-bold text-[#ffc174] mt-1 font-mono">
                  ${selectedBranchForModal.revenueToday.toLocaleString()}
                </div>
              </div>
              <div className="p-3 bg-[#1f2021] border border-[#292a2b] rounded-xl text-center">
                <div className="text-[10px] text-[#a08e7a] uppercase font-bold">Active Covers</div>
                <div className="text-base font-bold text-[#e3e2e3] mt-1 font-mono">
                  {selectedBranchForModal.tables.occupied} / {selectedBranchForModal.tables.total}
                </div>
              </div>
              <div className="p-3 bg-[#1f2021] border border-[#292a2b] rounded-xl text-center">
                <div className="text-[10px] text-[#a08e7a] uppercase font-bold">Prep Duration</div>
                <div className="text-base font-bold text-[#56e5a9] mt-1 font-mono">
                  {selectedBranchForModal.kitchenLatency} min
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-semibold text-[#e3e2e3] uppercase tracking-wider block">
                Immediate Operations Protocol
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onShowToast(
                      'Priority Protocol Engaged',
                      `All new high-value VIP arrivals for ${selectedBranchForModal.name} routed to Private Tatami Suite.`
                    );
                    setSelectedBranchForModal(null);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#1f2021] hover:bg-[#292a2b] text-[#e3e2e3] text-left text-xs font-medium flex items-center justify-between transition-colors border border-[#292a2b]"
                >
                  <span>Route All New VIPs to Private Tatami Suite</span>
                  <span className="material-symbols-outlined text-sm text-[#ffc174]">
                    chevron_right
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onShowToast(
                      'Surge Governor Engaged',
                      `Restricted delivery intake by 30% for the next hour at ${selectedBranchForModal.name}.`
                    );
                    setSelectedBranchForModal(null);
                  }}
                  className="w-full py-2.5 px-3.5 rounded-xl bg-[#1f2021] hover:bg-[#292a2b] text-[#e3e2e3] text-left text-xs font-medium flex items-center justify-between transition-colors border border-[#292a2b]"
                >
                  <span>Restrict Delivery Intake by 30% for Next Hour</span>
                  <span className="material-symbols-outlined text-sm text-[#ffc174]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#292a2b]">
              <button
                type="button"
                onClick={() => setSelectedBranchForModal(null)}
                className="px-4 py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold transition-colors"
              >
                Close Window
              </button>
              <button
                type="button"
                onClick={() => {
                  onShowToast(
                    'Full Station POS Launched',
                    `Remote POS session initiated for ${selectedBranchForModal.name}.`
                  );
                  setSelectedBranchForModal(null);
                }}
                className="px-4 py-2 rounded-lg bg-[#ffc174] text-[#472a00] text-xs font-bold shadow-md hover:brightness-110 transition-all"
              >
                Open Full Station POS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen Broadcast Prompt Modal */}
      {broadcastPromptOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-2xl bg-[#1b1c1d] border border-[#292a2b] max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#56e5a9] text-xl">campaign</span>
                <h3 className="font-headline font-bold text-base text-[#e3e2e3]">
                  Kitchen Broadcast Memo
                </h3>
              </div>
              <button
                onClick={() => setBroadcastPromptOpen(false)}
                className="p-1 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="text-xs text-[#d8c3ad]">
              This will trigger an audible double-chime and push text directly to line-cook and sous chef monitors across all outposts.
            </p>
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <textarea
                rows={3}
                required
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="w-full bg-[#292a2b] text-[#e3e2e3] p-3 rounded-lg text-xs leading-relaxed border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setBroadcastPromptOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-[#292a2b] text-xs font-semibold text-[#e3e2e3]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-[#56e5a9] text-[#003824] text-xs font-bold hover:brightness-110 transition-all flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Transmit Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
