import { Injectable, signal } from '@angular/core';
import { UserRole } from '../models';

@Injectable({
    providedIn: 'root',
})
export class TenantContextService {
    private readonly tenantIdState = signal('default');
    private readonly currentRoleState = signal<UserRole>('manager');

    readonly tenantId = this.tenantIdState.asReadonly();
    readonly currentRole = this.currentRoleState.asReadonly();
    readonly roles: UserRole[] = ['admin', 'manager', 'analyst', 'viewer'];
    readonly tenants = ['default', 'aurora', 'atlas'];

    setRole(role: UserRole): void {
        this.currentRoleState.set(role);
    }

    setTenant(tenantId: string): void {
        this.tenantIdState.set(tenantId);
    }
}
