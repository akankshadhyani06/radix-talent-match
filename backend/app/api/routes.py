"""HTTP API routes for RADIX Talent Match.

Role 1 (JD Analytics) is fully implemented.
Endpoints for Roles 2-5 are clearly-marked stubs adhering to docs/api-contracts.md.
"""

from __future__ import annotations

import logging
from typing import Any

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.core.config import get_settings
from app.core.exceptions import IntegrationConfigurationError
from app.database.supabase_client import get_supabase_client
from app.schemas.job_schema import (
    CompanyItem,
    JDAnalyticsSummary,
    JobDescriptionTextRequest,
    SavedJDSkillRecord,
)
from app.services.jd_analytics import (
    analyze_job_description,
    get_jd_result,
    list_jd_results,
    save_jd_result,
)
from app.services.jd_file_reader import MAX_FILE_SIZE_BYTES

logger = logging.getLogger(__name__)

router = APIRouter()


from fastapi.responses import RedirectResponse


@router.get("/", include_in_schema=False)
def root():
    """Redirect root path to interactive Swagger documentation."""
    return RedirectResponse(url="/docs")


@router.get("/health", tags=["health"])
def health_check() -> dict[str, str]:
    """Report that the API process is responding."""
    return {"status": "ok"}


# --- Role 1: Companies (Read-Only) ---

@router.get(
    "/api/companies",
    response_model=list[CompanyItem],
    tags=["companies"],
    summary="List available companies for JD selection",
)
def get_companies() -> list[CompanyItem]:
    """Fetch company list from the Supabase staging_company table (read-only)."""
    settings = get_settings()
    table_name = settings.companies_table or "staging_company"

    try:
        supabase = get_supabase_client()
        response = supabase.table(table_name).select("*").limit(200).execute()
        rows = response.data or []

        companies: list[CompanyItem] = []
        for row in rows:
            # Dynamically handle common column naming conventions
            name = (
                row.get("name")
                or row.get("company_name")
                or row.get("company")
                or row.get("title")
            )
            if not name:
                continue

            company_id = str(row.get("id") or row.get("company_id") or name)
            companies.append(CompanyItem(id=company_id, name=str(name).strip()))

        # Sort alphabetically by company name
        companies.sort(key=lambda c: c.name.lower())
        return companies

    except IntegrationConfigurationError as cfg_err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(cfg_err),
        ) from cfg_err
    except Exception as exc:
        err_msg = str(exc)
        logger.warning("Failed to query companies table '%s': %s", table_name, err_msg)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Could not load companies from Supabase: {err_msg}",
        ) from exc


# --- Role 1: JD Analytics Endpoints ---

@router.post(
    "/api/jd-analytics",
    response_model=SavedJDSkillRecord,
    tags=["jd-analytics"],
    summary="Extract skills from an uploaded PDF or DOCX job description",
)
async def analyze_jd_file_upload(
    file: UploadFile = File(...),
    company: str | None = Form(default=None),
    role: str | None = Form(default=None),
) -> SavedJDSkillRecord:
    """Accept a PDF or DOCX file upload and extract skills using Gemini LLM."""
    filename = file.filename or "uploaded_jd"
    lower_name = filename.lower()

    if not (lower_name.endswith(".pdf") or lower_name.endswith(".docx") or lower_name.endswith(".txt")):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file format. Please upload a .pdf, .docx, or .txt file.",
        )

    file_bytes = await file.read()
    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024 * 1024)} MB.",
        )

    try:
        jd_result = analyze_job_description(
            file_bytes,
            source_file=filename,
            company=company.strip() if company else None,
            role=role.strip() if role else None,
        )
        saved_record = save_jd_result(jd_result)
        return saved_record

    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        ) from val_err
    except IntegrationConfigurationError as cfg_err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(cfg_err),
        ) from cfg_err
    except RuntimeError as run_err:
        err_str = str(run_err)
        if "rate limit" in err_str.lower() or "quota" in err_str.lower():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=err_str,
            ) from run_err
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=err_str,
        ) from run_err
    except Exception as exc:
        logger.exception("Unexpected error in JD file extraction: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"JD extraction failed: {exc}",
        ) from exc


