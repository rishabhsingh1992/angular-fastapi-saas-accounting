import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

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
		canActivate: [authGuard],
		loadChildren: () =>
			import('./features/dashboard/dashboard.routes').then((m) => m.DASHBOARD_ROUTES),
	},
	{
		path: 'invoices',
		canActivate: [authGuard],
		loadChildren: () => import('./features/invoices/invoices.routes').then((m) => m.INVOICES_ROUTES),
	},
	{
		path: 'expenses',
		canActivate: [authGuard],
		loadChildren: () => import('./features/expenses/expenses.routes').then((m) => m.EXPENSES_ROUTES),
	},
	{
		path: 'reports',
		canActivate: [authGuard],
		loadChildren: () => import('./features/reports/reports.routes').then((m) => m.REPORTS_ROUTES),
	},
	{
		path: 'settings',
		canActivate: [authGuard],
		loadChildren: () => import('./features/settings/settings.routes').then((m) => m.SETTINGS_ROUTES),
	},
	{
		path: 'billing',
		canActivate: [authGuard],
		loadChildren: () => import('./features/billing/billing.routes').then((m) => m.BILLING_ROUTES),
	},
	{
		path: 'customers',
		canActivate: [authGuard],
		loadChildren: () => import('./features/customers/customers.routes').then((m) => m.CUSTOMERS_ROUTES),
	},
	{
		path: 'overview',
		canActivate: [authGuard],
		loadChildren: () => import('./features/overview/overview.routes').then((m) => m.OVERVIEW_ROUTES),
	},
	{
		path: '**',
		loadComponent: () =>
			import('./features/not-found/not-found.page').then((m) => m.NotFoundPage),
	},
];
