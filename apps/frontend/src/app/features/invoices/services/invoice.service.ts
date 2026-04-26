import { DestroyRef, Injectable, computed, signal } from '@angular/core';
import { Invoice, InvoiceLineItem, InvoiceStatus, InvoiceSummary, INVOICE_TAX_RATE } from '../models/invoice.models';

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
export class InvoiceService {
    private static readonly currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    });

    private readonly invoicesState = signal<Invoice[]>(MOCK_INVOICES);
    private readonly toastMessageState = signal<string | null>(null);
    private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

    readonly invoices = this.invoicesState.asReadonly();
    readonly toastMessage = this.toastMessageState.asReadonly();

    getInvoiceById(id: number): Invoice | undefined {
        return this.invoicesState().find((invoice) => invoice.id === id);
    }

    getInvoiceSummary(invoice: Invoice | undefined): InvoiceSummary {
        if (!invoice) {
            return {
                subtotal: 0,
                taxAmount: 0,
                grandTotal: 0,
            };
        }

        const subtotal = this.calculateSubtotal(invoice.lineItems);
        const taxAmount = this.calculateTax(subtotal, INVOICE_TAX_RATE);

        return {
            subtotal,
            taxAmount,
            grandTotal: this.calculateGrandTotal(subtotal, taxAmount),
        };
    }

    calculateLineTotal(lineItem: InvoiceLineItem): number {
        return lineItem.qty * lineItem.unitPrice;
    }

    formatMoney(amount: number): string {
        return InvoiceService.currencyFormatter.format(amount);
    }

    markAsPaid(id: number): void {
        this.setStatus(id, 'paid');
    }

    triggerPdfToast(): void {
        if (this.toastTimeoutId) {
            clearTimeout(this.toastTimeoutId);
        }

        this.toastMessageState.set('PDF download coming soon');
        this.toastTimeoutId = setTimeout(() => {
            this.toastMessageState.set(null);
            this.toastTimeoutId = null;
        }, 2200);
    }

    registerDestroy(destroyRef: DestroyRef): void {
        destroyRef.onDestroy(() => this.dispose());
    }

    private dispose(): void {
        if (this.toastTimeoutId) {
            clearTimeout(this.toastTimeoutId);
            this.toastTimeoutId = null;
        }
    }

    private setStatus(id: number, status: InvoiceStatus): void {
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

    private calculateSubtotal(lineItems: InvoiceLineItem[]): number {
        return lineItems.reduce((sum, lineItem) => sum + this.calculateLineTotal(lineItem), 0);
    }

    private calculateTax(subtotal: number, taxRate: number): number {
        return subtotal * taxRate;
    }

    private calculateGrandTotal(subtotal: number, taxAmount: number): number {
        return subtotal + taxAmount;
    }
}
