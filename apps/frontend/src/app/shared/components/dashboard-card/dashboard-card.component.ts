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
  template: `
    <mat-card [style.background-color]="theme().backgroundColor"
              [style.border-color]="theme().borderColor"
              [style.color]="theme().textColor"
              class="dashboard-card">
      <mat-card-header>
        <mat-card-title class="card-title">
          {{ metric().title }}
          @if (metric().description) {
            <mat-icon [matTooltip]="metric().description" class="info-icon">
              info
            </mat-icon>
          }
        </mat-card-title>
      </mat-card-header>

      <mat-card-content>
        <!-- Loading Skeleton -->
        @if (isLoading()) {
          <div class="skeleton-container">
            <div class="skeleton skeleton-title"></div>
            <div class="skeleton skeleton-value"></div>
          </div>
        } @else {
          <!-- Main Content -->
          <div class="metric-content">
            <!-- Metric Value (Role-based visibility) -->
            @if (!isFieldHidden('value')) {
              <div class="metric-value-section">
                <p class="metric-value">{{ metric().value }}</p>
                @if (metric().unit) {
                  <span class="metric-unit">{{ metric().unit }}</span>
                }
              </div>
            }

            <!-- Trend Indicator -->
            @if (!isFieldHidden('trend') && metric().trendDirection) {
              <div class="trend-section" [style.color]="trendColor()">
                <div class="trend-indicator">
                  <mat-icon class="trend-icon">
                    {{ trendIcon() }}
                  </mat-icon>
                  @if (metric().trendValue !== undefined) {
                    <span class="trend-value">{{ metric().trendValue }}%</span>
                  }
                </div>
                @if (metric().trendLabel) {
                  <span class="trend-label">{{ metric().trendLabel }}</span>
                }
              </div>
            }

            <!-- Description (Role-based visibility) -->
            @if (!isFieldHidden('description') && metric().description) {
              <p class="metric-description">{{ metric().description }}</p>
            }
          </div>
        }
      </mat-card-content>
    </mat-card>
  `,
  styles: [`
    .dashboard-card {
      border: 1px solid;
      border-radius: 8px;
      padding: 20px;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;

      &:hover {
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
    }

    .card-title {
      display: flex;
      align-items: center;
      gap: 8px;
      margin: 0;
      font-size: 14px;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .info-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      cursor: help;
      opacity: 0.6;

      &:hover {
        opacity: 1;
      }
    }

    mat-card-content {
      flex: 1;
      padding: 16px 0;
    }

    .skeleton-container {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .skeleton {
      border-radius: 4px;
      background: linear-gradient(
        90deg,
        rgba(0, 0, 0, 0.05) 25%,
        rgba(0, 0, 0, 0.1) 50%,
        rgba(0, 0, 0, 0.05) 75%
      );
      background-size: 200% 100%;
      animation: loading 1.5s infinite;

      &.skeleton-title {
        height: 12px;
        width: 60%;
      }

      &.skeleton-value {
        height: 32px;
        width: 80%;
      }
    }

    @keyframes loading {
      0% {
        background-position: 200% 0;
      }
      100% {
        background-position: -200% 0;
      }
    }

    .metric-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .metric-value-section {
      display: flex;
      align-items: baseline;
      gap: 8px;
    }

    .metric-value {
      font-size: 32px;
      font-weight: 700;
      margin: 0;
      line-height: 1;
    }

    .metric-unit {
      font-size: 14px;
      opacity: 0.7;
      font-weight: 500;
    }

    .trend-section {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      background-color: rgba(0, 0, 0, 0.02);
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
    }

    .trend-indicator {
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .trend-icon {
      font-size: 20px;
      width: 20px;
      height: 20px;
    }

    .trend-value {
      font-weight: 600;
    }

    .trend-label {
      opacity: 0.7;
      font-size: 12px;
    }

    .metric-description {
      font-size: 13px;
      opacity: 0.6;
      margin: 4px 0 0;
      line-height: 1.4;
    }

    mat-card-header {
      padding: 0;
      margin-bottom: 8px;
    }

    ::ng-deep {
      mat-card-title {
        font-size: inherit;
      }
    }
  `],
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
