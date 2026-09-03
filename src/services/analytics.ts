import { AnalyticsPayload } from '../types';
import { APP_CONFIG } from '../config/appConfig';

/**
 * Sends privacy-preserving anonymous telemetry.
 * Strict guarantee: NEVER sends image pixels, hashes, filenames, or user identifiers.
 */
export async function sendAnonymousAnalytics(data: AnalyticsPayload): Promise<void> {
  try {
    const payload = {
      model: data.model,
      scale: data.scale,
      tileSize: data.tileSize,
      processingMs: Math.round(data.processingMs),
      success: data.success,
      browser: getBrowserName(),
      webgpuSupported: data.webgpuSupported,
      deviceVendor: data.deviceVendor || undefined,
      deviceRenderer: data.deviceRenderer || undefined,
      inputWidth: data.inputWidth,
      inputHeight: data.inputHeight,
      outputWidth: data.outputWidth,
      outputHeight: data.outputHeight,
      errorMessage: data.errorMessage ? data.errorMessage.slice(0, 150) : undefined,
    };

    const json = JSON.stringify(payload);

    if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
      const blob = new Blob([json], { type: 'application/json' });
      navigator.sendBeacon(APP_CONFIG.analyticsUrl, blob);
    } else {
      fetch(APP_CONFIG.analyticsUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: json,
        keepalive: true,
      }).catch(() => {
        // Suppress network errors for analytics silently
      });
    }
  } catch (err) {
    // Fail silently, analytics should never interrupt UX
  }
}

function getBrowserName(): string {
  if (typeof navigator === 'undefined') return 'unknown';
  const ua = navigator.userAgent;
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('Chrome/') && !ua.includes('Edg/')) return 'Chrome';
  if (ua.includes('Safari/') && !ua.includes('Chrome/')) return 'Safari';
  if (ua.includes('Firefox/')) return 'Firefox';
  return 'Other';
}
