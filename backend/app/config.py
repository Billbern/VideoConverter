from pydantic_settings import BaseSettings
from pydantic import ConfigDict

class Settings(BaseSettings):
    PROJECT_NAME: str = "Fluxr API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/v1"

    # Database
    DATABASE_URL: str = "postgresql+asyncpg://user:pass@db:5432/transcoder"

    # JWT
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7

    # RabbitMQ
    RABBITMQ_URL: str = "amqp://guest:guest@rabbitmq:5672/"
    TRANSCODE_QUEUE: str = "video_transcode"

    # Storage
    UPLOAD_DIR: str = "/tmp/uploads"
    OUTPUT_DIR: str = "/tmp/processed"
    USE_S3: bool = False
    S3_BUCKET: str = ""
    S3_ACCESS_KEY: str = ""
    S3_SECRET_KEY: str = ""

    model_config = ConfigDict(case_sensitive=True)

settings = Settings()