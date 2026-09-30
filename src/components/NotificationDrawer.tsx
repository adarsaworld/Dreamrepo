import React from 'react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab?: (tab: any) => void;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  onNavigateTab,
}) => {
  if (!isOpen) return null;

  const notifications = [
    {
      id: '1',
      title: 'Kashmiri Mongra Saffron Par-Level Warning',
      description: 'Central reserve dropped below 5 kg. Urgent air shipment dispatch recommended for festival prep.',
      outpost: 'Mumbai BKC Flagship',
      time: '12m ago',
      type: 'warning',
      action: 'Inspect Supply',
      tab: 'inventory-supply',
    },
    {
      id: '2',
      title: 'Kitchen Dispatch Latency Peak (18m)',
      description: 'New Delhi Lutyens experiencing clay tandoor queue spike. 36/40 tables occupied.',
      outpost: 'New Delhi Lutyens',
      time: '24m ago',
      type: 'alert',
      action: 'Engage Throttle',
      tab: 'branch-overview',
    },
    {
      id: '3',
      title: 'Royal Durbar VIP Table Seated',
      description: 'Table 12 (6 covers) ordered Sikandari Raan + Chene Grand Reserve 2018 vintage flight.',
      outpost: 'Mumbai BKC Flagship',
      time: '35m ago',
      type: 'success',
      action: 'View Order Pulse',
      tab: 'branch-overview',
    },
    {
      id: '4',
      title: 'Bespoke Spice Blend Fast-Track Requested',
      description: 'Hyderabad Jubilee Hills kitchen requested royal potli masala ratio verification before evening service.',
      outpost: 'Hyderabad Jubilee Hills',
      time: '1h ago',
      type: 'warning',
      action: 'Open Menu Studio',
      tab: 'menu-studio',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white border-l border-[#e8decb] shadow-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-lg bg-[#fef3c7] text-[#b45309] border border-[#fde68a]">
                  <svg className="w-5 h-5 text-[#b45309]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-[#1c1917]">
                    Syndicate Priority Alerts
                  </h3>
                  <span className="text-[10px] text-[#78716c] font-medium">Real-time fleet notifications</span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#faf8f5] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl bg-[#faf8f5] border border-[#e8decb] hover:border-[#b45309]/50 hover:bg-white hover:shadow-md transition-all space-y-2 cursor-pointer"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${
                        n.type === 'alert'
                          ? 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                          : n.type === 'warning'
                          ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                          : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                      }`}
                    >
                      {n.outpost}
                    </span>
                    <span className="text-[11px] text-[#78716c] font-mono font-medium">{n.time}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#1c1917] leading-snug">
                    {n.title}
                  </h4>
                  <p className="text-xs text-[#57534e] leading-relaxed">
                    {n.description}
                  </p>
                  <div className="pt-1 flex justify-end">
                    <button
                      onClick={() => {
                        if (onNavigateTab && n.tab) {
                          onNavigateTab(n.tab);
                        }
                        onClose();
                      }}
                      className="text-xs text-[#b45309] hover:text-[#d97706] hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>{n.action}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#f0ece1] flex items-center justify-between">
            <span className="text-xs text-[#78716c] font-medium">4 unread fleet alerts</span>
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-xs text-[#1c1917] font-bold border border-[#e8decb] transition-colors cursor-pointer"
            >
              Mark All Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
