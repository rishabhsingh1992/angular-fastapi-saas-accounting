from datetime import datetime
from uuid import UUID

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
    tenant_id: str


class UserRead(BaseModel):
    id: UUID
    email: str
    full_name: str
    role: str
    tenant_id: str
    is_active: bool


class Token(BaseModel):
    access_token: str
    token_type: str


class TokenData(BaseModel):
    email: str
    tenant_id: str
    role: str


class CustomerBase(BaseModel):
    name: str
    email: str
    phone: str | None = None
    address: str | None = None


class CustomerCreate(CustomerBase):
    pass


class CustomerUpdate(BaseModel):
    name: str | None = None
    email: str | None = None
    phone: str | None = None
    address: str | None = None


class CustomerRead(CustomerBase):
    id: UUID
    tenant_id: str
    created_at: datetime
