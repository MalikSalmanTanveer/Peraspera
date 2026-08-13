export type AdminRole =
  | 'super_admin'
  | 'hiring_manager'
  | 'blog_author'
  | 'sales_leads';

export type AdminProfile = {
  id: string;
  username: string;
  role: AdminRole;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export const ADMIN_ROLE_LABELS: Record<AdminRole, string> = {
  super_admin: 'Super Admin',
  hiring_manager: 'Hiring Manager',
  blog_author: 'Blog Author',
  sales_leads: 'Sales / Leads',
};

export function canAccessHiring(role: AdminRole): boolean {
  return role === 'super_admin' || role === 'hiring_manager';
}

export function canAccessBlog(role: AdminRole): boolean {
  return role === 'super_admin' || role === 'blog_author';
}

export function canAccessUsers(role: AdminRole): boolean {
  return role === 'super_admin';
}

export function canAccessSales(role: AdminRole): boolean {
  return role === 'super_admin' || role === 'sales_leads';
}

export function canAccessBulkMail(role: AdminRole): boolean {
  return role === 'super_admin';
}

export function defaultHomeForRole(role: AdminRole): string {
  switch (role) {
    case 'blog_author':
      return '/admin/blog';
    case 'sales_leads':
      return '/admin'; // placeholder until Sales module
    case 'hiring_manager':
      return '/admin/hiring/applications';
    case 'super_admin':
    default:
      return '/admin/hiring/overview';
  }
}
