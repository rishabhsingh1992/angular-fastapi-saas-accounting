export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export interface InvoiceLineItem {
    id: string;
    description: string;
    qty: number;
    unitPrice: number;
}

export interface Invoice {
    id: number;
    invoiceNumber: string;
    clientName: string;
    clientEmail: string;
    issueDate: string;
    dueDate: string;
    status: InvoiceStatus;
    lineItems: InvoiceLineItem[];
}

export const INVOICE_TAX_RATE = 0.18;
