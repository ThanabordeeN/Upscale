import React, { useState } from 'react';
import { Sliders, Layers, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';
import { ModelConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

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
  const { t, lang } = useLanguage();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <div className="rounded-2xl border border-paper-800 bg-paper-900/40 p-5 space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between border-b border-paper-800/80 pb-3">
        <div className="flex items-center space-x-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-paper-800 text-[11px] font-mono text-terracotta-400">
            02
          </span>
          <span className="font-serif font-medium text-paper-100 text-sm sm:text-base">
            {t.step2Title}
          </span>
        </div>
        <span className="text-[11px] text-paper-400 font-sans">
          {lang === 'th' ? 'ปรับแต่งได้ตามความต้องการ' : 'User Customizable'}
        </span>
      </div>

      {/* Main Parameters: Scale and Sharpness */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Scale Multiplier */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-paper-300 font-medium">{t.scaleFactor}:</span>
            <span className="font-mono font-semibold text-terracotta-400">{scale}× Scale</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onScaleChange(2)}
              className={`rounded-xl border py-2.5 text-xs font-medium transition-all ${
                scale === 2
                  ? 'border-terracotta-500/80 bg-paper-850 text-paper-50 shadow-sm ring-1 ring-terracotta-500/30'
                  : 'border-paper-800 bg-paper-950 text-paper-400 hover:text-paper-200'
              }`}
            >
              {t.scale2x}
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={() => onScaleChange(4)}
              className={`rounded-xl border py-2.5 text-xs font-medium transition-all ${
                scale === 4
                  ? 'border-terracotta-500/80 bg-paper-850 text-paper-50 shadow-sm ring-1 ring-terracotta-500/30'
                  : 'border-paper-800 bg-paper-950 text-paper-400 hover:text-paper-200'
              }`}
            >
              {t.scale4x}
            </button>
          </div>
        </div>

        {/* Sharpness Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-paper-300 font-medium flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-terracotta-400" />
              <span>{t.sharpnessLabel}:</span>
            </span>
            <span className="font-mono text-terracotta-400 font-semibold">{sharpness}%</span>
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
              className="flex-1 accent-[#cb7035] h-1.5 bg-paper-800 rounded-lg cursor-pointer disabled:opacity-40"
            />
          </div>
          <div className="flex justify-between text-[11px] text-paper-400">
            <span>{t.sharpnessSoft}</span>
            <span>{t.sharpnessBalanced}</span>
            <span>{t.sharpnessCrisp}</span>
          </div>
        </div>
      </div>

      {/* Advanced Tiling & GPU Strategy Accordion */}
      <div className="border-t border-paper-800/80 pt-3">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
          className="flex items-center justify-between w-full text-xs font-medium text-paper-300 hover:text-paper-100 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5 text-terracotta-400" />
            <span>{t.advancedTilingToggle}</span>
          </span>
          {isAdvancedOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {isAdvancedOpen && (
          <div className="mt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-4 rounded-xl bg-paper-950/80 p-4 border border-paper-800 text-xs">
            {/* Tile Resolution */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-paper-300">{t.tileSizeLabel}:</span>
                <label className="flex items-center space-x-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoTileSize}
                    onChange={(e) => onAutoTileSizeChange(e.target.checked)}
                    disabled={disabled}
                    className="rounded border-paper-700 bg-paper-800 text-terracotta-500 h-3 w-3 focus:ring-0"
                  />
                  <span className="text-terracotta-400 text-[11px] font-medium">{t.autoAdaptive}</span>
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
                      className={`flex-1 rounded-lg border py-1.5 font-mono text-[11px] font-semibold transition-all ${
                        isActive
                          ? 'border-terracotta-500/80 bg-paper-850 text-paper-50'
                          : 'border-paper-800 bg-paper-900 text-paper-400 hover:text-paper-200'
                      } ${!isSupported ? 'opacity-30 cursor-not-allowed' : ''} ${
                        autoTileSize ? 'opacity-50 cursor-default' : ''
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
                <span className="text-paper-300">{t.overlapLabel}:</span>
                <span className="font-mono text-terracotta-400 font-semibold">{overlap}px</span>
              </div>
              <div className="flex items-center space-x-2">
                {[8, 16, 24].map((ov) => (
                  <button
                    key={ov}
                    type="button"
                    disabled={disabled}
                    onClick={() => onOverlapChange(ov)}
                    className={`flex-1 rounded-lg border py-1.5 font-mono text-[11px] font-semibold transition-all ${
                      overlap === ov
                        ? 'border-terracotta-500/80 bg-paper-850 text-paper-50'
                        : 'border-paper-800 bg-paper-900 text-paper-400 hover:text-paper-200'
                    }`}
                  >
                    {ov}px
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-paper-400 mt-1.5 block leading-relaxed">
                {t.overlapHint}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
