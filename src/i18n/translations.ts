export type Language = 'th' | 'en';

export const translations = {
  th: {
    // Header
    brandTitle: 'Upscaler',
    tagline: 'AI บนอุปกรณ์ของคุณ',
    navHowItWorks: 'วิธีทำงาน',
    navModels: 'โมเดล',
    navFaq: 'FAQ',
    navPrivacy: 'ความเป็นส่วนตัว',
    zeroUploadBadge: 'ไม่อัปโหลดรูป',

    // Hero
    heroTitlePart1: 'ขยายภาพให้คมขึ้น',
    heroTitlePart2: 'บนอุปกรณ์ของคุณ',
    heroSubtitle: 'อัปสเกล 2× และ 4× โดยไม่อัปโหลดรูป',

    // Dropzone
    dropzoneTitle: 'เลือกภาพ',
    dropzoneHint: 'หรือลากมาวาง · PNG, JPEG, WebP · สูงสุด 30 MB',
    dropzonePrivacyBadge: 'ประมวลผลบนอุปกรณ์',

    // Metadata
    targetResolution: 'ขนาดผลลัพธ์',
    changeImage: 'เปลี่ยนภาพ',

    // Model Selector
    step1Title: 'โมเดล',
    fastModeTitle: 'Fast',
    fastModeBadge: 'เร็ว',
    fastModeDesc: 'สำหรับภาพทั่วไปและกราฟิก',
    photoModeTitle: 'Photo',
    photoModeBadge: 'รายละเอียดสูง',
    photoModeDesc: 'สำหรับภาพถ่ายและพื้นผิวละเอียด',
    downloadNotice: 'ดาวน์โหลดโมเดลครั้งแรกเท่านั้น',

    // Parameters
    step2Title: 'ปรับแต่ง',
    scaleFactor: 'ขนาด',
    scale2x: '2×',
    scale4x: '4×',
    sharpnessLabel: 'ความคม',
    sharpnessSoft: 'นุ่ม',
    sharpnessBalanced: 'กลาง',
    sharpnessCrisp: 'คม',
    advancedTilingToggle: 'ขั้นสูง',
    tileSizeLabel: 'Tile',
    autoAdaptive: 'Auto',
    overlapLabel: 'Overlap',
    overlapHint: 'ปรับรอยต่อระหว่าง tile',

    // Action
    privacyPromise: 'บนอุปกรณ์ · ไม่อัปโหลดรูป',
    startUpscaleBtn: 'อัปสเกล',

    // Progress
    processingWebGPU: 'กำลังประมวลผล…',
    upscaleComplete: 'เสร็จแล้ว',
    processingHalted: 'หยุดการประมวลผล',
    realWebGPUActive: 'WebGPU',
    realWasmActive: 'CPU',

    // Comparison & Download
    comparisonTitle: 'ก่อน / หลัง',
    originalLabel: 'ต้นฉบับ',
    upscaledLabel: 'ผลลัพธ์',
    sliderInstruction: 'ลากเพื่อเปรียบเทียบ',
    downloadTitle: 'บันทึก',
    downloadPng: 'PNG',
    downloadWebp: 'WebP',
    downloadJpg: 'JPEG',
    upscaleAnother: 'ภาพใหม่',

    // WebGPU Banner
    webgpuActiveTitle: 'WebGPU พร้อมใช้งาน',
    webgpuActiveDesc: 'ประมวลผลบน GPU',
    webgpuInactiveTitle: 'ใช้ CPU mode',
    webgpuInactiveDesc: 'WebGPU ไม่พร้อม ระบบใช้ CPU แทน',
    recheckBtn: 'ตรวจใหม่',
    howToEnableBtn: 'รายละเอียด',

    // Footer
    footerDesc: 'AI upscaling บนอุปกรณ์ของคุณ',
    footerTech: 'เทคโนโลยี',
    footerLegal: 'กฎหมาย',
    privacyPolicy: 'ความเป็นส่วนตัว',
    termsOfService: 'ข้อกำหนด',
    verifyDevTools: 'ตรวจสอบ Network',
    allRightsReserved: 'สงวนลิขสิทธิ์',
  },
  en: {
    // Header
    brandTitle: 'Upscaler',
    tagline: 'AI on your device',
    navHowItWorks: 'How it works',
    navModels: 'Models',
    navFaq: 'FAQ',
    navPrivacy: 'Privacy',
    zeroUploadBadge: 'No uploads',

    // Hero
    heroTitlePart1: 'Upscale your images',
    heroTitlePart2: 'right on your device',
    heroSubtitle: '2× and 4× upscaling. No image upload required.',

    // Dropzone
    dropzoneTitle: 'Choose an image',
    dropzoneHint: 'or drop it here · PNG, JPEG, WebP · up to 30 MB',
    dropzonePrivacyBadge: 'On-device processing',

    // Metadata
    targetResolution: 'Output',
    changeImage: 'Change image',

    // Model Selector
    step1Title: 'Model',
    fastModeTitle: 'Fast',
    fastModeBadge: 'Fast',
    fastModeDesc: 'For everyday images and graphics.',
    photoModeTitle: 'Photo',
    photoModeBadge: 'High detail',
    photoModeDesc: 'For photos and fine textures.',
    downloadNotice: 'Downloads once',

    // Parameters
    step2Title: 'Adjust',
    scaleFactor: 'Scale',
    scale2x: '2×',
    scale4x: '4×',
    sharpnessLabel: 'Sharpness',
    sharpnessSoft: 'Soft',
    sharpnessBalanced: 'Balanced',
    sharpnessCrisp: 'Crisp',
    advancedTilingToggle: 'Advanced',
    tileSizeLabel: 'Tile',
    autoAdaptive: 'Auto',
    overlapLabel: 'Overlap',
    overlapHint: 'Adjust tile seams.',

    // Action
    privacyPromise: 'On-device · No image upload',
    startUpscaleBtn: 'Upscale',

    // Progress
    processingWebGPU: 'Processing…',
    upscaleComplete: 'Done',
    processingHalted: 'Processing stopped',
    realWebGPUActive: 'WebGPU',
    realWasmActive: 'CPU',

    // Comparison & Download
    comparisonTitle: 'Before / After',
    originalLabel: 'Original',
    upscaledLabel: 'Result',
    sliderInstruction: 'Drag to compare',
    downloadTitle: 'Save',
    downloadPng: 'PNG',
    downloadWebp: 'WebP',
    downloadJpg: 'JPEG',
    upscaleAnother: 'New image',

    // WebGPU Banner
    webgpuActiveTitle: 'WebGPU ready',
    webgpuActiveDesc: 'Running on GPU',
    webgpuInactiveTitle: 'Using CPU mode',
    webgpuInactiveDesc: 'WebGPU is unavailable. CPU fallback is active.',
    recheckBtn: 'Re-check',
    howToEnableBtn: 'Details',

    // Footer
    footerDesc: 'AI upscaling on your device.',
    footerTech: 'Technology',
    footerLegal: 'Legal',
    privacyPolicy: 'Privacy',
    termsOfService: 'Terms',
    verifyDevTools: 'Network check',
    allRightsReserved: 'All rights reserved.',
  },
};
