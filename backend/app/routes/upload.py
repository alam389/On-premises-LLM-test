from fastapi import APIRouter, File, UploadFile, Form, Body, Query
from typing import Optional, List
import base64
from app.services.embedding_service import embed_text
from app.models.upload import UploadVectorRequest
from app.config import CHROMA_HOST, CHROMA_PORT
import chromadb
import uuid

router = APIRouter()

client = chromadb.HttpClient(host=CHROMA_HOST, port=CHROMA_PORT)

@router.post("/api/v1/upload/file")
async def upload_file(
    file: UploadFile = File(...),
    # Optional: Add any additional form fields here
    # description: Optional[str] = Form(None)
):
    """Upload a file endpoint."""
    # Read file contents
    contents = await file.read()
    
    # Encode binary to base64 for display
    binary_base64 = base64.b64encode(contents).decode('utf-8')
    
    # Show first 100 bytes as hex for preview
    hex_preview = contents[:100].hex() if len(contents) > 0 else ""
    
    return {
        "filename": file.filename,
        "content_type": file.content_type,
        "size": len(contents),
        "binary_base64": binary_base64,
        "binary_hex_preview": hex_preview,
        "first_bytes": list(contents[:20]) if len(contents) > 0 else [],
        "message": "File uploaded successfully"
    }

@router.post("/api/v1/upload/vector")
async def upload_vector(
    request: UploadVectorRequest = Body(...),
    collection_name: str = Query(default="default", description="ChromaDB collection name")
):
    """Generate embedding vector for text and store it in ChromaDB."""
    try:
        # Generate embedding
        embedding = embed_text(request.prompt, request.model)
        
        # Validate embedding was generated
        if not embedding or len(embedding) == 0:
            return {"error": "Failed to generate embedding or embedding is empty"}
        
        # Generate unique ID for the vector
        vector_id = str(uuid.uuid4())
        
        # Get or create collection
        collection = client.get_or_create_collection(name=collection_name)
        
        # Add to collection (embeddings must be a list of lists)
        collection.add(
            embeddings=[embedding],  # List of embeddings
            metadatas=[{"prompt": request.prompt, "model": request.model}],
            ids=[vector_id]
        )
        
        return {
            "id": vector_id,
            "embedding_dimension": len(embedding),
            "embedding": embedding,
            "model": request.model,
            "collection": collection_name,
            "message": "Vector stored successfully"
        }
    except Exception as e:
        return {"error": str(e)}

@router.get("/api/v1/upload/vector")
async def get_vector(
    collection_name: str = Query(..., description="ChromaDB collection name"),
    id: str = Query(..., description="Vector ID to retrieve"),
    include_embeddings: bool = Query(default=True, description="Include embeddings in response")
):
    """Get a vector from a collection."""
    try:
        collection = client.get_collection(name=collection_name)
        include = ["metadatas", "documents"]
        if include_embeddings:
            include.append("embeddings")
        result = collection.get(ids=[id], include=include)
        return result
    except Exception as e:
        return {"error": str(e)}