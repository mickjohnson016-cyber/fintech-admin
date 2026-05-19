import { AdminUser, UserRole } from '../types/auth';
import { supabase } from '../lib/supabase';

export const authService = {
  /**
   * Signs in a user using Supabase Email + Password
   */
  async login(email: string, password: string): Promise<AdminUser> {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.toLowerCase().includes('invalid login credentials')) {
        throw new Error('Invalid email or password. Please verify your credentials and try again.');
      }
      throw error;
    }

    if (!data.user) {
      throw new Error('Authentication failed: No user data returned.');
    }

    // Query profiles table for user metadata
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .maybeSingle();

    if (profileError) {
      console.error('Error fetching admin profile:', profileError);
    }

    if (profile && profile.status === 'Suspended') {
      await supabase.auth.signOut();
      throw new Error('Access denied: This administrator account has been suspended.');
    }

    return {
      id: data.user.id,
      name: profile?.full_name || profile?.name || data.user.user_metadata?.full_name || email.split('@')[0],
      email: data.user.email || profile?.email || email,
      role: (profile?.role || data.user.user_metadata?.role || 'Support Admin') as UserRole,
      status: profile?.status === 'Suspended' ? 'Disabled' : 'Active',
      avatar: profile?.avatar_url || profile?.avatar || null
    };
  },

  /**
   * Registers a new user using Supabase Email + Password
   */
  async signup(email: string, password: string): Promise<AdminUser> {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }

    if (!data.user) {
      throw new Error('Signup failed: No user data returned.');
    }

    // Provision profile record in the profiles database to store roles and permissions
    try {
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: data.user.id,
          email: email,
          full_name: email.split('@')[0],
          role: 'Support Admin', // Default entry level role
          status: 'Active',
        });

      if (profileError) {
        console.error('Error creating user profile during signup:', profileError);
      }
    } catch (profileErr) {
      console.error('Profile creation exception:', profileErr);
    }

    return {
      id: data.user.id,
      name: email.split('@')[0],
      email: data.user.email || email,
      role: 'staff',
      status: 'Active',
      avatar: null
    };
  },

  /**
   * Restores session from active Supabase auth session
   */
  async getSession(): Promise<AdminUser | null> {
    const { data: { session }, error } = await supabase.auth.getSession();

    if (error || !session?.user) {
      return null;
    }

    const user = session.user;

    try {
      const { data: profile } = await supabase
        .from('admins')
        .select('*')
        .eq('auth_user_id', user.id)
        .maybeSingle();

      if (profile && (profile.status === 'Suspended' || !profile.is_active)) {
        await supabase.auth.signOut();
        return null;
      }

      return {
        id: user.id,
        name: profile?.full_name || user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
        email: user.email || profile?.email || '',
        role: (profile?.role || user.user_metadata?.role || 'staff') as UserRole,
        status: profile?.status === 'Suspended' || (profile && !profile.is_active) ? 'Disabled' : 'Active',
        avatar: profile?.avatar_url || null
      };
    } catch (e) {
      console.error('Session restore failed to fetch profile:', e);
      return {
        id: user.id,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin User',
        email: user.email || '',
        role: (user.user_metadata?.role || 'staff') as UserRole,
        status: 'Active',
        avatar: null
      };
    }
  },

  /**
   * Uploads an avatar image to Supabase Storage and updates the database
   */
  async uploadAvatar(userId: string, file: File): Promise<string> {
    try {
      await supabase.storage.createBucket('admin-avatars', {
        public: true
      });
    } catch (bucketErr) {
      // Bucket might already exist, which is fine
    }

    const fileExt = file.name.split('.').pop() || 'png';
    const filePath = `${userId}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await supabase.storage
      .from('admin-avatars')
      .upload(filePath, file, {
        upsert: true,
        contentType: file.type
      });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from('admin-avatars')
      .getPublicUrl(filePath);

    if (!data?.publicUrl) {
      throw new Error('Failed to retrieve uploaded image public URL.');
    }

    const publicUrl = data.publicUrl;

    const { error: dbError } = await supabase
      .from('admins')
      .update({ avatar_url: publicUrl })
      .eq('auth_user_id', userId);

    if (dbError) {
      throw dbError;
    }

    return publicUrl;
  },

  /**
   * Terminates active session
   */
  async logout(): Promise<void> {
    await supabase.auth.signOut();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }
};
