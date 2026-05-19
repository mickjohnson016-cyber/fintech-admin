export type UserRole = 'super_admin' | 'admin' | 'staff';

export interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar?: string | null;
  status: 'Active' | 'Disabled';
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
