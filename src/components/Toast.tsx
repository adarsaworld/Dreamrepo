import React, { useEffect } from 'react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        onDismiss();
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-white border border-[#e8decb] text-[#1c1917] px-5 py-3.5 rounded-2xl shadow-[0_20px_40px_-8px_rgba(180,83,9,0.2)] transition-all animate-bounce-short">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
          toast.type === 'warning'
            ? 'bg-[#fef2f2] text-[#dc2626] border border-[#fecaca]'
            : toast.type === 'info'
            ? 'bg-[#eff6ff] text-[#2563eb] border border-[#bfdbfe]'
            : 'bg-[#ecfdf5] text-[#047857] border border-[#a7f3d0]'
        }`}
      >
        <span className="material-symbols-outlined text-lg">
          {toast.type === 'warning'
            ? 'warning'
            : toast.type === 'info'
            ? 'info'
            : 'check_circle'}
        </span>
      </div>
      <div className="flex flex-col">
        <span className="font-headline font-bold text-xs text-[#1c1917] leading-tight">
          {toast.title}
        </span>
        <span className="text-[11px] text-[#78716c] max-w-sm mt-0.5 font-medium">
          {toast.description}
        </span>
      </div>
      <button
        onClick={onDismiss}
        className="ml-3 text-[#a8a29e] hover:text-[#1c1917] p-1 rounded-lg hover:bg-[#f5efe4] transition-colors cursor-pointer"
      >
        <span className="material-symbols-outlined text-base">close</span>
      </button>
    </div>
  );
};
