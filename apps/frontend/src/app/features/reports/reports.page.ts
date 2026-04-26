import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatNativeDateModule } from '@angular/material/core';

interface QuickStat {
    icon: string;
    label: string;
    value: string;
    tone: 'primary' | 'secondary' | 'tertiary' | 'neutral';
}

interface ExportRow {
    name: string;
    type: string;
    date: string;
}

@Component({
    selector: 'app-reports-page',
    imports: [
        RouterOutlet,
        RouterLink,
        MatCardModule,
        MatButtonModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatTableModule,
        MatTooltipModule,
        MatSnackBarModule,
    ],
    templateUrl: './reports.page.html',
    styleUrl: './reports.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsPage {
    private readonly snackBar = inject(MatSnackBar);

    protected startDate: Date | null = null;
    protected endDate: Date | null = null;

    protected readonly quickStats: QuickStat[] = [
        { icon: 'payments', label: 'Total Revenue', value: '₹4,82,000', tone: 'primary' },
        { icon: 'receipt_long', label: 'Invoices Raised', value: '124', tone: 'secondary' },
        { icon: 'check_circle', label: 'Amount Collected', value: '₹3,91,500', tone: 'tertiary' },
        { icon: 'pending_actions', label: 'Outstanding', value: '₹90,500', tone: 'neutral' },
    ];

    protected readonly displayedColumns: string[] = ['name', 'type', 'date', 'action'];

    protected readonly recentExports: ExportRow[] = [
        { name: 'Sales Report', type: 'PDF', date: 'Apr 20, 2026' },
        { name: 'Finance Report', type: 'Excel', date: 'Apr 15, 2026' },
        { name: 'Tax Summary', type: 'PDF', date: 'Apr 01, 2026' },
        { name: 'Sales Report', type: 'PDF', date: 'Mar 31, 2026' },
        { name: 'Finance Report', type: 'Excel', date: 'Mar 15, 2026' },
    ];

    protected applyDateRange(): void {
        this.snackBar.open('Date range applied', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }

    protected downloadReport(): void {
        this.snackBar.open('Downloading report...', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }
}
