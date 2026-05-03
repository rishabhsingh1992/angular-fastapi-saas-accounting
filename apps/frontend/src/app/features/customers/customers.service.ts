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

    addCustomer(payload: Customer): void {
        this.http.post<Customer>('/customers', payload).subscribe(createdCustomer => {
            this.customersState.update(list => [...list, createdCustomer]);
        });
    }

    updateCustomer(payload: Customer): void {
        this.http.put<Customer>(`/customers/${payload.id}`, payload).subscribe(updatedCustomer => {
            this.customersState.update(list =>
                list.map(customer => (customer.id === updatedCustomer.id ? updatedCustomer : customer))
            );
        });
    }

    deleteCustomer(id: number): void {
        this.http.delete(`/customers/${id}`).subscribe(() => {
            this.customersState.update(list => list.filter(customer => customer.id !== id));
        });
    }

    persistCustomers(): void {}
}
