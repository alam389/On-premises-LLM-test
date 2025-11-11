# Ollama Microservice

A minimal FastAPI microservice for interacting with Ollama.

## Project Structure

```
├── backend/          # FastAPI backend service
│   ├── app/          # Application code
│   └── requirements.txt
└── frontend/         # Electron frontend application (TypeScript)
    ├── src/
    │   ├── main/     # Main process (TypeScript)
    │   ├── preload/  # Preload scripts (TypeScript)
    │   ├── renderer/ # Renderer process (UI)
    │   │   ├── index.html
    │   │   ├── api/  # Renderer scripts (TypeScript)
    │   │   └── styles/
    │   └── types/    # TypeScript type definitions
    ├── dist/         # Compiled JavaScript (generated)
    ├── tsconfig.json # TypeScript configuration
    └── package.json  # Node.js dependencies
```

## Setup

### Backend Setup

1. Install Python dependencies:
```bash
cd backend
pip install -r requirements.txt
```

2. Ensure Ollama is running on `http://localhost:11434`

3. Run the backend service:
```bash
cd backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Install Node.js dependencies:
```bash
cd frontend
npm install
```

2. Build and run the Electron app:
```bash
npm start
```

The build process will:
- Compile TypeScript to JavaScript
- Copy HTML/CSS assets to the dist folder
- Launch the Electron application

**Note:** Make sure the backend is running before starting the frontend.

**Development:** Use `npm run watch` to watch for TypeScript changes and rebuild automatically.

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

