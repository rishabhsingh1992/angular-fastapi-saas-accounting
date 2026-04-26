export type UserRole = 'admin' | 'manager' | 'analyst' | 'viewer';

export interface SidebarMenuItem {
  id: string;
  label: string;
  route?: string;
  icon?: string;
  allowedRoles: UserRole[];
  children?: SidebarMenuItem[];
}

export interface TenantBranding {
  tenantId: string;
  tenantName: string;
  logoUrl: string;
  primaryColor: string;
  surfaceColor: string;
  textColor: string;
  accentColor: string;
}
