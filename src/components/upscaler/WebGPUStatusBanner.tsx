import React, { useState } from 'react';
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react';
import { WebGPUStatus } from '../../types';
import { useLanguage } from '../../context/LanguageContext';

interface WebGPUStatusBannerProps {
  status: WebGPUStatus;
  onRefresh?: () => void;
}

export const WebGPUStatusBanner: React.FC<WebGPUStatusBannerProps> = ({ status, onRefresh }) => {
  const { lang } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  if (status.isTesting) {
    return (
      <div className="mb-5 flex items-center gap-2 text-xs text-paper-400">
        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
        <span>{lang === 'th' ? 'กำลังตรวจสอบอุปกรณ์…' : 'Checking device…'}</span>
      </div>
    );
  }

  const title = status.supported
    ? (lang === 'th' ? 'WebGPU พร้อมใช้งาน' : 'WebGPU ready')
    : (lang === 'th' ? 'ใช้ CPU mode' : 'Using CPU mode');

  const detail = status.supported
    ? (status.adapterName || (lang === 'th' ? 'ประมวลผลบน GPU' : 'GPU acceleration'))
    : (lang === 'th' ? 'ONNX Runtime WASM' : 'ONNX Runtime WASM');

  return (
    <div className="mb-5 rounded-2xl bg-paper-900/55 px-4 py-3 ring-1 ring-inset ring-white/10">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2.5">
          <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${status.supported ? 'bg-sage-500' : 'bg-paper-500'}`} />
          <div className="min-w-0">
            <div className="text-xs font-medium text-paper-100">{title}</div>
            <div className="truncate text-[11px] text-paper-500">{detail}</div>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          {onRefresh && !status.supported && (
            <button
              type="button"
              onClick={onRefresh}
              className="flex h-8 w-8 items-center justify-center rounded-full text-paper-400 transition-colors hover:bg-paper-800 hover:text-paper-100"
              aria-label={lang === 'th' ? 'ตรวจสอบใหม่' : 'Re-check'}
              title={lang === 'th' ? 'ตรวจสอบใหม่' : 'Re-check'}
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          )}

          {(status.errorMessage || status.supported) && (
            <button
              type="button"
              onClick={() => setIsExpanded((value) => !value)}
              className="flex h-8 items-center gap-1 rounded-full px-2 text-[11px] text-paper-400 transition-colors hover:bg-paper-800 hover:text-paper-100"
            >
              <span>{lang === 'th' ? 'รายละเอียด' : 'Details'}</span>
              {isExpanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 border-t border-white/10 pt-3 text-[11px] leading-relaxed text-paper-400">
          {status.supported ? (
            <div className="grid gap-1 sm:grid-cols-2">
              <span>GPU: {status.adapterName || 'Detected'}</span>
              {status.maxBufferSizeMB ? <span>Buffer: {status.maxBufferSizeMB} MB</span> : null}
            </div>
          ) : (
            <span>{status.errorMessage || (lang === 'th' ? 'WebGPU ไม่พร้อมใช้งาน ระบบใช้ CPU แทน' : 'WebGPU is unavailable. CPU fallback is active.')}</span>
          )}
        </div>
      )}
    </div>
  );
};
