import { BaseApiClient } from '../client/base-client';
import { ChatRequest, StreamChunk, ChatResponse } from '../types';

export class ChatService extends BaseApiClient {
  async streamChat(
    request: ChatRequest,
    onChunk: (chunk: StreamChunk) => void,
    onError?: (error: any) => void
  ): Promise<void> {
    return this.streamRequest(
      '/api/v1/chat/stream',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
      onChunk,
      onError
    );
  }

  async chat(request: ChatRequest): Promise<ChatResponse> {
    // For non-streaming chat (if you add this endpoint later)
    return this.request<ChatResponse>('/api/v1/chat', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }
}

