import React, { useState } from 'react';

interface SettingsIntegrationsViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

interface IntegrationNode {
  id: string;
  name: string;
  category: string;
  status: string;
  endpoint: string;
  latency: string;
  lastPing: string;
  active: boolean;
}

export const SettingsIntegrationsView: React.FC<SettingsIntegrationsViewProps> = ({ onShowToast }) => {
  const [integrations, setIntegrations] = useState<IntegrationNode[]>([
    {
      id: 'int-1',
      name: 'Petpooja POS & Indian GST E-Invoicing Cloud',
      category: 'Point of Sale (POS)',
      status: 'Synchronized',
      endpoint: 'https://api.petpooja.com/v2/kizen-empire/orders/webhook',
      latency: '24ms',
      lastPing: '2s ago',
      active: true,
    },
    {
      id: 'int-2',
      name: 'Swiggy Gourmet Restaurant Partner Direct Feed',
      category: 'Delivery Aggregator',
      status: 'Pacing Active',
      endpoint: 'https://partner-gateway.swiggy.com/dispatch/v3/kizen',
      latency: '38ms',
      lastPing: '12s ago',
      active: true,
    },
    {
      id: 'int-3',
      name: 'Zomato Legends & Gold Table Reservations',
      category: 'Guest Reservations & Dispatch',
      status: 'Live',
      endpoint: 'https://api.zomato.com/syndicate/kizen/tables/webhook',
      latency: '42ms',
      lastPing: '5s ago',
      active: true,
    },
    {
      id: 'int-4',
      name: 'ICICI / HDFC Corporate Treasury RTGS & UPI Auto-Split',
      category: 'Treasury & Bank Clearing',
      status: 'Certified RBI Grade',
      endpoint: 'https://corp-banking.hdfcbank.com/v4/rtgs/settlement',
      latency: '18ms',
      lastPing: '1s ago',
      active: true,
    },
  ]);

  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTestWebhook = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      onShowToast(
        'Webhook Echo Nominal',
        `200 OK received from ${name} with 0 packet loss.`
      );
    }, 1200);
  };

  const handleToggleActive = (id: string) => {
    setIntegrations((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
    const it = integrations.find((i) => i.id === id);
    if (it) {
      onShowToast(
        it.active ? 'Integration Paused' : 'Integration Restored',
        `${it.name} channel gateway state updated.`,
        it.active ? 'warning' : 'success'
      );
    }
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#92400e] uppercase tracking-widest bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a] font-bold shadow-xs">
              Edge Infrastructure
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
            Settings & Multi-Channel Integrations
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-3xl leading-relaxed">
            API endpoints, webhook telemetry, and cryptographic credential vaults bridging in-house station POS with Indian metro delivery syndication.
          </p>
        </div>

        <button
          onClick={() => onShowToast('API Gateway Keys Rotated', 'Regenerated zero-downtime bearer tokens across all 6 outposts.')}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all shadow-xs cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-[#b45309]">key</span>
          <span>Rotate Edge Auth Tokens</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-6 rounded-2xl bg-white border border-[#e8decb] shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-4 hover:border-[#f59e0b]/50 hover:-translate-y-1 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#78716c] tracking-wider">
                  {item.category}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#047857] animate-pulse" />
                  {item.status} ({item.latency})
                </span>
              </div>
              <h3 className="font-headline font-bold text-base text-[#1c1917]">{item.name}</h3>
              <div className="p-3 rounded-xl bg-[#faf8f5] text-[11px] font-mono text-[#57534e] truncate border border-[#e8decb]">
                {item.endpoint}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#f0ece1]">
              <span className="text-[11px] text-[#78716c]">Last heartbeat: {item.lastPing}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={testingId === item.id}
                  onClick={() => handleTestWebhook(item.id, item.name)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-xs"
                >
                  <span className={`material-symbols-outlined text-sm text-[#b45309] ${testingId === item.id ? 'animate-spin' : ''}`}>
                    {testingId === item.id ? 'refresh' : 'send'}
                  </span>
                  <span>{testingId === item.id ? 'Pinging...' : 'Test Payload'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleActive(item.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                    item.active
                      ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                      : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                  }`}
                >
                  {item.active ? 'Active' : 'Paused'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
