import React from 'react';
import { Zap, ShieldCheck, Cpu, HelpCircle, BookOpen } from 'lucide-react';
import { WebGPUStatus } from '../../types';

interface HeaderProps {
  webgpuStatus: WebGPUStatus;
  onOpenPrivacyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ webgpuStatus, onOpenPrivacyModal }) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-400 text-white shadow-lg shadow-teal-500/20">
            <Zap className="h-5 w-5 fill-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold tracking-tight text-white sm:text-lg">WebGPU Free Upscaler</span>
              <span className="rounded bg-teal-500/10 px-1.5 py-0.5 text-xs font-semibold text-teal-400 border border-teal-500/20">
                100% Client-Side
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">4× AI Super-Resolution • Real-ESRGAN & Real-HAT-GAN</p>
          </div>
        </div>

        {/* Navigation & Status */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          <nav className="hidden md:flex items-center space-x-5 text-sm font-medium text-slate-300">
            <a href="#how-it-works" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-teal-400" />
              How It Works
            </a>
            <a href="#guide" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-teal-400" />
              Model Guide
            </a>
            <a href="#compatibility" className="hover:text-teal-400 transition-colors">
              Compatibility
            </a>
            <a href="#faq" className="hover:text-teal-400 transition-colors flex items-center gap-1.5">
              <HelpCircle className="w-4 h-4 text-slate-400" />
              FAQ
            </a>
            <button
              onClick={onOpenPrivacyModal}
              className="hover:text-teal-400 transition-colors flex items-center gap-1.5 text-emerald-400"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Zero Uploads
            </button>
          </nav>

          {/* WebGPU Status Pill */}
          <div
            className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
              webgpuStatus.supported
                ? 'bg-emerald-950/50 border-emerald-500/30 text-emerald-300'
                : 'bg-amber-950/50 border-amber-500/30 text-amber-300'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                webgpuStatus.supported ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
              }`}
            />
            <span className="hidden sm:inline">
              {webgpuStatus.supported ? 'WebGPU Active' : 'WebGPU Unavailable'}
            </span>
            <span className="sm:hidden">
              {webgpuStatus.supported ? 'GPU Ready' : 'Fallback'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
