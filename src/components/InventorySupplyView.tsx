import React, { useState } from 'react';
import { INVENTORY_ITEMS } from '../data/mockData';
import { InventoryItem, InwardStockRecord } from '../types';

interface InventorySupplyViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const InventorySupplyView: React.FC<InventorySupplyViewProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Add Stock Modal State
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [stockMode, setStockMode] = useState<'existing' | 'new'>('existing');
  const [selectedItemId, setSelectedItemId] = useState<string>(INVENTORY_ITEMS[0]?.id || '');
  
  // New Item fields
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Spices & Saffron');
  const [newItemOrigin, setNewItemOrigin] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemPar, setNewItemPar] = useState<number>(10);
  const [newItemUnitCost, setNewItemUnitCost] = useState<number>(3500);

  // Common inwarding fields
  const [inwardQuantity, setInwardQuantity] = useState<number>(5);
  const [targetOutpost, setTargetOutpost] = useState('Mumbai BKC Flagship');
  const [requirementReason, setRequirementReason] = useState('Weekend Royal Banquet Prep');
  const [supplierName, setSupplierName] = useState('Kashmir Saffron Growers Direct Cold-Chain');
  const [storageZone, setStorageZone] = useState('Himalayan Salt Dry-Ager #1');
  const [batchNumber, setBatchNumber] = useState(`LOT-${new Date().getFullYear()}-098`);

  // Inwarding history
  const [inwardHistory, setInwardHistory] = useState<InwardStockRecord[]>([
    {
      id: 'rec-1',
      itemId: 'inv-3',
      itemName: 'Gir Organic A2 Cultured Bilona Ghee',
      quantityAdded: 25,
      unit: 'Liters',
      outpost: 'Mumbai BKC Flagship',
      requirementReason: 'Diwali Festive Menu Advance Stocking',
      supplier: 'Vedic Gir Dairy Cooperative',
      totalCost: 70000,
      timestamp: '2 hours ago',
    },
    {
      id: 'rec-2',
      itemId: 'inv-5',
      itemName: 'Fresh Malabar Bay Lobster Tails',
      quantityAdded: 15,
      unit: 'kg',
      outpost: 'Bengaluru Indiranagar',
      requirementReason: 'VIP Degustation Night Allocation',
      supplier: 'Malabar Coastal Fishermen Syndicate',
      totalCost: 63000,
      timestamp: 'Yesterday',
    }
  ]);

  const [showHistory, setShowHistory] = useState(false);

  // Active item in modal
  const activeExistingItem = items.find((i) => i.id === selectedItemId) || items[0];

  const handleOrderReplenish = (name: string) => {
    onShowToast('Replenishment PO Dispatched', `Automated PO sent to supplier for ${name} in Indian Rupee billing.`);
  };

  const handleQuickAdd = (itemId: string, qty: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setItems((prev) =>
      prev.map((item) => {
        if (item.id === itemId) {
          const newStock = Math.round((item.stockOnHand + qty) * 10) / 10;
          const nextUrgency = newStock >= item.parLevel ? 'optimal' : newStock >= item.threshold ? 'warning' : 'critical';
          const nextStatus = newStock >= item.parLevel ? 'Adequate Reserve' : newStock >= item.threshold ? 'Restock Triggered' : 'Low Stock Alert';
          return {
            ...item,
            stockOnHand: newStock,
            urgency: nextUrgency,
            status: nextStatus,
          };
        }
        return item;
      })
    );
    const targetItem = items.find((i) => i.id === itemId);
    const cost = (targetItem?.unitCost || 0) * qty;
    onShowToast(
      'Stock Added Instantly',
      `Added +${qty} ${targetItem?.unit || 'units'} of ${targetItem?.name}. Value: ₹${cost.toLocaleString('en-IN')}`,
      'success'
    );
  };

  const handleOpenAddStockModalForItem = (itemId: string) => {
    setSelectedItemId(itemId);
    setStockMode('existing');
    const it = items.find((i) => i.id === itemId);
    if (it) {
      setSupplierName(it.supplier);
    }
    setIsAddStockOpen(true);
  };

  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inwardQuantity <= 0) return;

    if (stockMode === 'existing' && activeExistingItem) {
      const addedQty = Number(inwardQuantity);
      const newStock = Math.round((activeExistingItem.stockOnHand + addedQty) * 10) / 10;
      const nextUrgency = newStock >= activeExistingItem.parLevel ? 'optimal' : newStock >= activeExistingItem.threshold ? 'warning' : 'critical';
      const nextStatus = newStock >= activeExistingItem.parLevel ? 'Adequate Reserve' : newStock >= activeExistingItem.threshold ? 'Restock Triggered' : 'Low Stock Alert';
      const totalInwardValue = addedQty * activeExistingItem.unitCost;

      setItems((prev) =>
        prev.map((item) =>
          item.id === activeExistingItem.id
            ? {
                ...item,
                stockOnHand: newStock,
                urgency: nextUrgency,
                status: nextStatus,
                lastRestocked: new Date().toISOString().slice(0, 10),
              }
            : item
        )
      );

      const newRecord: InwardStockRecord = {
        id: `rec-${Date.now()}`,
        itemId: activeExistingItem.id,
        itemName: activeExistingItem.name,
        quantityAdded: addedQty,
        unit: activeExistingItem.unit,
        outpost: targetOutpost,
        requirementReason: requirementReason || 'Scheduled Admin Restock',
        supplier: supplierName || activeExistingItem.supplier,
        totalCost: totalInwardValue,
        timestamp: 'Just now',
      };
      setInwardHistory([newRecord, ...inwardHistory]);

      onShowToast(
        'Stock Successfully Inwarded',
        `Added +${addedQty} ${activeExistingItem.unit} of ${activeExistingItem.name} at ${targetOutpost}. Value: ₹${totalInwardValue.toLocaleString('en-IN')}`,
        'success'
      );
    } else if (stockMode === 'new') {
      if (!newItemName.trim()) return;
      const addedQty = Number(inwardQuantity);
      const totalInwardValue = addedQty * newItemUnitCost;
      const newItem: InventoryItem = {
        id: `inv-custom-${Date.now()}`,
        name: newItemName.trim(),
        category: newItemCategory,
        origin: newItemOrigin.trim() || 'Direct Indian Farm Purveyor',
        stockOnHand: addedQty,
        unit: newItemUnit,
        parLevel: Number(newItemPar) || 10,
        threshold: Math.round((Number(newItemPar) || 10) * 0.4),
        unitCost: Number(newItemUnitCost) || 1000,
        status: addedQty >= (Number(newItemPar) || 10) ? 'Adequate Reserve' : 'Low Stock Alert',
        burnRate: 'Calculated in service',
        urgency: addedQty >= (Number(newItemPar) || 10) ? 'optimal' : 'warning',
        supplier: supplierName.trim() || 'Verified Syndicate Producer',
        reorderLeadTime: '48 hrs direct freight',
        lastRestocked: new Date().toISOString().slice(0, 10),
      };

      setItems([newItem, ...items]);

      const newRecord: InwardStockRecord = {
        id: `rec-${Date.now()}`,
        itemId: newItem.id,
        itemName: newItem.name,
        quantityAdded: addedQty,
        unit: newItem.unit,
        outpost: targetOutpost,
        requirementReason: requirementReason || 'New Catalog Inwarding',
        supplier: newItem.supplier,
        totalCost: totalInwardValue,
        timestamp: 'Just now',
      };
      setInwardHistory([newRecord, ...inwardHistory]);

      onShowToast(
        'New Luxury Asset Cataloged & Inwarded',
        `${newItem.name} (+${addedQty} ${newItem.unit}) added to ${targetOutpost} reserves. Value: ₹${totalInwardValue.toLocaleString('en-IN')}`,
        'success'
      );
    }

    setIsAddStockOpen(false);
    setInwardQuantity(5);
  };

  const handleExportStockCSV = () => {
    const rows = [
      ['Item ID', 'Asset Name', 'Category', 'Origin', 'Stock On Hand', 'Unit', 'Par Level', 'Unit Cost (INR)', 'Total Value (INR)', 'Urgency Status', 'Supplier'],
      ...items.map((i) => [
        i.id,
        `"${i.name}"`,
        i.category,
        `"${i.origin}"`,
        i.stockOnHand,
        i.unit,
        i.parLevel,
        i.unitCost,
        Math.round(i.stockOnHand * i.unitCost),
        i.status,
        `"${i.supplier}"`
      ])
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kizen_cellar_stock_ledger_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Stock Audit Exported', 'Complete inventory ledger snapshot downloaded as CSV.');
  };

  // Filtered list
  const filtered = items.filter((i) => {
    const matchesSearch =
      i.name.toLowerCase().includes(search.toLowerCase()) ||
      i.origin.toLowerCase().includes(search.toLowerCase()) ||
      i.supplier.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || i.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Financial aggregates in INR
  const totalValuation = items.reduce((acc, curr) => acc + curr.stockOnHand * curr.unitCost, 0);
  const criticalCount = items.filter((i) => i.urgency === 'critical').length;
  const warningCount = items.filter((i) => i.urgency === 'warning').length;

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Header & Primary Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] text-[#ffb3b6] uppercase tracking-widest bg-[#cc003c]/20 px-2.5 py-0.5 rounded-full border border-[#cc003c]/30 font-bold flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#cc003c] animate-pulse" />
              Cellar & Larder Critical Monitoring
            </span>
            <span className="text-[10px] text-[#56e5a9] uppercase tracking-widest bg-[#56e5a9]/15 px-2 py-0.5 rounded-full border border-[#56e5a9]/30 font-bold">
              Autonomous IoT Active
            </span>
            <span className="text-[10px] text-[#ffc174] uppercase tracking-widest bg-[#f59e0b]/20 px-2 py-0.5 rounded-full border border-[#f59e0b]/30 font-bold">
              INR (₹) Valuation
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight">
            Inventory & Supply Fleet Logistics
          </h1>
          <p className="text-xs sm:text-sm text-[#d8c3ad] max-w-3xl leading-relaxed">
            Real-time cold-chain telemetry, dry-ager temperature logging, and admin stock inwarding for Michelin-standard Indian gastronomic assets across all 6 metro nodes.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Prominent Add Stock Button requested by User */}
          <button
            onClick={() => {
              setStockMode('existing');
              setIsAddStockOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>+ Add Stock / Inward Inventory</span>
          </button>

          <button
            onClick={() => onShowToast('Cold-Chain Scan Complete', 'All 18 IoT temperature sensors nominal across Mumbai, Delhi, Bengaluru & Hyderabad.')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#56e5a9]">thermostat</span>
            <span className="hidden sm:inline">Sensor Audit (0.0° Variance)</span>
            <span className="sm:hidden">Audit</span>
          </button>

          <button
            onClick={handleExportStockCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-[#292a2b] hover:bg-[#343536] text-[#d8c3ad] hover:text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-all cursor-pointer"
            title="Download CSV Ledger"
          >
            <span className="material-symbols-outlined text-base">download</span>
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Valuation & Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] space-y-1 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold tracking-wider">
              Total Monitored Asset Value
            </span>
            <span className="material-symbols-outlined text-[#ffc174] text-lg">payments</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#ffc174]">
            ₹{Math.round(totalValuation).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#56e5a9] flex items-center gap-1 font-medium">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>Across 6 Metro Outposts (INR)</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold tracking-wider">
              Critical Par-Level Breaches
            </span>
            <span className="material-symbols-outlined text-[#ffb3b6] text-lg">error</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#ffb3b6]">
            {criticalCount} <span className="text-xs text-[#a08e7a] font-normal">lines low</span>
          </div>
          <div className="text-[11px] text-[#ffb3b6] font-medium">
            Immediate reorder / inwarding required
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold tracking-wider">
              Warning Buffer Items
            </span>
            <span className="material-symbols-outlined text-[#ffc174] text-lg">warning</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#ffc174]">
            {warningCount} <span className="text-xs text-[#a08e7a] font-normal">near par</span>
          </div>
          <div className="text-[11px] text-[#a08e7a]">
            PO recommended for weekend service
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold tracking-wider">
              Recent Admin Stock Inwardings
            </span>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-[10px] text-[#ffc174] hover:underline font-bold"
            >
              {showHistory ? 'Hide Ledger' : 'View Audit Log'}
            </button>
          </div>
          <div className="text-2xl font-bold font-mono text-[#56e5a9]">
            {inwardHistory.length} <span className="text-xs text-[#a08e7a] font-normal">batches</span>
          </div>
          <div className="text-[11px] text-[#56e5a9] font-medium">
            Fully reconciled with kitchen ledgers
          </div>
        </div>
      </div>

      {/* Inwarding Activity Ledger Drawer / Section (Collapsible) */}
      {showHistory && (
        <div className="bg-[#121314] border border-[#292a2b] rounded-xl p-5 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ffc174] text-lg">history_edu</span>
              <h3 className="font-headline font-bold text-sm text-[#e3e2e3]">
                Admin Stock Inwarding Audit Trail
              </h3>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-[#a08e7a] hover:text-[#e3e2e3]"
            >
              Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="text-[#a08e7a] text-[10px] uppercase tracking-wider border-b border-[#292a2b]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Asset Inwarded</th>
                  <th className="py-2.5 px-3">Quantity Added</th>
                  <th className="py-2.5 px-3">Target Outpost</th>
                  <th className="py-2.5 px-3">Requirement Reason</th>
                  <th className="py-2.5 px-3 text-right">Batch Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#292a2b]">
                {inwardHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#1b1c1d]">
                    <td className="py-2.5 px-3 text-[#a08e7a] font-mono">{rec.timestamp}</td>
                    <td className="py-2.5 px-3 font-semibold text-[#e3e2e3]">{rec.itemName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#56e5a9]">
                      +{rec.quantityAdded} {rec.unit}
                    </td>
                    <td className="py-2.5 px-3 text-[#d8c3ad]">{rec.outpost}</td>
                    <td className="py-2.5 px-3 text-[#a08e7a]">{rec.requirementReason}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#ffc174]">
                      ₹{rec.totalCost.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* IoT Environmental Sensors Bar with Indian Metro Outposts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Himalayan Salt Dry-Ager</span>
            <div className="text-xl font-bold font-mono text-[#56e5a9]">1.2°C • 78% RH</div>
            <span className="text-[11px] text-[#a08e7a]">Mumbai BKC Central Cold Room</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#56e5a9]/10 text-[#56e5a9] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">ac_unit</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Grand Cru Vintage Vault</span>
            <div className="text-xl font-bold font-mono text-[#56e5a9]">12.4°C • 70% RH</div>
            <span className="text-[11px] text-[#a08e7a]">Bengaluru Indiranagar Reserve Cellar</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#ffc174]/10 text-[#ffc174] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">wine_bar</span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#1b1c1d] border border-[#292a2b] flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Deep Spice & Larder Preserve</span>
            <div className="text-xl font-bold font-mono text-[#56e5a9]">-2.1°C • Static Chill</div>
            <span className="text-[11px] text-[#a08e7a]">New Delhi Lutyens Specialty Larder</span>
          </div>
          <div className="h-10 w-10 rounded-lg bg-[#ffb3b6]/10 text-[#ffb3b6] flex items-center justify-center">
            <span className="material-symbols-outlined text-xl">kitchen</span>
          </div>
        </div>
      </div>

      {/* Main Stock Table */}
      <div className="bg-[#1b1c1d] border border-[#292a2b] rounded-xl overflow-hidden shadow-xl">
        {/* Table Filter Header */}
        <div className="p-4 bg-[#0d0e0f] border-b border-[#292a2b] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <span className="material-symbols-outlined text-[#a08e7a] text-lg">search</span>
            <input
              type="text"
              placeholder="Search saffron, morels, ghee, lobster, wines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#1f2021] text-xs text-[#e3e2e3] placeholder:text-[#a08e7a] px-3 py-1.5 rounded-lg border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
            />
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {[
              { id: 'all', label: 'All Categories' },
              { id: 'Spices & Saffron', label: 'Spices & Saffron' },
              { id: 'Dairy & Ghee', label: 'Dairy & Ghee' },
              { id: 'Luxury Proteins', label: 'Luxury Proteins' },
              { id: 'Cellar & Spirits', label: 'Cellar & Wines' },
              { id: 'Tandoor & Fuel', label: 'Tandoor Fuel' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#ffc174] text-[#472a00]'
                    : 'bg-[#1f2021] text-[#d8c3ad] hover:text-[#e3e2e3] border border-[#292a2b]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#a08e7a] font-mono shrink-0">
            {filtered.length} priority inventory lines monitored
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#0d0e0f]/80 text-[#a08e7a] text-[10px] uppercase tracking-wider border-b border-[#292a2b]">
                <th className="py-3 px-6">Rare Asset & Purveyor Origin</th>
                <th className="py-3 px-4 text-right">Stock On-Hand</th>
                <th className="py-3 px-4 text-right">Par Level</th>
                <th className="py-3 px-4 text-right">Unit Cost (₹)</th>
                <th className="py-3 px-4 text-right">Total Valuation</th>
                <th className="py-3 px-4 text-right">Burn Rate</th>
                <th className="py-3 px-4">Urgency Status</th>
                <th className="py-3 px-6 text-right">Admin Stock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#292a2b]">
              {filtered.map((item) => {
                const totalItemVal = Math.round(item.stockOnHand * item.unitCost);
                return (
                  <tr key={item.id} className="hover:bg-[#292a2b]/30 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-headline font-bold text-sm text-[#e3e2e3]">
                            {item.name}
                          </span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-[#292a2b] text-[#ffc174] font-medium">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#a08e7a] mt-0.5">
                          {item.origin} • {item.supplier}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-sm text-[#ffc174]">
                      {item.stockOnHand} <span className="text-xs text-[#d8c3ad] font-normal">{item.unit}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-[#d8c3ad]">
                      {item.parLevel} {item.unit}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-[#d8c3ad]">
                      ₹{item.unitCost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-xs text-[#e3e2e3]">
                      ₹{totalItemVal.toLocaleString('en-IN')}
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
                      <div className="flex items-center justify-end gap-2">
                        {/* Quick stock add (+1 or +5) */}
                        <button
                          type="button"
                          onClick={(e) => handleQuickAdd(item.id, item.unit === 'kg' ? 2 : item.unit === 'bottles' ? 6 : 5, e)}
                          title={`Quick Add +${item.unit === 'kg' ? 2 : item.unit === 'bottles' ? 6 : 5} ${item.unit}`}
                          className="px-2 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#56e5a9] font-mono text-xs font-bold border border-[#343536] transition-all cursor-pointer"
                        >
                          +{item.unit === 'kg' ? 2 : item.unit === 'bottles' ? 6 : 5}
                        </button>

                        {/* Open Modal with this item */}
                        <button
                          type="button"
                          onClick={() => handleOpenAddStockModalForItem(item.id)}
                          className="px-3 py-1.5 rounded-lg bg-[#ffc174]/15 hover:bg-[#ffc174] text-[#ffc174] hover:text-[#472a00] font-bold text-xs border border-[#ffc174]/30 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-xs">add</span>
                          <span>Add Stock</span>
                        </button>

                        {/* Order PO */}
                        <button
                          type="button"
                          onClick={() => handleOrderReplenish(item.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#a08e7a] hover:text-[#e3e2e3] font-semibold text-xs border border-[#343536] transition-all cursor-pointer"
                        >
                          PO
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Add Stock Modal for Admin */}
      {isAddStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#1b1c1d] border border-[#292a2b] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#292a2b]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ffc174] flex items-center justify-center text-[#472a00]">
                  <span className="material-symbols-outlined text-xl">inventory</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#e3e2e3]">
                    Admin Stock Inwarding Console
                  </h3>
                  <p className="text-xs text-[#a08e7a]">
                    Add stock allocation based on operational & banquet requirements
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStockOpen(false)}
                className="p-1.5 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3] hover:bg-[#292a2b] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#0d0e0f] rounded-xl border border-[#292a2b]">
              <button
                type="button"
                onClick={() => setStockMode('existing')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  stockMode === 'existing'
                    ? 'bg-[#f59e0b] text-[#472a00] shadow-sm font-bold'
                    : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
                }`}
              >
                <span className="material-symbols-outlined text-base">layers</span>
                <span>Restock Monitored Asset</span>
              </button>
              <button
                type="button"
                onClick={() => setStockMode('new')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
                  stockMode === 'new'
                    ? 'bg-[#f59e0b] text-[#472a00] shadow-sm font-bold'
                    : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
                }`}
              >
                <span className="material-symbols-outlined text-base">new_releases</span>
                <span>Catalog New Luxury Asset</span>
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-4">
              {stockMode === 'existing' ? (
                /* Select Existing Asset */
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                    Select Target Ingredient / Vintage
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => {
                      setSelectedItemId(e.target.value);
                      const it = items.find((i) => i.id === e.target.value);
                      if (it) setSupplierName(it.supplier);
                    }}
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2.5 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  >
                    {items.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} (Current: {i.stockOnHand} {i.unit} • Par: {i.parLevel} {i.unit} • ₹{i.unitCost.toLocaleString('en-IN')}/{i.unit})
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                /* New Item Fields */
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                        Asset Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kashmiri Mongra Saffron Batch B"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                        Category
                      </label>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value as any)}
                        className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                      >
                        <option value="Spices & Saffron">Spices & Saffron</option>
                        <option value="Luxury Proteins">Luxury Proteins</option>
                        <option value="Dairy & Ghee">Dairy & Ghee</option>
                        <option value="Cellar & Spirits">Cellar & Spirits</option>
                        <option value="Tandoor & Fuel">Tandoor & Fuel</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={newItemUnit}
                        onChange={(e) => setNewItemUnit(e.target.value)}
                        placeholder="kg, Liters, bottles"
                        className="w-full bg-[#292a2b] text-[#e3e2e3] px-3 py-2 rounded-lg text-xs border border-[#343536]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                        Par Level Target
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newItemPar}
                        onChange={(e) => setNewItemPar(Number(e.target.value) || 1)}
                        className="w-full bg-[#292a2b] text-[#e3e2e3] px-3 py-2 rounded-lg text-xs border border-[#343536]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                        Unit Cost (₹ INR)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newItemUnitCost}
                        onChange={(e) => setNewItemUnitCost(Number(e.target.value) || 1)}
                        className="w-full bg-[#292a2b] text-[#e3e2e3] px-3 py-2 rounded-lg text-xs border border-[#343536]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity to Inward & Target Metro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a]">
                      Quantity to Inward ({stockMode === 'existing' ? activeExistingItem?.unit : newItemUnit})
                    </label>
                  </div>
                  <input
                    type="number"
                    min="0.1"
                    step="any"
                    required
                    value={inwardQuantity}
                    onChange={(e) => setInwardQuantity(parseFloat(e.target.value) || 0)}
                    className="w-full bg-[#292a2b] text-[#ffc174] font-mono font-bold px-3.5 py-2 rounded-lg text-base border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  />
                  {/* Rapid Quick Fill Chips */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 5, 10, 25, 50].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setInwardQuantity(n)}
                        className="px-2 py-0.5 rounded bg-[#0d0e0f] hover:bg-[#343536] text-[10px] font-mono text-[#d8c3ad] hover:text-[#ffc174] border border-[#292a2b] cursor-pointer"
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                    Target Metro Outpost
                  </label>
                  <select
                    value={targetOutpost}
                    onChange={(e) => setTargetOutpost(e.target.value)}
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  >
                    <option value="Mumbai BKC Flagship">Mumbai BKC Flagship (BOM-HQ)</option>
                    <option value="New Delhi Lutyens">New Delhi Lutyens (DEL-01)</option>
                    <option value="Bengaluru Indiranagar">Bengaluru Indiranagar (BLR-01)</option>
                    <option value="Hyderabad Jubilee Hills">Hyderabad Jubilee Hills (HYD-01)</option>
                    <option value="Kolkata Park Street">Kolkata Park Street (CCU-01)</option>
                    <option value="Chennai Nungambakkam">Chennai Nungambakkam (MAA-01)</option>
                    <option value="All Metro Reserve Vaults">All Metro Reserve Vaults (Central Split)</option>
                  </select>
                </div>
              </div>

              {/* Requirement Reason & Storage Zone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                    Operational Requirement / Reason
                  </label>
                  <select
                    value={requirementReason}
                    onChange={(e) => setRequirementReason(e.target.value)}
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  >
                    <option value="Weekend Royal Banquet Prep">Weekend Royal Banquet Prep</option>
                    <option value="VIP Tasting Menu Allocation">VIP Tasting Menu Allocation</option>
                    <option value="Monsoon High-Demand Buffer">Monsoon High-Demand Buffer</option>
                    <option value="Emergency Kitchen Line-Cook Call">Emergency Kitchen Line-Cook Call</option>
                    <option value="Diwali & Wedding Season Advance">Diwali & Wedding Season Advance</option>
                    <option value="Routine Scheduled Par Replenishment">Routine Scheduled Par Replenishment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                    Storage Zone & IoT Sensor Unit
                  </label>
                  <select
                    value={storageZone}
                    onChange={(e) => setStorageZone(e.target.value)}
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  >
                    <option value="Himalayan Salt Dry-Ager #1">Himalayan Salt Dry-Ager #1 (Mumbai BKC)</option>
                    <option value="Grand Cru Vintage Vault Cellar 2">Grand Cru Vintage Vault (Bengaluru)</option>
                    <option value="Deep Spice & Botanical Preserve">Deep Spice & Preserve (New Delhi)</option>
                    <option value="Live Seafood Salt-Water Tank">Live Seafood Salt-Water Tank (Mumbai)</option>
                    <option value="Binchotan Fuel Dry Bunker">Binchotan Fuel Dry Bunker (All Nodes)</option>
                  </select>
                </div>
              </div>

              {/* Supplier & Batch Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                    Purveyor / Supplier
                  </label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Verified purveyor"
                    className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                    Batch / Waybill Reference
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g. LOT-2026-098"
                    className="w-full bg-[#292a2b] text-[#e3e2e3] font-mono px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  />
                </div>
              </div>

              {/* Live Preview Box with INR calculation */}
              <div className="p-4 rounded-xl bg-[#0d0e0f] border border-[#292a2b] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#a08e7a]">Inward Batch Financial Valuation:</span>
                  <span className="font-bold text-[#ffc174] font-mono text-base">
                    ₹
                    {(
                      (inwardQuantity || 0) *
                      (stockMode === 'existing'
                        ? activeExistingItem?.unitCost || 0
                        : newItemUnitCost || 0)
                    ).toLocaleString('en-IN')}{' '}
                    INR
                  </span>
                </div>
                {stockMode === 'existing' && activeExistingItem && (
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#292a2b]">
                    <span className="text-[#a08e7a]">Projected Stock on-Hand:</span>
                    <span className="text-[#56e5a9] font-bold font-mono">
                      {activeExistingItem.stockOnHand} {activeExistingItem.unit} →{' '}
                      {(activeExistingItem.stockOnHand + (inwardQuantity || 0)).toFixed(1)}{' '}
                      {activeExistingItem.unit}{' '}
                      (Par: {activeExistingItem.parLevel} {activeExistingItem.unit})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddStockOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Confirm & Inward Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
