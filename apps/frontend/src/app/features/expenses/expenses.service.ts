import { Injectable, signal } from '@angular/core';

export type ExpenseStatus = 'Pending' | 'Approved' | 'Rejected' | 'Reimbursed';

export interface Expense {
    id: number;
    description: string;
    amount: number;
    category: string;
    date: string; // ISO date string YYYY-MM-DD
    notes: string;
    status: ExpenseStatus;
}

const MOCK_EXPENSES: Expense[] = [
    { id: 1, description: 'Flight to Mumbai', amount: 12500, category: 'Travel', date: '2026-04-15', notes: 'Client visit', status: 'Approved' },
    { id: 2, description: 'Team lunch', amount: 3200, category: 'Meals', date: '2026-04-18', notes: '', status: 'Pending' },
    { id: 3, description: 'Adobe Creative Suite', amount: 5000, category: 'Software', date: '2026-04-20', notes: 'Annual subscription', status: 'Reimbursed' },
    { id: 4, description: 'Office stationery', amount: 1800, category: 'Office Supplies', date: '2026-04-22', notes: '', status: 'Pending' },
    { id: 5, description: 'Google Ads campaign', amount: 25000, category: 'Marketing', date: '2026-04-25', notes: 'Q2 campaign', status: 'Approved' },
    { id: 6, description: 'Taxi to airport', amount: 850, category: 'Travel', date: '2026-04-28', notes: '', status: 'Pending' },
    { id: 7, description: 'Client dinner', amount: 6500, category: 'Meals', date: '2026-04-30', notes: 'Prospect meeting', status: 'Rejected' },
    { id: 8, description: 'Zoom subscription', amount: 1400, category: 'Software', date: '2026-05-01', notes: '', status: 'Reimbursed' },
    { id: 9, description: 'Printer cartridges', amount: 2100, category: 'Office Supplies', date: '2026-05-02', notes: '', status: 'Pending' },
    { id: 10, description: 'Hotel stay - Bangalore', amount: 8900, category: 'Travel', date: '2026-05-03', notes: 'Annual conference', status: 'Approved' },
];

@Injectable({ providedIn: 'root' })
export class ExpensesService {
    private readonly _expenses = signal<Expense[]>([...MOCK_EXPENSES]);

    readonly expenses = this._expenses.asReadonly();

    addExpense(data: Omit<Expense, 'id'>): void {
        this._expenses.update(list => [...list, { ...data, id: Date.now() }]);
    }

    updateStatus(id: number, status: ExpenseStatus): void {
        this._expenses.update(list =>
            list.map(e => e.id === id ? { ...e, status } : e)
        );
    }

    deleteExpense(id: number): void {
        this._expenses.update(list => list.filter(e => e.id !== id));
    }
}
