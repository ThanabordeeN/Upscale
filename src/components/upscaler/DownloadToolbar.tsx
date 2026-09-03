import React, { useState } from 'react';
import { Download, RefreshCw, Check, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { ExportFormat, ImageMetadata } from '../../types';
import { downloadCanvas } from '../../utils/canvasUtils';
import { useLanguage } from '../../context/LanguageContext';

interface DownloadToolbarProps {
  originalImage: ImageMetadata;
  resultCanvas: HTMLCanvasElement;
  onReset: () => void;
}

export const DownloadToolbar: React.FC<DownloadToolbarProps> = ({
  originalImage,
  resultCanvas,
  onReset,
}) => {
  const { t, lang } = useLanguage();
  const [format, setFormat] = useState<ExportFormat>('png');
  const [quality, setQuality] = useState<number>(0.92);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await downloadCanvas(resultCanvas, originalImage.name, format, quality);
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    } catch (err) {
      console.error('Download error:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="w-full rounded-2xl border border-paper-800 bg-paper-900/80 p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-paper-800/80 pb-4">
        <div>
          <h4 className="font-serif font-medium text-paper-50 text-sm sm:text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-terracotta-400" />
            <span>{t.downloadTitle}</span>
          </h4>
          <p className="text-xs text-paper-400 mt-0.5">
            {lang === 'th' ? 'ขนาดผลลัพธ์:' : 'Output Dimensions:'}{' '}
            <span className="font-mono font-semibold text-paper-200">
              {resultCanvas.width} × {resultCanvas.height} px
            </span>{' '}
            ({lang === 'th' ? 'จากเดิม' : 'Original'}: {originalImage.width} × {originalImage.height} px)
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center space-x-1 rounded-xl border border-paper-800 bg-paper-950 p-1 text-xs">
          {(['png', 'webp', 'jpeg'] as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={`rounded-lg px-3 py-1 font-mono uppercase text-xs transition-colors ${
                format === fmt
                  ? 'bg-terracotta-500 text-paper-50 font-semibold shadow-sm'
                  : 'text-paper-400 hover:text-paper-200'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Quality slider for lossy formats */}
        {format !== 'png' ? (
          <div className="flex items-center space-x-3 text-xs flex-1 max-w-sm">
            <span className="text-paper-400 flex items-center gap-1 font-serif">
              <SlidersHorizontal className="h-3.5 w-3.5 text-terracotta-400" />
              {lang === 'th' ? 'คุณภาพ:' : 'Quality:'}
            </span>
            <input
              type="range"
              min="0.75"
              max="1.0"
              step="0.02"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="flex-1 accent-[#cb7035] h-1.5 bg-paper-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-terracotta-400 w-10 text-right font-semibold">{Math.round(quality * 100)}%</span>
          </div>
        ) : (
          <div className="text-xs text-paper-400 font-sans">
            <span>{lang === 'th' ? 'ไฟล์ PNG รักษาทุกรายละเอียดและเม็ดพิกเซลแบบ Lossless 100%' : 'Lossless PNG preserves every pixel with full fidelity.'}</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1.5 rounded-xl border border-paper-800 bg-paper-850 px-4 py-2.5 text-xs font-medium text-paper-300 hover:bg-paper-800 hover:text-paper-100 transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5 text-paper-400" />
            <span>{t.upscaleAnother}</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center space-x-2 rounded-xl bg-terracotta-500 hover:bg-terracotta-600 px-5 py-2.5 text-xs sm:text-sm font-medium text-paper-50 transition-all shadow-lg shadow-terracotta-900/30 active:scale-95 disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-4 w-4" />
                <span>{lang === 'th' ? 'บันทึกเรียบร้อย!' : 'Downloaded!'}</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>{lang === 'th' ? `ดาวน์โหลด (${format.toUpperCase()})` : `Download (${format.toUpperCase()})`}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
