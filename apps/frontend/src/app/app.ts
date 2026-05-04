import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  HostListener,
  inject,
  viewChild,
  computed,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { SidebarNavigationComponent } from './shared/components/sidebar-navigation/sidebar-navigation.component';
import { UserRole } from './shared/models';
import { ThemeService } from './core/services/theme.service';
import { TenantContextService } from './shared/services/tenant-context.service';

@Component({
  selector: 'app-root',
  imports: [
    CommonModule,
    RouterOutlet,
    SidebarNavigationComponent,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly tenantContext = inject(TenantContextService);
  private readonly router = inject(Router);
  protected readonly themeService = inject(ThemeService);

  // Search input reference for keyboard shortcut
  private readonly searchInput = viewChild<ElementRef<HTMLInputElement>>('searchInput');

  protected readonly tenantId = this.tenantContext.tenantId;
  protected readonly currentRole = this.tenantContext.currentRole;
  protected readonly roles = this.tenantContext.roles;
  protected readonly tenants = this.tenantContext.tenants;
  protected readonly isDarkMode = this.themeService.isDarkMode();

  // Track current URL to hide sidebar/navbar on auth pages
  private readonly currentUrl = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => (event as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: this.router.url }
  );

  protected readonly isAuthPage = computed(() => {
    const url = this.currentUrl();
    return url.includes('/login') || url.includes('/register');
  });

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    // Cmd+K or Ctrl+K shortcut for search
    if ((event.metaKey || event.ctrlKey) && event.key === 'k' && !this.isAuthPage()) {
      event.preventDefault();
      this.searchInput()?.nativeElement.focus();
    }
  }

  protected onRoleChange(role: string): void {
    this.tenantContext.setRole(role as UserRole);
  }

  protected onTenantChange(tenantId: string): void {
    this.tenantContext.setTenant(tenantId);
  }

  protected toggleTheme(): void {
    this.themeService.toggleTheme();
  }
}
