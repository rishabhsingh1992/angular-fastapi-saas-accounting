import { Injectable, inject, signal, computed } from '@angular/core';
import { CardThemeConfig } from '../components/dashboard-card/dashboard-card.types';

/**
 * Service for managing tenant-based theming in dashboard cards.
 * Provides theme configurations based on tenant ID.
 */
@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly tenantId = signal<string>('default');

  // Predefined theme palettes for different tenants
  private readonly themePalettes = new Map<string, CardThemeConfig>([
    [
      'default',
      {
        backgroundColor: '#ffffff',
        accentColor: '#1976d2',
        textColor: '#212121',
        borderColor: '#e0e0e0',
      },
    ],
    [
      'premium',
      {
        backgroundColor: '#f5f7fa',
        accentColor: '#2e7d32',
        textColor: '#1a237e',
        borderColor: '#c8e6c9',
      },
    ],
    [
      'enterprise',
      {
        backgroundColor: '#fafafa',
        accentColor: '#d32f2f',
        textColor: '#212121',
        borderColor: '#ffcdd2',
      },
    ],
    [
      'dark',
      {
        backgroundColor: '#1e1e1e',
        accentColor: '#64b5f6',
        textColor: '#ffffff',
        borderColor: '#424242',
      },
    ],
  ]);

  /**
   * Get the current theme configuration
   */
  currentTheme = computed(() => {
    const palette = this.themePalettes.get(this.tenantId());
    return palette || this.themePalettes.get('default')!;
  });

  /**
   * Set the tenant ID and update the theme
   */
  setTenant(tenantId: string): void {
    this.tenantId.set(tenantId);
  }

  /**
   * Register a custom theme for a tenant
   */
  registerTenant(tenantId: string, theme: CardThemeConfig): void {
    this.themePalettes.set(tenantId, theme);
  }

  /**
   * Get theme for a specific tenant without changing current tenant
   */
  getThemeForTenant(tenantId: string): CardThemeConfig {
    return this.themePalettes.get(tenantId) || this.themePalettes.get('default')!;
  }

  /**
   * Get all available theme names
   */
  getAvailableThemes(): string[] {
    return Array.from(this.themePalettes.keys());
  }
}
