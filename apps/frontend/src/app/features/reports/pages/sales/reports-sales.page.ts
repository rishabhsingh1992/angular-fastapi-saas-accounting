import {
    AfterViewInit,
    ChangeDetectionStrategy,
    Component,
    OnInit,
    ViewChild,
    effect,
    inject,
    signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    DoughnutController,
    Legend,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { ThemeService } from '../../../../core/services/theme.service';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    DoughnutController,
    ArcElement,
    Tooltip,
    Legend
);

interface MonthlyRevenueRow {
    month: string;
    revenue: number;
    invoices: number;
}

interface TopClientRow {
    rank: number;
    name: string;
    invoices: number;
    revenue: number;
    paid: number;
    outstanding: number;
}

interface InvoiceStatusRow {
    status: string;
    count: number;
    amount: number;
}

interface KpiItem {
    icon: string;
    label: string;
    value: string;
}

@Component({
    selector: 'app-reports-sales-page',
    imports: [
        RouterLink,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatChipsModule,
        MatIconModule,
        MatListModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        BaseChartDirective,
    ],
    templateUrl: './reports-sales.page.html',
    styleUrl: './reports-sales.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsSalesPage implements OnInit, AfterViewInit {
    private readonly snackBar = inject(MatSnackBar);
    private readonly themeService = inject(ThemeService);

    @ViewChild(MatSort) private sort!: MatSort;

    protected selectedRange = '6M';

    protected readonly monthlyRevenue: MonthlyRevenueRow[] = [
        { month: 'Nov', revenue: 38000, invoices: 18 },
        { month: 'Dec', revenue: 52000, invoices: 24 },
        { month: 'Jan', revenue: 41000, invoices: 19 },
        { month: 'Feb', revenue: 67000, invoices: 31 },
        { month: 'Mar', revenue: 59000, invoices: 27 },
        { month: 'Apr', revenue: 82000, invoices: 38 },
    ];

    protected readonly topClients: TopClientRow[] = [
        { rank: 1, name: 'Globex Ltd', invoices: 14, revenue: 94000, paid: 94000, outstanding: 0 },
        { rank: 2, name: 'Initech', invoices: 11, revenue: 78000, paid: 62000, outstanding: 16000 },
        { rank: 3, name: 'Umbrella Corp', invoices: 9, revenue: 61000, paid: 61000, outstanding: 0 },
        { rank: 4, name: 'Stark Industries', invoices: 7, revenue: 48000, paid: 32000, outstanding: 16000 },
        { rank: 5, name: 'Wayne Enterprises', invoices: 6, revenue: 39000, paid: 39000, outstanding: 0 },
    ];

    protected readonly invoiceStatus: InvoiceStatusRow[] = [
        { status: 'Paid', count: 89, amount: 391500 },
        { status: 'Overdue', count: 18, amount: 62000 },
        { status: 'Draft', count: 11, amount: 19500 },
        { status: 'Sent', count: 6, amount: 9000 },
    ];

    protected readonly kpis: KpiItem[] = [
        { icon: 'payments', label: 'Total Revenue', value: '₹3,39,000' },
        { icon: 'receipt_long', label: 'Invoices Raised', value: '157' },
        { icon: 'summarize', label: 'Avg Invoice Value', value: '₹2,159' },
        { icon: 'trending_up', label: 'Growth vs Last Period', value: '+18.4%' },
    ];

    protected readonly displayedColumns: string[] = [
        'rank',
        'client',
        'invoices',
        'revenue',
        'paid',
        'outstanding',
    ];
    protected readonly topClientsDataSource = new MatTableDataSource<TopClientRow>([]);

    protected readonly barChartType: 'bar' = 'bar';
    protected barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
    protected readonly barChartOptions = signal<ChartConfiguration<'bar'>['options']>({
        responsive: true,
        plugins: {
            legend: { display: false, labels: { color: '#616161' } },
        },
        scales: {
            x: {
                ticks: { color: '#616161' },
                grid: { color: 'rgba(0,0,0,0.1)' },
            },
            y: {
                ticks: {
                    color: '#616161',
                    callback: (value: string | number) => `₹${Number(value).toLocaleString('en-IN')}`,
                },
                grid: { color: 'rgba(0,0,0,0.1)' },
            },
        },
    });

    protected readonly doughnutChartType: 'doughnut' = 'doughnut';
    protected doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
    protected readonly doughnutChartOptions = signal<ChartConfiguration<'doughnut'>['options']>({
        responsive: true,
        plugins: {
            legend: { display: false, labels: { color: '#616161' } },
        },
    });

    constructor() {
        effect(() => {
            this.themeService.isDarkMode()();
            this.updateChartColors();
        });
    }

    ngOnInit(): void {
        this.topClientsDataSource.data = this.topClients;
        this.buildBarChartData();
        this.buildDoughnutChartData();
        this.updateChartColors();
    }

    ngAfterViewInit(): void {
        this.topClientsDataSource.sort = this.sort;
    }

    protected exportPdf(): void {
        this.snackBar.open('Exporting PDF...', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }

    protected invoiceStatusPercent(row: InvoiceStatusRow): string {
        const total = this.invoiceStatus.reduce((sum, item) => sum + item.count, 0);
        const percent = total > 0 ? (row.count / total) * 100 : 0;
        return `${percent.toFixed(1)}%`;
    }

    protected formatCurrency(amount: number): string {
        return `₹${amount.toLocaleString('en-IN')}`;
    }

    protected statusChipClass(status: string): string {
        return `status-chip-${status.toLowerCase()}`;
    }

    private buildBarChartData(): void {
        this.barChartData = {
            labels: this.monthlyRevenue.map((item) => item.month),
            datasets: [
                {
                    data: this.monthlyRevenue.map((item) => item.revenue),
                    label: 'Revenue',
                    borderRadius: 8,
                },
            ],
        };
    }

    private buildDoughnutChartData(): void {
        this.doughnutChartData = {
            labels: this.invoiceStatus.map((item) => item.status),
            datasets: [
                {
                    data: this.invoiceStatus.map((item) => item.count),
                    backgroundColor: ['#4CAF50', '#F44336', '#9E9E9E', '#2196F3'],
                    hoverOffset: 6,
                },
            ],
        };
    }

    private updateChartColors(): void {
        const dark = this.themeService.isDarkMode()();
        const gridColor = dark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
        const textColor = dark ? '#E0E0E0' : '#616161';

        this.barChartOptions.set({
            responsive: true,
            plugins: {
                legend: { display: false, labels: { color: textColor } },
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

        this.doughnutChartOptions.set({
            responsive: true,
            plugins: {
                legend: { display: false, labels: { color: textColor } },
            },
        });
    }
}
