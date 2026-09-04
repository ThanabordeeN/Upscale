import { useState, useCallback, useRef, useMemo } from 'react';
import { ModelConfig, ImageMetadata, UpscaleProgress } from '../types';
import { InferenceRunner } from '../services/inferenceRunner';
import { TilingEngine } from '../services/tilingEngine';
import { fileToImageBitmap } from '../utils/canvasUtils';

export type ResolutionMode = 'fast' | 'balanced' | 'original';

export function useUpscaler() {
  const [imageMetadata, setImageMetadata] = useState<ImageMetadata | null>(null);
  const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
  const [resultCanvas, setResultCanvas] = useState<HTMLCanvasElement | null>(null);
  const [tileSize, setTileSize] = useState<number>(256);
  const [autoTileSize, setAutoTileSize] = useState<boolean>(true);
  const [overlap, setOverlap] = useState<number>(16);
  const [scale, setScale] = useState<2 | 4>(4);
  const [sharpness, setSharpness] = useState<number>(50);
  const [denoise, setDenoise] = useState<number>(50);
  const [resolutionMode, setResolutionMode] = useState<ResolutionMode>('fast');

  const [progress, setProgress] = useState<UpscaleProgress>({
    stage: 'idle',
    percent: 0,
    currentTile: 0,
    totalTiles: 0,
    elapsedMs: 0,
    estimatedRemainingMs: null,
    tileSize: 256,
    detail: 'Ready',
  });

  const [error, setError] = useState<string | null>(null);
  const isProcessingRef = useRef<boolean>(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleImageSelected = useCallback(async (file: File) => {
    setError(null);
    setResultCanvas(null);
    setProgress({
      stage: 'idle',
      percent: 0,
      currentTile: 0,
      totalTiles: 0,
      elapsedMs: 0,
      estimatedRemainingMs: null,
      tileSize: 256,
      detail: 'Image loaded',
    });

    try {
      const bitmap = await fileToImageBitmap(file);
      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Could not create canvas 2D context');
      ctx.drawImage(bitmap, 0, 0);

      const metadata: ImageMetadata = {
        name: file.name,
        sizeBytes: file.size,
        mimeType: file.type,
        width: bitmap.width,
        height: bitmap.height,
        targetWidth: bitmap.width * 4,
        targetHeight: bitmap.height * 4,
        aspectRatio: bitmap.width / bitmap.height,
        dataUrl: canvas.toDataURL('image/jpeg', 0.8),
      };

      setImageMetadata(metadata);
      setSourceCanvas(canvas);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to decode image';
      setError(msg);
    }
  }, []);

  // Compute effective input dimensions based on resolution optimization mode
  const effectiveDimensions = useMemo(() => {
    if (!sourceCanvas) return null;
    const srcW = sourceCanvas.width;
    const srcH = sourceCanvas.height;

    let maxDim = 0;
    if (resolutionMode === 'fast') maxDim = 1280;
    else if (resolutionMode === 'balanced') maxDim = 1920;
    else return { width: srcW, height: srcH, wasResized: false };

    if (srcW <= maxDim && srcH <= maxDim) {
      return { width: srcW, height: srcH, wasResized: false };
    }

    const ratio = Math.min(maxDim / srcW, maxDim / srcH);
    return {
      width: Math.round(srcW * ratio),
      height: Math.round(srcH * ratio),
      wasResized: true,
    };
  }, [sourceCanvas, resolutionMode]);

  // Estimate tile count for current configuration
  const estimatedTiles = useMemo(() => {
    if (!effectiveDimensions) return 0;
    const effTile = tileSize;
    const effOverlap = overlap;
    const partition = TilingEngine.planTiles(
      effectiveDimensions.width,
      effectiveDimensions.height,
      effTile,
      effOverlap
    );
    return partition.tiles.length;
  }, [effectiveDimensions, tileSize, overlap]);

  const cancelUpscale = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isProcessingRef.current = false;
    setProgress({
      stage: 'idle',
      percent: 0,
      currentTile: 0,
      totalTiles: 0,
      elapsedMs: 0,
      estimatedRemainingMs: null,
      tileSize: 256,
      detail: 'Upscaling cancelled',
    });
  }, []);

  const runUpscale = useCallback(
    async (model: ModelConfig) => {
      if (!sourceCanvas || isProcessingRef.current) return;
      isProcessingRef.current = true;
      setError(null);

      // Prepare input canvas according to resolution mode
      let canvasToProcess = sourceCanvas;
      if (effectiveDimensions && effectiveDimensions.wasResized) {
        const resizedCanvas = document.createElement('canvas');
        resizedCanvas.width = effectiveDimensions.width;
        resizedCanvas.height = effectiveDimensions.height;
        const rCtx = resizedCanvas.getContext('2d');
        if (rCtx) {
          rCtx.imageSmoothingEnabled = true;
          rCtx.imageSmoothingQuality = 'high';
          rCtx.drawImage(
            sourceCanvas,
            0,
            0,
            effectiveDimensions.width,
            effectiveDimensions.height
          );
          canvasToProcess = resizedCanvas;
        }
      }

      const effectiveTileSize = autoTileSize ? model.defaultTileSize : tileSize;
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      try {
        const upscaled = await InferenceRunner.upscaleImage(canvasToProcess, model, {
          initialTileSize: effectiveTileSize,
          overlap,
          scale,
          sharpness,
          denoise,
          abortSignal: abortController.signal,
          onProgress: (p) => {
            setProgress(p);
          },
        });

        setResultCanvas(upscaled);
      } catch (err: unknown) {
        if (
          abortController.signal.aborted ||
          (err instanceof Error && err.message.toLowerCase().includes('cancel'))
        ) {
          setProgress({
            stage: 'idle',
            percent: 0,
            currentTile: 0,
            totalTiles: 0,
            elapsedMs: 0,
            estimatedRemainingMs: null,
            tileSize: 256,
            detail: 'Cancelled',
          });
          return;
        }

        const message = err instanceof Error ? err.message : 'Upscaling encountered an error';
        setError(message);
        setProgress((prev) => ({
          ...prev,
          stage: 'error',
          detail: message,
        }));
      } finally {
        isProcessingRef.current = false;
        abortControllerRef.current = null;
      }
    },
    [sourceCanvas, effectiveDimensions, autoTileSize, tileSize, overlap, scale, sharpness, denoise]
  );

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    isProcessingRef.current = false;
    setImageMetadata(null);
    setSourceCanvas(null);
    setResultCanvas(null);
    setError(null);
    setProgress({
      stage: 'idle',
      percent: 0,
      currentTile: 0,
      totalTiles: 0,
      elapsedMs: 0,
      estimatedRemainingMs: null,
      tileSize: 256,
      detail: 'Ready',
    });
  }, []);

  return {
    imageMetadata,
    sourceCanvas,
    resultCanvas,
    progress,
    error,
    isProcessing:
      progress.stage !== 'idle' &&
      progress.stage !== 'completed' &&
      progress.stage !== 'error',
    tileSize,
    autoTileSize,
    overlap,
    scale,
    sharpness,
    denoise,
    resolutionMode,
    setResolutionMode,
    setTileSize,
    setAutoTileSize,
    setOverlap,
    setScale,
    setSharpness,
    setDenoise,
    handleImageSelected,
    runUpscale,
    cancelUpscale,
    reset,
    effectiveDimensions,
    estimatedTiles,
  };
}
