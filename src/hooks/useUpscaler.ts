import { useState, useCallback, useRef } from 'react';
import { ModelConfig, ImageMetadata, UpscaleProgress } from '../types';
import { InferenceRunner } from '../services/inferenceRunner';
import { fileToImageBitmap } from '../utils/canvasUtils';

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

  const runUpscale = useCallback(
    async (model: ModelConfig) => {
      if (!sourceCanvas || isProcessingRef.current) return;
      isProcessingRef.current = true;
      setError(null);

      // Determine starting tile size
      const effectiveTileSize = autoTileSize ? model.defaultTileSize : tileSize;

      try {
        const upscaled = await InferenceRunner.upscaleImage(sourceCanvas, model, {
          initialTileSize: effectiveTileSize,
          overlap,
          scale,
          sharpness,
          denoise,
          onProgress: (p) => {
            setProgress(p);
          },
        });

        setResultCanvas(upscaled);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Upscaling encountered an error';
        setError(message);
        setProgress((prev) => ({
          ...prev,
          stage: 'error',
          detail: message,
        }));
      } finally {
        isProcessingRef.current = false;
      }
    },
    [sourceCanvas, autoTileSize, tileSize, overlap, scale, sharpness, denoise]
  );

  const reset = useCallback(() => {
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
    isProcessing: progress.stage !== 'idle' && progress.stage !== 'completed' && progress.stage !== 'error',
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
  };
}
