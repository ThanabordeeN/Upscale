import React from 'react';
import { Zap, Camera, HardDrive, Sparkles, Check } from 'lucide-react';
import { ModelMode } from '../../types';
import { AVAILABLE_MODELS } from '../../config/models';
import { useLanguage } from '../../context/LanguageContext';

interface ModelSelectorProps {
  currentMode: ModelMode;
  onSelectMode: (mode: ModelMode) => void;
  isCached: boolean;
  isCheckingCache: boolean;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentMode,
  onSelectMode,
  isCached,
  isCheckingCache,
  disabled = false,
}) => {
  const { t, lang } = useLanguage();
  const models = Object.values(AVAILABLE_MODELS);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between border-b border-paper-800/80 pb-2">
        <label className="text-sm font-serif font-medium text-paper-100 flex items-center gap-2">
          <span className="flex h-5 w-5 items-center justify-center rounded-full bg-paper-800 text-[11px] font-mono text-terracotta-400">
            01
          </span>
          <span>{t.step1Title}</span>
        </label>
        <div className="flex items-center space-x-1.5 text-xs text-paper-400">
          <HardDrive className="w-3.5 h-3.5 text-paper-500" />
          <span>
            {isCheckingCache
              ? (lang === 'th' ? 'กำลังตรวจสอบแคช...' : 'Checking cache...')
              : isCached
              ? (lang === 'th' ? 'โมเดลพร้อมในเครื่อง (ไม่ต้องดาวน์โหลดใหม่) ✓' : 'Model cached locally ✓')
              : t.downloadNotice}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
        {models.map((model) => {
          const isSelected = currentMode === model.id;
          const isFast = model.id === 'fast';

          const title = isFast ? t.fastModeTitle : t.photoModeTitle;
          const badge = isFast ? t.fastModeBadge : t.photoModeBadge;
          const desc = isFast ? t.fastModeDesc : t.photoModeDesc;

          return (
            <div
              key={model.id}
              onClick={() => !disabled && onSelectMode(model.id)}
              className={`relative flex flex-col justify-between rounded-2xl border p-4.5 transition-all cursor-pointer ${
                isSelected
                  ? 'border-terracotta-500/80 bg-paper-850 shadow-md ring-1 ring-terracotta-500/30'
                  : 'border-paper-800 bg-paper-900/40 hover:border-paper-700 hover:bg-paper-900/80'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center space-x-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      isFast
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-terracotta-500/10 text-terracotta-400 border-terracotta-500/20'
                    }`}
                  >
                    {isFast ? <Zap className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
                  </div>
                  <div>
                    <h4 className="font-serif font-medium text-paper-50 text-sm sm:text-base">
                      {title}
                    </h4>
                    <span className="text-[11px] font-mono text-paper-400">{model.architecture}</span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium border ${
                    isSelected
                      ? 'bg-terracotta-500/15 text-terracotta-300 border-terracotta-500/30'
                      : 'bg-paper-800 text-paper-400 border-paper-750'
                  }`}
                >
                  {badge}
                </span>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-paper-300 leading-relaxed">
                {desc}
              </p>

              {/* Best for tags */}
              <div className="mt-3 flex flex-wrap gap-1.5">
                {model.bestFor.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded-md bg-paper-800/90 px-2 py-0.5 text-[10px] text-paper-300 border border-paper-750"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Memory estimate footer */}
              <div className="mt-3.5 flex items-center justify-between border-t border-paper-800/60 pt-2 text-[11px] text-paper-400">
                <span>VRAM: ~{model.estimatedMemoryMB} MB</span>
                <span className="text-terracotta-400 font-mono font-medium">4× Native Scale</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
