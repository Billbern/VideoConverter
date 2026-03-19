import asyncio
import aio_pika
import json
import subprocess
import os
from datetime import datetime
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker
from sqlalchemy import select, update

# Database setup (similar to main app)
DATABASE_URL = "postgresql+asyncpg://user:pass@db:5432/transcoder"
engine = create_async_engine(DATABASE_URL, echo=True)
AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

# RabbitMQ settings
RABBITMQ_URL = "amqp://guest:guest@rabbitmq:5672/"
QUEUE_NAME = "video_transcode"

# WebSocket manager connection (we'll need a way to send messages to the WebSocket server)
# For simplicity, we can use Redis Pub/Sub or call the FastAPI app's internal endpoint.
# Here we'll assume the worker can directly use the manager if run in same process, but they are separate.
# Better: have the FastAPI app expose an HTTP endpoint to send progress, or use Redis.

# We'll implement a simple HTTP client to notify progress via FastAPI.
import httpx

API_BASE = "http://backend:8000"  # docker service name

async def update_progress(task_id: str, progress: int, message: str):
    async with httpx.AsyncClient() as client:
        await client.post(f"{API_BASE}/internal/progress", json={
            "task_id": task_id,
            "progress": progress,
            "message": message
        })

async def process_message(message: aio_pika.IncomingMessage):
    async with message.process():
        data = json.loads(message.body.decode())
        task_id = data["task_id"]
        file_path = data["file_path"]
        user_id = data["user_id"]
        metadata = data.get("metadata", {})

        # Update job status in DB
        async with AsyncSessionLocal() as db:
            # Fetch video record
            video = await db.get(Video, task_id)
            if not video:
                return
            # Create transcoding job record
            job = TranscodingJob(
                id=str(uuid.uuid4()),
                video_id=task_id,
                user_id=user_id,
                target_format=metadata.get("target_format", "mp4"),
                quality_preset=metadata.get("quality", "balanced"),
                status="processing"
            )
            db.add(job)
            await db.commit()
            await db.refresh(job)

        # Simulate progress updates (replace with real FFmpeg)
        await update_progress(task_id, 0, "Starting transcoding...")
        # Here you would call FFmpeg and parse output for progress
        # For demonstration, we'll run a dummy command
        try:
            output_filename = f"{task_id}.{job.target_format}"
            output_path = os.path.join("/tmp/processed", output_filename)
            os.makedirs("/tmp/processed", exist_ok=True)

            # Example FFmpeg command
            cmd = [
                "ffmpeg", "-i", file_path,
                "-c:v", "libx264", "-preset", "medium",
                "-c:a", "aac", "-b:a", "128k",
                output_path
            ]
            process = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )

            # Read stderr line by line to extract progress
            # (This is simplified; real progress parsing is more complex)
            while True:
                line = await process.stderr.readline()
                if not line:
                    break
                line = line.decode().strip()
                # Look for time=... to estimate progress (crude)
                if "time=" in line:
                    # Extract time, compare with duration
                    # For now, send incremental updates
                    await update_progress(task_id, 50, "Encoding...")
                    await asyncio.sleep(0.5)

            await process.wait()

            if process.returncode != 0:
                raise Exception("FFmpeg failed")

            # Update job as completed
            async with AsyncSessionLocal() as db:
                stmt = update(TranscodingJob).where(TranscodingJob.id == job.id).values(
                    status="completed",
                    completed_at=datetime.utcnow(),
                    output_path=output_path,
                    output_size=os.path.getsize(output_path)
                )
                await db.execute(stmt)
                await db.commit()

            await update_progress(task_id, 100, "Transcoding completed")
        except Exception as e:
            async with AsyncSessionLocal() as db:
                stmt = update(TranscodingJob).where(TranscodingJob.id == job.id).values(
                    status="failed",
                    error_message=str(e)
                )
                await db.execute(stmt)
                await db.commit()
            await update_progress(task_id, 0, f"Failed: {str(e)}")

async def main():
    connection = await aio_pika.connect_robust(RABBITMQ_URL)
    async with connection:
        channel = await connection.channel()
        await channel.set_qos(prefetch_count=1)
        queue = await channel.declare_queue(QUEUE_NAME, durable=True)
        async with queue.iterator() as queue_iter:
            async for message in queue_iter:
                await process_message(message)

if __name__ == "__main__":
    asyncio.run(main())