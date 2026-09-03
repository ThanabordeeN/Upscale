import React from 'react';
import { CheckCircle2, AlertCircle, HelpCircle, Terminal } from 'lucide-react';

export const WebGPUCompatibility: React.FC = () => {
  const browsers = [
    {
      name: 'Google Chrome',
      version: '113+ (Default)',
      status: 'Fully Supported',
      supported: true,
      notes: 'Out of the box on Windows, macOS, ChromeOS. Linux requires flag.',
    },
    {
      name: 'Microsoft Edge',
      version: '113+ (Default)',
      status: 'Fully Supported',
      supported: true,
      notes: 'Hardware accelerated D3D12 / Metal backend.',
    },
    {
      name: 'Brave Browser',
      version: '1.52+ (Default)',
      status: 'Fully Supported',
      supported: true,
      notes: 'Ensure Hardware Acceleration is toggled on in Settings.',
    },
    {
      name: 'Mozilla Firefox',
      version: 'Nightly / Beta',
      status: 'Flag Required',
      supported: false,
      notes: 'Set dom.webgpu.enabled to true in about:config.',
    },
    {
      name: 'Apple Safari',
      version: 'Safari 18+ (macOS/iOS)',
      status: 'Feature Flag',
      supported: false,
      notes: 'Supported in Developer Feature Flags via Metal backend.',
    },
  ];

  return (
    <section id="compatibility" className="w-full max-w-5xl mx-auto px-4 py-12 sm:px-6">
      <div className="border-t border-slate-800/80 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400 border border-teal-500/20">
            System Requirements
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            WebGPU Browser & Device Compatibility
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            WebGPU is the modern graphics and compute standard replacing WebGL. Check how your browser and operating
            system interact with our client-side AI engine.
          </p>
        </div>

        {/* Browser Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {browsers.map((b, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-100 text-sm">{b.name}</h3>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold border ${
                      b.supported
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                        : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
                <div className="text-xs font-mono text-slate-400 mb-2">{b.version}</div>
                <p className="text-xs text-slate-400 leading-relaxed">{b.notes}</p>
              </div>
            </div>
          ))}

          {/* Linux Quick Guide */}
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-5 flex flex-col justify-between sm:col-span-2 lg:col-span-1">
            <div>
              <div className="flex items-center space-x-2 text-teal-400 mb-2">
                <Terminal className="h-4 w-4" />
                <h4 className="font-bold text-slate-200 text-xs uppercase tracking-wider">Linux WebGPU Flag</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Chromium on Linux requires explicit Vulkan enabling:
              </p>
              <div className="mt-2 rounded bg-slate-900 p-2 font-mono text-[11px] text-teal-300 select-all">
                chrome://flags/#enable-unsafe-webgpu
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
