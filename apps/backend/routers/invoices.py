from __future__ import annotations

from collections import defaultdict
from decimal import Decimal, ROUND_HALF_UP
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import delete, select
from sqlalchemy.orm import Session

from models.customer import Customer
from models.invoice import Invoice, InvoiceLineItem
from models.user import User
from schemas import (
    InvoiceCreate,
    InvoiceLineItemCreate,
    InvoiceLineItemRead,
    InvoiceRead,
    InvoiceStatusUpdate,
    InvoiceUpdate,
)
from security import get_current_user, get_db

router = APIRouter(prefix="/invoices", tags=["invoices"])

MONEY_QUANT = Decimal("0.01")


def _to_money(value: Decimal) -> Decimal:
    return value.quantize(MONEY_QUANT, rounding=ROUND_HALF_UP)


def _compute_totals(line_items: list[InvoiceLineItem], tax_rate: Decimal) -> tuple[Decimal, Decimal, Decimal]:
    subtotal = _to_money(sum((item.quantity * item.unit_price for item in line_items), Decimal("0")))
    tax_amount = _to_money(subtotal * tax_rate)
    grand_total = _to_money(subtotal + tax_amount)
    return subtotal, tax_amount, grand_total


def _line_item_reads(line_items: list[InvoiceLineItem]) -> list[InvoiceLineItemRead]:
    return [
        InvoiceLineItemRead(
            id=item.id,
            description=item.description,
            quantity=item.quantity,
            unit_price=item.unit_price,
        )
        for item in line_items
    ]


def _to_invoice_read(invoice: Invoice, line_items: list[InvoiceLineItem]) -> InvoiceRead:
    subtotal, tax_amount, grand_total = _compute_totals(line_items, invoice.tax_rate)
    return InvoiceRead(
        id=invoice.id,
        tenant_id=invoice.tenant_id,
        invoice_number=invoice.invoice_number,
        customer_id=invoice.customer_id,
        status=invoice.status,
        issue_date=invoice.issue_date,
        due_date=invoice.due_date,
        tax_rate=invoice.tax_rate,
        created_at=invoice.created_at,
        line_items=_line_item_reads(line_items),
        subtotal=subtotal,
        tax_amount=tax_amount,
        grand_total=grand_total,
    )


def _assert_tenant_customer(customer_id: UUID, tenant_id: str, db: Session) -> None:
    customer = db.scalar(
        select(Customer).where(Customer.id == customer_id, Customer.tenant_id == tenant_id)
    )
    if not customer:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Customer not found for the current tenant",
        )


def _replace_line_items(invoice_id: UUID, line_items: list[InvoiceLineItemCreate], db: Session) -> None:
    db.execute(delete(InvoiceLineItem).where(InvoiceLineItem.invoice_id == invoice_id))
    db.add_all(
        [
            InvoiceLineItem(
                invoice_id=invoice_id,
                description=item.description,
                quantity=item.quantity,
                unit_price=item.unit_price,
            )
            for item in line_items
        ]
    )


def _get_invoice_for_tenant(invoice_id: UUID, tenant_id: str, db: Session) -> Invoice:
    invoice = db.scalar(
        select(Invoice).where(Invoice.id == invoice_id, Invoice.tenant_id == tenant_id)
    )
    if not invoice:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Invoice not found")
    return invoice


@router.get("", response_model=list[InvoiceRead])
def list_invoices(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> list[InvoiceRead]:
    invoices = db.scalars(
        select(Invoice)
        .where(Invoice.tenant_id == current_user.tenant_id)
        .order_by(Invoice.created_at.desc())
    ).all()

    if not invoices:
        return []

    invoice_ids = [invoice.id for invoice in invoices]
    line_items = db.scalars(
        select(InvoiceLineItem).where(InvoiceLineItem.invoice_id.in_(invoice_ids))
    ).all()
    line_items_by_invoice: dict[UUID, list[InvoiceLineItem]] = defaultdict(list)
    for line_item in line_items:
        line_items_by_invoice[line_item.invoice_id].append(line_item)

    return [
        _to_invoice_read(invoice, line_items_by_invoice.get(invoice.id, [])) for invoice in invoices
    ]


@router.post("", response_model=InvoiceRead, status_code=status.HTTP_201_CREATED)
def create_invoice(
    payload: InvoiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InvoiceRead:
    _assert_tenant_customer(payload.customer_id, current_user.tenant_id, db)
    invoice = Invoice(
        tenant_id=current_user.tenant_id,
        invoice_number=payload.invoice_number,
        customer_id=payload.customer_id,
        status=payload.status,
        issue_date=payload.issue_date,
        due_date=payload.due_date,
        tax_rate=payload.tax_rate,
    )
    db.add(invoice)
    db.flush()
    _replace_line_items(invoice.id, payload.line_items, db)
    db.commit()
    db.refresh(invoice)

    line_items = db.scalars(
        select(InvoiceLineItem).where(InvoiceLineItem.invoice_id == invoice.id)
    ).all()
    return _to_invoice_read(invoice, line_items)


@router.get("/{invoice_id}", response_model=InvoiceRead)
def get_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InvoiceRead:
    invoice = _get_invoice_for_tenant(invoice_id, current_user.tenant_id, db)
    line_items = db.scalars(
        select(InvoiceLineItem).where(InvoiceLineItem.invoice_id == invoice.id)
    ).all()
    return _to_invoice_read(invoice, line_items)


@router.put("/{invoice_id}", response_model=InvoiceRead)
def update_invoice(
    invoice_id: UUID,
    payload: InvoiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InvoiceRead:
    invoice = _get_invoice_for_tenant(invoice_id, current_user.tenant_id, db)
    update_data = payload.model_dump(exclude_unset=True)

    if "customer_id" in update_data:
        _assert_tenant_customer(update_data["customer_id"], current_user.tenant_id, db)

    line_items_payload = update_data.pop("line_items", None)
    for field, value in update_data.items():
        setattr(invoice, field, value)

    if line_items_payload is not None:
        _replace_line_items(invoice.id, line_items_payload, db)

    db.commit()
    db.refresh(invoice)
    line_items = db.scalars(
        select(InvoiceLineItem).where(InvoiceLineItem.invoice_id == invoice.id)
    ).all()
    return _to_invoice_read(invoice, line_items)


@router.delete("/{invoice_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_invoice(
    invoice_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    invoice = _get_invoice_for_tenant(invoice_id, current_user.tenant_id, db)
    db.execute(delete(InvoiceLineItem).where(InvoiceLineItem.invoice_id == invoice.id))
    db.delete(invoice)
    db.commit()


@router.patch("/{invoice_id}/status", response_model=InvoiceRead)
def update_invoice_status(
    invoice_id: UUID,
    payload: InvoiceStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> InvoiceRead:
    invoice = _get_invoice_for_tenant(invoice_id, current_user.tenant_id, db)
    invoice.status = payload.status
    db.commit()
    db.refresh(invoice)
    line_items = db.scalars(
        select(InvoiceLineItem).where(InvoiceLineItem.invoice_id == invoice.id)
    ).all()
    return _to_invoice_read(invoice, line_items)
