import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableModule } from '@angular/material/table';
import { InvoiceService } from '../../services/invoice.service';

@Component({
    selector: 'app-invoice-list-page',
    imports: [RouterLink, MatCardModule, MatTableModule, MatButtonModule, MatChipsModule],
    templateUrl: './invoice-list.page.html',
    styleUrl: './invoice-list.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListPage {
    private readonly invoiceService = inject(InvoiceService);

    protected readonly invoices = this.invoiceService.invoices;
}
