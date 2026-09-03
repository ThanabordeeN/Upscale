import React from 'react';
import { Sparkles, ShieldCheck, Cpu, HelpCircle, BookOpen } from 'lucide-react';
import { WebGPUStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  webgpuStatus: WebGPUStatus;
  onOpenPrivacyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ webgpuStatus, onOpenPrivacyModal }) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-800/80 bg-paper-950/95 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-3 py-2.5 sm:px-6 sm:py-3.5">
        <div className="flex items-center justify-between gap-2.5">
          {/* Compact mobile-first brand */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-paper-800 bg-paper-900 text-terracotta-400 shadow-sm sm:h-10 sm:w-10">
              <Sparkles className="h-4.5 w-4.5 sm:h-5 sm:w-5" />
            </div>

            <div className="min-w-0">
              <div className="font-serif font-semibold tracking-tight text-paper-50">
                <span className="text-sm sm:hidden">AI Upscaler</span>
                <span className="hidden text-lg sm:inline">{t.brandTitle}</span>
              </div>
              <p className="hidden text-xs text-paper-400 sm:block">
                {t.tagline} • Real-ESRGAN & Real-HAT-GAN
              </p>
            </div>

            <span className="hidden whitespace-nowrap rounded-full border border-paper-800 bg-paper-850 px-2.5 py-1 text-[11px] font-medium text-terracotta-400 md:inline-flex">
              {t.zeroUploadBadge}
            </span>
          </div>

          {/* Desktop navigation */}
          <nav className="hidden items-center space-x-5 text-xs font-medium text-paper-300 lg:flex">
            <a href="#how-it-works" className="flex items-center gap-1.5 transition-colors hover:text-terracotta-400">
              <Cpu className="h-3.5 w-3.5 text-paper-400" />
              {t.navHowItWorks}
            </a>
            <a href="#guide" className="flex items-center gap-1.5 transition-colors hover:text-terracotta-400">
              <BookOpen className="h-3.5 w-3.5 text-paper-400" />
              {t.navModels}
            </a>
            <a href="#faq" className="flex items-center gap-1.5 transition-colors hover:text-terracotta-400">
              <HelpCircle className="h-3.5 w-3.5 text-paper-400" />
              {t.navFaq}
            </a>
            <button
              type="button"
              onClick={onOpenPrivacyModal}
              className="flex items-center gap-1.5 text-sage-400 transition-colors hover:text-terracotta-400"
            >
              <ShieldCheck className="h-3.5 w-3.5 text-sage-400" />
              {t.navPrivacy}
            </button>
          </nav>

          {/* Mobile-safe controls: fixed-size, single-line, no wrapping */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2.5">
            <div className="inline-flex items-center rounded-full border border-paper-800 bg-paper-900 p-0.5 text-[11px] sm:text-xs">
              <button
                type="button"
                onClick={() => setLang('th')}
                className={`whitespace-nowrap rounded-full px-2 py-1 font-medium transition-all sm:px-2.5 ${
                  lang === 'th'
                    ? 'bg-paper-800 text-paper-50 shadow-sm'
                    : 'text-paper-400 hover:text-paper-200'
                }`}
              >
                TH
              </button>
              <button
                type="button"
                onClick={() => setLang('en')}
                className={`whitespace-nowrap rounded-full px-2 py-1 font-medium transition-all sm:px-2.5 ${
                  lang === 'en'
                    ? 'bg-paper-800 text-paper-50 shadow-sm'
                    : 'text-paper-400 hover:text-paper-200'
                }`}
              >
                EN
              </button>
            </div>

            <div
              className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2 py-1.5 text-[11px] font-medium sm:px-3 sm:text-xs ${
                webgpuStatus.supported
                  ? 'border-sage-500/30 bg-sage-600/10 text-sage-400'
                  : 'border-paper-800 bg-paper-900 text-paper-300'
              }`}
              title={webgpuStatus.supported ? 'WebGPU hardware acceleration active' : 'ONNX Runtime WASM CPU mode'}
            >
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  webgpuStatus.supported ? 'animate-pulse bg-sage-400' : 'bg-terracotta-400'
                }`}
              />
              <span className="sm:hidden">{webgpuStatus.supported ? 'GPU' : 'CPU'}</span>
              <span className="hidden sm:inline">
                {webgpuStatus.supported ? 'WebGPU Ready' : 'CPU (WASM)'}
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
