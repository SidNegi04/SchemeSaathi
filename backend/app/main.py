import os

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from . import engine
from .extract import extract
from .models import ExtractRequest, MatchRequest, Profile
from .questions import DISCLAIMER, question_for

load_dotenv()

app = FastAPI(title="SchemeSaathi API", version="0.1.0")
origins = [o.strip() for o in os.getenv("ALLOWED_ORIGINS", "http://localhost:5173,http://localhost:5174").split(",") if o.strip()]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_methods=["*"], allow_headers=["*"])

SCHEMES = engine.load_schemes()


def _profile_dict(p: Profile) -> dict:
    return p.model_dump(exclude_none=True, mode="json")


def _run_match(profile: dict, lang: str) -> dict:
    out = engine.match(profile, SCHEMES)
    field = out.pop("ask_next_field")
    out["ask_next"] = {"field": field, "question": question_for(field, lang)} if field else None
    out["disclaimer"] = DISCLAIMER[lang]
    out["profile"] = profile
    return out


@app.get("/health")
def health():
    return {"status": "ok", "schemes_loaded": len(SCHEMES)}


@app.get("/schemes")
def list_schemes():
    return [{"id": s["id"], "name": s["name"], "category": s["category"], "verified": s["verified"]}
            for s in SCHEMES]


@app.post("/match")
def match(req: MatchRequest):
    return _run_match(_profile_dict(req.profile), req.lang)


@app.post("/extract")
async def extract_profile(req: ExtractRequest):
    found, source = await extract(req.message)
    merged = {**_profile_dict(req.profile), **found}
    return {"profile": _profile_dict(Profile(**merged)), "extracted_by": source}


@app.post("/chat")
async def chat(req: ExtractRequest):
    """One call for the frontend: read the message, update the profile, return matches + next question."""
    found, source = await extract(req.message)
    merged = _profile_dict(Profile(**{**_profile_dict(req.profile), **found}))
    out = _run_match(merged, req.lang)
    out["extracted_by"] = source
    return out
