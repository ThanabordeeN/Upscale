import { ExportFormat } from '../types';

export function isOffscreenCanvasSupported(): boolean {
  return typeof OffscreenCanvas !== 'undefined';
}

export async function fileToImageBitmap(file: File): Promise<ImageBitmap> {
  if (typeof createImageBitmap === 'function') {
    return await createImageBitmap(file);
  }
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return reject(new Error('Canvas context unavailable'));
      ctx.drawImage(img, 0, 0);
      resolve(createImageBitmap(canvas));
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}

export function downloadCanvas(
  canvas: HTMLCanvasElement,
  filename: string,
  format: ExportFormat = 'png',
  quality = 0.95
): Promise<void> {
  return new Promise((resolve, reject) => {
    const mimeType = format === 'png' ? 'image/png' : format === 'webp' ? 'image/webp' : 'image/jpeg';
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          return reject(new Error('Failed to create image blob'));
        }
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const ext = format === 'jpeg' ? 'jpg' : format;
        const baseName = filename.replace(/\.[^/.]+$/, '');
        link.download = `${baseName}_4x_${Date.now()}.${ext}`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
        resolve();
      },
      mimeType,
      quality
    );
  });
}
