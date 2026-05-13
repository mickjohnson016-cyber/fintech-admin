'use client';

import React, { useState, useRef } from 'react';
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
  Edit2,
  Trash2,
  Upload,
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { useLayout } from '@/contexts/LayoutContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminProfileModal() {
  const { isProfileOpen, setIsProfileOpen } = useLayout();
  const { user, updateUser } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
  });

  // Sync local form when user context changes or modal opens
  React.useEffect(() => {
    if (isProfileOpen) {
      setFormData({ name: user.name, email: user.email });
    }
  }, [isProfileOpen, user]);

  const handleSave = () => {
    updateUser(formData);
    setIsEditing(false);
    toast.success('Profile Updated', {
      description: 'Changes have been synchronized with the management cluster.'
    });
  };

  const validateAndUpload = (file: File) => {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid format', { description: 'Please upload a PNG, JPG, or WEBP image.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', { description: 'Maximum upload size is 5MB.' });
      return;
    }

    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      const url = URL.createObjectURL(file);
      updateUser({ avatar: url });
      setIsUploading(false);
      toast.success('Avatar Updated', { description: 'Profile image has been updated successfully.' });
    }, 1000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) validateAndUpload(file);
  };

  const handleRemoveAvatar = () => {
    updateUser({ avatar: null });
    toast.info('Avatar Removed', { description: 'Profile image has been reset to default.' });
  };

  return (
    <AnimatePresence>
      {isProfileOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsProfileOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[150]"
          />

          <div className="fixed inset-0 flex items-center justify-center z-[151] p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="w-full max-w-lg bg-card border border-border/50 rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto relative"
            >
              <button 
                onClick={() => setIsProfileOpen(false)}
                className="absolute top-6 right-6 p-2 bg-secondary/50 hover:bg-secondary border border-border/20 rounded-xl text-muted-foreground transition-all z-10"
              >
                <X size={18} />
              </button>

              {/* Profile Header / Banner */}
              <div className="h-32 bg-gradient-to-br from-primary/20 via-blue-500/10 to-transparent relative">
                <div className="absolute -bottom-12 left-8 flex items-end gap-6">
                  <div 
                    className={cn(
                      "relative group cursor-pointer",
                      isDragging && "scale-105"
                    )}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                  >
                    <div className="size-24 rounded-[32px] bg-card border-4 border-card shadow-xl flex items-center justify-center text-primary font-black text-3xl overflow-hidden">
                      {isUploading ? (
                        <Loader2 className="animate-spin text-primary" size={32} />
                      ) : user.avatar ? (
                        <img src={user.avatar} alt={user.name} className="size-full object-cover" />
                      ) : (
                        user.name ? user.name[0] : <User size={40} className="text-muted-foreground/20" />
                      )}
                    </div>
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white rounded-[32px] gap-1"
                    >
                      <Camera size={20} />
                      <span className="text-[8px] font-black uppercase tracking-widest">Update</span>
                    </div>
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      accept="image/png,image/jpeg,image/jpg,image/webp" 
                      onChange={handleFileChange}
                    />
                  </div>
                  <div className="pb-2">
                    <h2 className="text-2xl font-black text-foreground tracking-tighter">
                      {user.name || "Configure Identity"}
                    </h2>
                    <p className="text-[11px] font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                      <Shield size={12} />
                      {user.role}
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
                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          type="text"
                          readOnly={!isEditing}
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          placeholder="Your full name"
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
                        <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          type="email"
                          readOnly={!isEditing}
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="Your email address"
                          className={cn(
                            "w-full bg-secondary/30 border border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none transition-all",
                            isEditing ? "focus:border-primary/40 focus:bg-background" : "cursor-default"
                          )}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    {user.avatar && (
                      <Button 
                        onClick={handleRemoveAvatar}
                        variant="ghost"
                        className="h-10 text-rose-500 hover:text-rose-600 hover:bg-rose-500/5 font-black text-[10px] uppercase tracking-widest flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Remove Image
                      </Button>
                    )}
                    <div className="flex-1" />
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

                {/* Quick Action Buttons */}
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

                {/* Preset Avatars Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-border/5 pb-2">
                    <label className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Preset Identity Icons</label>
                    <span className="text-[8px] font-bold text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded">Quick Select</span>
                  </div>
                  <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
                    {[
                      { id: 'admin-m', image: '/assets/avatars/admin-m.png' },
                      { id: 'admin-f', image: '/assets/avatars/admin-f.png' },
                      { id: 'analyst', image: '/assets/avatars/analyst.png' },
                      { id: 'compliance', image: '/assets/avatars/compliance.png' },
                      { id: 'support', image: '/assets/avatars/support.png' },
                      { id: 'engineering', image: '/assets/avatars/engineering.png' },
                      { id: 'security', image: '/assets/avatars/security.png' },
                      { id: 'generic', image: '/assets/avatars/generic.png' },
                    ].map((avatar) => (
                      <button
                        key={avatar.id}
                        onClick={() => {
                          updateUser({ avatar: avatar.image });
                          toast.success('Avatar Updated', { description: `Switched to ${avatar.id} preset.` });
                        }}
                        className={cn(
                          "size-10 rounded-xl overflow-hidden border-2 transition-all hover:scale-110 active:scale-95 group relative",
                          user.avatar === avatar.image 
                            ? "border-primary ring-2 ring-primary/20 shadow-lg shadow-primary/20 scale-110" 
                            : "border-border/10 hover:border-primary/40"
                        )}
                      >
                        <img 
                          src={avatar.image} 
                          alt={avatar.id} 
                          className="size-full object-cover" 
                          onError={(e) => {
                             (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${avatar.id}&background=random`;
                          }}
                        />
                        {user.avatar === avatar.image && (
                          <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                            <Check size={14} className="text-white drop-shadow-md" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
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
