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

      {status.errorMessage && (
        <div className="mt-2 text-[11px] font-mono text-amber-300/90 bg-amber-950/40 rounded px-2.5 py-1 border border-amber-500/20">
          Reason: {status.errorMessage}
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 border-t border-amber-500/20 pt-3 text-xs text-slate-300 space-y-3">
          <p className="font-semibold text-amber-300">How to enable WebGPU on your system:</p>

          <div className="rounded-lg bg-slate-900/90 p-3 border border-slate-800 space-y-2">
            <span className="font-bold text-teal-400 block text-xs uppercase tracking-wide">
              🐧 Linux (Chrome / Chromium / Brave / Edge):
            </span>
            <p className="text-slate-400 text-xs">
              WebGPU is disabled by default on Linux due to driver variation. You can enable it in 30 seconds:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-slate-300 text-xs">
              <li>
                Type in your address bar: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-mono select-all">chrome://flags/#enable-unsafe-webgpu</code> and set it to <strong>Enabled</strong>.
              </li>
              <li>
                Type: <code className="bg-slate-950 px-1.5 py-0.5 rounded text-amber-400 font-mono select-all">chrome://flags/#enable-vulkan</code> and set it to <strong>Enabled</strong>.
              </li>
              <li>
                Click the blue <strong>Relaunch</strong> button at the bottom of the page.
              </li>
              <li>
                Check that <strong>Settings &gt; System &gt; "Use graphics acceleration when available"</strong> is toggled ON.
              </li>
            </ol>
            <p className="text-slate-400 text-[11px] pt-1">
              Alternative: Launch Chrome from terminal with:
              <br />
              <code className="bg-slate-950 px-2 py-1 rounded text-teal-300 font-mono block mt-1 select-all">
                google-chrome --enable-features=Vulkan --enable-unsafe-webgpu
              </code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="rounded-lg bg-slate-900/50 p-2.5 border border-slate-800">
              <strong className="text-slate-200 block mb-1">Windows & macOS:</strong>
              <p className="text-slate-400">
                Enabled by default in Chrome 113+ / Edge 113+. If unavailable, check <code className="text-amber-400">chrome://gpu</code> to verify hardware acceleration is active.
              </p>
            </div>
            <div className="rounded-lg bg-slate-900/50 p-2.5 border border-slate-800">
              <strong className="text-slate-200 block mb-1">Firefox Nightly:</strong>
              <p className="text-slate-400">
                Navigate to <code className="text-amber-400">about:config</code> and toggle <code className="text-amber-400">dom.webgpu.enabled</code> to <code className="text-teal-300">true</code>.
              </p>
            </div>
          </div>

          <div className="rounded-lg bg-teal-950/30 p-2.5 border border-teal-500/20 text-teal-300 text-xs flex items-center justify-between">
            <span>After changing flags or settings, click <strong>Re-check</strong> above.</span>
            <button
              onClick={onRefresh}
              className="rounded bg-teal-500/20 px-2.5 py-1 text-[11px] font-bold text-teal-200 hover:bg-teal-500/30 transition-colors"
            >
              Re-check Now
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
