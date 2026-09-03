export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  const seconds = (ms / 1000).toFixed(1);
  if (ms < 60000) return `${seconds}s`;
  const minutes = Math.floor(ms / 60000);
  const remainingSecs = Math.round((ms % 60000) / 1000);
  return `${minutes}m ${remainingSecs}s`;
}

export function formatDimensions(width: number, height: number): string {
  return `${width.toLocaleString()} × ${height.toLocaleString()} px`;
}

export function calculateMegapixels(width: number, height: number): string {
  const mp = (width * height) / 1_000_000;
  return `${mp.toFixed(1)} MP`;
}
