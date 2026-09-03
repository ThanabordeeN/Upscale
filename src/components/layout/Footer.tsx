import React from 'react';
import { ShieldCheck, Cpu, Heart } from 'lucide-react';

interface FooterProps {
  onOpenPrivacyModal?: () => void;
  onOpenTermsModal?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacyModal, onOpenTermsModal }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-12 text-slate-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand & Mission */}
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center space-x-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal-600 text-white">
                <Cpu className="h-4 w-4" />
              </div>
              <span className="font-bold text-white tracking-tight">WebGPU Free Image Upscaler</span>
            </div>
            <p className="text-sm text-slate-400 max-w-md">
              A 100% free, browser-native 4× image super-resolution application. Powered by WebGPU and
              ONNX Runtime Web. Your photos never leave your device.
            </p>
            <div className="flex items-center space-x-2 text-xs text-emerald-400 pt-1">
              <ShieldCheck className="h-4 w-4" />
              <span>Zero server GPU • Zero user uploads • Zero quota limits</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Technology</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <a href="#how-it-works" className="hover:text-teal-400 transition-colors">
                  How WebGPU Works
                </a>
              </li>
              <li>
                <a href="#guide" className="hover:text-teal-400 transition-colors">
                  Real-ESRGAN vs Real-HAT-GAN
                </a>
              </li>
              <li>
                <a href="#compatibility" className="hover:text-teal-400 transition-colors">
                  Browser Compatibility
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-teal-400 transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
            </ul>
          </div>

          {/* Legal & Privacy */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">Privacy & Terms</h4>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <button
                  onClick={onOpenPrivacyModal}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Privacy Policy (Client-Only)
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenTermsModal}
                  className="hover:text-teal-400 transition-colors text-left"
                >
                  Terms of Service
                </button>
              </li>
              <li>
                <a href="#verify-network" className="hover:text-teal-400 transition-colors">
                  Verify 0-Upload with DevTools
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>© {new Date().getFullYear()} WebGPU Free Image Upscaler. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-red-500 inline fill-red-500" /> for privacy & local AI
          </p>
        </div>
      </div>
    </footer>
  );
};
