import { Routes } from '@angular/router';

export const BILLING_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./billing.page').then((m) => m.BillingPage),
    },
];
