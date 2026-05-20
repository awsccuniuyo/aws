from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from contextlib import asynccontextmanager
from pathlib import Path

from app.core.database import engine, Base
from app.core.config import settings
from app.routers import events, registrations, admin, announcements


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Create all tables on startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    await engine.dispose()


app = FastAPI(
    title="AWS Student Builder Group Uniuyo API",
    description="Backend for the AWS Student Builder Group Uniuyo platform",
    version="1.0.0",
    lifespan=lifespan,
)

# ─── CORS ─────────────────────────────────────────────────────────────────────
allowed_origins = [
    settings.FRONTEND_URL,
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(events.router,        prefix="/api/v1")
app.include_router(registrations.router, prefix="/api/v1")
app.include_router(admin.router,         prefix="/api/v1")
app.include_router(announcements.router)

# ─── Static Files ─────────────────────────────────────────────────────────────
upload_path = Path(settings.UPLOAD_DIR)
upload_path.mkdir(parents=True, exist_ok=True)
app.mount("/uploads/images", StaticFiles(directory=settings.UPLOAD_DIR), name="uploads")


# ─── Health Check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "service": "AWS Student Builder Group Uniuyo API",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy"}
