import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { BrandingApiResponse, SidebarMenuItem, TenantBranding } from '../../models';

@Injectable({
  providedIn: 'root',
})
export class SidebarNavigationApiService {
  private readonly http = inject(HttpClient);

  getMenuItems(): Observable<SidebarMenuItem[]> {
    return this.http.get<SidebarMenuItem[]>('/api/sidebar-menu.json');
  }

  getTenantBranding(tenantId: string): Observable<TenantBranding> {
    return this.http.get<BrandingApiResponse>('/api/tenant-branding.json').pipe(
      map((response) => {
        const fallback = response.tenants.find((tenant) => tenant.tenantId === 'default');
        return response.tenants.find((tenant) => tenant.tenantId === tenantId) ?? fallback!;
      })
    );
  }
}
