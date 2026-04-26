import { Routes } from '@angular/router';

export const REPORTS_ROUTES: Routes = [
    {
        path: '',
        loadComponent: () => import('./reports.page').then((m) => m.ReportsPage),
        children: [
            {
                path: 'sales',
                loadComponent: () =>
                    import('./pages/sales/reports-sales.page').then((m) => m.ReportsSalesPage),
            },
            {
                path: 'finance',
                loadComponent: () =>
                    import('./pages/finance/reports-finance.page').then((m) => m.ReportsFinancePage),
            },
        ],
    },
];
