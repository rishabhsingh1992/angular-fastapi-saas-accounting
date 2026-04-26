import { Routes } from '@angular/router';

export const routes: Routes = [
	{
		path: '',
		pathMatch: 'full',
		redirectTo: 'dashboard',
	},
	{
		path: 'dashboard',
		loadComponent: () => import('./pages/dashboard.page').then((m) => m.DashboardPage),
	},
	{
		path: 'invoices',
		loadComponent: () => import('./pages/invoices.page').then((m) => m.InvoicesPage),
	},
	{
		path: 'expenses',
		loadComponent: () => import('./pages/expenses.page').then((m) => m.ExpensesPage),
	},
	{
		path: 'reports',
		loadComponent: () => import('./pages/reports.page').then((m) => m.ReportsPage),
	},
	{
		path: 'settings',
		loadComponent: () => import('./pages/settings.page').then((m) => m.SettingsPage),
	},
	{
		path: '**',
		redirectTo: 'dashboard',
	},
];
