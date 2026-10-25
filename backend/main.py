"""Application entry point for the RADIX Talent Match API."""

from fastapi import FastAPI

from app.api.routes import router

app = FastAPI(
    title="RADIX Talent Match API",
    description="Initial API scaffold for candidate job-readiness and skill matching.",
    version="0.1.0",
)
app.include_router(router)
