import React from 'react';
import { Cpu, Layers, ShieldCheck, Zap, DownloadCloud, Sparkles } from 'lucide-react';

export const HowItWorks: React.FC = () => {
  return (
    <section id="how-it-works" className="w-full max-w-5xl mx-auto px-4 py-12 sm:px-6">
      <div className="border-t border-slate-800/80 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400 border border-teal-500/20">
            Next-Generation Architecture
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            How Local WebGPU AI Upscaling Works
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Traditional AI services upload your private images to cloud GPU servers. Our engine executes deep neural
            networks directly in your web browser using WebGPU compute shaders.
          </p>
        </div>

        {/* Step-by-Step Architecture Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500/10 text-teal-400 mb-4 border border-teal-500/20">
                <Cpu className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">1. WebGPU Compute Shaders</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                WebGPU is the modern W3C standard that grants web browsers direct, low-overhead access to your physical
                GPU (NVIDIA, AMD, Intel, Apple Silicon). Tensor matrix multiplications run in parallel on your hardware
                instead of an expensive remote datacenter.
              </p>
            </div>
            <div className="mt-4 rounded-lg bg-slate-950/60 p-2.5 font-mono text-[11px] text-teal-300">
              navigator.gpu.requestAdapter()
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
                <Layers className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">2. Seamless Tiled Inference</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Large images can exceed GPU VRAM if processed all at once. Our pipeline divides the image into overlapping
                tiles (128px, 256px, or 512px) and blends overlapping regions with raised-cosine feathering to eliminate visible
                grid seams completely.
              </p>
            </div>
            <div className="mt-4 rounded-lg bg-slate-950/60 p-2.5 font-mono text-[11px] text-indigo-300">
              Raised Cosine 2D Blend Weight
            </div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 flex flex-col justify-between">
            <div>
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 mb-4 border border-emerald-500/20">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-100 mb-2">3. Zero-Upload Privacy</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Your images never leave your computer or phone. Once the lightweight ONNX model weights are cached in your
                browser's local storage, all upscaling calculations occur offline on your device with 0 KB uploaded.
              </p>
            </div>
            <div className="mt-4 rounded-lg bg-slate-950/60 p-2.5 font-mono text-[11px] text-emerald-300">
              0 Bytes Sent to Remote Servers
            </div>
          </div>
        </div>

        {/* Technical Deep Dive Diagram */}
        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950 p-6 sm:p-8">
          <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-teal-400" />
            <span>Execution Pipeline Walkthrough</span>
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <span className="font-bold text-teal-400 block mb-1">Step 1</span>
              <strong className="text-slate-200 block">Decode Bitmap</strong>
              <span className="text-slate-500 text-[11px]">Hardware ImageBitmap decoding</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <span className="font-bold text-teal-400 block mb-1">Step 2</span>
              <strong className="text-slate-200 block">Tile Partition</strong>
              <span className="text-slate-500 text-[11px]">Adaptive 128 / 256 / 512px tiles</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <span className="font-bold text-teal-400 block mb-1">Step 3</span>
              <strong className="text-slate-200 block">WebGPU JSEP</strong>
              <span className="text-slate-500 text-[11px]">ONNX Runtime Web execution</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <span className="font-bold text-teal-400 block mb-1">Step 4</span>
              <strong className="text-slate-200 block">Cosine Blending</strong>
              <span className="text-slate-500 text-[11px]">Seamless edge recombination</span>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3">
              <span className="font-bold text-teal-400 block mb-1">Step 5</span>
              <strong className="text-slate-200 block">Local Export</strong>
              <span className="text-slate-500 text-[11px]">PNG, WebP, or JPEG download</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
