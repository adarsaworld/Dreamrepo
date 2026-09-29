import React, { useState } from 'react';
import { LocationId } from '../types';

interface QuickOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (summary: string) => void;
  currentLocation: LocationId;
}

export const QuickOrderModal: React.FC<QuickOrderModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentLocation,
}) => {
  const [orderType, setOrderType] = useState<'reserve' | 'delivery'>('reserve');
  const [outpost, setOutpost] = useState<string>(
    currentLocation === 'all' ? 'mumbai' : currentLocation
  );
  const [guests, setGuests] = useState<number>(4);
  const [guestName, setGuestName] = useState<string>('Maharaja Singhania & Party');
  const [tableType, setTableType] = useState<string>('Royal Durbar VIP Suite');
  const [selectedExperience, setSelectedExperience] = useState<string>('Royal Awadhi Grand Degustation (11-Course)');
  const [includePairing, setIncludePairing] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('Guest prefers pure Jain preparation for 2 covers, extra saffron sheermal, and rare single malt reserve on arrival.');

  if (!isOpen) return null;

  const basePricePerCover = selectedExperience.includes('Grand')
    ? 6500
    : selectedExperience.includes('Signature')
    ? 4800
    : 5400;
  const pairingPrice = includePairing ? 2500 : 0;
  const totalPrice = (basePricePerCover + pairingPrice) * guests;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess(
      `${orderType === 'reserve' ? 'Reservation confirmed' : 'Express order sent'}: ${guestName} (${guests} covers) at ${outpost.toUpperCase()} for ₹${totalPrice.toLocaleString('en-IN')}.`
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="bg-[#1b1c1d] border border-[#292a2b] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#292a2b]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ffc174] flex items-center justify-center text-[#472a00]">
              <span className="material-symbols-outlined text-xl">event_available</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-[#e3e2e3]">
                Express Reservation & Direct Dispatch
              </h3>
              <p className="text-xs text-[#a08e7a]">
                Syndicate National VIP Guest Ledger & POS Injection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a08e7a] hover:text-[#e3e2e3] hover:bg-[#292a2b] transition-colors"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#0d0e0f] rounded-xl border border-[#292a2b]">
          <button
            type="button"
            onClick={() => setOrderType('reserve')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              orderType === 'reserve'
                ? 'bg-[#f59e0b] text-[#472a00] shadow-sm'
                : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
            }`}
          >
            <span className="material-symbols-outlined text-base">table_restaurant</span>
            <span>Table Reservation (Dine-In)</span>
          </button>
          <button
            type="button"
            onClick={() => setOrderType('delivery')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-2 ${
              orderType === 'delivery'
                ? 'bg-[#f59e0b] text-[#472a00] shadow-sm'
                : 'text-[#d8c3ad] hover:text-[#e3e2e3]'
            }`}
          >
            <span className="material-symbols-outlined text-base">moped</span>
            <span>Priority Fleet Delivery</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                Target Outpost (Metro)
              </label>
              <select
                value={outpost}
                onChange={(e) => setOutpost(e.target.value)}
                className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
              >
                <option value="mumbai">Mumbai BKC Flagship</option>
                <option value="delhi">New Delhi Lutyens</option>
                <option value="bengaluru">Bengaluru Indiranagar</option>
                <option value="hyderabad">Hyderabad Jubilee Hills</option>
                <option value="kolkata">Kolkata Park Street</option>
                <option value="chennai">Chennai Nungambakkam</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                {orderType === 'reserve' ? 'Party Size (Covers)' : 'Packaging Servings'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
                />
                <span className="text-xs text-[#a08e7a] shrink-0 font-medium">Guests</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
              Guest Name / Lead VIP Entity
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
            />
          </div>

          {orderType === 'reserve' ? (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                Seating Configuration
              </label>
              <select
                value={tableType}
                onChange={(e) => setTableType(e.target.value)}
                className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
              >
                <option value="Royal Durbar VIP Suite">Royal Durbar VIP Suite (Dedicated Server)</option>
                <option value="Main Dining Room Banquette">Main Dining Room Center Banquette</option>
                <option value="Clay Tandoor & Sigdi Chef Counter">Clay Tandoor & Sigdi Chef Counter (Front Row)</option>
                <option value="Sommelier Reserve Vault Table">Sommelier Reserve Vault Table</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
                Destination Address & Chauffeur Instructions
              </label>
              <input
                type="text"
                defaultValue="Penthouse 32, Altamount Road, Mumbai • Private Concierge Chauffeur"
                className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
              Curated Royal Degustation Tier
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-sm border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174]"
            >
              <option value="Royal Awadhi Grand Degustation (11-Course)">
                Royal Awadhi Grand Degustation (₹6,500 / cover)
              </option>
              <option value="Signature Tandoori Truffle & Seafood Flight (7-Course)">
                Signature Tandoori Truffle & Seafood Flight (₹4,800 / cover)
              </option>
              <option value="Executive Nizam Shahi Dawat (Seasonal)">
                Executive Nizam Shahi Dawat (₹5,400 / cover)
              </option>
            </select>
          </div>

          {/* Sommelier Add-on */}
          <div className="p-3.5 rounded-xl bg-[#0d0e0f] border border-[#292a2b] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pairing-chk"
                checked={includePairing}
                onChange={(e) => setIncludePairing(e.target.checked)}
                className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
              />
              <label htmlFor="pairing-chk" className="cursor-pointer">
                <span className="text-xs font-semibold text-[#e3e2e3] block">
                  Add Grover Zampa 'Chene Grand Reserve' & Single Malt Pairing
                </span>
                <span className="text-[11px] text-[#a08e7a]">
                  Pre-allocated barrel vintages curated by Master Sommelier (+₹2,500/cover)
                </span>
              </label>
            </div>
            <span className="text-xs font-bold text-[#ffc174] shrink-0 font-mono">
              +₹{(pairingPrice * guests).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a08e7a] mb-1.5">
              Allergies & Dietary Specifics
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#292a2b] text-[#e3e2e3] px-3.5 py-2 rounded-lg text-xs leading-relaxed border border-[#343536] focus:outline-none focus:ring-1 focus:ring-[#ffc174] resize-none"
            />
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-xl bg-[#292a2b]/80 border border-[#343536] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#a08e7a] uppercase tracking-wider block font-bold">
                Projected Transaction Value
              </span>
              <span className="text-xl font-headline font-bold text-[#ffc174] font-mono">
                ₹{totalPrice.toLocaleString('en-IN')}{' '}
                <span className="text-xs text-[#d8c3ad] font-normal">INR (Incl. GST)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-[#343536] hover:bg-[#39393a] text-xs font-semibold text-[#e3e2e3] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-gradient-to-r from-[#f59e0b] to-[#ffc174] text-[#472a00] text-xs font-bold shadow-[0_0_15px_rgba(245,158,11,0.35)] hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">bolt</span>
                <span>Direct Fire Order</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
