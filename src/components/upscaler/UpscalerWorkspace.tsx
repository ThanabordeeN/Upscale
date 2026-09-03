import React from 'react';
import { Sparkles, ArrowRight, ShieldCheck, X, FileImage } from 'lucide-react';
import { WebGPUStatus } from '../../types';
import { useModelManager } from '../../hooks/useModelManager';
import { useUpscaler } from '../../hooks/useUpscaler';
import { WebGPUStatusBanner } from './WebGPUStatusBanner';
import { DropZone } from './DropZone';
import { ModelSelector } from './ModelSelector';
import { BasicParameters } from './BasicParameters';
import { ProgressCard } from './ProgressCard';
import { ComparisonViewer } from './ComparisonViewer';
import { DownloadToolbar } from './DownloadToolbar';
import { formatBytes, formatDimensions, calculateMegapixels } from '../../utils/formatters';

interface UpscalerWorkspaceProps {
  webgpuStatus: WebGPUStatus;
  onRefreshWebGPU?: () => void;
}

export const UpscalerWorkspace: React.FC<UpscalerWorkspaceProps> = ({
  webgpuStatus,
  onRefreshWebGPU,
}) => {
  const {
    currentMode,
    currentModel,
    isCached,
    isCheckingCache,
    selectMode,
  } = useModelManager('fast');

  const {
    imageMetadata,
    sourceCanvas,
    resultCanvas,
    progress,
    error,
    isProcessing,
    tileSize,
    autoTileSize,
    overlap,
    scale,
    sharpness,
    denoise,
    setTileSize,
    setAutoTileSize,
    setOverlap,
    setScale,
    setSharpness,
    setDenoise,
    handleImageSelected,
    runUpscale,
    reset,
  } = useUpscaler();

  const handleStartUpscale = () => {
    runUpscale(currentModel);
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6">
      {/* Hardware Status Banner */}
      <WebGPUStatusBanner status={webgpuStatus} onRefresh={onRefreshWebGPU} />

      {/* Main Card Container */}
      <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8 backdrop-blur-xl shadow-2xl space-y-6">
        {/* Step 1: Image Selection */}
        {!imageMetadata ? (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-8">
              <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                100% Free AI Image Upscaler
              </h1>
              <p className="mt-2 text-sm sm:text-base text-slate-400">
                Enhance, denoise, and upscale your images 4× directly inside your browser using your GPU.
                No file uploads, no credits, no waitlists.
              </p>
            </div>
            <DropZone onImageSelected={handleImageSelected} isProcessing={isProcessing} />
          </div>
        ) : (
          /* Step 2 & 3: Model Configuration & Processing */
          <div className="space-y-6">
            {/* Selected Image Metadata Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 text-xs gap-3">
              <div className="flex items-center space-x-3 overflow-hidden">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
                  <FileImage className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-semibold text-slate-200 block truncate">{imageMetadata.name}</span>
                  <div className="flex items-center space-x-2 text-slate-400 font-mono mt-0.5">
                    <span>{formatDimensions(imageMetadata.width, imageMetadata.height)}</span>
                    <span>•</span>
                    <span>{calculateMegapixels(imageMetadata.width, imageMetadata.height)}</span>
                    <span>•</span>
                    <span>{formatBytes(imageMetadata.sizeBytes)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2 self-end sm:self-center">
                <span className="rounded bg-teal-500/10 px-2 py-1 text-[11px] font-semibold text-teal-400 border border-teal-500/20">
                  Target: {formatDimensions(imageMetadata.width * scale, imageMetadata.height * scale)} ({scale}×)
                </span>
                <button
                  type="button"
                  onClick={reset}
                  disabled={isProcessing}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-200 disabled:opacity-40"
                  title="Change image"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Model Selector */}
            <ModelSelector
              currentMode={currentMode}
              onSelectMode={selectMode}
              isCached={isCached}
              isCheckingCache={isCheckingCache}
              disabled={isProcessing}
            />

            {/* User Customizable Parameters & Hardware Strategy */}
            <BasicParameters
              model={currentModel}
              scale={scale}
              onScaleChange={setScale}
              sharpness={sharpness}
              onSharpnessChange={setSharpness}
              denoise={denoise}
              onDenoiseChange={setDenoise}
              tileSize={tileSize}
              onTileSizeChange={setTileSize}
              autoTileSize={autoTileSize}
              onAutoTileSizeChange={setAutoTileSize}
              overlap={overlap}
              onOverlapChange={setOverlap}
              disabled={isProcessing}
            />

            {/* Upscale Action Trigger */}
            {!resultCanvas && progress.stage === 'idle' && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
                <div className="flex items-center space-x-2 text-xs text-emerald-400">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Your image is processed strictly on your GPU and will never be uploaded.</span>
                </div>

                <button
                  type="button"
                  onClick={handleStartUpscale}
                  disabled={isProcessing}
                  className="flex items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-400 px-6 py-3.5 text-sm sm:text-base font-bold text-slate-950 hover:from-teal-400 hover:to-emerald-300 transition-all shadow-xl shadow-teal-500/20 active:scale-[0.98] disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4 text-slate-950" />
                  <span>Upscale {scale}× with {currentModel.name}</span>
                  <ArrowRight className="h-4 w-4 text-slate-950" />
                </button>
              </div>
            )}

            {/* Active Progress */}
            {progress.stage !== 'idle' && progress.stage !== 'completed' && (
              <ProgressCard progress={progress} />
            )}

            {/* Error Display */}
            {error && (
              <div className="rounded-xl border border-red-500/30 bg-red-950/30 p-4 text-xs text-red-300">
                <strong className="font-semibold block mb-1">Inference Notice:</strong>
                <p>{error}</p>
              </div>
            )}

            {/* Comparison Viewer */}
            {resultCanvas && imageMetadata && (
              <div className="space-y-6 pt-2">
                <ComparisonViewer
                  originalImage={imageMetadata}
                  resultCanvas={resultCanvas}
                />

                <DownloadToolbar
                  originalImage={imageMetadata}
                  resultCanvas={resultCanvas}
                  onReset={reset}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};
