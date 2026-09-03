import React from 'react';
import { Sliders, Layers, Info } from 'lucide-react';
import { ModelConfig } from '../../types';

interface TileSettingsProps {
  model: ModelConfig;
  tileSize: number;
  autoTileSize: boolean;
  overlap: number;
  onTileSizeChange: (size: number) => void;
  onAutoChange: (auto: boolean) => void;
  onOverlapChange: (overlap: number) => void;
  disabled?: boolean;
}

export const TileSettings: React.FC<TileSettingsProps> = ({
  model,
  tileSize,
  autoTileSize,
  overlap,
  onTileSizeChange,
  onAutoChange,
  disabled = false,
}) => {
  return (
    <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-4 text-xs">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Layers className="h-4 w-4 text-teal-400" />
          <span className="font-semibold text-slate-200">Tiling & Memory Strategy</span>
        </div>
        <label className="flex items-center space-x-2 cursor-pointer">
          <input
            type="checkbox"
            checked={autoTileSize}
            onChange={(e) => onAutoChange(e.target.checked)}
            disabled={disabled}
            className="rounded border-slate-700 bg-slate-800 text-teal-500 focus:ring-teal-500 h-3.5 w-3.5"
          />
          <span className="text-slate-300 font-medium">Auto Adaptive</span>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Tile Size Picker */}
        <div>
          <span className="text-slate-400 block mb-1.5">Tile Resolution:</span>
          <div className="flex items-center space-x-2">
            {[128, 256, 512].map((size) => {
              const isSupported = model.recommendedTileSizes.includes(size);
              const isActive = (autoTileSize ? model.defaultTileSize : tileSize) === size;

              return (
                <button
                  key={size}
                  type="button"
                  disabled={disabled || autoTileSize || !isSupported}
                  onClick={() => onTileSizeChange(size)}
                  className={`flex-1 rounded-lg border py-1.5 text-center font-mono font-medium transition-all ${
                    isActive
                      ? 'border-teal-500 bg-teal-500/20 text-teal-300'
                      : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                  } ${!isSupported ? 'opacity-40 cursor-not-allowed' : ''} ${
                    autoTileSize ? 'opacity-70 cursor-default' : ''
                  }`}
                >
                  {size}px
                </button>
              );
            })}
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            {autoTileSize
              ? `Auto-managed (${model.defaultTileSize}px with automatic OOM downgrade)`
              : 'Manual tile size override'}
          </span>
        </div>

        {/* Overlap Info */}
        <div>
          <span className="text-slate-400 block mb-1.5">Seam Blending Overlap:</span>
          <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 px-3 py-1.5 text-slate-300">
            <span>Cosine Overlap Margin</span>
            <span className="font-mono text-teal-400 font-semibold">{overlap}px (64px upscaled)</span>
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Raised-cosine window eliminates tile grid lines & seams completely.
          </span>
        </div>
      </div>
    </div>
  );
};
