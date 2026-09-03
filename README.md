# WebGPU Free Image Upscaler — V1

A 100% free, 100% private in-browser 4× AI image super-resolution application powered by **WebGPU** and **ONNX Runtime Web**. Images never leave the user's browser, incurring **$0 in server GPU compute costs**.

---

## 🚀 Key Features

* **Dual AI Modes**:
  * **Fast Mode**: Real-ESRGAN (`RealESR-general-x4v3` / `RealESRGAN_x4plus`) — fast inference, low VRAM footprint, optimal for compressed JPEGs, social media, and screenshots.
  * **Photo Mode**: Real-HAT-GAN (`Real_HAT_GAN_SRx4` official non-sharper variant) — state-of-the-art Hybrid Attention Transformer preserving natural textures and micro-contrast.
* **100% Client-Side Privacy**: Zero image bytes, thumbnails, or EXIF metadata are ever sent across the network. Auditable in browser DevTools Network tab.
* **Seamless Tiling & Blend Overlap**: Raised-cosine 2D accumulation feathering across 128px / 256px / 512px tile boundaries, completely eliminating grid seams.
* **Adaptive GPU Out-Of-Memory Recovery**: Automatically steps down tile size (`512px → 256px → 128px`) without page reload if VRAM bounds are reached.
* **Versioned Local Model Caching**: On-demand downloading cached via Cache Storage API and IndexedDB (`realesrgan-x4-v1`, `real-hat-gan-x4-v1`).
* **Cloudflare Workers Architecture**: Hosted on Workers Static Assets (under 500 KB total, compliant with Cloudflare's 25 MiB asset ceiling), with models hosted on Cloudflare R2 (`models.example.com`).

---

## 📁 Repository Structure

```text
├── src/
│   ├── components/
│   │   ├── content/        # SEO & educational pages (How It Works, Model Guide, FAQ, Privacy, About)
│   │   ├── layout/         # Header, Footer, and AdSlot (safe ad separation per spec)
│   │   └── upscaler/       # DropZone, ModelSelector, TileSettings, ProgressCard, ComparisonViewer, DownloadToolbar
│   ├── config/             # App and model configurations
│   ├── hooks/              # useWebGPU, useModelManager, useUpscaler
│   ├── services/           # webgpuDetector, modelCache, tilingEngine, blendOverlap, inferenceRunner, analytics
│   └── utils/              # canvasUtils, indexedDb, formatters
├── worker/
│   └── index.ts            # Cloudflare Worker API (/health, /api/config, /api/model-manifest, /api/analytics)
├── public/
│   ├── models/             # Local manifests & dev assets
│   ├── robots.txt
│   └── sitemap.xml
├── scripts/
│   ├── export_realesrgan.py     # PyTorch to ONNX export for Real-ESRGAN
│   ├── export_real_hat_gan.py   # Technical Gate PyTorch to ONNX export for Real-HAT-GAN
│   ├── validate_onnx.py         # ONNX graph & WebGPU operator verification
│   ├── setup_r2_bucket.sh       # Cloudflare R2 bucket creation & CORS setup
│   └── r2-cors.json             # R2 CORS configuration
├── wrangler.toml           # Cloudflare Workers + Static Assets configuration
└── vite.config.ts          # Vite configuration optimized for WebGPU
```

---

## 🛠️ Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Local Frontend Development
```bash
npm run dev
```

### 3. Build & Test Cloudflare Worker Locally
```bash
npm run build
npm run worker:dev
```
Open `http://localhost:8787` in Chrome 113+ or Edge 113+.

---

## ☁️ Cloudflare R2 & Deployment

### 1. Configure Cloudflare R2
Run the setup script:
```bash
./scripts/setup_r2_bucket.sh
```

### 2. Upload ONNX Models to R2
```bash
npx wrangler r2 object put upscaler-models/models/realesrgan/model.onnx --file models/realesrgan/model.onnx
npx wrangler r2 object put upscaler-models/models/realesrgan/manifest.json --file public/models/realesrgan/manifest.json
npx wrangler r2 object put upscaler-models/models/real-hat/model.onnx --file models/real-hat/model.onnx
npx wrangler r2 object put upscaler-models/models/real-hat/manifest.json --file public/models/real-hat/manifest.json
```

### 3. Deploy Worker & Static Assets
```bash
npm run build
npm run worker:deploy
```

---

## 🔒 Privacy Guarantee

This app is engineered to guarantee 100% on-device execution:
* **HTML5 ImageBitmap & File API**: Images remain solely in browser client memory.
* **Worker Guard**: The `/api/analytics` endpoint rejects any payload containing `image`, `file`, `base64`, or payloads larger than 4KB with HTTP 400.
* **Independent Verification**: Press `F12` in Chrome/Edge, open the Network tab, and observe that only ONNX model weights and static assets are fetched. Zero image bytes leave your machine.
