import {
  Component,
  ChangeDetectionStrategy,
  input,
  computed,
  signal,
  effect,
  inject,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import {
  MetricData,
  AccessControl,
  UserRole,
  CardThemeConfig,
} from './dashboard-card.types';
import { ThemeService } from '../../services/theme.service';

/**
 * Reusable dashboard card component for displaying metrics with theming and role-based access.
 *
 * @example
 * ```html
 * <app-dashboard-card
 *   [metric]="{ title: 'Revenue', value: '$125,430', trendDirection: 'up', trendValue: 12.5 }"
 *   [currentUserRole]="'manager'"
 *   [isLoading]="false"
 * />
 * ```
 */
@Component({
  selector: 'app-dashboard-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressBarModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './dashboard-card.component.html',
  styleUrl: './dashboard-card.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardCardComponent {
  private readonly themeService = inject(ThemeService);

  // Inputs
  metric = input.required<MetricData>();
  isLoading = input<boolean>(false);
  currentUserRole = input<UserRole>('user');
  accessControl = input<AccessControl>({
    minimumRole: 'user',
  });
  tenantId = input<string>('default');

  // Outputs
  cardClicked = output<MetricData>();

  // Internal state
  theme = computed(() => {
    const tenant = this.tenantId();
    return this.themeService.getThemeForTenant(tenant);
  });

  trendIcon = computed(() => {
    const direction = this.metric().trendDirection;
    if (direction === 'up') return 'trending_up';
    if (direction === 'down') return 'trending_down';
    return 'trending_flat';
  });

  trendColor = computed(() => {
    const direction = this.metric().trendDirection;
    const theme = this.theme();

    if (direction === 'up') return '#4caf50';
    if (direction === 'down') return '#f44336';
    return theme.textColor;
  });

  /**
   * Check if a field should be hidden based on user role
   */
  isFieldHidden(field: 'value' | 'trend' | 'description'): boolean {
    const access = this.accessControl();
    const userRole = this.currentUserRole();

    // Check if user has minimum role
    if (!this.hasMinimumRole(userRole, access.minimumRole)) {
      return true;
    }

    // Check if field is explicitly hidden for this role
    return access.hiddenFields?.includes(field) ?? false;
  }

  /**
   * Determine if user has minimum required role
   */
  private hasMinimumRole(userRole: UserRole, minimumRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      admin: 4,
      manager: 3,
      user: 2,
      viewer: 1,
    };

    return roleHierarchy[userRole] >= roleHierarchy[minimumRole];
  }

  /**
   * Handle card click event
   */
  onCardClick(): void {
    this.cardClicked.emit(this.metric());
  }
}
