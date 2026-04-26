import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import {
  SidebarMenuItem,
  TenantBranding,
  UserRole,
} from '../../services/navigation/sidebar-navigation.types';
import { SidebarNavigationApiService } from '../../services/navigation/sidebar-navigation-api.service';

@Component({
  selector: 'app-sidebar-navigation',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar-navigation.component.html',
  styleUrl: './sidebar-navigation.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarNavigationComponent {
  private readonly api = inject(SidebarNavigationApiService);
  private readonly router = inject(Router);

  tenantId = input<string>('default');
  currentUserRole = input<UserRole>('viewer');

  protected readonly isLoading = signal(true);
  protected readonly menuItems = signal<SidebarMenuItem[]>([]);
  protected readonly branding = signal<TenantBranding>({
    tenantId: 'default',
    tenantName: 'Default Tenant',
    logoUrl: 'https://dummyimage.com/176x48/0f172a/f8fafc&text=SaaS+Default',
    primaryColor: '#1d4ed8',
    surfaceColor: '#0f172a',
    textColor: '#f8fafc',
    accentColor: '#22d3ee',
  });
  protected readonly expanded = signal<Record<string, boolean>>({});

  protected readonly filteredMenu = computed(() =>
    this.filterByRole(this.menuItems(), this.currentUserRole())
  );

  constructor() {
    effect(() => {
      const currentTenant = this.tenantId();
      this.loadSidebarData(currentTenant);
    });
  }

  protected toggleGroup(itemId: string): void {
    this.expanded.update((state) => ({
      ...state,
      [itemId]: !state[itemId],
    }));
  }

  protected isExpanded(itemId: string): boolean {
    return this.expanded()[itemId] ?? false;
  }

  protected isActiveRoute(route?: string): boolean {
    if (!route) {
      return false;
    }

    return this.router.isActive(route, {
      paths: 'subset',
      queryParams: 'ignored',
      matrixParams: 'ignored',
      fragment: 'ignored',
    });
  }

  protected hasAnyActiveChild(item: SidebarMenuItem): boolean {
    const children = item.children ?? [];
    return children.some((child) => {
      if (child.route && this.isActiveRoute(child.route)) {
        return true;
      }
      return this.hasAnyActiveChild(child);
    });
  }

  private loadSidebarData(tenantId: string): void {
    this.isLoading.set(true);

    this.api.getMenuItems().subscribe({
      next: (items) => {
        this.menuItems.set(items);
      },
      error: () => {
        this.menuItems.set([]);
      },
    });

    this.api.getTenantBranding(tenantId).subscribe({
      next: (branding) => {
        this.branding.set(branding);
      },
      error: () => {
        this.branding.set({
          tenantId: 'default',
          tenantName: 'Default Tenant',
          logoUrl: 'https://dummyimage.com/176x48/0f172a/f8fafc&text=SaaS+Default',
          primaryColor: '#1d4ed8',
          surfaceColor: '#0f172a',
          textColor: '#f8fafc',
          accentColor: '#22d3ee',
        });
      },
      complete: () => {
        this.isLoading.set(false);
      },
    });
  }

  private filterByRole(items: SidebarMenuItem[], role: UserRole): SidebarMenuItem[] {
    return items
      .filter((item) => item.allowedRoles.includes(role))
      .map((item) => {
        const children = item.children ? this.filterByRole(item.children, role) : undefined;
        return {
          ...item,
          children,
        };
      })
      .filter((item) => item.route || (item.children && item.children.length > 0));
  }
}
