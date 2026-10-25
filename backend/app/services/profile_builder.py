"""Profile Builder service interface.

Future responsibility: create or update a structured candidate profile from
resume-derived information and candidate-provided inputs.
"""


def build_candidate_profile(candidate_inputs: dict[str, object]) -> None:
    """Placeholder for profile construction; no profile is created."""
    raise NotImplementedError("Profile Builder has not been implemented.")
