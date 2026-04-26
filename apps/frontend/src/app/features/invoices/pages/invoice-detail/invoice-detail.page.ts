import { ChangeDetectionStrategy, Component, computed, DestroyRef, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { InvoiceService } from '../../services/invoice.service';
import { InvoiceLineItem } from '../../models/invoice.models';

@Component({
    selector: 'app-invoice-detail-page',
    imports: [RouterLink],
    templateUrl: './invoice-detail.page.html',
    styleUrl: './invoice-detail.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceDetailPage {
    private readonly route = inject(ActivatedRoute);
    private readonly destroyRef = inject(DestroyRef);
    private readonly invoiceService = inject(InvoiceService);

    private readonly routeInvoiceId = toSignal(
        this.route.paramMap.pipe(
            map((params) => Number(params.get('id'))),
            filter((id) => !Number.isNaN(id))
        ),
        { initialValue: -1 }
    );

    protected readonly toastMessage = this.invoiceService.toastMessage;
    protected readonly calculateLineTotal = (lineItem: InvoiceLineItem) =>
        this.invoiceService.calculateLineTotal(lineItem);

    protected readonly invoice = computed(() => this.invoiceService.getInvoiceById(this.routeInvoiceId()));
    protected readonly summary = computed(() => this.invoiceService.getInvoiceSummary(this.invoice()));

    constructor() {
        this.invoiceService.registerDestroy(this.destroyRef);
    }

    protected markAsPaid(): void {
        const currentInvoice = this.invoice();
        if (!currentInvoice || currentInvoice.status === 'paid') {
            return;
        }

        this.invoiceService.markAsPaid(currentInvoice.id);
    }

    protected downloadPdf(): void {
        this.invoiceService.triggerPdfToast();
    }

    protected formatMoney(amount: number): string {
        return this.invoiceService.formatMoney(amount);
    }
}
