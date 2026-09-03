import React from 'react';
import { Zap, Camera, Check, AlertCircle, Sparkles, BookOpen } from 'lucide-react';

export const ModelComparisonGuide: React.FC = () => {
  return (
    <section id="guide" className="w-full max-w-5xl mx-auto px-4 py-12 sm:px-6">
      <div className="border-t border-slate-800/80 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400 border border-teal-500/20">
            Comprehensive Guide
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Fast vs Photo Mode: Which Model to Choose?
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Compare our two cutting-edge open-source super-resolution architectures to pick the right tool for your image.
          </p>
        </div>

        {/* Comparison Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-300">
                <th className="p-4 font-semibold">Feature / Metric</th>
                <th className="p-4 font-semibold text-amber-400 flex items-center gap-1.5">
                  <Zap className="h-4 w-4" />
                  <span>Fast Mode (Real-ESRGAN)</span>
                </th>
                <th className="p-4 font-semibold text-indigo-400">
                  <span className="flex items-center gap-1.5">
                    <Camera className="h-4 w-4" />
                    <span>Photo Mode (Real-HAT-GAN)</span>
                  </span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              <tr>
                <td className="p-4 font-semibold text-slate-400">Core Architecture</td>
                <td className="p-4 font-mono text-xs">RealESR-general-x4v3 (SRVGGNet)</td>
                <td className="p-4 font-mono text-xs">Real_HAT_GAN_SRx4 (Hybrid Attention Transformer)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Primary Strength</td>
                <td className="p-4">Denoising compressed JPEGs & crisp edge recovery</td>
                <td className="p-4">Micro-texture synthesis (skin pores, fabrics, foliage)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">GPU Memory (VRAM)</td>
                <td className="p-4 text-emerald-400 font-semibold">Low (~350 MB)</td>
                <td className="p-4 text-amber-400 font-semibold">Medium to High (~950 MB)</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Processing Speed</td>
                <td className="p-4 text-emerald-400 font-semibold">2× to 3× Faster</td>
                <td className="p-4 text-slate-300">Thorough attention computation</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Tile Sizes</td>
                <td className="p-4 font-mono text-xs">128, 256, 512 px</td>
                <td className="p-4 font-mono text-xs">128, 256 px</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Recommended For</td>
                <td className="p-4">Social media photos, screenshots, anime, illustrations</td>
                <td className="p-4">DSLR photographs, portraits, architectural & nature shots</td>
              </tr>
              <tr>
                <td className="p-4 font-semibold text-slate-400">Model Weight Size</td>
                <td className="p-4 font-mono text-xs">~20 MB ONNX</td>
                <td className="p-4 font-mono text-xs">~65 MB ONNX</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Deep Dive into Limitations & Hallucinations */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span>Why Real-HAT-GAN Non-Sharper?</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              The official HAT repository provides both standard and <code className="text-slate-200">_sharper</code> models.
              Sharper models often introduce exaggerated white ringing artifacts (halos) around high-contrast edges.
              We selected the non-sharper variant as our default because it achieves superior pixel fidelity and natural,
              lifelike photographic tones.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 space-y-3">
            <h4 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400" />
              <span>Understanding AI "Hallucinated" Details</span>
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI super-resolution models reconstruct high-frequency details learned from millions of real-world training
              images. While this produces razor-sharp textures, tiny numbers or unrecognizable blurry text may be
              synthesized into plausible decorative strokes rather than original characters.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
