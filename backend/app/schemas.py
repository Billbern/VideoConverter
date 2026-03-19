from pydantic import BaseModel, EmailStr, Field
from datetime import datetime
from typing import Optional

class UserBase(BaseModel):
    email: EmailStr
    username: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserOut(UserBase):
    id: str
    tier: str
    storage_limit: int
    is_verified: bool
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"

class TokenData(BaseModel):
    user_id: Optional[str] = None

class VideoUploadResponse(BaseModel):
    task_id: str
    status: str
    message: str

class VideoOut(BaseModel):
    id: str
    original_filename: str
    file_size: int
    duration: Optional[float]
    original_format: Optional[str]
    upload_status: str
    created_at: datetime

class TranscodingJobOut(BaseModel):
    id: str
    video_id: str
    status: str
    target_format: str
    quality_preset: Optional[str]
    progress: Optional[int] = 0
    output_url: Optional[str]
    error_message: Optional[str]
    created_at: datetime