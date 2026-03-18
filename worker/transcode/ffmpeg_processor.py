# worker/transcode/ffmpeg_processor.py
import subprocess
import json
import logging
import os
from pathlib import Path
import pika

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class VideoTranscoder:
    def __init__(self):
        self.supported_formats = {
            'mp4': 'libx264',
            'webm': 'libvpx-vp9',
            'avi': 'mpeg4'
        }
    
    def transcode(self, input_path: str, output_format: str, quality: str):
        """Execute FFmpeg transcoding with proper error handling"""
        
        # Validate format
        if output_format not in self.supported_formats:
            raise ValueError(f"Unsupported format: {output_format}")
        
        # Generate output path
        output_path = Path(input_path).with_suffix(f'.{output_format}')
        
        # Define FFmpeg command based on quality
        cmd = self._build_ffmpeg_command(
            input_path,
            str(output_path),
            output_format,
            quality
        )
        
        try:
            logger.info(f"Starting transcode: {cmd}")
            
            # Execute with timeout and progress tracking
            process = subprocess.Popen(
                cmd,
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE,
                universal_newlines=True
            )
            
            stdout, stderr = process.communicate(timeout=3600)  # 1hr timeout
            
            if process.returncode != 0:
                raise subprocess.CalledProcessError(
                    process.returncode,
                    cmd,
                    output=stdout,
                    stderr=stderr
                )
            
            logger.info(f"Transcoding completed: {output_path}")
            return str(output_path)
            
        except subprocess.TimeoutExpired:
            process.kill()
            raise Exception("Transcoding timeout exceeded")
    
    def _build_ffmpeg_command(self, input_path, output_path, format, quality):
        """Build FFmpeg command with appropriate parameters"""
        
        base_cmd = ['ffmpeg', '-i', input_path]
        
        # Add quality presets
        quality_params = self._get_quality_params(quality, format)
        
        # Build complete command
        cmd = base_cmd + quality_params + [output_path]
        return cmd
    
    def _get_quality_params(self, quality, format):
        """Return FFmpeg parameters for different quality levels"""
        presets = {
            '360p': ['-vf', 'scale=640:360', '-b:v', '800k'],
            '720p': ['-vf', 'scale=1280:720', '-b:v', '2500k'],
            '1080p': ['-vf', 'scale=1920:1080', '-b:v', '5000k'],
        }
        
        params = presets.get(quality, presets['720p'])
        
        # Add codec based on format
        codec = self.supported_formats[format]
        params.extend(['-c:v', codec, '-c:a', 'aac'])
        
        return params

# RabbitMQ Consumer
def start_worker():
    connection = pika.BlockingConnection(
        pika.ConnectionParameters('rabbitmq')
    )
    channel = connection.channel()
    
    # Declare durable queue
    channel.queue_declare(
        queue='video_transcode',
        durable=True
    )
    
    def callback(ch, method, properties, body):
        try:
            message = json.loads(body)
            transcoder = VideoTranscoder()
            
            # Process the video
            output_path = transcoder.transcode(
                message['file_path'],
                message['metadata']['targetFormat'],
                message['metadata']['quality']
            )
            
            # Update task status in database
            update_task_status(message['task_id'], 'completed', output_path)
            
            # Acknowledge message
            ch.basic_ack(delivery_tag=method.delivery_tag)
            
        except Exception as e:
            logger.error(f"Processing failed: {e}")
            # Optionally: send to dead letter queue
            ch.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
    
    # Fair dispatch
    channel.basic_qos(prefetch_count=1)
    channel.basic_consume(
        queue='video_transcode',
        on_message_callback=callback
    )
    
    logger.info("Worker started. Waiting for messages...")
    channel.start_consuming()