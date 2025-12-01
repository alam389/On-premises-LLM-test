# API Services Architecture

This directory contains a modular API service architecture following SOLID principles.

## Structure

```
api/
├── types/              # TypeScript type definitions
│   └── index.ts
├── config.ts           # API configuration management
├── client/             # Base API client
│   └── base-client.ts
├── services/           # Feature-specific services
│   ├── chat.service.ts
│   ├── health.service.ts
│   └── index.ts
└── index.ts            # Main export file
```

## Usage

### Basic Usage

```typescript
import { chatService, healthService } from '../api';

// Stream chat
await chatService.streamChat(
  { prompt: 'Hello', model: 'llama2' },
  (chunk) => {
    console.log('Chunk:', chunk.content);
  },
  (error) => {
    console.error('Error:', error);
  }
);

// Check health
const health = await healthService.checkHealth();
```

### Configuration

```typescript
import { setApiConfig } from '../api';

// Change API base URL
setApiConfig({ baseUrl: 'http://localhost:9000' });
```

### Creating New Services

1. Create a new service file in `services/`:
```typescript
import { BaseApiClient } from '../client/base-client';
import { YourType } from '../types';

export class YourService extends BaseApiClient {
  async yourMethod(): Promise<YourType> {
    return this.request<YourType>('/your-endpoint', {
      method: 'GET',
    });
  }
}
```

2. Export it from `services/index.ts`
3. Add to main `api/index.ts` exports

