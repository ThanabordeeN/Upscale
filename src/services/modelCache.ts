import { ModelConfig } from '../types';
import { APP_CONFIG } from '../config/appConfig';
import { idbGetModel, idbSetModel, idbDeleteModel } from '../utils/indexedDb';

export interface DownloadProgress {
  loaded: number;
  total: number;
  percent: number;
}

export function isValidOnnxBuffer(buffer: ArrayBuffer): boolean {
  if (!buffer || buffer.byteLength < 500 * 1024) {
    return false;
  }
  const bytes = new Uint8Array(buffer, 0, Math.min(64, buffer.byteLength));
  // Protobuf serialization of ONNX ModelProto starts with field 1 (ir_version) varint tag 0x08
  if (bytes[0] !== 0x08) {
    return false;
  }
  // Double-check no HTML/XML doctype
  const headerStr = String.fromCharCode(...bytes);
  if (headerStr.includes('<!DOC') || headerStr.includes('<html') || headerStr.includes('<?xml')) {
    return false;
  }
  return true;
}

export class ModelCacheManager {
  private static cacheName(modelId: string, version: string): string {
    return `${APP_CONFIG.cachePrefix}-${modelId}-${version}`;
  }

  /**
   * Purges model from both Cache Storage API and IndexedDB
   */
  public static async purgeModel(model: ModelConfig): Promise<void> {
    const key = `${model.id}-${model.version}`;
    if ('caches' in window) {
      try {
        await caches.delete(this.cacheName(model.id, model.version));
      } catch (e) {
        // ignore
      }
    }
    try {
      await idbDeleteModel(key);
    } catch (e) {
      // ignore
    }
  }

  /**
   * Checks if model is cached locally and is a valid ONNX binary
   */
  public static async isModelCached(model: ModelConfig): Promise<boolean> {
    const key = `${model.id}-${model.version}`;
    
    // 1. Try Cache API
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName(model.id, model.version));
        const match = await cache.match(model.fileName);
        if (match) {
          const buf = await match.clone().arrayBuffer();
          if (isValidOnnxBuffer(buf)) return true;
          // Purge corrupted cache
          await cache.delete(model.fileName);
        }
      } catch (err) {
        console.warn('[ModelCache] Cache API check failed:', err);
      }
    }

    // 2. Try IndexedDB
    try {
      const buffer = await idbGetModel(key);
      if (buffer && buffer.byteLength > 0) {
        if (isValidOnnxBuffer(buffer)) return true;
        await idbDeleteModel(key);
      }
    } catch (err) {
      console.warn('[ModelCache] IndexedDB check failed:', err);
    }

    return false;
  }

  /**
   * Retrieves model from Cache API or IndexedDB with validation
   */
  public static async getCachedModel(model: ModelConfig): Promise<ArrayBuffer | null> {
    const key = `${model.id}-${model.version}`;

    // 1. Try Cache API
    if ('caches' in window) {
      try {
        const cache = await caches.open(this.cacheName(model.id, model.version));
        const match = await cache.match(model.fileName);
        if (match) {
          const buffer = await match.arrayBuffer();
          if (isValidOnnxBuffer(buffer)) {
            console.log(`[ModelCache] Loaded valid ${model.id} (${model.version}) from Cache Storage API (${buffer.byteLength} bytes).`);
            return buffer;
          } else {
            console.warn(`[ModelCache] Corrupted/HTML cache found for ${model.id}. Purging...`);
            await cache.delete(model.fileName);
          }
        }
      } catch (err) {
        console.warn('[ModelCache] Cache API get failed:', err);
      }
    }

    // 2. Try IndexedDB
    try {
      const buffer = await idbGetModel(key);
      if (buffer && buffer.byteLength > 0) {
        if (isValidOnnxBuffer(buffer)) {
          console.log(`[ModelCache] Loaded valid ${model.id} (${model.version}) from IndexedDB (${buffer.byteLength} bytes).`);
          return buffer;
        } else {
          console.warn(`[ModelCache] Corrupted/HTML IndexedDB record found for ${model.id}. Purging...`);
          await idbDeleteModel(key);
        }
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
    if (!isValidOnnxBuffer(buffer)) {
      console.warn(`[ModelCache] Refusing to cache invalid buffer for ${model.id} (${buffer.byteLength} bytes).`);
      return;
    }

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

    // Try primary CDN first if not pointing to dummy domain
    if (!r2Url.includes('example.com')) {
      try {
        console.log(`[ModelCache] Fetching model from primary CDN: ${r2Url}`);
        const res = await fetch(r2Url, { mode: 'cors' });
        const cType = res.headers.get('content-type') || '';
        if (res.ok && !cType.includes('text/html')) {
          response = res;
        }
      } catch (err) {
        console.warn(`[ModelCache] Primary CDN fetch failed, trying local: ${localUrl}`);
      }
    }

    // Try local fallback
    if (!response) {
      try {
        console.log(`[ModelCache] Fetching model from local path: ${localUrl}`);
        const res = await fetch(localUrl);
        const cType = res.headers.get('content-type') || '';
        if (res.ok && !cType.includes('text/html')) {
          response = res;
        } else {
          throw new Error(`Local file returned status ${res.status} (content-type: ${cType})`);
        }
      } catch (localErr) {
        throw new Error(`Failed to download valid ONNX model ${model.name}. Both CDN and local paths failed.`);
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

    // Validate buffer is actually an ONNX protobuf file
    if (!isValidOnnxBuffer(arrayBuffer)) {
      throw new Error(`Downloaded model buffer for ${model.name} is invalid or corrupted (size: ${arrayBuffer.byteLength} bytes).`);
    }

    if (onProgress) {
      onProgress({ loaded: totalLength, total: totalLength, percent: 100 });
    }

    // Cache locally for future visits
    await this.saveModelToCache(model, arrayBuffer);

    return arrayBuffer;
  }
}
