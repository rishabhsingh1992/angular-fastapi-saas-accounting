from .auth import router as auth_router
from .customers import router as customers_router

__all__ = ["auth_router", "customers_router"]
