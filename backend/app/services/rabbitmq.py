import aio_pika
import json
from app.config import settings

async def publish_to_queue(queue_name: str, message: dict, delivery_mode: int = 2):
    connection = await aio_pika.connect_robust(settings.RABBITMQ_URL)
    async with connection:
        channel = await connection.channel()
        # Declare queue (durable)
        queue = await channel.declare_queue(queue_name, durable=True)
        await channel.default_exchange.publish(
            aio_pika.Message(
                body=json.dumps(message).encode(),
                delivery_mode=delivery_mode,
            ),
            routing_key=queue_name,
        )