from datetime import date, datetime
from decimal import Decimal
from uuid import UUID

from pydantic import BaseModel, Field

from models.invoice import InvoiceStatus


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


class InvoiceLineItemBase(BaseModel):
    description: str
    quantity: Decimal
    unit_price: Decimal


class InvoiceLineItemCreate(InvoiceLineItemBase):
    pass


class InvoiceLineItemRead(InvoiceLineItemBase):
    id: UUID


class InvoiceBase(BaseModel):
    invoice_number: str
    customer_id: UUID
    status: InvoiceStatus = InvoiceStatus.draft
    issue_date: date
    due_date: date
    tax_rate: Decimal = Field(default=Decimal("0.18"))


class InvoiceCreate(InvoiceBase):
    line_items: list[InvoiceLineItemCreate]


class InvoiceUpdate(BaseModel):
    invoice_number: str | None = None
    customer_id: UUID | None = None
    status: InvoiceStatus | None = None
    issue_date: date | None = None
    due_date: date | None = None
    tax_rate: Decimal | None = None
    line_items: list[InvoiceLineItemCreate] | None = None


class InvoiceStatusUpdate(BaseModel):
    status: InvoiceStatus


class InvoiceRead(InvoiceBase):
    id: UUID
    tenant_id: str
    created_at: datetime
    line_items: list[InvoiceLineItemRead]
    subtotal: Decimal
    tax_amount: Decimal
    grand_total: Decimal
