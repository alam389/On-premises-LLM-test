from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from app.models.chat import ChatRequest
from app.services.ollama_service import chat_stream, chat
import json

router = APIRouter()


@router.post("/api/v1/chat/stream")
async def chat_stream_endpoint(request: ChatRequest):
    """Stream chat completion from Ollama."""
    
    async def generate():
        async for chunk in chat_stream(request.prompt, request.model):
            if "error" in chunk:
                yield f"data: {json.dumps(chunk)}\n\n"
                break
            if "response" in chunk:
                yield f"data: {json.dumps({'content': chunk['response']})}\n\n"
            if chunk.get("done", False):
                yield f"data: {json.dumps({'done': True})}\n\n"
                break
    
    return StreamingResponse(generate(), media_type="text/event-stream")

@router.post("/api/v1/chat")
async def chat_endpoint(request: ChatRequest):
    # chat() is synchronous, FastAPI will run it in a thread pool
    result = chat(request.prompt, request.model)
    return result