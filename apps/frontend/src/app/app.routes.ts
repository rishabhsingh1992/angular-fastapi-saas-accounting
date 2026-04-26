import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'dashboard',
	},
	{
		path: '',
		loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
	},
	{
		path: 'dashboard',
		loadChildren: () =>
			import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
	},
	{
		path: 'invoices',
		loadChildren: () => import('./features/invoices/invoices.routes').then((m) => m.INVOICES_ROUTES),
	},
	{
		path: 'expenses',
		loadChildren: () => import('./features/expenses/expenses.routes').then((m) => m.EXPENSES_ROUTES),
	},
	{
		path: 'reports',
		loadChildren: () => import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
	},
	{
		path: 'settings',
		loadChildren: () => import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
	},
	{
		path: 'billing',
		loadChildren: () => import('./features/billing/billing.routes').then((m) => m.BILLING_ROUTES),
	},
	{
		path: 'customers',
		loadChildren: () => import('./features/customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES),
	},
	{
		path: 'overview',
		loadChildren: () => import('./features/overview/overview.routes').then((m) => m.OVERVIEW_ROUTES),
	},
	{
		path: '**',
		redirectTo: 'dashboard',
	},
];
