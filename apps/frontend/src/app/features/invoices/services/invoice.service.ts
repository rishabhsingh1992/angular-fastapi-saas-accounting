import { DestroyRef, Injectable, computed, signal } from '@angular/core';
import { Invoice, InvoiceLineItem, InvoiceStatus, InvoiceSummary, INVOICE_TAX_RATE } from '../models/invoice.models';

const MOCK_INVOICES: Invoice[] = [
    { id: 101, invoiceNumber: 'INV-2026-001', clientName: 'Globex Ltd', clientEmail: 'billing@globex.com', issueDate: '2026-04-08', dueDate: '2026-04-22', status: 'paid', lineItems: [{ id: '1', description: 'Consulting', qty: 10, unitPrice: 1250 }] },
    { id: 102, invoiceNumber: 'INV-2026-002', clientName: 'Initech', clientEmail: 'accounts@initech.com', issueDate: '2026-03-27', dueDate: '2026-04-10', status: 'overdue', lineItems: [{ id: '1', description: 'Software Development', qty: 1, unitPrice: 8200 }] },
    { id: 103, invoiceNumber: 'INV-2026-003', clientName: 'Umbrella Corp', clientEmail: 'finance@umbrella.com', issueDate: '2026-04-15', dueDate: '2026-04-30', status: 'sent', lineItems: [{ id: '1', description: 'Security Audit', qty: 1, unitPrice: 15000 }] },
    { id: 104, invoiceNumber: 'INV-2026-004', clientName: 'Stark Industries', clientEmail: 'ap@stark.com', issueDate: '2026-04-04', dueDate: '2026-04-18', status: 'paid', lineItems: [{ id: '1', description: 'Arc Reactor Maintenance', qty: 1, unitPrice: 6800 }] },
    { id: 105, invoiceNumber: 'INV-2026-005', clientName: 'Wayne Enterprises', clientEmail: 'billing@wayne.com', issueDate: '2026-04-21', dueDate: '2026-05-05', status: 'draft', lineItems: [{ id: '1', description: 'Gadget R&D', qty: 1, unitPrice: 9400 }] },
    { id: 106, invoiceNumber: 'INV-2026-006', clientName: 'Oscorp', clientEmail: 'finance@oscorp.com', issueDate: '2026-04-01', dueDate: '2026-04-15', status: 'paid', lineItems: [{ id: '1', description: 'Bio-chemical Research', qty: 1, unitPrice: 22000 }] },
    { id: 107, invoiceNumber: 'INV-2026-007', clientName: 'Cyberdyne Systems', clientEmail: 'ap@cyberdyne.com', issueDate: '2026-03-22', dueDate: '2026-04-05', status: 'overdue', lineItems: [{ id: '1', description: 'AI Development', qty: 1, unitPrice: 17500 }] },
    { id: 108, invoiceNumber: 'INV-2026-008', clientName: 'Massive Dynamic', issueDate: '2026-04-17', dueDate: '2026-05-01', status: 'sent', clientEmail: 'billing@massive.com', lineItems: [{ id: '1', description: 'Fringe Science', qty: 1, unitPrice: 11200 }] },
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

    getInvoiceSummary(invoice: Invoice | undefined | Partial<Invoice>): InvoiceSummary {
        if (!invoice || !invoice.lineItems) {
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

    createInvoice(invoice: Omit<Invoice, 'id'>): Invoice {
        const newId = Math.max(0, ...this.invoicesState().map(i => i.id)) + 1;
        const newInvoice: Invoice = { ...invoice, id: newId };
        this.invoicesState.update(list => [...list, newInvoice]);
        return newInvoice;
    }

    deleteInvoice(id: number): void {
        this.invoicesState.update(list => list.filter(i => i.id !== id));
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
