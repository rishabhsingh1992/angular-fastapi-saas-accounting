from pydantic import BaseModel, Field


class HealthCheckResponse(BaseModel):
    status: str = Field(default="ok")
    service: str
    version: str
    environment: str


class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: str
    tenant_id: int


class UserRead(BaseModel):
    id: int
    email: str
    full_name: str
    role: str
    tenant_id: int
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
    tenant_id: int
    role: str
