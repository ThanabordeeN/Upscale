export type Language = 'th' | 'en';

export const translations = {
  th: {
    // Header
    brandTitle: 'WebGPU Image Upscaler',
    tagline: 'ยกระดับความคมชัดภาพถ่ายฟรี 100%',
    navHowItWorks: 'วิธีทำงาน',
    navModels: 'โมเดล AI',
    navFaq: 'คำถามที่พบบ่อย',
    navPrivacy: 'ความเป็นส่วนตัว',
    zeroUploadBadge: 'ไร้การอัปโหลด 100%',

    // Hero
    heroTitlePart1: 'ยกระดับความคมชัดภาพถ่าย',
    heroTitlePart2: 'ด้วยพลัง AI บนการ์ดจอของคุณ',
    heroSubtitle: 'ขยายภาพ 2× และ 4× แบบความละเอียดสูง (Super-Resolution) ประมวลผลภายในเบราว์เซอร์ของคุณโดยตรง ภาพไม่หลุดออกจากเครื่อง ฟรีตลอดชีพ ไม่มีเครดิต',

    // Dropzone
    dropzoneTitle: 'วางรูปภาพที่นี่ หรือคลิกเพื่อเลือกไฟล์',
    dropzoneHint: 'รองรับไฟล์ PNG, JPEG, WebP ขนาดสูงสุด 30 MB (ความละเอียดสูงสุด 4096×4096 px)',
    dropzonePrivacyBadge: 'ประมวลผลบนเครื่อง (Client-Only) • ไม่ส่งข้อมูลขึ้นเซิร์ฟเวอร์',

    // Metadata
    targetResolution: 'ความละเอียดเป้าหมาย',
    changeImage: 'เปลี่ยนรูปภาพ',

    // Model Selector
    step1Title: 'ขั้นตอนที่ ๑: เลือกโมเดล AI',
    fastModeTitle: 'Fast Mode (Real-ESRGAN)',
    fastModeBadge: 'ประมวลผลเร็ว • กิน VRAM น้อย',
    fastModeDesc: 'เหมาะสำหรับภาพถ่ายทั่วไป ภาพจาก Social Media ภาพแคปหน้าจอ และงานกราฟิก',
    photoModeTitle: 'Photo Mode (Real-HAT-GAN)',
    photoModeBadge: 'ความคมชัดสูง • ลายละเอียดพรีเมียม',
    photoModeDesc: 'เน้นความสมจริงของพื้นผิว รายละเอียดเส้นผม สกินโทน และภาพถ่ายกล้องความละเอียดสูง',
    downloadNotice: 'จะดาวน์โหลดโมเดลเข้าเครื่องเพียงครั้งแรก และบันทึกในเครื่องทันที',

    // Parameters
    step2Title: 'ขั้นตอนที่ ๒: ปรับแต่งค่าพารามิเตอร์',
    scaleFactor: 'อัตราการขยายภาพ',
    scale2x: '๒× Scale (ขนาดกะทัดรัด)',
    scale4x: '๔× Scale (Ultra HD สูงสุด)',
    sharpnessLabel: 'ความคมชัดและเส้นขอบ',
    sharpnessSoft: 'นุ่มนวลเป็นธรรมชาติ',
    sharpnessBalanced: 'สมดุล (๕๐%)',
    sharpnessCrisp: 'คมกริบชัดเจน',
    advancedTilingToggle: 'การตั้งค่า Tiling และฮาร์ดแวร์ขั้นสูง',
    tileSizeLabel: 'ขนาดบล็อกประมวลผล (Tile Size)',
    autoAdaptive: 'ปรับอัตโนมัติตามการ์ดจอ',
    overlapLabel: 'ระยะซ้อนทับขอบ (Overlap Seam)',
    overlapHint: 'ผสานรอยต่อด้วยเทคนิค Raised-Cosine 2D เพื่อขจัดรอยตัดระหว่างบล็อก 100%',

    // Action
    privacyPromise: 'ภาพของคุณจะไม่ถูกส่งไปยังเซิร์ฟเวอร์ใดๆ ประมวลผลบน GPU เครื่องนี้เท่านั้น',
    startUpscaleBtn: 'เริ่มขยายภาพ',

    // Progress
    processingWebGPU: 'กำลังประมวลผลบน GPU ในเครื่อง...',
    upscaleComplete: 'ขยายความละเอียดสำเร็จเรียบร้อย',
    processingHalted: 'การประมวลผลหยุดชะงัก',
    realWebGPUActive: '⚡ Real WebGPU AI (การ์ดจอ)',
    realWasmActive: '🧠 Real ONNX (WASM CPU)',
    simulatedActive: '⚠️ Simulated Fallback',

    // Comparison & Download
    comparisonTitle: 'เปรียบเทียบผลลัพธ์',
    originalLabel: 'ภาพต้นฉบับ',
    upscaledLabel: 'ภาพขยาย Super-Resolution',
    sliderInstruction: 'ลากแถบเลื่อนเพื่อเปรียบเทียบก่อนและหลัง',
    downloadTitle: 'บันทึกภาพผลลัพธ์',
    downloadPng: 'ดาวน์โหลด PNG (คมชัดสูงสุด)',
    downloadWebp: 'ดาวน์โหลด WebP',
    downloadJpg: 'ดาวน์โหลด JPEG',
    upscaleAnother: 'ขยายภาพอื่นเพิ่ม',

    // WebGPU Banner
    webgpuActiveTitle: 'WebGPU Hardware Acceleration พร้อมใช้งาน',
    webgpuActiveDesc: 'ระบบตรวจพบการ์ดจอของคุณและจะใช้โครงข่ายประสาทเทียมรันแบบเต็มประสิทธิภาพ',
    webgpuInactiveTitle: 'WebGPU Hardware Acceleration ยังไม่เปิดใช้งาน',
    webgpuInactiveDesc: 'ระบบจะสลับไปใช้ CPU Fallback แทน เพื่อประสิทธิภาพสูงสุด แนะนำเปิด WebGPU ใน Chrome 113+',
    recheckBtn: 'ตรวจเช็คใหม่',
    howToEnableBtn: 'วิธีเปิดใช้งาน',

    // Footer
    footerDesc: 'เว็บแอปพลิเคชันขยายภาพ Super-Resolution 4× ฟรี 100% ประมวลผลในเบราว์เซอร์ด้วย WebGPU และ ONNX Runtime Web ปลอดภัยสูงสุด รูปภาพของคุณไม่หลุดออกจากเครื่อง',
    footerTech: 'เทคโนโลยี',
    footerLegal: 'ความเป็นส่วนตัวและข้อกำหนด',
    privacyPolicy: 'นโยบายความเป็นส่วนตัว (Client-Only)',
    termsOfService: 'ข้อกำหนดการใช้งาน',
    verifyDevTools: 'วิธีตรวจสอบว่าไม่มีการอัปโหลดผ่าน DevTools',
    allRightsReserved: 'สงวนลิขสิทธิ์ พัฒนาเพื่อการประมวลผล AI ในเครื่องเพื่อความเป็นส่วนตัว',
  },
  en: {
    // Header
    brandTitle: 'WebGPU Image Upscaler',
    tagline: '100% Free Client-Side AI Super-Resolution',
    navHowItWorks: 'How it Works',
    navModels: 'AI Models',
    navFaq: 'FAQ',
    navPrivacy: 'Privacy',
    zeroUploadBadge: '100% Client-Side',

    // Hero
    heroTitlePart1: 'Refined Image Super-Resolution',
    heroTitlePart2: 'Directly on Your Local GPU',
    heroSubtitle: 'Upscale and restore your images 2× and 4× with neural networks directly inside your browser. Zero uploads, zero server fees, 100% private and unlimited.',

    // Dropzone
    dropzoneTitle: 'Drop your photograph here, or browse files',
    dropzoneHint: 'Supports PNG, JPEG, WebP up to 30 MB (Max dimensions 4096×4096 px)',
    dropzonePrivacyBadge: 'Client-Only Processing • Images Never Leave Your Machine',

    // Metadata
    targetResolution: 'Target Resolution',
    changeImage: 'Change Image',

    // Model Selector
    step1Title: 'Step 1: Choose Neural Architecture',
    fastModeTitle: 'Fast Mode (Real-ESRGAN)',
    fastModeBadge: 'Fast & Low VRAM',
    fastModeDesc: 'Ideal for snapshots, compressed social media JPEGs, screenshots, and digital artwork.',
    photoModeTitle: 'Photo Mode (Real-HAT-GAN)',
    photoModeBadge: 'High Fidelity 4×',
    photoModeDesc: 'Hybrid Attention Transformer preserving authentic skin texture, hair, nature, and architecture.',
    downloadNotice: 'Weights are cached locally in your browser for instant offline reuse.',

    // Parameters
    step2Title: 'Step 2: Adjust Parameters',
    scaleFactor: 'Upscale Scale Multiplier',
    scale2x: '2× Scale (Compact File)',
    scale4x: '4× Scale (Ultra HD)',
    sharpnessLabel: 'Detail & Edge Sharpness',
    sharpnessSoft: 'Natural Soft',
    sharpnessBalanced: 'Balanced (50%)',
    sharpnessCrisp: 'Crisp Edges',
    advancedTilingToggle: 'Hardware Tiling & Seam Controls',
    tileSizeLabel: 'Tile Partition Size',
    autoAdaptive: 'Auto Adaptive VRAM',
    overlapLabel: 'Seam Overlap Margin',
    overlapHint: 'Overlapping margins blended with 2D raised-cosine windowing eliminate tile seams 100%.',

    // Action
    privacyPromise: 'Your photograph is processed strictly on your GPU and will never be uploaded.',
    startUpscaleBtn: 'Upscale Image',

    // Progress
    processingWebGPU: 'Processing on Local GPU...',
    upscaleComplete: 'Upscaling Complete (Super-Resolution)',
    processingHalted: 'Processing Halted',
    realWebGPUActive: '⚡ Real WebGPU AI (GPU)',
    realWasmActive: '🧠 Real ONNX (WASM CPU)',
    simulatedActive: '⚠️ Simulated Fallback',

    // Comparison & Download
    comparisonTitle: 'Before & After Inspection',
    originalLabel: 'Original Image',
    upscaledLabel: 'Super-Resolution 4×',
    sliderInstruction: 'Drag slider to inspect edge sharpness and restored fidelity',
    downloadTitle: 'Export Enhanced Photograph',
    downloadPng: 'Download PNG (Lossless)',
    downloadWebp: 'Download WebP',
    downloadJpg: 'Download JPEG',
    upscaleAnother: 'Upscale Another Image',

    // WebGPU Banner
    webgpuActiveTitle: 'WebGPU Hardware Acceleration Active',
    webgpuActiveDesc: 'Your GPU was detected and will accelerate real neural network inference.',
    webgpuInactiveTitle: 'WebGPU Hardware Acceleration Unavailable',
    webgpuInactiveDesc: 'Client edge filtering and CPU fallback will be used. For maximum speed, use Chrome 113+ with WebGPU enabled.',
    recheckBtn: 'Re-check',
    howToEnableBtn: 'How to Enable',

    // Footer
    footerDesc: 'A 100% free, browser-native image super-resolution application powered by WebGPU and ONNX Runtime Web. Your photos never leave your device.',
    footerTech: 'Technology',
    footerLegal: 'Privacy & Terms',
    privacyPolicy: 'Privacy Policy (Client-Only)',
    termsOfService: 'Terms of Service',
    verifyDevTools: 'Verify 0-Upload with DevTools',
    allRightsReserved: 'All rights reserved. Engineered for privacy and local client-side AI.',
  },
};
