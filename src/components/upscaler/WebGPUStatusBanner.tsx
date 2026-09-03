import React, { useState } from 'react';
import { ShieldAlert, CheckCircle2, ChevronDown, ChevronUp, RefreshCw, Info } from 'lucide-react';
import { WebGPUStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WebGPUStatusBannerProps {
  status: WebGPUStatus;
  onRefresh?: () => void;
}

export const WebGPUStatusBanner: React.FC<WebGPUStatusBannerProps> = ({ status, onRefresh }) => {
  const { t, lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (status.isTesting) {
    return (
      <div className="mb-6 flex items-center justify-center space-x-2 rounded-2xl border border-paper-800 bg-paper-900/60 p-3.5 text-sm text-paper-400">
        <RefreshCw className="h-4 w-4 animate-spin text-terracotta-400" />
        <span>{lang === 'th' ? 'กำลังตรวจสอบความพร้อมของการ์ดจอ (WebGPU)...' : 'Probing WebGPU hardware capabilities...'}</span>
      </div>
    );
  }

  if (status.supported) {
    return (
      <div className="mb-6 rounded-2xl border border-sage-500/25 bg-sage-500/10 p-4 transition-all">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center space-x-3.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-sage-500/20 text-sage-400">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-serif font-medium text-sage-300 text-sm sm:text-base">
                  {t.webgpuActiveTitle}
                </span>
                <span className="rounded-full bg-sage-500/20 px-2.5 py-0.5 text-[10px] font-mono text-sage-300">
                  {status.adapterName || 'Direct GPU'}
                </span>
              </div>
              <p className="text-xs text-paper-400 mt-0.5">
                {t.webgpuActiveDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-xs text-sage-400 hover:text-sage-300 self-start sm:self-center"
          >
            <span>{isExpanded ? (lang === 'th' ? 'ซ่อนสเปค' : 'Hide Specs') : (lang === 'th' ? 'ดูสเปค GPU' : 'View Specs')}</span>
            {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
          </button>
        </div>

        {isExpanded && (
          <div className="mt-3.5 grid grid-cols-2 gap-3 border-t border-sage-500/20 pt-3 text-xs sm:grid-cols-4">
            <div>
              <span className="text-paper-500 block">Adapter:</span>
              <span className="font-mono text-paper-200">{status.adapterName || 'Generic'}</span>
            </div>
            <div>
              <span className="text-paper-500 block">Vendor:</span>
              <span className="font-mono text-paper-200">{status.vendor || 'Detected'}</span>
            </div>
            <div>
              <span className="text-paper-500 block">Max 2D Texture:</span>
              <span className="font-mono text-paper-200">
                {status.maxTextureDimension2D ? `${status.maxTextureDimension2D.toLocaleString()}px` : 'Standard'}
              </span>
            </div>
            <div>
              <span className="text-paper-500 block">Max Buffer:</span>
              <span className="font-mono text-paper-200">
                {status.maxBufferSizeMB ? `${status.maxBufferSizeMB} MB` : 'Standard'}
              </span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Fallback status banner
  return (
    <div className="mb-6 rounded-2xl border border-paper-800 bg-paper-900/60 p-4 text-paper-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-start space-x-3.5">
          <div className="mt-0.5 flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl bg-paper-850 text-terracotta-400 border border-paper-800">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-serif font-medium text-paper-100 text-sm sm:text-base">
              {t.webgpuInactiveTitle}
            </h4>
            <p className="mt-0.5 text-xs text-paper-400 leading-relaxed max-w-2xl">
              {t.webgpuInactiveDesc}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {onRefresh && (
            <button
              onClick={onRefresh}
              className="rounded-xl border border-paper-800 bg-paper-850 px-3 py-1.5 text-xs font-medium text-paper-300 hover:bg-paper-800 transition-colors flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              {t.recheckBtn}
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded-xl border border-terracotta-500/30 bg-terracotta-500/10 px-3 py-1.5 text-xs font-medium text-terracotta-300 hover:bg-terracotta-500/20 transition-colors flex items-center gap-1.5"
          >
            <Info className="w-3.5 h-3.5" />
            {isExpanded ? (lang === 'th' ? 'ซ่อนคำแนะนำ' : 'Hide Help') : t.howToEnableBtn}
          </button>
        </div>
      </div>

      {status.errorMessage && (
        <div className="mt-2 text-[11px] font-mono text-terracotta-300/90 bg-paper-950/60 rounded-lg px-3 py-1 border border-paper-800">
          Reason: {status.errorMessage}
        </div>
      )}

      {isExpanded && (
        <div className="mt-4 border-t border-paper-800 pt-3.5 text-xs text-paper-300 space-y-3">
          <p className="font-serif font-medium text-paper-100">
            {lang === 'th' ? 'วิธีเปิดใช้งาน WebGPU เพื่อให้ AI รันบนการ์ดจอได้เต็มประสิทธิภาพ:' : 'How to enable WebGPU on your browser:'}
          </p>

          <div className="rounded-xl bg-paper-950/80 p-3.5 border border-paper-800 space-y-2">
            <span className="font-semibold text-terracotta-400 block text-xs uppercase tracking-wide">
              🐧 Linux (Chrome / Chromium / Brave / Edge):
            </span>
            <p className="text-paper-400 text-xs">
              {lang === 'th'
                ? 'บน Linux เบราว์เซอร์จะปิด WebGPU ไว้เริ่มต้น คุณสามารถเปิดใช้งานได้ใน 30 วินาที:'
                : 'WebGPU is disabled by default on Linux. You can enable it easily:'}
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-paper-300 text-xs">
              <li>
                {lang === 'th' ? 'พิมพ์ในช่อง Address Bar:' : 'In address bar:'}{' '}
                <code className="bg-paper-900 px-1.5 py-0.5 rounded text-terracotta-300 font-mono select-all">chrome://flags/#enable-unsafe-webgpu</code>{' '}
                {lang === 'th' ? 'แล้วเลือกเป็น Enabled' : 'and set to Enabled'}.
              </li>
              <li>
                {lang === 'th' ? 'พิมพ์:' : 'Type:'}{' '}
                <code className="bg-paper-900 px-1.5 py-0.5 rounded text-terracotta-300 font-mono select-all">chrome://flags/#enable-vulkan</code>{' '}
                {lang === 'th' ? 'แล้วเลือกเป็น Enabled' : 'and set to Enabled'}.
              </li>
              <li>
                {lang === 'th' ? 'กดปุ่มสีฟ้า Relaunch ด้านล่างเพื่อรีสตาร์ทเบราว์เซอร์' : 'Click blue Relaunch button.'}
              </li>
            </ol>
            <p className="text-paper-400 text-[11px] pt-1">
              {lang === 'th' ? 'หรือเปิดเบราว์เซอร์ผ่าน Terminal ด้วยคำสั่ง:' : 'Or launch from terminal with:'}
              <code className="bg-paper-900 px-2 py-1 rounded text-paper-200 font-mono block mt-1 select-all border border-paper-800">
                google-chrome --enable-features=Vulkan --enable-unsafe-webgpu
              </code>
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
            <div className="rounded-xl bg-paper-950/50 p-3 border border-paper-800">
              <strong className="text-paper-100 block mb-1 font-serif">Windows & macOS:</strong>
              <p className="text-paper-400">
                {lang === 'th'
                  ? 'เปิดใช้งานอัตโนมัติบน Chrome 113+ / Edge 113+ หากไม่ขึ้น ให้ตรวจสอบที่ chrome://gpu'
                  : 'Enabled by default in Chrome 113+ / Edge 113+. Check chrome://gpu if unavailable.'}
              </p>
            </div>
            <div className="rounded-xl bg-paper-950/50 p-3 border border-paper-800">
              <strong className="text-paper-100 block mb-1 font-serif">Firefox Nightly:</strong>
              <p className="text-paper-400">
                {lang === 'th'
                  ? 'ไปที่ about:config แล้วปรับ dom.webgpu.enabled ให้เป็น true'
                  : 'Navigate to about:config and set dom.webgpu.enabled to true.'}
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-paper-950/80 p-3 border border-paper-800 text-xs flex items-center justify-between">
            <span className="text-paper-300">
              {lang === 'th' ? 'เมื่อเปลี่ยนค่าแล้ว ให้กดปุ่ม "ตรวจเช็คใหม่" ด้านบน' : 'After updating flags, click "Re-check" above.'}
            </span>
            <button
              onClick={onRefresh}
              className="rounded-lg bg-terracotta-500/20 px-3 py-1 text-xs font-medium text-terracotta-300 hover:bg-terracotta-500/30 transition-colors"
            >
              {t.recheckBtn}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
