/**
 * Metric data for dashboard card component
 */
export interface MetricData {
  title: string;
  value: string | number;
  unit?: string;
  trendValue?: number;
  trendDirection?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  description?: string;
}

/**
 * Theme configuration for dashboard cards
 */
export interface CardThemeConfig {
  backgroundColor: string;
  accentColor: string;
  textColor: string;
  borderColor: string;
}

/**
 * Role-based access control for card content
 */
export type UserRole = 'admin' | 'manager' | 'user' | 'viewer';

/**
 * Access control configuration for card visibility
 */
export interface AccessControl {
  minimumRole: UserRole;
  hiddenFields?: Array<'value' | 'trend' | 'description'>;
}
