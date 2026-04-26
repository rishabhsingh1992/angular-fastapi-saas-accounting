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
  template: `
    <div class="demo-container">
      <h1>Dashboard Card Component - Demo</h1>

      <!-- Theme Selector -->
      <div class="controls">
        <label>Select Theme:
          <select (change)="onThemeChange($event)">
            <option value="default">Default</option>
            <option value="premium">Premium</option>
            <option value="enterprise">Enterprise</option>
            <option value="dark">Dark</option>
          </select>
        </label>

        <label>Select Role:
          <select (change)="onRoleChange($event)">
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="user">User</option>
            <option value="viewer">Viewer</option>
          </select>
        </label>

        <button (click)="toggleLoadingState()">
          {{ isLoading() ? 'Stop Loading' : 'Start Loading' }}
        </button>
      </div>

      <!-- Demo Grid -->
      <div class="cards-grid">
        <!-- Revenue Card -->
        <app-dashboard-card
          [metric]="revenueMetric()"
          [isLoading]="isLoading()"
          [currentUserRole]="selectedRole()"
          [tenantId]="selectedTheme()"
          (cardClicked)="onCardClicked($event)"
        />

        <!-- Users Card -->
        <app-dashboard-card
          [metric]="usersMetric()"
          [isLoading]="isLoading()"
          [currentUserRole]="selectedRole()"
          [tenantId]="selectedTheme()"
          (cardClicked)="onCardClicked($event)"
        />

        <!-- Conversion Rate Card -->
        <app-dashboard-card
          [metric]="conversionMetric()"
          [isLoading]="isLoading()"
          [currentUserRole]="selectedRole()"
          [tenantId]="selectedTheme()"
          (cardClicked)="onCardClicked($event)"
        />

        <!-- Error Rate Card -->
        <app-dashboard-card
          [metric]="errorMetric()"
          [isLoading]="isLoading()"
          [currentUserRole]="selectedRole()"
          [tenantId]="selectedTheme()"
          (cardClicked)="onCardClicked($event)"
        />

        <!-- Card with Access Control -->
        <app-dashboard-card
          [metric]="profitMarginMetric()"
          [isLoading]="isLoading()"
          [currentUserRole]="selectedRole()"
          [accessControl]="{
            minimumRole: 'manager',
            hiddenFields: ['value']
          }"
          [tenantId]="selectedTheme()"
          (cardClicked)="onCardClicked($event)"
        />

        <!-- Card with Limited Visibility -->
        <app-dashboard-card
          [metric]="customerSatisfactionMetric()"
          [isLoading]="isLoading()"
          [currentUserRole]="selectedRole()"
          [accessControl]="{
            minimumRole: 'user',
            hiddenFields: ['trend']
          }"
          [tenantId]="selectedTheme()"
          (cardClicked)="onCardClicked($event)"
        />
      </div>

      <!-- Event Log -->
      @if (lastClickedMetric()) {
        <div class="event-log">
          <h3>Last Card Clicked:</h3>
          <pre>{{ lastClickedMetric() | json }}</pre>
        </div>
      }
    </div>
  `,
  styles: [`
    .demo-container {
      padding: 24px;
      background-color: #f5f5f5;
      min-height: 100vh;
    }

    h1 {
      margin-bottom: 24px;
      color: #212121;
    }

    .controls {
      display: flex;
      gap: 16px;
      margin-bottom: 32px;
      flex-wrap: wrap;
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
    }

    label {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
      color: #212121;
    }

    select, button {
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      cursor: pointer;
      background: white;

      &:hover {
        background-color: #f9f9f9;
      }

      &:focus {
        outline: none;
        border-color: #1976d2;
        box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
      }
    }

    button {
      background-color: #1976d2;
      color: white;
      border: none;
      font-weight: 500;
      transition: background-color 0.3s;

      &:hover {
        background-color: #1565c0;
      }
    }

    .cards-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
      gap: 24px;
      margin-bottom: 32px;
    }

    .event-log {
      background: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12);
      margin-top: 24px;

      h3 {
        margin-top: 0;
        color: #212121;
      }

      pre {
        background-color: #f5f5f5;
        padding: 12px;
        border-radius: 4px;
        overflow-x: auto;
        font-size: 12px;
        color: #424242;
      }
    }
  `],
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
