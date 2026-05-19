import { UserRole } from '../types/auth';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'super_admin': ['*'], // Access to everything (including admin settings)
  'admin': [
    '/dashboard', 
    '/support/issues', 
    '/users', 
    '/transactions', 
    '/investments', 
    '/airtime', 
    '/savings', 
    '/bills', 
    '/reports',
    '/compliance'
  ],
  'staff': [
    '/dashboard',
    '/support/issues',
    '/users',
    '/transactions'
  ]
};

export function hasPermission(role: UserRole, path: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.includes('*')) return true;
  
  // Basic path prefix matching
  return permissions.some(p => path.startsWith(p));
}
