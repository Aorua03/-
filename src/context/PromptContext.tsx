import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { initialModules, PromptModule } from '../data/prompts';

export interface ChainConfig {
  [moduleId: string]: string; // moduleId -> versionId
}

export interface ModelConfig {
  asr: string;
  llm: string;
  tts: string;
  voice: string;
  rtc: string;
}

interface PromptContextType {
  modules: PromptModule[];
  setModules: React.Dispatch<React.SetStateAction<PromptModule[]>>;
  chainConfig: ChainConfig;
  setChainConfig: React.Dispatch<React.SetStateAction<ChainConfig>>;
  modelConfig: ModelConfig;
  setModelConfig: React.Dispatch<React.SetStateAction<ModelConfig>>;
}

export const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
  const [modules, setModules] = useState<PromptModule[]>(() => {
    const saved = localStorage.getItem('app_modules');
    return saved ? JSON.parse(saved) : initialModules;
  });

  const [chainConfig, setChainConfig] = useState<ChainConfig>(() => {
    const saved = localStorage.getItem('app_chain_config');
    if (saved) return JSON.parse(saved);
    // default to first version of each module
    const defaultChain: ChainConfig = {};
    initialModules.forEach((m: PromptModule) => {
      if (m.versions.length > 0) {
        defaultChain[m.id] = m.versions[0].id;
      }
    });
    return defaultChain;
  });

  const [modelConfig, setModelConfig] = useState<ModelConfig>(() => {
    const saved = localStorage.getItem('app_model_config');
    if (saved) return JSON.parse(saved);
    return {
      asr: 'asr-basic',
      llm: 'llm-basic',
      tts: 'tts-basic',
      voice: 'voice-peach',
      rtc: 'rtc-basic',
    };
  });

  useEffect(() => {
    localStorage.setItem('app_modules', JSON.stringify(modules));
  }, [modules]);

  useEffect(() => {
    localStorage.setItem('app_chain_config', JSON.stringify(chainConfig));
  }, [chainConfig]);

  useEffect(() => {
    localStorage.setItem('app_model_config', JSON.stringify(modelConfig));
  }, [modelConfig]);

  return (
    <PromptContext.Provider value={{ modules, setModules, chainConfig, setChainConfig, modelConfig, setModelConfig }}>
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompts() {
  const context = useContext(PromptContext);
  if (!context) throw new Error('usePrompts must be used within PromptProvider');
  return context;
}
