import React from 'react';
import { Zap, Camera, Check, HardDrive, Sparkles } from 'lucide-react';
import { ModelMode, ModelConfig } from '../../types';
import { AVAILABLE_MODELS } from '../../config/models';

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
  const models = Object.values(AVAILABLE_MODELS);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-slate-200 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-teal-400" />
          <span>Select AI Super-Resolution Model</span>
        </label>
        <div className="flex items-center space-x-1.5 text-xs text-slate-400">
          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {isCheckingCache
              ? 'Checking cache...'
              : isCached
              ? 'Model stored in local cache ✓'
              : 'Downloads on demand on first upscale'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {models.map((model) => {
          const isSelected = currentMode === model.id;
          const isFast = model.id === 'fast';

          return (
            <div
              key={model.id}
              onClick={() => !disabled && onSelectMode(model.id)}
              className={`relative flex flex-col justify-between rounded-xl border p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'border-teal-500 bg-teal-950/20 shadow-md shadow-teal-950/40 ring-1 ring-teal-500'
                  : 'border-slate-800 bg-slate-900/40 hover:border-slate-700 hover:bg-slate-900/70'
              } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2.5">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-lg ${
                      isFast
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                        : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                    }`}
                  >
                    {isFast ? <Zap className="h-5 w-5" /> : <Camera className="h-5 w-5" />}
                  </div>
                  <div>
                    <h4 className="font-semibold text-slate-100 text-sm">{model.name}</h4>
                    <span className="text-[11px] font-mono text-slate-400">{model.architecture}</span>
                  </div>
                </div>

                <span
                  className={`rounded-full px-2 py-0.5 text-[10px] font-medium border ${
                    isSelected
                      ? 'bg-teal-500/20 text-teal-300 border-teal-500/40'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}
                >
                  {model.badge}
                </span>
              </div>

              {/* Description */}
              <p className="mt-2.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {model.description}
              </p>

              {/* Best for tags */}
              <div className="mt-3 flex flex-wrap gap-1">
                {model.bestFor.slice(0, 3).map((tag, idx) => (
                  <span
                    key={idx}
                    className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Memory estimate footer */}
              <div className="mt-3 flex items-center justify-between border-t border-slate-800/60 pt-2 text-[11px] text-slate-400">
                <span>VRAM: ~{model.estimatedMemoryMB} MB</span>
                <span className="text-slate-400 font-mono">4× Scale</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
