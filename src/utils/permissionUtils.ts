
import { UserRole } from '../types/auth';

export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  'Super Admin': ['*'], // Access to everything
  'Operations Admin': [
    '/dashboard', 
    '/support/issues', 
    '/users', 
    '/transactions', 
    '/investments', 
    '/airtime', 
    '/savings', 
    '/bills', 
    '/reports',
    '/settings'
  ],
  'Compliance Admin': [
    '/dashboard',
    '/users',
    '/compliance',
    '/reports',
    '/settings/security'
  ],
  'Finance Admin': [
    '/dashboard',
    '/transactions',
    '/savings',
    '/bills',
    '/reports'
  ],
  'Support Admin': [
    '/dashboard',
    '/support/issues',
    '/users'
  ],
  'Read Only Auditor': [
    '/dashboard',
    '/users',
    '/transactions',
    '/reports'
  ]
};

export function hasPermission(role: UserRole, path: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  if (permissions.includes('*')) return true;
  
  // Basic path prefix matching
  return permissions.some(p => path.startsWith(p));
}
