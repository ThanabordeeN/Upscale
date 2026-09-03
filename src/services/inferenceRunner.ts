import * as ort from 'onnxruntime-web';
import { ModelConfig, UpscaleProgress } from '../types';
import { ModelCacheManager } from './modelCache';
import { TilingEngine } from './tilingEngine';
import { OverlapBlender } from './blendOverlap';
import { sendAnonymousAnalytics } from './analytics';

// Configure ONNX Runtime Web environment
if (typeof window !== 'undefined') {
  // Use CDN or R2 custom domain for WebGPU/WASM runtime files to stay within Cloudflare 25 MiB asset limits.
  ort.env.wasm.wasmPaths = import.meta.env.VITE_ORT_WASM_PATH || 'https://cdn.jsdelivr.net/npm/onnxruntime-web@1.29.0/dist/';
  ort.env.wasm.numThreads = Math.min(4, navigator.hardwareConcurrency || 2);
  ort.env.webgpu.validateInputContent = false;
}

type InferenceExecutionProvider = 'webgpu' | 'wasm';

export interface InferenceSessionContext {
  session: ort.InferenceSession;
  modelId: string;
  version: string;
  executionProvider: InferenceExecutionProvider;
}

let activeSessionContext: InferenceSessionContext | null = null;

export class InferenceRunner {
  private static createSession(
    modelBuffer: ArrayBuffer,
    executionProviders: string[]
  ): Promise<ort.InferenceSession> {
    return ort.InferenceSession.create(modelBuffer, {
      executionProviders,
      graphOptimizationLevel: 'disabled',
      enableMemPattern: false,
      enableCpuMemArena: false,
    });
  }

  private static createWasmSession(modelBuffer: ArrayBuffer): Promise<ort.InferenceSession> {
    return this.createSession(modelBuffer, ['wasm']);
  }

  private static errorText(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }

  private static async purgeCorruptedModelIfNeeded(model: ModelConfig, error: unknown): Promise<void> {
    const text = this.errorText(error).toLowerCase();
    if (text.includes('protobuf') || text.includes('failed to load model') || text.includes('invalid model')) {
      console.warn('[InferenceRunner] Corrupted model detected. Purging local cache...');
      await ModelCacheManager.purgeModel(model);
    }
  }

  /**
   * Initializes or reuses an ONNX Runtime session.
   * WebGPU is preferred; if it cannot initialize, inference falls back to real
   * ONNX Runtime Web WASM execution on the CPU. No simulated image filter is used.
   */
  public static async getOrCreateSession(
    model: ModelConfig,
    preferWebGPU = true,
    onProgress?: (stage: string, percent: number) => void
  ): Promise<InferenceSessionContext> {
    if (
      activeSessionContext &&
      activeSessionContext.modelId === model.id &&
      activeSessionContext.version === model.version
    ) {
      return activeSessionContext;
    }

    if (onProgress) onProgress('Checking model cache...', 10);

    // 1. Fetch the real ONNX model. CPU fallback still requires the same model weights.
    let modelBuffer: ArrayBuffer;
    try {
      modelBuffer = await ModelCacheManager.fetchAndCacheModel(model, (dl) => {
        if (onProgress) {
          onProgress(`Downloading ${model.name} (${Math.round(dl.percent)}%)...`, 10 + dl.percent * 0.4);
        }
      });
    } catch (fetchError) {
      const message = this.errorText(fetchError);
      console.error('[InferenceRunner] Could not load ONNX model binary:', fetchError);
      throw new Error(`Could not load ${model.name}. CPU fallback also requires the real ONNX model. ${message}`);
    }

    const hasWebGPU =
      preferWebGPU &&
      typeof navigator !== 'undefined' &&
      !!navigator.gpu;

    let session: ort.InferenceSession;
    let executionProvider: InferenceExecutionProvider;

    // 2. Prefer a pure WebGPU session. If initialization fails, explicitly retry as WASM/CPU.
    if (hasWebGPU) {
      if (onProgress) onProgress('Compiling WebGPU pipeline...', 60);

      try {
        session = await this.createSession(modelBuffer, ['webgpu']);
        executionProvider = 'webgpu';
        console.log(`[InferenceRunner] Successfully created WebGPU session for ${model.name}.`);
      } catch (gpuError) {
        console.warn('[InferenceRunner] WebGPU session creation failed. Switching to WASM CPU fallback:', gpuError);
        if (onProgress) onProgress('WebGPU unavailable. Initializing CPU (WASM) fallback...', 65);

        try {
          session = await this.createWasmSession(modelBuffer);
          executionProvider = 'wasm';
          console.log(`[InferenceRunner] Successfully created WASM CPU fallback session for ${model.name}.`);
        } catch (wasmError) {
          console.error('[InferenceRunner] WASM CPU fallback session creation also failed:', wasmError);
          await this.purgeCorruptedModelIfNeeded(model, wasmError);
          throw new Error(
            `Unable to initialize ${model.name} with WebGPU or CPU (WASM). ` +
              `WebGPU: ${this.errorText(gpuError)}; CPU: ${this.errorText(wasmError)}`
          );
        }
      }
    } else {
      if (onProgress) onProgress('WebGPU unavailable. Initializing CPU (WASM) pipeline...', 60);

      try {
        session = await this.createWasmSession(modelBuffer);
        executionProvider = 'wasm';
        console.log(`[InferenceRunner] Successfully created WASM CPU session for ${model.name}.`);
      } catch (wasmError) {
        console.error('[InferenceRunner] WASM CPU session creation failed:', wasmError);
        await this.purgeCorruptedModelIfNeeded(model, wasmError);
        throw new Error(`Unable to initialize ${model.name} on CPU (WASM): ${this.errorText(wasmError)}`);
      }
    }

    activeSessionContext = {
      session,
      modelId: model.id,
      version: model.version,
      executionProvider,
    };

    if (onProgress) {
      onProgress(
        executionProvider === 'webgpu' ? 'WebGPU AI pipeline ready' : 'CPU (WASM) AI pipeline ready',
        75
      );
    }

    return activeSessionContext;
  }

