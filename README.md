# WebGPU Free Image Upscaler — ยกระดับความคมชัดภาพถ่ายด้วย AI บนเบราว์เซอร์

[![Cloudflare Workers](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-orange?logo=cloudflare)](https://webgpu-image-upscaler.nounxlab.workers.dev)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub](https://img.shields.io/badge/GitHub-ThanabordeeN%2FUpscale-181717?logo=github)](https://github.com/ThanabordeeN/Upscale)
[![WebGPU](https://img.shields.io/badge/WebGPU-Active-green?logo=w3c)](https://www.w3.org/TR/webgpu/)

> **A 100% free, 100% private in-browser 4× AI image super-resolution web application powered by WebGPU and ONNX Runtime Web.**  
> ภาพถ่ายของคุณจะได้รับการประมวลผลบนการ์ดจอ (GPU) ในเครื่องของคุณโดยตรง รูปภาพไม่เคยถูกส่งขึ้นเซิร์ฟเวอร์ใดๆ ปลอดภัยสูงสุด 100%

---

## 🔗 Live Application & Links

* **🌐 Live Production URL**: [https://webgpu-image-upscaler.nounxlab.workers.dev](https://webgpu-image-upscaler.nounxlab.workers.dev)
* **🐙 GitHub Repository**: [https://github.com/ThanabordeeN/Upscale](https://github.com/ThanabordeeN/Upscale)
* **🤗 Hugging Face Models**:
  * Fast Mode: [Heliosoph/realesrgan-onnx](https://huggingface.co/Heliosoph/realesrgan-onnx) (`RealESR-general-x4v3`, 4.87 MB)
  * Photo Mode: [SceneWorks/real-esrgan-onnx](https://huggingface.co/SceneWorks/real-esrgan-onnx) (`real_esrgan_x4`, 64 MB)

---

## 🌟 จุดเด่นและฟีเจอร์สำคัญ (Key Features)

* **สไตล์ Soft Editorial UI**:
  * ผสมผสานศิลปะตัวพิมพ์นิตยสาร **Noto Serif Thai** และ **Newsreader** เข้ากับความโมเดิร์นของ **Prompt** และ **Plus Jakarta Sans**
  * คุมโทนสีกระดาษอบอุ่น **Warm Charcoal Paper & Linen** สบายตา ไม่ฉูดฉาด
* **รองรับภาษาไทย 100% (Bilingual Support)**:
  * ปุ่มสลับภาษา **`[ ไทย | EN ]`** ที่มุมขวาบน สลับภาษาได้ทันทีและบันทึกค่าไว้ในเบราว์เซอร์
* **ปรับแต่งค่าพารามิเตอร์ได้อย่างอิสระ (Customizable Parameters)**:
  * **Scale Factor**: เลือกขยายขนาด `2× (Compact)` หรือ `4× (Ultra HD)`
  * **Detail & Edge Sharpness**: สไลเดอร์ปรับความคมชัดของขอบภาพตั้งแต่ 0% (นุ่มนวลเป็นธรรมชาติ) ถึง 100% (คมชัดกริบ)
  * **Hardware Tiling**: เลือกขนาดบล็อกประมวลผล `128px`, `256px`, `512px` หรือตั้งค่า **Auto Adaptive** ตามการ์ดจอ
  * **Seam Overlap**: ผสานขอบบล็อกภาพด้วยเทคนิค **Raised-Cosine 2D Overlap Blending** ลบรอยตัดของบล็อกภาพ 100%
* **ความเป็นส่วนตัวขั้นสูงสุด (Zero Uploads Guarantee)**:
  * รูปภาพ พิกเซล และข้อมูล EXIF ประมวลผลในหน่วยความจำ RAM/VRAM ของเครื่องผู้ใช้ผ่าน HTML5 ImageBitmap & File API เท่านั้น
  * ผู้ใช้สามารถเปิด Chrome DevTools (`F12`) แท็บ Network เพื่อพิสูจน์ได้ว่าไม่มีข้อมูลภาพใดๆ หลุดออกจากเครื่อง
* **ไร้เซิร์ฟเวอร์ GPU (Zero Server Cost)**:
  * ดาวน์โหลดโมเดลตรงจาก Hugging Face CDN และแคชลง Cache Storage API + IndexedDB ในเครื่องผู้ใช้
  * โฮสต์เว็บแอปพลิเคชันบน Cloudflare Workers Static Assets (ขนาด Static Bundle รวม < 400 kB)

---

## 📁 โครงสร้างโปรเจกต์ (Repository Structure)

```text
├── src/
│   ├── components/
│   │   ├── content/        # ข้อมูลเชิงเทคนิค, คำถามที่พบบ่อย (FAQ), นโยบายความเป็นส่วนตัว
│   │   ├── layout/         # Header (พร้อมปุ่มสลับภาษา), Footer, AdSlot
│   │   └── upscaler/       # DropZone, ModelSelector, BasicParameters, ProgressCard, ComparisonViewer, DownloadToolbar
│   ├── config/             # การตั้งค่าแอปพลิเคชันและโมเดล ONNX จาก Hugging Face
│   ├── context/            # LanguageContext (TH / EN)
│   ├── hooks/              # useWebGPU, useModelManager, useUpscaler
│   ├── i18n/               # พจนานุกรมคำแปลภาษาไทยและภาษาอังกฤษ
│   ├── services/           # webgpuDetector, modelCache, tilingEngine, blendOverlap, inferenceRunner, analytics
│   └── utils/              # canvasUtils, indexedDb, formatters
├── worker/
│   └── index.ts            # Cloudflare Worker API (/health, /api/config, /api/analytics)
├── public/
│   ├── models/             # โครงสร้างโมเดล ONNX สำหรับ Local Dev
│   ├── robots.txt
│   └── sitemap.xml
├── wrangler.toml           # การตั้งค่า Cloudflare Workers Static Assets
└── vite.config.ts          # การตั้งค่า Vite + Dev API Middleware
```

---

## 🛠️ วิธีการรันบนเครื่อง Local (Quick Start)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. รัน Local Development Server
```bash
npm run dev
```
เปิดเบราว์เซอร์ไปที่ `http://localhost:5173`

### 3. ทดสอบ Build สำหรับ Production
```bash
npm run build
```

### 4. Deploy ขึ้น Cloudflare Workers
```bash
npm run worker:deploy
```

---

## 🐧 การเปิดใช้งาน WebGPU บน Linux (Chrome / Brave / Edge)

เนื่องจาก Linux มีความหลากหลายของไดรเวอร์กราฟิก เบราว์เซอร์อาจปิด WebGPU ไว้เป็นค่าเริ่มต้น สามารถเปิดใช้งานได้ง่ายๆ:
1. พิมพ์ในช่อง Address bar: `chrome://flags/#enable-unsafe-webgpu` ปรับเป็น **Enabled**
2. พิมพ์: `chrome://flags/#enable-vulkan` ปรับเป็น **Enabled**
3. กดปุ่มสีฟ้า **Relaunch** ด้านล่างเบราว์เซอร์
4. หรือเปิดเบราว์เซอร์ผ่าน Terminal ด้วยคำสั่ง:
   ```bash
   google-chrome --enable-features=Vulkan --enable-unsafe-webgpu
   ```

---

## 📜 License & Research Credits

* **WebGPU Free Image Upscaler**: MIT License
* **Real-ESRGAN**: BSD-3-Clause License (Tencent ARC Lab & UCAS - Xintao Wang et al.)
* **Real-HAT-GAN**: Apache-2.0 License (Xiangyu Chen, Xintao Wang et al.)
* **ONNX Runtime Web**: MIT License (Microsoft)
