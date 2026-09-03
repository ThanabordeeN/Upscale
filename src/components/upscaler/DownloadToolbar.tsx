import React, { useState } from 'react';
import { Download, RefreshCw, Check, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { ExportFormat, ImageMetadata } from '../../types';
import { downloadCanvas } from '../../utils/canvasUtils';
import { formatBytes } from '../../utils/formatters';

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
    <div className="w-full rounded-2xl border border-slate-800 bg-slate-900/70 p-5 shadow-xl space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h4 className="font-semibold text-slate-100 text-sm sm:text-base flex items-center gap-2">
            <ImageIcon className="h-4 w-4 text-teal-400" />
            <span>Export 4× Super-Resolution Image</span>
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Output Dimensions: <span className="font-mono font-semibold text-slate-200">{originalImage.targetWidth} × {originalImage.targetHeight} px</span> (Original: {originalImage.width} × {originalImage.height} px)
          </p>
        </div>

        {/* Format Selector */}
        <div className="flex items-center space-x-1 rounded-xl border border-slate-800 bg-slate-950 p-1 text-xs">
          {(['png', 'webp', 'jpeg'] as ExportFormat[]).map((fmt) => (
            <button
              key={fmt}
              type="button"
              onClick={() => setFormat(fmt)}
              className={`rounded-lg px-3 py-1 font-semibold uppercase transition-colors ${
                format === fmt
                  ? 'bg-teal-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
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
            <span className="text-slate-400 flex items-center gap-1">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Quality:
            </span>
            <input
              type="range"
              min="0.75"
              max="1.0"
              step="0.02"
              value={quality}
              onChange={(e) => setQuality(parseFloat(e.target.value))}
              className="flex-1 accent-teal-500 h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <span className="font-mono text-teal-400 w-10 text-right">{Math.round(quality * 100)}%</span>
          </div>
        ) : (
          <div className="text-xs text-slate-400">
            <span>Lossless PNG format preserves every pixel and detail with full precision.</span>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={onReset}
            className="flex items-center space-x-1.5 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            <span>Upscale Another</span>
          </button>

          <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="flex items-center space-x-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 px-5 py-2.5 text-xs sm:text-sm font-bold text-slate-950 hover:from-teal-400 hover:to-emerald-300 transition-all shadow-lg shadow-teal-500/25 active:scale-95 disabled:opacity-50"
          >
            {downloadSuccess ? (
              <>
                <Check className="h-4 w-4 text-slate-950" />
                <span>Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4 text-slate-950" />
                <span>Download 4× ({format.toUpperCase()})</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
