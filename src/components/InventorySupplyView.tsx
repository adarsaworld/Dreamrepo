import React, { useState } from 'react';
import { INVENTORY_ITEMS } from '../data/mockData';
import { InventoryItem, InwardStockRecord, PredictiveParItem, PurchaseOrderRecord } from '../types';
import { INITIAL_PREDICTIVE_PAR_ITEMS, INITIAL_PURCHASE_ORDERS } from '../data/enterpriseData';
import { Tooltip } from './Tooltip';
import { DoubleDeleteConfirmModal } from './DoubleDeleteConfirmModal';

interface InventorySupplyViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const InventorySupplyView: React.FC<InventorySupplyViewProps> = ({ onShowToast }) => {
  const [items, setItems] = useState<InventoryItem[]>(INVENTORY_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [search, setSearch] = useState('');
  
  // Double Verification Delete Targets
  const [deleteStockTarget, setDeleteStockTarget] = useState<InventoryItem | null>(null);
  const [deletePOTarget, setDeletePOTarget] = useState<PurchaseOrderRecord | null>(null);

  // Predictive Supply Chain & Auto PO State
  const [predictiveItems, setPredictiveItems] = useState<PredictiveParItem[]>(INITIAL_PREDICTIVE_PAR_ITEMS);
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrderRecord[]>(INITIAL_PURCHASE_ORDERS);
  const [activeInventoryTab, setActiveInventoryTab] = useState<'inventory' | 'predictive_po'>('inventory');

  const handleConfirmDeleteStock = () => {
    if (!deleteStockTarget) return;
    setItems((prev) => prev.filter((i) => i.id !== deleteStockTarget.id));
    onShowToast(
      'Stock Asset Written Off & Deleted',
      `Permanently purged ${deleteStockTarget.name} (${deleteStockTarget.category}) from national supply ledger.`,
      'warning'
    );
    setDeleteStockTarget(null);
  };

  const handleConfirmDeletePO = () => {
    if (!deletePOTarget) return;
    setPurchaseOrders((prev) => prev.filter((p) => p.id !== deletePOTarget.id));
    onShowToast(
      'Purchase Order Cancelled & Deleted',
      `Voided PO ${deletePOTarget.poNumber} for ${deletePOTarget.supplierName}.`,
      'info'
    );
    setDeletePOTarget(null);
  };
  
  // Add Stock Modal State
  const [isAddStockOpen, setIsAddStockOpen] = useState(false);
  const [stockMode, setStockMode] = useState<'existing' | 'new'>('existing');
  
  // Modal Fields
  const [selectedItemId, setSelectedItemId] = useState<string>(items[0]?.id || '');
  const [inwardQuantity, setInwardQuantity] = useState<number>(5);
  const [targetOutpost, setTargetOutpost] = useState<string>('Mumbai BKC Flagship');
  const [requirementReason, setRequirementReason] = useState<string>('Weekend Royal Banquet Prep');
  const [supplierName, setSupplierName] = useState<string>('');
  const [batchNumber, setBatchNumber] = useState<string>('LOT-2026-098');
  const [storageZone, setStorageZone] = useState<string>('Himalayan Salt Dry-Ager #1');
  
  // New Item Fields
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<InventoryItem['category']>('Spices & Saffron');
  const [newItemUnit, setNewItemUnit] = useState('kg');
  const [newItemPar, setNewItemPar] = useState<number>(10);
  const [newItemUnitCost, setNewItemUnitCost] = useState<number>(1800);

  // Inwarding Activity Log
  const [inwardHistory, setInwardHistory] = useState<InwardStockRecord[]>([
    {
      id: 'REC-101',
      itemId: 'inv-1',
      itemName: 'Kashmiri Mongra Saffron (Grade A1)',
      quantityAdded: 2.5,
      unit: 'kg',
      outpost: 'Mumbai BKC Flagship',
      requirementReason: 'Diwali Tasting Menu Pre-Allocation',
      supplier: 'Pampore Royal Guild Cooperatives',
      totalCost: 1125000,
      timestamp: 'Today, 11:20 AM',
    },
    {
      id: 'REC-102',
      itemId: 'inv-4',
      itemName: 'Wild Himalayan Guchhi (Morel Mushrooms)',
      quantityAdded: 6,
      unit: 'kg',
      outpost: 'New Delhi Lutyens',
      requirementReason: 'VIP Degustation Night & Awadhi Dawat',
      supplier: 'Kashmir Valley Foragers Collective',
      totalCost: 192000,
      timestamp: 'Yesterday, 04:45 PM',
    },
  ]);
  const [showHistory, setShowHistory] = useState(false);

  // Financial Metrics (Calculated in INR)
  const totalValuation = items.reduce((acc, curr) => acc + curr.stockOnHand * curr.unitCost, 0);
  const criticalCount = items.filter((i) => i.urgency === 'critical').length;
  const warningCount = items.filter((i) => i.urgency === 'warning').length;

  const filtered = items.filter((item) => {
    const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.origin.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const activeExistingItem = items.find((i) => i.id === selectedItemId);

  // Quick Inline Add Stock
  const handleQuickAdd = (itemId: string, amount: number, e: React.MouseEvent) => {
    e.stopPropagation();
    const item = items.find((i) => i.id === itemId);
    if (!item) return;

    const newStock = Number((item.stockOnHand + amount).toFixed(2));
    const nextUrgency = newStock > item.parLevel ? 'optimal' : newStock > item.parLevel * 0.7 ? 'warning' : 'critical';
    const nextStatus = nextUrgency === 'optimal' ? 'Optimal Par' : nextUrgency === 'warning' ? 'Par Buffer Warning' : 'Critical Stock Depletion';

    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, stockOnHand: newStock, urgency: nextUrgency, status: nextStatus } : i))
    );

