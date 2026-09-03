import React from 'react';
import { ShieldCheck, Lock, EyeOff, Terminal, CheckCircle2 } from 'lucide-react';

export const PrivacyGuarantee: React.FC = () => {
  return (
    <section id="privacy" className="w-full max-w-5xl mx-auto px-4 py-12 sm:px-6">
      <div className="border-t border-slate-800/80 pt-12">
        <div className="rounded-3xl border border-emerald-500/20 bg-gradient-to-b from-emerald-950/20 to-slate-950 p-6 sm:p-10 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center space-x-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                  Strict Privacy Architecture
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                  100% Client-Side Privacy Guarantee
                </h2>
              </div>
            </div>

            <div className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-medium text-emerald-300 self-start sm:self-center">
              Zero Server Image Storage
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-xs text-slate-300">
            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
                <Lock className="w-4 h-4" />
                <span>No Image Uploads</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Your photos are read strictly into local browser memory via HTML5 File and ImageBitmap APIs. They are never
                transmitted to our servers or third parties.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
                <EyeOff className="w-4 h-4" />
                <span>No Identity or Accounts</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                No login required, no cookies tracking your persona, no daily usage limits. We don't want your email address or personal credentials.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-2">
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Local Model Weights</span>
              </div>
              <p className="text-slate-400 leading-relaxed">
                Once ONNX neural network weights are downloaded to your browser's IndexedDB / Cache Storage, you can even upscale images completely offline without Wi-Fi!
              </p>
            </div>
          </div>

          {/* Network Verification Instructions */}
          <div id="verify-network" className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 sm:p-6">
            <h3 className="text-sm font-bold text-slate-200 mb-2 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-teal-400" />
              <span>How to Verify 0-Upload with Browser DevTools</span>
            </h3>
            <p className="text-xs text-slate-400 mb-4 leading-relaxed">
              Don't just take our word for it. You can independently verify that your image bytes never leave your device in 3 quick steps:
            </p>

            <ol className="list-decimal pl-5 space-y-2 text-xs text-slate-300">
              <li>
                Press <code className="bg-slate-950 px-1.5 py-0.5 rounded text-teal-300 font-mono">F12</code> or{' '}
                <code className="bg-slate-950 px-1.5 py-0.5 rounded text-teal-300 font-mono">Ctrl + Shift + I</code> (Cmd + Option + I on Mac) to open Developer Tools.
              </li>
              <li>
                Click on the <strong>Network</strong> tab and select the <strong>Fetch/XHR</strong> filter.
              </li>
              <li>
                Upload an image and hit <strong>Upscale 4×</strong>. You will observe that only ONNX model files are requested (and cached locally). No request ever uploads image payloads, filenames, or canvas data!
              </li>
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
};
