import React, { useState, useRef } from 'react';

interface TooltipProps {
  content: string;
  subcontent?: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactNode;
  delay?: number;
  className?: string;
  maxWidth?: string;
  fullWidth?: boolean;
}

export const Tooltip: React.FC<TooltipProps> = ({
  content,
  subcontent,
  position = 'top',
  children,
  delay = 120,
  className = '',
  maxWidth = 'max-w-xs',
  fullWidth = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setIsVisible(false);
  };

  // Position coordinates
  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-[#111318] border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-[#111318] border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-[#111318] border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-[#111318] border-y-transparent border-l-transparent',
  };

  return (
    <div
      className={`relative ${fullWidth ? 'w-full' : 'inline-flex'} items-center ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={() => setIsVisible(true)}
      onBlur={handleMouseLeave}
    >
      {children}

      {isVisible && content && (
        <div
          role="tooltip"
          className={`absolute z-50 pointer-events-none px-3 py-2 rounded-xl bg-[#111318]/95 backdrop-blur-md text-white text-[11px] leading-snug font-medium tracking-wide shadow-[0_12px_30px_rgba(0,0,0,0.55)] border border-[#2a2e39] animate-fade-in ${maxWidth} ${positionClasses[position]}`}
        >
          <div className="flex flex-col gap-0.5 text-left">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="font-semibold text-white/95">{content}</span>
              {subcontent && (
                <span className="text-[9px] text-[#f59e0b] font-mono font-bold bg-[#f59e0b]/20 px-1.5 py-0.5 rounded border border-[#f59e0b]/35 uppercase tracking-wider">
                  {subcontent}
                </span>
              )}
            </div>
          </div>
          {/* Subtle Arrow */}
          <div
            className={`absolute w-0 h-0 border-4 ${arrowClasses[position]}`}
          />
        </div>
      )}
    </div>
  );
};
