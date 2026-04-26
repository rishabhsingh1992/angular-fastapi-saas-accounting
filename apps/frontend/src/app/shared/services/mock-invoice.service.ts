import { Injectable, signal } from '@angular/core';
import { Invoice, InvoiceStatus } from '../models/invoice.models';

const MOCK_INVOICES: Invoice[] = [
    {
        id: 101,
        invoiceNumber: 'INV-2026-001',
        clientName: 'ABC Corp',
        clientEmail: 'billing@abc.test.com',
        issueDate: '2026-04-01',
        dueDate: '2026-04-30',
        status: 'sent',
        lineItems: [
            { id: '101-1', description: 'Accounting Subscription', qty: 1, unitPrice: 4500 },
            { id: '101-2', description: 'Bookkeeping Hours', qty: 12, unitPrice: 120 },
        ],
    },
    {
        id: 102,
        invoiceNumber: 'INV-2026-002',
        clientName: 'XYZ Ltd',
        clientEmail: 'accounts@xyz.test.com',
        issueDate: '2026-04-10',
        dueDate: '2026-05-10',
        status: 'draft',
        lineItems: [
            { id: '102-1', description: 'Financial Reporting', qty: 1, unitPrice: 2200 },
            { id: '102-2', description: 'Advisory Session', qty: 3, unitPrice: 300 },
        ],
    },
];

@Injectable({
    providedIn: 'root',
})
export class MockInvoiceService {
    private readonly invoicesState = signal<Invoice[]>(MOCK_INVOICES);
    readonly invoices = this.invoicesState.asReadonly();

    getInvoiceById(id: number): Invoice | undefined {
        return this.invoicesState().find((invoice) => invoice.id === id);
    }

    markAsPaid(id: number): void {
        this.setStatus(id, 'paid');
    }

    setStatus(id: number, status: InvoiceStatus): void {
        this.invoicesState.update((invoices) =>
            invoices.map((invoice) =>
                invoice.id === id
                    ? {
                        ...invoice,
                        status,
                    }
                    : invoice
            )
        );
    }
}
