import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

export interface Customer {
    id: number;
    name: string;
    email: string;
}

@Injectable({
    providedIn: 'root',
})
export class CustomersService {
    private readonly http = inject(HttpClient);
    private readonly customersState = signal<Customer[]>([]);

    readonly customers = this.customersState.asReadonly();

    constructor() {
        this.http.get<Customer[]>('/customers').subscribe(customers => {
            this.customersState.set(customers);
        });
    }

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

    persistCustomers(): void {}
}
