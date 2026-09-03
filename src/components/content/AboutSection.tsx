import React from 'react';
import { Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="w-full max-w-5xl mx-auto px-4 py-12 sm:px-6">
      <div className="border-t border-slate-800/80 pt-12">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">
          <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
            <Award className="w-5 h-5 text-teal-400" />
            <span>Open Source AI Research Credits</span>
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed mb-6">
            This project is made possible thanks to breakthrough open-source research and engineering from leading AI
            laboratories and the web standards community:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <strong className="text-slate-200 block mb-1">Real-ESRGAN</strong>
              <p className="text-slate-400 mb-2">
                Tencent ARC Lab & University of Chinese Academy of Sciences (Xintao Wang et al.)
              </p>
              <span className="text-slate-500 font-mono text-[10px]">BSD-3-Clause License</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <strong className="text-slate-200 block mb-1">Real-HAT-GAN</strong>
              <p className="text-slate-400 mb-2">
                Hybrid Attention Transformer for Super-Resolution (Xiangyu Chen, Xintao Wang, et al.)
              </p>
              <span className="text-slate-500 font-mono text-[10px]">Apache 2.0 License</span>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/60 p-4">
              <strong className="text-slate-200 block mb-1">ONNX Runtime Web</strong>
              <p className="text-slate-400 mb-2">
                Microsoft ONNX Runtime team for pioneering WebGPU JSEP operator kernels in JavaScript.
              </p>
              <span className="text-slate-500 font-mono text-[10px]">MIT License</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
