import { Injectable } from '@angular/core';
import { SidebarMenuItem, UserRole } from '../models';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {
    private items: SidebarMenuItem[] = [];

    setNavItems(items: SidebarMenuItem[]): void {
        this.items = items;
    }

    getFilteredNavItems(role: UserRole): SidebarMenuItem[] {
        return this.filterByRole(this.items, role);
    }

    hasAnyActiveChild(item: SidebarMenuItem, isRouteActive: (route: string) => boolean): boolean {
        const children = item.children ?? [];
        return children.some((child) => {
            if (child.route && isRouteActive(child.route)) {
                return true;
            }
            return this.hasAnyActiveChild(child, isRouteActive);
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
