
import { AdminUser, AccessKey, UserRole } from '../types/auth';

// In a real app, these would be API calls to a secure backend
// We use a secure-ish mock implementation ready for transition

const SESSION_KEY = 'oinz_admin_session';

export const authService = {
  /**
   * Validates an access key and name against the mock database
   */
  async login(name: string, accessKey: string): Promise<AdminUser> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // MOCK VALIDATION LOGIC
    // In production, the key would be hashed and compared in the database
    // For now, we'll accept keys that follow the format and look for a matching 'active' key
    
    // We'll simulate a valid key check
    if (!accessKey.startsWith('OINZ-ADM-')) {
      throw new Error('Invalid Access Key format');
    }

    // Mock successful user retrieval
    const mockUser: AdminUser = {
      id: `USR-${Math.floor(Math.random() * 10000)}`,
      name: name,
      role: 'Super Admin', // Defaulting to Super Admin for dev access
      accessKeyId: 'KEY-X91P',
      lastLogin: new Date().toISOString(),
      status: 'Active'
    };

    // Store session token (simulating a JWT/Session ID)
    const sessionToken = btoa(JSON.stringify({ ...mockUser, expiry: Date.now() + 1000 * 60 * 60 * 24 * 365 })); // 1 year session
    localStorage.setItem(SESSION_KEY, sessionToken);

    return mockUser;
  },

  /**
   * Restores session from storage
   */
  async getSession(): Promise<AdminUser | null> {
    const token = localStorage.getItem(SESSION_KEY);
    if (!token) return null;

    try {
      const decoded = JSON.parse(atob(token));
      // Check expiry
      if (decoded.expiry < Date.now()) {
        localStorage.removeItem(SESSION_KEY);
        return null;
      }
      return decoded as AdminUser;
    } catch {
      return null;
    }
  },

  /**
   * Terminates session
   */
  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = '/login';
  }
};