  /**
   * Runs complete tiled upscaling pipeline on input canvas/image.
   */
  public static async upscaleImage(
    sourceCanvas: HTMLCanvasElement,
    model: ModelConfig,
    options: {
      initialTileSize: number;
      overlap: number;
      scale?: 2 | 4;
      sharpness?: number;
      denoise?: number;
      onProgress: (progress: UpscaleProgress) => void;
    }
  ): Promise<HTMLCanvasElement> {
    const startTime = performance.now();
    const inputW = sourceCanvas.width;
    const inputH = sourceCanvas.height;
    const targetW = inputW * model.scale;
    const targetH = inputH * model.scale;

    let currentTileSize = options.initialTileSize;
    let oomAttempt = 0;

    while (oomAttempt < 3) {
      try {
        let resultCanvas = await this.executeTiledPass(
          sourceCanvas,
          model,
          currentTileSize,
          options.overlap,
          targetW,
          targetH,
          startTime,
          options.onProgress,
          oomAttempt > 0
        );

        // 1. If user selected 2x scale, downscale the native 4x result with high quality smoothing.
        if (options.scale === 2) {
          const target2xW = inputW * 2;
          const target2xH = inputH * 2;
          const canvas2x = document.createElement('canvas');
          canvas2x.width = target2xW;
          canvas2x.height = target2xH;
          const c2x = canvas2x.getContext('2d');
          if (c2x) {
            c2x.imageSmoothingEnabled = true;
            c2x.imageSmoothingQuality = 'high';
            c2x.drawImage(resultCanvas, 0, 0, target2xW, target2xH);
            resultCanvas = canvas2x;
          }
        }

        // 2. Optional post-inference sharpness adjustment.
        if (typeof options.sharpness === 'number' && options.sharpness !== 50) {
          resultCanvas = this.applySharpnessAdjust(resultCanvas, options.sharpness);
        }

        const finalW = resultCanvas.width;
        const finalH = resultCanvas.height;

        sendAnonymousAnalytics({
          model: model.id,
          scale: options.scale || model.scale,
          tileSize: currentTileSize,
          processingMs: performance.now() - startTime,
          success: true,
          webgpuSupported: !!(typeof navigator !== 'undefined' && navigator.gpu),
          inputWidth: inputW,
          inputHeight: inputH,
          outputWidth: finalW,
          outputHeight: finalH,
        });

        return resultCanvas;
      } catch (err: unknown) {
        const errorMsg = this.errorText(err);
        const lowerError = errorMsg.toLowerCase();
        const isOOM =
          lowerError.includes('out of memory') ||
          lowerError.includes('oom') ||
          lowerError.includes('buffer size') ||
          lowerError.includes('allocation');

        if (isOOM && currentTileSize > 128) {
          // Automatic memory downgrade: 512 -> 256 -> 128. This still runs the real ONNX model.
          const nextTileSize = currentTileSize === 512 ? 256 : 128;
          console.warn(
            `[InferenceRunner] Inference memory limit encountered with ${currentTileSize}px tiles. ` +
              `Auto-downgrading to ${nextTileSize}px...`
          );
          currentTileSize = nextTileSize;
          oomAttempt++;
          continue;
        }

        sendAnonymousAnalytics({
          model: model.id,
          scale: model.scale,
          tileSize: currentTileSize,
          processingMs: performance.now() - startTime,
          success: false,
          webgpuSupported: !!(typeof navigator !== 'undefined' && navigator.gpu),
          inputWidth: inputW,
          inputHeight: inputH,
          errorMessage: errorMsg,
        });
        throw err;
      }
    }

    throw new Error('Inference ran out of memory even with the smallest 128px tile size.');
  }

