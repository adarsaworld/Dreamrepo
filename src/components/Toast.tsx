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
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-[#1b1c1d] border border-[#292a2b] text-[#e3e2e3] px-5 py-3.5 rounded-xl shadow-[0_12px_32px_-4px_rgba(0,0,0,0.8)] transition-all animate-bounce-short">
      <span
        className={`material-symbols-outlined text-xl ${
          toast.type === 'warning'
            ? 'text-[#ffb3b6]'
            : toast.type === 'info'
            ? 'text-[#ffc174]'
            : 'text-[#56e5a9]'
        }`}
      >
        {toast.type === 'warning'
          ? 'warning'
          : toast.type === 'info'
          ? 'info'
          : 'task_alt'}
      </span>
      <div className="flex flex-col">
        <span className="font-headline font-bold text-xs text-[#e3e2e3] leading-tight">
          {toast.title}
        </span>
        <span className="text-[11px] text-[#d8c3ad] max-w-sm mt-0.5">
          {toast.description}
        </span>
      </div>
      <button
        onClick={onDismiss}
        className="ml-2 text-[#a08e7a] hover:text-[#e3e2e3] p-1 transition-colors"
      >
        <span className="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
  );
};
