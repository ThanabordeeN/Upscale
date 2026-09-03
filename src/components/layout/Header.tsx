import React from 'react';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { WebGPUStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface HeaderProps {
  webgpuStatus: WebGPUStatus;
  onOpenPrivacyModal?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ webgpuStatus, onOpenPrivacyModal }) => {
  const { lang, setLang } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-paper-950/80 backdrop-blur-2xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] bg-white text-black shadow-sm">
            <Sparkles className="h-4 w-4" strokeWidth={2} />
          </div>
          <span className="truncate text-[15px] font-semibold tracking-tight text-paper-50">
            Upscaler
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <div className="inline-flex items-center rounded-full bg-paper-900 p-0.5 text-[11px] ring-1 ring-inset ring-white/10">
            <button
              type="button"
              onClick={() => setLang('th')}
              className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                lang === 'th' ? 'bg-paper-50 text-paper-950' : 'text-paper-400 hover:text-paper-100'
              }`}
            >
              TH
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`rounded-full px-2.5 py-1 font-medium transition-colors ${
                lang === 'en' ? 'bg-paper-50 text-paper-950' : 'text-paper-400 hover:text-paper-100'
              }`}
            >
              EN
            </button>
          </div>

          <div
            className="inline-flex h-8 items-center gap-1.5 rounded-full bg-paper-900 px-2.5 text-[11px] font-medium text-paper-300 ring-1 ring-inset ring-white/10"
            title={webgpuStatus.supported ? 'WebGPU active' : 'CPU (WASM) mode'}
          >
            <span className={`h-2 w-2 rounded-full ${webgpuStatus.supported ? 'bg-sage-500' : 'bg-paper-500'}`} />
            <span>{webgpuStatus.supported ? 'GPU' : 'CPU'}</span>
          </div>

          <button
            type="button"
            onClick={onOpenPrivacyModal}
            className="hidden h-8 w-8 items-center justify-center rounded-full text-paper-400 transition-colors hover:bg-paper-900 hover:text-paper-100 sm:flex"
            aria-label="Privacy"
            title="Privacy"
          >
            <ShieldCheck className="h-4 w-4" />
          </button>
        </div>
      </div>
    </header>
  );
};
