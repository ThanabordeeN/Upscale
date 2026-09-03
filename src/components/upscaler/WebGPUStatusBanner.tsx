import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, Cpu, Info, RefreshCw } from 'lucide-react';
import { WebGPUStatus } from '../../types';

interface WebGPUStatusBannerProps {
  status: WebGPUStatus;
  onRefresh?: () => void;
}

export const WebGPUStatusBanner: React.FC<WebGPUStatusBannerProps> = ({ status, onRefresh }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (status.isTesting) {
    return (
      <div className="mb-6 flex items-center justify-center space-x-2 rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-sm text-slate-400">
        <RefreshCw className="h-4 w-4 animate-spin text-teal-400" />
        <span>Probing WebGPU hardware capabilities...</span>
      </div>
    );
  }

  if (status.supported) {
    return (
      <div className="mb-6 rounded-xl border border-emerald-500/20 bg-emerald-950/20 p-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-emerald-300 text-sm">WebGPU Hardware Acceleration Active</span>
                <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-[11px] font-mono text-emerald-400">
                  {status.adapterName || 'Direct GPU'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                AI inference runs directly on your GPU using WebGPU compute shaders. Zero server upload.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-xs text-emerald-400/80 hover:text-emerald-300 self-start sm:self-center"
          >
            <span>{isExpanded ? 'Hide Specs' : 'View Specs'}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-4 grid grid-cols-2 gap-3 border-t border-emerald-500/20 pt-3 text-xs sm:grid-cols-4">
            <div>
              <span className="text-slate-500 block">Adapter:</span>
              <span className="font-mono text-slate-200">{status.adapterName || 'Generic'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Vendor:</span>
              <span className="font-mono text-slate-200">{status.vendor || 'Detected'}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Max 2D Texture:</span>
              <span className="font-mono text-slate-200">
                {status.maxTextureDimension2D ? `${status.maxTextureDimension2D.toLocaleString()}px` : 'Standard'}
              </span>
            </div>
            <div>
              <span className="text-slate-500 block">Max Buffer:</span>
              <span className="font-mono text-slate-200">
                {status.maxBufferSizeMB ? `${status.maxBufferSizeMB} MB` : 'Standard'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-950/25 p-4 text-amber-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3">
          <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-300">
              WebGPU Hardware Acceleration Unavailable
            </h4>
            <p className="mt-0.5 text-xs text-slate-300 leading-relaxed max-w-2xl">
              Your current browser does not have WebGPU enabled. High-fidelity client edge filtering and CPU fallback
              will be used. For maximum performance and real neural network acceleration, please use Chrome 113+ or Edge 113+.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Re-check
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-300 hover:bg-amber-500/20 transition-colors flex items-center gap-1"
          >
            <Info className="w-3.5 h-3.5" />
            {isExpanded ? 'Hide Help' : 'How to Enable'}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 border-t border-amber-500/20 pt-3 text-xs text-slate-300 space-y-2">
          <p className="font-semibold text-amber-300">How to enable WebGPU:</p>
          <ul className="list-disc pl-5 space-y-1 text-slate-300">
            <li>
              <strong>Google Chrome / Microsoft Edge (113+):</strong> WebGPU is enabled by default on Windows, macOS, and ChromeOS. On Linux, navigate to{' '}
              <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 font-mono">chrome://flags/#enable-unsafe-webgpu</code> and toggle to Enabled.
            </li>
            <li>
              <strong>Firefox Nightly:</strong> Open{' '}
              <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 font-mono">about:config</code> and set{' '}
              <code className="bg-slate-900 px-1 py-0.5 rounded text-amber-400 font-mono">dom.webgpu.enabled</code> to true.
            </li>
            <li>
              <strong>Apple Safari (macOS 14+ / iOS 17+):</strong> Enable via Settings &gt; Advanced &gt; Feature Flags &gt; WebGPU.
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};
