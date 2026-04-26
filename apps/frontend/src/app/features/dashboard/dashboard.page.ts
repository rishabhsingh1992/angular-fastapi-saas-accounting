import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { DashboardService } from './services/dashboard.service';
import { BackendHealthService } from '../../core/services/backend-health.service';
import { BackendHealthResponse } from '../../core/models/health.models';
import { ThemeService } from '../../core/services/theme.service';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineElement,
    LineController,
    PointElement,
    Filler,
    Tooltip,
    Legend
);

interface RevenueChartRow { month: string; revenue: number; }
interface RecentInvoiceRow { id: string; client: string; amount: number; status: string; date: string; }
interface QuickAction { label: string; icon: string; route: string; }

@Component({
    selector: 'app-dashboard-page',
    imports: [MatCardModule, MatButtonModule, MatChipsModule, MatIconModule, MatProgressSpinnerModule, MatTableModule, RouterLink, BaseChartDirective],
    templateUrl: './dashboard.page.html',
    styleUrl: './dashboard.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardPage implements OnInit {
    private readonly dashboardService = inject(DashboardService);
    private readonly backendHealthService = inject(BackendHealthService);
    private readonly themeService = inject(ThemeService);

    protected readonly summary = this.dashboardService.summary;
    protected readonly healthStatus = signal<'loading' | 'up' | 'down'>('loading');
    protected readonly healthMessage = signal('Checking backend connection...');

    protected readonly revenueChart: RevenueChartRow[] = [
        { month: 'Nov', revenue: 38000 },
        { month: 'Dec', revenue: 52000 },
        { month: 'Jan', revenue: 41000 },
        { month: 'Feb', revenue: 67000 },
        { month: 'Mar', revenue: 59000 },
        { month: 'Apr', revenue: 82000 },
    ];

    protected readonly recentInvoices: RecentInvoiceRow[] = [
        { id: 'INV-001', client: 'Globex Ltd', amount: 12500, status: 'Paid', date: 'Apr 22, 2026' },
        { id: 'INV-002', client: 'Initech', amount: 8200, status: 'Overdue', date: 'Apr 18, 2026' },
        { id: 'INV-003', client: 'Umbrella Corp', amount: 15000, status: 'Sent', date: 'Apr 15, 2026' },
        { id: 'INV-004', client: 'Stark Industries', amount: 6800, status: 'Paid', date: 'Apr 10, 2026' },
        { id: 'INV-005', client: 'Wayne Enterprises', amount: 9400, status: 'Draft', date: 'Apr 08, 2026' },
    ];

    protected readonly quickActions: QuickAction[] = [
        { label: 'New Invoice', icon: 'add_circle', route: '/invoices/new' },
        { label: 'View Reports', icon: 'bar_chart', route: '/reports' },
        { label: 'All Invoices', icon: 'receipt_long', route: '/invoices' },
        { label: 'Settings', icon: 'settings', route: '/settings' },
    ];

    protected readonly invoiceColumns: string[] = ['id', 'client', 'date', 'amount', 'status'];

    protected readonly lineChartType: 'line' = 'line';
    protected lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
    protected readonly lineChartOptions = signal<ChartConfiguration<'line'>['options']>({
        responsive: true,
        plugins: { legend: { display: false, labels: { color: '#616161' } } },
        scales: {
            x: {
                ticks: { color: '#616161' },
                grid: { color: 'rgba(0,0,0,0.1)' },
            },
            y: {
                ticks: {
                    color: '#616161',
                    callback: (v: string | number) => `₹${Number(v).toLocaleString('en-IN')}`,
                },
                grid: { color: 'rgba(0,0,0,0.1)' },
            },
        },
    });

    constructor() {
        this.refreshHealth();

        effect(() => {
            this.themeService.isDarkMode()();
            this.updateChartColors();
        });
    }

    ngOnInit(): void {
        this.lineChartData = {
            labels: this.revenueChart.map((r) => r.month),
            datasets: [
                {
                    data: this.revenueChart.map((r) => r.revenue),
                    label: 'Revenue',
                    fill: true,
                    tension: 0.4,
                    borderColor: '#6750A4',
                    backgroundColor: 'rgba(103,80,164,0.15)',
                    pointRadius: 4,
                },
            ],
        };

        this.updateChartColors();
    }

    protected formatCurrency(amount: number): string {
        return `₹${amount.toLocaleString('en-IN')}`;
    }

    protected statusClass(status: string): string {
        return `invoice-status-${status.toLowerCase()}`;
    }

    protected refreshHealth(): void {
        this.healthStatus.set('loading');
        this.healthMessage.set('Checking backend connection...');

        this.backendHealthService.checkHealth().subscribe({
            next: (response) => this.onHealthSuccess(response),
            error: () => this.onHealthError(),
        });
    }

    private onHealthSuccess(response: BackendHealthResponse): void {
        this.healthStatus.set('up');
        this.healthMessage.set(`${response.service} v${response.version} (${response.environment})`);
    }

    private onHealthError(): void {
        this.healthStatus.set('down');
        this.healthMessage.set('Backend is unreachable. Confirm API server is running on port 8000.');
    }

    private updateChartColors(): void {
        const dark = this.themeService.isDarkMode()();
        const gridColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const textColor = dark ? '#E0E0E0' : '#616161';

        this.lineChartOptions.set({
            responsive: true,
            plugins: {
                legend: {
                    display: false,
                    labels: { color: textColor },
                },
            },
            scales: {
                x: {
                    ticks: { color: textColor },
                    grid: { color: gridColor },
                },
                y: {
                    ticks: {
                        color: textColor,
                        callback: (value: string | number) => `₹${Number(value).toLocaleString('en-IN')}`,
                    },
                    grid: { color: gridColor },
                },
            },
        });
    }
}
