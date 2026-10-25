"""Skill Matching service interface.

Future responsibility: compare a candidate profile with a job description and
report an approved match score and skill gaps.
"""


def match_candidate_to_job(candidate_id: str, job_description_id: str) -> None:
    """Placeholder for skill matching; no scoring or gap analysis is implemented."""
    raise NotImplementedError("Skill Matching has not been implemented.")
