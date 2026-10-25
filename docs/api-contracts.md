# Proposed API contracts

Only `GET /health` is implemented. The business endpoints below are proposed
contracts for discussion and are not functional endpoints in the current
scaffold. Exact payloads, authorization, persistence, and error responses
remain to be agreed before implementation.

| Method | Proposed endpoint | Responsibility |
| --- | --- | --- |
| `GET` | `/health` | Confirm that the API process responds. Implemented; returns `{"status":"ok"}`. |
| `POST` | `/api/jd-analytics` | Accept a job description and return extracted requirements using the approved competency framework. |
| `POST` | `/api/resume-parsing` | Accept resume content and return extracted candidate information. |
| `POST` | `/api/profiles` | Create or update a structured candidate profile. |
| `GET` | `/api/profiles/{candidate_id}` | Retrieve a candidate profile, subject to agreed access controls. |
| `POST` | `/api/talent-checks` | Assess a candidate against approved company expectations and the authoritative 12-skillset framework. |
| `POST` | `/api/skill-matches` | Compare a candidate profile with a job description and return an approved match result and skill gaps. |

No scoring formula, skillset labels, extraction behavior, or company hiring
data is defined by this proposal. The matching and assessment contracts depend
on decisions about the authoritative RADIX framework and must not be treated
as implemented functionality.
