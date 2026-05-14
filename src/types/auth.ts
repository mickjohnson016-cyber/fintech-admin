
export type UserRole = 
  | 'Super Admin' 
  | 'Operations Admin' 
  | 'Compliance Admin' 
  | 'Finance Admin' 
  | 'Support Admin' 
  | 'Read Only Auditor';

export interface AdminUser {
  id: string;
  name: string;
  role: UserRole;
  accessKeyId: string;
  lastLogin: string;
  status: 'Active' | 'Disabled';
}

export interface AccessKey {
  id: string;
  keyDisplay: string; // Masked version: OINZ-ADM-8FK2-****-****
  fullKey?: string;   // Only available right after generation
  assignedTo: string; // Name or User ID
  role: UserRole;
  createdBy: string;
  createdDate: string;
  expirationDate: string | null;
  lastUsed: string | null;
  status: 'Active' | 'Expired' | 'Revoked';
}

export interface AuthState {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
