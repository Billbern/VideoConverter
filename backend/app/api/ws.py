from fastapi import WebSocket, WebSocketDisconnect, APIRouter
from typing import Dict
import asyncio

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}

    async def connect(self, task_id: str, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[task_id] = websocket

    def disconnect(self, task_id: str):
        if task_id in self.active_connections:
            del self.active_connections[task_id]

    async def send_progress(self, task_id: str, progress: int, message: str):
        if task_id in self.active_connections:
            try:
                await self.active_connections[task_id].send_json({
                    "progress": progress,
                    "message": message
                })
            except:
                self.disconnect(task_id)

manager = ConnectionManager()

@router.websocket("/ws/{task_id}")
async def websocket_endpoint(websocket: WebSocket, task_id: str):
    await manager.connect(task_id, websocket)
    try:
        while True:
            # keep connection alive, client can send ping if needed
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(task_id)