  /**
   * Internal tiled pass execution.
   */
  private static async executeTiledPass(
    sourceCanvas: HTMLCanvasElement,
    model: ModelConfig,
    tileSize: number,
    overlap: number,
    targetW: number,
    targetH: number,
    startTime: number,
    onProgress: (p: UpscaleProgress) => void,
    oomFallbackTriggered: boolean
  ): Promise<HTMLCanvasElement> {
    const inputW = sourceCanvas.width;
    const inputH = sourceCanvas.height;
    const scale = model.scale;

    onProgress({
      stage: 'checking-cache',
      percent: 5,
      currentTile: 0,
      totalTiles: 0,
      elapsedMs: performance.now() - startTime,
      estimatedRemainingMs: null,
      tileSize,
      detail: oomFallbackTriggered
        ? `Downgraded tile size to ${tileSize}px after a memory limit`
        : 'Preparing model pipeline...',
      oomFallbackTriggered,
    });

    const sessionCtx = await this.getOrCreateSession(model, true, (stage, pct) => {
      onProgress({
        stage: 'compiling-shader',
        percent: pct,
        currentTile: 0,
        totalTiles: 0,
        elapsedMs: performance.now() - startTime,
        estimatedRemainingMs: null,
        tileSize,
        detail: stage,
        oomFallbackTriggered,
      });
    });

    let engineMode: 'webgpu-onnx' | 'wasm-onnx' =
      sessionCtx.executionProvider === 'webgpu' ? 'webgpu-onnx' : 'wasm-onnx';

    onProgress({
      stage: 'tiling',
      percent: 15,
      currentTile: 0,
      totalTiles: 0,
      elapsedMs: performance.now() - startTime,
      estimatedRemainingMs: null,
      tileSize,
      detail: `Partitioning ${inputW}×${inputH}px image into ${tileSize}px tiles (overlap: ${overlap}px)...`,
      oomFallbackTriggered,
      engineMode,
    });

    const partition = TilingEngine.planTiles(inputW, inputH, tileSize, overlap);
    const totalTiles = partition.tiles.length;
    const blender = new OverlapBlender(targetW, targetH);

    // Scratch tile canvas.
    const tileCanvas = document.createElement('canvas');
    tileCanvas.width = tileSize;
    tileCanvas.height = tileSize;
    const tileCtx = tileCanvas.getContext('2d', { willReadFrequently: true });
    if (!tileCtx) throw new Error('Could not get tile canvas context');

    const scaledTileSize = tileSize * scale;
    const scaledOverlap = overlap * scale;
    const tileTimes: number[] = [];

    for (let i = 0; i < totalTiles; i++) {
      const tileStart = performance.now();
      const tile = partition.tiles[i];

      // 1. Extract tile from source image.
      tileCtx.clearRect(0, 0, tileSize, tileSize);
      tileCtx.drawImage(
        sourceCanvas,
        tile.x,
        tile.y,
        tile.width,
        tile.height,
        0,
        0,
        tile.width,
        tile.height
      );

      // If tile is smaller than tileSize (near borders), extend it to the model input size.
      if (tile.width < tileSize || tile.height < tileSize) {
        tileCtx.drawImage(
          tileCanvas,
          0,
          0,
          tile.width,
          tile.height,
          0,
          0,
          tileSize,
          tileSize
        );
      }

      const inputImageData = tileCtx.getImageData(0, 0, tileSize, tileSize);
      let outputRGBA: Uint8ClampedArray;

      try {
        outputRGBA = await this.runOnnxTileInference(
          sessionCtx.session,
          inputImageData,
          tileSize,
          scale
        );
      } catch (tileError) {
        // A WebGPU session may initialize successfully and still fail during execution.
        // In that case, switch the active session to a real WASM/CPU ONNX session and retry the same tile.
        if (sessionCtx.executionProvider !== 'webgpu') {
          throw tileError;
        }

        console.warn('[InferenceRunner] WebGPU tile inference failed. Switching to WASM CPU fallback:', tileError);

        onProgress({
          stage: 'compiling-shader',
          percent: Math.max(15, Math.round(15 + (i / Math.max(1, totalTiles)) * 80)),
          currentTile: i,
          totalTiles,
          elapsedMs: performance.now() - startTime,
          estimatedRemainingMs: null,
          tileSize,
          detail: 'WebGPU inference failed. Switching to CPU (WASM) fallback...',
          oomFallbackTriggered,
          engineMode: 'wasm-onnx',
        });

        try {
          const modelBuffer =
            (await ModelCacheManager.getCachedModel(model)) ||
            (await ModelCacheManager.fetchAndCacheModel(model));
          const wasmSession = await this.createWasmSession(modelBuffer);

          outputRGBA = await this.runOnnxTileInference(
            wasmSession,
            inputImageData,
            tileSize,
            scale
          );

          sessionCtx.session = wasmSession;
          sessionCtx.executionProvider = 'wasm';
          activeSessionContext = sessionCtx;
          engineMode = 'wasm-onnx';
          console.log('[InferenceRunner] Switched active inference session to WASM CPU fallback.');
        } catch (wasmFallbackError) {
          console.error('[InferenceRunner] WASM CPU tile fallback also failed:', wasmFallbackError);
          throw new Error(
            `WebGPU inference failed and CPU (WASM) fallback also failed. ` +
              `WebGPU: ${this.errorText(tileError)}; CPU: ${this.errorText(wasmFallbackError)}`
          );
        }
      }

      // 2. Blend tile into global canvas.
      const tileTargetX = tile.x * scale;
      const tileTargetY = tile.y * scale;

      const isLeft = tile.x === 0;
      const isTop = tile.y === 0;
      const isRight = tile.x + tile.width >= inputW;
      const isBottom = tile.y + tile.height >= inputH;

      blender.blendTile(
        outputRGBA,
        tileTargetX,
        tileTargetY,
        scaledTileSize,
        scaledTileSize,
        scaledOverlap,
        isLeft,
        isTop,
        isRight,
        isBottom
      );

      // Calculate progress and ETA.
      const tileElapsed = performance.now() - tileStart;
      tileTimes.push(tileElapsed);
      const avgTileMs = tileTimes.reduce((a, b) => a + b, 0) / tileTimes.length;
      const remainingTiles = totalTiles - (i + 1);
      const estimatedRemainingMs = remainingTiles * avgTileMs;
      const currentProgressPercent = Math.min(98, 15 + Math.round(((i + 1) / totalTiles) * 80));

      onProgress({
        stage: 'inferencing',
        percent: currentProgressPercent,
        currentTile: i + 1,
        totalTiles,
        elapsedMs: performance.now() - startTime,
        estimatedRemainingMs,
        tileSize,
        detail: `Processing tile ${i + 1}/${totalTiles} (${sessionCtx.executionProvider.toUpperCase()})`,
        oomFallbackTriggered,
        engineMode,
      });

      // Yield control briefly to keep browser UI responsive.
      if (i % 2 === 0) {
        await new Promise((resolve) => setTimeout(resolve, 0));
      }
    }

    onProgress({
      stage: 'blending',
      percent: 98,
      currentTile: totalTiles,
      totalTiles,
      elapsedMs: performance.now() - startTime,
      estimatedRemainingMs: 50,
      tileSize,
      detail: 'Composing final seamless 4x canvas...',
      oomFallbackTriggered,
      engineMode,
    });

    const finalImageData = blender.toImageData();

    const outputCanvas = document.createElement('canvas');
    outputCanvas.width = targetW;
    outputCanvas.height = targetH;
    const outCtx = outputCanvas.getContext('2d');
    if (!outCtx) throw new Error('Failed to get output canvas 2D context');
    outCtx.putImageData(finalImageData, 0, 0);

    onProgress({
      stage: 'completed',
      percent: 100,
      currentTile: totalTiles,
      totalTiles,
      elapsedMs: performance.now() - startTime,
      estimatedRemainingMs: 0,
      tileSize,
      detail: `Upscaled to ${targetW}×${targetH}px successfully in ${Math.round(
        (performance.now() - startTime) / 1000
      )}s`,
      oomFallbackTriggered,
      engineMode,
    });

    return outputCanvas;
  }

