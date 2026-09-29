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
      title: 'Mirin Substitution Audit Required',
      description: 'Dubai Marina kitchen requested halal verification on sakura reduction tare before evening service.',
      outpost: 'Dubai Marina',
      time: '12m ago',
      type: 'warning',
      action: 'Open Menu Studio',
      tab: 'menu-studio',
    },
    {
      id: '2',
      title: 'Kitchen Dispatch Latency Peak (18m)',
      description: 'Tokyo Roppongi experiencing cold-bar queue spike. 48/52 tables occupied.',
      outpost: 'Tokyo Roppongi',
      time: '24m ago',
      type: 'alert',
      action: 'Engage Throttle',
      tab: 'branch-overview',
    },
    {
      id: '3',
      title: 'VIP Omakase Table Seated',
      description: 'Table 12 (6 covers) ordered Dassai Beyond 2019 pairing + A5 Miyazaki Wagyu Ribeye.',
      outpost: 'Tokyo Roppongi',
      time: '35m ago',
      type: 'success',
      action: 'View Order Pulse',
      tab: 'branch-overview',
    },
    {
      id: '4',
      title: 'Cellar Par-Level Warning',
      description: 'Reserve Kaluga Queen Hybrid Caviar dropped below 10 tins in cellar inventory.',
      outpost: 'All Outposts',
      time: '1h ago',
      type: 'warning',
      action: 'Inspect Supply',
      tab: 'inventory-supply',
    }
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#1b1c1d] border-l border-[#292a2b] shadow-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#292a2b]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ffc174] text-xl">
                  notifications_active
                </span>
                <h3 className="font-headline font-bold text-base text-[#e3e2e3]">
                  Syndicate Priority Alerts
                </h3>
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3] hover:bg-[#292a2b] transition-colors"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 overflow-y-auto max-h-[calc(100vh-180px)] pr-1">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-3.5 rounded-xl bg-[#1f2021] border border-[#292a2b] hover:border-[#ffc174]/40 transition-colors space-y-2"
                >
                  <div className="flex items-start justify-between">
                    <span
                      className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${
                        n.type === 'alert'
                          ? 'bg-[#cc003c]/20 text-[#ffb3b6]'
                          : n.type === 'warning'
                          ? 'bg-[#f59e0b]/20 text-[#ffc174]'
                          : 'bg-[#56e5a9]/20 text-[#56e5a9]'
                      }`}
                    >
                      {n.outpost}
                    </span>
                    <span className="text-[11px] text-[#a08e7a]">{n.time}</span>
                  </div>
                  <h4 className="text-sm font-semibold text-[#e3e2e3] leading-snug">
                    {n.title}
                  </h4>
                  <p className="text-xs text-[#d8c3ad] leading-relaxed">
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
                      className="text-xs text-[#ffc174] hover:underline font-semibold flex items-center gap-1"
                    >
                      <span>{n.action}</span>
                      <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-[#292a2b] flex items-center justify-between">
            <span className="text-xs text-[#a08e7a]">4 unread fleet alerts</span>
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-xs text-[#e3e2e3] font-semibold transition-colors"
            >
              Mark All Read
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
