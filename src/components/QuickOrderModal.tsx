import React, { useState } from 'react';
import { LocationId } from '../types';
import { Tooltip } from './Tooltip';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-[#e8decb] rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-[#f0ece1]">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-xl">event_available</span>
            </div>
            <div>
              <h3 className="font-headline font-bold text-lg text-[#1c1917]">
                Express Reservation & Direct Dispatch
              </h3>
              <p className="text-xs text-[#78716c]">
                Syndicate National VIP Guest Ledger & POS Injection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#78716c] hover:text-[#1c1917] hover:bg-[#faf8f5] transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-1 p-1 bg-[#faf8f5] rounded-xl border border-[#e8decb]">
          <Tooltip content="Reserve fine dining table in Royal Durbar" position="bottom" className="flex-1">
            <button
              type="button"
              onClick={() => setOrderType('reserve')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                orderType === 'reserve'
                  ? 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              <span className="material-symbols-outlined text-base">table_restaurant</span>
              <span>Table Reservation (Dine-In)</span>
            </button>
          </Tooltip>
          <Tooltip content="Dispatch priority temperature-controlled courier" position="bottom" className="flex-1">
            <button
              type="button"
              onClick={() => setOrderType('delivery')}
              className={`w-full py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                orderType === 'delivery'
                  ? 'bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white shadow-xs'
                  : 'text-[#57534e] hover:text-[#1c1917]'
              }`}
            >
              <span className="material-symbols-outlined text-base">moped</span>
              <span>Priority Fleet Delivery</span>
            </button>
          </Tooltip>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Target Outpost (Metro)
              </label>
              <select
                value={outpost}
                onChange={(e) => setOutpost(e.target.value)}
                className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2.5 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
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
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                {orderType === 'reserve' ? 'Party Size (Covers)' : 'Packaging Servings'}
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={guests}
                  onChange={(e) => setGuests(parseInt(e.target.value) || 1)}
                  className="w-full bg-[#faf8f5] text-[#1c1917] font-mono font-bold px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
                />
                <span className="text-xs text-[#78716c] shrink-0 font-medium">Guests</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
              Guest Name / Lead VIP Entity
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
            />
          </div>

          {orderType === 'reserve' ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Seating Configuration
              </label>
              <select
                value={tableType}
                onChange={(e) => setTableType(e.target.value)}
                className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2.5 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
              >
                <option value="Royal Durbar VIP Suite">Royal Durbar VIP Suite (Dedicated Server)</option>
                <option value="Main Dining Room Banquette">Main Dining Room Center Banquette</option>
                <option value="Clay Tandoor & Sigdi Chef Counter">Clay Tandoor & Sigdi Chef Counter (Front Row)</option>
                <option value="Sommelier Reserve Vault Table">Sommelier Reserve Vault Table</option>
              </select>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
                Destination Address & Chauffeur Instructions
              </label>
              <input
                type="text"
                defaultValue="Penthouse 32, Altamount Road, Mumbai • Private Concierge Chauffeur"
                className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
              Curated Royal Degustation Tier
            </label>
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2.5 rounded-xl text-sm border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50"
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
          <div className="p-4 rounded-xl bg-[#faf8f5] border border-[#e8decb] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="pairing-chk"
                checked={includePairing}
                onChange={(e) => setIncludePairing(e.target.checked)}
                className="h-4 w-4 rounded accent-[#f59e0b] cursor-pointer"
              />
              <label htmlFor="pairing-chk" className="cursor-pointer">
                <span className="text-xs font-bold text-[#1c1917] block">
                  Add Grover Zampa 'Chene Grand Reserve' & Single Malt Pairing
                </span>
                <span className="text-[11px] text-[#78716c]">
                  Pre-allocated barrel vintages curated by Master Sommelier (+₹2,500/cover)
                </span>
              </label>
            </div>
            <span className="text-xs font-bold text-[#b45309] shrink-0 font-mono">
              +₹{(pairingPrice * guests).toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#78716c] mb-1.5">
              Allergies & Dietary Specifics
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#faf8f5] text-[#1c1917] px-3.5 py-2 rounded-xl text-xs leading-relaxed border border-[#e8decb] focus:outline-none focus:ring-2 focus:ring-[#f59e0b]/50 resize-none"
            />
          </div>

          {/* Pricing Summary */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-[#faf8f5] to-[#f5efe4] border border-[#e8decb] flex items-center justify-between">
            <div>
              <span className="text-[10px] text-[#78716c] uppercase tracking-wider block font-bold">
                Projected Transaction Value
              </span>
              <span className="text-xl font-headline font-bold text-[#b45309] font-mono">
                ₹{totalPrice.toLocaleString('en-IN')}{' '}
                <span className="text-xs text-[#57534e] font-normal">INR (Incl. GST)</span>
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Tooltip content="Discard and close reservation dialog">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl bg-white hover:bg-[#faf8f5] text-xs font-bold text-[#57534e] border border-[#e8decb] transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </Tooltip>
              <Tooltip content="Fire order to KDS line & record in VIP ledger" subcontent="Instant POS Injection">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">bolt</span>
                  <span>Direct Fire Order</span>
                </button>
              </Tooltip>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
