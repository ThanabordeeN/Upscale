import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
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
