import os
import shutil
import uuid
from fastapi import APIRouter, UploadFile, File, Form, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from app import models, schemas
from app.database import get_db
from app.auth import get_current_user
from app.services.rabbitmq import publish_to_queue
from app.config import settings
import json
from datetime import datetime

router = APIRouter(prefix="/videos", tags=["videos"])

@router.post("/upload", response_model=schemas.VideoUploadResponse)
async def upload_video(
    video: UploadFile = File(...),
    metadata: str = Form("{}"),
    current_user: models.User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Parse metadata
    try:
        meta = json.loads(metadata)
    except json.JSONDecodeError:
        meta = {}

    # Check storage limit (optional)
    # (you could check current usage)

    # Generate task ID and save file temporarily
    task_id = str(uuid.uuid4())
    file_ext = os.path.splitext(video.filename)[1]
    temp_filename = f"{task_id}{file_ext}"
    temp_path = os.path.join(settings.UPLOAD_DIR, temp_filename)

    # Ensure upload dir exists
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)

    # Save file
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(video.file, buffer)

    # Create video record in DB
    db_video = models.Video(
        id=task_id,  # use task_id as video id for simplicity
        user_id=current_user.id,
        original_filename=video.filename,
        file_size=os.path.getsize(temp_path),
        original_format=file_ext.lstrip('.'),
        upload_status="uploaded",
        storage_path=temp_path,
    )
    db.add(db_video)
    await db.commit()
    await db.refresh(db_video)

    # Publish to RabbitMQ
    message = {
        "task_id": task_id,
        "file_path": temp_path,
        "user_id": current_user.id,
        "metadata": meta,
        "timestamp": datetime.utcnow().isoformat(),
    }
    await publish_to_queue(settings.TRANSCODE_QUEUE, message)

    return schemas.VideoUploadResponse(
        task_id=task_id,
        status="queued",
        message="Video uploaded and queued for transcoding",
    )