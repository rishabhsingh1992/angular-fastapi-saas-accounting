import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';
import { InvoiceService } from '../../services/invoice.service';
import { Invoice, InvoiceLineItem } from '../../models/invoice.models';

@Component({
    selector: 'app-invoice-create-page',
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        RouterLink,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        MatDividerModule,
        MatNativeDateModule,
    ],
    templateUrl: './invoice-create.page.html',
    styleUrl: './invoice-create.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvoiceCreatePage {
    private readonly fb = inject(FormBuilder);
    private readonly router = inject(Router);
    private readonly snackBar = inject(MatSnackBar);
    private readonly invoiceService = inject(InvoiceService);

    protected readonly invoiceForm: FormGroup = this.fb.group({
        invoiceNumber: ['', Validators.required],
        clientName: ['', Validators.required],
        clientEmail: ['', [Validators.required, Validators.email]],
        issueDate: [new Date(), Validators.required],
        dueDate: [null, Validators.required],
        status: ['draft', Validators.required],
        lineItems: this.fb.array([]),
    });

    protected readonly statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'sent', label: 'Sent' },
        { value: 'overdue', label: 'Overdue' },
        { value: 'paid', label: 'Paid' },
    ];

    get lineItems(): FormArray {
        return this.invoiceForm.get('lineItems') as FormArray;
    }

    constructor() {
        // Add one empty line item by default
        this.addLineItem();
    }

    protected addLineItem(): void {
        const itemForm = this.fb.group({
            description: ['', Validators.required],
            qty: [1, [Validators.required, Validators.min(1)]],
            unitPrice: [0, [Validators.required, Validators.min(0)]],
        });
        this.lineItems.push(itemForm);
    }

    protected removeLineItem(index: number): void {
        if (this.lineItems.length > 1) {
            this.lineItems.removeAt(index);
        }
    }

    protected readonly summary = computed(() => {
        // We use a helper to get current form values as an Invoice object
        const items = this.lineItems.value as InvoiceLineItem[];
        return this.invoiceService.getInvoiceSummary({ lineItems: items });
    });

    protected formatMoney(amount: number): string {
        return this.invoiceService.formatMoney(amount);
    }

    protected onSubmit(): void {
        if (this.invoiceForm.invalid) {
            this.snackBar.open('Please fill all required fields', 'Close', { duration: 3000 });
            return;
        }

        const formValue = this.invoiceForm.value;
        // Format dates to ISO strings for the model
        const invoiceData: Omit<Invoice, 'id'> = {
            ...formValue,
            issueDate: formValue.issueDate.toISOString().split('T')[0],
            dueDate: formValue.dueDate.toISOString().split('T')[0],
            lineItems: formValue.lineItems.map((item: any, index: number) => ({
                ...item,
                id: `new-${Date.now()}-${index}`,
            })),
        };

        this.invoiceService.createInvoice(invoiceData);
        this.snackBar.open('Invoice created successfully', 'Close', { duration: 3000 });
        this.router.navigate(['/invoices']);
    }
}
