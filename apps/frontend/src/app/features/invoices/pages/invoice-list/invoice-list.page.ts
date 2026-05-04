import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    ViewChild,
    computed,
    effect,
    inject,
    signal,
} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice } from '../../models/invoice.models';

@Component({
    selector: 'app-invoice-list-page',
    imports: [
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatMenuModule,
        MatPaginatorModule,
        MatSelectModule,
        MatSnackBarModule,
        MatTableModule,
        MatTooltipModule,
    ],
    templateUrl: './invoice-list.page.html',
    styleUrl: './invoice-list.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceListPage implements AfterViewInit {
    private readonly snackBar = inject(MatSnackBar);
    private readonly router = inject(Router);
    private readonly invoiceService = inject(InvoiceService);

    @ViewChild(MatPaginator) private paginator!: MatPaginator;

    protected readonly filterSearch = signal('');
    protected readonly filterStatus = signal('');
    protected readonly sortBy = signal('');

    protected readonly filteredInvoices = computed(() => {
        const q = this.filterSearch().toLowerCase().trim();
        const status = this.filterStatus().toLowerCase();
        const sort = this.sortBy();
        let list = [...this.invoiceService.invoices()];

        if (q) {
            list = list.filter(
                (i) => i.clientName.toLowerCase().includes(q) || i.invoiceNumber.toLowerCase().includes(q)
            );
        }

        if (status && status !== 'all') {
            list = list.filter((i) => i.status === status);
        }

        switch (sort) {
            case 'date_desc':
                list.sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime());
                break;
            case 'date_asc':
                list.sort((a, b) => new Date(a.issueDate).getTime() - new Date(b.issueDate).getTime());
                break;
            case 'amt_desc':
                list.sort((a, b) => this.getInvoiceTotal(b) - this.getInvoiceTotal(a));
                break;
            case 'amt_asc':
                list.sort((a, b) => this.getInvoiceTotal(a) - this.getInvoiceTotal(b));
                break;
        }

        return list;
    });

    protected readonly totalAmount = computed(() =>
        this.filteredInvoices().reduce((sum, i) => sum + this.getInvoiceTotal(i), 0)
    );
    protected readonly paidCount = computed(() =>
        this.filteredInvoices().filter((i) => i.status === 'paid').length
    );
    protected readonly overdueCount = computed(() =>
        this.filteredInvoices().filter((i) => i.status === 'overdue').length
    );
    protected readonly draftCount = computed(() =>
        this.filteredInvoices().filter((i) => i.status === 'draft').length
    );
    protected readonly hasActiveFilter = computed(
        () =>
            !!(
                this.filterSearch() ||
                (this.filterStatus() && this.filterStatus() !== 'All') ||
                this.sortBy()
            )
    );

    protected readonly displayedColumns = ['id', 'client', 'amount', 'status', 'dueDate', 'actions'];

    protected readonly statusOptions = ['All', 'Paid', 'Overdue', 'Sent', 'Draft'];
    protected readonly sortOptions = [
        { label: 'Date: Newest', value: 'date_desc' },
        { label: 'Date: Oldest', value: 'date_asc' },
        { label: 'Amount: High', value: 'amt_desc' },
        { label: 'Amount: Low', value: 'amt_asc' },
    ];

    readonly dataSource = new MatTableDataSource<Invoice>([]);

    constructor() {
        effect(() => {
            this.dataSource.data = this.filteredInvoices();
            if (this.dataSource.paginator) {
                this.dataSource.paginator.firstPage();
            }
        });
    }

    ngAfterViewInit(): void {
        this.dataSource.paginator = this.paginator;
    }

    protected getInvoiceTotal(invoice: Invoice): number {
        return this.invoiceService.getInvoiceSummary(invoice).grandTotal;
    }

    protected formatCurrency(amount: number): string {
        return this.invoiceService.formatMoney(amount);
    }

    protected statusClass(status: string): string {
        return `status-chip-${status.toLowerCase()}`;
    }

    protected clientInitial(name: string): string {
        return name ? name.charAt(0).toUpperCase() : '?';
    }

    protected clearFilters(): void {
        this.filterSearch.set('');
        this.filterStatus.set('');
        this.sortBy.set('');
    }

    protected newInvoice(): void {
        this.router.navigate(['/invoices/create']);
    }

    protected markAsPaid(invoice: Invoice): void {
        this.invoiceService.markAsPaid(invoice.id);
        this.snackBar.open('Marked as paid', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }

    protected downloadPdf(): void {
        this.invoiceService.triggerPdfToast();
    }

    protected deleteInvoice(invoice: Invoice): void {
        this.invoiceService.deleteInvoice(invoice.id);
        this.snackBar.open('Deleted', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }
}
