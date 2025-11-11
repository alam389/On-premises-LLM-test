import httpx
import json
from app.config import OLLAMA_BASE_URL


async def chat_stream(prompt: str, model: str):
    """Stream chat completion from Ollama API."""
    try:
        async with httpx.AsyncClient(timeout=300.0) as client:
            async with client.stream(
                "POST",
                f"{OLLAMA_BASE_URL}/api/generate",
                json={"model": model, "prompt": prompt, "stream": True},
            ) as response:
                response.raise_for_status()
                async for line in response.aiter_lines():
                    if line:
                        try:
                            data = json.loads(line)
                            yield data
                        except json.JSONDecodeError:
                            continue
    except Exception as e:
        yield {"error": str(e)}

