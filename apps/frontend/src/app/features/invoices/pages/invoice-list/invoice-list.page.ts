import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { InvoiceService } from '../../services/invoice.service';

@Component({
    selector: 'app-invoice-list-page',
    imports: [RouterLink],
    templateUrl: './invoice-list.page.html',
    styleUrl: './invoice-list.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListPage {
    private readonly invoiceService = inject(InvoiceService);

    protected readonly invoices = this.invoiceService.invoices;
}
