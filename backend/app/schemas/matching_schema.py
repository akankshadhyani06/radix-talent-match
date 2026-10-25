"""API schemas for readiness assessment and skill matching operations."""

from pydantic import BaseModel, Field


class MatchingRequest(BaseModel):
    """References the candidate and job description to compare."""

    candidate_id: str
    job_description_id: str


class MatchingResult(BaseModel):
    """Future match result; score and skill gaps have no defined calculation yet."""

    candidate_id: str
    job_description_id: str
    match_score: float | None = None
    skill_gaps: list[str] = Field(default_factory=list)
