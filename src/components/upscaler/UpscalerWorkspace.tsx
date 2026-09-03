import React from 'react';
import { ArrowRight, ShieldCheck, X, FileImage } from 'lucide-react';
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
import { formatBytes, formatDimensions } from '../../utils/formatters';
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

  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 sm:py-12">
      <WebGPUStatusBanner status={webgpuStatus} onRefresh={onRefreshWebGPU} />

      {!imageMetadata ? (
        <div>
          <div className="mx-auto mb-9 max-w-2xl text-center sm:mb-12">
            <h1 className="text-[36px] font-semibold leading-[1.08] tracking-[-0.04em] text-paper-50 sm:text-6xl">
              {t.heroTitlePart1}
              <span className="mt-1 block text-paper-400">{t.heroTitlePart2}</span>
            </h1>
            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-paper-500 sm:text-[15px]">
              {t.heroSubtitle}
            </p>
          </div>
          <DropZone onImageSelected={handleImageSelected} isProcessing={isProcessing} />
        </div>
      ) : (
        <div className="space-y-5 rounded-[30px] bg-paper-900/35 p-4 ring-1 ring-inset ring-white/10 sm:p-6">
          <div className="flex items-center justify-between gap-3 rounded-[20px] bg-paper-950/70 p-3.5 ring-1 ring-inset ring-white/10">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-paper-800 text-paper-300">
                <FileImage className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <span className="block truncate text-sm font-medium text-paper-100">{imageMetadata.name}</span>
                <span className="mt-0.5 block text-[11px] text-paper-500">
                  {formatDimensions(imageMetadata.width, imageMetadata.height)} · {formatBytes(imageMetadata.sizeBytes)} · → {formatDimensions(imageMetadata.width * scale, imageMetadata.height * scale)}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={reset}
              disabled={isProcessing}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-paper-500 transition-colors hover:bg-paper-800 hover:text-paper-100 disabled:opacity-40"
              title={t.changeImage}
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <ModelSelector
            currentMode={currentMode}
            onSelectMode={selectMode}
            isCached={isCached}
            isCheckingCache={isCheckingCache}
            disabled={isProcessing}
          />

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

          {!resultCanvas && progress.stage === 'idle' && (
            <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1.5 text-[11px] text-paper-500">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>{t.privacyPromise}</span>
              </div>
              <button
                type="button"
                onClick={() => runUpscale(currentModel)}
                disabled={isProcessing}
                className="flex items-center justify-center gap-2 rounded-full bg-terracotta-500 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-terracotta-600 active:scale-[0.99] disabled:opacity-50"
              >
                <span>{t.startUpscaleBtn}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}

          {progress.stage !== 'idle' && progress.stage !== 'completed' && (
            <ProgressCard progress={progress} />
          )}

          {error && (
            <div className="rounded-2xl bg-red-500/10 p-4 text-xs leading-relaxed text-red-300 ring-1 ring-inset ring-red-500/20">
              {error}
            </div>
          )}

          {resultCanvas && (
            <div className="space-y-5 pt-1">
              <ComparisonViewer originalImage={imageMetadata} resultCanvas={resultCanvas} />
              <DownloadToolbar originalImage={imageMetadata} resultCanvas={resultCanvas} onReset={reset} />
            </div>
          )}
        </div>
      )}
    </section>
  );
};
