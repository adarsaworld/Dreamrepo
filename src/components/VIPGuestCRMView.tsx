import React, { useState } from 'react';
import { VIPGuestRecord, AllergenHazard } from '../types';
import { INITIAL_VIP_GUESTS, COMMON_ALLERGEN_HAZARDS } from '../data/enterpriseData';
import { Tooltip } from './Tooltip';
import { DoubleDeleteConfirmModal } from './DoubleDeleteConfirmModal';

interface VIPGuestCRMViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
  onNavigateTab?: (tab: any) => void;
}

export const VIPGuestCRMView: React.FC<VIPGuestCRMViewProps> = ({ onShowToast }) => {
  const [guests, setGuests] = useState<VIPGuestRecord[]>(INITIAL_VIP_GUESTS);
  const [allergens] = useState<AllergenHazard[]>(COMMON_ALLERGEN_HAZARDS);
  const [activeTab, setActiveTab] = useState<'guests' | 'allergen_shield'>('guests');
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [selectedGuest, setSelectedGuest] = useState<VIPGuestRecord | null>(null);

  // Double Verification Delete Target
  const [deleteGuestTarget, setDeleteGuestTarget] = useState<VIPGuestRecord | null>(null);

  const handleConfirmDeleteGuest = () => {
    if (!deleteGuestTarget) return;
    setGuests((prev) => prev.filter((g) => g.id !== deleteGuestTarget.id));
    onShowToast(
      'VIP Patron Dossier Deleted',
      `Permanently purged ${deleteGuestTarget.salutation} ${deleteGuestTarget.name} from the national luxury ledger.`,
      'warning'
    );
    setDeleteGuestTarget(null);
    setSelectedGuest(null);
  };

  // New Guest Modal
  const [isAddGuestOpen, setIsAddGuestOpen] = useState(false);
  const [newSalutation, setNewSalutation] = useState('Maharaja');
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('+91 98200 ');
  const [newEmail, setNewEmail] = useState('');
  const [newTier, setNewTier] = useState<VIPGuestRecord['vipTier']>('Kohinoor Patron');
  const [newOutpost, setNewOutpost] = useState('Mumbai BKC Flagship');
  const [newDiet, setNewDiet] = useState<VIPGuestRecord['dietaryPreference']>('Strict Jain');
  const [newTable, setNewTable] = useState('Table 12 (Royal Durbar Alcove)');
  const [newNotes, setNewNotes] = useState('Prefers pure Jain handi preparation, extra saffron sheermal.');

  // Allergen Hazard Simulation
  const [simGuestId, setSimGuestId] = useState<string>(guests[1]?.id || '');
  const [simDishAllergen, setSimDishAllergen] = useState<string>('Onion / Garlic Zero Tolerance');

  const filteredGuests = guests.filter((g) => {
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.primaryOutpost.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = tierFilter === 'all' || g.vipTier === tierFilter;
    return matchesSearch && matchesTier;
  });

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const guest: VIPGuestRecord = {
      id: `vip-${Date.now()}`,
      salutation: newSalutation,
      name: newName.trim(),
      vipTier: newTier,
      phone: newPhone,
      email: newEmail || `${newName.toLowerCase().replace(/\s+/g, '.')}@patron.kizen.in`,
      primaryOutpost: newOutpost,
      lifetimeSpend: 500000,
      visitsCount: 1,
      preferredTable: newTable,
      dietaryPreference: newDiet,
      allergenFlags: newDiet === 'Strict Jain' ? ['Alliums (Onion/Garlic)', 'Root Vegetables'] : [],
      favoriteDishes: ['Awadhi Royal Degustation Flight'],
      preferredVintage: 'Reserve Himalayan Botanical Juniper',
      specialOccasion: 'Annual Executive Dinner',
      conciergeNotes: newNotes,
      lastVisitDate: 'Today (Onboarded)',
    };

    setGuests([guest, ...guests]);
    setIsAddGuestOpen(false);
    onShowToast('VIP Dossier Created', `Registered ${guest.salutation} ${guest.name} under ${guest.vipTier}.`, 'success');
  };

  const currentSimGuest = guests.find((g) => g.id === simGuestId) || guests[0];
  const hasConflict = currentSimGuest?.allergenFlags.some((f) =>
    f.toLowerCase().includes(simDishAllergen.toLowerCase())
  );

  return (
    <div className="flex flex-col w-full space-y-6 animate-fade-in">
      {/* Top Banner */}
      <div className="bg-white border border-[#e8decb] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-r from-[#b45309] to-[#ea580c] flex items-center justify-center text-white shadow-xs">
            <span className="material-symbols-outlined text-2xl">diamond</span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-headline font-bold text-xl text-[#1c1917]">
                Cross-Branch VIP Guest CRM & Allergen Shield
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#fef3c7] text-[#92400e] border border-[#fde68a]">
                6 Metros Linked
              </span>
            </div>
            <p className="text-xs text-[#78716c]">
              Autonomous loyalty recognition, cross-metro table preferences & FSSAI allergen hazard protection
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsAddGuestOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">person_add</span>
            <span>+ Enroll VIP Patron</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 bg-[#faf8f5] p-1.5 rounded-2xl border border-[#e8decb] w-max">
        <button
          onClick={() => setActiveTab('guests')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'guests'
              ? 'bg-gradient-to-r from-[#b45309] to-[#ea580c] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917]'
          }`}
        >
          <span className="material-symbols-outlined text-base">badge</span>
          <span>National VIP Ledger ({guests.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('allergen_shield')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'allergen_shield'
              ? 'bg-gradient-to-r from-[#b45309] to-[#ea580c] text-white shadow-xs'
              : 'text-[#57534e] hover:text-[#1c1917]'
          }`}
        >
          <span className="material-symbols-outlined text-base">health_and_safety</span>
          <span>Automated FSSAI Allergen Shield</span>
        </button>
      </div>

      {/* TAB 1: VIP Guest Directory */}
      {activeTab === 'guests' && (
        <div className="space-y-4">
          {/* Search & Filter Bar */}
          <div className="bg-white border border-[#e8decb] p-3.5 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2 flex-1 max-w-sm">
              <span className="material-symbols-outlined text-[#78716c] text-lg">search</span>
              <input
                type="text"
                placeholder="Search VIP by name, phone, outpost, tier..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white text-xs px-3 py-1.5 rounded-xl border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#b45309]/50"
              />
            </div>

            <div className="flex items-center gap-2">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-white text-xs font-bold px-3 py-2 rounded-xl border border-[#e8decb] cursor-pointer"
              >
                <option value="all">All VIP Tiers</option>
                <option value="Kohinoor Patron">Kohinoor Patron</option>
                <option value="Maharaja Guild">Maharaja Guild</option>
                <option value="Durbar Member">Durbar Member</option>
                <option value="Heritage Reserve">Heritage Reserve</option>
              </select>
            </div>
          </div>

          {/* Guest Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGuests.map((guest) => (
              <div
                key={guest.id}
                onClick={() => setSelectedGuest(guest)}
                className="bg-white border border-[#e8decb] rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-[#b45309]/50 transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-[#b45309] font-serif italic">
                          {guest.salutation}
                        </span>
                        <h3 className="font-headline font-bold text-base text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                          {guest.name}
                        </h3>
                      </div>
                      <span className="text-xs text-[#78716c] block font-mono mt-0.5">
                        {guest.phone} • {guest.primaryOutpost}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        guest.vipTier === 'Kohinoor Patron'
                          ? 'bg-[#fef3c7] text-[#92400e] border-[#fde68a]'
                          : guest.vipTier === 'Maharaja Guild'
                          ? 'bg-[#ecfdf5] text-[#065f46] border-[#a7f3d0]'
                          : 'bg-[#faf8f5] text-[#78716c] border-[#e8decb]'
                      }`}
                    >
                      {guest.vipTier}
                    </span>
                  </div>

                  {/* Spending & Visits */}
                  <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] text-center">
                    <div>
                      <span className="text-[10px] text-[#78716c] uppercase font-bold block">Spend</span>
                      <span className="font-mono font-bold text-xs text-[#b45309]">
                        ₹{(guest.lifetimeSpend / 100000).toFixed(1)}L
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716c] uppercase font-bold block">Visits</span>
                      <span className="font-mono font-bold text-xs text-[#1c1917]">
                        {guest.visitsCount}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#78716c] uppercase font-bold block">Diet</span>
                      <span className="font-bold text-[11px] text-[#047857] truncate block">
                        {guest.dietaryPreference}
                      </span>
                    </div>
                  </div>

                  {/* Allergens & Dietary */}
                  {guest.allergenFlags.length > 0 && (
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {guest.allergenFlags.map((flag, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#fef2f2] text-[#991b1b] border border-[#fecaca] flex items-center gap-1"
                        >
                          <span className="material-symbols-outlined text-[10px]">warning</span>
                          <span>{flag}</span>
                        </span>
                      ))}
                    </div>
                  )}

                  <p className="text-xs text-[#57534e] line-clamp-2 leading-relaxed">
                    <strong>Concierge Note:</strong> {guest.conciergeNotes}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#f0ece1] flex items-center justify-between text-xs text-[#78716c]">
                  <span>Last Visit: <strong className="text-[#1c1917]">{guest.lastVisitDate}</strong></span>
                  <div className="flex items-center gap-2">
                    <Tooltip content="Inspect VIP Dossier" subcontent="Cross-Metro History">
                      <span className="text-[#b45309] font-bold group-hover:underline flex items-center gap-0.5 cursor-pointer">
                        <span>Full Dossier</span>
                        <span className="material-symbols-outlined text-xs">arrow_forward</span>
                      </span>
                    </Tooltip>
                    <Tooltip content="Delete VIP Dossier" subcontent="Double Verification Required">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteGuestTarget(guest);
                        }}
                        className="p-1 rounded-lg text-[#78716c] hover:text-[#dc2626] hover:bg-[#fef2f2] transition-colors cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-sm">delete</span>
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Automated FSSAI Allergen Shield */}
      {activeTab === 'allergen_shield' && (
        <div className="space-y-6">
          {/* Interactive POS Hazard Simulator */}
          <div className="bg-white border border-[#e8decb] rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-[#f0ece1]">
              <span className="material-symbols-outlined text-xl text-[#dc2626]">shield</span>
              <div>
                <h3 className="font-headline font-bold text-base text-[#1c1917]">
                  Real-Time Allergen Hazard Interceptor
                </h3>
                <p className="text-xs text-[#78716c]">
                  Simulate live POS/KDS clash detection when punching orders for guests with flagged medical or religious sensitivities.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                  Select Registered VIP Patron
                </label>
                <select
                  value={simGuestId}
                  onChange={(e) => setSimGuestId(e.target.value)}
                  className="w-full bg-[#faf8f5] text-xs font-bold p-2.5 rounded-xl border border-[#e8decb]"
                >
                  {guests.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.salutation} {g.name} ({g.dietaryPreference})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1">
                  Candidate Dish Ingredient / Recipe Tag
                </label>
                <select
                  value={simDishAllergen}
                  onChange={(e) => setSimDishAllergen(e.target.value)}
                  className="w-full bg-[#faf8f5] text-xs font-bold p-2.5 rounded-xl border border-[#e8decb]"
                >
                  <option value="Onion / Garlic Zero Tolerance">Alliums (Standard Onion/Garlic Curry)</option>
                  <option value="Peanuts">Peanut / Tree Nut Paste (Korma Base)</option>
                  <option value="Dairy">Cow Milk Ghee / Cream (Dal Kizen)</option>
                  <option value="Crustacean Shellfish">Prawns / Crab Extract</option>
                  <option value="Gluten">Wheat Maida (Warqi Naan)</option>
                </select>
              </div>
            </div>

            {/* Clash Result Box */}
            <div
              className={`p-4 rounded-xl border flex items-start gap-3 transition-colors ${
                hasConflict
                  ? 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
                  : 'bg-[#ecfdf5] border-[#a7f3d0] text-[#065f46]'
              }`}
            >
              <span className="material-symbols-outlined text-2xl shrink-0 mt-0.5">
                {hasConflict ? 'dangerous' : 'check_circle'}
              </span>
              <div className="space-y-1">
                <h4 className="font-bold text-sm">
                  {hasConflict
                    ? 'CRITICAL HAZARD INTERCEPTED: Dish Blocked at POS'
                    : 'FSSAI Safety Clearance: Approved for Preparation'}
                </h4>
                <p className="text-xs leading-relaxed">
                  {hasConflict
                    ? `Guest "${currentSimGuest.name}" has strict allergy rule matching "${simDishAllergen}". Order cannot be pushed to KDS without head chef override and kitchen vessel sanitization voucher.`
                    : `No dietary conflicts detected between "${currentSimGuest.name}" and the selected culinary parameters. Proceed with standard KDS firing.`}
                </p>
              </div>
            </div>
          </div>

          {/* FSSAI Allergen Matrix */}
          <div className="bg-white border border-[#e8decb] rounded-2xl overflow-hidden shadow-xs">
            <div className="p-4 bg-[#faf8f5] border-b border-[#e8decb]">
              <h3 className="font-headline font-bold text-sm text-[#1c1917]">
                FSSAI Schedule 4 Mandatory Allergen Matrix (India)
              </h3>
            </div>

            <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {allergens.map((al) => (
                <div key={al.id} className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-xl text-[#b45309]">{al.icon}</span>
                    <h4 className="font-bold text-sm text-[#1c1917]">{al.allergenName}</h4>
                  </div>
                  <div className="text-xs text-[#57534e]">
                    <strong>Common In:</strong> {al.commonInDishes.join(', ')}
                  </div>
                  <p className="text-[11px] text-[#78716c] bg-white p-2 rounded-lg border border-[#e8decb] leading-tight">
                    {al.fssaiRegulationNote}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODAL 1: VIP Guest Full Dossier */}
      {selectedGuest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div>
                <span className="text-xs text-[#b45309] font-serif italic">{selectedGuest.salutation}</span>
                <h3 className="font-headline font-bold text-xl text-[#1c1917]">{selectedGuest.name}</h3>
                <span className="text-xs text-[#78716c] font-mono">{selectedGuest.phone}</span>
              </div>
              <button
                onClick={() => setSelectedGuest(null)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#78716c] block">VIP Tier & Spend</span>
                <div className="text-sm font-bold text-[#b45309]">
                  {selectedGuest.vipTier} • ₹{selectedGuest.lifetimeSpend.toLocaleString('en-IN')} Lifetime Billing
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#78716c] block">Table & Outpost Preference</span>
                <div className="text-xs font-semibold text-[#1c1917]">
                  {selectedGuest.preferredTable} • {selectedGuest.primaryOutpost}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#78716c] block">Favorite Courses & Spirits</span>
                <div className="text-xs text-[#1c1917]">{selectedGuest.favoriteDishes.join(' • ')}</div>
                <div className="text-[11px] text-[#b45309] font-mono font-bold mt-1">Vintage: {selectedGuest.preferredVintage}</div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#78716c] block">Protocol Instructions</span>
                <p className="text-xs text-[#57534e] leading-relaxed">{selectedGuest.conciergeNotes}</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#f0ece1]">
              <Tooltip content="Permanently Purge Dossier" subcontent="Double Verification Required">
                <button
                  type="button"
                  onClick={() => setDeleteGuestTarget(selectedGuest)}
                  className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#fef2f2] text-[#dc2626] text-xs font-bold border border-[#fecaca] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  <span className="material-symbols-outlined text-sm">delete</span>
                  <span>Delete Dossier</span>
                </button>
              </Tooltip>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedGuest(null)}
                  className="px-4 py-2 rounded-xl bg-[#faf8f5] text-xs font-bold text-[#57534e]"
                >
                  Close Dossier
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onShowToast('Table Pre-Assigned', `Reserved ${selectedGuest.preferredTable} for ${selectedGuest.name}.`, 'success');
                    setSelectedGuest(null);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#b45309] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110"
                >
                  Reserve Preferred Table
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Add New VIP Guest */}
      {isAddGuestOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <h3 className="font-headline font-bold text-lg text-[#1c1917]">Enroll National VIP Patron</h3>
              <button
                onClick={() => setIsAddGuestOpen(false)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <form onSubmit={handleAddGuest} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#78716c] mb-1">Title</label>
                  <select
                    value={newSalutation}
                    onChange={(e) => setNewSalutation(e.target.value)}
                    className="w-full bg-[#faf8f5] text-xs font-bold p-2.5 rounded-xl border border-[#e8decb]"
                  >
                    <option value="Maharaja">Maharaja</option>
                    <option value="Princess">Princess</option>
                    <option value="Dr.">Dr.</option>
                    <option value="Mr.">Mr.</option>
                    <option value="Mrs.">Mrs.</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-[#78716c] mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikramaditya Birla"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full bg-[#faf8f5] text-xs p-2.5 rounded-xl border border-[#e8decb]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#78716c] mb-1">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={newPhone}
                    onChange={(e) => setNewPhone(e.target.value)}
                    className="w-full bg-[#faf8f5] font-mono text-xs p-2.5 rounded-xl border border-[#e8decb]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#78716c] mb-1">VIP Tier</label>
                  <select
                    value={newTier}
                    onChange={(e) => setNewTier(e.target.value as any)}
                    className="w-full bg-[#faf8f5] text-xs font-bold p-2.5 rounded-xl border border-[#e8decb]"
                  >
                    <option value="Kohinoor Patron">Kohinoor Patron</option>
                    <option value="Maharaja Guild">Maharaja Guild</option>
                    <option value="Durbar Member">Durbar Member</option>
                    <option value="Heritage Reserve">Heritage Reserve</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#78716c] mb-1">Dietary Preference</label>
                  <select
                    value={newDiet}
                    onChange={(e) => setNewDiet(e.target.value as any)}
                    className="w-full bg-[#faf8f5] text-xs font-bold p-2.5 rounded-xl border border-[#e8decb]"
                  >
                    <option value="Strict Jain">Strict Jain (No Alliums)</option>
                    <option value="Non-Vegetarian Halal">Non-Vegetarian Halal</option>
                    <option value="Pescatarian">Pescatarian</option>
                    <option value="Gluten-Free Pure">Gluten-Free Pure</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#78716c] mb-1">Preferred Outpost</label>
                  <select
                    value={newOutpost}
                    onChange={(e) => setNewOutpost(e.target.value)}
                    className="w-full bg-[#faf8f5] text-xs font-bold p-2.5 rounded-xl border border-[#e8decb]"
                  >
                    <option value="Mumbai BKC Flagship">Mumbai BKC Flagship</option>
                    <option value="New Delhi Lutyens">New Delhi Lutyens</option>
                    <option value="Bengaluru Indiranagar">Bengaluru Indiranagar</option>
                    <option value="Hyderabad Jubilee Hills">Hyderabad Jubilee Hills</option>
                    <option value="Kolkata Park Street">Kolkata Park Street</option>
                    <option value="Chennai Nungambakkam">Chennai Nungambakkam</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#78716c] mb-1">VIP Concierge Notes</label>
                <textarea
                  rows={2}
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full bg-[#faf8f5] text-xs p-2.5 rounded-xl border border-[#e8decb]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#f0ece1]">
                <button
                  type="button"
                  onClick={() => setIsAddGuestOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#faf8f5] text-xs font-bold text-[#57534e]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-[#b45309] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110"
                >
                  Save to National Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Double Verification Modal for VIP Guest Deletion */}
      <DoubleDeleteConfirmModal
        isOpen={!!deleteGuestTarget}
        onClose={() => setDeleteGuestTarget(null)}
        onConfirm={handleConfirmDeleteGuest}
        itemName={deleteGuestTarget ? `${deleteGuestTarget.salutation} ${deleteGuestTarget.name}` : ''}
        itemType="VIP Guest Dossier"
        itemSubdetails={deleteGuestTarget ? `Tier: ${deleteGuestTarget.vipTier} • Lifetime Spend: ₹${(deleteGuestTarget.lifetimeSpend / 100000).toFixed(1)} Lakhs • Outpost: ${deleteGuestTarget.primaryOutpost}` : undefined}
        warningNote="Purging this guest profile permanently removes their concierge notes, allergen sensitivity flags, table preferences, and lifetime loyalty tier from all 6 metropolitan outposts."
        requireTyping={true}
      />
    </div>
  );
};
