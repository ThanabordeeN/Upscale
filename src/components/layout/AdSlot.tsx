import React from 'react';

interface AdSlotProps {
  slotId?: string;
  format?: 'horizontal' | 'rectangle' | 'in-feed';
  className?: string;
}

/**
 * Advertising container complying with Section 13:
 * - Visually isolated from image upload, upscale, and download controls
 * - Clearly marked with "Advertisement" label
 * - Clean layout that prevents accidental misclicks
 */
export const AdSlot: React.FC<AdSlotProps> = ({
  slotId = 'default-slot',
  format = 'horizontal',
  className = '',
}) => {
  return (
    <div className={`my-8 w-full flex flex-col items-center justify-center ${className}`}>
      <span className="mb-1 text-[10px] uppercase tracking-widest text-slate-500 font-medium">
        Advertisement
      </span>
      <div
        id={`ad-slot-${slotId}`}
        className={`w-full max-w-4xl rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-center text-slate-500 flex flex-col items-center justify-center min-h-[90px] ${
          format === 'rectangle' ? 'min-h-[250px]' : ''
        }`}
      >
        {/* Placeholder for Google AdSense <ins> tag */}
        <div className="flex items-center justify-center space-x-2 text-xs text-slate-500">
          <span>Sponsored Links & Resources</span>
        </div>
        <p className="mt-1 text-[11px] text-slate-600 max-w-md">
          Advertising keeps this 100% client-side AI image upscaler free with unlimited usage.
        </p>
      </div>
    </div>
  );
};
