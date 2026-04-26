import { Routes } from '@angular/router';

export const EXPENSES_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./expenses.page').then((m) => m.ExpensesPage),
    },
];
