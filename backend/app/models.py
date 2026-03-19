from sqlalchemy import (
    Column, String, Integer, Boolean, DateTime, ForeignKey, BigInteger, JSON, DECIMAL
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.database import Base
import uuid


def generate_uuid():
    return str(uuid.uuid4())


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False)
    username = Column(String, unique=True)
    password_hash = Column(String)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    tier = Column(String, default="free")  # free, pro, enterprise
    storage_limit = Column(BigInteger, default=1073741824)  # 1GB
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    last_login = Column(DateTime(timezone=True))

    videos = relationship("Video", back_populates="user", cascade="all, delete-orphan")
    jobs = relationship("TranscodingJob", back_populates="user", cascade="all, delete-orphan")
    subscription = relationship("Subscription", back_populates="user", uselist=False, cascade="all, delete-orphan")


class Video(Base):
    __tablename__ = "videos"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    original_filename = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    duration = Column(DECIMAL(10, 3))
    original_format = Column(String(10))
    resolution = Column(String(20))
    bitrate = Column(Integer)
    storage_path = Column(String(1000))
    thumbnail_path = Column(String(1000))
    # rename attribute, keep db column name as "metadata" if desired
    extra_metadata = Column("metadata", JSON)  # or just Column(JSON) if you can rename the column too
    upload_status = Column(String(20), default="pending")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    uploaded_at = Column(DateTime(timezone=True))

    user = relationship("User", back_populates="videos")
    transcoding_jobs = relationship("TranscodingJob", back_populates="video", cascade="all, delete-orphan")
    processed_videos = relationship("ProcessedVideo", back_populates="video", cascade="all, delete-orphan")


class TranscodingJob(Base):
    __tablename__ = "transcoding_jobs"

    id = Column(String, primary_key=True, default=generate_uuid)
    video_id = Column(String, ForeignKey("videos.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    status = Column(String(20), default="queued")
    source_format = Column(String(10))
    target_format = Column(String(10), nullable=False)
    ffmpeg_params = Column(JSON)
    quality_preset = Column(String(20))
    priority = Column(Integer, default=5)
    queued_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True))
    completed_at = Column(DateTime(timezone=True))
    error_message = Column(String)
    output_path = Column(String(1000))
    output_size = Column(BigInteger)
    processing_time = Column(Integer)  # seconds

    video = relationship("Video", back_populates="transcoding_jobs")
    user = relationship("User", back_populates="jobs")
    processed = relationship("ProcessedVideo", back_populates="job", uselist=False, cascade="all, delete-orphan")


class ProcessedVideo(Base):
    __tablename__ = "processed_videos"

    id = Column(String, primary_key=True, default=generate_uuid)
    job_id = Column(String, ForeignKey("transcoding_jobs.id", ondelete="CASCADE"), nullable=False)
    video_id = Column(String, ForeignKey("videos.id", ondelete="CASCADE"), nullable=False)
    format = Column(String(10), nullable=False)
    resolution = Column(String(20))
    bitrate = Column(Integer)
    file_size = Column(BigInteger)
    storage_path = Column(String(1000))
    playback_url = Column(String(1000))
    is_default = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    job = relationship("TranscodingJob", back_populates="processed")
    video = relationship("Video", back_populates="processed_videos")


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    stripe_subscription_id = Column(String, unique=True)
    stripe_customer_id = Column(String)
    plan = Column(String(50), nullable=False)
    status = Column(String(20), default="active")
    current_period_start = Column(DateTime(timezone=True))
    current_period_end = Column(DateTime(timezone=True))
    cancel_at_period_end = Column(Boolean, default=False)
    canceled_at = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="subscription")
