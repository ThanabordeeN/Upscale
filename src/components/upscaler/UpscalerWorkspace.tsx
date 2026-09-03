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
import { useLanguage } from '../../context/LanguageContext';

interface UpscalerWorkspaceProps {
  webgpuStatus: WebGPUStatus;
  onRefreshWebGPU?: () => void;
}

export const UpscalerWorkspace: React.FC<UpscalerWorkspaceProps> = ({
  webgpuStatus,
  onRefreshWebGPU,
}) => {
  const { t } = useLanguage();
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
      <div className="rounded-3xl border border-paper-800 bg-paper-900/60 p-6 sm:p-10 backdrop-blur-xl shadow-2xl space-y-7">
        {/* Step 1: Image Selection */}
        {!imageMetadata ? (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-9">
              <span className="inline-block text-[11px] font-mono uppercase tracking-widest text-terracotta-400 mb-3 px-3 py-1 rounded-full bg-paper-850 border border-paper-800">
                Client-Side Neural Super-Resolution
              </span>
              <h1 className="text-3xl sm:text-5xl font-serif font-normal text-paper-50 tracking-tight leading-tight">
                {t.heroTitlePart1}{' '}
                <span className="italic font-serif text-terracotta-400">{t.heroTitlePart2}</span>
              </h1>
              <p className="mt-3.5 text-xs sm:text-sm text-paper-400 font-sans max-w-xl mx-auto leading-relaxed">
                {t.heroSubtitle}
              </p>
            </div>
            <DropZone onImageSelected={handleImageSelected} isProcessing={isProcessing} />
          </div>
        ) : (
          /* Step 2 & 3: Model Configuration & Processing */
          <div className="space-y-6">
            {/* Selected Image Metadata Pill */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between rounded-2xl border border-paper-800 bg-paper-950/70 p-4 text-xs gap-3.5">
              <div className="flex items-center space-x-3.5 overflow-hidden">
                <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-paper-850 text-terracotta-400 border border-paper-800 shadow-sm">
                  <FileImage className="h-5 w-5" />
                </div>
                <div className="overflow-hidden">
                  <span className="font-medium text-paper-100 block truncate text-sm">{imageMetadata.name}</span>
                  <div className="flex items-center space-x-2 text-paper-400 font-mono mt-0.5 text-[11px]">
                    <span>{formatDimensions(imageMetadata.width, imageMetadata.height)}</span>
                    <span>•</span>
                    <span>{calculateMegapixels(imageMetadata.width, imageMetadata.height)}</span>
                    <span>•</span>
                    <span>{formatBytes(imageMetadata.sizeBytes)}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2.5 self-end sm:self-center">
                <span className="rounded-full bg-paper-850 px-3 py-1 text-[11px] font-medium text-terracotta-400 border border-paper-800 font-mono">
                  {t.targetResolution}: {formatDimensions(imageMetadata.width * scale, imageMetadata.height * scale)} ({scale}×)
                </span>
                <button
                  type="button"
                  onClick={reset}
                  disabled={isProcessing}
                  className="rounded-full p-2 text-paper-400 hover:bg-paper-800 hover:text-paper-100 transition-all disabled:opacity-40"
                  title={t.changeImage}
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
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-paper-800/60">
                <div className="flex items-center space-x-2 text-xs text-sage-400">
                  <ShieldCheck className="h-4 w-4 text-sage-400 flex-shrink-0" />
                  <span>{t.privacyPromise}</span>
                </div>

                <button
                  type="button"
                  onClick={handleStartUpscale}
                  disabled={isProcessing}
                  className="flex items-center justify-center space-x-2.5 rounded-2xl bg-terracotta-500 hover:bg-terracotta-600 px-7 py-3.5 text-sm sm:text-base font-medium text-paper-50 transition-all shadow-lg shadow-terracotta-900/30 active:scale-[0.99] disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>{t.startUpscaleBtn} {scale}× ({currentModel.name})</span>
                  <ArrowRight className="h-4 w-4" />
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
