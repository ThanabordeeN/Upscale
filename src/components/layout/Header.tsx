import React from 'react';
import { Sparkles, ShieldCheck, Cpu, HelpCircle, BookOpen, Languages } from 'lucide-react';
import { WebGPUStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  webgpuStatus: WebGPUStatus;
  onOpenPrivacyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ webgpuStatus, onOpenPrivacyModal }) => {
  const { lang, setLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-paper-800/80 bg-paper-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6">
        {/* Brand with Editorial Serif Accents */}
        <div className="flex items-center space-x-3.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-paper-900 border border-paper-800 text-terracotta-400 shadow-sm">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-serif font-semibold tracking-tight text-paper-50 text-base sm:text-lg">
                {t.brandTitle}
              </span>
              <span className="rounded-full bg-paper-850 px-2 py-0.5 text-[11px] font-medium text-terracotta-400 border border-paper-800">
                {t.zeroUploadBadge}
              </span>
            </div>
            <p className="text-xs text-paper-400 font-sans hidden sm:block">
              {t.tagline} • Real-ESRGAN & Real-HAT-GAN
            </p>
          </div>
        </div>

        {/* Navigation & Controls */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <nav className="hidden lg:flex items-center space-x-5 text-xs font-medium text-paper-300">
            <a href="#how-it-works" className="hover:text-terracotta-400 transition-colors flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-paper-400" />
              {t.navHowItWorks}
            </a>
            <a href="#guide" className="hover:text-terracotta-400 transition-colors flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-paper-400" />
              {t.navModels}
            </a>
            <a href="#faq" className="hover:text-terracotta-400 transition-colors flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-paper-400" />
              {t.navFaq}
            </a>
            <button
              onClick={onOpenPrivacyModal}
              className="hover:text-terracotta-400 transition-colors flex items-center gap-1.5 text-sage-400"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sage-400" />
              {t.navPrivacy}
            </button>
          </nav>

          {/* Language Toggle (Soft Editorial Switcher) */}
          <div className="flex items-center rounded-full bg-paper-900 border border-paper-800 p-0.5 text-xs">
            <button
              type="button"
              onClick={() => setLang('th')}
              className={`rounded-full px-2.5 py-1 font-medium transition-all ${
                lang === 'th'
                  ? 'bg-paper-800 text-paper-50 shadow-sm'
                  : 'text-paper-400 hover:text-paper-200'
              }`}
            >
              ไทย
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded-full px-2.5 py-1 font-medium transition-all ${
                lang === 'en'
                  ? 'bg-paper-800 text-paper-50 shadow-sm'
                  : 'text-paper-400 hover:text-paper-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* WebGPU / CPU inference capability indicator */}
          <div
            className={`flex items-center space-x-1.5 rounded-full px-3 py-1 text-xs font-medium border ${
              webgpuStatus.supported
                ? 'bg-sage-600/10 border-sage-500/30 text-sage-400'
                : 'bg-paper-900 border-paper-800 text-paper-400'
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                webgpuStatus.supported ? 'bg-sage-400 animate-pulse' : 'bg-terracotta-400'
              }`}
            />
            <span className="hidden sm:inline">
              {webgpuStatus.supported ? 'WebGPU Active' : 'CPU (WASM) Mode'}
            </span>
            <span className="sm:hidden">
              {webgpuStatus.supported ? 'GPU Ready' : 'CPU'}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
};
