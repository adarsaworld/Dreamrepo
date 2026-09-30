import React, { useState } from 'react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  compact?: boolean;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ compact = false }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running in standalone mode, hide
  if (isInstalled) {
    return null;
  }

  // Desktop / Android / Chrome flow
  if (isInstallable) {
    return (
      <button
        onClick={install}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#f59e0b] to-[#ea580c] text-white font-bold text-xs shadow-md hover:brightness-110 active:scale-95 transition-all cursor-pointer ${
          compact ? 'text-[11px] py-1 px-2.5' : ''
        }`}
        title="Install Kizen Empire Suite to Desktop or Mobile"
      >
        <span className="material-symbols-outlined text-base">download_for_offline</span>
        <span>Install App</span>
      </button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-[#f5efe4] text-[#b45309] font-bold text-xs border border-[#e8decb] shadow-xs transition-colors cursor-pointer ${
            compact ? 'text-[11px] py-1 px-2.5' : ''
          }`}
          title="Install on Apple iOS Safari"
        >
          <span className="material-symbols-outlined text-base">ios_share</span>
          <span>Add to iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-fade-in">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-[#e8decb] space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-[#f0ece1]">
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-xl text-[#b45309]">install_mobile</span>
                  <h3 className="font-headline font-bold text-base text-[#1c1917]">
                    Install on iPhone / iPad
                  </h3>
                </div>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 rounded-lg text-[#78716c] hover:text-[#1c1917] hover:bg-[#faf8f5]"
                >
                  <span className="material-symbols-outlined text-lg">close</span>
                </button>
              </div>

              <div className="text-xs text-[#57534e] space-y-2.5 leading-relaxed">
                <p>To run Kizen Empire standalone with zero browser chrome and instant offline access:</p>
                <ol className="list-decimal pl-4 space-y-1.5 font-medium text-[#1c1917]">
                  <li>Tap the <strong>Share</strong> button (box with upward arrow) in the Safari toolbar.</li>
                  <li>Scroll down the actions list and tap <strong>Add to Home Screen</strong>.</li>
                  <li>Tap <strong>Add</strong> in the top-right corner to launch.</li>
                </ol>
              </div>

              <button
                onClick={() => setShowIOSGuide(false)}
                className="w-full py-2.5 rounded-xl bg-[#faf8f5] hover:bg-[#f4eee2] text-xs font-bold text-[#1c1917] border border-[#e8decb] transition-colors"
              >
                Understood
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
