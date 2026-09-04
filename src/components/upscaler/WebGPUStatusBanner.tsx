import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw, Sparkles, Copy, Check, Zap } from 'lucide-react';
import { WebGPUStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WebGPUStatusBannerProps {
  status: WebGPUStatus;
  onRefresh?: () => void;
}

export const WebGPUStatusBanner: React.FC<WebGPUStatusBannerProps> = ({ status, onRefresh }) => {
  const { lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);
  const [copied, setCopied] = useState(false);

  const linuxChromeCommand = 'google-chrome --enable-features=Vulkan --enable-unsafe-webgpu';

  const handleCopy = () => {
    navigator.clipboard.writeText(linuxChromeCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (status.isTesting) {
    return (
      <div className="mb-5 flex items-center gap-2 text-xs text-paper-400">
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        <span>{lang === 'th' ? 'กำลังตรวจสอบอุปกรณ์…' : 'Checking device…'}</span>
      </div>
    );
  }

  const title = status.supported
    ? (lang === 'th' ? '⚡ ประมวลผลด้วย GPU (ความเร็วสูงสุด)' : '⚡ GPU Accelerated (Ultra Fast)')
    : (lang === 'th' ? '🛡️ ประมวลผลบนอุปกรณ์ของคุณ (ส่วนตัว 100%)' : '🛡️ On-Device Processing (100% Private)');

  const detail = status.supported
    ? (status.adapterName || (lang === 'th' ? 'พร้อมใช้งานเต็มประสิทธิภาพ' : 'Hardware accelerated'))
    : (lang === 'th' ? 'ระบบปรับการทำงานอัตโนมัติให้เสร็จไวในไม่กี่วินาที' : 'Auto-optimized to complete in seconds');

  return (
    <div className="mb-5 space-y-2.5">
      <div className={`rounded-2xl px-4 py-3 ring-1 ring-inset ${
        status.supported
          ? 'bg-paper-900/55 ring-white/10'
          : 'bg-paper-900/40 ring-white/10'
      }`}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex min-w-0 items-center gap-2.5">
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.supported ? 'bg-sage-500' : 'bg-terracotta-400'}`} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-paper-100">{title}</span>
                <span className="rounded-full bg-paper-800/80 px-2 py-0.5 text-[10px] font-medium text-paper-300">
                  {status.supported ? 'WebGPU' : 'Auto'}
                </span>
              </div>
              <div className="truncate text-[11px] text-paper-400">{detail}</div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className="flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] text-paper-400 transition-colors hover:bg-paper-800 hover:text-paper-100"
            >
              <span>{lang === 'th' ? 'ข้อมูลระบบ' : 'System info'}</span>
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-paper-300 space-y-2">
            {status.supported ? (
              <div className="grid gap-1 sm:grid-cols-2 text-paper-400">
                <span>GPU: {status.adapterName || 'Detected'}</span>
                {status.maxBufferSizeMB ? <span>Buffer: {status.maxBufferSizeMB} MB</span> : null}
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-amber-200">
                  {lang === 'th'
                    ? '⚠️ ปัจจุบันเบราว์เซอร์ทำงานบน CPU จึงใช้เวลาประมวลผลนาน (1–10+ นาที) หากคุณมีการ์ดจอ (เช่น AMD Radeon, NVIDIA, Intel Arc) สามารถเปิดใช้งาน WebGPU เพื่อให้ประมวลผลเสร็จใน 5–15 วินาที:'
                    : '⚠️ Currently running on CPU via WASM (1–10+ mins). If your system has a dedicated/integrated GPU, you can enable WebGPU to finish in 5–15 seconds:'}
                </p>

                <div className="rounded-xl bg-paper-950/80 p-3 ring-1 ring-white/10 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-paper-400">
                    <span>{lang === 'th' ? 'เปิด Chrome ด้วยคำสั่ง Terminal (Linux):' : 'Launch Chrome via Terminal (Linux):'}</span>
                    <button
                      type="button"
                      onClick={handleCopy}
                      className="flex items-center gap-1 rounded bg-paper-800 px-2 py-0.5 text-[10px] text-paper-300 hover:bg-paper-700 hover:text-white"
                    >
                      {copied ? <Check className="h-3 w-3 text-sage-400" /> : <Copy className="h-3 w-3" />}
                      <span>{copied ? (lang === 'th' ? 'คัดลอกแล้ว' : 'Copied!') : (lang === 'th' ? 'คัดลอก' : 'Copy')}</span>
                    </button>
                  </div>
                  <pre className="overflow-x-auto rounded bg-black/40 p-2 font-mono text-[10px] text-terracotta-300">
                    {linuxChromeCommand}
                  </pre>
                  <p className="text-[10px] text-paper-500">
                    {lang === 'th'
                      ? 'หรือพิมพ์ chrome://flags/#enable-unsafe-webgpu ในเบราว์เซอร์ แล้วเลือก Enabled จากนั้น Relaunch'
                      : 'Or visit chrome://flags/#enable-unsafe-webgpu, set to Enabled, and Relaunch.'}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
