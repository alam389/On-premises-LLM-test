import ollama


async def chat_stream(prompt: str, model: str):
    """Stream chat completion from Ollama API using the Ollama library."""
    try:
        # ollama.chat() with stream=True returns a generator
        stream = ollama.chat(
            model=model,
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )
        
        # Yield chunks from the stream
        for chunk in stream:
            # Ollama library returns chunks with 'message' key containing 'content'
            if "message" in chunk and "content" in chunk["message"]:
                yield {"response": chunk["message"]["content"]}
            elif "done" in chunk and chunk["done"]:
                yield {"done": True}
            elif "error" in chunk:
                yield {"error": chunk["error"]}
                break
    except Exception as e:
        yield {"error": str(e)}

def chat(prompt: str, model: str):
    """Non-streaming chat completion from Ollama API."""
    try:
        response = ollama.chat(model=model, messages=[{"role": "user", "content": prompt}])
        return {"response": response["message"]["content"]}
    except Exception as e:
        return {"error": str(e)}