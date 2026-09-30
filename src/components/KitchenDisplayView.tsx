import React, { useState, useEffect } from 'react';
import { KDSTicket, KDSStation, CourseStage } from '../types';
import { INITIAL_KDS_TICKETS } from '../data/enterpriseData';

interface KitchenDisplayViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
  onNavigateTab?: (tab: any) => void;
}

export const KitchenDisplayView: React.FC<KitchenDisplayViewProps> = ({ onShowToast }) => {
  const [tickets, setTickets] = useState<KDSTicket[]>(INITIAL_KDS_TICKETS);
  const [selectedStation, setSelectedStation] = useState<KDSStation>('all');
  const [selectedCourse, setSelectedCourse] = useState<CourseStage | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'cooking' | 'ready_for_pickup' | 'bumped'>('cooking');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [kitchenRushActive, setKitchenRushActive] = useState(false);

  // Live timer tick every 10 seconds to update elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setTickets((prev) =>
        prev.map((t) => ({
          ...t,
          elapsedMinutes: Math.max(1, Math.round((Date.now() - t.createdAt) / 60000)),
        }))
      );
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Web Audio chime for bumping tickets
  const playChime = (type: 'bump' | 'item') => {
    if (!soundEnabled || typeof window === 'undefined') return;
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type === 'bump' ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(type === 'bump' ? 880 : 587.33, ctx.currentTime); // A5 or D5
      if (type === 'bump') {
        osc.frequency.exponentialRampToValueAtTime(1174.66, ctx.currentTime + 0.15); // D6
      }

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (type === 'bump' ? 0.35 : 0.2));

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + (type === 'bump' ? 0.35 : 0.2));
    } catch {
      // AudioContext policy fallback
    }
  };

  // Toggle item ready status
  const handleToggleItemReady = (ticketId: string, itemId: string) => {
    setTickets((prev) =>
      prev.map((ticket) => {
        if (ticket.id !== ticketId) return ticket;
        const updatedItems = ticket.items.map((item) =>
          item.id === itemId ? { ...item, isReady: !item.isReady } : item
        );
        const allReady = updatedItems.every((item) => item.isReady);
        return {
          ...ticket,
          items: updatedItems,
          status: allReady ? 'ready_for_pickup' : 'cooking',
        };
      })
    );
    playChime('item');
  };

  // Bump entire ticket
  const handleBumpTicket = (ticketId: string, orderNumber: string) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status: 'bumped' } : t))
    );
    playChime('bump');
    onShowToast(
      'KDS Ticket Bumped',
      `Order ${orderNumber} cleared from active cook line & dispatched to table runner.`,
      'success'
    );
  };

  // Inject sample live order
  const handleSimulateNewOrder = () => {
    const tableId = Math.floor(1 + Math.random() * 20);
    const newTicket: KDSTicket = {
      id: `kds-${Date.now()}`,
      orderNumber: `T-${tableId < 10 ? '0' + tableId : tableId} VIP`,
      tableNumber: `Table ${tableId} (Royal Dining Hall)`,
      channel: 'Dine-In VIP',
      outpost: 'Mumbai BKC Flagship',
      serverName: 'Captain Vikramaditya',
      coversCount: 4,
      createdAt: Date.now(),
      elapsedMinutes: 0,
      status: 'cooking',
      priority: kitchenRushActive ? 'rush' : 'normal',
      notes: 'Guest requested extra saffron butter on sheermal.',
      items: [
        {
          id: `item-${Date.now()}-1`,
          name: 'Smoked Awadhi Galouti Kebab',
          hindiName: 'गलोटी कबाब',
          quantity: 2,
          station: 'tandoor',
          course: 'appetizer',
          isReady: false,
        },
        {
          id: `item-${Date.now()}-2`,
          name: 'Subz Dum Handi Biryani',
          hindiName: 'सब्ज़ दम बिरयानी',
          quantity: 2,
          station: 'awadhi_handi',
          course: 'main',
          isReady: false,
        },
        {
          id: `item-${Date.now()}-3`,
          name: 'Kesari Kulfi Tasting Trio',
          hindiName: 'केसर कुल्फी',
          quantity: 2,
          station: 'halwai_dessert',
          course: 'dessert',
          isReady: false,
        },
      ],
    };

    setTickets([newTicket, ...tickets]);
    playChime('bump');
    onShowToast('POS Injection: New KDS Ticket', `Ticket ${newTicket.orderNumber} routed to cook line stations.`, 'info');
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const matchesStatus = t.status === statusFilter;
    const hasStationItems =
      selectedStation === 'all' ||
      t.items.some((i) => i.station === selectedStation);
    const hasCourseItems =
      selectedCourse === 'all' ||
      t.items.some((i) => i.course === selectedCourse);

    return matchesStatus && hasStationItems && hasCourseItems;
  });

  const cookingCount = tickets.filter((t) => t.status === 'cooking').length;
  const readyCount = tickets.filter((t) => t.status === 'ready_for_pickup').length;
  const bumpedCount = tickets.filter((t) => t.status === 'bumped').length;

  return (
    <div className="flex flex-col w-full space-y-6 animate-fade-in">
      {/* Top KDS Executive Bar */}
      <div className="bg-white border border-[#e8decb] rounded-2xl p-5 shadow-xs flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#b45309] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-2xl">soup_kitchen</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-xl text-[#1c1917]">
                Live Kitchen Display System (KDS)
              </h1>
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#047857] animate-pulse" />
                Line Active
              </span>
            </div>
            <p className="text-xs text-[#78716c]">
              Real-time station routing, ticket aging SLA monitors, and course sequencing
            </p>
          </div>
        </div>

        {/* Operational Controls & Metrics */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] text-xs font-mono">
            <span className="text-[#78716c]">Line Latency:</span>
            <span className="font-bold text-[#b45309]">12.4 min avg</span>
          </div>

          <button
            type="button"
            onClick={() => setKitchenRushActive(!kitchenRushActive)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1 cursor-pointer ${
              kitchenRushActive
                ? 'bg-[#dc2626] text-white border-transparent shadow-xs animate-pulse'
                : 'bg-white text-[#57534e] border-[#e8decb] hover:bg-[#faf8f5]'
            }`}
          >
            <span className="material-symbols-outlined text-sm">local_fire_department</span>
            <span>{kitchenRushActive ? 'Surge Mode ON' : 'Normal Pacing'}</span>
          </button>

          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-[#faf8f5] text-[#b45309] border-[#e8decb]'
                : 'bg-white text-[#78716c] border-[#e8decb]'
            }`}
            title={soundEnabled ? 'Mute Ticket Chimes' : 'Enable Ticket Chimes'}
          >
            <span className="material-symbols-outlined text-base">
              {soundEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSimulateNewOrder}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">add_circle</span>
            <span>+ Simulate Ticket</span>
          </button>
        </div>
      </div>

      {/* Filter Matrix: Stations & Statuses */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white border border-[#e8decb] p-3 rounded-2xl shadow-xs">
        {/* Station Selectors */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          {[
            { id: 'all', label: 'All Cook Stations', icon: 'grid_view' },
            { id: 'tandoor', label: 'Tandoor & Clay Oven', icon: 'oven_gen' },
            { id: 'awadhi_handi', label: 'Awadhi Dum Handi', icon: 'pot' },
            { id: 'halwai_dessert', label: 'Halwai & Desserts', icon: 'cake' },
            { id: 'sommelier_bar', label: 'Sommelier & Bar', icon: 'wine_bar' },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setSelectedStation(st.id as KDSStation)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                selectedStation === st.id
                  ? 'bg-[#b45309] text-white shadow-xs'
                  : 'bg-[#faf8f5] text-[#57534e] hover:bg-[#f4eee2] border border-[#e8decb]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{st.icon}</span>
              <span>{st.label}</span>
            </button>
          ))}
        </div>

        {/* Status Tabs: Cooking, Ready, Bumped */}
        <div className="flex items-center gap-1 bg-[#faf8f5] p-1 rounded-xl border border-[#e8decb] shrink-0 self-start md:self-auto">
          <button
            onClick={() => setStatusFilter('cooking')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              statusFilter === 'cooking'
                ? 'bg-white text-[#b45309] shadow-xs'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            <span>Cooking</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#fef3c7] text-[#92400e] font-mono">
              {cookingCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('ready_for_pickup')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              statusFilter === 'ready_for_pickup'
                ? 'bg-white text-[#047857] shadow-xs'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            <span>Ready for Pickup</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#ecfdf5] text-[#065f46] font-mono">
              {readyCount}
            </span>
          </button>
          <button
            onClick={() => setStatusFilter('bumped')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
              statusFilter === 'bumped'
                ? 'bg-white text-[#1c1917] shadow-xs'
                : 'text-[#78716c] hover:text-[#1c1917]'
            }`}
          >
            <span>History</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#f5f0e6] text-[#57534e] font-mono">
              {bumpedCount}
            </span>
          </button>
        </div>
      </div>

      {/* Live Ticket Grid */}
      {filteredTickets.length === 0 ? (
        <div className="bg-white border border-[#e8decb] rounded-2xl p-12 text-center space-y-3 shadow-xs">
          <div className="w-12 h-12 rounded-full bg-[#faf8f5] text-[#b45309] flex items-center justify-center mx-auto border border-[#e8decb]">
            <span className="material-symbols-outlined text-2xl">done_all</span>
          </div>
          <h3 className="font-headline font-bold text-base text-[#1c1917]">
            All Tickets Cleared for this View
          </h3>
          <p className="text-xs text-[#78716c] max-w-sm mx-auto">
            No pending tickets under station &apos;{selectedStation}&apos; with status &apos;{statusFilter}&apos;. Use &apos;Simulate Ticket&apos; to trigger incoming POS orders.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
          {filteredTickets.map((ticket) => {
            // SLA Color Coding based on elapsed cook time
            const isCritical = ticket.elapsedMinutes >= 15;
            const isWarning = ticket.elapsedMinutes >= 8 && ticket.elapsedMinutes < 15;

            const agingBadge = isCritical
              ? 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
              : isWarning
              ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
              : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]';

            const agingHeader = isCritical
              ? 'border-t-4 border-t-[#dc2626]'
              : isWarning
              ? 'border-t-4 border-t-[#f59e0b]'
              : 'border-t-4 border-t-[#047857]';

            const filteredItems =
              selectedStation === 'all'
                ? ticket.items
                : ticket.items.filter((i) => i.station === selectedStation);

            return (
              <div
                key={ticket.id}
                className={`bg-white border border-[#e8decb] rounded-2xl shadow-md overflow-hidden flex flex-col justify-between transition-all hover:shadow-lg ${agingHeader}`}
              >
                {/* Ticket Header */}
                <div className="p-4 bg-[#faf8f5] border-b border-[#e8decb] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-headline font-bold text-base text-[#1c1917]">
                        {ticket.orderNumber}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                          ticket.channel.includes('VIP') || ticket.channel.includes('Durbar')
                            ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                            : 'bg-[#faf8f5] text-[#78716c] border-[#e8decb]'
                        }`}
                      >
                        {ticket.channel}
                      </span>
                    </div>

                    {/* Aging Timer Badge */}
                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-mono font-bold border ${agingBadge}`}>
                      <span className="material-symbols-outlined text-xs">timer</span>
                      <span>{ticket.elapsedMinutes}m</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#57534e]">
                    <span className="font-medium text-[#1c1917]">{ticket.tableNumber}</span>
                    <span>{ticket.coversCount} Covers</span>
                  </div>

                  <div className="text-[11px] text-[#78716c]">
                    Server: <strong className="text-[#1c1917]">{ticket.serverName}</strong>
                  </div>

                  {ticket.notes && (
                    <div className="p-2 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[11px] text-[#991b1b] flex items-start gap-1">
                      <span className="material-symbols-outlined text-xs shrink-0 mt-0.5">priority_high</span>
                      <p className="leading-tight">{ticket.notes}</p>
                    </div>
                  )}
                </div>

                {/* Items List */}
                <div className="p-4 space-y-2.5 flex-1 divide-y divide-[#f0ece1]">
                  {filteredItems.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleToggleItemReady(ticket.id, item.id)}
                      className={`pt-2.5 first:pt-0 flex items-start justify-between gap-3 cursor-pointer group transition-opacity ${
                        item.isReady ? 'opacity-50' : 'opacity-100'
                      }`}
                    >
                      <div className="flex items-start gap-2.5 flex-1">
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center text-xs mt-0.5 transition-colors border ${
                            item.isReady
                              ? 'bg-[#047857] text-white border-transparent'
                              : 'bg-white border-[#e8decb] text-transparent group-hover:border-[#b45309]'
                          }`}
                        >
                          <span className="material-symbols-outlined text-sm font-bold">check</span>
                        </div>

                        <div className="space-y-0.5">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-mono font-bold text-xs text-[#b45309]">
                              {item.quantity}×
                            </span>
                            <span
                              className={`text-xs font-bold leading-tight ${
                                item.isReady ? 'line-through text-[#78716c]' : 'text-[#1c1917]'
                              }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          {item.hindiName && (
                            <span className="text-[10px] text-[#78716c] block">
                              {item.hindiName}
                            </span>
                          )}

                          {item.customization && (
                            <span className="text-[11px] text-[#d97706] italic block leading-tight">
                              ↳ {item.customization}
                            </span>
                          )}

                          {item.allergenAlert && (
                            <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]">
                              <span className="material-symbols-outlined text-[10px]">warning</span>
                              {item.allergenAlert}
                            </span>
                          )}
                        </div>
                      </div>

                      <span
                        className={`text-[9px] uppercase font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                          item.course === 'appetizer'
                            ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                            : item.course === 'main'
                            ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                            : 'bg-[#faf8f5] text-[#78716c] border-[#e8decb]'
                        }`}
                      >
                        {item.course}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Ticket Footer Action */}
                <div className="p-3 bg-[#faf8f5] border-t border-[#e8decb] flex items-center justify-between">
                  <span className="text-[11px] text-[#78716c]">
                    {ticket.items.filter((i) => i.isReady).length}/{ticket.items.length} Ready
                  </span>

                  {ticket.status !== 'bumped' ? (
                    <button
                      type="button"
                      onClick={() => handleBumpTicket(ticket.id, ticket.orderNumber)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#047857] to-[#059669] text-white font-bold text-xs flex items-center gap-1 shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-sm">done_all</span>
                      <span>Bump Ticket</span>
                    </button>
                  ) : (
                    <span className="text-xs font-bold text-[#047857] flex items-center gap-1">
                      <span className="material-symbols-outlined text-sm">verified</span>
                      Completed
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
