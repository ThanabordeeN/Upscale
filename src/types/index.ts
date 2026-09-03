export type ModelMode = 'fast' | 'photo';

export interface ModelConfig {
  id: ModelMode;
  name: string;
  badge: string;
  architecture: string;
  scale: number;
  version: string;
  downloadUrl: string;
  fileName: string;
  recommendedTileSizes: number[];
  defaultTileSize: number;
  overlap: number;
  estimatedMemoryMB: number;
  description: string;
  bestFor: string[];
}

export interface WebGPUStatus {
  supported: boolean;
  adapterName: string | null;
  vendor: string | null;
  architecture: string | null;
  maxTextureDimension2D: number | null;
  maxBufferSizeMB: number | null;
  errorMessage: string | null;
  isTesting: boolean;
}

export type ProcessingStage =
  | 'idle'
  | 'checking-cache'
  | 'downloading-model'
  | 'compiling-shader'
  | 'tiling'
  | 'inferencing'
  | 'blending'
  | 'completed'
  | 'error';

export interface UpscaleProgress {
  stage: ProcessingStage;
  percent: number;
  currentTile: number;
  totalTiles: number;
  elapsedMs: number;
  estimatedRemainingMs: number | null;
  tileSize: number;
  detail: string;
  oomFallbackTriggered?: boolean;
  engineMode?: 'webgpu-onnx' | 'wasm-onnx' | 'simulated-filter';
}

export interface ImageMetadata {
  name: string;
  sizeBytes: number;
  mimeType: string;
  width: number;
  height: number;
  targetWidth: number;
  targetHeight: number;
  aspectRatio: number;
  dataUrl: string;
}

export interface TileCoordinates {
  index: number;
  x: number;
  y: number;
  width: number;
  height: number;
  padLeft: number;
  padTop: number;
  padRight: number;
  padBottom: number;
  isEdgeX: boolean;
  isEdgeY: boolean;
}

export interface InferenceOptions {
  mode: ModelMode;
  scale: 2 | 4;
  sharpness: number; // 0 to 100
  denoise: number;   // 0 to 100
  tileSize: number;
  overlap: number;
  autoTileSize: boolean;
}

export interface AnalyticsPayload {
  model: ModelMode;
  scale: number;
  tileSize?: number;
  processingMs: number;
  success: boolean;
  browser?: string;
  webgpuSupported: boolean;
  deviceVendor?: string;
  deviceRenderer?: string;
  inputWidth?: number;
  inputHeight?: number;
  outputWidth?: number;
  outputHeight?: number;
  errorMessage?: string;
}

export type ExportFormat = 'png' | 'jpeg' | 'webp';
