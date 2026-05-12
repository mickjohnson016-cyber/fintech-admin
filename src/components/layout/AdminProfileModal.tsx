'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Mail, 
  Shield, 
  Settings, 
  LogOut, 
  Camera,
  Check,
  Edit2
} from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminProfileModal() {
  const { isProfileOpen, setIsProfileOpen } = useLayout();
  const [isEditing, setIsEditing] = useState(false);
  
  // Backend-ready empty state/placeholders
  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    role: 'Global Administrator',
    avatar: null
  });

  const handleSave = () => {
    setIsEditing(false);
    toast.success('Profile Updated', {
      description: 'Changes have been synchronized with the management cluster.'
    });
  };

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[150]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 flex items-center justify-center z-[151] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-card border border-border/50 rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              {/* Close Button */}
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-6 right-6 p-2 bg-secondary/50 hover:bg-secondary border border-border/20 rounded-xl text-muted-foreground transition-all z-10"
              >
                <X size={18} />
              </button>

              {/* Profile Header / Banner */}
              <div className="h-32 bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent relative">
                <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                  <div className="relative group">
                    <div className="size-24 rounded-[32px] bg-card border-4 border-card shadow-xl flex items-center justify-center text-primary font-black text-3xl overflow-hidden">
                      {adminData.name ? adminData.name[0] : <User size={40} className="text-muted-foreground/20" />}
                    </div>
                    <button className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white rounded-[32px]">
                      <Camera size={20} />
                    </button>
                  </div>
                  <div className="pb-2">
                    <h2 className="text-2xl font-black text-foreground tracking-tighter">
                      {adminData.name || "No admin configured"}
                    </h2>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <Shield size={12} />
                      {adminData.role}
                    </p>
                  </div>
                </div>
              </div>

              {/* Modal Content */}
              <div className="px-8 pt-20 pb-8 space-y-8">
                
                {/* Information Fields */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
                      <div className="relative group">
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                          type="text"
                          readOnly={!isEditing}
                          value={adminData.name}
                          onChange={(e) => setAdminData({ ...adminData, name: e.target.value })}
                          placeholder="No admin configured"
                          className={cn(
                            "w-full bg-secondary/30 border border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all",
                            isEditing ? "focus:border-primary/40 focus:bg-background" : "cursor-default"
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input 
                          type="email"
                          readOnly={!isEditing}
                          value={adminData.email}
                          onChange={(e) => setAdminData({ ...adminData, email: e.target.value })}
                          placeholder="No email connected"
                          className={cn(
                            "w-full bg-secondary/30 border border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all",
                            isEditing ? "focus:border-primary/40 focus:bg-background" : "cursor-default"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    {isEditing ? (
                      <Button 
                        onClick={handleSave}
                        className="h-10 rounded-xl bg-primary text-white px-6 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
                      >
                        <Check size={14} /> Save Changes
                      </Button>
                    ) : (
                      <Button 
                        onClick={() => setIsEditing(true)}
                        variant="outline"
                        className="h-10 rounded-xl border-border/40 font-black text-[11px] uppercase tracking-widest flex items-center gap-2"
                      >
                        <Edit2 size={14} /> Edit Profile
                      </Button>
                    )}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center gap-4 p-4 bg-secondary/20 border border-border/10 rounded-[24px] hover:bg-secondary/40 transition-all group text-left">
                    <div className="size-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <Shield size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-foreground uppercase tracking-tight">Security</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">MFA & Auth</p>
                    </div>
                  </button>
                  <button className="flex items-center gap-4 p-4 bg-secondary/20 border border-border/10 rounded-[24px] hover:bg-secondary/40 transition-all group text-left">
                    <div className="size-10 rounded-xl bg-background border border-border/40 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                      <Settings size={18} />
                    </div>
                    <div>
                      <p className="text-[11px] font-black text-foreground uppercase tracking-tight">Preferences</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">UI & Alerts</p>
                    </div>
                  </button>
                </div>

                {/* Logout */}
                <div className="pt-4 border-t border-border/10">
                  <button 
                    onClick={() => {
                      setIsProfileOpen(false);
                      toast.info('Session Terminated', { description: 'You have been successfully logged out.' });
                    }}
                    className="w-full flex items-center justify-between p-4 bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 rounded-[24px] transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                        <LogOut size={18} />
                      </div>
                      <span className="text-[13px] font-black text-red-500 uppercase tracking-widest">Sign Out Account</span>
                    </div>
                    <X size={14} className="text-red-500/40 group-hover:text-red-500 transition-all" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