@router.post(
    "/api/jd-analytics/text",
    response_model=SavedJDSkillRecord,
    tags=["jd-analytics"],
    summary="Extract skills from pasted plain text job description",
)
def analyze_jd_text_payload(
    payload: JobDescriptionTextRequest,
) -> SavedJDSkillRecord:
    """Accept plain text job description and extract skills using Gemini LLM."""
    try:
        jd_result = analyze_job_description(
            payload.description,
            source_file="pasted_text.txt",
            company=payload.company.strip() if payload.company else None,
            role=payload.title.strip() if payload.title else None,
        )
        saved_record = save_jd_result(jd_result)
        return saved_record

    except ValueError as val_err:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(val_err),
        ) from val_err
    except IntegrationConfigurationError as cfg_err:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=str(cfg_err),
        ) from cfg_err
    except RuntimeError as run_err:
        err_str = str(run_err)
        if "rate limit" in err_str.lower() or "quota" in err_str.lower():
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=err_str,
            ) from run_err
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=err_str,
        ) from run_err
    except Exception as exc:
        logger.exception("Unexpected error in JD text extraction: %s", exc)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"JD extraction failed: {exc}",
        ) from exc


@router.get(
    "/api/jd-analytics",
    response_model=list[JDAnalyticsSummary],
    tags=["jd-analytics"],
    summary="List all previously saved JD analyses",
)
def list_saved_jd_analyses() -> list[JDAnalyticsSummary]:
    """Return summary list of all saved JD analyses."""
    return list_jd_results()


@router.get(
    "/api/jd-analytics/{jd_id}",
    response_model=SavedJDSkillRecord,
    tags=["jd-analytics"],
    summary="Retrieve full extracted skill list for a given JD analysis ID",
)
def get_single_jd_analysis(jd_id: str) -> SavedJDSkillRecord:
    """Retrieve a single saved JD analysis by ID. Consumed by Role 5 (Skill Matching)."""
    record = get_jd_result(jd_id)
    if not record:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"JD analysis '{jd_id}' not found.",
        )
    return record


# --- Stubs for Roles 2-5 (preserves docs/api-contracts.md) ---

@router.post("/api/resume-parsing", tags=["resume-parsing"])
def parse_resume_stub() -> dict[str, Any]:
    """Stub endpoint for Role 2 (Resume Parsing). Owned by teammate #2."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Resume Parsing endpoint is under construction by Role 2 teammate.",
    )


@router.post("/api/profiles", tags=["profile-builder"])
def create_profile_stub() -> dict[str, Any]:
    """Stub endpoint for Role 3 (Profile Builder). Owned by teammate #3."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Profile Builder endpoint is under construction by Role 3 teammate.",
    )


@router.get("/api/profiles/{candidate_id}", tags=["profile-builder"])
def get_profile_stub(candidate_id: str) -> dict[str, Any]:
    """Stub endpoint for Role 3 (Profile Builder). Owned by teammate #3."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Profile retrieval endpoint is under construction by Role 3 teammate.",
    )


@router.post("/api/talent-checks", tags=["talent-check"])
def assess_talent_check_stub() -> dict[str, Any]:
    """Stub endpoint for Role 4 (Talent Check). Owned by teammate #4."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Talent Check endpoint is under construction by Role 4 teammate.",
    )


@router.post("/api/skill-matches", tags=["skill-matching"])
def match_skills_stub() -> dict[str, Any]:
    """Stub endpoint for Role 5 (Skill Matching). Owned by teammate #5."""
    raise HTTPException(
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
        detail="Skill Matching endpoint is under construction by Role 5 teammate.",
    )
