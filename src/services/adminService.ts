import { supabase } from '@/lib/supabase';

export interface Admin {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended';
  avatar: string | null;
  lastActive: string;
  created_at?: string;
}

export const adminService = {
  async getAdmins(): Promise<Admin[]> {
    const { data, error } = await supabase
      .from('admins')
      .select('id, auth_user_id, full_name, email, role, is_active, created_at, status, avatar_url')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching admins:', error.message);
      return [];
    }

    // Map Supabase data to the Admin interface expected by the UI
    return (data || []).map(profile => ({
      id: profile.auth_user_id || profile.id || '',
      name: profile.full_name || 'Unknown',
      email: profile.email || '',
      role: profile.role || 'Support Admin',
      status: profile.status === 'Suspended' || !profile.is_active ? 'Suspended' : 'Active',
      avatar: profile.avatar_url || null,
      lastActive: profile.created_at || 'Never',
      created_at: profile.created_at
    }));
  },

  async deleteAdmin(id: string): Promise<void> {
    const { error } = await supabase
      .from('admins')
      .delete()
      .eq('auth_user_id', id);

    if (error) {
      console.error('Error deleting admin:', error.message);
      throw error;
    }
  },

  async updateAdminStatus(id: string, status: 'Active' | 'Suspended'): Promise<void> {
    const { error } = await supabase
      .from('admins')
      .update({ 
        status,
        is_active: status === 'Active'
      })
      .eq('auth_user_id', id);

    if (error) {
      console.error('Error updating admin status:', error.message);
      throw error;
    }
  },

  async inviteAdmin(name: string, email: string, role: string): Promise<void> {
    const { error } = await supabase
      .from('admins')
      .insert([
        { 
          full_name: name, 
          email: email, 
          role: role, 
          status: 'Active',
          is_active: true
        }
      ]);

    if (error) {
      console.error('Error inviting admin:', error.message);
      throw error;
    }
  }
};
