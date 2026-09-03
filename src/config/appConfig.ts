export const APP_CONFIG = {
  appName: 'WebGPU Free Image Upscaler',
  version: '1.0.0',
  modelCdnUrl: import.meta.env.VITE_MODEL_CDN_URL || 'https://models.example.com',
  localModelBasePath: '/models',
  apiConfigUrl: '/api/config',
  analyticsUrl: '/api/analytics',
  maxUploadSizeBytes: 30 * 1024 * 1024, // 30 MB
  maxDimension: 4096, // 4096x4096px input max
  defaultTileSize: 256,
  supportedTileSizes: [128, 256, 512],
  minOverlap: 16,
  cachePrefix: 'webgpu-upscaler-model',
};
