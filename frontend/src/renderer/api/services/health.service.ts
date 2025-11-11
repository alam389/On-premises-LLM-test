import { BaseApiClient } from '../client/base-client';
import { HealthResponse } from '../types';

export class HealthService extends BaseApiClient {
  async checkHealth(): Promise<HealthResponse> {
    return this.request<HealthResponse>('/health', {
      method: 'GET',
    });
  }
}

