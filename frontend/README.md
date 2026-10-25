# Frontend

React and Vite starter interface for RADIX Talent Match. The dashboard provides navigation to the five module placeholders. Analysis, parsing, assessment, matching, and backend API integration are not implemented.

## Setup

From this directory:

```powershell
npm install
npm run dev
```

The API helper uses `http://127.0.0.1:8000` by default. Override it for local development with the Vite environment variable `VITE_API_BASE_URL`. Never expose a Supabase service-role key or private LLM credential in the browser.
