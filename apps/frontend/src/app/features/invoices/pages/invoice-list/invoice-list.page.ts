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
import { RouterLink } from '@angular/router';
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

interface LocalInvoice {
    id: string;
    client: string;
    email: string;
    amount: number;
    status: string;
    dueDate: string;
    issuedDate: string;
}

const MOCK_INVOICES: LocalInvoice[] = [
    { id: 'INV-001', client: 'Globex Ltd', email: 'billing@globex.com', amount: 12500, status: 'Paid', dueDate: 'Apr 22, 2026', issuedDate: 'Apr 08, 2026' },
    { id: 'INV-002', client: 'Initech', email: 'accounts@initech.com', amount: 8200, status: 'Overdue', dueDate: 'Apr 10, 2026', issuedDate: 'Mar 27, 2026' },
    { id: 'INV-003', client: 'Umbrella Corp', email: 'finance@umbrella.com', amount: 15000, status: 'Sent', dueDate: 'Apr 30, 2026', issuedDate: 'Apr 15, 2026' },
    { id: 'INV-004', client: 'Stark Industries', email: 'ap@stark.com', amount: 6800, status: 'Paid', dueDate: 'Apr 18, 2026', issuedDate: 'Apr 04, 2026' },
    { id: 'INV-005', client: 'Wayne Enterprises', email: 'billing@wayne.com', amount: 9400, status: 'Draft', dueDate: 'May 05, 2026', issuedDate: 'Apr 21, 2026' },
    { id: 'INV-006', client: 'Oscorp', email: 'finance@oscorp.com', amount: 22000, status: 'Paid', dueDate: 'Apr 15, 2026', issuedDate: 'Apr 01, 2026' },
    { id: 'INV-007', client: 'Cyberdyne Systems', email: 'ap@cyberdyne.com', amount: 17500, status: 'Overdue', dueDate: 'Apr 05, 2026', issuedDate: 'Mar 22, 2026' },
    { id: 'INV-008', client: 'Massive Dynamic', email: 'billing@massive.com', amount: 11200, status: 'Sent', dueDate: 'May 01, 2026', issuedDate: 'Apr 17, 2026' },
    { id: 'INV-009', client: 'Weyland Corp', email: 'accounts@weyland.com', amount: 34000, status: 'Paid', dueDate: 'Apr 20, 2026', issuedDate: 'Apr 06, 2026' },
    { id: 'INV-010', client: 'Soylent Corp', email: 'finance@soylent.com', amount: 5600, status: 'Draft', dueDate: 'May 10, 2026', issuedDate: 'Apr 24, 2026' },
    { id: 'INV-011', client: 'Rekall Inc', email: 'billing@rekall.com', amount: 8900, status: 'Paid', dueDate: 'Apr 12, 2026', issuedDate: 'Mar 29, 2026' },
    { id: 'INV-012', client: 'Tyrell Corp', email: 'ap@tyrell.com', amount: 41000, status: 'Overdue', dueDate: 'Apr 02, 2026', issuedDate: 'Mar 19, 2026' },
];

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

    @ViewChild(MatPaginator) private paginator!: MatPaginator;

    private readonly invoicesSignal = signal<LocalInvoice[]>([...MOCK_INVOICES]);

    protected readonly filterSearch = signal('');
    protected readonly filterStatus = signal('');
    protected readonly sortBy = signal('');

    protected readonly filteredInvoices = computed(() => {
        const q = this.filterSearch().toLowerCase().trim();
        const status = this.filterStatus();
        const sort = this.sortBy();
        let list = [...this.invoicesSignal()];

        if (q) {
            list = list.filter(
                (i) => i.client.toLowerCase().includes(q) || i.id.toLowerCase().includes(q)
            );
        }

        if (status && status !== 'All') {
            list = list.filter((i) => i.status === status);
        }

        switch (sort) {
            case 'date_desc':
                list.sort((a, b) => new Date(b.issuedDate).getTime() - new Date(a.issuedDate).getTime());
                break;
            case 'date_asc':
                list.sort((a, b) => new Date(a.issuedDate).getTime() - new Date(b.issuedDate).getTime());
                break;
            case 'amt_desc':
                list.sort((a, b) => b.amount - a.amount);
                break;
            case 'amt_asc':
                list.sort((a, b) => a.amount - b.amount);
                break;
        }

        return list;
    });

    protected readonly totalAmount = computed(() =>
        this.filteredInvoices().reduce((sum, i) => sum + i.amount, 0)
    );
    protected readonly paidCount = computed(() =>
        this.filteredInvoices().filter((i) => i.status === 'Paid').length
    );
    protected readonly overdueCount = computed(() =>
        this.filteredInvoices().filter((i) => i.status === 'Overdue').length
    );
    protected readonly draftCount = computed(() =>
        this.filteredInvoices().filter((i) => i.status === 'Draft').length
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

    readonly dataSource = new MatTableDataSource<LocalInvoice>([]);

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

    protected formatCurrency(amount: number): string {
        return `₹${amount.toLocaleString('en-IN')}`;
    }

    protected statusClass(status: string): string {
        return `status-chip-${status.toLowerCase()}`;
    }

    protected clientInitial(name: string): string {
        return name.charAt(0).toUpperCase();
    }

    protected clearFilters(): void {
        this.filterSearch.set('');
        this.filterStatus.set('');
        this.sortBy.set('');
    }

    protected newInvoice(): void {
        this.snackBar.open('Coming soon!', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }

    protected markAsPaid(invoice: LocalInvoice): void {
        this.invoicesSignal.update((list) =>
            list.map((i) => (i.id === invoice.id ? { ...i, status: 'Paid' } : i))
        );
        this.snackBar.open('Marked as paid', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }

    protected downloadPdf(): void {
        this.snackBar.open('Downloading...', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }

    protected deleteInvoice(invoice: LocalInvoice): void {
        this.invoicesSignal.update((list) => list.filter((i) => i.id !== invoice.id));
        this.snackBar.open('Deleted', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }
}
