# Backend

Python API scaffold for RADIX Talent Match. The FastAPI application exposes a health check; business endpoints and module behavior are not implemented yet.

## Setup

From this directory, using PowerShell:

```powershell
py -3.12 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload
```

The `/health` route does not require Supabase or LLM credentials. Configure local credentials only when the corresponding integrations are implemented.
