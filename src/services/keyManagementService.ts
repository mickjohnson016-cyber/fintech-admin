
import { AccessKey, UserRole } from '../types/auth';

const STORAGE_KEY = 'oinz_access_keys';

export const keyManagementService = {
  /**
   * Generates a new cryptographically random access key
   */
  async generateKey(assignedTo: string, role: UserRole, expirationDays: number | null = null): Promise<AccessKey> {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No confusing chars like I, O, 1, 0
    const genPart = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    
    const fullKey = `OINZ-ADM-${genPart()}-${genPart()}-${genPart()}`;
    const id = `KEY-${Math.floor(Math.random() * 1000000).toString(16).toUpperCase()}`;
    
    const expiryDate = expirationDays 
      ? new Date(Date.now() + expirationDays * 24 * 60 * 60 * 1000).toISOString() 
      : null;

    const newKey: AccessKey = {
      id,
      keyDisplay: `${fullKey.slice(0, 13)}••••-••••`,
      fullKey, // Only returned once
      assignedTo,
      role,
      createdBy: 'System Root',
      createdDate: new Date().toISOString(),
      expirationDate: expiryDate,
      lastUsed: null,
      status: 'Active'
    };

    // Persist to mock storage
    const existing = await this.getKeys();
    localStorage.setItem(STORAGE_KEY, JSON.stringify([newKey, ...existing]));

    return newKey;
  },

  async getKeys(): Promise<AccessKey[]> {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  },

  async revokeKey(id: string): Promise<void> {
    const keys = await this.getKeys();
    const updated = keys.map(k => k.id === id ? { ...k, status: 'Revoked' } as AccessKey : k);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  },

  async deleteKey(id: string): Promise<void> {
    const keys = await this.getKeys();
    const updated = keys.filter(k => k.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  }
};
