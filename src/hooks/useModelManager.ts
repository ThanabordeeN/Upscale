import { useState, useEffect, useCallback } from 'react';
import { ModelMode, ModelConfig } from '../types';
import { AVAILABLE_MODELS } from '../config/models';
import { ModelCacheManager } from '../services/modelCache';

export function useModelManager(initialMode: ModelMode = 'fast') {
  const [currentMode, setCurrentMode] = useState<ModelMode>(initialMode);
  const [isCached, setIsCached] = useState<boolean>(false);
  const [isCheckingCache, setIsCheckingCache] = useState<boolean>(true);

  const currentModel: ModelConfig = AVAILABLE_MODELS[currentMode];

  const checkCache = useCallback(async (model: ModelConfig) => {
    setIsCheckingCache(true);
    try {
      const cached = await ModelCacheManager.isModelCached(model);
      setIsCached(cached);
    } catch {
      setIsCached(false);
    } finally {
      setIsCheckingCache(false);
    }
  }, []);

  useEffect(() => {
    checkCache(currentModel);
  }, [currentMode, checkCache, currentModel]);

  const selectMode = (mode: ModelMode) => {
    setCurrentMode(mode);
  };

  return {
    currentMode,
    currentModel,
    isCached,
    isCheckingCache,
    selectMode,
    refreshCacheStatus: () => checkCache(currentModel),
  };
}
