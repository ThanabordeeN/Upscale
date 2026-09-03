import { ModelConfig } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { idbGetModel, idbSetModel } from '../utils/indexedDb';

export interface DownloadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export class ModelCacheManager {
  private static cacheName(modelId: string, version: string): string {
    return `${APP_CONFIG.cachePrefix}-${modelId}-${version}`;
  }

  /**
   * Checks if model is cached locally without downloading
   */
  public static async isModelCached(model: ModelConfig): Promise<boolean> {
    const key = `${model.id}-${model.version}`;
    
    // 1. Try Cache API
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName(model.id, model.version));
        const match = await cache.match(model.fileName);
        if (match) return true;
      } catch (err) {
        console.warn('[ModelCache] Cache API check failed:', err);
      }
    }

    // 2. Try IndexedDB
    try {
      const buffer = await idbGetModel(key);
      if (buffer && buffer.byteLength > 0) return true;
    } catch (err) {
      console.warn('[ModelCache] IndexedDB check failed:', err);
    }

    return false;
  }

  /**
   * Retrieves model from Cache API or IndexedDB
   */
  public static async getCachedModel(model: ModelConfig): Promise<ArrayBuffer | null> {
    const key = `${model.id}-${model.version}`;

    // 1. Try Cache API
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName(model.id, model.version));
        const match = await cache.match(model.fileName);
        if (match) {
          console.log(`[ModelCache] Loaded ${model.id} (${model.version}) from Cache Storage API.`);
          return await match.arrayBuffer();
        }
      } catch (err) {
        console.warn('[ModelCache] Cache API get failed:', err);
      }
    }

    // 2. Try IndexedDB
    try {
      const buffer = await idbGetModel(key);
      if (buffer && buffer.byteLength > 0) {
        console.log(`[ModelCache] Loaded ${model.id} (${model.version}) from IndexedDB.`);
        return buffer;
      }
    } catch (err) {
      console.warn('[ModelCache] IndexedDB get failed:', err);
    }

    return null;
  }

  /**
   * Saves model to Cache API and IndexedDB
   */
  public static async saveModelToCache(model: ModelConfig, buffer: ArrayBuffer): Promise<void> {
    const key = `${model.id}-${model.version}`;

    // 1. Save to Cache API
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName(model.id, model.version));
        const response = new Response(buffer, {
          headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': buffer.byteLength.toString(),
            'X-Model-Version': model.version,
            'Cache-Control': 'public, max-age=31536000, immutable',
          },
        });
        await cache.put(model.fileName, response);
        console.log(`[ModelCache] Saved ${model.id} (${model.version}) to Cache API (${buffer.byteLength} bytes).`);
      } catch (err) {
        console.warn('[ModelCache] Cache API save failed, trying IndexedDB:', err);
      }
    }

    // 2. Save to IndexedDB as secondary storage
    try {
      await idbSetModel(key, buffer);
      console.log(`[ModelCache] Saved ${model.id} (${model.version}) to IndexedDB.`);
    } catch (err) {
      console.warn('[ModelCache] IndexedDB save failed:', err);
    }
  }

  /**
   * Downloads model with progress tracking and caches it
   */
  public static async fetchAndCacheModel(
    model: ModelConfig,
    onProgress?: (progress: DownloadProgress) => void
  ): Promise<ArrayBuffer> {
    // Check cache first
    const cached = await this.getCachedModel(model);
    if (cached) {
      if (onProgress) onProgress({ loaded: cached.byteLength, total: cached.byteLength, percent: 100 });
      return cached;
    }

    // Construct URLs: R2 CDN primary, local fallback secondary
    const r2Url = `${APP_CONFIG.modelCdnUrl}/models/${model.id === 'fast' ? 'realesrgan' : 'real-hat'}/${model.fileName}`;
    const localUrl = `${APP_CONFIG.localModelBasePath}/${model.id === 'fast' ? 'realesrgan' : 'real-hat'}/${model.fileName}`;

    let response: Response | null = null;

    try {
      console.log(`[ModelCache] Fetching model from primary CDN: ${r2Url}`);
      response = await fetch(r2Url, { mode: 'cors' });
      if (!response.ok) {
        throw new Error(`Primary CDN returned HTTP ${response.status}`);
      }
    } catch (err) {
      console.warn(`[ModelCache] Primary CDN unavailable (${err}), trying local path: ${localUrl}`);
      try {
        response = await fetch(localUrl);
        if (!response.ok) {
          throw new Error(`Local path returned HTTP ${response.status}`);
        }
      } catch (localErr) {
        throw new Error(`Failed to download model ${model.name} from both CDN and local fallback. Please verify network connection or R2 configuration.`);
      }
    }

    if (!response || !response.body) {
      throw new Error('ReadableStream not supported by response');
    }

    const contentLengthHeader = response.headers.get('content-length');
    const totalBytes = contentLengthHeader ? parseInt(contentLengthHeader, 10) : model.estimatedMemoryMB * 1024 * 1024;
    let loadedBytes = 0;

    const reader = response.body.getReader();
    const chunks: Uint8Array[] = [];

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        loadedBytes += value.length;
        if (onProgress) {
          const percent = totalBytes > 0 ? Math.min(99, Math.round((loadedBytes / totalBytes) * 100)) : 50;
          onProgress({ loaded: loadedBytes, total: totalBytes, percent });
        }
      }
    }

    // Combine chunks into single ArrayBuffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    const arrayBuffer = combined.buffer;
    if (onProgress) {
      onProgress({ loaded: totalLength, total: totalLength, percent: 100 });
    }

    // Cache locally for future visits
    await this.saveModelToCache(model, arrayBuffer);

    return arrayBuffer;
  }
}
