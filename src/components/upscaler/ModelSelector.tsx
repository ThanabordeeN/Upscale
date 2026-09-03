import React from 'react';
import { Camera, Zap } from 'lucide-react';
import { ModelMode } from '../../types';
import { AVAILABLE_MODELS } from '../../config/models';
import { useLanguage } from '../../context/LanguageContext';

interface ModelSelectorProps {
  currentMode: ModelMode;
  onSelectMode: (mode: ModelMode) => void;
  isCached: boolean;
  isCheckingCache: boolean;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  currentMode,
  onSelectMode,
  isCached,
  isCheckingCache,
  disabled = false,
}) => {
  const { t, lang } = useLanguage();
  const models = Object.values(AVAILABLE_MODELS);

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between px-0.5">
        <span className="text-xs font-medium text-paper-300">{t.step1Title}</span>
        <span className="text-[11px] text-paper-500">
          {isCheckingCache
            ? (lang === 'th' ? 'กำลังตรวจสอบ…' : 'Checking…')
            : isCached
              ? (lang === 'th' ? 'พร้อมใช้งาน' : 'Ready')
              : (lang === 'th' ? 'ดาวน์โหลดครั้งแรก' : 'Downloads once')}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 rounded-[20px] bg-paper-900/55 p-1.5 ring-1 ring-inset ring-white/10">
        {models.map((model) => {
          const isSelected = currentMode === model.id;
          const isFast = model.id === 'fast';
          const title = isFast ? t.fastModeTitle : t.photoModeTitle;

          return (
            <button
              key={model.id}
              type="button"
              disabled={disabled}
              onClick={() => onSelectMode(model.id)}
              className={`flex min-h-[74px] items-center gap-3 rounded-2xl px-4 text-left transition-all ${
                isSelected
                  ? 'bg-paper-50 text-paper-950 shadow-sm'
                  : 'text-paper-300 hover:bg-paper-800/70 hover:text-paper-50'
              } ${disabled ? 'cursor-not-allowed opacity-50' : ''}`}
            >
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${isSelected ? 'bg-paper-200' : 'bg-paper-800'}`}>
                {isFast ? <Zap className="h-4 w-4" /> : <Camera className="h-4 w-4" />}
              </span>
              <span className="min-w-0">
                <span className="block truncate text-sm font-semibold tracking-tight">{title}</span>
                <span className={`mt-0.5 block truncate text-[11px] ${isSelected ? 'text-paper-600' : 'text-paper-500'}`}>
                  {isFast
                    ? (lang === 'th' ? 'เร็ว · ใช้หน่วยความจำน้อย' : 'Fast · lower memory')
                    : (lang === 'th' ? 'ภาพถ่าย · รายละเอียดสูง' : 'Photo · high detail')}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
