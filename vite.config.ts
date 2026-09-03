import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

function apiDevMiddleware() {
  return {
    name: 'api-dev-middleware',
    configureServer(server: any) {
      server.middlewares.use((req: any, res: any, next: any) => {
        if (req.url === '/health') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ status: 'ok', environment: 'dev', service: 'webgpu-upscaler' }));
          return;
        }
        if (req.url === '/api/config') {
          res.setHeader('Content-Type', 'application/json');
          res.end(
            JSON.stringify({
              modelCdnUrl: 'https://models.example.com',
              models: {
                fast: { id: 'fast', name: 'Fast Mode (Real-ESRGAN)', scale: 4, version: 'realesrgan-x4-v2' },
                photo: { id: 'photo', name: 'Photo Mode (Real-HAT-GAN SRx4)', scale: 4, version: 'real-hat-gan-x4-v2' },
              },
            })
          );
          return;
        }
        if (req.url === '/api/analytics' && req.method === 'POST') {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ accepted: true }));
          return;
        }
        next();
      });
    },
  };
}

export default defineConfig({
  plugins: [
    react(),
    apiDevMiddleware(),
  ],
  resolve: {
    alias: {
      'onnxruntime-web': path.resolve(__dirname, 'node_modules/onnxruntime-web/dist/ort.webgpu.min.mjs'),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  preview: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
  },
  worker: {
    format: 'es',
  },
  build: {
    target: 'esnext',
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          ort: ['onnxruntime-web'],
          vendor: ['react', 'react-dom', 'lucide-react'],
        },
      },
    },
  },
  optimizeDeps: {
    exclude: ['onnxruntime-web'],
  },
});
