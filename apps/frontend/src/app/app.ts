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


import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidebarNavigationComponent } from './shared/components/sidebar-navigation/sidebar-navigation.component';
import { UserRole } from './shared/services/navigation/sidebar-navigation.types';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SidebarNavigationComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {
  protected readonly tenantId = signal('default');
  protected readonly currentRole = signal<UserRole>('manager');
  protected readonly roles: UserRole[] = ['admin', 'manager', 'analyst', 'viewer'];
  protected readonly tenants = ['default', 'aurora', 'atlas'];

  protected onRoleChange(role: string): void {
    this.currentRole.set(role as UserRole);
  }

  protected onTenantChange(tenantId: string): void {
    this.tenantId.set(tenantId);
  }
}
