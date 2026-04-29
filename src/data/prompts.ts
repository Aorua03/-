import initialModulesData from './initialModules.json';

export interface PromptVersion {
  id: string;
  name: string;
  content: string;
  updatedAt: number;
}

export interface PromptModule {
  id: string;
  name: string;
  stage: string;
  aiPersona: string;
  coreTask: string;
  versions: PromptVersion[];
}

export const initialModules: PromptModule[] = initialModulesData;
