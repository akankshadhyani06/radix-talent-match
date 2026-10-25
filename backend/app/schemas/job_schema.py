"""API schemas for job description operations."""

from pydantic import BaseModel


class JobDescriptionRequest(BaseModel):
    """Input contract for a future job description operation."""

    description: str
    title: str | None = None
    company: str | None = None


class JobDescriptionResponse(BaseModel):
    """Response contract for a future job description operation."""

    job_description_id: str
    status: str
