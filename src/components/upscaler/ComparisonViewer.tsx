import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ZoomIn, ZoomOut, Maximize2, Split, Columns } from 'lucide-react';
import { ImageMetadata } from '../../types';

interface ComparisonViewerProps {
  originalImage: ImageMetadata;
  resultCanvas: HTMLCanvasElement;
}

export const ComparisonViewer: React.FC<ComparisonViewerProps> = ({
  originalImage,
  resultCanvas,
}) => {
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
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-2 text-xs">
        <div className="flex items-center space-x-1 sm:space-x-2">
          <span className="text-slate-400 font-medium mr-1">View Mode:</span>
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 font-medium transition-colors ${
              viewMode === 'split'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Split className="h-3.5 w-3.5" />
            <span>Split Slider</span>
          </button>
          <button
            onClick={() => setViewMode('side-by-side')}
            className={`flex items-center space-x-1.5 rounded-lg px-2.5 py-1 font-medium transition-colors ${
              viewMode === 'side-by-side'
                ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="h-3.5 w-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => handleZoomChange(-0.5)}
            disabled={zoomLevel <= 1}
            className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
            title="Zoom Out"
          >
            <ZoomOut className="h-3.5 w-3.5" />
          </button>
          <span className="font-mono text-slate-300 w-12 text-center">{Math.round(zoomLevel * 100)}%</span>
          <button
            onClick={() => handleZoomChange(0.5)}
            disabled={zoomLevel >= 4}
            className="rounded-lg border border-slate-700 bg-slate-800 p-1.5 text-slate-300 hover:bg-slate-700 disabled:opacity-40"
            title="Zoom In"
          >
            <ZoomIn className="h-3.5 w-3.5" />
          </button>
          <button
            onClick={() => {
              setZoomLevel(1);
              setPanOffset({ x: 0, y: 0 });
            }}
            className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-slate-300 hover:bg-slate-700 text-[11px]"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Image Display Area */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        className="relative min-h-[420px] max-h-[640px] w-full select-none overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 flex items-center justify-center cursor-crosshair"
      >
        {viewMode === 'split' ? (
          /* Split View Slider Mode */
          <div
            className="relative w-full h-full flex items-center justify-center overflow-hidden"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x / zoomLevel}px, ${
                panOffset.y / zoomLevel
              }px)`,
              transformOrigin: 'center center',
              transition: isPanning ? 'none' : 'transform 0.1s ease-out',
            }}
          >
            {/* Background: Upscaled (4×) Image */}
            <img
              src={resultDataUrl}
              alt="Upscaled result"
              className="max-h-[600px] w-auto max-w-full object-contain pointer-events-none"
              draggable={false}
            />

            {/* Foreground: Original (1×) Image clipped by slider position */}
            <div
              className="absolute inset-0 overflow-hidden pointer-events-none flex items-center justify-center"
              style={{ clipPath: `polygon(0 0, ${sliderPosition}% 0, ${sliderPosition}% 100%, 0 100%)` }}
            >
              <img
                src={originalImage.dataUrl}
                alt="Original"
                className="max-h-[600px] w-auto max-w-full object-contain"
                draggable={false}
              />
            </div>

            {/* Split Divider Handle */}
            <div
              className="absolute inset-y-0 w-0.5 bg-teal-400 shadow-[0_0_12px_rgba(45,212,191,0.8)] cursor-ew-resize pointer-events-auto"
              style={{ left: `${sliderPosition}%` }}
              onPointerDown={(e) => {
                e.stopPropagation();
                setIsDragging(true);
              }}
            >
              <div className="absolute top-1/2 -left-3.5 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full border-2 border-teal-400 bg-slate-900 text-teal-400 shadow-lg">
                <Split className="h-3.5 w-3.5 rotate-90" />
              </div>
            </div>

            {/* Floating Badges */}
            <div className="absolute top-3 left-3 rounded-lg bg-slate-950/80 px-2.5 py-1 text-xs font-semibold text-slate-300 backdrop-blur border border-slate-800">
              Original (1×) • {originalImage.width}×{originalImage.height}px
            </div>
            <div className="absolute top-3 right-3 rounded-lg bg-teal-950/80 px-2.5 py-1 text-xs font-semibold text-teal-300 backdrop-blur border border-teal-500/40">
              Upscaled (4×) • {originalImage.targetWidth}×{originalImage.targetHeight}px
            </div>
          </div>
        ) : (
          /* Side by Side Mode */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 w-full p-2">
            <div className="relative rounded-xl overflow-hidden border border-slate-800 bg-slate-900/50 flex flex-col items-center">
              <div className="w-full bg-slate-950/80 px-3 py-1.5 text-xs font-semibold text-slate-300 border-b border-slate-800 flex justify-between">
                <span>Original (1×)</span>
                <span className="font-mono text-slate-400">{originalImage.width}×{originalImage.height}px</span>
              </div>
              <img
                src={originalImage.dataUrl}
                alt="Original"
                className="max-h-[380px] w-auto object-contain p-2"
              />
            </div>
            <div className="relative rounded-xl overflow-hidden border border-teal-500/30 bg-slate-900/50 flex flex-col items-center">
              <div className="w-full bg-teal-950/60 px-3 py-1.5 text-xs font-semibold text-teal-300 border-b border-teal-500/30 flex justify-between">
                <span>Upscaled AI (4×)</span>
                <span className="font-mono text-teal-400">{originalImage.targetWidth}×{originalImage.targetHeight}px</span>
              </div>
              <img
                src={resultDataUrl}
                alt="Upscaled"
                className="max-h-[380px] w-auto object-contain p-2"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
