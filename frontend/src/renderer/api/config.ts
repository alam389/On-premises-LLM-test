import { ApiConfig } from './types';

export type { ApiConfig };

const DEFAULT_CONFIG: ApiConfig = {
  baseUrl: 'http://localhost:8000',
  timeout: 30000,
};

let apiConfig: ApiConfig = { ...DEFAULT_CONFIG };

export const getApiConfig = (): ApiConfig => {
  return { ...apiConfig };
};

export const setApiConfig = (config: Partial<ApiConfig>): void => {
  apiConfig = { ...apiConfig, ...config };
};

export const resetApiConfig = (): void => {
  apiConfig = { ...DEFAULT_CONFIG };
};

