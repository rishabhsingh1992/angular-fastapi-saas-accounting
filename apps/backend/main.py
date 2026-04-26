from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from config import get_settings
from schemas import HealthCheckResponse

settings = get_settings()

app = FastAPI(
    title=settings.app_name,
    version=settings.app_version,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[settings.frontend_origin],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health", response_model=HealthCheckResponse, tags=["health"])
def health_check() -> HealthCheckResponse:
    return HealthCheckResponse(
        status="ok",
        service=settings.app_name,
        version=settings.app_version,
        environment=settings.environment,
    )


@app.get("/api/health", response_model=HealthCheckResponse, tags=["health"])
def api_health_check() -> HealthCheckResponse:
    return health_check()
