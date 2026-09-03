import React, { useState } from 'react';
import { Sliders, Zap, Layers, Sparkles, ChevronDown, ChevronUp, Eye } from 'lucide-react';
import { ModelConfig } from '../../types';

interface BasicParametersProps {
  model: ModelConfig;
  scale: 2 | 4;
  onScaleChange: (scale: 2 | 4) => void;
  sharpness: number;
  onSharpnessChange: (sharpness: number) => void;
  denoise: number;
  onDenoiseChange: (denoise: number) => void;
  tileSize: number;
  onTileSizeChange: (tileSize: number) => void;
  autoTileSize: boolean;
  onAutoTileSizeChange: (auto: boolean) => void;
  overlap: number;
  onOverlapChange: (overlap: number) => void;
  disabled?: boolean;
}

export const BasicParameters: React.FC<BasicParametersProps> = ({
  model,
  scale,
  onScaleChange,
  sharpness,
  onSharpnessChange,
  denoise,
  onDenoiseChange,
  tileSize,
  onTileSizeChange,
  autoTileSize,
  onAutoTileSizeChange,
  overlap,
  onOverlapChange,
  disabled = false,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <Sliders className="h-4 w-4 text-teal-400" />
          <span className="font-semibold text-slate-100 text-sm">Image & Inference Parameters</span>
        </div>
        <span className="text-[11px] text-slate-400">User Customizable</span>
      </div>

      {/* Main Parameters: Scale and Sharpness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Scale Multiplier */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Output Upscale Factor:</span>
            <span className="font-mono font-bold text-teal-400">{scale}× Resolution</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onScaleChange(2)}
              className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                scale === 2
                  ? 'border-teal-500 bg-teal-500/20 text-teal-300 shadow-sm'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              2× Scale (Compact)
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onScaleChange(4)}
              className={`rounded-xl border py-2 text-xs font-semibold transition-all ${
                scale === 4
                  ? 'border-teal-500 bg-teal-500/20 text-teal-300 shadow-sm'
                  : 'border-slate-800 bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              4× Scale (Ultra HD)
            </button>
          </div>
        </div>

        {/* Sharpness Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-teal-400" />
              <span>Detail & Edge Sharpness:</span>
            </span>
            <span className="font-mono text-teal-400 font-semibold">{sharpness}%</span>
          </div>
          <div className="flex items-center space-x-3 pt-1">
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              disabled={disabled}
              value={sharpness}
              onChange={(e) => onSharpnessChange(parseInt(e.target.value, 10))}
              className="flex-1 accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
          <div className="flex justify-between text-[10px] text-slate-500">
            <span>Natural Soft</span>
            <span>Balanced (50%)</span>
            <span>Crisp Edges</span>
          </div>
        </div>
      </div>

      {/* Advanced Tiling & GPU Strategy Accordion */}
      <div className="border-t border-slate-800/80 pt-3">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center justify-between w-full text-xs font-medium text-slate-400 hover:text-slate-200 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-teal-400" />
            <span>Hardware & Tiling Advanced Controls</span>
          </span>
          {isAdvancedOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {isAdvancedOpen && (
          <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-slate-950/60 p-3.5 border border-slate-800/60 text-xs">
            {/* Tile Resolution */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400">Tile Partition Size:</span>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoTileSize}
                    onChange={(e) => onAutoTileSizeChange(e.target.checked)}
                    disabled={disabled}
                    className="rounded border-slate-700 bg-slate-800 text-teal-500 h-3 w-3"
                  />
                  <span className="text-teal-300 text-[11px]">Auto Adaptive</span>
                </label>
              </div>
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
                      className={`flex-1 rounded-lg border py-1 font-mono text-[11px] font-semibold transition-all ${
                        isActive
                          ? 'border-teal-500 bg-teal-500/20 text-teal-300'
                          : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                      } ${!isSupported ? 'opacity-30 cursor-not-allowed' : ''} ${
                        autoTileSize ? 'opacity-60 cursor-default' : ''
                      }`}
                    >
                      {size}px
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Overlap Margin */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-slate-400">Seam Overlap Margin:</span>
                <span className="font-mono text-teal-400">{overlap}px</span>
              </div>
              <div className="flex items-center space-x-2">
                {[8, 16, 24].map((ov) => (
                  <button
                    key={ov}
                    type="button"
                    disabled={disabled}
                    onClick={() => onOverlapChange(ov)}
                    className={`flex-1 rounded-lg border py-1 font-mono text-[11px] font-semibold transition-all ${
                      overlap === ov
                        ? 'border-teal-500 bg-teal-500/20 text-teal-300'
                        : 'border-slate-800 bg-slate-800/60 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {ov}px
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 block">
                Higher overlap guarantees zero visible tile boundaries with raised-cosine blending.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
