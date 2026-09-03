import React, { useRef, useState } from 'react';
import { UploadCloud, Sparkles, FileWarning, ShieldCheck } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';
import { useLanguage } from '../../context/LanguageContext';

interface DropZoneProps {
  onImageSelected: (file: File) => void;
  isProcessing: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onImageSelected, isProcessing }) => {
  const { t, lang } = useLanguage();
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage(lang === 'th' ? 'กรุณาเลือกไฟล์ภาพที่ถูกต้อง (PNG, JPEG, WebP)' : 'Please select a valid image file (PNG, JPEG, WebP).');
      return;
    }
    if (file.size > APP_CONFIG.maxUploadSizeBytes) {
      setErrorMessage(lang === 'th' ? 'ขนาดไฟล์เกินขีดจำกัด 30 MB' : 'Image size exceeds 30 MB limit.');
      return;
    }
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndProcess(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (!isProcessing) setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  // Instant test sample
  const loadSampleImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    const grad = ctx.createLinearGradient(0, 0, 400, 400);
    grad.addColorStop(0, '#1c1a17');
    grad.addColorStop(0.5, '#4a3b2c');
    grad.addColorStop(1, '#cb7035');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 400);

    ctx.strokeStyle = 'rgba(250, 248, 245, 0.4)';
    ctx.lineWidth = 1.5;
    for (let r = 20; r < 180; r += 16) {
      ctx.beginPath();
      ctx.arc(200, 200, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#faf8f5';
    ctx.font = 'bold 22px "Noto Serif Thai", Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText('ภาพทดสอบ 4× AI', 200, 190);
    ctx.font = '13px Prompt, sans-serif';
    ctx.fillStyle = '#d5c9b6';
    ctx.fillText('Natural Detail & Texture Test', 200, 220);

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File([blob], 'sample_photograph.png', { type: 'image/png' });
        onImageSelected(sampleFile);
      }
    });
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            validateAndProcess(e.target.files[0]);
          }
        }}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={isProcessing}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`relative flex flex-col items-center justify-center rounded-3xl border border-dashed p-10 sm:p-14 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-terracotta-400 bg-paper-900/90 scale-[1.005]'
            : 'border-paper-800 bg-paper-900/30 hover:border-paper-700 hover:bg-paper-900/50'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-paper-850 text-terracotta-400 mb-5 border border-paper-800 shadow-sm">
          <UploadCloud className="h-7 w-7" />
        </div>

        <h3 className="text-base sm:text-xl font-serif font-medium text-paper-50 tracking-tight">
          {t.dropzoneTitle}
        </h3>
        <p className="mt-2 text-xs sm:text-sm text-paper-400 max-w-lg leading-relaxed">
          {t.dropzoneHint}
        </p>

        {/* Client-Only Security Badge */}
        <div className="mt-4 flex items-center space-x-1.5 rounded-full bg-paper-850 px-3 py-1 text-[11px] text-sage-400 border border-paper-800">
          <ShieldCheck className="w-3.5 h-3.5 text-sage-400" />
          <span>{t.dropzonePrivacyBadge}</span>
        </div>

        {/* Instant test sample */}
        <div className="mt-6 flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={loadSampleImage}
            disabled={isProcessing}
            className="flex items-center space-x-1.5 rounded-full border border-paper-800 bg-paper-850/80 px-4 py-1.5 text-xs font-medium text-paper-300 hover:bg-paper-800 hover:text-paper-100 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-terracotta-400" />
            <span>{lang === 'th' ? 'ทดลองด้วยภาพตัวอย่าง' : 'Try with Sample Image'}</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center space-x-2 rounded-xl border border-red-500/30 bg-red-950/20 p-3 text-xs text-red-300">
          <FileWarning className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
