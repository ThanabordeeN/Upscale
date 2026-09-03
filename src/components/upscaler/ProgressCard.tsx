import React from 'react';
import { Loader2, CheckCircle, AlertTriangle, Clock, Layers, ShieldAlert } from 'lucide-react';
import { UpscaleProgress } from '../../types';
import { formatDuration } from '../../utils/formatters';
import { useLanguage } from '../../context/LanguageContext';

interface ProgressCardProps {
  progress: UpscaleProgress;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  const { t, lang } = useLanguage();
  const isComplete = progress.stage === 'completed';
  const isError = progress.stage === 'error';

  return (
    <div className="w-full rounded-2xl border border-paper-800 bg-paper-900/80 p-6 shadow-xl space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3.5">
          {isComplete ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sage-500/15 text-sage-400 border border-sage-500/30">
              <CheckCircle className="h-5 w-5" />
            </div>
          ) : isError ? (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/15 text-red-400 border border-red-500/30">
              <AlertTriangle className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-850 text-terracotta-400 border border-paper-800">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2.5">
              <h4 className="font-serif font-medium text-paper-50 text-sm sm:text-base">
                {isComplete
                  ? t.upscaleComplete
                  : isError
                  ? t.processingHalted
                  : t.processingWebGPU}
              </h4>
              {progress.engineMode === 'webgpu-onnx' && (
                <span className="rounded-full bg-sage-500/15 text-sage-300 border border-sage-500/30 px-2.5 py-0.5 text-[10px] font-medium">
                  {t.realWebGPUActive}
                </span>
              )}
              {progress.engineMode === 'wasm-onnx' && (
                <span className="rounded-full bg-paper-800 text-paper-200 border border-paper-700 px-2.5 py-0.5 text-[10px] font-medium">
                  {t.realWasmActive}
                </span>
              )}
            </div>
            <p className="text-xs text-paper-400 font-sans mt-0.5">{progress.detail}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-2xl font-serif font-semibold text-terracotta-400">{progress.percent}%</span>
        </div>
      </div>

      {/* Editorial Progress Bar */}
      <div className="relative h-2 w-full overflow-hidden rounded-full bg-paper-950">
        <div
          className={`h-full transition-all duration-300 ${
            isComplete
              ? 'bg-sage-500'
              : isError
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-terracotta-500 to-terracotta-400'
          }`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      {/* Memory fallback notice */}
      {progress.oomFallbackTriggered && (
        <div className="flex items-center space-x-2 rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs text-amber-300">
          <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <span>
            {lang === 'th'
              ? `หน่วยความจำถึงขีดจำกัด: ปรับลดขนาดบล็อกลงเหลือ ${progress.tileSize}px อัตโนมัติ โดยยังใช้โมเดล ONNX จริง`
              : `Inference memory limit encountered: automatically resized tiles to ${progress.tileSize}px while keeping real ONNX inference.`}
          </span>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-2 border-t border-paper-800/80 pt-3 text-xs sm:grid-cols-3 text-paper-400">
        <div className="flex items-center space-x-2">
          <Layers className="h-3.5 w-3.5 text-paper-500" />
          <span>
            {lang === 'th' ? 'บล็อกที่:' : 'Tile:'}{' '}
            <strong className="text-paper-200 font-mono">
              {progress.totalTiles > 0 ? `${progress.currentTile} / ${progress.totalTiles}` : '—'}
            </strong>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-3.5 w-3.5 text-paper-500" />
          <span>
            {lang === 'th' ? 'เวลาที่ใช้:' : 'Elapsed:'}{' '}
            <strong className="text-paper-200 font-mono">{formatDuration(progress.elapsedMs)}</strong>
          </span>
        </div>
        {progress.estimatedRemainingMs !== null && !isComplete && !isError && (
          <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
            <Clock className="h-3.5 w-3.5 text-terracotta-400" />
            <span>
              {lang === 'th' ? 'ประมาณการ:' : 'ETA:'}{' '}
              <strong className="text-terracotta-400 font-mono">
                ~{formatDuration(progress.estimatedRemainingMs)}
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
