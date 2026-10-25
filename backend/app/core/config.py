"""Centralized environment-backed application settings."""

from functools import lru_cache

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Optional service settings; external credentials are not needed at startup."""

    supabase_url: str | None = None
    supabase_key: str | None = None
    llm_provider: str | None = None
    llm_api_key: str | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    """Load settings once, without connecting to external services."""
    return Settings()
