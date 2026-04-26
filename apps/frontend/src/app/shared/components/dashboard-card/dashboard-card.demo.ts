import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardCardComponent } from './dashboard-card.component';
import { MetricData, UserRole, AccessControl } from './dashboard-card.types';
import { ThemeService } from '../../services/theme.service';

/**
 * Demo component showcasing dashboard card usage with various scenarios
 */
@Component({
  selector: 'app-dashboard-card-demo',
  standalone: true,
  imports: [CommonModule, DashboardCardComponent],
  templateUrl: './dashboard-card.demo.html',
  styleUrl: './dashboard-card.demo.scss',
})
export class DashboardCardDemoComponent implements OnInit {
  private themeService = inject(ThemeService);

  // State
  selectedTheme = signal<string>('default');
  selectedRole = signal<UserRole>('manager');
  isLoading = signal(false);
  lastClickedMetric = signal<MetricData | null>(null);

  // Metric signals
  revenueMetric = signal<MetricData>({
    title: 'Total Revenue',
    value: '$125,430',
    unit: 'USD',
    trendDirection: 'up',
    trendValue: 12.5,
    trendLabel: 'vs last month',
    description: 'Total revenue for current month across all products',
  });

  usersMetric = signal<MetricData>({
    title: 'Active Users',
    value: '15,420',
    unit: 'users',
    trendDirection: 'up',
    trendValue: 25.3,
    trendLabel: 'vs last month',
    description: 'Number of active users in the platform',
  });

  conversionMetric = signal<MetricData>({
    title: 'Conversion Rate',
    value: '3.8%',
    unit: 'percent',
    trendDirection: 'up',
    trendValue: 8.2,
    trendLabel: 'improvement',
    description: 'Percentage of visitors converted to customers',
  });

  errorMetric = signal<MetricData>({
    title: 'Error Rate',
    value: '0.8%',
    unit: 'errors/requests',
    trendDirection: 'down',
    trendValue: 12.1,
    trendLabel: 'improvement',
    description: 'Percentage of failed requests',
  });

  profitMarginMetric = signal<MetricData>({
    title: 'Profit Margin',
    value: '42.5%',
    unit: 'percent',
    trendDirection: 'neutral',
    trendValue: 0,
    description: 'Net profit margin (manager only)',
  });

  customerSatisfactionMetric = signal<MetricData>({
    title: 'Customer Satisfaction',
    value: '4.6',
    unit: 'out of 5',
    trendDirection: 'up',
    trendValue: 5.2,
    trendLabel: 'vs last quarter',
    description: 'Average customer satisfaction score',
  });

  ngOnInit(): void {
    // Register custom themes
    this.themeService.registerTenant('premium', {
      backgroundColor: '#f5f7fa',
      accentColor: '#2e7d32',
      textColor: '#1a237e',
      borderColor: '#c8e6c9',
    });

    this.themeService.registerTenant('enterprise', {
      backgroundColor: '#fafafa',
      accentColor: '#d32f2f',
      textColor: '#212121',
      borderColor: '#ffcdd2',
    });
  }

  onThemeChange(event: Event): void {
    const theme = (event.target as HTMLSelectElement).value;
    this.selectedTheme.set(theme);
  }

  onRoleChange(event: Event): void {
    const role = (event.target as HTMLSelectElement).value as UserRole;
    this.selectedRole.set(role);
  }

  toggleLoadingState(): void {
    this.isLoading.update((v) => !v);
  }

  onCardClicked(metric: MetricData): void {
    this.lastClickedMetric.set(metric);
  }
}
