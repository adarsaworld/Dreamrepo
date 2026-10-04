import React, { useState } from 'react';
import { LocationInfo, LocationId } from '../types';
import { LOCATIONS, LIVE_ORDERS } from '../data/mockData';
import { Tooltip } from './Tooltip';
import { DoubleDeleteConfirmModal } from './DoubleDeleteConfirmModal';

interface TableHold {
  id: string;
  tableNumber: string;
  outpost: string;
  reason: string;
  heldBy: string;
  duration: string;
}

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
  const [broadcastMsg, setBroadcastMsg] = useState('Notice: Evening surge expected across all outposts at 19:30. Prioritize Sikandari Raan & Galouti restock.');

  // Table Holds and Double Verification Delete
  const [tableHolds, setTableHolds] = useState<TableHold[]>([
    {
      id: 'hold-1',
      tableNumber: 'Table 14 (Royal Alcove)',
      outpost: 'Mumbai BKC Flagship',
      reason: 'Held for Chief Executive Delegation Dinner',
      heldBy: 'General Manager R. Deshmukh',
      duration: 'Until 21:00 IST',
    },
    {
      id: 'hold-2',
      tableNumber: 'Table 08 (Durbar Salon)',
      outpost: 'New Delhi Lutyens',
      reason: 'Sommelier Degustation Flight Preparation',
      heldBy: 'Sommelier K. Bakshi',
      duration: 'Until 20:30 IST',
    },
    {
      id: 'hold-3',
      tableNumber: 'Table 22 (Terrace View)',
      outpost: 'Bengaluru Indiranagar',
      reason: 'Monsoon Windbreak Weather Safety Hold',
      heldBy: 'Duty Captain A. Nair',
      duration: 'Until 22:00 IST',
    },
  ]);
  const [deleteHoldTarget, setDeleteHoldTarget] = useState<TableHold | null>(null);

  const handleConfirmReleaseHold = () => {
    if (!deleteHoldTarget) return;
    setTableHolds((prev) => prev.filter((h) => h.id !== deleteHoldTarget.id));
    onShowToast(
      'Table Hold Released',
      `Released ${deleteHoldTarget.tableNumber} at ${deleteHoldTarget.outpost}. Returned to live floor dispatch.`,
      'success'
    );
    setDeleteHoldTarget(null);
  };

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
      ['Node Code', 'Location', 'Gross Revenue (₹)', 'Tables Occupied', 'Kitchen Latency Min', 'Orders Per Hour'],
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
    onShowToast('CSV Audit Exported', 'Telemetry snapshot generated and downloaded in INR format.');
  };

  const handleGlobalSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onShowToast('Global Catalog Synchronized', 'Price books and 86-exclusions pushed to all 6 metro edge nodes (Mumbai, Delhi, Bengaluru, Hyderabad, Kolkata, Chennai).');
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
    onShowToast('Kitchen Broadcast Dispatched', `Memo sent to Mumbai BKC, New Delhi, Bengaluru, Hyderabad, Kolkata & Chennai KDS monitors: "${broadcastMsg}"`);
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Top Banner & Timeframe controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-[#fef3c7] to-[#fde68a] text-[#92400e] text-xs uppercase tracking-wider flex items-center gap-1.5 border border-[#fde68a] font-bold shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#d97706] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#d97706]" />
              </span>
              Live Telemetry Active
            </span>
            <span className="text-xs text-[#065f46] flex items-center gap-1 font-semibold bg-[#ecfdf5] px-3 py-1 rounded-full border border-[#a7f3d0]">
              <span className="material-symbols-outlined text-sm text-[#047857]">cloud_done</span>
              Real-Time Node Mesh: 6 Cities
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
            Multi-Branch Command & National Performance
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-2xl leading-relaxed">
            Autonomous telemetry, aggregate yield pacing, and live kitchen dispatch load across luxury metropolitan hubs in India.
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="bg-white p-1 rounded-2xl border border-[#e8decb] flex items-center gap-1 shadow-xs">
            <Tooltip content="Show metrics for today's active service" position="bottom">
              <button
                onClick={() => setTimeframe('today')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeframe === 'today'
                    ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-xs'
                    : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
                }`}
              >
                Today
              </button>
            </Tooltip>
            <Tooltip content="Compare against yesterday's consolidated gross" position="bottom">
              <button
                onClick={() => setTimeframe('yesterday')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeframe === 'yesterday'
                    ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-xs'
                    : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
                }`}
              >
                Yesterday
              </button>
            </Tooltip>
            <Tooltip content="Rolling 7-day average metrics across all outposts" position="bottom">
              <button
                onClick={() => setTimeframe('7d')}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  timeframe === '7d'
                    ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-xs'
                    : 'text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5]'
                }`}
              >
                7D Rolling
              </button>
            </Tooltip>
          </div>

          <Tooltip content="Filter specific metro outpost telemetry" subcontent="6 Cities" position="bottom">
            <button
              onClick={() => onShowToast('Node Filter Ready', 'Displaying operational metrics across Mumbai, Delhi, Bengaluru, Hyderabad, Kolkata & Chennai.')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#b45309]">tune</span>
              <span>Filter Nodes</span>
            </button>
          </Tooltip>

          <Tooltip content="Export comprehensive CSV audit package in INR" subcontent="6 Metros" position="bottom">
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#b45309]">download</span>
              <span>Audit CSV (INR)</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* 4 HIGH-DENSITY BENTO STAT CARDS - Redesigned, Eye-Catching & Animated */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
        {/* Card 1: Gross Network Yield */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e8decb] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.08)] group hover:-translate-y-2 hover:shadow-[0_20px_35px_-8px_rgba(217,119,6,0.22)] hover:border-[#f59e0b] transition-all duration-300 cursor-pointer">
          {/* Ambient Glow Blob */}
          <div className="absolute -right-8 -top-8 w-32 h-32 rounded-full bg-gradient-to-br from-[#f59e0b]/25 via-[#ea580c]/15 to-transparent blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500" />
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#78716c] font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] shadow-sm animate-pulse-glow" />
              Gross Network Yield
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] text-[11px] font-bold flex items-center gap-1 shadow-xs group-hover:scale-105 transition-transform">
              <span className="material-symbols-outlined text-xs">trending_up</span> +14.2%
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#b45309] tracking-tight font-mono group-hover:text-[#ea580c] transition-colors">
              ₹{totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs font-bold text-[#78716c]">INR</span>
          </div>

          {/* Sparkline curve with animated golden fill */}
          <div className="mt-3 flex items-end justify-between h-10 pt-1">
            <svg className="w-full h-9 overflow-visible" fill="none" viewBox="0 0 160 36">
              <defs>
                <linearGradient id="saffronGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M0 32 L20 28 L40 30 L60 21 L80 24 L100 12 L120 18 L140 8 L160 3 L160 36 L0 36 Z"
                fill="url(#saffronGradient)"
              />
              <path
                d="M0 32 L20 28 L40 30 L60 21 L80 24 L100 12 L120 18 L140 8 L160 3"
                stroke="#d97706"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="group-hover:stroke-[#ea580c] transition-colors"
              />
              <circle cx="160" cy="3" r="3.5" fill="#ea580c" className="animate-ping opacity-75" />
              <circle cx="160" cy="3" r="2.5" fill="#ea580c" />
            </svg>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-[#57534e] pt-2 border-t border-[#f0ece1]">
            <span>Prior cycle: ₹16,19,000</span>
            <span className="text-[#047857] font-bold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[#047857]" /> 99.4% target hit
            </span>
          </div>
        </div>

        {/* Card 2: Total Orders & Checks */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e8decb] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.08)] group hover:-translate-y-2 hover:shadow-[0_20px_35px_-8px_rgba(217,119,6,0.22)] hover:border-[#f59e0b] transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ea580c] to-[#f59e0b] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#78716c] font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ea580c] shadow-sm animate-pulse" />
              Total Orders
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#fef3c7] text-[#92400e] border border-[#fde68a] text-[11px] font-bold font-mono shadow-xs group-hover:scale-105 transition-transform">
              3,420 tix
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight font-mono">
              3,420
            </span>
            <span className="text-xs text-[#57534e] font-semibold">checks cleared</span>
          </div>

          <div className="mt-3.5 space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#b45309] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#f59e0b]" /> Dine-In (62%)
              </span>
              <span className="text-[#ea580c] font-bold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" /> Delivery (38%)
              </span>
            </div>
            <div className="w-full h-2.5 rounded-full bg-[#f5efe4] overflow-hidden flex shadow-inner">
              <div className="h-full bg-gradient-to-r from-[#f59e0b] to-[#d97706] transition-all duration-700" style={{ width: '62%' }} />
              <div className="h-full bg-gradient-to-r from-[#ea580c] to-[#c2410c] transition-all duration-700" style={{ width: '38%' }} />
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-[#57534e] pt-2 border-t border-[#f0ece1]">
            <span>Avg ticket: 3.4 covers</span>
            <span className="text-[#b45309] font-bold">84.2% 5★ rating</span>
          </div>
        </div>

        {/* Card 3: Live Digital Funnel with Animated Radar */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e8decb] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.08)] group hover:-translate-y-2 hover:shadow-[0_20px_35px_-8px_rgba(217,119,6,0.22)] hover:border-[#10b981] transition-all duration-300 cursor-pointer">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#10b981] to-[#047857] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-[#047857]/10 blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#78716c] font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#047857] shadow-sm animate-ping" />
              Live Digital Funnel
            </span>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#047857] opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[#047857]" />
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight font-mono">
              12,480
            </span>
            <span className="text-xs text-[#047857] font-bold">sessions active</span>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-1.5 text-center">
            <div className="bg-[#faf8f5] p-2 rounded-xl border border-[#e8decb] hover:border-[#b45309]/50 transition-colors group-hover:bg-white">
              <span className="text-[10px] text-[#78716c] block font-medium">Cart Conv</span>
              <span className="text-xs font-bold text-[#b45309] font-mono">4.8%</span>
            </div>
            <div className="bg-[#faf8f5] p-2 rounded-xl border border-[#e8decb] hover:border-[#047857]/50 transition-colors group-hover:bg-white">
              <span className="text-[10px] text-[#78716c] block font-medium">Direct App</span>
              <span className="text-xs font-bold text-[#047857] font-mono">68%</span>
            </div>
            <div className="bg-[#faf8f5] p-2 rounded-xl border border-[#e8decb] hover:border-[#ea580c]/50 transition-colors group-hover:bg-white">
              <span className="text-[10px] text-[#78716c] block font-medium">Delivery</span>
              <span className="text-xs font-bold text-[#ea580c] font-mono">32%</span>
            </div>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-[#57534e] pt-2 border-t border-[#f0ece1]">
            <span>Checkout latency: 180ms</span>
            <span className="text-[#047857] font-bold">0 Dropouts</span>
          </div>
        </div>

        {/* Card 4: Line-Cook Speed & Autonomous Pacing */}
        <div className="relative overflow-hidden rounded-2xl bg-white border border-[#e8decb] p-5 sm:p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.08)] group hover:-translate-y-2 hover:shadow-[0_20px_35px_-8px_rgba(217,119,6,0.22)] hover:border-[#f59e0b] transition-all duration-300">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#f59e0b] to-[#d97706] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-[#78716c] font-bold flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-sm" />
              Line-Cook Latency
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] text-[11px] font-bold">
              Optimal (14.2m)
            </span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight font-mono">
              14.2
            </span>
            <span className="text-xs text-[#57534e] font-semibold">min prep avg</span>
          </div>

          <div className="mt-3 p-2.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center justify-between hover:bg-white transition-colors">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b45309] text-base animate-pulse">
                auto_mode
              </span>
              <span className="text-xs font-bold text-[#1c1917]">Auto Surge Pacer</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !autonomousPacing;
                setAutonomousPacing(next);
                onShowToast(
                  next ? 'Autonomous Pacer Engaged' : 'Autonomous Pacer Paused',
                  next ? 'KDS pacing throttles line cook intake automatically.' : 'Manual kitchen queuing activated.'
                );
              }}
              className={`w-11 h-6 rounded-full p-0.5 transition-colors relative flex items-center cursor-pointer ${
                autonomousPacing ? 'bg-[#d97706] justify-end' : 'bg-[#d6cebe] justify-start'
              }`}
            >
              <span className="w-5 h-5 rounded-full bg-white shadow-md transition-transform" />
            </button>
          </div>

          <div className="mt-2.5 flex items-center justify-between text-xs text-[#57534e] pt-2 border-t border-[#f0ece1]">
            <span>Active KDS: 18 displays</span>
            <span className="text-[#047857] font-bold">0 bottlenecks</span>
          </div>
        </div>
      </div>

      {/* METROPOLITAN FLEET NODE CARDS - Completely Redesigned, Eye-Catching & Animated */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b45309] text-xl animate-pulse-glow">hub</span>
              <h2 className="font-headline font-bold text-lg text-[#1c1917]">
                Metropolitan Fleet Outposts ({displayLocations.length} Active Nodes)
              </h2>
            </div>
            <p className="text-xs text-[#57534e]">
              Real-time branch telemetry across Mumbai, Delhi, Bengaluru, Hyderabad, Kolkata & Chennai
            </p>
          </div>
          <span className="text-xs font-bold text-[#b45309] bg-[#fef3c7] px-3.5 py-1.5 rounded-full border border-[#fde68a] self-start sm:self-auto shadow-xs">
            Consolidated Yield: ₹{totalRevenue.toLocaleString('en-IN')} INR
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayLocations.map((loc) => {
            const isHighLatency = loc.kitchenLatency > 15;
            const statusConfig = {
              'Peak Rush': {
                badgeBg: 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]',
                accentBar: 'from-[#dc2626] to-[#ea580c]',
                dotColor: 'bg-[#dc2626]',
              },
              'Surge Delivery': {
                badgeBg: 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]',
                accentBar: 'from-[#f59e0b] to-[#ea580c]',
                dotColor: 'bg-[#f59e0b]',
              },
              'Optimal': {
                badgeBg: 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]',
                accentBar: 'from-[#10b981] to-[#047857]',
                dotColor: 'bg-[#10b981]',
              },
              'Evening Prep': {
                badgeBg: 'bg-[#faf8f5] text-[#57534e] border-[#e8decb]',
                accentBar: 'from-[#b45309] to-[#78716c]',
                dotColor: 'bg-[#78716c]',
              },
              'Staged': {
                badgeBg: 'bg-[#faf8f5] text-[#57534e] border-[#e8decb]',
                accentBar: 'from-[#78716c] to-[#a8a29e]',
                dotColor: 'bg-[#78716c]',
              },
            }[loc.status] || {
              badgeBg: 'bg-[#faf8f5] text-[#57534e] border-[#e8decb]',
              accentBar: 'from-[#f59e0b] to-[#d97706]',
              dotColor: 'bg-[#f59e0b]',
            };

            const occPercentage = Math.round((loc.tables.occupied / loc.tables.total) * 100);

            return (
              <div
                key={loc.id}
                className="rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] flex flex-col justify-between relative overflow-hidden group hover:-translate-y-2 hover:shadow-[0_20px_35px_-5px_rgba(217,119,6,0.2)] hover:border-[#d97706]/70 transition-all duration-300"
              >
                {/* Dynamic top gradient bar with shimmer */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${statusConfig.accentBar} group-hover:h-2 transition-all duration-300`} />

                <div>
                  {/* Card Header with City Flagship Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md bg-[#faf8f5] text-[#b45309] border border-[#e8decb] font-mono group-hover:bg-[#fef3c7] transition-colors">
                          {loc.code}
                        </span>
                        <span className="text-[10px] uppercase text-[#78716c] font-semibold">
                          {loc.region}
                        </span>
                      </div>
                      <h3 className="font-headline font-bold text-lg text-[#1c1917] mt-1.5 group-hover:text-[#b45309] transition-colors">
                        {loc.name}
                      </h3>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border flex items-center gap-1.5 shrink-0 shadow-xs ${statusConfig.badgeBg}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dotColor} animate-pulse`} />
                      {loc.status}
                    </span>
                  </div>

                  {/* Revenue & Speed Display Card */}
                  <div className="mt-4 p-3.5 rounded-xl bg-gradient-to-r from-[#faf8f5] via-[#fbf9f4] to-[#f5f0e6] border border-[#e8decb] flex items-baseline justify-between group-hover:border-[#f59e0b]/40 transition-colors">
                    <div>
                      <span className="text-[10px] uppercase text-[#78716c] font-bold block">
                        Today's Gross Yield
                      </span>
                      <span className="font-headline font-bold text-2xl text-[#b45309] font-mono">
                        ₹{loc.revenueToday.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase text-[#78716c] font-bold block">
                        Speed
                      </span>
                      <span className="text-xs font-bold text-[#1c1917] font-mono">
                        {loc.ordersPerHour} ord/hr
                      </span>
                    </div>
                  </div>

                  {/* Occupancy & Latency Metrics */}
                  <div className="mt-4 space-y-3">
                    {/* Table Occupancy with Animated Gradient Fill */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 text-[#57534e]">
                        <span className="font-medium flex items-center gap-1">
                          <span className="material-symbols-outlined text-xs text-[#b45309]">table_restaurant</span>
                          Dining Hall Occupancy
                        </span>
                        <span className="text-[#1c1917] font-bold font-mono">
                          {loc.tables.occupied} / {loc.tables.total} ({occPercentage}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#f0ece1] overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            occPercentage > 90
                              ? 'bg-gradient-to-r from-[#ea580c] to-[#dc2626]'
                              : 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c]'
                          }`}
                          style={{
                            width: `${occPercentage}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* Channel Split */}
                    <div>
                      <div className="flex justify-between text-xs mb-1.5 text-[#57534e]">
                        <span className="font-medium">Channel Split</span>
                        <span className="font-mono text-xs font-bold text-[#1c1917]">
                          {loc.channelSplit.dineIn}% Dine-In • {loc.channelSplit.delivery}% Delivery
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-[#f0ece1] overflow-hidden flex shadow-inner">
                        <div
                          className="bg-[#f59e0b] h-full transition-all duration-500"
                          style={{ width: `${loc.channelSplit.dineIn}%` }}
                        />
                        <div
                          className="bg-[#ea580c] h-full transition-all duration-500"
                          style={{ width: `${loc.channelSplit.delivery}%` }}
                        />
                      </div>
                    </div>

                    {/* Kitchen Latency Chip */}
                    <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] group-hover:bg-white transition-colors">
                      <div className="flex items-center gap-2">
                        <span className={`material-symbols-outlined text-base ${isHighLatency ? 'text-[#dc2626]' : 'text-[#047857]'}`}>
                          skillet
                        </span>
                        <span className="text-xs text-[#57534e] font-medium">Line Prep Latency</span>
                      </div>
                      <span className={`text-xs font-bold font-mono ${isHighLatency ? 'text-[#dc2626]' : 'text-[#047857]'}`}>
                        {loc.kitchenLatency} min turnaround
                      </span>
                    </div>
                  </div>
                </div>

                {/* Cockpit Action CTAs */}
                <div className="mt-5 pt-3 border-t border-[#f0ece1] flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      onShowToast(
                        'Direct Kitchen Ping',
                        `Priority telemetry heartbeat dispatched to ${loc.name} KDS station.`,
                        'info'
                      );
                    }}
                    title="Direct Kitchen Heartbeat"
                    className="p-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e] hover:text-[#1c1917] border border-[#e8decb] transition-colors cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">sensors</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedBranchForModal(loc)}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#faf8f5] hover:bg-gradient-to-r hover:from-[#f59e0b] hover:to-[#ea580c] text-[#1c1917] hover:text-white font-bold text-xs border border-[#e8decb] hover:border-transparent transition-all duration-300 flex items-center justify-center gap-2 shadow-xs cursor-pointer group/btn"
                  >
                    <span>Launch Branch Cockpit</span>
                    <span className="material-symbols-outlined text-base transition-transform duration-200 group-hover/btn:translate-x-1">
                      arrow_forward
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TWO-COLUMN SECTION: Animated Hourly Surge Dynamics & Live Order Pulse */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Column (8 Cols): Animated Hourly Surge Dynamics Chart */}
        <div className="xl:col-span-8 rounded-2xl bg-white border border-[#e8decb] p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ece1]">
            <div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b45309] text-xl">bar_chart</span>
                <h2 className="font-headline font-bold text-base text-[#1c1917]">
                  Hourly Customer Surge Dynamics (10:00 - 22:00 IST)
                </h2>
              </div>
              <p className="text-xs text-[#57534e]">
                Aggregated in-house seating vs priority concierge delivery covers across Indian metro hubs
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-bold shrink-0">
              <span className="flex items-center gap-1.5 text-[#b45309]">
                <span className="w-3 h-3 rounded-md bg-[#f59e0b] shadow-xs" /> In-House Dining
              </span>
              <span className="flex items-center gap-1.5 text-[#ea580c]">
                <span className="w-3 h-3 rounded-md bg-[#ea580c] shadow-xs" /> Delivery Network
              </span>
            </div>
          </div>

          {/* Eye-catching Animated Bar Chart */}
          <div className="pt-2">
            <div className="h-64 w-full flex items-end justify-between gap-2 sm:gap-3 px-2 relative border-b border-[#e8decb]">
              {/* Subtle Grid Guidelines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                <div className="w-full h-px bg-[#78716c]" />
                <div className="w-full h-px bg-[#78716c]" />
                <div className="w-full h-px bg-[#78716c]" />
                <div className="w-full h-px bg-[#78716c]" />
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
                { time: '7pm', dine: 98, del: 90, peak: 'Dinner Gala', rush: true },
                { time: '8pm', dine: 94, del: 95 },
                { time: '9pm', dine: 82, del: 78 },
                { time: '10pm', dine: 60, del: 62 },
              ].map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1 h-full justify-end group relative cursor-pointer">
                  {bar.peak && (
                    <span
                      className={`absolute -top-7 px-2 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap shadow-xs transition-transform duration-200 group-hover:scale-110 ${
                        bar.rush
                          ? 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                          : 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                      }`}
                    >
                      {bar.peak}
                    </span>
                  )}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-full">
                    <div
                      className={`w-3 sm:w-3.5 rounded-t-md transition-all duration-300 group-hover:brightness-110 group-hover:scale-y-105 ${
                        bar.rush
                          ? 'bg-gradient-to-t from-[#d97706] to-[#f59e0b] shadow-[0_0_8px_rgba(245,158,11,0.5)]'
                          : bar.highlight
                          ? 'bg-gradient-to-t from-[#d97706] to-[#f59e0b]'
                          : 'bg-[#f59e0b]'
                      }`}
                      style={{ height: `${bar.dine}%` }}
                    />
                    <div
                      className="w-3 sm:w-3.5 rounded-t-md bg-gradient-to-t from-[#c2410c] to-[#ea580c] transition-all duration-300 group-hover:brightness-110 group-hover:scale-y-105"
                      style={{ height: `${bar.del}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] font-mono mt-1 transition-colors ${
                      bar.rush
                        ? 'text-[#b91c1c] font-bold'
                        : bar.highlight
                        ? 'text-[#b45309] font-bold'
                        : 'text-[#78716c] group-hover:text-[#1c1917]'
                    }`}
                  >
                    {bar.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Insight Summary Cards below chart */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center justify-between hover:bg-white transition-colors">
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">
                  Peak Service Window
                </span>
                <span className="text-sm font-bold text-[#1c1917] font-mono mt-0.5 block">
                  19:30 - 20:45 IST
                </span>
              </div>
              <span className="material-symbols-outlined text-[#b45309] text-xl">wb_twilight</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center justify-between hover:bg-white transition-colors">
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">
                  Delivery Throttling
                </span>
                <span
                  className={`text-sm font-bold font-mono mt-0.5 block ${
                    isThrottled ? 'text-[#b91c1c]' : 'text-[#047857]'
                  }`}
                >
                  {isThrottled ? 'Surge Active' : 'Normal Pacing'}
                </span>
              </div>
              <span
                className={`material-symbols-outlined text-xl ${
                  isThrottled ? 'text-[#b91c1c]' : 'text-[#047857]'
                }`}
              >
                speed
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center justify-between hover:bg-white transition-colors">
              <div>
                <span className="text-[10px] text-[#78716c] uppercase font-bold block">
                  Average Ticket Lead
                </span>
                <span className="text-sm font-bold text-[#1c1917] font-mono mt-0.5 block">
                  14.6 mins
                </span>
              </div>
              <span className="material-symbols-outlined text-[#78716c] text-xl">timer</span>
            </div>
          </div>
        </div>

        {/* Right Column (4 Cols): Live Order Pulse with smooth animated feed */}
        <div className="xl:col-span-4 rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b45309] text-xl">sensors</span>
              <h2 className="font-headline font-bold text-base text-[#1c1917]">Live Order Pulse</h2>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] text-[10px] font-bold flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#047857] animate-pulse" />
              Live Stream
            </span>
          </div>

          <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
            {LIVE_ORDERS.map((ord) => (
              <div
                key={ord.id}
                className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center justify-between gap-3 hover:border-[#b45309]/40 hover:bg-white hover:shadow-xs transition-all cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ${
                      ord.type === 'dine-in'
                        ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                        : 'bg-[#f4eee2] text-[#57534e] border border-[#e8decb]'
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
                      <span className="text-xs font-bold text-[#1c1917] truncate">
                        {ord.tableOrAddress}
                      </span>
                      <span
                        className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold uppercase ${
                          ord.type === 'dine-in'
                            ? 'bg-[#fef3c7] text-[#92400e]'
                            : 'bg-[#ecfdf5] text-[#065f46]'
                        }`}
                      >
                        {ord.channel}
                      </span>
                    </div>
                    <span className="text-[11px] text-[#78716c] truncate mt-0.5">
                      {ord.outpost} • {ord.itemsSummary}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-[#b45309] font-mono">
                    ₹{ord.totalAmount.toLocaleString('en-IN')}
                  </div>
                  <span
                    className={`text-[10px] font-bold ${
                      ord.statusColor === 'tertiary'
                        ? 'text-[#047857]'
                        : ord.statusColor === 'secondary'
                        ? 'text-[#b91c1c]'
                        : 'text-[#78716c]'
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
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#b45309] text-xs font-bold transition-all flex items-center justify-center gap-1.5 border border-[#e8decb] hover:border-[#b45309]/30 cursor-pointer shadow-xs"
            >
              <span>View Kitchen Display System (KDS) Stream</span>
              <span className="material-symbols-outlined text-sm">open_in_new</span>
            </button>
          </div>
        </div>
      </div>

      {/* Executive Override & Fleet Operations Hub */}
      <div className="rounded-2xl bg-white border border-[#e8decb] p-6 sm:p-7 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-[#f0ece1]">
          <div>
            <h2 className="font-headline font-bold text-base text-[#1c1917] flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b45309] text-xl">bolt</span>
              Executive Override & Fleet Operations Hub
            </h2>
            <p className="text-xs text-[#57534e]">
              Immediate syndicate-wide operational interventions with audit trail logging across Indian flagships
            </p>
          </div>
          <span className="text-xs text-[#047857] font-mono font-bold bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-1 rounded-full self-start sm:self-auto">
            Tier 1 Authorization Granted
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {/* Action 1: National Catalog Sync */}
          <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e8decb] flex flex-col justify-between space-y-4 hover:border-[#b45309]/50 hover:bg-white hover:shadow-md transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1c1917]">National Catalog Sync</span>
                <span className="material-symbols-outlined text-[#b45309] text-xl">sync_saved_locally</span>
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Broadcast revised INR prices, vintage allocation locks, and sold-out 86-item exclusions across POS terminals & Swiggy/Zomato.
              </p>
            </div>
            <button
              type="button"
              disabled={isSyncing}
              onClick={handleGlobalSync}
              className="w-full py-2.5 px-3.5 rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#f59e0b] hover:to-[#ea580c] text-[#1c1917] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs border border-[#e8decb] hover:border-transparent cursor-pointer disabled:opacity-50"
            >
              <span className={`material-symbols-outlined text-base ${isSyncing ? 'animate-spin' : ''}`}>
                cloud_sync
              </span>
              <span>{isSyncing ? 'Syncing 6 Nodes...' : 'Deploy Menu Push (6 Metros)'}</span>
            </button>
          </div>

          {/* Action 2: 15-Min Delivery Throttle */}
          <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e8decb] flex flex-col justify-between space-y-4 hover:border-[#b91c1c]/50 hover:bg-white hover:shadow-md transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1c1917]">15-Min Delivery Throttle</span>
                <span className="material-symbols-outlined text-[#b91c1c] text-xl">hourglass_top</span>
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Temporarily stagger third-party pickup windows to alleviate line-cook pressure during peak dining room courses.
              </p>
            </div>
            <button
              type="button"
              onClick={handleToggleThrottle}
              className={`w-full py-2.5 px-3.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer ${
                isThrottled
                  ? 'bg-[#dc2626] text-white shadow-md'
                  : 'bg-[#fef2f2] hover:bg-[#dc2626] text-[#b91c1c] hover:text-white border border-[#fecaca] hover:border-transparent'
              }`}
            >
              <span className="material-symbols-outlined text-base">
                {isThrottled ? 'pause_circle_filled' : 'pause_circle'}
              </span>
              <span>{isThrottled ? 'Throttle Active (Paced)' : 'Activate Surge Throttle'}</span>
            </button>
          </div>

          {/* Action 3: Kitchen Broadcast Audio */}
          <div className="p-5 rounded-2xl bg-[#faf8f5] border border-[#e8decb] flex flex-col justify-between space-y-4 hover:border-[#047857]/50 hover:bg-white hover:shadow-md transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-[#1c1917]">Kitchen Broadcast Memo</span>
                <span className="material-symbols-outlined text-[#047857] text-xl">campaign</span>
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Dispatch an audible priority chime and custom message directly onto head chef station display screens across all hubs.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBroadcastPromptOpen(true)}
              className="w-full py-2.5 px-3.5 rounded-xl bg-white hover:bg-gradient-to-r hover:from-[#10b981] hover:to-[#047857] text-[#1c1917] hover:text-white text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs border border-[#e8decb] hover:border-transparent cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">volume_up</span>
              <span>Broadcast Audio Message</span>
            </button>
          </div>
        </div>

        {/* Active Table Holds & Reservation Directives */}
        <div className="bg-white border border-[#e8decb] rounded-2xl p-6 shadow-xs space-y-4 mt-6">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b45309] text-xl">event_seat</span>
              <div>
                <h3 className="font-headline font-bold text-base text-[#1c1917]">
                  Active Table Holds & VIP Security Directives
                </h3>
                <p className="text-xs text-[#78716c]">
                  Operational holds placed by Floor Captains and General Managers across metropolitan outposts.
                </p>
              </div>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
              {tableHolds.length} Active Holds
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {tableHolds.map((hold) => (
              <div
                key={hold.id}
                className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex flex-col justify-between space-y-3 hover:border-[#b45309]/40 transition-colors shadow-xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-sm text-[#1c1917]">{hold.tableNumber}</span>
                    <span className="text-[10px] font-bold text-[#b45309] bg-white px-2 py-0.5 rounded-md border border-[#e8decb]">
                      {hold.duration}
                    </span>
                  </div>
                  <div className="text-[11px] text-[#78716c] font-medium">{hold.outpost}</div>
                  <p className="text-xs text-[#57534e] mt-1">{hold.reason}</p>
                  <div className="text-[10px] text-[#78716c] italic">By: {hold.heldBy}</div>
                </div>

                <div className="pt-2 border-t border-[#e8decb] flex items-center justify-end">
                  <Tooltip content="Release & Delete Table Hold" subcontent="Double Verification Required">
                    <button
                      type="button"
                      onClick={() => setDeleteHoldTarget(hold)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-[#fef2f2] text-[#dc2626] font-bold text-xs border border-[#fecaca] hover:border-[#dc2626] transition-all flex items-center gap-1 cursor-pointer shadow-xs"
                    >
                      <span className="material-symbols-outlined text-sm">lock_open</span>
                      <span>Release Hold</span>
                    </button>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Branch Cockpit Modal with Radiant Luxury Light Palette */}
      {selectedBranchForModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="rounded-2xl bg-white border border-[#e8decb] max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div>
                <span className="text-[10px] text-[#b45309] uppercase tracking-widest font-bold font-mono">
                  Branch Node Cockpit // {selectedBranchForModal.code}
                </span>
                <h3 className="font-headline font-bold text-xl text-[#1c1917] mt-0.5">
                  {selectedBranchForModal.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBranchForModal(null)}
                className="p-1.5 rounded-xl text-[#78716c] hover:text-[#1c1917] hover:bg-[#faf8f5] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 bg-[#faf8f5] border border-[#e8decb] rounded-xl text-center">
                <div className="text-[10px] text-[#78716c] uppercase font-bold">Gross Today</div>
                <div className="text-base font-bold text-[#b45309] mt-1 font-mono">
                  ₹{selectedBranchForModal.revenueToday.toLocaleString('en-IN')}
                </div>
              </div>
              <div className="p-3.5 bg-[#faf8f5] border border-[#e8decb] rounded-xl text-center">
                <div className="text-[10px] text-[#78716c] uppercase font-bold">Active Covers</div>
                <div className="text-base font-bold text-[#1c1917] mt-1 font-mono">
                  {selectedBranchForModal.tables.occupied} / {selectedBranchForModal.tables.total}
                </div>
              </div>
              <div className="p-3.5 bg-[#faf8f5] border border-[#e8decb] rounded-xl text-center">
                <div className="text-[10px] text-[#78716c] uppercase font-bold">Prep Duration</div>
                <div className="text-base font-bold text-[#047857] mt-1 font-mono">
                  {selectedBranchForModal.kitchenLatency} min
                </div>
              </div>
            </div>

            <div className="space-y-2.5">
              <span className="text-xs font-bold text-[#1c1917] uppercase tracking-wider block">
                Immediate Operations Protocol
              </span>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    onShowToast(
                      'Priority Protocol Engaged',
                      `All new high-value VIP arrivals for ${selectedBranchForModal.name} routed to VIP Durbar Suite.`
                    );
                    setSelectedBranchForModal(null);
                  }}
                  className="w-full py-3 px-4 rounded-xl bg-[#faf8f5] hover:bg-[#f5efe4] text-[#1c1917] text-left text-xs font-bold flex items-center justify-between transition-colors border border-[#e8decb] cursor-pointer"
                >
                  <span>Route All New VIPs to VIP Durbar Suite</span>
                  <span className="material-symbols-outlined text-sm text-[#b45309]">
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
                  className="w-full py-3 px-4 rounded-xl bg-[#faf8f5] hover:bg-[#f5efe4] text-[#1c1917] text-left text-xs font-bold flex items-center justify-between transition-colors border border-[#e8decb] cursor-pointer"
                >
                  <span>Restrict Delivery Intake by 30% for Next Hour</span>
                  <span className="material-symbols-outlined text-sm text-[#b45309]">
                    chevron_right
                  </span>
                </button>
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5 border-t border-[#f0ece1]">
              <button
                type="button"
                onClick={() => setSelectedBranchForModal(null)}
                className="px-4 py-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e] text-xs font-bold transition-colors cursor-pointer"
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
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110 transition-all cursor-pointer"
              >
                Open Full Station POS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kitchen Broadcast Prompt Modal */}
      {broadcastPromptOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="rounded-2xl bg-white border border-[#e8decb] max-w-md w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#047857] text-xl">campaign</span>
                <h3 className="font-headline font-bold text-base text-[#1c1917]">
                  Kitchen Broadcast Memo
                </h3>
              </div>
              <button
                onClick={() => setBroadcastPromptOpen(false)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <p className="text-xs text-[#57534e] leading-relaxed">
              This will trigger an audible double-chime and push text directly to line-cook and sous chef monitors across all outposts.
            </p>
            <form onSubmit={handleSendBroadcast} className="space-y-4">
              <textarea
                rows={3}
                required
                value={broadcastMsg}
                onChange={(e) => setBroadcastMsg(e.target.value)}
                className="w-full bg-[#faf8f5] text-[#1c1917] p-3 rounded-xl text-xs leading-relaxed border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
              />
              <div className="flex justify-end gap-2.5 pt-1">
                <button
                  type="button"
                  onClick={() => setBroadcastPromptOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-xs font-bold text-[#57534e] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#047857] text-white text-xs font-bold hover:brightness-110 shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">send</span>
                  <span>Transmit Broadcast</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Double Verification Modal for Table Hold Release / Deletion */}
      <DoubleDeleteConfirmModal
        isOpen={!!deleteHoldTarget}
        onClose={() => setDeleteHoldTarget(null)}
        onConfirm={handleConfirmReleaseHold}
        itemName={deleteHoldTarget ? `${deleteHoldTarget.tableNumber} (${deleteHoldTarget.outpost})` : ''}
        itemType="VIP Table Reservation Hold"
        itemSubdetails={
          deleteHoldTarget
            ? `Reason: ${deleteHoldTarget.reason} • Held by: ${deleteHoldTarget.heldBy} • Duration: ${deleteHoldTarget.duration}`
            : undefined
        }
        warningNote="Releasing this table hold immediately returns the seating alcove to the live floor captain dispatch queue and accepts online reservations."
        requireTyping={true}
      />
    </div>
  );
};
