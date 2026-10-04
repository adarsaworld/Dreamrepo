import React, { useState, useEffect } from 'react';

interface DoubleDeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
  itemType?: string;
  itemSubdetails?: string;
  warningNote?: string;
  requireTyping?: boolean;
  isDarkMode?: boolean;
}

export const DoubleDeleteConfirmModal: React.FC<DoubleDeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
  itemType = 'Record',
  itemSubdetails,
  warningNote = 'This action is irreversible. The record will be permanently purged from the Kizen Empire national ledger.',
  requireTyping = true,
  isDarkMode = false,
}) => {
  const [confirmedCheckbox, setConfirmedCheckbox] = useState(false);
  const [typedConfirmation, setTypedConfirmation] = useState('');

  // Reset state when opened/closed
  useEffect(() => {
    if (isOpen) {
      setConfirmedCheckbox(false);
      setTypedConfirmation('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isTypedMatch = requireTyping ? typedConfirmation.trim().toUpperCase() === 'DELETE' : true;
  const isFullyArmed = confirmedCheckbox && isTypedMatch;

  const handleExecuteDelete = () => {
    if (!isFullyArmed) return;
    onConfirm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`border rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-[0_25px_60px_-15px_rgba(220,38,38,0.35)] space-y-5 relative transition-all ${
          isDarkMode
            ? 'bg-[#15171e] border-[#7f1d1d]/80 text-[#f3f4f6]'
            : 'bg-white border-[#fecaca] text-[#1c1917]'
        }`}
      >
        {/* Warning Badge & Header */}
        <div className="flex items-start gap-3.5">
          <div
            className={`h-12 w-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-sm ${
              isDarkMode
                ? 'bg-[#450a0a] text-[#f87171] border-[#7f1d1d]'
                : 'bg-[#fef2f2] text-[#dc2626] border-[#fecaca]'
            }`}
          >
            <span className="material-symbols-outlined text-2xl animate-pulse">delete_forever</span>
          </div>
          <div>
            <span
              className={`text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full border ${
                isDarkMode
                  ? 'text-[#fca5a5] bg-[#7f1d1d]/50 border-[#991b1b]'
                  : 'text-[#dc2626] bg-[#fef2f2] border-[#fecaca]'
              }`}
            >
              Double Verification Required
            </span>
            <h3
              className={`font-headline font-bold text-lg mt-1 tracking-tight ${
                isDarkMode ? 'text-white' : 'text-[#1c1917]'
              }`}
            >
              Are you sure you want to delete?
            </h3>
            <p className={`text-xs ${isDarkMode ? 'text-[#9ca3af]' : 'text-[#78716c]'}`}>
              Confirming permanent removal of this {itemType.toLowerCase()}.
            </p>
          </div>
        </div>

        {/* Target Item Information Box */}
        <div
          className={`p-4 rounded-2xl border space-y-1.5 ${
            isDarkMode
              ? 'bg-[#1b1f2b] border-[#2c3345]'
              : 'bg-[#faf8f5] border-[#e8decb]'
          }`}
        >
          <span
            className={`text-[10px] uppercase font-bold tracking-wider block ${
              isDarkMode ? 'text-[#9ca3af]' : 'text-[#78716c]'
            }`}
          >
            Target {itemType} for Deletion:
          </span>
          <div
            className={`font-headline font-bold text-sm break-words ${
              isDarkMode ? 'text-white' : 'text-[#1c1917]'
            }`}
          >
            {itemName}
          </div>
          {itemSubdetails && (
            <div className="text-[11px] font-mono text-[#f59e0b] font-medium">
              {itemSubdetails}
            </div>
          )}
        </div>

        {/* Warning Explanation */}
        <div
          className={`p-3.5 rounded-xl border text-xs space-y-1 ${
            isDarkMode
              ? 'bg-[#450a0a]/50 border-[#7f1d1d] text-[#fca5a5]'
              : 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
          }`}
        >
          <div className="flex items-center gap-1.5 font-bold">
            <span className="material-symbols-outlined text-sm">warning</span>
            <span>Destructive Operation Warning</span>
          </div>
          <p className="text-[11px] leading-relaxed opacity-95">
            {warningNote}
          </p>
        </div>

        {/* Step 1: Verification Checkbox */}
        <label
          className={`flex items-start gap-2.5 p-3 rounded-xl border transition-colors cursor-pointer select-none ${
            isDarkMode
              ? 'bg-[#1a1d26] border-[#374151] hover:bg-[#202532]'
              : 'bg-white border-[#e8decb] hover:bg-[#faf8f5]'
          }`}
        >
          <input
            type="checkbox"
            checked={confirmedCheckbox}
            onChange={(e) => setConfirmedCheckbox(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded text-[#dc2626] focus:ring-[#dc2626] border-[#4b5563] cursor-pointer"
          />
          <span
            className={`text-xs leading-snug ${
              isDarkMode ? 'text-[#e5e7eb]' : 'text-[#1c1917]'
            }`}
          >
            <strong className="text-[#dc2626]">1st Verification:</strong> I confirm that I want to permanently delete this {itemType.toLowerCase()} and understand this cannot be undone.
          </span>
        </label>

        {/* Step 2: Confirmation Typing */}
        {requireTyping && (
          <div className="space-y-1.5">
            <label
              className={`block text-[11px] font-bold ${
                isDarkMode ? 'text-[#d1d5db]' : 'text-[#57534e]'
              }`}
            >
              <strong className="text-[#dc2626]">2nd Verification:</strong> Type{' '}
              <span className="font-mono text-[#dc2626] font-bold tracking-wider">&quot;DELETE&quot;</span> below to unlock:
            </label>
            <input
              type="text"
              placeholder='Type "DELETE" here'
              value={typedConfirmation}
              onChange={(e) => setTypedConfirmation(e.target.value)}
              className={`w-full font-mono font-bold text-xs uppercase px-3.5 py-2.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-[#dc2626]/50 placeholder:normal-case placeholder:font-normal ${
                isDarkMode
                  ? 'bg-[#12141a] text-white border-[#374151] placeholder:text-[#6b7280]'
                  : 'bg-[#faf8f5] text-[#1c1917] border-[#e8decb] placeholder:text-[#a8a29e]'
              }`}
            />
          </div>
        )}

        {/* Action Buttons */}
        <div
          className={`flex items-center justify-end gap-2.5 pt-3 border-t ${
            isDarkMode ? 'border-[#2d3342]' : 'border-[#f0ece1]'
          }`}
        >
          <button
            type="button"
            onClick={onClose}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              isDarkMode
                ? 'bg-[#1a1d26] hover:bg-[#242a38] text-[#9ca3af] hover:text-white border-[#374151]'
                : 'bg-[#faf8f5] hover:bg-[#f4eee2] text-[#57534e] hover:text-[#1c1917] border-[#e8decb]'
            }`}
          >
            Cancel & Keep Safe
          </button>

          <button
            type="button"
            disabled={!isFullyArmed}
            onClick={handleExecuteDelete}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-md ${
              isFullyArmed
                ? 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-[0_4px_16px_rgba(220,38,38,0.45)] hover:brightness-110 active:scale-95'
                : isDarkMode
                ? 'bg-[#262a35] text-[#6b7280] border border-[#374151] cursor-not-allowed opacity-50 shadow-none'
                : 'bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed opacity-60 shadow-none'
            }`}
          >
            <span className="material-symbols-outlined text-sm">delete_forever</span>
            <span>Confirm Permanent Deletion</span>
          </button>
        </div>
      </div>
    </div>
  );
};
