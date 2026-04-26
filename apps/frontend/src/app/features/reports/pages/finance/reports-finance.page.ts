import { ChangeDetectionStrategy, Component, OnInit, effect, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import {
    ArcElement,
    BarController,
    BarElement,
    CategoryScale,
    Chart,
    DoughnutController,
    Filler,
    Legend,
    LinearScale,
    LineController,
    LineElement,
    PointElement,
    Tooltip,
} from 'chart.js';
import { ThemeService } from '../../../../core/services/theme.service';

Chart.register(
    CategoryScale,
    LinearScale,
    BarElement,
    BarController,
    LineElement,
    LineController,
    PointElement,
    DoughnutController,
    ArcElement,
    Filler,
    Tooltip,
    Legend
);

interface MonthlyPnLRow {
    month: string;
    income: number;
    expenses: number;
    profit: number;
}

interface ExpenseRow {
    category: string;
    amount: number;
    percentage: number;
}

interface CashFlowRow {
    month: string;
    inflow: number;
    outflow: number;
}

interface TaxSummary {
    totalRevenue: number;
    taxableIncome: number;
    gstCollected: number;
    gstPaid: number;
    netGstPayable: number;
    incomeTaxEst: number;
}

interface KpiItem {
    icon: string;
    label: string;
    value: string;
    isChip?: boolean;
}

@Component({
    selector: 'app-reports-finance-page',
    imports: [
        RouterLink,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatChipsModule,
        MatDividerModule,
        MatIconModule,
        MatListModule,
        MatProgressBarModule,
        MatSnackBarModule,
        BaseChartDirective,
    ],
    templateUrl: './reports-finance.page.html',
    styleUrl: './reports-finance.page.scss',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReportsFinancePage implements OnInit {
    private readonly snackBar = inject(MatSnackBar);
    private readonly themeService = inject(ThemeService);

    protected selectedRange = '6M';

    protected readonly monthlyPnL: MonthlyPnLRow[] = [
        { month: 'Nov', income: 38000, expenses: 21000, profit: 17000 },
        { month: 'Dec', income: 52000, expenses: 28000, profit: 24000 },
        { month: 'Jan', income: 41000, expenses: 19000, profit: 22000 },
        { month: 'Feb', income: 67000, expenses: 31000, profit: 36000 },
        { month: 'Mar', income: 59000, expenses: 27000, profit: 32000 },
        { month: 'Apr', income: 82000, expenses: 34000, profit: 48000 },
    ];

    protected readonly expenseBreakdown: ExpenseRow[] = [
        { category: 'Salaries', amount: 85000, percentage: 52 },
        { category: 'Software', amount: 24000, percentage: 15 },
        { category: 'Marketing', amount: 21000, percentage: 13 },
        { category: 'Office', amount: 16000, percentage: 10 },
        { category: 'Misc', amount: 14000, percentage: 10 },
    ];

    protected readonly cashFlow: CashFlowRow[] = [
        { month: 'Nov', inflow: 38000, outflow: 21000 },
        { month: 'Dec', inflow: 52000, outflow: 28000 },
        { month: 'Jan', inflow: 41000, outflow: 19000 },
        { month: 'Feb', inflow: 67000, outflow: 31000 },
        { month: 'Mar', inflow: 59000, outflow: 27000 },
        { month: 'Apr', inflow: 82000, outflow: 34000 },
    ];

    protected readonly taxSummary: TaxSummary = {
        totalRevenue: 339000,
        taxableIncome: 179000,
        gstCollected: 61020,
        gstPaid: 28800,
        netGstPayable: 32220,
        incomeTaxEst: 53700,
    };

    protected readonly kpis: KpiItem[] = [
        { icon: 'trending_up', label: 'Total Income', value: '₹3,39,000' },
        { icon: 'trending_down', label: 'Total Expenses', value: '₹1,60,000' },
        { icon: 'savings', label: 'Net Profit', value: '₹1,79,000' },
        { icon: 'percent', label: 'Profit Margin', value: '52.8%', isChip: true },
    ];

    // P&L Bar chart
    protected readonly barChartType: 'bar' = 'bar';
    protected barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
    protected readonly barChartOptions = signal<ChartConfiguration<'bar'>['options']>({
        responsive: true,
        plugins: { legend: { display: true, labels: { color: '#616161' } } },
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

    // Expense Doughnut
    protected readonly doughnutChartType: 'doughnut' = 'doughnut';
    protected doughnutChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
    protected readonly doughnutChartOptions = signal<ChartConfiguration<'doughnut'>['options']>({
        responsive: true,
        plugins: { legend: { display: false, labels: { color: '#616161' } } },
    });

    // Cash Flow Line chart
    protected readonly lineChartType: 'line' = 'line';
    protected lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
    protected readonly lineChartOptions = signal<ChartConfiguration<'line'>['options']>({
        responsive: true,
        elements: { line: { tension: 0.4 } },
        plugins: { legend: { display: true, labels: { color: '#616161' } } },
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
        effect(() => {
            this.themeService.isDarkMode()();
            this.updateChartColors();
        });
    }

    ngOnInit(): void {
        this.buildBarChartData();
        this.buildDoughnutChartData();
        this.buildLineChartData();
        this.updateChartColors();
    }

    protected exportPdf(): void {
        this.snackBar.open('Exporting PDF...', 'Close', {
            duration: 2200,
            horizontalPosition: 'end',
            verticalPosition: 'top',
        });
    }

    protected formatCurrency(amount: number): string {
        return `₹${amount.toLocaleString('en-IN')}`;
    }

    private buildBarChartData(): void {
        const labels = this.monthlyPnL.map((r) => r.month);
        this.barChartData = {
            labels,
            datasets: [
                { data: this.monthlyPnL.map((r) => r.income), label: 'Income', backgroundColor: '#2196F3', borderRadius: 6 },
                { data: this.monthlyPnL.map((r) => r.expenses), label: 'Expenses', backgroundColor: '#F44336', borderRadius: 6 },
                { data: this.monthlyPnL.map((r) => r.profit), label: 'Profit', backgroundColor: '#4CAF50', borderRadius: 6 },
            ],
        };
    }

    private buildDoughnutChartData(): void {
        this.doughnutChartData = {
            labels: this.expenseBreakdown.map((r) => r.category),
            datasets: [
                {
                    data: this.expenseBreakdown.map((r) => r.amount),
                    backgroundColor: ['#5C6BC0', '#26A69A', '#FFA726', '#EC407A', '#8D6E63'],
                    hoverOffset: 6,
                },
            ],
        };
    }

    private buildLineChartData(): void {
        const labels = this.cashFlow.map((r) => r.month);
        this.lineChartData = {
            labels,
            datasets: [
                {
                    data: this.cashFlow.map((r) => r.inflow),
                    label: 'Inflow',
                    borderColor: '#4CAF50',
                    backgroundColor: 'rgba(76,175,80,0.15)',
                    fill: '+1',
                    pointRadius: 4,
                },
                {
                    data: this.cashFlow.map((r) => r.outflow),
                    label: 'Outflow',
                    borderColor: '#F44336',
                    backgroundColor: 'rgba(244,67,54,0.08)',
                    fill: false,
                    pointRadius: 4,
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
            plugins: { legend: { display: true, labels: { color: textColor } } },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
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
            plugins: { legend: { display: false, labels: { color: textColor } } },
        });

        this.lineChartOptions.set({
            responsive: true,
            elements: { line: { tension: 0.4 } },
            plugins: { legend: { display: true, labels: { color: textColor } } },
            scales: {
                x: { ticks: { color: textColor }, grid: { color: gridColor } },
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
