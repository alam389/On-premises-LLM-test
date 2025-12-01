// Export all services
export * from './services';

// Export types
export * from './types';

// Export config
export * from './config';

// Create singleton instances (optional)
import { ChatService } from './services/chat.service';
import { HealthService } from './services/health.service';

export const chatService = new ChatService();
export const healthService = new HealthService();

