interface GPUAdapterInfo {
  vendor: string;
  architecture: string;
  device: string;
  description: string;
}

interface GPUSupportedLimits {
  maxTextureDimension2D: number;
  maxBufferSize: number;
  maxStorageBufferBindingSize: number;
  maxComputeWorkgroupStorageSize: number;
}

interface GPUDevice {
  readonly limits: GPUSupportedLimits;
  destroy(): void;
}

interface GPUAdapter {
  requestDevice(descriptor?: Record<string, unknown>): Promise<GPUDevice>;
  requestAdapterInfo?(): Promise<GPUAdapterInfo>;
  info?: GPUAdapterInfo;
  limits?: GPUSupportedLimits;
}

interface GPU {
  requestAdapter(options?: { powerPreference?: 'low-power' | 'high-performance' }): Promise<GPUAdapter | null>;
}

interface Navigator {
  gpu?: GPU;
}
