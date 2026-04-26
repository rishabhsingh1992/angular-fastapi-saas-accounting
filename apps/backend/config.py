from dataclasses import dataclass
import os


@dataclass(frozen=True)
class Settings:
    app_name: str
    app_version: str
    environment: str
    frontend_origin: str


def get_settings() -> Settings:
    return Settings(
        app_name=os.getenv("APP_NAME", "Accounting SaaS API"),
        app_version=os.getenv("APP_VERSION", "0.1.0"),
        environment=os.getenv("ENVIRONMENT", "development"),
        frontend_origin=os.getenv("FRONTEND_ORIGIN", "http://localhost:4200"),
    )