  /**
   * Runs actual ONNX Runtime inference on a single tile.
   */
  private static async runOnnxTileInference(
    session: ort.InferenceSession,
    inputImageData: ImageData,
    tileSize: number,
    scale: number
  ): Promise<Uint8ClampedArray> {
    const totalPixels = tileSize * tileSize;
    const floatData = new Float32Array(3 * totalPixels);
    const rgba = inputImageData.data;

    // Convert RGBA [0..255] to planar RGB [0.0..1.0] CHW layout.
    for (let i = 0; i < totalPixels; i++) {
      floatData[i] = rgba[i * 4] / 255.0;
      floatData[totalPixels + i] = rgba[i * 4 + 1] / 255.0;
      floatData[2 * totalPixels + i] = rgba[i * 4 + 2] / 255.0;
    }

    const inputName = session.inputNames[0] || 'input';
    const inputTensor = new ort.Tensor('float32', floatData, [1, 3, tileSize, tileSize]);
    const feeds: Record<string, ort.Tensor> = { [inputName]: inputTensor };

    const results = await session.run(feeds);
    const outputName = session.outputNames[0] || Object.keys(results)[0];
    const outputTensor = results[outputName];
    const outData = outputTensor.data as Float32Array;

    const outTileSize = tileSize * scale;
    const outPixels = outTileSize * outTileSize;
    const resultRGBA = new Uint8ClampedArray(outPixels * 4);

    // Convert planar CHW back to interleaved RGBA.
    for (let i = 0; i < outPixels; i++) {
      const r = Math.min(255, Math.max(0, Math.round(outData[i] * 255)));
      const g = Math.min(255, Math.max(0, Math.round(outData[outPixels + i] * 255)));
      const b = Math.min(255, Math.max(0, Math.round(outData[2 * outPixels + i] * 255)));

      const idx = i * 4;
      resultRGBA[idx] = r;
      resultRGBA[idx + 1] = g;
      resultRGBA[idx + 2] = b;
      resultRGBA[idx + 3] = 255;
    }

    return resultRGBA;
  }

