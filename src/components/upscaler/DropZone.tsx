import React, { useRef, useState } from 'react';
import { ImagePlus, FileWarning } from 'lucide-react';
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
      setErrorMessage(lang === 'th' ? 'เลือกไฟล์ PNG, JPEG หรือ WebP' : 'Choose a PNG, JPEG, or WebP image.');
      return;
    }
    if (file.size > APP_CONFIG.maxUploadSizeBytes) {
      setErrorMessage(lang === 'th' ? 'ไฟล์ต้องไม่เกิน 30 MB' : 'Image must be 30 MB or smaller.');
      return;
    }
    onImageSelected(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    if (isProcessing) return;
    if (e.dataTransfer.files?.[0]) validateAndProcess(e.dataTransfer.files[0]);
  };

  const loadSampleImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;
    const grad = ctx.createLinearGradient(0, 0, 400, 400);
    grad.addColorStop(0, '#111113');
    grad.addColorStop(0.5, '#2c2c2e');
    grad.addColorStop(1, '#2997ff');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 400);
    ctx.strokeStyle = 'rgba(255,255,255,0.25)';
    ctx.lineWidth = 1.5;
    for (let r = 24; r < 180; r += 18) {
      ctx.beginPath();
      ctx.arc(200, 200, r, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 22px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('4× AI Sample', 200, 205);
    canvas.toBlob((blob) => {
      if (blob) onImageSelected(new File([blob], 'sample.png', { type: 'image/png' }));
    });
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={(e) => e.target.files?.[0] && validateAndProcess(e.target.files[0])}
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={isProcessing}
      />

      <div
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          if (!isProcessing) setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onClick={() => !isProcessing && fileInputRef.current?.click()}
        className={`group flex min-h-[260px] cursor-pointer flex-col items-center justify-center rounded-[28px] border p-8 text-center transition-all sm:min-h-[320px] ${
          isDragOver
            ? 'border-terracotta-500 bg-terracotta-500/5'
            : 'border-white/10 bg-paper-900/45 hover:border-white/20 hover:bg-paper-900/70'
        } ${isProcessing ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-paper-50 text-paper-950 transition-transform group-hover:scale-[1.03]">
          <ImagePlus className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight text-paper-50">{t.dropzoneTitle}</h3>
        <p className="mt-2 text-xs text-paper-500">{t.dropzoneHint}</p>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            loadSampleImage();
          }}
          disabled={isProcessing}
          className="mt-5 text-xs font-medium text-terracotta-400 transition-colors hover:text-terracotta-300"
        >
          {lang === 'th' ? 'ลองภาพตัวอย่าง' : 'Try a sample'}
        </button>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center gap-2 rounded-xl bg-red-500/10 px-3 py-2.5 text-xs text-red-300 ring-1 ring-inset ring-red-500/20">
          <FileWarning className="h-4 w-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
