# backend/app/api/upload.py
from fastapi import APIRouter, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import aio_pika
import json
import uuid
from datetime import datetime

router = APIRouter()

@router.post("/upload")
async def upload_video(video: UploadFile, metadata: str = Form(...)):
    try:
        # Validate user and app
        meta = json.loads(metadata)
        if not validate_user_app(meta['userId'], meta['appId']):
            raise HTTPException(status_code=403, detail="Unauthorized")
        
        # Generate unique task ID
        task_id = str(uuid.uuid4())
        
        # Save file temporarily
        file_path = f"/tmp/uploads/{task_id}_{video.filename}"
        with open(file_path, "wb") as buffer:
            content = await video.read()
            buffer.write(content)
        
        # Publish to RabbitMQ with persistence
        message = {
            "task_id": task_id,
            "file_path": file_path,
            "metadata": meta,
            "timestamp": datetime.utcnow().isoformat()
        }
        
        await publish_to_queue(
            "video_transcode",
            json.dumps(message),
            delivery_mode=2  # Persistent message
        )
        
        # Return task ID for status polling
        return JSONResponse({
            "task_id": task_id,
            "status": "queued",
            "message": "Video queued for processing"
        })
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

async def publish_to_queue(queue_name: str, message: str, delivery_mode: int = 2):
    connection = await aio_pika.connect_robust(
        "amqp://guest:guest@rabbitmq/"
    )
    async with connection:
        channel = await connection.channel()
        
        # Declare durable queue
        queue = await channel.declare_queue(
            queue_name,
            durable=True
        )
        
        # Publish with persistence
        await channel.default_exchange.publish(
            aio_pika.Message(
                body=message.encode(),
                delivery_mode=delivery_mode
            ),
            routing_key=queue_name
        )