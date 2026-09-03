import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Split, Columns } from 'lucide-react';
import { ImageMetadata } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface ComparisonViewerProps {
  originalImage: ImageMetadata;
  resultCanvas: HTMLCanvasElement;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  originalImage,
  resultCanvas,
}) => {
  const { t, lang } = useLanguage();
  const [sliderPosition, setSliderPosition] = useState(50);
  const [isDragging, setIsDragging] = useState(false);
  const [viewMode, setViewMode] = useState<'split' | 'side-by-side'>('split');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [startPan, setStartPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const [resultDataUrl, setResultDataUrl] = useState<string>('');

  useEffect(() => {
    if (resultCanvas) {
      setResultDataUrl(resultCanvas.toDataURL('image/png'));
    }
  }, [resultCanvas]);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'IMG') {
      if (zoomLevel > 1) {
        setIsPanning(true);
        setStartPan({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
      }
    }
  };

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (isDragging && containerRef.current && viewMode === 'split') {
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
        const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
        setSliderPosition(percent);
      } else if (isPanning && zoomLevel > 1) {
        setPanOffset({
          x: e.clientX - startPan.x,
          y: e.clientY - startPan.y,
        });
      }
    },
    [isDragging, isPanning, zoomLevel, startPan, viewMode]
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    setIsPanning(false);
  }, []);

  useEffect(() => {
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  const handleZoomChange = (delta: number) => {
    setZoomLevel((prev) => {
      const next = Math.max(1, Math.min(4, prev + delta));
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  return (
    <div className="w-full space-y-4">
      {/* Viewer Controls Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-paper-800 bg-paper-900/60 px-4 py-2.5 text-xs">
        <div className="flex items-center space-x-1.5 sm:space-x-2">
          <span className="text-paper-400 font-medium mr-1 font-serif">
            {lang === 'th' ? 'มุมมอง:' : 'View:'}
          </span>
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1 font-medium transition-colors ${
              viewMode === 'split'
                ? 'bg-paper-850 text-paper-50 border border-terracotta-500/40 shadow-sm'
                : 'text-paper-400 hover:text-paper-200'
            }`}
          >
            <Split className="h-3.5 w-3.5 text-terracotta-400" />
            <span>{lang === 'th' ? 'สไลเดอร์เปรียบเทียบ' : 'Split Slider'}</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center space-x-1.5 rounded-lg px-3 py-1 font-medium transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-paper-850 text-paper-50 border border-terracotta-500/40 shadow-sm'
                : 'text-paper-400 hover:text-paper-200'
            }`}
          >
            <Columns className="h-3.5 w-3.5 text-terracotta-400" />
            <span>{lang === 'th' ? 'สองหน้าต่างคู่ขนาน' : 'Side-by-Side'}</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoomChange(-0.5)}
            disabled={zoomLevel <= 1}
            className="rounded-lg border border-paper-800 bg-paper-850 p-1.5 text-paper-300 hover:bg-paper-800 disabled:opacity-40"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-terracotta-400 w-12 text-center font-medium">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => handleZoomChange(0.5)}
            disabled={zoomLevel >= 4}
            className="rounded-lg border border-paper-800 bg-paper-850 p-1.5 text-paper-300 hover:bg-paper-800 disabled:opacity-40"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="rounded-lg border border-paper-800 bg-paper-850 px-2.5 py-1 text-paper-400 hover:text-paper-100 text-[11px]"
          >
            {lang === 'th' ? 'รีเซ็ต' : 'Reset'}
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      {viewMode === 'split' ? (
        <div
          ref={containerRef}
          onPointerDown={handlePointerDown}
          className="relative w-full overflow-hidden rounded-2xl border border-paper-800 bg-paper-950/80 shadow-2xl select-none aspect-video sm:aspect-[16/10] max-h-[600px] flex items-center justify-center cursor-grab active:cursor-grabbing"
        >
          {/* Enhanced Result Image (Background) */}
          {resultDataUrl && (
            <img
              src={resultDataUrl}
              alt="Enhanced Upscaled"
              className="absolute h-full w-full object-contain pointer-events-none transition-transform"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              }}
              draggable={false}
            />
          )}

          {/* Original Image (Clipped Foreground) */}
          <div
            className="absolute inset-0 overflow-hidden pointer-events-none"
            style={{
              clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)`,
            }}
          >
            <img
              src={originalImage.dataUrl}
              alt="Original"
              className="absolute h-full w-full object-contain pointer-events-none"
              style={{
                transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${panOffset.y / zoomLevel}px)`,
              }}
              draggable={false}
            />
          </div>

          {/* Divider Line & Handle */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-paper-100/80 cursor-ew-resize z-20 shadow-[0_0_10px_rgba(0,0,0,0.8)]"
            style={{ left: `${sliderPosition}%` }}
            onPointerDown={(e) => {
              e.stopPropagation();
              setIsDragging(true);
            }}
          >
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 flex h-8 w-8 items-center justify-center rounded-full border border-paper-700 bg-paper-900 shadow-xl cursor-ew-resize">
              <div className="flex space-x-0.5">
                <span className="h-3 w-0.5 bg-terracotta-400 rounded-full" />
                <span className="h-3 w-0.5 bg-terracotta-400 rounded-full" />
              </div>
            </div>
          </div>

          {/* Editorial Labels */}
          <div className="absolute bottom-4 left-4 z-10 rounded-full bg-paper-950/80 px-3 py-1 text-[11px] font-medium text-paper-300 border border-paper-800 backdrop-blur-md">
            {t.originalLabel} ({originalImage.width}×{originalImage.height})
          </div>
          <div className="absolute bottom-4 right-4 z-10 rounded-full bg-paper-950/80 px-3 py-1 text-[11px] font-medium text-terracotta-400 border border-paper-800 backdrop-blur-md font-mono">
            {t.upscaledLabel} ({resultCanvas.width}×{resultCanvas.height})
          </div>
        </div>
      ) : (
        /* Side-by-side mode */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative overflow-hidden rounded-2xl border border-paper-800 bg-paper-950/80 p-3 aspect-square flex flex-col items-center justify-center">
            <span className="absolute top-3 left-3 z-10 rounded-full bg-paper-900/80 px-3 py-1 text-[11px] font-medium text-paper-300 border border-paper-800">
              {t.originalLabel}
            </span>
            <img
              src={originalImage.dataUrl}
              alt="Original"
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-paper-800 bg-paper-950/80 p-3 aspect-square flex flex-col items-center justify-center">
            <span className="absolute top-3 left-3 z-10 rounded-full bg-paper-900/80 px-3 py-1 text-[11px] font-medium text-terracotta-400 border border-paper-800">
              {t.upscaledLabel}
            </span>
            {resultDataUrl && (
              <img
                src={resultDataUrl}
                alt="Enhanced Upscaled"
                className="max-h-full max-w-full object-contain"
              />
            )}
          </div>
        </div>
      )}

      <p className="text-center text-[11px] text-paper-400">
        {t.sliderInstruction}
      </p>
    </div>
  );
};
