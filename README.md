# SchemeSaathi

Hindi/English assistant that tells people which government schemes they qualify for, why, which documents to carry and where to apply.
Team Xenon, SPARK 2 SCALE 2026 (PS41, Government Scheme Recommendation Engine).

**How it works:** the user writes a message, an LLM turns it into a structured profile, a deterministic rules engine checks it against
curated scheme records, and the app shows ranked schemes with reasons, a merged document checklist and official links.
Rules decide eligibility; the LLM only reads the message.

## Repo layout
```
backend/    FastAPI API, eligibility engine, scheme data (app/data/schemes.json), tests
frontend/   React + Vite + Tailwind UI
render.yaml Render deployment config (backend)
.github/    CI: backend tests + frontend build on every push/PR
```

## Run locally
**Backend** (Python 3.12)
```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env               # optional: add GROQ_API_KEY + EXTRACT_MODEL
uvicorn app.main:app --reload      # http://localhost:8000/docs
pytest
```
**Frontend** (Node 20.19+ or 22)
```bash
cd frontend
cp .env.example .env.local         # VITE_API_BASE=http://localhost:8000, VITE_USE_MOCK=false
npm install
npm run dev                        # http://localhost:5173
```
Set `VITE_USE_MOCK=true` to demo the UI without the backend.

## API
| Method | Path | Purpose |
|---|---|---|
| GET | /health | Liveness + number of schemes loaded |
| GET | /schemes | List schemes |
| POST | /match | `{profile, lang}` -> ranked results, merged documents, next question |
| POST | /extract | `{message, profile, lang}` -> updated profile |
| POST | /chat | extract + match in one call (used by the chat page) |

Statuses: `eligible`, `needs_info` (nothing failed, some fields unknown), `near_miss` (exactly one condition failed, see `unmet`).

## Deploy
- **Backend on Render:** New > Blueprint > pick this repo (uses `render.yaml`). Set `GROQ_API_KEY`, `EXTRACT_MODEL` and
  `ALLOWED_ORIGINS` (your Vercel URL, comma-separated if several) in the Render dashboard.
- **Frontend on Vercel:** import this repo, set **Root Directory = frontend**, add env `VITE_API_BASE` = your Render URL and `VITE_USE_MOCK=false`.
- Free Render services sleep when idle: open `/health` a few minutes before any demo.

## Data warning
`backend/app/data/schemes.json` was drafted from general knowledge. Every record has `verified: false`.
Check each scheme against its official page, fill `official_url`, set `last_checked`, then set `verified: true`.

## Teamwork
See [CONTRIBUTING.md](CONTRIBUTING.md) for the git workflow and the task split.
