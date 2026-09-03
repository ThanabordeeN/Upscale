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

  if (typeof navigator === 'undefined' || !navigator.gpu) {
    status.errorMessage = 'WebGPU is not supported in this browser. Please use Chrome 113+, Edge 113+, or enable WebGPU flags.';
    return status;
  }

  try {
    const adapter = await navigator.gpu.requestAdapter({
      powerPreference: 'high-performance',
    });

    if (!adapter) {
      status.errorMessage = 'No compatible WebGPU hardware adapter found. Ensure your GPU drivers are updated and hardware acceleration is enabled.';
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
