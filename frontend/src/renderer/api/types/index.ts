// API Configuration
export interface ApiConfig {
  baseUrl: string;
  timeout?: number;
}

// Chat API Types
export interface ChatRequest {
  prompt: string;
  model: string;
}

export interface StreamChunk {
  content?: string;
  done?: boolean;
  error?: string;
}

export interface ChatResponse {
  content: string;
  done: boolean;
}

// Health API Types
export interface HealthResponse {
  status: string;
}

// Error Types
export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

