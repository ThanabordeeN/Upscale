import React, { useState } from 'react';
import { useWebGPU } from './hooks/useWebGPU';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { AdSlot } from './components/layout/AdSlot';
import { UpscalerWorkspace } from './components/upscaler/UpscalerWorkspace';
import { HowItWorks } from './components/content/HowItWorks';
import { ModelComparisonGuide } from './components/content/ModelComparisonGuide';
import { WebGPUCompatibility } from './components/content/WebGPUCompatibility';
import { PrivacyGuarantee } from './components/content/PrivacyGuarantee';
import { FAQSection } from './components/content/FAQSection';
import { AboutSection } from './components/content/AboutSection';
import { TermsAndPrivacyModal } from './components/content/TermsAndPrivacyModal';

export const App: React.FC = () => {
  const webgpu = useWebGPU();
  const [modalState, setModalState] = useState<{ isOpen: boolean; type: 'privacy' | 'terms' }>({
    isOpen: false,
    type: 'privacy',
  });

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-slate-100">
      {/* Top Header */}
      <Header
        webgpuStatus={webgpu}
        onOpenPrivacyModal={() => setModalState({ isOpen: true, type: 'privacy' })}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Primary Interactive Workspace */}
        <UpscalerWorkspace
          webgpuStatus={webgpu}
          onRefreshWebGPU={webgpu.refreshStatus}
        />

        {/* Compliant Ad Slot 1 (strictly below application workspace) */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <AdSlot slotId="after-workspace" format="horizontal" />
        </div>

        {/* Educational Content & Architecture */}
        <HowItWorks />

        {/* Model Guide: Fast (Real-ESRGAN) vs Photo (Real-HAT-GAN) */}
        <ModelComparisonGuide />

        {/* Compliant Ad Slot 2 (between informational sections) */}
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <AdSlot slotId="between-sections" format="horizontal" />
        </div>

        {/* Compatibility Matrix */}
        <WebGPUCompatibility />

        {/* Privacy Guarantee & DevTools Network Audit */}
        <PrivacyGuarantee />

        {/* FAQ Section */}
        <FAQSection />

        {/* Credits and Open Source Citations */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer
        onOpenPrivacyModal={() => setModalState({ isOpen: true, type: 'privacy' })}
        onOpenTermsModal={() => setModalState({ isOpen: true, type: 'terms' })}
      />

      {/* Terms & Privacy Modal */}
      <TermsAndPrivacyModal
        isOpen={modalState.isOpen}
        type={modalState.type}
        onClose={() => setModalState({ ...modalState, isOpen: false })}
      />
    </div>
  );
};
