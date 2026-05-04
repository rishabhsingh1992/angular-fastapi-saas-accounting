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
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Expense, ExpenseStatus, ExpensesService } from './expenses.service';

// ── ADD EXPENSE DIALOG ──────────────────────────────────────────────────────
@Component({
    selector: 'app-expense-form-dialog',
    imports: [
        ReactiveFormsModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
    ],
    template: `
        <h2 mat-dialog-title>Add Expense</h2>

        <mat-dialog-content>
            <form [formGroup]="form" class="expense-form">
                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Description</mat-label>
                    <input matInput formControlName="description" placeholder="What was this expense for?" />
                    @if (form.get('description')?.hasError('required') && form.get('description')?.touched) {
                        <mat-error>Description is required</mat-error>
                    }
                </mat-form-field>

                <div class="form-row">
                    <mat-form-field appearance="outline">
                        <mat-label>Amount (₹)</mat-label>
                        <input matInput type="number" formControlName="amount" min="1" />
                        @if (form.get('amount')?.invalid && form.get('amount')?.touched) {
                            <mat-error>Enter a valid amount</mat-error>
                        }
                    </mat-form-field>

                    <mat-form-field appearance="outline">
                        <mat-label>Date</mat-label>
                        <input matInput type="date" formControlName="date" />
                        @if (form.get('date')?.hasError('required') && form.get('date')?.touched) {
                            <mat-error>Date is required</mat-error>
                        }
                    </mat-form-field>
                </div>

                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Category</mat-label>
                    <mat-select formControlName="category">
                        @for (cat of categories; track cat) {
                            <mat-option [value]="cat">{{ cat }}</mat-option>
                        }
                    </mat-select>
                </mat-form-field>

                <mat-form-field appearance="outline" class="full-width">
                    <mat-label>Notes</mat-label>
                    <textarea matInput formControlName="notes" rows="2"
                        placeholder="Optional notes or justification..."></textarea>
                </mat-form-field>
            </form>
        </mat-dialog-content>

        <mat-dialog-actions align="end">
            <button mat-button type="button" mat-dialog-close>Cancel</button>
            <button mat-flat-button color="primary" type="button" (click)="submit()">Add Expense</button>
        </mat-dialog-actions>
    `,
    styles: [`
        .expense-form {
            display: grid;
            gap: 4px;
            min-width: 480px;
            padding: 4px 0;
        }
        .full-width { width: 100%; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        @media (max-width: 560px) {
            .expense-form { min-width: unset; }
            .form-row { grid-template-columns: 1fr; }
        }
    `],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpenseFormDialog {
    private readonly dialogRef = inject(MatDialogRef<ExpenseFormDialog>);
    private readonly fb = inject(FormBuilder);

    protected readonly categories = ['Travel', 'Meals', 'Office Supplies', 'Software', 'Marketing', 'Other'];

    protected readonly form = this.fb.nonNullable.group({
        description: ['', Validators.required],
        amount: [0, [Validators.required, Validators.min(1)]],
        date: [new Date().toISOString().split('T')[0], Validators.required],
        category: ['Travel', Validators.required],
        notes: [''],
    });

    protected submit(): void {
        if (this.form.invalid) {
            this.form.markAllAsTouched();
            return;
        }
        const v = this.form.getRawValue();
        this.dialogRef.close({
            description: v.description,
            amount: Number(v.amount),
            date: v.date,
            category: v.category,
            notes: v.notes,
            status: 'Pending' as ExpenseStatus,
        } satisfies Omit<Expense, 'id'>);
    }
}

// ── EXPENSES PAGE ───────────────────────────────────────────────────────────
@Component({
    selector: 'app-expenses-page',
    imports: [
        MatButtonModule,
        MatCardModule,
        MatChipsModule,
        MatDialogModule,
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
    templateUrl: './expenses.page.html',
    styleUrl: './expenses.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExpensesPage implements AfterViewInit {
    private readonly expensesService = inject(ExpensesService);
    private readonly dialog = inject(MatDialog);
    private readonly snackBar = inject(MatSnackBar);

    @ViewChild(MatPaginator) private paginator!: MatPaginator;

    protected readonly filterSearch = signal('');
    protected readonly filterCategory = signal('');
    protected readonly filterStatus = signal('');
    protected readonly sortBy = signal('');

    protected readonly filteredExpenses = computed(() => {
        const q = this.filterSearch().toLowerCase().trim();
        const cat = this.filterCategory();
        const status = this.filterStatus();
        const sort = this.sortBy();
        let list = [...this.expensesService.expenses()];

        if (q) {
            list = list.filter(e =>
                e.description.toLowerCase().includes(q) ||
                e.category.toLowerCase().includes(q) ||
                e.notes.toLowerCase().includes(q)
            );
        }
        if (cat && cat !== 'All') list = list.filter(e => e.category === cat);
        if (status && status !== 'All') list = list.filter(e => e.status === status);

        switch (sort) {
            case 'date_desc': list.sort((a, b) => b.date.localeCompare(a.date)); break;
            case 'date_asc':  list.sort((a, b) => a.date.localeCompare(b.date)); break;
            case 'amt_desc':  list.sort((a, b) => b.amount - a.amount); break;
            case 'amt_asc':   list.sort((a, b) => a.amount - b.amount); break;
        }

        return list;
    });

    protected readonly totalSpend = computed(() =>
        this.filteredExpenses().reduce((s, e) => s + e.amount, 0)
    );
    protected readonly pendingCount = computed(() =>
        this.filteredExpenses().filter(e => e.status === 'Pending').length
    );
    protected readonly pendingAmount = computed(() =>
        this.filteredExpenses().filter(e => e.status === 'Pending').reduce((s, e) => s + e.amount, 0)
    );
    protected readonly approvedCount = computed(() =>
        this.filteredExpenses().filter(e => e.status === 'Approved').length
    );
    protected readonly reimbursedCount = computed(() =>
        this.filteredExpenses().filter(e => e.status === 'Reimbursed').length
    );
    protected readonly hasActiveFilter = computed(() =>
        !!(
            this.filterSearch() ||
            (this.filterCategory() && this.filterCategory() !== 'All') ||
            (this.filterStatus() && this.filterStatus() !== 'All') ||
            this.sortBy()
        )
    );

    protected readonly displayedColumns = ['description', 'category', 'amount', 'date', 'status', 'actions'];
    protected readonly categoryOptions = ['All', 'Travel', 'Meals', 'Office Supplies', 'Software', 'Marketing', 'Other'];
    protected readonly statusOptions = ['All', 'Pending', 'Approved', 'Rejected', 'Reimbursed'];
    protected readonly sortOptions = [
        { label: 'Date: Newest', value: 'date_desc' },
        { label: 'Date: Oldest', value: 'date_asc' },
        { label: 'Amount: High', value: 'amt_desc' },
        { label: 'Amount: Low', value: 'amt_asc' },
    ];

    readonly dataSource = new MatTableDataSource<Expense>([]);

    constructor() {
        effect(() => {
            this.dataSource.data = this.filteredExpenses();
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

    protected formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    }

    protected statusClass(status: string): string {
        return `status-chip-${status.toLowerCase()}`;
    }

    protected categoryIcon(category: string): string {
        const map: Record<string, string> = {
            Travel: 'flight',
            Meals: 'restaurant',
            'Office Supplies': 'inventory_2',
            Software: 'code',
            Marketing: 'campaign',
            Other: 'receipt',
        };
        return map[category] ?? 'receipt';
    }

    protected clearFilters(): void {
        this.filterSearch.set('');
        this.filterCategory.set('');
        this.filterStatus.set('');
        this.sortBy.set('');
    }

    protected openAddDialog(): void {
        const ref = this.dialog.open(ExpenseFormDialog, {
            width: '560px',
            maxWidth: '95vw',
        });
        ref.afterClosed().subscribe((result: Omit<Expense, 'id'> | undefined) => {
            if (!result) return;
            this.expensesService.addExpense(result);
            this.snackBar.open('Expense added', 'Close', {
                duration: 2200,
                horizontalPosition: 'end',
                verticalPosition: 'top',
            });
        });
    }

    protected approve(expense: Expense): void {
        this.expensesService.updateStatus(expense.id, 'Approved');
        this.snackBar.open('Expense approved', 'Close', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    }

    protected reject(expense: Expense): void {
        this.expensesService.updateStatus(expense.id, 'Rejected');
        this.snackBar.open('Expense rejected', 'Close', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    }

    protected markReimbursed(expense: Expense): void {
        this.expensesService.updateStatus(expense.id, 'Reimbursed');
        this.snackBar.open('Marked as reimbursed', 'Close', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    }

    protected deleteExpense(expense: Expense): void {
        this.expensesService.deleteExpense(expense.id);
        this.snackBar.open('Expense deleted', 'Close', { duration: 2000, horizontalPosition: 'end', verticalPosition: 'top' });
    }
}
