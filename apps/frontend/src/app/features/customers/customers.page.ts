import { ChangeDetectionStrategy, Component, effect, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CustomersService, Customer } from './services/customers.service';

@Component({
    selector: 'app-customers-page',
    imports: [MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDividerModule],
    templateUrl: './customers.page.html',
    styleUrl: './customers.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomersPage {
    private readonly customersService = inject(CustomersService);

    protected readonly customers = this.customersService.customers;

    // Form state signals
    protected readonly name = signal('');
    protected readonly email = signal('');
    protected readonly editingCustomerId = signal<number | null>(null);

    constructor() {
        effect(() => {
            this.customers();
            this.customersService.persistCustomers();
        });
    }

    addCustomer() {
        if (this.editingCustomerId() !== null) {
            this.saveEditedCustomer();
            return;
        }

        const name = this.name().trim();
        const email = this.email().trim();

        if (!name || !email) return;

        const newCustomer: Customer = {
            id: Date.now(),
            name,
            email
        };

        this.customersService.addCustomer(newCustomer);

        // reset form
        this.name.set('');
        this.email.set('');
    }

    startEdit(customer: Customer) {
        this.editingCustomerId.set(customer.id);
        this.name.set(customer.name);
        this.email.set(customer.email);
    }

    saveEditedCustomer() {
        const id = this.editingCustomerId();
        const name = this.name().trim();
        const email = this.email().trim();

        if (id === null || !name || !email) return;

        this.customersService.updateCustomer({
            id,
            name,
            email,
        });

        this.cancelEdit();
    }

    cancelEdit() {
        this.editingCustomerId.set(null);
        this.name.set('');
        this.email.set('');
    }

    deleteCustomer(id: number) {
        if (this.editingCustomerId() === id) {
            this.cancelEdit();
        }
        this.customersService.deleteCustomer(id);
    }
}
