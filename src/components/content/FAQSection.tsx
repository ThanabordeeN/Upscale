import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQSection: React.FC = () => {
  const faqs: FAQItem[] = [
    {
      question: 'Is this really 100% free with no credits or quotas?',
      answer:
        'Yes, completely free! Cloud-based upscalers charge subscriptions because running remote clusters of enterprise GPUs costs thousands of dollars a month. Because our engine runs entirely on your own device using WebGPU, our server cost is essentially $0. We only need small non-intrusive web ads to cover static asset hosting and CDN bandwidth.',
    },
    {
      question: 'Are my images uploaded or stored on any server?',
      answer:
        'Never. Your images are loaded into your browser memory via the HTML5 File API and processed locally by ONNX Runtime Web. At no point do pixel bytes, thumbnails, or metadata leave your computer.',
    },
    {
      question: 'How do you prevent visible tile seams or grid lines?',
      answer:
        'We use an overlapping tiling engine with a 16-pixel border margin combined with 2D raised-cosine window feathering. The overlapping boundaries are mathematically blended in an accumulation buffer, ensuring perfectly seamless color and detail transitions.',
    },
    {
      question: 'What happens if my GPU runs out of VRAM (Out of Memory)?',
      answer:
        'Our engine features automatic adaptive downgrade. If your GPU hits a memory allocation ceiling with a 512px tile, it automatically scales down to 256px or 128px tiles and resumes without reloading the page or crashing your browser tab.',
    },
    {
      question: 'Real-ESRGAN vs Real-HAT-GAN: which should I use?',
      answer:
        'Choose Fast Mode (Real-ESRGAN) for quick results, everyday snapshots, compressed social media images, and digital artwork. Choose Photo Mode (Real-HAT-GAN) for high-resolution photography where preserving subtle natural textures (skin, hair, fabric, architecture) is critical.',
    },
    {
      question: 'Does this work on mobile phones or tablets?',
      answer:
        'Yes! On mobile devices with modern WebGPU support (such as Chrome on newer Android phones or Safari on iOS 17+ with the WebGPU flag enabled), you can upscale images directly on your mobile GPU.',
    },
  ];

  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="w-full max-w-5xl mx-auto px-4 py-12 sm:px-6">
      <div className="border-t border-slate-800/80 pt-12">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="rounded-full bg-teal-500/10 px-3 py-1 text-xs font-semibold text-teal-400 border border-teal-500/20">
            Got Questions?
          </span>
          <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Everything you need to know about browser-based WebGPU AI upscaling and privacy.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;

            return (
              <div
                key={idx}
                className="rounded-2xl border border-slate-800 bg-slate-900/40 overflow-hidden transition-all"
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-semibold text-slate-100 hover:text-teal-300 transition-colors"
                >
                  <span>{faq.question}</span>
                  {isOpen ? (
                    <ChevronUp className="h-4 w-4 text-teal-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="border-t border-slate-800/60 p-5 pt-3 text-xs sm:text-sm text-slate-400 leading-relaxed bg-slate-950/40">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
