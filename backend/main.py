from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from database import create_tables
from config import settings

from routers import auth, projects, runs, stats, datasets, evaluations, prompts, flows, alerts, ws, gamechangers, business_engines, system_metrics, inference

@asynccontextmanager
async def lifespan(app: FastAPI):
    await create_tables()
    yield

app = FastAPI(
    title="LangRush API",
    description="All-in-one LLMOps & DevTools Platform API",
    version="1.0.0",
    lifespan=lifespan
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_url, "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api")
app.include_router(projects.router, prefix="/api")
app.include_router(runs.router, prefix="/api")
app.include_router(stats.router, prefix="/api")
app.include_router(datasets.router, prefix="/api")
app.include_router(evaluations.router, prefix="/api")
app.include_router(prompts.router, prefix="/api")
app.include_router(flows.router, prefix="/api")
app.include_router(alerts.router, prefix="/api")
app.include_router(gamechangers.router, prefix="/api")
app.include_router(business_engines.router, prefix="/api")
app.include_router(system_metrics.router, prefix="/api/system_metrics")
app.include_router(inference.router)
app.include_router(ws.router) # No api prefix for ws

@app.get("/health")
async def health():
    return {"status": "ok", "app": settings.app_name}
