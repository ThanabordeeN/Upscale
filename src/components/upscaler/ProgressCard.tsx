import React from 'react';
import { Loader2, CheckCircle, AlertTriangle, Clock, Layers, ShieldAlert } from 'lucide-react';
import { UpscaleProgress } from '../../types';
import { formatDuration } from '../../utils/formatters';

interface ProgressCardProps {
  progress: UpscaleProgress;
}

export const ProgressCard: React.FC<ProgressCardProps> = ({ progress }) => {
  const isComplete = progress.stage === 'completed';
  const isError = progress.stage === 'error';

  return (
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-6 shadow-xl space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {isComplete ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          ) : isError ? (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/20 text-red-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-500/20 text-teal-400">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
          )}

          <div>
            <h4 className="font-semibold text-slate-100 text-sm sm:text-base">
              {isComplete
                ? 'Upscaling Complete (4× Super-Resolution)'
                : isError
                ? 'Processing Halted'
                : 'Processing on Local WebGPU...'}
            </h4>
            <p className="text-xs text-slate-400">{progress.detail}</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-xl font-bold font-mono text-teal-400">{progress.percent}%</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2.5 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className={`h-full transition-all duration-300 ${
            isComplete
              ? 'bg-emerald-500'
              : isError
              ? 'bg-red-500'
              : 'bg-gradient-to-r from-teal-500 via-emerald-400 to-teal-300'
          }`}
          style={{ width: `${progress.percent}%` }}
        />
      </div>

      {/* OOM fallback notice */}
      {progress.oomFallbackTriggered && (
        <div className="flex items-center space-x-2 rounded-lg border border-amber-500/30 bg-amber-950/30 p-2.5 text-xs text-amber-300">
          <ShieldAlert className="h-4 w-4 text-amber-400 flex-shrink-0" />
          <span>
            GPU memory buffer limit encountered: automatically resized tile down to {progress.tileSize}px to prevent
            browser crashes.
          </span>
        </div>
      )}

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-2 border-t border-slate-800/80 pt-3 text-xs sm:grid-cols-3 text-slate-400">
        <div className="flex items-center space-x-2">
          <Layers className="h-3.5 w-3.5 text-slate-500" />
          <span>
            Tile:{' '}
            <strong className="text-slate-200 font-mono">
              {progress.totalTiles > 0 ? `${progress.currentTile} / ${progress.totalTiles}` : '—'}
            </strong>
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-3.5 w-3.5 text-slate-500" />
          <span>
            Elapsed:{' '}
            <strong className="text-slate-200 font-mono">{formatDuration(progress.elapsedMs)}</strong>
          </span>
        </div>
        {progress.estimatedRemainingMs !== null && !isComplete && !isError && (
          <div className="flex items-center space-x-2 col-span-2 sm:col-span-1">
            <Clock className="h-3.5 w-3.5 text-teal-400" />
            <span>
              ETA:{' '}
              <strong className="text-teal-300 font-mono">
                ~{formatDuration(progress.estimatedRemainingMs)}
              </strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
