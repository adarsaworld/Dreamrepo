import React, { useState } from 'react';
import { Tooltip } from './Tooltip';
import { DoubleDeleteConfirmModal } from './DoubleDeleteConfirmModal';

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
  const [deleteTarget, setDeleteTarget] = useState<IntegrationNode | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newCategory, setNewCategory] = useState('Aggregator / Webhook');
  const [newEndpoint, setNewEndpoint] = useState('https://');

  const handleTestWebhook = (id: string, name: string) => {
    setTestingId(id);
    setTimeout(() => {
      setTestingId(null);
      onShowToast(
        'Webhook Echo Nominal',
        `200 OK received from ${name} with 0 packet loss.`,
        'success'
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

  const handleConfirmDelete = () => {
    if (!deleteTarget) return;
    setIntegrations((prev) => prev.filter((i) => i.id !== deleteTarget.id));
    onShowToast(
      'Integration Gateway Disconnected & Removed',
      `Permanently revoked credentials and detached ${deleteTarget.name}.`,
      'warning'
    );
    setDeleteTarget(null);
  };

  const handleAddIntegration = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEndpoint.trim()) return;

    const newIntegration: IntegrationNode = {
      id: `int-${Date.now()}`,
      name: newName.trim(),
      category: newCategory,
      status: 'Connected',
      endpoint: newEndpoint.trim(),
      latency: `${Math.floor(15 + Math.random() * 25)}ms`,
      lastPing: 'Just now',
      active: true,
    };

    setIntegrations([...integrations, newIntegration]);
    setIsAddModalOpen(false);
    setNewName('');
    setNewEndpoint('https://');
    onShowToast(
      'New Integration Bound',
      `Gateway successfully configured for ${newIntegration.name}.`,
      'success'
    );
  };

  return (
    <div className="flex flex-col w-full space-y-8 animate-fade-in">
      {/* Strategic Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#92400e] uppercase tracking-widest bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a] font-bold shadow-xs">
              Edge Infrastructure
            </span>
            <span className="text-[10px] text-[#065f46] uppercase tracking-wider bg-[#ecfdf5] px-2.5 py-0.5 rounded-full border border-[#a7f3d0] font-bold">
              4 TLS v1.3 Verified
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
            Settings & Multi-Channel Integrations
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-3xl leading-relaxed">
            API endpoints, webhook telemetry, and cryptographic credential vaults bridging in-house station POS with Indian metro delivery syndication.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Tooltip content="Connect custom POS, ERP or aggregator webhook" subcontent="Instant Handshake">
            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#b45309] to-[#ea580c] hover:brightness-110 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">add_link</span>
              <span>+ Add Gateway</span>
            </button>
          </Tooltip>

          <Tooltip content="Rotate zero-downtime cryptographic keys across all metro edge nodes" subcontent="Zero Downtime">
            <button
              onClick={() =>
                onShowToast(
                  'API Gateway Keys Rotated',
                  'Regenerated zero-downtime bearer tokens across all 6 outposts.',
                  'success'
                )
              }
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all shadow-xs cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#b45309]">key</span>
              <span>Rotate Edge Auth Tokens</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Grid of Integrations */}
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
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border flex items-center gap-1 ${
                    item.active
                      ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                      : 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      item.active ? 'bg-[#047857] animate-pulse' : 'bg-[#dc2626]'
                    }`}
                  />
                  {item.active ? `${item.status} (${item.latency})` : 'Channel Paused'}
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
                <Tooltip content="Ping endpoint with mock synthetic transaction" subcontent="Checks HTTP 200 Status">
                  <button
                    type="button"
                    disabled={testingId === item.id}
                    onClick={() => handleTestWebhook(item.id, item.name)}
                    className="px-3 py-1.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all flex items-center gap-1 cursor-pointer disabled:opacity-50 shadow-xs"
                  >
                    <span
                      className={`material-symbols-outlined text-sm text-[#b45309] ${
                        testingId === item.id ? 'animate-spin' : ''
                      }`}
                    >
                      {testingId === item.id ? 'refresh' : 'send'}
                    </span>
                    <span>{testingId === item.id ? 'Pinging...' : 'Test Payload'}</span>
                  </button>
                </Tooltip>

                <Tooltip
                  content={item.active ? 'Pause channel dispatch' : 'Resume live channel dispatch'}
                  subcontent="Toggles Webhook Reception"
                >
                  <button
                    type="button"
                    onClick={() => handleToggleActive(item.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                      item.active
                        ? 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0] hover:bg-[#d1fae5]'
                        : 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] hover:bg-[#fee2e2]'
                    }`}
                  >
                    {item.active ? 'Active' : 'Paused'}
                  </button>
                </Tooltip>

                {/* Double Verification Delete / Unbind Button */}
                <Tooltip content="Disconnect & Delete Gateway" subcontent="Double Verification Required">
                  <button
                    type="button"
                    onClick={() => setDeleteTarget(item)}
                    className="p-1.5 rounded-xl text-[#78716c] hover:text-[#dc2626] hover:bg-[#fef2f2] border border-transparent hover:border-[#fecaca] transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                </Tooltip>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Gateway Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white border border-[#e8decb] rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#b45309] text-xl">hub</span>
                <h3 className="font-headline font-bold text-base text-[#1c1917]">
                  Register New Integration Gateway
                </h3>
              </div>
              <Tooltip content="Close modal">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] cursor-pointer"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </Tooltip>
            </div>

            <form onSubmit={handleAddIntegration} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                  Service / Provider Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Magicpin Direct POS Gateway"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-[#faf8f5] text-xs font-bold p-2.5 rounded-xl border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                  Gateway Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full bg-[#faf8f5] text-xs font-bold p-2.5 rounded-xl border border-[#e8decb]"
                >
                  <option value="Point of Sale (POS)">Point of Sale (POS)</option>
                  <option value="Delivery Aggregator">Delivery Aggregator</option>
                  <option value="Guest Reservations & Dispatch">Guest Reservations & Dispatch</option>
                  <option value="Treasury & Bank Clearing">Treasury & Bank Clearing</option>
                  <option value="Aggregator / Webhook">Custom Webhook & ERP</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                  Webhook / REST Endpoint (HTTPS)
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://api.partner.com/webhook"
                  value={newEndpoint}
                  onChange={(e) => setNewEndpoint(e.target.value)}
                  className="w-full bg-[#faf8f5] text-xs font-mono p-2.5 rounded-xl border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
                />
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f0ece1]">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-xs font-bold text-[#57534e] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b45309] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110 cursor-pointer"
                >
                  Bind Integration
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Double Verification Modal for Integration Deletion / Revocation */}
      <DoubleDeleteConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        itemName={deleteTarget ? deleteTarget.name : ''}
        itemType="Multi-Channel Integration Gateway"
        itemSubdetails={
          deleteTarget
            ? `Category: ${deleteTarget.category} • Endpoint: ${deleteTarget.endpoint} • Latency: ${deleteTarget.latency}`
            : undefined
        }
        warningNote="Disconnecting this integration immediately cuts off bi-directional order dispatch, webhook synchronization, and automated POS inventory decrements for this partner."
        requireTyping={true}
      />
    </div>
  );
};
