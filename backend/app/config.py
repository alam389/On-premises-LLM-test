# Minimal configuration
import os

OLLAMA_BASE_URL = "http://localhost:11434"

# ChromaDB configuration
CHROMA_HOST = os.getenv("CHROMA_HOST", "localhost")
CHROMA_PORT = int(os.getenv("CHROMA_PORT", "8001"))
