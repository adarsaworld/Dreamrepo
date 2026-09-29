import React, { useState } from 'react';
import { MenuItem } from '../types';
import { INITIAL_MENU_ITEMS } from '../data/mockData';

interface MenuStudioViewProps {
  onShowToast: (title: string, desc: string, type?: 'success' | 'warning' | 'info') => void;
}

export const MenuStudioView: React.FC<MenuStudioViewProps> = ({ onShowToast }) => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU_ITEMS);
  const [selectedCategory, setSelectedCategory] = useState<string>('starters');
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const [dishTitle, setDishTitle] = useState('Smoked Otoro Tartare & Kaluga Caviar');
  const [dishDesc, setDishDesc] = useState(
    'Hand-diced wild Pacific bluefin fatty tuna cold-smoked with sakura wood chips, seasoned with Nikiri shoyu, aged yuzu kosho, and crowned with 15g reserve Kaluga Queen hybrid caviar. Served with nori crisps.'
  );
  const [salePrice, setSalePrice] = useState<number>(65.00);
  const [cogsPrice, setCogsPrice] = useState<number>(18.50);
  const [tags, setTags] = useState<string[]>([
    'Dairy-Free',
    'Halal-Audited (Cert #H-921)',
    'Contains Shellfish / Finfish',
    'Nut Allergy Alert: Safe',
    'A5 Grade Certified',
  ]);
  const [newTagInput, setNewTagInput] = useState('');
  const [showAddTagInput, setShowAddTagInput] = useState(false);

  // Branch activation checkboxes
  const [branchActive, setBranchActive] = useState({
    tokyo: true,
    nyc: true,
    london: true,
    dubai: false,
  });

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
      onShowToast('Fleet Gateways Synchronized', '0ms latency achieved across all 18 POS terminals and 140 QR tables.');
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
        onShowToast('Autumn Degustation V3.4 Deployed', 'All edge nodes compiled and published to live tables.');
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
      <section className="relative overflow-hidden rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-6 shadow-xl backdrop-blur-md">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br from-[#ffc174]/10 to-transparent blur-3xl pointer-events-none" />
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#ffc174] bg-[#f59e0b]/20 px-2.5 py-0.5 rounded-full border border-[#f59e0b]/30">
                Syndicate Master Catalog
              </span>
              <span className="text-xs text-[#56e5a9] flex items-center gap-1 font-medium">
                <span className="h-1.5 w-1.5 rounded-full bg-[#56e5a9] shadow-[0_0_8px_#56e5a9]" />
                Multi-POS Sync Engine Active
              </span>
            </div>
            <div className="flex items-baseline gap-2 flex-wrap">
              <h1 className="font-headline font-bold text-2xl sm:text-3xl text-[#e3e2e3] tracking-tight">
                Menu Studio & Omnichannel Distribution
              </h1>
              <span className="text-xs text-[#a08e7a] font-mono">v3.4-PROD-STAGED</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#d8c3ad]">
              <span className="material-symbols-outlined text-base text-[#ffc174]">edit_calendar</span>
              <span>
                Active Draft: <strong className="text-[#e3e2e3]">Autumn Degustation & Delivery V3.4 (Staged)</strong> — 42 total items ready for distribution
              </span>
            </div>
          </div>

          {/* Action Cluster */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => setPreviewModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#ffc174]">view_in_ar</span>
              <span>Preview Digital Menu</span>
            </button>
            <button
              onClick={() => onShowToast('FX Arbitrage Tested', 'Cross-currency hedge verified across JPY, USD, GBP, and AED with 0.12% variance.')}
              type="button"
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base text-[#a08e7a]">currency_exchange</span>
              <span>FX Arbitrage Test</span>
            </button>
            <button
              onClick={() => setDeployModalOpen(true)}
              type="button"
              className="flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] text-xs font-bold shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">rocket_launch</span>
              <span>Deploy / Distribute to Branches</span>
            </button>
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
              { id: 'starters', label: 'Starters & Crudo' },
              { id: 'robata', label: 'Robata & Wood-Fired Mains' },
              { id: 'omakase', label: 'Omakase Specials' },
              { id: 'cellar', label: 'Cocktails & Cellar' },
              { id: 'delivery', label: 'Delivery Exclusives' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  onShowToast('Category Selected', `Displaying active items for ${cat.label}.`);
                }}
                className={`whitespace-nowrap px-3 sm:px-4 py-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#ffc174] text-[#472a00] shadow-[0_0_16px_rgba(245,158,11,0.3)]'
                    : 'bg-[#292a2b] text-[#d8c3ad] hover:text-[#e3e2e3] hover:bg-[#343536] border border-[#343536]'
                }`}
                type="button"
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Active Dish Card in High-Precision Edit Mode */}
          <div className="rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-6 shadow-xl space-y-5">
            {/* Header & Fast-Toggles */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-[#292a2b]">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a]">
                  Selected Item #0482-OM
                </span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={dishTitle}
                    onChange={(e) => setDishTitle(e.target.value)}
                    className="bg-[#0d0e0f] text-[#e3e2e3] font-headline font-bold text-lg px-3 py-1.5 rounded-lg w-full max-w-md focus:outline-none focus:ring-1 focus:ring-[#ffc174] border border-[#343536]"
                  />
                  <span className="material-symbols-outlined text-[#a08e7a] text-lg">lock_open</span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 bg-[#0d0e0f] p-1 rounded-lg border border-[#292a2b] shrink-0 self-start sm:self-auto">
                <span className="material-symbols-outlined text-[#56e5a9] text-base ml-1">videocam</span>
                <span className="text-[11px] font-semibold text-[#56e5a9] px-1">AR/Video Preview</span>
                <button
                  type="button"
                  onClick={() => setPreviewModalOpen(true)}
                  className="px-2 py-1 rounded bg-[#292a2b] hover:bg-[#39393a] text-[#e3e2e3] text-[11px] font-semibold transition-all cursor-pointer"
                >
                  Interactive Mode
                </button>
              </div>
            </div>

            {/* Visual Media & Description Bento */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-5 relative group overflow-hidden rounded-xl bg-[#0d0e0f] aspect-video md:aspect-auto h-48 md:h-full border border-[#292a2b]">
                <img
                  className="w-full h-full object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                  alt="Smoked Otoro Tartare"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBcYCWWrgCEprsr0TFuKco5314Fxmz0hx7O5PTrCBQDaGGqU5bBX0_8pKR2P-E0KT4Wk_0UdwKaJNUj6DFHvNGe2UKUf6m2MTMvRH8UrDvW-WrhxT1PSKcbxBDU3gYC8Xj2RmWtqYKr4JXJYdbq6Z9Ktzf_PXoT_WIjsWMs9Np2Cb6S4cjHYxzH7XH-i-qs8xPNHbK3txa1d8_ABz9aU1WMxTLHq50UL0QJMkLnucdnjGRVpa0pJKoBhQ"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.currentTarget as HTMLElement).style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e0f]/90 via-transparent to-transparent flex items-end p-3 justify-between">
                  <span className="text-[10px] text-[#d8c3ad] font-semibold flex items-center gap-1">
                    <span className="material-symbols-outlined text-xs text-[#ffc174]">motion_photos_on</span>
                    3D Scan Attached
                  </span>
                  <button
                    type="button"
                    onClick={() => onShowToast('Asset Manager', 'Replace high-res GLTF model or photo.')}
                    className="px-2 py-0.5 rounded bg-[#39393a]/90 text-[#e3e2e3] hover:text-[#ffc174] text-[10px] font-semibold transition-colors"
                  >
                    Replace Asset
                  </button>
                </div>
              </div>

              <div className="md:col-span-7 space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-[#a08e7a] mb-1">
                    Culinary Description (Multilingual Dynamic POS Output)
                  </label>
                  <textarea
                    rows={3}
                    value={dishDesc}
                    onChange={(e) => setDishDesc(e.target.value)}
                    className="w-full bg-[#0d0e0f] text-[#e3e2e3] text-xs p-3 rounded-lg border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174] resize-none leading-relaxed"
                  />
                </div>

                {/* Pricing & Calculated Margin Matrix */}
                <div className="grid grid-cols-3 gap-2 bg-[#0d0e0f] p-3 rounded-lg border border-[#292a2b]">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#a08e7a] uppercase font-bold">COGS (Est.)</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-bold font-mono text-[#e3e2e3]">
                        ${cogsPrice.toFixed(2)}
                      </span>
                      <span className="text-[10px] text-[#a08e7a]">USD</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Sale Price</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <input
                        type="number"
                        step="0.5"
                        value={salePrice}
                        onChange={(e) => setSalePrice(parseFloat(e.target.value) || 0)}
                        className="w-16 bg-[#1f2021] text-sm font-bold font-mono text-[#ffc174] px-1 py-0.5 rounded border border-[#343536]"
                      />
                      <span className="text-[10px] text-[#a08e7a]">USD</span>
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[10px] text-[#a08e7a] uppercase font-bold">Gross Margin</span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-sm font-bold font-mono text-[#56e5a9]">
                        {grossMargin}%
                      </span>
                      <span className="material-symbols-outlined text-xs text-[#56e5a9]">
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
                <span className="text-[10px] text-[#a08e7a] uppercase tracking-wider font-bold">
                  Allergen & Certification Tags
                </span>
                <button
                  type="button"
                  onClick={() => setShowAddTagInput(!showAddTagInput)}
                  className="text-xs text-[#ffc174] font-semibold hover:underline cursor-pointer"
                >
                  + Add Custom Matrix Tag
                </button>
              </div>

              {showAddTagInput && (
                <form onSubmit={handleAddTag} className="flex items-center gap-2 p-2 bg-[#0d0e0f] rounded-lg border border-[#343536]">
                  <input
                    type="text"
                    placeholder="e.g. Non-GMO Verified or Kosher-Certified"
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    className="flex-1 bg-[#1f2021] text-xs text-[#e3e2e3] px-3 py-1.5 rounded border border-[#292a2b] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded bg-[#ffc174] text-[#472a00] text-xs font-bold hover:brightness-110"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddTagInput(false)}
                    className="px-2 py-1.5 text-xs text-[#a08e7a]"
                  >
                    Cancel
                  </button>
                </form>
              )}

              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-full bg-[#292a2b] text-[#e3e2e3] text-xs flex items-center gap-1.5 border border-[#343536] shadow-sm"
                  >
                    <span className="material-symbols-outlined text-xs text-[#56e5a9]">eco</span>
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="material-symbols-outlined text-[13px] text-[#a08e7a] hover:text-[#ffb3b6] cursor-pointer"
                    >
                      close
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Automated Sommelier Upsell Pairing */}
            <div className="rounded-xl bg-[#0d0e0f] border border-[#292a2b] p-4 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-[#f59e0b]/10 border border-[#f59e0b]/20 flex items-center justify-center text-[#ffc174] shrink-0">
                  <span className="material-symbols-outlined text-2xl">wine_bar</span>
                </div>
                <div>
                  <div className="text-[10px] text-[#a08e7a] uppercase tracking-wider font-bold">
                    Automated Sommelier Upsell Pairing
                  </div>
                  <div className="text-sm font-bold text-[#e3e2e3]">
                    Junmai Daiginjo 'Dassai Beyond' (2019 Vintage)
                  </div>
                  <div className="text-xs text-[#d8c3ad]">
                    Attaches dynamically to digital guest ledger +$38/glass
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onShowToast('Pairing Logic Configured', 'Sommelier engine will prioritize Dassai Beyond for this dish.')}
                className="w-full md:w-auto px-4 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold border border-[#343536] transition-colors whitespace-nowrap cursor-pointer"
              >
                Configure Pairing Logic
              </button>
            </div>

            {/* Additional Dish List Queue */}
            <div className="space-y-2 pt-2 border-t border-[#292a2b]">
              <div className="flex items-center justify-between text-xs text-[#a08e7a]">
                <span>Other Items in 'Starters & Crudo' (3 Selected for Batch Edit)</span>
                <button
                  type="button"
                  onClick={() => onShowToast('New Item Staged', 'Blank dish card instantiated in master catalogue.')}
                  className="text-[#ffc174] hover:underline font-semibold cursor-pointer"
                >
                  + New Dish Card
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* Item Mini 1 */}
                <div
                  onClick={() => {
                    setDishTitle('Hokkaido Scallop & Finger Lime');
                    setCogsPrice(8.40);
                    setSalePrice(32.00);
                    setDishDesc('Ultra-thin translucent crudo of wild caught Hokkaido scallops with finger lime pearls, white soy reduction, and shiso oil.');
                    onShowToast('Active Dish Swapped', 'Switched editor focus to Hokkaido Scallop & Finger Lime.');
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0d0e0f] border border-[#292a2b] hover:border-[#ffc174]/40 transition-all cursor-pointer"
                >
                  <div className="h-12 w-12 rounded bg-[#292a2b] overflow-hidden shrink-0">
                    <img
                      className="h-full w-full object-cover"
                      alt="Hokkaido Scallop"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD_-aWHIOOQVvOHbyDmv7awT9nKYAxrihPs8XIvlouBcDvPuwTDP1el3UBdHjfHADPxkr8LijFQr03KnMvrARoE9JKZxlhcc8-lhLXOjHk3ZztIQjeXwnB5MGVxIw4eNVnVQG2MP1cWoOWbVr323Hw3UVItoL6TIDsvpSmT4MhJKPNi2ll8U3pAwN-5SaDqo-SFjh3KUjmzZEbYzSBv35verdn9CZEhoCNUGhOG1dN8dZbEUEWfP5PcJA"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-[#e3e2e3] truncate">
                      Hokkaido Scallop & Finger Lime
                    </span>
                    <span className="text-[11px] text-[#a08e7a] font-mono">
                      $32.00 • COGS $8.40 (73.7% Margin)
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#56e5a9] text-base">check_circle</span>
                </div>

                {/* Item Mini 2 */}
                <div
                  onClick={() => {
                    setDishTitle('A5 Wagyu Crisp Taco (2pcs)');
                    setCogsPrice(14.10);
                    setSalePrice(44.00);
                    setDishDesc('Crispy flash-fried nori shell loaded with hand-chopped A5 Miyazaki striploin tartare, freshly grated Shizuoka wasabi, and edible borage blossoms.');
                    onShowToast('Active Dish Swapped', 'Switched editor focus to A5 Wagyu Crisp Taco.');
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-lg bg-[#0d0e0f] border border-[#292a2b] hover:border-[#ffc174]/40 transition-all cursor-pointer"
                >
                  <div className="h-12 w-12 rounded bg-[#292a2b] overflow-hidden shrink-0">
                    <img
                      className="h-full w-full object-cover"
                      alt="A5 Wagyu Crisp Taco"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnsbSICJJ7yE7U2_fxF3lhSj6nEcAPNMg3qEb0dlwPimE1FgjQYU5Kk_ifPL1rFeY63O8nJvJsWICGy2yMTsm9x7HM7O7myUJ-v_1KzgZ-z-OEyyVHn2ePmsH9MBbe5CdbOoI4WeJKkOvycawrbilZK4wbdEM0B-Hqqk_b_6TGaY4uUGDLRCOfOgXltnxeJflsreO8TPiDRC29vyIAY9y7xqNE2o8gAJKBcEl5aZ-lvtr52rVnm7y8TA"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="flex flex-col min-w-0 flex-1">
                    <span className="text-xs font-semibold text-[#e3e2e3] truncate">
                      A5 Wagyu Crisp Taco (2pcs)
                    </span>
                    <span className="text-[11px] text-[#a08e7a] font-mono">
                      $44.00 • COGS $14.10 (67.9% Margin)
                    </span>
                  </div>
                  <span className="material-symbols-outlined text-[#56e5a9] text-base">check_circle</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (40%): Branch Distribution & Availability Matrix */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          <div className="rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a]">
                  Omnichannel Deployment Grid
                </span>
                <h2 className="font-headline font-bold text-base text-[#e3e2e3]">
                  Branch Availability & Pricing
                </h2>
              </div>
              <span className="px-2.5 py-1 rounded bg-[#292a2b] text-[#56e5a9] text-xs font-semibold flex items-center gap-1 border border-[#343536]">
                <span className="h-2 w-2 rounded-full bg-[#56e5a9]" />
                {Object.values(branchActive).filter(Boolean).length} Branches Active
              </span>
            </div>

            <p className="text-xs text-[#d8c3ad] leading-relaxed">
              Control live release flags across table-side e-ink tablets, kitchen display systems (KDS), Deliverect, and UberEats syndication endpoints.
            </p>

            {/* Branch Listing Cards */}
            <div className="space-y-3">
              {/* Tokyo */}
              <div className="p-3.5 rounded-xl bg-[#0d0e0f] border border-[#292a2b] space-y-2 hover:border-[#ffc174]/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={branchActive.tokyo}
                      onChange={(e) => setBranchActive({ ...branchActive, tokyo: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#e3e2e3]">Tokyo Roppongi</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#56e5a9]/20 text-[#56e5a9] font-mono font-medium">
                          JAP-HQ
                        </span>
                      </div>
                      <span className="text-[11px] text-[#a08e7a]">
                        Live on Tables • Deliverect Direct
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#ffc174]">¥9,800</span>
                    <div className="text-[10px] text-[#a08e7a]">Incl. 10% JCT</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#292a2b] text-[11px]">
                  <span className="flex items-center gap-1 text-[#56e5a9]">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Push Status: Synchronized
                  </span>
                  <span className="font-mono text-[#a08e7a]">KDS Station: Raw/Cold Bar</span>
                </div>
              </div>

              {/* NYC */}
              <div className="p-3.5 rounded-xl bg-[#0d0e0f] border border-[#292a2b] space-y-2 hover:border-[#ffc174]/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={branchActive.nyc}
                      onChange={(e) => setBranchActive({ ...branchActive, nyc: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#e3e2e3]">New York SoHo</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#f59e0b]/20 text-[#ffc174] font-mono font-medium">
                          NYC-01
                        </span>
                      </div>
                      <span className="text-[11px] text-[#a08e7a]">
                        Live on Tables • UberEats Reserve
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#ffc174]">$65.00</span>
                    <div className="text-[10px] text-[#a08e7a]">+ 8.875% NY Tax</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#292a2b] text-[11px]">
                  <span className="flex items-center gap-1 text-[#56e5a9]">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Push Status: Synchronized
                  </span>
                  <span className="font-mono text-[#a08e7a]">KDS Station: Cold Appetizer</span>
                </div>
              </div>

              {/* London */}
              <div className="p-3.5 rounded-xl bg-[#0d0e0f] border border-[#292a2b] space-y-2 hover:border-[#ffc174]/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={branchActive.london}
                      onChange={(e) => setBranchActive({ ...branchActive, london: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#e3e2e3]">London Mayfair</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#292a2b] text-[#d8c3ad] font-mono font-medium">
                          UK-LDN
                        </span>
                      </div>
                      <span className="text-[11px] text-[#ffc174]">
                        Scheduled for 18:00 GMT
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#ffc174]">£54.00</span>
                    <div className="text-[10px] text-[#a08e7a]">Incl. 20% VAT</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#292a2b] text-[11px]">
                  <span className="flex items-center gap-1 text-[#ffc174]">
                    <span className="material-symbols-outlined text-xs">schedule</span>
                    Queued for Evening Service
                  </span>
                  <span className="font-mono text-[#a08e7a]">KDS Station: Larder</span>
                </div>
              </div>

              {/* Dubai */}
              <div className="p-3.5 rounded-xl bg-[#0d0e0f] border border-[#292a2b] space-y-2 hover:border-[#ffc174]/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={branchActive.dubai}
                      onChange={(e) => setBranchActive({ ...branchActive, dubai: e.target.checked })}
                      className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-[#e3e2e3]">Dubai Marina</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#cc003c]/20 text-[#ffb3b6] font-mono font-medium">
                          UAE-DBX
                        </span>
                      </div>
                      <span className="text-[11px] text-[#ffb3b6]">
                        Staged for Halal Audit
                      </span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="text-xs font-bold text-[#a08e7a]">AED 240</span>
                    <div className="text-[10px] text-[#a08e7a]">Incl. 5% VAT</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#292a2b] text-[11px]">
                  <span className="flex items-center gap-1 text-[#ffb3b6]">
                    <span className="material-symbols-outlined text-xs">pending_actions</span>
                    Mirin Sauce Substitution Check
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setBranchActive({ ...branchActive, dubai: true });
                      onShowToast('Audit Fast-Tracked', 'Approved alcohol-free mirin substitution for Dubai Marina menu.');
                    }}
                    className="text-[#ffc174] hover:underline font-semibold cursor-pointer"
                  >
                    Approve Fast-Track
                  </button>
                </div>
              </div>
            </div>

            {/* Global Sync Simulator */}
            <div className="p-4 rounded-xl bg-[#1f2021] border border-[#292a2b] space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-base text-[#ffc174]">cloud_sync</span>
                  <span className="text-xs font-bold text-[#e3e2e3]">Global Sync Status</span>
                </div>
                <span className="text-xs font-mono font-bold text-[#56e5a9]">{syncPercentage}% Synced</span>
              </div>

              <div className="w-full bg-[#0d0e0f] rounded-full h-2 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-[#f59e0b] to-[#56e5a9] h-full rounded-full transition-all duration-700 shadow-sm"
                  style={{ width: `${syncPercentage}%` }}
                />
              </div>

              <div className="grid grid-cols-3 text-center pt-1 text-xs text-[#a08e7a]">
                <div className="flex flex-col">
                  <span className="font-bold text-[#e3e2e3] font-mono text-sm">18</span>
                  <span className="text-[10px]">POS Terminals</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#e3e2e3] font-mono text-sm">140</span>
                  <span className="text-[10px]">QR Menus</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-[#e3e2e3] font-mono text-sm">6</span>
                  <span className="text-[10px]">Third-Party APIs</span>
                </div>
              </div>

              <button
                type="button"
                disabled={isFlushing}
                onClick={handleForceSync}
                className="w-full py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold transition-all flex items-center justify-center gap-2 border border-[#343536] cursor-pointer"
              >
                <span className={`material-symbols-outlined text-base text-[#ffc174] ${isFlushing ? 'animate-spin' : ''}`}>
                  sync
                </span>
                <span>{isFlushing ? 'Flushing API Gateways...' : 'Force Instant Flush & Resync'}</span>
              </button>
            </div>
          </div>

          {/* Quick Metrics Summary Widget */}
          <div className="rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-4 shadow-xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-[#30c88f]/10 text-[#56e5a9] border border-[#30c88f]/20 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-xl">pie_chart</span>
              </div>
              <div>
                <div className="text-[10px] text-[#a08e7a] uppercase tracking-wider font-bold">
                  Projected Portfolio Contribution
                </div>
                <div className="text-sm font-bold text-[#e3e2e3] font-mono">+18.4% Revenue Uplift</div>
              </div>
            </div>
            <span className="text-[10px] text-[#56e5a9] bg-[#56e5a9]/15 border border-[#56e5a9]/30 px-2.5 py-1 rounded-full font-bold">
              Optimal Margin
            </span>
          </div>
        </div>
      </div>

      {/* Seasonal Menu Vault & Historical Masterworks */}
      <section className="rounded-xl bg-[#1b1c1d] border border-[#292a2b] p-6 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 pb-2 border-b border-[#292a2b]">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#a08e7a]">
              Archive & Rollback Repository
            </span>
            <h2 className="font-headline font-bold text-base text-[#e3e2e3]">
              Seasonal Menu Vault & Historical Masterworks
            </h2>
          </div>
          <div className="flex items-center gap-2 text-xs text-[#a08e7a]">
            <span className="material-symbols-outlined text-base text-[#ffc174]">history</span>
            <span>All catalog snapshots securely signed and cryptographically stored</span>
          </div>
        </div>

        {/* Snapshots Mosaic */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Vault Item 1 */}
          <div className="p-4 rounded-xl bg-[#0d0e0f] border border-[#292a2b] space-y-3 flex flex-col justify-between group hover:border-[#ffc174]/40 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#a08e7a] font-mono">CAT-2024-Q3</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#292a2b] text-[#d8c3ad] font-mono">
                  Archived
                </span>
              </div>
              <div className="font-headline font-bold text-sm text-[#e3e2e3] group-hover:text-[#ffc174] transition-colors">
                Summer Solstice 2024
              </div>
              <p className="text-xs text-[#d8c3ad] leading-relaxed">
                Celebrated raw ocean crudo, yuzu-lime granita, and cold somen pairings across 6 locations.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-[#292a2b]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#a08e7a]">Total Run Sales</span>
                <span className="text-xs font-bold text-[#e3e2e3] font-mono">$1.42M USD</span>
              </div>
              <button
                type="button"
                onClick={() => handleRestoreVaultItem('CAT-2024-Q3', 'Summer Solstice 2024')}
                className="px-3 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#ffc174] hover:text-[#472a00] text-[#e3e2e3] text-xs font-semibold transition-all flex items-center gap-1 border border-[#343536] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                <span>1-Click Restore</span>
              </button>
            </div>
          </div>

          {/* Vault Item 2 */}
          <div className="p-4 rounded-xl bg-[#0d0e0f] border border-[#292a2b] space-y-3 flex flex-col justify-between group hover:border-[#ffc174]/40 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#a08e7a] font-mono">CAT-2024-Q2</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#292a2b] text-[#d8c3ad] font-mono">
                  Archived
                </span>
              </div>
              <div className="font-headline font-bold text-sm text-[#e3e2e3] group-hover:text-[#ffc174] transition-colors">
                Golden Sakura Spring Edition
              </div>
              <p className="text-xs text-[#d8c3ad] leading-relaxed">
                Infused cherry blossom dashi, A5 Sendai striploin, and limited edition Junmai vintage releases.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-[#292a2b]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#a08e7a]">Total Run Sales</span>
                <span className="text-xs font-bold text-[#e3e2e3] font-mono">$1.89M USD</span>
              </div>
              <button
                type="button"
                onClick={() => handleRestoreVaultItem('CAT-2024-Q2', 'Golden Sakura Spring Edition')}
                className="px-3 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#ffc174] hover:text-[#472a00] text-[#e3e2e3] text-xs font-semibold transition-all flex items-center gap-1 border border-[#343536] cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">settings_backup_restore</span>
                <span>1-Click Restore</span>
              </button>
            </div>
          </div>

          {/* Vault Item 3 */}
          <div className="p-4 rounded-xl bg-[#0d0e0f] border border-[#292a2b] space-y-3 flex flex-col justify-between group hover:border-[#ffc174]/40 transition-all">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-[#a08e7a] font-mono">CAT-2024-POPUP</span>
                <span className="px-2 py-0.5 rounded text-[10px] bg-[#cc003c]/20 text-[#ffb3b6] font-mono">
                  Special Run
                </span>
              </div>
              <div className="font-headline font-bold text-sm text-[#e3e2e3] group-hover:text-[#ffc174] transition-colors">
                Late Night Izakaya Pop-up
              </div>
              <p className="text-xs text-[#d8c3ad] leading-relaxed">
                Binchotan grilled skewers, Japanese highballs, and spicy street bao for after-midnight service.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-[#292a2b]">
              <div className="flex flex-col">
                <span className="text-[10px] text-[#a08e7a]">Total Run Sales</span>
                <span className="text-xs font-bold text-[#e3e2e3] font-mono">$620K USD</span>
              </div>
              <button
                type="button"
                onClick={() => handleRestoreVaultItem('CAT-2024-POPUP', 'Late Night Izakaya Pop-up')}
                className="px-3 py-1.5 rounded-lg bg-[#292a2b] hover:bg-[#ffc174] hover:text-[#472a00] text-[#e3e2e3] text-xs font-semibold transition-all flex items-center gap-1 border border-[#343536] cursor-pointer"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1b1c1d] border border-[#292a2b] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-5">
            <div className="flex items-center justify-between pb-2 border-b border-[#292a2b]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-[#f59e0b] animate-ping" />
                  <span className="text-[10px] uppercase font-bold tracking-wider text-[#ffc174]">
                    Fleet Wide Release Protocol
                  </span>
                </div>
                <h3 className="font-headline font-bold text-lg text-[#e3e2e3]">
                  Confirm Global Menu Push
                </h3>
              </div>
              <button
                onClick={() => setDeployModalOpen(false)}
                className="p-1 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="space-y-2 text-xs text-[#d8c3ad] leading-relaxed">
              <p>
                You are about to distribute <strong className="text-[#e3e2e3]">Autumn Degustation & Delivery V3.4 (Staged)</strong> across selected syndicate branches. This command will simultaneously:
              </p>
              <ul className="space-y-1 pl-4 list-disc text-[#e3e2e3]">
                <li>Recompile and invalidate Redis edge caches in Tokyo, NYC, and London.</li>
                <li>Update guest-facing interactive QR codex and Sommelier wine pairing matrix.</li>
                <li>Broadcast modified item price tags to Deliverect & UberEats POS middleware.</li>
              </ul>
            </div>

            {/* Branch Mini Matrix */}
            <div className="space-y-1.5 bg-[#0d0e0f] p-3 rounded-lg border border-[#292a2b] text-xs">
              <div className="flex items-center justify-between text-[#e3e2e3]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#56e5a9]" /> Tokyo Roppongi
                </span>
                <span className="text-[#56e5a9] font-mono">Ready (¥9,800)</span>
              </div>
              <div className="flex items-center justify-between text-[#e3e2e3]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#56e5a9]" /> New York SoHo
                </span>
                <span className="text-[#56e5a9] font-mono">Ready ($65.00)</span>
              </div>
              <div className="flex items-center justify-between text-[#e3e2e3]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#ffc174]" /> London Mayfair
                </span>
                <span className="text-[#ffc174] font-mono">Scheduled 18:00 GMT (£54.00)</span>
              </div>
              <div className="flex items-center justify-between text-[#e3e2e3]">
                <span className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#cc003c]" /> Dubai Marina
                </span>
                <span className="text-[#ffb3b6] font-mono">
                  {branchActive.dubai ? 'Fast-Track Approved (AED 240)' : 'Awaiting Halal Cert Check'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#292a2b]">
              <button
                type="button"
                onClick={() => setDeployModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold"
              >
                Abort
              </button>
              <button
                type="button"
                disabled={isDeploying || deploySuccess}
                onClick={handleExecuteDeploy}
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] text-xs font-bold shadow-[0_0_20px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
              >
                <span className={`material-symbols-outlined text-sm ${isDeploying ? 'animate-spin' : ''}`}>
                  {deploySuccess ? 'done_all' : isDeploying ? 'refresh' : 'send'}
                </span>
                <span>
                  {deploySuccess ? 'Pushed Successfully!' : isDeploying ? 'Transmitting to Edges...' : 'Execute Instant Deployment'}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Digital Menu Preview / AR Visualizer Modal */}
      {previewModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1b1c1d] border border-[#292a2b] rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#292a2b]">
              <div className="flex items-center gap-2.5">
                <span className="material-symbols-outlined text-2xl text-[#ffc174]">smartphone</span>
                <div>
                  <h3 className="font-headline font-bold text-base text-[#e3e2e3]">
                    Digital Guest Tablet & AR Visualizer
                  </h3>
                  <span className="text-[11px] text-[#a08e7a]">
                    Live Client Rendering • 120Hz OLED Emulation
                  </span>
                </div>
              </div>
              <button
                onClick={() => setPreviewModalOpen(false)}
                className="p-1 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3]"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="rounded-xl overflow-hidden bg-[#0d0e0f] border border-[#292a2b] p-4 space-y-4 shadow-inner">
              <div className="aspect-video w-full rounded-lg overflow-hidden relative border border-[#292a2b]">
                <img
                  className="w-full h-full object-cover"
                  alt="Fine dining presentation"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBo6nsDms7GpNJ0AuQWQf_4AYvClRRJUhSmwyA6mVqzSUQNmEadYFTYalCofwKHpVlEyMve98BDYlAIhBaEvHlaYpnBObgceEHuUMWIDdGc_-1OknyVq_jbSTuDRfNruKAv-K2YcF8s0FWqOXb4KYVaYhHdy0MXgyBKSVu2gdYppfGXcpGj1M0wiSmEtdzmECSc5Vvwo0EVktX8oUCg16ZNkhFEKr9tfG72xQtWh4IVDmdvgzma2qXLA"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 left-3 bg-[#0d0e0f]/80 backdrop-blur-md px-3 py-1 rounded text-[#ffc174] text-xs font-semibold flex items-center gap-1.5 border border-[#ffc174]/20">
                  <span className="h-2 w-2 rounded-full bg-[#ffc174] animate-pulse" />
                  AR Model Active
                </div>
              </div>

              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-headline font-bold text-base text-[#e3e2e3]">
                    {dishTitle}
                  </h4>
                  <p className="text-xs text-[#d8c3ad] mt-1">
                    Paired with Dassai Beyond 2019 • Sakura wood cold smoked table side
                  </p>
                </div>
                <span className="font-headline font-bold text-lg text-[#ffc174] font-mono">
                  ${salePrice.toFixed(2)}
                </span>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setPreviewModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-[#292a2b] hover:bg-[#343536] text-[#e3e2e3] text-xs font-semibold"
              >
                Close Visualizer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
