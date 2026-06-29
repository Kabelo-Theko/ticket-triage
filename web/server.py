"""FastAPI server: puts the real Python triage engine behind the web UI.

This serves the static front end in ../docs and exposes one endpoint,
POST /api/triage, which runs the exact same ticket_triage.classify_many used by
the command line tool. The front end calls this endpoint when it is available,
so the browser and the API always agree.

Run it locally:
    pip install -r requirements.txt
    uvicorn web.server:app --reload
    # then open http://127.0.0.1:8000
"""
from __future__ import annotations

import os
from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from ticket_triage.classifier import classify_many

DOCS = Path(__file__).resolve().parent.parent / "docs"

app = FastAPI(title="Triage Desk", version="0.1.0")


class TriageRequest(BaseModel):
    messages: list[str]


@app.post("/api/triage")
def triage(req: TriageRequest):
    """Classify a batch of raw messages with the canonical Python engine."""
    return [t.to_dict() for t in classify_many(req.messages)]


@app.get("/api/health")
def health():
    return {"status": "ok"}


# Serve the front end (index.html and assets) from /docs.
@app.get("/")
def index():
    return FileResponse(DOCS / "index.html")


app.mount("/", StaticFiles(directory=DOCS, html=True), name="static")