    const logRecord: InwardStockRecord = {
      id: `REC-${Date.now().toString().slice(-4)}`,
      itemId: item.id,
      itemName: item.name,
      quantityAdded: amount,
      unit: item.unit,
      outpost: 'Mumbai BKC Flagship',
      requirementReason: 'Quick Inline Allocation',
      supplier: item.supplier,
      totalCost: Math.round(amount * item.unitCost),
      timestamp: 'Just now',
    };
    setInwardHistory([logRecord, ...inwardHistory]);

    onShowToast(
      'Stock Inwarded Successfully',
      `Allocated +${amount} ${item.unit} to ${item.name}. New total: ${newStock} ${item.unit} (₹${Math.round(amount * item.unitCost).toLocaleString('en-IN')} INR).`
    );
  };

  // Open Full Add Stock Modal for a specific item
  const handleOpenAddStockModalForItem = (itemId: string) => {
    setSelectedItemId(itemId);
    const it = items.find((i) => i.id === itemId);
    if (it) {
      setSupplierName(it.supplier);
    }
    setStockMode('existing');
    setIsAddStockOpen(true);
  };

  // Submit Add Stock Modal
  const handleAddStockSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (stockMode === 'existing') {
      const item = items.find((i) => i.id === selectedItemId);
      if (!item) return;

      const qty = Number(inwardQuantity) || 0;
      const newStock = Number((item.stockOnHand + qty).toFixed(2));
      const nextUrgency = newStock > item.parLevel ? 'optimal' : newStock > item.parLevel * 0.7 ? 'warning' : 'critical';
      const nextStatus = nextUrgency === 'optimal' ? 'Optimal Par' : nextUrgency === 'warning' ? 'Par Buffer Warning' : 'Critical Stock Depletion';

      setItems((prev) =>
        prev.map((i) => (i.id === selectedItemId ? { ...i, stockOnHand: newStock, urgency: nextUrgency, status: nextStatus } : i))
      );

      const batchVal = Math.round(qty * item.unitCost);
      const logRecord: InwardStockRecord = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        itemId: item.id,
        itemName: item.name,
        quantityAdded: qty,
        unit: item.unit,
        outpost: targetOutpost,
        requirementReason: requirementReason,
        supplier: supplierName || item.supplier,
        totalCost: batchVal,
        timestamp: 'Just now',
      };
      setInwardHistory([logRecord, ...inwardHistory]);

      setIsAddStockOpen(false);
      onShowToast(
        'Admin Stock Inwarded',
        `Successfully added ${qty} ${item.unit} of ${item.name} to ${targetOutpost} (${storageZone}). Batch Value: ₹${batchVal.toLocaleString('en-IN')} INR.`
      );
    } else {
      // New Asset Cataloging
      if (!newItemName.trim()) return;

      const qty = Number(inwardQuantity) || 1;
      const par = Number(newItemPar) || 10;
      const cost = Number(newItemUnitCost) || 1000;

      const newItem: InventoryItem = {
        id: `inv-${Date.now().toString().slice(-4)}`,
        name: newItemName.trim(),
        category: newItemCategory,
        stockOnHand: qty,
        parLevel: par,
        unit: newItemUnit || 'kg',
        unitCost: cost,
        status: qty >= par ? 'Optimal Par' : 'Par Buffer Warning',
        urgency: qty >= par ? 'optimal' : 'warning',
        origin: targetOutpost,
        supplier: supplierName || 'Verified Indian Purveyor Guild',
        burnRate: '0.4 unit/day',
        reorderLeadTime: '2-3 Days',
        lastRestocked: new Date().toISOString().slice(0, 10),
      };

      setItems([newItem, ...items]);

      const batchVal = Math.round(qty * cost);
      const logRecord: InwardStockRecord = {
        id: `REC-${Date.now().toString().slice(-4)}`,
        itemId: newItem.id,
        itemName: newItem.name,
        quantityAdded: qty,
        unit: newItem.unit,
        outpost: targetOutpost,
        requirementReason: requirementReason,
        supplier: newItem.supplier,
        totalCost: batchVal,
        timestamp: 'Just now',
      };
      setInwardHistory([logRecord, ...inwardHistory]);

      setIsAddStockOpen(false);
      setNewItemName('');
      onShowToast(
        'New Asset Cataloged & Inwarded',
        `Added "${newItem.name}" to inventory at ${targetOutpost}. Stock: ${qty} ${newItem.unit} (₹${batchVal.toLocaleString('en-IN')} INR).`
      );
    }
  };

  const handleOrderReplenish = (itemName: string) => {
    onShowToast(
      'Purchase Order Dispatched',
      `PO dispatched to primary purveyor for ${itemName}. Delivery slotted within 48h to Central Cold Chain.`
    );
  };

  const handleAutoDispatchPO = (item: PredictiveParItem) => {
    const newPO: PurchaseOrderRecord = {
      id: `po-${Date.now().toString().slice(-4)}`,
      poNumber: `PO-KZ-2026-${Math.floor(100 + Math.random() * 900)}`,
      supplierName: item.primarySupplier,
      outpost: targetOutpost,
      totalItems: 1,
      estimatedCost: Math.round(item.recommendedPOQty * 15000),
      status: 'Dispatched to Vendor',
      dispatchChannel: 'WhatsApp Direct',
      dispatchedAt: new Date().toLocaleTimeString('en-IN', { hour12: true, hour: '2-digit', minute: '2-digit' }),
    };

    setPurchaseOrders([newPO, ...purchaseOrders]);
    onShowToast(
      'Automated PO Dispatched',
      `Sent ${newPO.poNumber} via WhatsApp Direct to ${item.primarySupplier} for ${item.recommendedPOQty} ${item.unit} ${item.ingredientName}.`,
      'success'
    );
  };

  const handleExportStockCSV = () => {
    const rows = [
      ['Item Code', 'Item Name', 'Category', 'Stock On-Hand', 'Unit', 'Par Level', 'Unit Cost INR', 'Total Value INR', 'Urgency Status', 'Supplier', 'Origin'],
      ...items.map((i) => [
        i.id,
        i.name,
        i.category,
        i.stockOnHand,
        i.unit,
        i.parLevel,
        i.unitCost,
        Math.round(i.stockOnHand * i.unitCost),
        i.urgency,
        i.supplier,
        i.origin,
      ]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `kizen_stock_valuation_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    onShowToast('Valuation CSV Exported', 'Stock ledger and INR unit valuation exported.');
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Header & Primary Admin Controls */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#92400e] bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a] shadow-xs">
              Autonomous Cold-Chain & Larder Logistics
            </span>
            <span className="text-xs text-[#047857] flex items-center gap-1 font-bold bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-[#047857] animate-pulse" />
              Indian Metros High-Value Vault
            </span>
          </div>
          <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
            Inventory Valuation, Par Levels & Stock Inwarding
          </h1>
          <p className="text-xs sm:text-sm text-[#57534e] max-w-3xl leading-relaxed">
            Real-time sensory cold-chain monitoring, automated replenishment triggers, and administrative stock allocation for saffron, wild morels, aged A2 ghee, and fine single malts in Indian Rupees (₹).
          </p>
        </div>

        {/* Action Buttons Cluster */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Main Add Stock Button */}
          <button
            type="button"
            onClick={() => {
              setStockMode('existing');
              setIsAddStockOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white text-xs font-bold shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_22px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">add_circle</span>
            <span>+ Add Stock / Inward Inventory</span>
          </button>

          <button
            onClick={() => onShowToast('Cold-Chain Scan Complete', 'All 18 IoT temperature sensors nominal across Mumbai, Delhi, Bengaluru & Hyderabad.')}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all shadow-xs cursor-pointer"
          >
            <span className="material-symbols-outlined text-base text-[#047857]">thermostat</span>
            <span className="hidden sm:inline">Sensor Audit (0.0° Variance)</span>
            <span className="sm:hidden">Audit</span>
          </button>

          <button
            onClick={handleExportStockCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all shadow-xs cursor-pointer"
            title="Download CSV Ledger"
          >
            <span className="material-symbols-outlined text-base text-[#78716c]">download</span>
            <span className="hidden sm:inline">Export CSV</span>
          </button>
        </div>
      </div>

      {/* Financial Valuation & Operational Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="p-5 rounded-2xl bg-white border border-[#e8decb] space-y-1 relative overflow-hidden shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#78716c] uppercase font-bold tracking-wider">
              Total Monitored Asset Value
            </span>
            <span className="material-symbols-outlined text-[#b45309] text-lg">payments</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#b45309]">
            ₹{Math.round(totalValuation).toLocaleString('en-IN')}
          </div>
          <div className="text-[11px] text-[#047857] flex items-center gap-1 font-bold">
            <span className="material-symbols-outlined text-xs">trending_up</span>
            <span>Across 6 Metro Outposts (INR)</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8decb] space-y-1 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#78716c] uppercase font-bold tracking-wider">
              Critical Par-Level Breaches
            </span>
            <span className="material-symbols-outlined text-[#b91c1c] text-lg">error</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#b91c1c]">
            {criticalCount} <span className="text-xs text-[#78716c] font-normal">lines low</span>
          </div>
          <div className="text-[11px] text-[#b91c1c] font-bold">
            Immediate reorder / inwarding required
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8decb] space-y-1 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#78716c] uppercase font-bold tracking-wider">
              Warning Buffer Items
            </span>
            <span className="material-symbols-outlined text-[#b45309] text-lg">warning</span>
          </div>
          <div className="text-2xl font-bold font-mono text-[#b45309]">
            {warningCount} <span className="text-xs text-[#78716c] font-normal">near par</span>
          </div>
          <div className="text-[11px] text-[#57534e]">
            PO recommended for weekend service
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-[#e8decb] space-y-1 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] hover:-translate-y-1 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#78716c] uppercase font-bold tracking-wider">
              Recent Admin Stock Inwardings
            </span>
            <button
              onClick={() => setShowHistory(!showHistory)}
              className="text-[10px] text-[#b45309] hover:underline font-bold cursor-pointer"
            >
              {showHistory ? 'Hide Ledger' : 'View Audit Log'}
            </button>
          </div>
          <div className="text-2xl font-bold font-mono text-[#047857]">
            {inwardHistory.length} <span className="text-xs text-[#78716c] font-normal">batches</span>
          </div>
          <div className="text-[11px] text-[#047857] font-bold">
            Fully reconciled with kitchen ledgers
          </div>
        </div>
      </div>

      {/* Inwarding Activity Ledger Drawer / Section (Collapsible) */}
      {showHistory && (
        <div className="bg-white border border-[#e8decb] rounded-2xl p-6 space-y-4 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] animate-fade-in">
          <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#b45309] text-lg">history_edu</span>
              <h3 className="font-headline font-bold text-sm text-[#1c1917]">
                Admin Stock Inwarding Audit Trail
              </h3>
            </div>
            <button
              onClick={() => setShowHistory(false)}
              className="text-xs text-[#78716c] hover:text-[#1c1917] font-bold cursor-pointer"
            >
              Close
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="bg-[#faf8f5] text-[#78716c] text-[10px] uppercase tracking-wider border-b border-[#e8decb]">
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Asset Inwarded</th>
                  <th className="py-2.5 px-3">Quantity Added</th>
                  <th className="py-2.5 px-3">Target Outpost</th>
                  <th className="py-2.5 px-3">Requirement Reason</th>
                  <th className="py-2.5 px-3 text-right">Batch Value (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f0ece1] text-[#1c1917]">
                {inwardHistory.map((rec) => (
                  <tr key={rec.id} className="hover:bg-[#faf8f5]">
                    <td className="py-2.5 px-3 text-[#78716c] font-mono">{rec.timestamp}</td>
                    <td className="py-2.5 px-3 font-bold text-[#1c1917]">{rec.itemName}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-[#047857]">
                      +{rec.quantityAdded} {rec.unit}
                    </td>
                    <td className="py-2.5 px-3 text-[#57534e]">{rec.outpost}</td>
                    <td className="py-2.5 px-3 text-[#78716c]">{rec.requirementReason}</td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#b45309]">
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
        <div className="p-4 rounded-2xl bg-white border border-[#e8decb] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-[#78716c] uppercase font-bold">Himalayan Salt Dry-Ager</span>
            <div className="text-xl font-bold font-mono text-[#047857]">1.2°C • 78% RH</div>
            <span className="text-[11px] text-[#57534e]">Mumbai BKC Central Cold Room</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#ecfdf5] text-[#047857] flex items-center justify-center border border-[#a7f3d0]">
            <span className="material-symbols-outlined text-xl">ac_unit</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e8decb] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-[#78716c] uppercase font-bold">Grand Cru Vintage Vault</span>
            <div className="text-xl font-bold font-mono text-[#047857]">12.4°C • 70% RH</div>
            <span className="text-[11px] text-[#57534e]">Bengaluru Indiranagar Reserve Cellar</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#fef3c7] text-[#b45309] flex items-center justify-center border border-[#fde68a]">
            <span className="material-symbols-outlined text-xl">wine_bar</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-[#e8decb] flex items-center justify-between shadow-xs">
          <div className="space-y-1">
            <span className="text-[10px] text-[#78716c] uppercase font-bold">Deep Spice & Larder Preserve</span>
            <div className="text-xl font-bold font-mono text-[#047857]">-2.1°C • Static Chill</div>
            <span className="text-[11px] text-[#57534e]">New Delhi Lutyens Specialty Larder</span>
          </div>
          <div className="h-10 w-10 rounded-xl bg-[#fef2f2] text-[#b91c1c] flex items-center justify-center border border-[#fecaca]">
            <span className="material-symbols-outlined text-xl">kitchen</span>
          </div>
        </div>
      </div>

      {/* Inventory & Predictive PO Sub-tabs */}
      <div className="flex items-center gap-2 bg-[#faf8f5] p-1.5 rounded-2xl border border-[#e8decb] w-max">
        <button
          onClick={() => setActiveInventoryTab('inventory')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeInventoryTab === 'inventory'
              ? 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917]'
          }`}
        >
          <span className="material-symbols-outlined text-base">inventory_2</span>
          <span>Monitored Vault Stock & Par Levels ({items.length})</span>
        </button>
        <button
          onClick={() => setActiveInventoryTab('predictive_po')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeInventoryTab === 'predictive_po'
              ? 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917]'
          }`}
        >
          <span className="material-symbols-outlined text-base">trending_up</span>
          <span>Predictive 72h Forecasting & Auto PO ({predictiveItems.length})</span>
        </button>
      </div>

      {activeInventoryTab === 'predictive_po' ? (
        /* Predictive 72h Par Burn & Automated PO Section */
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ea580c] to-[#b45309] text-white flex items-center justify-center">
                  <span className="material-symbols-outlined text-xl">auto_graph</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-base text-[#1c1917]">
                    72-Hour Autonomous Par Burn Heuristic Engine
                  </h3>
                  <p className="text-xs text-[#78716c]">
                    Integrates weekend VIP table reservations, monsoon weather surge models, and festival degustations
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                Weekend Rush + Monsoon Active
              </span>
            </div>

            {/* Predictive Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {predictiveItems.map((pred) => (
                <div key={pred.id} className="p-4 rounded-xl border border-[#e8decb] bg-[#faf8f5] space-y-3 shadow-xs">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-headline font-bold text-sm text-[#1c1917]">
                        {pred.ingredientName}
                      </h4>
                      <span className="text-[10px] text-[#78716c] uppercase font-bold">
                        {pred.category} • Supplier: {pred.primarySupplier}
                      </span>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        pred.urgency === 'critical'
                          ? 'bg-[#fef2f2] text-[#991b1b] border-[#fecaca]'
                          : pred.urgency === 'advisory'
                          ? 'bg-[#fffbeb] text-[#92400e] border-[#fde68a]'
                          : 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                      }`}
                    >
                      {pred.urgency === 'critical' ? 'PO Urgently Needed' : 'Advisory Par Buffer'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-white border border-[#e8decb] text-center">
                    <div>
                      <span className="text-[10px] text-[#78716c] uppercase font-bold block">Current Stock</span>
                      <span className="font-mono font-bold text-xs text-[#b45309]">
                        {pred.currentStock} {pred.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716c] uppercase font-bold block">72h Forecast Need</span>
                      <span className="font-mono font-bold text-xs text-[#1c1917]">
                        {pred.forecasted72hNeed} {pred.unit}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716c] uppercase font-bold block">Recommended PO</span>
                      <span className="font-mono font-bold text-xs text-[#047857]">
                        +{pred.recommendedPOQty} {pred.unit}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[#b45309] font-medium text-[11px]">
                      <span className="material-symbols-outlined text-xs">cloudy_snowing</span>
                      <span>{pred.weatherFactor}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#047857] font-medium text-[11px]">
                      <span className="material-symbols-outlined text-xs">celebration</span>
                      <span>{pred.festivalFactor}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#e8decb] flex items-center justify-between">
                    <span className="text-[11px] text-[#78716c] font-mono">
                      Vendor WhatsApp: {pred.supplierPhone}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAutoDispatchPO(pred)}
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#047857] to-[#059669] text-white font-bold text-xs shadow-xs hover:brightness-110 active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                    >
                      <span className="material-symbols-outlined text-xs">send</span>
                      <span>Dispatch PO (+{pred.recommendedPOQty} {pred.unit})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dispatched Purchase Orders Ledger */}
          <div className="bg-white border border-[#e8decb] rounded-2xl overflow-hidden shadow-xs space-y-3 p-5">
            <h4 className="font-headline font-bold text-sm text-[#1c1917]">
              Active Purchase Order Ledger (Auto-Dispatched)
            </h4>
            <div className="overflow-x-auto border border-[#e8decb] rounded-xl">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="bg-[#faf8f5] text-[#57534e] text-[10px] uppercase font-bold border-b border-[#e8decb]">
                    <th className="py-2.5 px-4">PO Number</th>
                    <th className="py-2.5 px-4">Purveyor Guild</th>
                    <th className="py-2.5 px-4">Metro Outpost</th>
                    <th className="py-2.5 px-4 text-right">Estimated Cost</th>
                    <th className="py-2.5 px-4">Dispatch Channel</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da]">
                  {purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-[#faf8f5]">
                      <td className="py-2.5 px-4 font-mono font-bold text-[#b45309]">{po.poNumber}</td>
                      <td className="py-2.5 px-4 font-semibold text-[#1c1917]">{po.supplierName}</td>
                      <td className="py-2.5 px-4 text-[#78716c]">{po.outpost}</td>
                      <td className="py-2.5 px-4 text-right font-mono font-bold text-[#047857]">
                        ₹{po.estimatedCost.toLocaleString('en-IN')}
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#faf8f5] text-[#1c1917] border border-[#e8decb]">
                          {po.dispatchChannel}
                        </span>
                      </td>
                      <td className="py-2.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]">
                          {po.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-4 text-right">
                        <Tooltip content="Cancel Purchase Order" subcontent="Double Verification Required">
                          <button
                            type="button"
                            onClick={() => setDeletePOTarget(po)}
                            className="p-1 rounded-lg text-[#78716c] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-sm">delete</span>
                          </button>
                        </Tooltip>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
      /* Main Stock Table */
      <div className="bg-white border border-[#e8decb] rounded-2xl overflow-hidden shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)]">
        {/* Table Filter Header */}
        <div className="p-4 bg-[#faf8f5] border-b border-[#e8decb] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <span className="material-symbols-outlined text-[#78716c] text-lg">search</span>
            <input
              type="text"
              placeholder="Search saffron, morels, ghee, lobster, wines..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white text-xs text-[#1c1917] placeholder:text-[#78716c] px-3.5 py-2 rounded-xl border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
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
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a]'
                    : 'bg-white text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5] border border-[#e8decb]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <span className="text-xs text-[#78716c] font-mono font-bold shrink-0">
            {filtered.length} priority inventory lines monitored
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-[#faf8f5] text-[#78716c] text-[10px] uppercase tracking-wider border-b border-[#e8decb]">
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
            <tbody className="divide-y divide-[#f0ece1] text-[#1c1917]">
              {filtered.map((item) => {
                const totalItemVal = Math.round(item.stockOnHand * item.unitCost);
                return (
                  <tr key={item.id} className="hover:bg-[#faf8f5] transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-headline font-bold text-sm text-[#1c1917]">
                            {item.name}
                          </span>
                          <span className="text-[9px] px-2 py-0.2 rounded-full bg-[#fef3c7] text-[#92400e] font-bold border border-[#fde68a]">
                            {item.category}
                          </span>
                        </div>
                        <span className="text-[11px] text-[#78716c] mt-0.5">
                          {item.origin} • {item.supplier}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-sm text-[#b45309]">
                      {item.stockOnHand} <span className="text-xs text-[#78716c] font-normal">{item.unit}</span>
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-[#57534e]">
                      {item.parLevel} {item.unit}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-[#57534e]">
                      ₹{item.unitCost.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right font-mono font-bold text-xs text-[#1c1917]">
                      ₹{totalItemVal.toLocaleString('en-IN')}
                    </td>
                    <td className="py-4 px-4 text-right font-mono text-xs text-[#78716c]">
                      {item.burnRate}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          item.urgency === 'critical'
                            ? 'bg-[#fef2f2] text-[#991b1b] border border-[#fecaca]'
                            : item.urgency === 'warning'
                            ? 'bg-[#fef3c7] text-[#92400e] border border-[#fde68a]'
                            : 'bg-[#ecfdf5] text-[#065f46] border border-[#a7f3d0]'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* Quick stock add */}
                        <Tooltip content={`Quick Add +${item.unit === 'kg' ? 2 : item.unit === 'bottles' ? 6 : 5} ${item.unit}`} subcontent="Instant Ledger Increment">
                          <button
                            type="button"
                            onClick={(e) => handleQuickAdd(item.id, item.unit === 'kg' ? 2 : item.unit === 'bottles' ? 6 : 5, e)}
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#ecfdf5] text-[#047857] font-mono text-xs font-bold border border-[#e8decb] hover:border-[#a7f3d0] transition-all cursor-pointer shadow-xs"
                          >
                            +{item.unit === 'kg' ? 2 : item.unit === 'bottles' ? 6 : 5}
                          </button>
                        </Tooltip>

                        {/* Open Modal with this item */}
                        <Tooltip content="Inward Verified Batch" subcontent="Record Invoice & Origin">
                          <button
                            type="button"
                            onClick={() => handleOpenAddStockModalForItem(item.id)}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] hover:bg-[#fde68a] text-[#92400e] font-bold text-xs border border-[#fde68a] transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                          >
                            <span className="material-symbols-outlined text-xs">add</span>
                            <span>Add Stock</span>
                          </button>
                        </Tooltip>

                        {/* Order PO */}
                        <Tooltip content="Replenish via Supplier" subcontent="Draft Purchase Requisition">
                          <button
                            type="button"
                            onClick={() => handleOrderReplenish(item.name)}
                            className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#faf8f5] text-[#78716c] hover:text-[#1c1917] font-bold text-xs border border-[#e8decb] transition-all cursor-pointer shadow-xs"
                          >
                            PO
                          </button>
                        </Tooltip>

                        {/* Delete / Write-off Stock Asset */}
                        <Tooltip content="Write-off / Delete Asset" subcontent="Double Verification Required">
                          <button
                            type="button"
                            onClick={() => setDeleteStockTarget(item)}
                            className="p-1.5 rounded-lg text-[#78716c] hover:text-[#dc2626] hover:bg-[#fef2f2] border border-transparent hover:border-[#fecaca] transition-all cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-base">delete</span>
                          </button>
                        </Tooltip>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Interactive Add Stock Modal for Admin */}
      {isAddStockOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] flex items-center justify-center text-white shadow-xs">
                  <span className="material-symbols-outlined text-xl">inventory</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-[#1c1917]">
                    Admin Stock Inwarding Console
                  </h3>
                  <p className="text-xs text-[#78716c]">
                    Add stock allocation based on operational & banquet requirements
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAddStockOpen(false)}
                className="p-1.5 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#faf8f5] transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-[#faf8f5] rounded-xl border border-[#e8decb]">
              <button
                type="button"
                onClick={() => setStockMode('existing')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  stockMode === 'existing'
                    ? 'bg-white text-[#92400e] shadow-sm font-bold border border-[#e8decb]'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <span className="material-symbols-outlined text-base text-[#b45309]">layers</span>
                <span>Restock Monitored Asset</span>
              </button>
              <button
                type="button"
                onClick={() => setStockMode('new')}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  stockMode === 'new'
                    ? 'bg-white text-[#92400e] shadow-sm font-bold border border-[#e8decb]'
                    : 'text-[#78716c] hover:text-[#1c1917]'
                }`}
              >
                <span className="material-symbols-outlined text-base text-[#b45309]">new_releases</span>
                <span>Catalog New Luxury Asset</span>
              </button>
            </div>

            <form onSubmit={handleAddStockSubmit} className="space-y-4">
              {stockMode === 'existing' ? (
                /* Select Existing Asset */
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                    Select Target Ingredient / Vintage
                  </label>
                  <select
                    value={selectedItemId}
                    onChange={(e) => {
                      setSelectedItemId(e.target.value);
                      const it = items.find((i) => i.id === e.target.value);
                      if (it) setSupplierName(it.supplier);
                    }}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2.5 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                        Asset Name
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Kashmiri Mongra Saffron Batch B"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                        Category
                      </label>
                      <select
                        value={newItemCategory}
                        onChange={(e) => setNewItemCategory(e.target.value as any)}
                        className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
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
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                        Unit
                      </label>
                      <input
                        type="text"
                        value={newItemUnit}
                        onChange={(e) => setNewItemUnit(e.target.value)}
                        placeholder="kg, Liters, bottles"
                        className="w-full bg-[#faf8f5] text-[#1c1917] px-3 py-2 rounded-xl text-xs border border-[#e8decb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                        Par Level Target
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newItemPar}
                        onChange={(e) => setNewItemPar(Number(e.target.value) || 1)}
                        className="w-full bg-[#faf8f5] text-[#1c1917] px-3 py-2 rounded-xl text-xs border border-[#e8decb]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                        Unit Cost (₹ INR)
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={newItemUnitCost}
                        onChange={(e) => setNewItemUnitCost(Number(e.target.value) || 1)}
                        className="w-full bg-[#faf8f5] text-[#1c1917] px-3 py-2 rounded-xl text-xs border border-[#e8decb]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Quantity to Inward & Target Metro */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c]">
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
                    className="w-full bg-[#faf8f5] text-[#b45309] font-mono font-bold px-3.5 py-2 rounded-xl text-base border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  />
                  {/* Rapid Quick Fill Chips */}
                  <div className="flex items-center gap-1.5 mt-2">
                    {[1, 2, 5, 10, 25, 50].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => setInwardQuantity(n)}
                        className="px-2.5 py-0.5 rounded-lg bg-white hover:bg-[#fef3c7] text-[10px] font-mono font-bold text-[#78716c] hover:text-[#b45309] border border-[#e8decb] cursor-pointer shadow-xs"
                      >
                        +{n}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                    Target Metro Outpost
                  </label>
                  <select
                    value={targetOutpost}
                    onChange={(e) => setTargetOutpost(e.target.value)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                    Operational Requirement / Reason
                  </label>
                  <select
                    value={requirementReason}
                    onChange={(e) => setRequirementReason(e.target.value)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                    Storage Zone & IoT Sensor Unit
                  </label>
                  <select
                    value={storageZone}
                    onChange={(e) => setStorageZone(e.target.value)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
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
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                    Purveyor / Supplier
                  </label>
                  <input
                    type="text"
                    value={supplierName}
                    onChange={(e) => setSupplierName(e.target.value)}
                    placeholder="Verified purveyor"
                    className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                    Batch / Waybill Reference
                  </label>
                  <input
                    type="text"
                    value={batchNumber}
                    onChange={(e) => setBatchNumber(e.target.value)}
                    placeholder="e.g. LOT-2026-098"
                    className="w-full bg-[#faf8f5] text-[#1c1917] font-mono px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  />
                </div>
              </div>

              {/* Live Preview Box with INR calculation */}
              <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#78716c] font-medium">Inward Batch Financial Valuation:</span>
                  <span className="font-bold text-[#b45309] font-mono text-base">
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
                  <div className="flex items-center justify-between text-xs pt-1 border-t border-[#e8decb]">
                    <span className="text-[#78716c]">Projected Stock on-Hand:</span>
                    <span className="text-[#047857] font-bold font-mono">
                      {activeExistingItem.stockOnHand} {activeExistingItem.unit} →{' '}
                      {(activeExistingItem.stockOnHand + (inwardQuantity || 0)).toFixed(1)}{' '}
                      {activeExistingItem.unit}{' '}
                      (Par: {activeExistingItem.parLevel} {activeExistingItem.unit})
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#f0ece1]">
                <button
                  type="button"
                  onClick={() => setIsAddStockOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e] text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">verified</span>
                  <span>Confirm & Inward Stock</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Double Verification Modal for Stock Asset Deletion / Write-Off */}
      <DoubleDeleteConfirmModal
        isOpen={!!deleteStockTarget}
        onClose={() => setDeleteStockTarget(null)}
        onConfirm={handleConfirmDeleteStock}
        itemName={deleteStockTarget ? `${deleteStockTarget.name} (${deleteStockTarget.category})` : ''}
        itemType="Inventory Stock Asset"
        itemSubdetails={deleteStockTarget ? `Stock on Hand: ${deleteStockTarget.stockOnHand} ${deleteStockTarget.unit} • Origin: ${deleteStockTarget.origin}` : undefined}
        warningNote="Writing off this inventory item permanently purges its record from all metro cold rooms and write-downs the asset valuation in the corporate trial balance."
        requireTyping={true}
      />

      {/* Double Verification Modal for Purchase Order Cancellation */}
      <DoubleDeleteConfirmModal
        isOpen={!!deletePOTarget}
        onClose={() => setDeletePOTarget(null)}
        onConfirm={handleConfirmDeletePO}
        itemName={deletePOTarget ? `PO #${deletePOTarget.poNumber} (${deletePOTarget.supplierName})` : ''}
        itemType="Purchase Order"
        itemSubdetails={deletePOTarget ? `Estimated Value: ₹${deletePOTarget.estimatedCost.toLocaleString('en-IN')} • Outpost: ${deletePOTarget.outpost}` : undefined}
        warningNote="Cancelling this purchase order revokes the automated supply dispatch, notifies the vendor via webhook/WhatsApp, and clears the par replenishment buffer."
        requireTyping={true}
      />
    </div>
  );
};
