from pydantic import BaseModel


class UploadRequest(BaseModel):
    """Request model for file upload metadata."""
    pass  # Add any additional fields you need here

class UploadVectorRequest(BaseModel):
    model: str
    prompt: str