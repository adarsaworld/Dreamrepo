import React, { useState } from 'react';
import { INVENTORY_ITEMS } from '../data/mockData';

interface InventorySupplyViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const InventorySupplyView: React.FC<InventorySupplyViewProps> = ({ onShowToast }) => {
  const [items, setItems] = useState(INVENTORY_ITEMS);
  const [search, setSearch] = useState('');

  const handleOrderReplenish = (name: string) => {
    onShowToast('Replenishment Dispatched', `Automated PO sent to supplier for ${name}.`);
  };

  const filtered = items.filter(
    (i) =>
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.origin.toLowerCase().includes(search.toLowerCase()) ||
      i.supplier.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#ffb3b6] uppercase tracking-widest bg-[#cc003c]/20 px-2.5 py-0.5 rounded-full border border-[#cc003c]/30 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cc003c] animate-pulse" />
              Cellar & Larder Critical Monitoring
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight">
            Inventory & Supply Fleet Logistics
          </h1>
          <p className="text-xs sm:text-sm text-[#d8c3ad] max-w-3xl leading-relaxed">
            Real-time cold-chain telemetry, dry-ager temperature logging, and automated procurement for Michelin-grade purveyors.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onShowToast('Cold-Chain Scan Complete', 'All 12 IoT temperature sensors nominal across 4 timezones.')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#56e5a9]">thermostat</span>
            <span>Sensor Audit (0.0° Variance)</span>
          </button>
        </div>
      </div>

      {/* IoT Environmental Sensors Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Himalayan Salt Dry-Ager</span>
            <div className="text-xl font-bold font-mono text-[#56e5a9]">1.2°C • 78% RH</div>
            <span className="text-[11px] text-[#a08e7a]">Tokyo Roppongi Cold Room</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#56e5a9]/10 text-[#56e5a9] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">ac_unit</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Grand Cru Vintage Vault</span>
            <div className="text-xl font-bold font-mono text-[#56e5a9]">12.4°C • 70% RH</div>
            <span className="text-[11px] text-[#a08e7a]">London Mayfair Cellar 2</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#ffc174]/10 text-[#ffc174] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">wine_bar</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Caviar Deep Preserve</span>
            <div className="text-xl font-bold font-mono text-[#56e5a9]">-2.1°C • Static Chill</div>
            <span className="text-[11px] text-[#a08e7a]">New York SoHo Larder</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#ffb3b6]/10 text-[#ffb3b6] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">kitchen</span>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-[#1b1c1d] border border-[#292a2b] rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 bg-[#0d0e0f] border-b border-[#292a2b] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <span className="material-symbols-outlined text-[#a08e7a] text-lg">search</span>
            <input
              type="text"
              placeholder="Search raw ingredients, cellar vintages, or purveyors..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1f2021] text-xs text-[#e3e2e3] placeholder:text-[#a08e7a] px-3 py-1.5 rounded-lg border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
            />
          </div>
          <span className="text-xs text-[#a08e7a] font-mono">
            {filtered.length} priority inventory lines monitored
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0d0e0f]/80 text-[#a08e7a] text-[10px] uppercase tracking-wider border-b border-[#292a2b]">
                <th className="py-3 px-6">Rare Asset & Purveyor Origin</th>
                <th className="py-3 px-4 text-right">Stock On-Hand</th>
                <th className="py-3 px-4 text-right">Par Level</th>
                <th className="py-3 px-4 text-right">Burn Rate</th>
                <th className="py-3 px-4">Urgency Status</th>
                <th className="py-3 px-6 text-right">Restock Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292a2b]">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-[#292a2b]/30 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex flex-col">
                      <span className="font-headline font-bold text-sm text-[#e3e2e3]">
                        {item.name}
                      </span>
                      <span className="text-[11px] text-[#a08e7a]">
                        {item.origin} • {item.supplier}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-right font-mono font-bold text-sm text-[#ffc174]">
                    {item.stockOnHand}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-[#d8c3ad]">
                    {item.parLevel}
                  </td>
                  <td className="py-4 px-4 text-right font-mono text-xs text-[#a08e7a]">
                    {item.burnRate}
                  </td>
                  <td className="py-4 px-4">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        item.urgency === 'critical'
                          ? 'bg-[#cc003c]/20 text-[#ffb3b6] border border-[#cc003c]/30'
                          : item.urgency === 'warning'
                          ? 'bg-[#f59e0b]/20 text-[#ffc174] border border-[#f59e0b]/30'
                          : 'bg-[#56e5a9]/15 text-[#56e5a9] border border-[#56e5a9]/30'
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => handleOrderReplenish(item.name)}
                      className="px-3.5 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#ffc174] hover:text-[#472a00] text-[#e3e2e3] font-bold text-xs border border-[#343536] transition-all cursor-pointer"
                    >
                      Order PO Now
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
