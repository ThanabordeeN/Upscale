import React from 'react';
import { ShieldCheck, Sparkles, Heart } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

interface FooterProps {
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyModal, onOpenTermsModal }) => {
  const { t, lang } = useLanguage();

  return (
    <footer className="border-t border-paper-800 bg-paper-950 py-12 text-paper-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Mission */}
          <div className="space-y-3.5 md:col-span-2">
            <div className="flex items-center space-x-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-paper-900 border border-paper-800 text-terracotta-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-serif font-medium text-paper-50 text-base">{t.brandTitle}</span>
            </div>
            <p className="text-xs sm:text-sm text-paper-400 max-w-md leading-relaxed">
              {t.footerDesc}
            </p>
            <div className="flex items-center space-x-2 text-xs text-sage-400 pt-1">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {lang === 'th'
                  ? 'ไม่ใช้ GPU เซิร์ฟเวอร์ • ไม่มีอัปโหลด • ไม่จำกัดโควตา'
                  : 'Zero server GPU • Zero user uploads • Zero quota limits'}
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-serif uppercase tracking-wider text-paper-200">{t.footerTech}</h4>
            <ul className="mt-3 space-y-2 text-xs text-paper-400">
              <li>
                <a href="#how-it-works" className="hover:text-terracotta-400 transition-colors">
                  {lang === 'th' ? 'การทำงานของ WebGPU' : 'How WebGPU Works'}
                </a>
              </li>
              <li>
                <a href="#guide" className="hover:text-terracotta-400 transition-colors">
                  {lang === 'th' ? 'เปรียบเทียบ Real-ESRGAN & Real-HAT-GAN' : 'Real-ESRGAN vs Real-HAT-GAN'}
                </a>
              </li>
              <li>
                <a href="#compatibility" className="hover:text-terracotta-400 transition-colors">
                  {lang === 'th' ? 'เบราว์เซอร์ที่รองรับ' : 'Browser Compatibility'}
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-terracotta-400 transition-colors">
                  {t.navFaq}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 className="text-xs font-serif uppercase tracking-wider text-paper-200">{t.footerLegal}</h4>
            <ul className="mt-3 space-y-2 text-xs text-paper-400">
              <li>
                <button
                  onClick={onOpenPrivacyModal}
                  className="hover:text-terracotta-400 transition-colors text-left"
                >
                  {t.privacyPolicy}
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTermsModal}
                  className="hover:text-terracotta-400 transition-colors text-left"
                >
                  {t.termsOfService}
                </button>
              </li>
              <li>
                <a href="#verify-network" className="hover:text-terracotta-400 transition-colors">
                  {t.verifyDevTools}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-paper-850 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-paper-500">
          <p>© {new Date().getFullYear()} {t.brandTitle}. {t.allRightsReserved}</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1.5">
            Crafted with <Heart className="w-3 h-3 text-terracotta-400 inline fill-terracotta-400" /> for privacy & local AI
          </p>
        </div>
      </div>
    </footer>
  );
};
