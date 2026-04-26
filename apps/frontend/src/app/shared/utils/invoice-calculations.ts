import { InvoiceLineItem } from '../models/invoice.models';

export function calculateLineTotal(lineItem: InvoiceLineItem): number {
    return lineItem.qty * lineItem.unitPrice;
}

export function calculateSubtotal(lineItems: InvoiceLineItem[]): number {
    return lineItems.reduce((sum, lineItem) => sum + calculateLineTotal(lineItem), 0);
}

export function calculateTax(subtotal: number, taxRate: number): number {
    return subtotal * taxRate;
}

export function calculateGrandTotal(subtotal: number, taxAmount: number): number {
    return subtotal + taxAmount;
}
