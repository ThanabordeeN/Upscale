import React from 'react';
import { X, ShieldCheck, FileText } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms';
}

export const TermsAndPrivacyModal: React.FC<ModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-3xl border border-slate-800 bg-slate-900 p-6 sm:p-8 shadow-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-2 text-slate-100 font-bold">
            {type === 'privacy' ? (
              <>
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>Privacy Policy (100% Client-Side)</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5 text-teal-400" />
                <span>Terms of Service</span>
              </>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {type === 'privacy' ? (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              <strong>Effective Date:</strong> {new Date().getFullYear()}
            </p>
            <p>
              WebGPU Free Image Upscaler is built from the ground up on a radical privacy principle:
              <strong> your images belong to you, and we do not want or touch your data.</strong>
            </p>
            <h4 className="font-semibold text-slate-100 text-sm">1. Zero File Uploads</h4>
            <p className="text-slate-400">
              When you select or drop an image into the application, it is parsed strictly in your browser’s volatile
              memory via the standard HTML5 File API and decoded with ImageBitmap. At no point is your image, thumbnail,
              filename, or EXIF metadata transmitted over any network socket or server endpoint.
            </p>
            <h4 className="font-semibold text-slate-100 text-sm">2. Local Model Caching</h4>
            <p className="text-slate-400">
              ONNX neural network weights are downloaded directly to your browser’s Cache Storage API and IndexedDB.
              This allows subsequent visits to operate without repeating network requests and enables offline operation.
            </p>
            <h4 className="font-semibold text-slate-100 text-sm">3. Anonymous Telemetry</h4>
            <p className="text-slate-400">
              To monitor stability and hardware compatibility, we may collect minimal anonymous telemetry including:
              execution provider (WebGPU/WASM), inference elapsed time in milliseconds, model mode, and success boolean.
              No IP addresses, cookies, or user identifiers are ever recorded.
            </p>
          </div>
        ) : (
          <div className="space-y-4 text-xs sm:text-sm text-slate-300 leading-relaxed">
            <p>
              <strong>Terms of Use:</strong>
            </p>
            <p className="text-slate-400">
              WebGPU Free Image Upscaler is provided free of charge, "as is", without warranty of any kind, either
              express or implied.
            </p>
            <h4 className="font-semibold text-slate-100 text-sm">1. Ownership of Upscaled Media</h4>
            <p className="text-slate-400">
              You retain 100% of all intellectual property rights and ownership of any images processed through this
              website. We assert no claims, licenses, or rights over your outputs.
            </p>
            <h4 className="font-semibold text-slate-100 text-sm">2. Permitted Use</h4>
            <p className="text-slate-400">
              You agree to use this software in compliance with all applicable local, national, and international laws.
              You agree not to use this service to process unlawful, defamatory, or infringing material.
            </p>
            <h4 className="font-semibold text-slate-100 text-sm">3. Limitation of Liability</h4>
            <p className="text-slate-400">
              Under no circumstances shall the maintainers or contributors be held liable for any direct, indirect,
              incidental, or consequential damages resulting from the use or inability to use this software.
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-slate-800 pt-4 text-right">
          <button
            onClick={onClose}
            className="rounded-xl bg-slate-800 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
