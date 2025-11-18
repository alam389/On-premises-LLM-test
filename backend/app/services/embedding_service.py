import ollama
from typing import List

def embed_text(text: str, model: str) -> List[float]:
    """
    Generate embedding vector for text using Ollama.
    
    Args:
        text: The text to embed
        model: The embedding model name (e.g., 'nomic-embed-text')
    
    Returns:
        List of floats representing the embedding vector
    """
    try:
        response = ollama.embeddings(model=model, prompt=text)
        # Ollama returns: {"embedding": [0.1, 0.2, ...]}
        return response.get("embedding", [])
    except Exception as e:
        raise Exception(f"Embedding generation failed: {str(e)}")
