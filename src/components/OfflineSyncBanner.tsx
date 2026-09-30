import React, { useState } from 'react';
import { QueuedTransaction } from '../hooks/useOfflineSync';

interface OfflineSyncBannerProps {
  isOnline: boolean;
  offlineQueue: QueuedTransaction[];
  isSyncing: boolean;
  cloudKitchenFailoverActive: boolean;
  onSync: () => void;
  onToggleFailover: () => void;
  onSimulateToggle: () => void;
}

export const OfflineSyncBanner: React.FC<OfflineSyncBannerProps> = ({
  isOnline,
  offlineQueue,
  isSyncing,
  cloudKitchenFailoverActive,
  onSync,
  onToggleFailover,
  onSimulateToggle,
}) => {
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <div className="w-full">
      {/* Top Banner (Visible when offline OR when queue > 0 OR failover is active) */}
      {(!isOnline || offlineQueue.length > 0 || cloudKitchenFailoverActive) && (
        <div
          className={`w-full px-4 py-2 text-xs flex flex-wrap items-center justify-between gap-3 border-b transition-colors shadow-xs ${
            !isOnline
              ? 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
              : cloudKitchenFailoverActive
              ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
              : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
          }`}
        >
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="flex h-2.5 w-2.5 relative">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  !isOnline ? 'bg-[#dc2626]' : 'bg-[#f59e0b]'
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-2.5 w-2.5 ${
                  !isOnline ? 'bg-[#dc2626]' : 'bg-[#f59e0b]'
                }`}
              />
            </span>

            <span className="font-bold">
              {!isOnline
                ? 'Edge Offline POS Active:'
                : cloudKitchenFailoverActive
                ? 'Autonomous Cloud Kitchen Failover ENGAGED:'
                : 'Edge Queue Pending Uplink:'}
            </span>

            <span className="text-[11px] opacity-90">
              {!isOnline
                ? 'Tables and order punches are being safeguarded in on-device storage.'
                : cloudKitchenFailoverActive
                ? 'Online delivery surge diverted to nearest satellite kitchen.'
                : `${offlineQueue.length} records ready to be flushed to corporate headquarters.`}
            </span>

            {offlineQueue.length > 0 && (
              <button
                type="button"
                onClick={() => setDetailsOpen(true)}
                className="underline font-bold hover:opacity-80 cursor-pointer"
              >
                View {offlineQueue.length} Queued Records
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isOnline && offlineQueue.length > 0 && (
              <button
                type="button"
                disabled={isSyncing}
                onClick={onSync}
                className="px-2.5 py-1 rounded-lg bg-[#047857] text-white font-bold text-[11px] flex items-center gap-1 shadow-xs hover:brightness-110 active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                <span className={`material-symbols-outlined text-xs ${isSyncing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{isSyncing ? 'Flushing...' : 'Sync Now'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleFailover}
              className={`px-2.5 py-1 rounded-lg font-bold text-[11px] border transition-colors cursor-pointer ${
                cloudKitchenFailoverActive
                  ? 'bg-[#d97706] text-white border-transparent'
                  : 'bg-white text-[#92400e] border-[#fde68a] hover:bg-[#fffbeb]'
              }`}
              title="Reroute Swiggy/Zomato orders to backup cloud kitchen"
            >
              Failover: {cloudKitchenFailoverActive ? 'ACTIVE' : 'STANDBY'}
            </button>

            {/* Quick Test Toggle */}
            <button
              type="button"
              onClick={onSimulateToggle}
              className="text-[10px] text-[#78716c] hover:text-[#1c1917] underline cursor-pointer"
              title="Simulate network break/restoration"
            >
              Test {isOnline ? 'Offline' : 'Online'}
            </button>
          </div>
        </div>
      )}

      {/* Queue Details Modal */}
      {detailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4 relative max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-xl text-[#b45309]">inventory_2</span>
                <h3 className="font-headline font-bold text-base text-[#1c1917]">
                  Buffered Edge POS Transactions
                </h3>
              </div>
              <button
                onClick={() => setDetailsOpen(false)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <p className="text-xs text-[#57534e]">
              These transactions are saved in local browser storage and will automatically dispatch to central servers once the connection is validated.
            </p>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1 divide-y divide-[#f0ece1]">
              {offlineQueue.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#78716c]">
                  No buffered transactions currently in queue.
                </div>
              ) : (
                offlineQueue.map((item) => (
                  <div key={item.id} className="pt-2 flex items-start justify-between text-xs">
                    <div>
                      <span className="font-mono font-bold text-[#b45309] block">{item.id}</span>
                      <span className="text-[#1c1917] font-medium">{item.description}</span>
                      <div className="text-[10px] text-[#78716c]">{item.timestamp}</div>
                    </div>
                    {item.amount && (
                      <span className="font-mono font-bold text-[#047857]">
                        ₹{item.amount.toLocaleString('en-IN')}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>

            <div className="pt-3 border-t border-[#f0ece1] flex items-center justify-between">
              <span className="text-xs text-[#78716c] font-medium">
                {offlineQueue.length} records pending
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
                  className="px-3 py-1.5 rounded-xl bg-[#faf8f5] text-xs font-bold text-[#57534e]"
                >
                  Close
                </button>
                {isOnline && offlineQueue.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      onSync();
                      setDetailsOpen(false);
                    }}
                    className="px-3.5 py-1.5 rounded-xl bg-[#047857] text-white text-xs font-bold"
                  >
                    Sync All Now
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
