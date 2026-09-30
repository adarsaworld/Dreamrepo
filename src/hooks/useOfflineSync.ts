import { useState, useEffect, useCallback } from 'react';

export interface QueuedTransaction {
  id: string;
  type: 'table_order' | 'kitchen_punch' | 'stock_deduction' | 'bill_settlement';
  description: string;
  amount?: number;
  timestamp: string;
}

export function useOfflineSync(onShowToast?: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void) {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );

  const [offlineQueue, setOfflineQueue] = useState<QueuedTransaction[]>(() => {
    try {
      const stored = localStorage.getItem('kizen_offline_edge_queue');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [cloudKitchenFailoverActive, setCloudKitchenFailoverActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem('kizen_cloud_failover') === 'true';
    } catch {
      return false;
    }
  });

  const [isSyncing, setIsSyncing] = useState(false);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('kizen_offline_edge_queue', JSON.stringify(offlineQueue));
    } catch (e) {
      console.error(e);
    }
  }, [offlineQueue]);

  // Handle online/offline events
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      if (onShowToast) {
        onShowToast('Edge Connectivity Restored', 'Re-established uplink with Kizen National Cloud.', 'success');
      }
      // Trigger auto-sync
      syncPendingQueue();
    };

    const handleOffline = () => {
      setIsOnline(false);
      if (onShowToast) {
        onShowToast(
          'Operating in Edge Offline Mode',
          'Local POS & KDS buffer activated. Transactions are safely queued on-device.',
          'warning'
        );
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onShowToast]);

  const addToOfflineQueue = useCallback((type: QueuedTransaction['type'], description: string, amount?: number) => {
    const item: QueuedTransaction = {
      id: `TX-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      type,
      description,
      amount,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    };

    setOfflineQueue((prev) => [item, ...prev]);
    return item;
  }, []);

  const syncPendingQueue = useCallback(async () => {
    if (offlineQueue.length === 0) return;
    setIsSyncing(true);

    // Simulate batch dispatch to central server
    await new Promise((resolve) => setTimeout(resolve, 1400));

    const syncedCount = offlineQueue.length;
    setOfflineQueue([]);
    setIsSyncing(false);

    if (onShowToast) {
      onShowToast(
        'Offline Queue Dispatched',
        `Successfully synced ${syncedCount} queued edge orders and ledger updates to headquarters.`,
        'success'
      );
    }
  }, [offlineQueue, onShowToast]);

  const toggleCloudKitchenFailover = useCallback(() => {
    setCloudKitchenFailoverActive((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('kizen_cloud_failover', String(next));
      } catch (e) {
        console.error(e);
      }
      if (onShowToast) {
        onShowToast(
          next ? 'Autonomous Cloud Kitchen Failover ENGAGED' : 'Cloud Kitchen Failover Disengaged',
          next
            ? 'Third-party delivery surges (Swiggy/Zomato) redirected to standby satellite kitchens to protect flagship dining rooms.'
            : 'Delivery routes restored to primary branch stations.',
          next ? 'warning' : 'info'
        );
      }
      return next;
    });
  }, [onShowToast]);

  return {
    isOnline,
    offlineQueue,
    isSyncing,
    cloudKitchenFailoverActive,
    addToOfflineQueue,
    syncPendingQueue,
    toggleCloudKitchenFailover,
    simulateOfflineToggle: () => setIsOnline((prev) => !prev),
  };
}
