import React, { useState } from 'react';
import { MenuItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/mockData';
import { Tooltip } from './Tooltip';
import { DoubleDeleteConfirmModal } from './DoubleDeleteConfirmModal';

interface MenuStudioViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const MenuStudioView: React.FC<MenuStudioViewProps> = ({ onShowToast }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('starters');
  const [dishTitle, setDishTitle] = useState('Truffle Galouti Tartlet & 24K Vark');
  const [dishDesc, setDishDesc] = useState(
    'Melt-in-mouth Awadhi smoked lamb pate slow-cooked with 32 secret spices, infused with Himalayan black truffle oil, served on saffron sheermal crisps with bone marrow emulsion and edible gold foil.'
  );
  const [salePrice, setSalePrice] = useState<number>(4850);
  const [cogsPrice, setCogsPrice] = useState<number>(1250);
  const [tags, setTags] = useState<string[]>([
    'Awadhi Heritage',
    'Halal-Audited (Cert #H-921)',
    '24K Gold Leaf',
    'Nut Allergy Alert: Safe',
    'Royal Spice Guild Certified',
  ]);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  // Double Verification Delete Target
  const [deleteDishTarget, setDeleteDishTarget] = useState<{ title: string; category?: string; code?: string } | null>(null);

  // Branch activation checkboxes for Indian metros
  const [branchActive, setBranchActive] = useState({
    mumbai: true,
    delhi: true,
    bengaluru: true,
    hyderabad: false,
  });

  const handleConfirmDeleteDish = () => {
    if (!deleteDishTarget) return;
    onShowToast(
      'Dish Purged from Master Catalog',
      `Permanently removed "${deleteDishTarget.title}" from active degustation and aggregator APIs.`,
      'warning'
    );
    setDeleteDishTarget(null);
  };

  // Modals
  const [deployModalOpen, setDeployModalOpen] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploySuccess, setDeploySuccess] = useState(false);

  const [previewModalOpen, setPreviewModalOpen] = useState(false);
  const [syncPercentage, setSyncPercentage] = useState(92);
  const [isFlushing, setIsFlushing] = useState(false);

  // Calculate margin
  const grossMargin = salePrice > 0 ? (((salePrice - cogsPrice) / salePrice) * 100).toFixed(1) : '0';

  const handleForceSync = () => {
    setIsFlushing(true);
    setTimeout(() => {
      setIsFlushing(false);
      setSyncPercentage(100);
      onShowToast('Indian Metro Gateways Synchronized', '0ms latency achieved across all 18 POS terminals and 140 QR tables.');
    }, 1400);
  };

  const handleExecuteDeploy = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setIsDeploying(false);
      setDeploySuccess(true);
      setTimeout(() => {
        setDeploySuccess(false);
        setDeployModalOpen(false);
        onShowToast('Royal Degustation V3.4 Deployed', 'All metro edge nodes compiled and published to live tables.');
      }, 1000);
    }, 1300);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTagInput.trim() && !tags.includes(newTagInput.trim())) {
      setTags([...tags, newTagInput.trim()]);
      setNewTagInput('');
      setShowAddTagInput(false);
      onShowToast('Certification Tag Attached', `Added "${newTagInput.trim()}" to compliance matrix.`);
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
    onShowToast('Tag Removed', `Removed "${tagToRemove}".`);
  };

  const handleRestoreVaultItem = (code: string, name: string) => {
    onShowToast('Catalog Restored', `Restored ${name} (${code}) to active staging ledger.`, 'info');
  };

  return (
    <div className="flex flex-col w-full space-y-8">
      {/* Top Banner / Publish Console */}
      <section className="relative overflow-hidden rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)]">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#f59e0b]/15 to-transparent blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#92400e] bg-[#fef3c7] px-3 py-1 rounded-full border border-[#fde68a] shadow-xs">
                Syndicate National Master Catalog
              </span>
              <span className="text-xs text-[#047857] flex items-center gap-1.5 font-bold bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-[#047857] animate-pulse" />
                Multi-POS Sync Engine Active
              </span>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#1c1917] tracking-tight">
                Menu Studio & Omnichannel Distribution
              </h1>
              <span className="text-xs text-[#78716c] font-mono font-bold bg-[#faf8f5] px-2 py-0.5 rounded border border-[#e8decb]">
                v3.4-IND-STAGED
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#57534e]">
              <span className="material-symbols-outlined text-base text-[#b45309]">edit_calendar</span>
              <span>
                Active Draft: <strong className="text-[#1c1917]">Royal Awadhi Degustation & Dawat V3.4 (Staged)</strong> — 42 total items ready for national distribution
              </span>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <Tooltip content="Digital Guest Tablet Preview" subcontent="120Hz OLED Emulation">
              <button
                onClick={() => setPreviewModalOpen(true)}
                type="button"
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#b45309]">view_in_ar</span>
                <span>Preview Digital Menu</span>
              </button>
            </Tooltip>

            <Tooltip content="Inter-State Tax Compliance Audit" subcontent="CGST/SGST/IGST Verification">
              <button
                onClick={() => onShowToast('Inter-State Tax Verified', 'GST calibration verified across Maharashtra, Delhi-NCR, Karnataka, and Telangana.')}
                type="button"
                className="flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 shadow-xs transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base text-[#78716c]">currency_exchange</span>
                <span>GST & Pricing Audit</span>
              </button>
            </Tooltip>

            <Tooltip content="Publish to All Indian Metros" subcontent="Edge Cache Invalidation">
              <button
                onClick={() => setDeployModalOpen(true)}
                type="button"
                className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white text-xs font-bold shadow-[0_4px_16px_rgba(245,158,11,0.35)] hover:shadow-[0_6px_22px_rgba(245,158,11,0.5)] hover:-translate-y-0.5 active:translate-y-0 transition-all cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">rocket_launch</span>
                <span>Deploy / Distribute to Metros</span>
              </button>
            </Tooltip>
          </div>
        </div>
      </section>

      {/* Two-Column Studio Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column (60%): Interactive Menu Builder & Dish Editor */}
        <div className="lg:col-span-7 flex flex-col space-y-4">
          {/* Category Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'starters', label: 'Starters & Chaat' },
              { id: 'tandoor', label: 'Tandoor & Dum Pukht Mains' },
              { id: 'omakase', label: 'Royal Thali & Omakase' },
              { id: 'cellar', label: 'Wines & Single Malts' },
              { id: 'delivery', label: 'Delivery Exclusives' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  onShowToast('Category Selected', `Displaying active items for ${cat.label}.`);
                }}
                className={`whitespace-nowrap px-3.5 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-[#fef3c7] to-[#fffbeb] text-[#92400e] border border-[#fde68a] shadow-sm'
                    : 'bg-white text-[#57534e] hover:text-[#1c1917] hover:bg-[#faf8f5] border border-[#e8decb]'
                }`}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Dish Card in High-Precision Edit Mode */}
          <div className="rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-5">
            {/* Header & Fast-Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#f0ece1]">
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c]">
                    Selected Item #0482-OM
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dishTitle}
                    onChange={(e) => setDishTitle(e.target.value)}
                    className="bg-[#faf8f5] text-[#1c1917] font-headline font-bold text-lg px-3 py-1.5 rounded-xl w-full max-w-md focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50 border border-[#e8decb]"
                  />
                  <Tooltip content="Delete Dish from Catalog" subcontent="Double Verification Required">
                    <button
                      type="button"
                      onClick={() => setDeleteDishTarget({ title: dishTitle, category: selectedCategory, code: '#0482-OM' })}
                      className="p-2 rounded-xl text-[#78716c] hover:text-[#dc2626] hover:bg-[#fef2f2] border border-transparent hover:border-[#fecaca] transition-all cursor-pointer flex items-center justify-center shrink-0"
                    >
                      <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                  </Tooltip>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#ecfdf5] p-1.5 rounded-xl border border-[#a7f3d0] shrink-0 self-start sm:self-auto">
                <span className="material-symbols-outlined text-[#047857] text-base ml-1">videocam</span>
                <span className="text-[11px] font-bold text-[#065f46] px-1">AR/Video Preview</span>
                <Tooltip content="Launch 3D Visualizer" subcontent="AR Spatial Plating">
                  <button
                    type="button"
                    onClick={() => setPreviewModalOpen(true)}
                    className="px-2.5 py-1 rounded-lg bg-white hover:bg-[#faf8f5] text-[#1c1917] text-[11px] font-bold border border-[#a7f3d0] transition-all cursor-pointer shadow-xs"
                  >
                    Interactive Mode
                  </button>
                </Tooltip>
              </div>
            </div>

            {/* Visual Media & Description Bento */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative group overflow-hidden rounded-2xl bg-[#faf8f5] aspect-video md:aspect-auto h-48 md:h-full border border-[#e8decb] shadow-xs">
                <img
                  className="w-full h-full object-cover rounded-2xl transition-transform duration-500 group-hover:scale-105"
                  alt="Truffle Galouti Tartlet"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcYCWWrgCEprsr0TFuKco5314Fxmz0hx7O5PTrCBQDaGGqU5bBX0_8pKR2P-E0KT4Wk_0UdwKaJNUj6DFHvNGe2UKUf6m2MTMvRH8UrDvW-WrhxT1PSKcbxBDU3gYC8Xj2RmWtqYKr4JXJYdbq6Z9Ktzf_PXoT_WIjsWMs9Np2Cb6S4cjHYxzH7XH-i-qs8xPNHbK3txa1d8_ABz9aU1WMxTLHq50UL0QJMkLnucdnjGRVpa0pJKoBhQ"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent flex items-end p-3 justify-between">
                  <span className="text-[10px] text-white font-bold flex items-center gap-1 drop-shadow-sm">
                    <span className="material-symbols-outlined text-xs text-[#f59e0b]">motion_photos_on</span>
                    3D Scan Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => onShowToast('Asset Manager', 'Replace high-res GLTF model or photo.')}
                    className="px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-sm text-[#1c1917] hover:text-[#b45309] text-[10px] font-bold transition-colors shadow-sm"
                  >
                    Replace Asset
                  </button>
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-[#78716c] mb-1">
                    Culinary Description (Multilingual Dynamic POS Output)
                  </label>
                  <textarea
                    rows={3}
                    value={dishDesc}
                    onChange={(e) => setDishDesc(e.target.value)}
                    className="w-full bg-[#faf8f5] text-[#1c1917] text-xs p-3 rounded-xl border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50 resize-none leading-relaxed"
                  />
                </div>

                {/* Pricing & Calculated Margin Matrix */}
                <div className="grid grid-cols-3 gap-2 bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8decb]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#78716c] uppercase font-bold">COGS (Est.)</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-bold font-mono text-[#1c1917]">
                        ₹{cogsPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] text-[#78716c]">INR</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#78716c] uppercase font-bold">Sale Price</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-xs text-[#b45309] font-bold">₹</span>
                      <input
                        type="number"
                        step="50"
                        value={salePrice}
                        onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                        className="w-20 bg-white text-sm font-bold font-mono text-[#b45309] px-2 py-0.5 rounded-lg border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                      />
                      <span className="text-[10px] text-[#78716c]">INR</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#78716c] uppercase font-bold">Gross Margin</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-bold font-mono text-[#047857]">
                        {grossMargin}%
                      </span>
                      <span className="material-symbols-outlined text-xs text-[#047857]">
                        trending_up
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Allergen & Certification Tags */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#78716c] uppercase tracking-wider font-bold">
                  Allergen & Indian Certification Tags
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddTagInput(!showAddTagInput)}
                  className="text-xs text-[#b45309] font-bold hover:underline cursor-pointer"
                >
                  + Add Custom Matrix Tag
                </button>
              </div>

              {showAddTagInput && (
                <form onSubmit={handleAddTag} className="flex items-center gap-2 p-2.5 bg-[#faf8f5] rounded-xl border border-[#e8decb]">
                  <input
                    type="text"
                    placeholder="e.g. FSSAI A1 Certified or Sattvic Verified"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="flex-1 bg-white text-xs text-[#1c1917] px-3 py-1.5 rounded-lg border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                  />
                  <button
                    type="submit"
                    className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold hover:brightness-110 cursor-pointer shadow-xs"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTagInput(false)}
                    className="px-2.5 py-1.5 text-xs text-[#78716c] cursor-pointer"
                  >
                    Cancel
                  </button>
                </form>
              )}

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 rounded-full bg-[#faf8f5] text-[#1c1917] text-xs font-medium flex items-center gap-1.5 border border-[#e8decb] shadow-xs"
                  >
                    <span className="material-symbols-outlined text-xs text-[#047857]">verified</span>
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="material-symbols-outlined text-[13px] text-[#78716c] hover:text-[#b91c1c] cursor-pointer ml-0.5"
                    >
                      close
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Automated Sommelier Upsell Pairing */}
            <div className="rounded-xl bg-gradient-to-r from-[#faf8f5] to-[#f5f0e6] border border-[#e8decb] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-white border border-[#e8decb] flex items-center justify-center text-[#b45309] shrink-0 shadow-xs">
                  <span className="material-symbols-outlined text-2xl">wine_bar</span>
                </div>
                <div>
                  <div className="text-[10px] text-[#78716c] uppercase tracking-wider font-bold">
                    Automated Sommelier Upsell Pairing
                  </div>
                  <div className="text-sm font-bold text-[#1c1917]">
                    Grover Zampa 'Chene Grand Reserve' (2018 Shiraz)
                  </div>
                  <div className="text-xs text-[#57534e]">
                    Attaches dynamically to digital guest ledger +₹2,800/glass
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onShowToast('Pairing Logic Configured', 'Sommelier engine will prioritize Chene Grand Reserve for this dish.')}
                className="w-full md:w-auto px-4 py-2 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold border border-[#e8decb] hover:border-[#b45309]/30 transition-all shadow-xs whitespace-nowrap cursor-pointer"
              >
                Configure Pairing Logic
              </button>
            </div>

            {/* Additional Dish List Queue */}
            <div className="space-y-2.5 pt-2 border-t border-[#f0ece1]">
              <div className="flex items-center justify-between text-xs text-[#78716c]">
                <span>Other Items in 'Starters & Chaat' (3 Selected for Batch Edit)</span>
                <button
                  type="button"
                  onClick={() => onShowToast('New Item Staged', 'Blank dish card instantiated in master catalogue.')}
                  className="text-[#b45309] hover:underline font-bold cursor-pointer"
                >
                  + New Dish Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Item Mini 1 */}
                <div
                  onClick={() => {
                    setDishTitle('Malabar Bay Lobster & Kokum Pearls');
                    setCogsPrice(820);
                    setSalePrice(3200);
                    setDishDesc('Poached Bay of Bengal spiny lobster tossed in roasted Tellicherry pepper and curry leaf butter, garnished with sour kokum pearls and crisp sourdough papad.');
                    onShowToast('Active Dish Swapped', 'Switched editor focus to Malabar Bay Lobster.');
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f5] border border-[#e8decb] hover:border-[#b45309]/50 hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="h-12 w-12 rounded-lg bg-white overflow-hidden shrink-0 border border-[#e8decb]">
                    <img
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      alt="Malabar Bay Lobster"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_-aWHIOOQVvOHbyDmv7awT9nKYAxrihPs8XIvlouBcDvPuwTDP1el3UBdHjfHADPxkr8LijFQr03KnMvrARoE9JKZxlhcc8-lhLXOjHk3ZztIQjeXwnB5MGVxIw4eNVnVQG2MP1cWoOWbVr323Hw3UVItoL6TIDsvpSmT4MhJKPNi2ll8U3pAwN-5SaDqo-SFjh3KUjmzZEbYzSBv35verdn9CZEhoCNUGhOG1dN8dZbEUEWfP5PcJA"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#1c1917] truncate group-hover:text-[#b45309] transition-colors">
                      Malabar Bay Lobster & Kokum Pearls
                    </span>
                    <span className="text-[11px] text-[#78716c] font-mono">
                      ₹3,200 • COGS ₹820 (74.4% Margin)
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#047857] text-base">check_circle</span>
                </div>

                {/* Item Mini 2 */}
                <div
                  onClick={() => {
                    setDishTitle('Charred Kashmiri Morel Khichdi Arancini');
                    setCogsPrice(680);
                    setSalePrice(2450);
                    setDishDesc('Crispy fried aged Gobindobhog rice spheres stuffed with wild Himalayan Guchhi morels, 24-month aged Rajasthani goat cheese, dusted with saffron essence.');
                    onShowToast('Active Dish Swapped', 'Switched editor focus to Charred Kashmiri Morel Arancini.');
                  }}
                  className="flex items-center gap-3 p-3 rounded-xl bg-[#faf8f5] border border-[#e8decb] hover:border-[#b45309]/50 hover:bg-white hover:shadow-xs transition-all cursor-pointer group"
                >
                  <div className="h-12 w-12 rounded-lg bg-white overflow-hidden shrink-0 border border-[#e8decb]">
                    <img
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      alt="Kashmiri Morel Arancini"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnsbSICJJ7yE7U2_fxF3lhSj6nEcAPNMg3qEb0dlwPimE1FgjQYU5Kk_ifPL1rFeY63O8nJvJsWICGy2yMTsm9x7HM7O7myUJ-v_1KzgZ-z-OEyyVHn2ePmsH9MBbe5CdbOoI4WeJKkOvycawrbilZK4wbdEM0B-Hqqk_b_6TGaY4uUGDLRCOfOgXltnxeJflsreO8TPiDRC29vyIAY9y7xqNE2o8gAJKBcEl5aZ-lvtr52rVnm7y8TA"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-bold text-[#1c1917] truncate group-hover:text-[#b45309] transition-colors">
                      Kashmiri Morel Khichdi Arancini
                    </span>
                    <span className="text-[11px] text-[#78716c] font-mono">
                      ₹2,450 • COGS ₹680 (72.2% Margin)
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#047857] text-base">check_circle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (40%): Branch Distribution & Availability Matrix */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c]">
                  Omnichannel Deployment Grid
                </span>
                <h2 className="font-headline font-bold text-base text-[#1c1917]">
                  Metro Branch Availability & Pricing
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#ecfdf5] text-[#047857] text-xs font-bold flex items-center gap-1 border border-[#a7f3d0]">
                <span className="h-2 w-2 rounded-full bg-[#047857] animate-pulse" />
                {Object.values(branchActive).filter(Boolean).length} Metros Active
              </span>
            </div>

            <p className="text-xs text-[#57534e] leading-relaxed">
              Control live release flags across table-side e-ink tablets, kitchen display systems (KDS), Swiggy Gourmet, and Zomato syndication endpoints.
            </p>

            {/* Branch Listing Cards */}
            <div className="space-y-3">
              {/* Mumbai */}
              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-2 hover:border-[#b45309]/40 hover:bg-white transition-colors shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={branchActive.mumbai}
                      onChange={(e) => setBranchActive({ ...branchActive, mumbai: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1917]">Mumbai BKC Flagship</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#ecfdf5] text-[#047857] font-mono font-bold border border-[#a7f3d0]">
                          BOM-HQ
                        </span>
                      </div>
                      <span className="text-[11px] text-[#78716c]">
                        Live on Royal Tables • Direct Concierge
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#b45309]">₹4,850</span>
                    <div className="text-[10px] text-[#78716c]">Incl. 5% GST</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#f0ece1] text-[11px]">
                  <span className="flex items-center gap-1 text-[#047857] font-semibold">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Push Status: Synchronized
                  </span>
                  <span className="font-mono text-[#78716c]">KDS Station: Sigdi/Tandoor</span>
                </div>
              </div>

              {/* Delhi */}
              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-2 hover:border-[#b45309]/40 hover:bg-white transition-colors shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={branchActive.delhi}
                      onChange={(e) => setBranchActive({ ...branchActive, delhi: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1917]">New Delhi Lutyens</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#fef3c7] text-[#92400e] font-mono font-bold border border-[#fde68a]">
                          DEL-01
                        </span>
                      </div>
                      <span className="text-[11px] text-[#78716c]">
                        Live on Tables • Zomato Legends
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#b45309]">₹4,850</span>
                    <div className="text-[10px] text-[#78716c]">Incl. 5% GST</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#f0ece1] text-[11px]">
                  <span className="flex items-center gap-1 text-[#047857] font-semibold">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Push Status: Synchronized
                  </span>
                  <span className="font-mono text-[#78716c]">KDS Station: Awadhi Dum</span>
                </div>
              </div>

              {/* Bengaluru */}
              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-2 hover:border-[#b45309]/40 hover:bg-white transition-colors shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={branchActive.bengaluru}
                      onChange={(e) => setBranchActive({ ...branchActive, bengaluru: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1917]">Bengaluru Indiranagar</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#f5f0e6] text-[#78716c] font-mono font-bold border border-[#e8decb]">
                          BLR-01
                        </span>
                      </div>
                      <span className="text-[11px] text-[#b45309] font-medium">
                        Scheduled for 18:00 IST
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#b45309]">₹4,650</span>
                    <div className="text-[10px] text-[#78716c]">Incl. 5% GST</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#f0ece1] text-[11px]">
                  <span className="flex items-center gap-1 text-[#b45309] font-semibold">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    Queued for Evening Service
                  </span>
                  <span className="font-mono text-[#78716c]">KDS Station: Pantry</span>
                </div>
              </div>

              {/* Hyderabad */}
              <div className="p-3.5 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-2 hover:border-[#b45309]/40 hover:bg-white transition-colors shadow-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={branchActive.hyderabad}
                      onChange={(e) => setBranchActive({ ...branchActive, hyderabad: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#1c1917]">Hyderabad Jubilee Hills</span>
                        <span className="text-[10px] px-2 py-0.2 rounded-full bg-[#fef2f2] text-[#991b1b] font-mono font-bold border border-[#fecaca]">
                          HYD-01
                        </span>
                      </div>
                      <span className="text-[11px] text-[#b91c1c] font-medium">
                        Staged for Shahi Dum Verification
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#78716c]">₹4,500</span>
                    <div className="text-[10px] text-[#78716c]">Incl. 5% GST</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#f0ece1] text-[11px]">
                  <span className="flex items-center gap-1 text-[#b91c1c] font-semibold">
                    <span className="material-symbols-outlined text-xs">pending_actions</span>
                    Bespoke Potli Masala Check
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBranchActive({ ...branchActive, hyderabad: true });
                      onShowToast('Audit Fast-Tracked', 'Approved spice blend for Hyderabad Jubilee Hills kitchen.');
                    }}
                    className="text-[#b45309] hover:underline font-bold cursor-pointer"
                  >
                    Approve Fast-Track
                  </button>
                </div>
              </div>
            </div>

            {/* Global Sync Simulator */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-[#faf8f5] to-[#f5f0e6] border border-[#e8decb] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#b45309]">cloud_sync</span>
                  <span className="text-xs font-bold text-[#1c1917]">National Sync Status</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#047857]">{syncPercentage}% Synced</span>
              </div>

              <div className="w-full bg-[#e8ded0] rounded-full h-2 overflow-hidden shadow-inner">
                <div
                  className="bg-gradient-to-r from-[#f59e0b] to-[#047857] h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${syncPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-3 text-center pt-1 text-xs text-[#78716c]">
                <div className="flex flex-col">
                  <span className="font-bold text-[#1c1917] font-mono text-sm">18</span>
                  <span className="text-[10px]">POS Terminals</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1c1917] font-mono text-sm">140</span>
                  <span className="text-[10px]">QR Menus</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#1c1917] font-mono text-sm">6</span>
                  <span className="text-[10px]">Aggregator APIs</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isFlushing}
                onClick={handleForceSync}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-[#faf8f5] text-[#1c1917] text-xs font-bold transition-all flex items-center justify-center gap-2 border border-[#e8decb] hover:border-[#b45309]/40 shadow-xs cursor-pointer"
              >
                <span className={`material-symbols-outlined text-base text-[#b45309] ${isFlushing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{isFlushing ? 'Flushing Indian Gateways...' : 'Force Instant Flush & Resync'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Summary Widget */}
          <div className="rounded-2xl bg-white border border-[#e8decb] p-4 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0] flex items-center justify-center shrink-0 shadow-xs">
                <span className="material-symbols-outlined text-xl">pie_chart</span>
              </div>
              <div>
                <div className="text-[10px] text-[#78716c] uppercase tracking-wider font-bold">
                  Projected Portfolio Contribution
                </div>
                <div className="text-sm font-bold text-[#1c1917] font-mono">+18.4% Revenue Uplift</div>
              </div>
            </div>
            <span className="text-[10px] text-[#047857] bg-[#ecfdf5] border border-[#a7f3d0] px-2.5 py-1 rounded-full font-bold">
              Optimal Margin
            </span>
          </div>
        </div>
      </div>

      {/* Seasonal Menu Vault & Historical Masterworks */}
      <section className="rounded-2xl bg-white border border-[#e8decb] p-6 shadow-[0_10px_25px_-5px_rgba(217,119,6,0.06)] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-3 border-b border-[#f0ece1]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#78716c]">
              Archive & Rollback Repository
            </span>
            <h2 className="font-headline font-bold text-base text-[#1c1917]">
              Seasonal Menu Vault & Historical Masterworks
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#78716c]">
            <span className="material-symbols-outlined text-base text-[#b45309]">history</span>
            <span>All catalog snapshots securely signed and cryptographically stored</span>
          </div>
        </div>

        {/* Snapshots Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vault Item 1 */}
          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-3 flex flex-col justify-between group hover:border-[#b45309]/50 hover:bg-white hover:shadow-xs transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#78716c] font-mono">CAT-2024-Q3</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-[#78716c] font-mono border border-[#e8decb]">
                  Archived
                </span>
              </div>
              <div className="font-headline font-bold text-sm text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                Monsoon Mehfil 2024
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Celebrated wild coastal raw mango crudo, kokum granita, and slow-roasted corn bhutte across 6 metro locations.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-[#f0ece1]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#78716c]">Total Run Sales</span>
                <span className="text-xs font-bold text-[#1c1917] font-mono">₹1.42 Cr INR</span>
              </div>
              <button
                type="button"
                onClick={() => handleRestoreVaultItem('CAT-2024-Q3', 'Monsoon Mehfil 2024')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gradient-to-r hover:from-[#f59e0b] hover:to-[#ea580c] text-[#1c1917] hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-[#e8decb] hover:border-transparent cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                <span>1-Click Restore</span>
              </button>
            </div>
          </div>

          {/* Vault Item 2 */}
          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-3 flex flex-col justify-between group hover:border-[#b45309]/50 hover:bg-white hover:shadow-xs transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#78716c] font-mono">CAT-2024-Q2</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-white text-[#78716c] font-mono border border-[#e8decb]">
                  Archived
                </span>
              </div>
              <div className="font-headline font-bold text-sm text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                Royal Rajputana Spring Edition
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Infused Mathania red chili braised shanks, smoked dal baati, and vintage Chene Grand Reserve barrel releases.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-[#f0ece1]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#78716c]">Total Run Sales</span>
                <span className="text-xs font-bold text-[#1c1917] font-mono">₹1.89 Cr INR</span>
              </div>
              <button
                type="button"
                onClick={() => handleRestoreVaultItem('CAT-2024-Q2', 'Royal Rajputana Spring Edition')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gradient-to-r hover:from-[#f59e0b] hover:to-[#ea580c] text-[#1c1917] hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-[#e8decb] hover:border-transparent cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                <span>1-Click Restore</span>
              </button>
            </div>
          </div>

          {/* Vault Item 3 */}
          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8decb] space-y-3 flex flex-col justify-between group hover:border-[#b45309]/50 hover:bg-white hover:shadow-xs transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#78716c] font-mono">CAT-2024-POPUP</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-[#fef2f2] text-[#991b1b] font-mono border border-[#fecaca]">
                  Special Run
                </span>
              </div>
              <div className="font-headline font-bold text-sm text-[#1c1917] group-hover:text-[#b45309] transition-colors">
                Late Night Shahi Chaat & Biryani
              </div>
              <p className="text-xs text-[#57534e] leading-relaxed">
                Binchotan grilled tandoori skewers, spiced kesar highballs, and street-style kakori rolls for after-midnight service.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-[#f0ece1]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#78716c]">Total Run Sales</span>
                <span className="text-xs font-bold text-[#1c1917] font-mono">₹62.0 Lakh INR</span>
              </div>
              <button
                type="button"
                onClick={() => handleRestoreVaultItem('CAT-2024-POPUP', 'Late Night Shahi Chaat')}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-gradient-to-r hover:from-[#f59e0b] hover:to-[#ea580c] text-[#1c1917] hover:text-white text-xs font-bold transition-all flex items-center gap-1 border border-[#e8decb] hover:border-transparent cursor-pointer shadow-xs"
              >
                <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                <span>1-Click Restore</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment Confirmation Modal */}
      {deployModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-ping" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#b45309]">
                    National Fleet Release Protocol
                  </span>
                </div>
                <h3 className="font-headline font-bold text-lg text-[#1c1917]">
                  Confirm Indian Metros Menu Push
                </h3>
              </div>
              <button
                onClick={() => setDeployModalOpen(false)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#57534e] leading-relaxed">
              <p>
                You are about to distribute <strong className="text-[#1c1917]">Royal Awadhi Degustation & Dawat V3.4 (Staged)</strong> across selected Indian syndicate branches. This command will simultaneously:
              </p>
              <ul className="space-y-1 pl-4 list-disc text-[#1c1917]">
                <li>Recompile and invalidate Redis edge caches in Mumbai, Delhi, Bengaluru, and Hyderabad.</li>
                <li>Update guest-facing interactive QR codex and Sommelier wine pairing matrix.</li>
                <li>Broadcast modified INR prices to Swiggy Gourmet & Zomato Legends POS middleware.</li>
              </ul>
            </div>

            {/* Branch Mini Matrix */}
            <div className="space-y-1.5 bg-[#faf8f5] p-3.5 rounded-xl border border-[#e8decb] text-xs">
              <div className="flex items-center justify-between text-[#1c1917]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#047857]" /> Mumbai BKC Flagship
                </span>
                <span className="text-[#047857] font-mono font-bold">Ready (₹4,850)</span>
              </div>
              <div className="flex items-center justify-between text-[#1c1917]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#047857]" /> New Delhi Lutyens
                </span>
                <span className="text-[#047857] font-mono font-bold">Ready (₹4,850)</span>
              </div>
              <div className="flex items-center justify-between text-[#1c1917]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b]" /> Bengaluru Indiranagar
                </span>
                <span className="text-[#b45309] font-mono font-bold">Scheduled 18:00 IST (₹4,650)</span>
              </div>
              <div className="flex items-center justify-between text-[#1c1917]">
                <span className="flex items-center gap-2 font-medium">
                  <span className="h-2 w-2 rounded-full bg-[#dc2626]" /> Hyderabad Jubilee Hills
                </span>
                <span className="text-[#b91c1c] font-mono font-bold">
                  {branchActive.hyderabad ? 'Fast-Track Approved (₹4,500)' : 'Awaiting Shahi Dum Ratio Check'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#f0ece1]">
              <button
                type="button"
                onClick={() => setDeployModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e] text-xs font-bold cursor-pointer"
              >
                Abort
              </button>
              <button
                type="button"
                disabled={isDeploying || deploySuccess}
                onClick={handleExecuteDeploy}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] via-[#ea580c] to-[#d97706] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className={`material-symbols-outlined text-sm ${isDeploying ? 'animate-spin' : ''}`}>
                  {deploySuccess ? 'done_all' : isDeploying ? 'refresh' : 'send'}
                </span>
                <span>
                  {deploySuccess ? 'Pushed Successfully!' : isDeploying ? 'Transmitting to Indian Edges...' : 'Execute Instant Deployment'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Menu Preview / AR Visualizer Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white border border-[#e8decb] rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-2xl text-[#b45309]">smartphone</span>
                <div>
                  <h3 className="font-headline font-bold text-base text-[#1c1917]">
                    Digital Guest Tablet & AR Visualizer
                  </h3>
                  <span className="text-[11px] text-[#78716c]">
                    Live Client Rendering • 120Hz OLED Emulation
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] cursor-pointer"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#faf8f5] border border-[#e8decb] p-4 space-y-4 shadow-inner">
              <div className="aspect-video w-full rounded-xl overflow-hidden relative border border-[#e8decb]">
                <img
                  className="w-full h-full object-cover"
                  alt="Fine dining presentation"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBo6nsDms7GpNJ0AuQWQf_4AYvClRRJUhSmwyA6mVqzSUQNmEadYFTYalCofwKHpVlEyMve98BDYlAIhBaEvHlaYpnBObgceEHuUMWIDdGc_-1OknyVq_jbSTuDRfNruKAv-K2YcF8s0FWqOXb4KYVaYhHdy0MXgyBKSVu2gdYppfGXcpGj1M0wiSmEtdzmECSc5Vvwo0EVktX8oUCg16ZNkhFEKr9tfG72xQtWh4IVDmdvgzma2qXLA"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#b45309] text-xs font-bold flex items-center gap-1.5 border border-[#e8decb] shadow-xs">
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-pulse" />
                  AR Model Active
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-headline font-bold text-base text-[#1c1917]">
                    {dishTitle}
                  </h4>
                  <p className="text-xs text-[#57534e] mt-1">
                    Paired with Grover Zampa Chene Grand Reserve • Royal Dum Pukht smoked table side
                  </p>
                </div>
                <span className="font-headline font-bold text-lg text-[#b45309] font-mono">
                  ₹{salePrice.toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-[#f0ece1]">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-[#1c1917] text-xs font-bold border border-[#e8decb] cursor-pointer"
              >
                Close Visualizer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Double Verification Modal for Dish Deletion */}
      <DoubleDeleteConfirmModal
        isOpen={!!deleteDishTarget}
        onClose={() => setDeleteDishTarget(null)}
        onConfirm={handleConfirmDeleteDish}
        itemName={deleteDishTarget ? deleteDishTarget.title : ''}
        itemType="Master Catalog Menu Dish"
        itemSubdetails={deleteDishTarget ? `Catalog Reference: ${deleteDishTarget.code || '#0482-OM'} • Category: ${deleteDishTarget.category || 'Starters'}` : undefined}
        warningNote="Deleting this dish from the catalog will permanently remove it from guest tablet menus, purge QR code ordering entries, and delist it from Swiggy Gourmet and Zomato Legends."
        requireTyping={true}
      />
    </div>
  );
};
