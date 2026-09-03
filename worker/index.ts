export interface Env {
  ASSETS: Fetcher;
  ENVIRONMENT?: string;
  MODEL_CDN_URL?: string;
  APP_URL?: string;
  ENABLE_ANALYTICS?: string;
  DEFAULT_FAST_MODEL_VERSION?: string;
  DEFAULT_PHOTO_MODEL_VERSION?: string;
}

interface AnalyticsPayload {
  model: 'fast' | 'photo';
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

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const origin = request.headers.get('Origin') || '*';

    // CORS headers for API routes
    const corsHeaders: Record<string, string> = {
      'Access-Control-Allow-Origin': env.APP_URL || origin,
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, X-Client-Version',
      'Access-Control-Max-Age': '86400',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders,
      });
    }

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(
        JSON.stringify({
          status: 'ok',
          timestamp: new Date().toISOString(),
          environment: env.ENVIRONMENT || 'production',
          service: 'webgpu-free-image-upscaler',
        }),
        {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Cache-Control': 'no-store',
            ...corsHeaders,
          },
        }
      );
    }

    // API Config endpoint
    if (url.pathname === '/api/config') {
      const config = {
        modelCdnUrl: env.MODEL_CDN_URL || 'https://models.example.com',
        models: {
          fast: {
            id: 'fast',
            name: 'Fast Mode (Real-ESRGAN)',
            architecture: 'RealESR-general-x4v3',
            fallbackArchitecture: 'RealESRGAN_x4plus',
            scale: 4,
            version: env.DEFAULT_FAST_MODEL_VERSION || 'realesrgan-x4-v1',
            fileName: 'model.onnx',
            recommendedTileSizes: [128, 256, 512],
            defaultTileSize: 256,
            overlap: 16,
            description: 'Fast processing, lower GPU requirement, ideal for everyday images, screenshots and web graphics.',
          },
          photo: {
            id: 'photo',
            name: 'Photo Mode (Real-HAT-GAN SRx4)',
            architecture: 'Real_HAT_GAN_SRx4',
            scale: 4,
            version: env.DEFAULT_PHOTO_MODEL_VERSION || 'real-hat-gan-x4-v1',
            fileName: 'model.onnx',
            recommendedTileSizes: [128, 256],
            defaultTileSize: 256,
            overlap: 16,
            description: 'State-of-the-art Hybrid Attention Transformer, optimal fidelity for real photographs and high textures.',
          },
        },
        privacyGuarantee: {
          clientOnlyInference: true,
          zeroUploads: true,
          noServerStorage: true,
        },
      };

      return new Response(JSON.stringify(config), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=3600',
          ...corsHeaders,
        },
      });
    }

    // API Model Manifest endpoint
    if (url.pathname === '/api/model-manifest') {
      const manifests = {
        realesrgan: {
          name: 'Real-ESRGAN General x4v3',
          version: env.DEFAULT_FAST_MODEL_VERSION || 'realesrgan-x4-v1',
          scale: 4,
          channels: 3,
          format: 'ONNX',
          recommendedTileSize: 256,
          supportedTileSizes: [128, 256, 512],
          overlap: 16,
          opset: 17,
          precision: 'fp32',
          author: 'Xintao Wang et al.',
          license: 'BSD 3-Clause',
        },
        'real-hat': {
          name: 'Real-HAT-GAN SRx4',
          version: env.DEFAULT_PHOTO_MODEL_VERSION || 'real-hat-gan-x4-v1',
          scale: 4,
          channels: 3,
          format: 'ONNX',
          recommendedTileSize: 256,
          supportedTileSizes: [128, 256],
          overlap: 16,
          opset: 17,
          precision: 'fp32',
          author: 'Xiangyu Chen et al.',
          license: 'Apache-2.0',
        },
      };

      return new Response(JSON.stringify(manifests), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'public, max-age=86400',
          ...corsHeaders,
        },
      });
    }

    // Anonymous Analytics (Strictly Privacy-Preserving)
    if (url.pathname === '/api/analytics' && request.method === 'POST') {
      try {
        const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
        // Strict guard: Disallow large payloads (reject anything that could contain image data)
        if (contentLength > 4096) {
          return new Response(
            JSON.stringify({ error: 'Payload exceeds privacy limits (max 4KB)' }),
            { status: 413, headers: corsHeaders }
          );
        }

        const bodyText = await request.text();
        const payload = JSON.parse(bodyText) as Record<string, unknown>;

        // Strict forbidden keys check: Image input MUST remain local!
        const forbiddenKeys = ['image', 'bytes', 'data', 'base64', 'file', 'filename', 'url', 'path', 'exif', 'preview'];
        for (const key of forbiddenKeys) {
          if (key in payload) {
            return new Response(
              JSON.stringify({ error: `Forbidden field '${key}' detected. Privacy violation.` }),
              { status: 400, headers: corsHeaders }
            );
          }
        }

        const sanitized: AnalyticsPayload = {
          model: payload.model === 'photo' ? 'photo' : 'fast',
          scale: Number(payload.scale) || 4,
          tileSize: typeof payload.tileSize === 'number' ? payload.tileSize : undefined,
          processingMs: Math.max(0, Number(payload.processingMs) || 0),
          success: Boolean(payload.success),
          browser: typeof payload.browser === 'string' ? payload.browser.slice(0, 100) : undefined,
          webgpuSupported: Boolean(payload.webgpuSupported),
          deviceVendor: typeof payload.deviceVendor === 'string' ? payload.deviceVendor.slice(0, 100) : undefined,
          deviceRenderer: typeof payload.deviceRenderer === 'string' ? payload.deviceRenderer.slice(0, 100) : undefined,
          inputWidth: typeof payload.inputWidth === 'number' ? payload.inputWidth : undefined,
          inputHeight: typeof payload.inputHeight === 'number' ? payload.inputHeight : undefined,
          outputWidth: typeof payload.outputWidth === 'number' ? payload.outputWidth : undefined,
          outputHeight: typeof payload.outputHeight === 'number' ? payload.outputHeight : undefined,
          errorMessage: typeof payload.errorMessage === 'string' ? payload.errorMessage.slice(0, 200) : undefined,
        };

        // Telemetry logging without logging user IP or identity
        console.log('[Anonymous Analytics]', JSON.stringify(sanitized));

        return new Response(JSON.stringify({ accepted: true }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            ...corsHeaders,
          },
        });
      } catch (err) {
        return new Response(JSON.stringify({ error: 'Invalid analytics payload' }), {
          status: 400,
          headers: corsHeaders,
        });
      }
    }

    // For all other requests, serve static assets via Workers Static Assets
    if (env.ASSETS) {
      const response = await env.ASSETS.fetch(request);
      
      // Inject security headers on HTML responses
      const contentType = response.headers.get('content-type') || '';
      if (contentType.includes('text/html')) {
        const newHeaders = new Headers(response.headers);
        // Security headers
        newHeaders.set('X-Content-Type-Options', 'nosniff');
        newHeaders.set('X-Frame-Options', 'SAMEORIGIN');
        newHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin');
        // WebGPU and multithreaded WASM support headers
        newHeaders.set('Cross-Origin-Opener-Policy', 'same-origin');
        newHeaders.set('Cross-Origin-Embedder-Policy', 'credentialless');

        return new Response(response.body, {
          status: response.status,
          statusText: response.statusText,
          headers: newHeaders,
        });
      }

      return response;
    }

    return new Response('Not Found', { status: 404 });
  },
};
