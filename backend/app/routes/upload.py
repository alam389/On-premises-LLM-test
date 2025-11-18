from fastapi import APIRouter, File, UploadFile, Form, Body
import base64
from app.services.embedding_service import embed_text
from app.models.upload import UploadVectorRequest

router = APIRouter()

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
    request: UploadVectorRequest = Body(...)
):
    """Generate embedding vector for text."""
    try:
        embedding = embed_text(request.prompt, request.model)
        return {
            "embedding": embedding,
            "embedding_dimension": len(embedding),
            "model": request.model,
            "message": "Embedding generated successfully"
        }
    except Exception as e:
        return {"error": str(e)}
