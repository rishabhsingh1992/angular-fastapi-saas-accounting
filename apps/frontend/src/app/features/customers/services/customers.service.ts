import { Injectable, signal } from '@angular/core';

export interface Customer {
    id: number;
    name: string;
    email: string;
}

const STORAGE_KEY = 'customers';
const MOCK_CUSTOMERS: Customer[] = [
    { id: 1, name: 'ABC Corp', email: 'abc@test.com' },
    { id: 2, name: 'XYZ Ltd', email: 'xyz@test.com' },
];

@Injectable({
    providedIn: 'root',
})
export class CustomersService {
    private readonly customersState = signal<Customer[]>(this.loadCustomers());
    private lastPersisted = JSON.stringify(this.customersState());

    readonly customers = this.customersState.asReadonly();

    addCustomer(customer: Customer): void {
        this.customersState.update(list => [...list, customer]);
    }

    updateCustomer(updatedCustomer: Customer): void {
        this.customersState.update(list =>
            list.map(customer => (customer.id === updatedCustomer.id ? updatedCustomer : customer))
        );
    }

    deleteCustomer(id: number): void {
        this.customersState.update(list => list.filter(customer => customer.id !== id));
    }

    persistCustomers(): void {
        const serialized = JSON.stringify(this.customersState());
        if (serialized === this.lastPersisted) {
            return;
        }

        localStorage.setItem(STORAGE_KEY, serialized);
        this.lastPersisted = serialized;
    }

    private loadCustomers(): Customer[] {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw === null) {
            return MOCK_CUSTOMERS;
        }

        try {
            const parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? (parsed as Customer[]) : MOCK_CUSTOMERS;
        } catch {
            return MOCK_CUSTOMERS;
        }
    }
}
