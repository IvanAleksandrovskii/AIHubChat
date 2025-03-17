# core/config.py

import os

from pydantic import BaseModel, field_validator
from pydantic.networks import PostgresDsn

from dotenv import load_dotenv
from pydantic_settings import BaseSettings


load_dotenv(".env")


# Telegram Bot ENV variables
BASE_BOT_URL = os.getenv(
    "BASE_BOT_URL", "https://jrqmts-ip-184-22-35-246.tunnelmole.net"
)
BOT_PORT = int(os.getenv("BOT_PORT", 8080))
APP_NAME = os.getenv("APP_NAME", "myapp")

# App ENV variables
DEBUG = os.getenv("DEBUG", "False").lower() in ("true", "1")
APP_RUN_HOST = str(os.getenv("APP_RUN_HOST", "0.0.0.0"))
APP_RUN_PORT = int(os.getenv("APP_RUN_PORT", 8000))

APP_RUN_WORKERS = int(os.getenv("APP_RUN_WORKERS", 4))  # TODO: Implement

# Database ENV variables
POSTGRES_ADDRESS = os.getenv("POSTGRES_ADDRESS", "0.0.0.0")
POSTGRES_DB = os.getenv("POSTGRES_DB", "AIHub")
POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")

POSTGRES_POOL_SIZE = int(os.getenv("POSTGRES_POOL_SIZE", 10))
POSTGRES_MAX_OVERFLOW = int(os.getenv("POSTGRES_MAX_OVERFLOW", 20))

POSTGRES_ECHO = os.getenv("POSTGRES_ECHO", "False").lower() in ("true", "1")

# CORS ENV variables
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", ["*"])

# Bot ENV variables
BOT_TOKEN = os.getenv("BOT_TOKEN", "871635ug2yug87t872g...")

# SQLAdmin ENV variables
SQLADMIN_SECRET_KEY = os.getenv("SQLADMIN_SECRET_KEY", "sqladmin_secret_key")
SQLADMIN_USERNAME = os.getenv("SQLADMIN_USERNAME", "admin")
SQLADMIN_PASSWORD = os.getenv("SQLADMIN_PASSWORD", "password")

BASE_SERVER_URL = os.getenv(
    "BASE_SERVER_URL", "https://9a42-184-22-18-75.ngrok-free.app"
)

HTTP_CLIENT_TIMEOUT = int(os.getenv("HTTP_CLIENT_TIMEOUT", "300"))
HTTP_CLIENTS_MAX_KEEPALIVE_CONNECTIONS = int(
    os.getenv("HTTP_CLIENTS_MAX_KEEPALIVE_CONNECTIONS", "10")
)


class RunConfig(BaseModel):
    debug: bool = DEBUG
    host: str = APP_RUN_HOST
    port: int = APP_RUN_PORT

    workers: int = APP_RUN_WORKERS
    timeout: int = 900  # Could be APP_RUN_TIMEOUT but no reason to change

    base_url: str = BASE_SERVER_URL


class DBConfig(BaseModel):
    url: PostgresDsn = (
        f"postgresql+asyncpg://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_ADDRESS}:5432/{POSTGRES_DB}"
    )
    pool_size: int = POSTGRES_POOL_SIZE
    max_overflow: int = POSTGRES_MAX_OVERFLOW
    echo: bool = POSTGRES_ECHO

    naming_convention: dict[str, str] = {
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_N_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }

    @field_validator("pool_size", "max_overflow")
    def validate_positive_int(cls, v):
        if v <= 0:
            raise ValueError("Must be a positive integer")
        return v


class CORSConfig(BaseModel):
    allowed_origins: list = ALLOWED_ORIGINS


class BotConfig(BaseModel):
    token: str = BOT_TOKEN
    base_url: str = BASE_BOT_URL
    port: int = BOT_PORT
    app_name: str = APP_NAME


class SQLAdminConfig(BaseModel):
    secret_key: str = SQLADMIN_SECRET_KEY
    username: str = SQLADMIN_USERNAME
    password: str = SQLADMIN_PASSWORD


class MediaConfig(BaseModel):
    root: str = "app/media"


class HTTPClientConfig(BaseModel):
    timeout: int = HTTP_CLIENT_TIMEOUT
    max_keepalive_connections: int = HTTP_CLIENTS_MAX_KEEPALIVE_CONNECTIONS


class WebhookConfig(BaseModel):
    path: str = "/webhook/bot/"


class AIChatConfig(BaseSettings):
    history_length: int = 5


class Settings(BaseSettings):
    run: RunConfig = RunConfig()
    db: DBConfig = DBConfig()
    cors: CORSConfig = CORSConfig()
    admin_panel: SQLAdminConfig = SQLAdminConfig()

    http_client: HTTPClientConfig = HTTPClientConfig()

    bot: BotConfig = BotConfig()

    webhook: WebhookConfig = WebhookConfig()

    media: MediaConfig = MediaConfig()

    ai_chat: AIChatConfig = AIChatConfig()


settings = Settings()
