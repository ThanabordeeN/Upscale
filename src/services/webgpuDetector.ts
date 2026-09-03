import { WebGPUStatus } from '../types';

export async function detectWebGPU(): Promise<WebGPUStatus> {
  const status: WebGPUStatus = {
    supported: false,
    adapterName: null,
    vendor: null,
    architecture: null,
    maxTextureDimension2D: null,
    maxBufferSizeMB: null,
    errorMessage: null,
    isTesting: false,
  };

  if (typeof window !== 'undefined' && !window.isSecureContext) {
    status.errorMessage = 'WebGPU is disabled because this page is not in a Secure Context (HTTPS or http://localhost). Please access via https:// or http://localhost.';
    return status;
  }

  if (typeof navigator === 'undefined' || !navigator.gpu) {
    status.errorMessage = 'navigator.gpu is not available in this browser. On Linux, Chrome/Edge requires enabling the chrome://flags/#enable-unsafe-webgpu flag.';
    return status;
  }

  try {
    // Attempt 1: High performance dedicated GPU
    let adapter: GPUAdapter | null = null;
    try {
      adapter = await navigator.gpu.requestAdapter({ powerPreference: 'high-performance' });
    } catch {
      // ignore and try fallback
    }

    // Attempt 2: Default adapter (integrated or default GPU)
    if (!adapter) {
      try {
        adapter = await navigator.gpu.requestAdapter();
      } catch {
        // ignore and try fallback
      }
    }

    // Attempt 3: Low-power adapter
    if (!adapter) {
      try {
        adapter = await navigator.gpu.requestAdapter({ powerPreference: 'low-power' });
      } catch {
        // ignore
      }
    }

    if (!adapter) {
      status.errorMessage = 'No compatible WebGPU adapter returned by requestAdapter(). Ensure GPU hardware acceleration is enabled in browser settings.';
      return status;
    }

    // Attempt to read adapter information
    if (typeof adapter.requestAdapterInfo === 'function') {
      try {
        const info = await adapter.requestAdapterInfo();
        status.adapterName = info.description || info.device || 'Dedicated/Integrated GPU';
        status.vendor = info.vendor || null;
        status.architecture = info.architecture || null;
      } catch (e) {
        // Some browsers restrict adapter info for fingerprinting protection
        status.adapterName = 'Hardware WebGPU Device';
      }
    } else if (adapter.info) {
      status.adapterName = adapter.info.description || adapter.info.device || 'Hardware WebGPU Device';
      status.vendor = adapter.info.vendor || null;
      status.architecture = adapter.info.architecture || null;
    } else {
      status.adapterName = 'Hardware WebGPU Device';
    }

    // Request device to inspect limits
    try {
      const device = await adapter.requestDevice();
      if (device && device.limits) {
        status.maxTextureDimension2D = device.limits.maxTextureDimension2D || null;
        if (device.limits.maxBufferSize) {
          status.maxBufferSizeMB = Math.round(device.limits.maxBufferSize / (1024 * 1024));
        }
      }
      device.destroy();
    } catch (e) {
      // requestDevice limit inspection failed, but adapter was found
    }

    status.supported = true;
    return status;
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    status.errorMessage = `WebGPU initialization failed: ${message}`;
    return status;
  }
}

/**
 * Suggest optimal tile size based on WebGPU limits
 */
export function getRecommendedTileSize(status: WebGPUStatus, model: 'fast' | 'photo'): number {
  if (!status.supported) return 128;
  
  // Photo mode (HAT) uses transformer attention which scales quadratically with tile size
  if (model === 'photo') {
    if (status.maxBufferSizeMB && status.maxBufferSizeMB >= 1024) {
      return 256;
    }
    return 128;
  }

  // Fast mode (Real-ESRGAN)
  if (status.maxBufferSizeMB && status.maxBufferSizeMB >= 2048) {
    return 512;
  }
  return 256;
}
