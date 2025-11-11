# Ollama Microservice

A minimal FastAPI microservice for interacting with Ollama.

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Ensure Ollama is running on `http://localhost:11434`

3. Run the service:
```bash
uvicorn app.main:app --reload
```

## Usage

### Health Check
```bash
curl http://localhost:8000/health
```

### Stream Chat Completion
```bash
curl -X POST http://localhost:8000/api/v1/chat/stream \
  -H "Content-Type: application/json" \
  -d '{"prompt": "Hello, how are you?", "model": "llama2"}'
```

