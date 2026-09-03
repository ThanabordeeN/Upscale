import React, { useRef, useState } from 'react';
import { UploadCloud, Image as ImageIcon, Sparkles, FileWarning } from 'lucide-react';
import { APP_CONFIG } from '../../config/appConfig';

interface DropZoneProps {
  onImageSelected: (file: File) => void;
  isProcessing: boolean;
}

export const DropZone: React.FC<DropZoneProps> = ({ onImageSelected, isProcessing }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateAndProcess = (file: File) => {
    setErrorMessage(null);
    if (!file.type.startsWith('image/')) {
      setErrorMessage('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > APP_CONFIG.maxUploadSizeBytes) {
      setErrorMessage(`Image size exceeds 30 MB limit. Please select a smaller file.`);
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

  // Load a high-texture sample graphic to let users test instantly
  const loadSampleImage = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d')!;

    // Draw rich sample image with natural gradients, circles, fine textures
    const grad = ctx.createLinearGradient(0, 0, 400, 400);
    grad.addColorStop(0, '#0f172a');
    grad.addColorStop(0.5, '#0d9488');
    grad.addColorStop(1, '#f59e0b');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 400, 400);

    // Add fine details
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let r = 20; r < 180; r += 15) {
      ctx.beginPath();
      ctx.arc(200, 200, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Inter, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('WebGPU 4× Sample', 200, 190);
    ctx.font = '14px Inter, sans-serif';
    ctx.fillStyle = '#e2e8f0';
    ctx.fillText('Natural Detail & Edge Test', 200, 220);

    canvas.toBlob((blob) => {
      if (blob) {
        const sampleFile = new File([blob], 'sample_test_texture.png', { type: 'image/png' });
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
        className={`relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-10 text-center transition-all cursor-pointer ${
          isDragOver
            ? 'border-teal-400 bg-teal-950/30 scale-[1.01]'
            : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50'
        } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-teal-500/10 text-teal-400 mb-4 border border-teal-500/20 shadow-inner">
          <UploadCloud className="h-8 w-8" />
        </div>

        <h3 className="text-base sm:text-lg font-semibold text-slate-100">
          Drop your image here, or <span className="text-teal-400 hover:underline">browse files</span>
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-md">
          Supports PNG, JPEG, and WebP up to 30 MB. Your image is processed 100% locally on your GPU and never uploaded.
        </p>

        {/* Instant test sample button */}
        <div className="mt-6 flex items-center space-x-3" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={loadSampleImage}
            disabled={isProcessing}
            className="flex items-center space-x-1.5 rounded-lg border border-slate-700 bg-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Try with Sample Image</span>
          </button>
        </div>
      </div>

      {errorMessage && (
        <div className="mt-3 flex items-center space-x-2 rounded-lg border border-red-500/30 bg-red-950/30 p-2.5 text-xs text-red-300">
          <FileWarning className="w-4 h-4 text-red-400 flex-shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}
    </div>
  );
};
