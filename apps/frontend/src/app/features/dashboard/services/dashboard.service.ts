import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class DashboardService {
    private readonly summaryState = signal({
        totalRevenue: 120000,
        totalInvoices: 45,
        totalCustomers: 12,
    });

    readonly summary = this.summaryState.asReadonly();
}
