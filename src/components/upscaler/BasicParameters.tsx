import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { ModelConfig } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

import { ResolutionMode } from '../../hooks/useUpscaler';

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
  resolutionMode: ResolutionMode;
  onResolutionModeChange: (mode: ResolutionMode) => void;
  estimatedTiles?: number;
  effectiveDimensions?: { width: number; height: number; wasResized: boolean } | null;
  disabled?: boolean;
}

export const BasicParameters: React.FC<BasicParametersProps> = ({
  model,
  scale,
  onScaleChange,
  sharpness,
  onSharpnessChange,
  tileSize,
  onTileSizeChange,
  autoTileSize,
  onAutoTileSizeChange,
  overlap,
  onOverlapChange,
  resolutionMode,
  onResolutionModeChange,
  estimatedTiles,
  effectiveDimensions,
  disabled = false,
}) => {
  const { t, lang } = useLanguage();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  return (
    <div className="space-y-4 rounded-[22px] bg-paper-900/45 p-4 ring-1 ring-inset ring-white/10 sm:p-5">
      {/* Resolution & Performance Mode */}
      <div className="space-y-2 rounded-xl bg-paper-950/60 p-3 ring-1 ring-white/5">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-paper-300">
            {lang === 'th' ? '⚡ ความเร็วและขนาดประมวลผล' : '⚡ Speed & Input Sizing'}
          </span>
          {typeof estimatedTiles === 'number' && estimatedTiles > 0 && (
            <span className={`text-[11px] font-mono ${estimatedTiles > 30 ? 'text-amber-400' : 'text-sage-400'}`}>
              {estimatedTiles} tiles {estimatedTiles > 30 ? (lang === 'th' ? '(ใช้เวลานาน)' : '(Heavy)') : (lang === 'th' ? '(แนะนำ / เร็ว)' : '(Fast)')}
            </span>
          )}
        </div>
        <div className="grid grid-cols-3 gap-1.5">
          {(['fast', 'balanced', 'original'] as const).map((mode) => {
            const isSelected = resolutionMode === mode;
            const label =
              mode === 'fast'
                ? (lang === 'th' ? '⚡ เร็ว (1280p)' : '⚡ Fast (1280p)')
                : mode === 'balanced'
                ? (lang === 'th' ? '🎯 กลาง (1080p)' : '🎯 Balanced (1080p)')
                : (lang === 'th' ? '💎 ต้นฉบับ' : '💎 Original');
            return (
              <button
                key={mode}
                type="button"
                disabled={disabled}
                onClick={() => onResolutionModeChange(mode)}
                className={`rounded-lg py-2 px-1.5 text-center text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-paper-50 text-paper-950 shadow-sm'
                    : 'bg-paper-900/90 text-paper-400 hover:text-paper-100 hover:bg-paper-800'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
        {effectiveDimensions && effectiveDimensions.wasResized && (
          <p className="text-[11px] text-paper-400">
            {lang === 'th'
              ? `* ปรับขนาดภาพเข้าเป็น ${effectiveDimensions.width} × ${effectiveDimensions.height} px ก่อนขยาย เพื่อให้เสร็จในไม่กี่วินาที`
              : `* Pre-scales input to ${effectiveDimensions.width} × ${effectiveDimensions.height} px for ultra-fast generation`}
          </p>
        )}
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-paper-300">{t.scaleFactor}</span>
            <span className="font-medium text-paper-500">{scale}×</span>
          </div>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-paper-950/70 p-1">
            {[2, 4].map((value) => (
              <button
                key={value}
                type="button"
                disabled={disabled}
                onClick={() => onScaleChange(value as 2 | 4)}
                className={`rounded-[10px] py-2 text-xs font-semibold transition-all ${
                  scale === value
                    ? 'bg-paper-50 text-paper-950 shadow-sm'
                    : 'text-paper-400 hover:text-paper-100'
                }`}
              >
                {value}×
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-paper-300">{t.sharpnessLabel}</span>
            <span className="font-medium text-paper-500">{sharpness}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            disabled={disabled}
            value={sharpness}
            onChange={(e) => onSharpnessChange(parseInt(e.target.value, 10))}
            className="h-1.5 w-full cursor-pointer rounded-lg bg-paper-800 accent-[#2997ff] disabled:opacity-40"
          />
        </div>
      </div>

      <div className="border-t border-white/10 pt-3">
        <button
          type="button"
          onClick={() => setIsAdvancedOpen((value) => !value)}
          className="flex w-full items-center justify-between text-xs font-medium text-paper-500 transition-colors hover:text-paper-200"
        >
          <span>{lang === 'th' ? 'ขั้นสูง' : 'Advanced'}</span>
          {isAdvancedOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
        </button>

        {isAdvancedOpen && (
          <div className="mt-4 grid gap-4 text-xs sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-paper-400">{t.tileSizeLabel}</span>
                <label className="flex items-center gap-1.5 text-[11px] text-paper-500">
                  <input
                    type="checkbox"
                    checked={autoTileSize}
                    onChange={(e) => onAutoTileSizeChange(e.target.checked)}
                    disabled={disabled}
                    className="h-3 w-3 rounded border-paper-700 bg-paper-800 text-terracotta-500 focus:ring-0"
                  />
                  Auto
                </label>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[128, 256, 512].map((size) => {
                  const supported = model.recommendedTileSizes.includes(size);
                  const active = (autoTileSize ? model.defaultTileSize : tileSize) === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={disabled || autoTileSize || !supported}
                      onClick={() => onTileSizeChange(size)}
                      className={`rounded-lg py-1.5 text-[11px] font-medium ${
                        active ? 'bg-paper-100 text-paper-950' : 'bg-paper-800 text-paper-400'
                      } ${!supported ? 'opacity-30' : ''}`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-paper-400">{t.overlapLabel}</span>
                <span className="text-[11px] text-paper-500">{overlap}px</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[8, 16, 24].map((value) => (
                  <button
                    key={value}
                    type="button"
                    disabled={disabled}
                    onClick={() => onOverlapChange(value)}
                    className={`rounded-lg py-1.5 text-[11px] font-medium ${
                      overlap === value ? 'bg-paper-100 text-paper-950' : 'bg-paper-800 text-paper-400'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
