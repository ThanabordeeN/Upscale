import React from 'react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyModal, onOpenTermsModal }) => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-white/10 bg-paper-950 py-7 text-paper-500">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 text-[11px] sm:flex-row sm:px-6">
        <p>© {new Date().getFullYear()} Upscaler</p>
        <div className="flex items-center gap-4">
          <button onClick={onOpenPrivacyModal} className="transition-colors hover:text-paper-200">
            {t.privacyPolicy}
          </button>
          <button onClick={onOpenTermsModal} className="transition-colors hover:text-paper-200">
            {t.termsOfService}
          </button>
        </div>
      </div>
    </footer>
  );
};
