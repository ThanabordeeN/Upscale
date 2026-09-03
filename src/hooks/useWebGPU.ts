import { useState, useEffect } from 'react';
import { WebGPUStatus } from '../types';
import { detectWebGPU } from '../services/webgpuDetector';

export function useWebGPU() {
  const [status, setStatus] = useState<WebGPUStatus>({
    supported: false,
    adapterName: null,
    vendor: null,
    architecture: null,
    maxTextureDimension2D: null,
    maxBufferSizeMB: null,
    errorMessage: null,
    isTesting: true,
  });

  const checkSupport = async () => {
    setStatus((prev) => ({ ...prev, isTesting: true }));
    const res = await detectWebGPU();
    setStatus(res);
  };

  useEffect(() => {
    checkSupport();
  }, []);

  return {
    ...status,
    refreshStatus: checkSupport,
  };
}