  /**
   * Applies user-customized sharpness adjustment (-50% soften to +50% crisp).
   */
  private static applySharpnessAdjust(
    canvas: HTMLCanvasElement,
    sharpnessPercent: number
  ): HTMLCanvasElement {
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;

    const w = canvas.width;
    const h = canvas.height;
    const imgData = ctx.getImageData(0, 0, w, h);
    const data = imgData.data;
    const copy = new Uint8ClampedArray(data);

    // Factor: -1 (at 0%) to +1 (at 100%).
    const factor = (sharpnessPercent - 50) / 50.0;
    const strength = Math.abs(factor) * 0.35;

    for (let y = 1; y < h - 1; y++) {
      const yOffset = y * w;
      for (let x = 1; x < w - 1; x++) {
        const idx = (yOffset + x) * 4;
        for (let c = 0; c < 3; c++) {
          const center = copy[idx + c];
          const laplacian =
            center * 4 -
            copy[((y - 1) * w + x) * 4 + c] -
            copy[((y + 1) * w + x) * 4 + c] -
            copy[(yOffset + x - 1) * 4 + c] -
            copy[(yOffset + x + 1) * 4 + c];

          if (factor > 0) {
            data[idx + c] = Math.min(255, Math.max(0, center + laplacian * strength));
          } else {
            const avg =
              (center +
                copy[((y - 1) * w + x) * 4 + c] +
                copy[((y + 1) * w + x) * 4 + c] +
                copy[(yOffset + x - 1) * 4 + c] +
                copy[(yOffset + x + 1) * 4 + c]) /
              5;
            data[idx + c] = Math.min(
              255,
              Math.max(0, center * (1 - strength) + avg * strength)
            );
          }
        }
      }
    }

    ctx.putImageData(imgData, 0, 0);
    return canvas;
  }
}
