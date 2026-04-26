// import { Component, signal } from '@angular/core';
// import { RouterOutlet } from '@angular/router';

// @Component({
//   selector: 'app-root',
//   imports: [RouterOutlet],
//   templateUrl: './app.html',
//   styleUrl: './app.scss'
// })
// export class App {
//   protected readonly title = signal('frontend');
// }


import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavigationComponent } from './shared/components/sidebar-navigation/sidebar-navigation.component';
import { UserRole } from './shared/models';
import { TenantContextService } from './shared/services/tenant-context.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarNavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  private readonly tenantContext = inject(TenantContextService);

  protected readonly tenantId = this.tenantContext.tenantId;
  protected readonly currentRole = this.tenantContext.currentRole;
  protected readonly roles = this.tenantContext.roles;
  protected readonly tenants = this.tenantContext.tenants;

  protected onRoleChange(role: string): void {
    this.tenantContext.setRole(role as UserRole);
  }

  protected onTenantChange(tenantId: string): void {
    this.tenantContext.setTenant(tenantId);
  }
}
