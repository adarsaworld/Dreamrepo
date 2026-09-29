import React, { useState } from 'react';

interface SettingsIntegrationsViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const SettingsIntegrationsView: React.FC<SettingsIntegrationsViewProps> = ({ onShowToast }) => {
  const [integrations, setIntegrations] = useState([
    {
      id: 'deliverect',
      name: 'Deliverect Enterprise Middleware',
      category: 'Delivery Hub',
      status: 'Connected',
      latency: '24ms',
      lastPing: '2s ago',
      endpoint: 'https://gateway.deliverect.com/v3/kizen-syndicate',
      active: true,
    },
    {
      id: 'ubereats',
      name: 'UberEats Priority Merchant API',
      category: 'Aggregator Direct',
      status: 'Connected',
      latency: '38ms',
      lastPing: '5s ago',
      endpoint: 'https://api.uber.com/v1/eats/stores/kizen-group',
      active: true,
    },
    {
      id: 'toast',
      name: 'Toast POS Terminal Backbone',
      category: 'In-House POS',
      status: 'Synchronized',
      latency: '11ms',
      lastPing: '1s ago',
      endpoint: 'https://toast-api.kizen.internal/orders/realtime',
      active: true,
    },
    {
      id: 'doordash',
      name: 'DoorDash Caviar & Drive Dispatch',
      category: 'Courier Routing',
      status: 'Connected',
      latency: '44ms',
      lastPing: '12s ago',
      endpoint: 'https://openapi.doordash.com/developer/v1/deliveries',
      active: true,
    },
  ]);

  const [testingId, setTestingId] = useState<string | null>(null);

  const handleTestWebhook = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      onShowToast('Webhook Verified 200 OK', `Simulated order payload processed by ${name} in 18ms.`, 'success');
    }, 1100);
  };

  const handleToggleActive = (id: string) => {
    setIntegrations(prev =>
      prev.map(item => (item.id === id ? { ...item, active: !item.active } : item))
    );
    onShowToast('Gateway State Modified', 'Routing configuration updated across edge proxies.');
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#ffc174] uppercase tracking-widest bg-[#f59e0b]/20 px-2.5 py-0.5 rounded-full border border-[#f59e0b]/30 font-bold">
              Edge Infrastructure
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight">
            Settings & Multi-Channel Integrations
          </h1>
          <p className="text-xs sm:text-sm text-[#d8c3ad] max-w-3xl leading-relaxed">
            API endpoints, webhook telemetry, and cryptographic credential vaults bridging in-house station POS with global delivery syndication.
          </p>
        </div>

        <button
          onClick={() => onShowToast('API Gateway Keys Rotated', 'Regenerated zero-downtime bearer tokens across all 6 outposts.')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-all cursor-pointer"
        >
          <span className="material-symbols-outlined text-base text-[#ffc174]">key</span>
          <span>Rotate Edge Auth Tokens</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {integrations.map((item) => (
          <div
            key={item.id}
            className="p-5 rounded-xl bg-[#1b1c1d] border border-[#292a2b] shadow-xl space-y-4 hover:border-[#ffc174]/40 transition-all flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-[#a08e7a] tracking-wider">
                  {item.category}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#56e5a9]/15 text-[#56e5a9] border border-[#56e5a9]/30 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#56e5a9]" />
                  {item.status} ({item.latency})
                </span>
              </div>
              <h3 className="font-headline font-bold text-base text-[#e3e2e3]">{item.name}</h3>
              <div className="p-2 rounded bg-[#0d0e0f] text-[11px] font-mono text-[#d8c3ad] truncate border border-[#292a2b]">
                {item.endpoint}
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-[#292a2b]">
              <span className="text-[11px] text-[#a08e7a]">Last heartbeat: {item.lastPing}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={testingId === item.id}
                  onClick={() => handleTestWebhook(item.id, item.name)}
                  className="px-3 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50"
                >
                  <span className={`material-symbols-outlined text-sm text-[#ffc174] ${testingId === item.id ? 'animate-spin' : ''}`}>
                    {testingId === item.id ? 'refresh' : 'send'}
                  </span>
                  <span>{testingId === item.id ? 'Pinging...' : 'Test Payload'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleActive(item.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                    item.active
                      ? 'bg-[#56e5a9]/20 text-[#56e5a9] border border-[#56e5a9]/40'
                      : 'bg-[#cc003c]/20 text-[#ffb3b6] border border-[#cc003c]/40'
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
