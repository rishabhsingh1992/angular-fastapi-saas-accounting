import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { INVOICE_TAX_RATE } from '../shared/models/invoice.models';
import { MockInvoiceService } from '../shared/services/mock-invoice.service';
import {
    calculateGrandTotal,
    calculateLineTotal,
    calculateSubtotal,
    calculateTax,
} from '../shared/utils/invoice-calculations';

@Component({
    selector: 'app-invoice-detail-page',
    imports: [RouterLink],
    template: `
    <section class="page">
      <a class="back-link" routerLink="/invoices">Back to invoices</a>

      @if (invoice(); as currentInvoice) {
        <header class="invoice-header">
          <div>
            <h1>{{ currentInvoice.invoiceNumber }}</h1>
            <p>{{ currentInvoice.clientName }} · {{ currentInvoice.clientEmail }}</p>
            <p>Issue: {{ currentInvoice.issueDate }} | Due: {{ currentInvoice.dueDate }}</p>
          </div>

          <div class="actions">
            <span class="badge" [class.paid]="currentInvoice.status === 'paid'">{{ currentInvoice.status }}</span>
            <button type="button" (click)="markAsPaid()" [disabled]="currentInvoice.status === 'paid'">
              Mark as Paid
            </button>
            <button type="button" class="secondary" (click)="downloadPdf()">Download PDF</button>
          </div>
        </header>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Qty</th>
              <th>Unit Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            @for (line of currentInvoice.lineItems; track line.id) {
              <tr>
                <td>{{ line.description }}</td>
                <td>{{ line.qty }}</td>
                <td>{{ formatMoney(line.unitPrice) }}</td>
                <td>{{ formatMoney(calculateLineTotal(line)) }}</td>
              </tr>
            }
          </tbody>
        </table>

        <section class="totals">
          <p><span>Subtotal</span><strong>{{ formatMoney(summary().subtotal) }}</strong></p>
          <p><span>Tax (18%)</span><strong>{{ formatMoney(summary().taxAmount) }}</strong></p>
          <p class="grand-total"><span>Grand Total</span><strong>{{ formatMoney(summary().grandTotal) }}</strong></p>
        </section>
      } @else {
        <h1>Invoice not found</h1>
        <p>This invoice id does not exist in mock data.</p>
      }

      @if (toastMessage()) {
        <div class="toast">{{ toastMessage() }}</div>
      }
    </section>
  `,
    styles: [
        `
      .page {
        padding: 24px;
      }

      .back-link {
        display: inline-block;
        margin-bottom: 16px;
        color: #2563eb;
        text-decoration: none;
      }

      .invoice-header {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 16px;
        margin-bottom: 16px;
      }

      .invoice-header h1 {
        margin: 0 0 6px;
      }

      .invoice-header p {
        margin: 0 0 4px;
        color: #475569;
      }

      .actions {
        display: grid;
        gap: 8px;
        justify-items: end;
      }

      .badge {
        display: inline-block;
        text-transform: uppercase;
        font-size: 0.75rem;
        font-weight: 700;
        color: #854d0e;
        background: #fef3c7;
        border-radius: 999px;
        padding: 4px 10px;
      }

      .badge.paid {
        color: #166534;
        background: #dcfce7;
      }

      button {
        border: 1px solid #cbd5e1;
        background: #0f172a;
        color: #fff;
        border-radius: 8px;
        padding: 8px 12px;
        cursor: pointer;
      }

      button.secondary {
        background: #fff;
        color: #0f172a;
      }

      button:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }

      table {
        width: 100%;
        border-collapse: collapse;
        border: 1px solid #e2e8f0;
        background: #fff;
      }

      th,
      td {
        text-align: left;
        padding: 10px 12px;
        border-bottom: 1px solid #e2e8f0;
      }

      th {
        font-weight: 600;
        color: #475569;
      }

      tbody tr:last-child td {
        border-bottom: 0;
      }

      .totals {
        width: min(320px, 100%);
        margin-left: auto;
        margin-top: 16px;
      }

      .totals p {
        display: flex;
        justify-content: space-between;
        margin: 8px 0;
      }

      .grand-total {
        border-top: 1px solid #e2e8f0;
        padding-top: 10px;
      }

      .toast {
        position: fixed;
        right: 20px;
        bottom: 20px;
        background: #0f172a;
        color: #fff;
        border-radius: 8px;
        padding: 10px 14px;
      }
    `,
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailPage {
    private static readonly currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 2,
    });

    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly invoiceService = inject(MockInvoiceService);

    private toastTimeoutId: ReturnType<typeof setTimeout> | null = null;

    private readonly routeInvoiceId = toSignal(
        this.route.paramMap.pipe(
            map((params) => Number(params.get('id'))),
            filter((id) => !Number.isNaN(id))
        ),
        { initialValue: -1 }
    );

    protected readonly toastMessage = signal<string | null>(null);
    protected readonly calculateLineTotal = calculateLineTotal;

    protected readonly invoice = computed(() => this.invoiceService.getInvoiceById(this.routeInvoiceId()));

    protected readonly summary = computed(() => {
        const currentInvoice = this.invoice();
        if (!currentInvoice) {
            return {
                subtotal: 0,
                taxAmount: 0,
                grandTotal: 0,
            };
        }

        const subtotal = calculateSubtotal(currentInvoice.lineItems);
        const taxAmount = calculateTax(subtotal, INVOICE_TAX_RATE);

        return {
            subtotal,
            taxAmount,
            grandTotal: calculateGrandTotal(subtotal, taxAmount),
        };
    });

    constructor() {
        this.destroyRef.onDestroy(() => {
            if (this.toastTimeoutId) {
                clearTimeout(this.toastTimeoutId);
            }
        });
    }

    protected markAsPaid(): void {
        const currentInvoice = this.invoice();
        if (!currentInvoice || currentInvoice.status === 'paid') {
            return;
        }

        this.invoiceService.markAsPaid(currentInvoice.id);
    }

    protected downloadPdf(): void {
        if (this.toastTimeoutId) {
            clearTimeout(this.toastTimeoutId);
        }

        this.toastMessage.set('PDF download coming soon');
        this.toastTimeoutId = setTimeout(() => {
            this.toastMessage.set(null);
            this.toastTimeoutId = null;
        }, 2200);
    }

    protected formatMoney(amount: number): string {
        return InvoiceDetailPage.currencyFormatter.format(amount);
    }
}
