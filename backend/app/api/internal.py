from fastapi import APIRouter, HTTPException
from app.api.ws import manager
from pydantic import BaseModel

router = APIRouter(prefix="/internal", tags=["internal"])

class ProgressUpdate(BaseModel):
    task_id: str
    progress: int
    message: str

@router.post("/progress")
async def update_progress(payload: ProgressUpdate):
    await manager.send_progress(payload.task_id, payload.progress, payload.message)
    return {"ok": True}