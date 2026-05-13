'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, User, Mail, CheckCircle2, AlertCircle, Clock, Plus, Upload, Image as ImageIcon, Trash2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

const Modal = ({ isOpen, onClose, title, children, maxWidth = "max-w-lg" }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={cn(
            "relative w-full bg-card border border-border/50 rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]",
            maxWidth
          )}
        >
          <div className="flex items-center justify-between p-8 border-b border-border/10 bg-secondary/5">
            <div className="space-y-1">
              <h3 className="text-xl font-black tracking-tight text-foreground">{title}</h3>
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Platform Administration</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-secondary rounded-2xl transition-all group">
              <X size={20} className="text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          </div>
          <div className="p-8 md:p-10 overflow-y-auto no-scrollbar">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const AVATAR_OPTIONS = [
  { id: 'admin-m', name: 'Admin (M)', image: '/assets/avatars/admin-m.png' },
  { id: 'admin-f', name: 'Admin (F)', image: '/assets/avatars/admin-f.png' },
  { id: 'analyst', name: 'Analyst', image: '/assets/avatars/analyst.png' },
  { id: 'compliance', name: 'Compliance', image: '/assets/avatars/compliance.png' },
  { id: 'support', name: 'Support', image: '/assets/avatars/support.png' },
  { id: 'engineering', name: 'Engineering', image: '/assets/avatars/engineering.png' },
  { id: 'security', name: 'Security', image: '/assets/avatars/security.png' },
  { id: 'generic', name: 'Professional', image: '/assets/avatars/generic.png' },
];

export const RoleModal = ({ 
  isOpen, 
  onClose, 
  role, 
  onSave 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  role: any; 
  onSave: (data: any) => void;
}) => {
  const [formData, setFormData] = useState(role || { name: '', desc: '', avatar: 'admin-m', customAvatar: null });
  const [previewUrl, setPreviewUrl] = useState<string | null>(role?.customAvatar || null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (role) {
      setFormData(role);
      setPreviewUrl(role.customAvatar || null);
    } else {
      setFormData({ name: '', desc: '', avatar: 'admin-m', customAvatar: null });
      setPreviewUrl(null);
    }
  }, [role]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      toast.error('Invalid format', { description: 'Please upload a PNG, JPG, or WEBP image.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large', { description: 'Maximum upload size is 5MB.' });
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setFormData({ ...formData, avatar: 'custom', customAvatar: url });
    toast.success('Avatar Uploaded', { description: 'Custom profile image is ready.' });
  };

  const handleRemoveCustom = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setFormData({ ...formData, avatar: 'admin-m', customAvatar: null });
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={role ? "Edit Role" : "Create New Role"} maxWidth="max-w-xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role Name</label>
          <input
            autoFocus
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full bg-secondary/30 border border-border/20 rounded-2xl p-4 text-[13px] font-bold outline-none focus:border-primary/40 transition-all"
            placeholder="e.g. Compliance Officer"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Description</label>
          <textarea
            required
            value={formData.desc}
            onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
            className="w-full bg-secondary/30 border border-border/20 rounded-2xl p-4 text-[13px] font-bold outline-none focus:border-primary/40 transition-all min-h-[100px] resize-none"
            placeholder="Describe the responsibilities of this role..."
          />
        </div>
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Profile Avatar</label>
          <div className="grid grid-cols-4 gap-3">
            {/* Custom Upload Button */}
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept="image/png,image/jpeg,image/jpg,image/webp" 
            />
            
            <button
              type="button"
              onClick={() => previewUrl ? setFormData({ ...formData, avatar: 'custom' }) : fileInputRef.current?.click()}
              className={cn(
                "relative flex flex-col items-center gap-2 p-3 rounded-2xl border-2 border-dashed transition-all group overflow-hidden",
                formData.avatar === 'custom' 
                  ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                  : "border-border/20 bg-secondary/10 hover:border-primary/30 hover:bg-secondary/20"
              )}
            >
              <div className="size-10 rounded-xl overflow-hidden border border-border/20 shadow-inner flex items-center justify-center bg-background group-hover:scale-105 transition-transform">
                {previewUrl ? (
                  <img src={previewUrl} alt="Custom" className="size-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                    <Camera size={18} strokeWidth={2.5} />
                  </div>
                )}
              </div>
              <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground group-hover:text-primary transition-colors">
                {previewUrl ? "Custom" : "Upload"}
              </span>

              {previewUrl && (
                <button
                  type="button"
                  onClick={handleRemoveCustom}
                  className="absolute top-1 right-1 size-5 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                >
                  <Trash2 size={10} strokeWidth={3} />
                </button>
              )}
            </button>

            {AVATAR_OPTIONS.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setFormData({ ...formData, avatar: avatar.id })}
                className={cn(
                  "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all group",
                  formData.avatar === avatar.id 
                    ? "border-primary bg-primary/5 ring-4 ring-primary/5" 
                    : "border-border/10 bg-secondary/20 hover:border-primary/30 hover:bg-secondary/40"
                )}
              >
                <div className="size-10 rounded-xl overflow-hidden border border-border/20 shadow-inner flex items-center justify-center bg-background group-hover:scale-105 transition-transform">
                  <img 
                    src={avatar.image} 
                    alt={avatar.name} 
                    className="size-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${avatar.name}&background=random`;
                    }}
                  />
                </div>
                <span className="text-[8px] font-black uppercase tracking-tighter text-muted-foreground group-hover:text-primary transition-colors">{avatar.name}</span>
              </button>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] bg-primary text-white shadow-xl shadow-primary/20">
          {role ? "Save Changes" : "Create Role"}
        </Button>
      </form>
    </Modal>
  );
};

export const InviteModal = ({ 
  isOpen, 
  onClose, 
  roles,
  onInvite,
  onCreateRole
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  roles: any[];
  onInvite: (data: any) => void;
  onCreateRole: () => void;
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', roleId: '' });
  const [roleSearch, setRoleSearch] = useState("");
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);

  const selectedRole = roles.find(r => r.id === formData.roleId);
  const filteredRoles = roles.filter(r => 
    r.name.toLowerCase().includes(roleSearch.toLowerCase())
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.roleId) return;
    onInvite({ ...formData, role: selectedRole?.name });
    onClose();
    setFormData({ name: '', email: '', roleId: '' });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Administrator" maxWidth="max-w-2xl">
      <div className="space-y-10">
        {/* Live Preview Section */}
        <div className="bg-secondary/20 border border-border/10 rounded-[32px] p-6 flex items-center gap-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
             <Shield size={100} />
          </div>
          <div className="size-20 rounded-[32px] bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-2xl shadow-inner relative z-10">
            {formData.name ? getInitials(formData.name) : <User size={32} className="opacity-20" />}
          </div>
          <div className="space-y-1 relative z-10">
            <h4 className="text-xl font-black text-foreground tracking-tight">
              {formData.name || "New Administrator"}
            </h4>
            <p className="text-[12px] font-medium text-muted-foreground flex items-center gap-2">
              {formData.email || "email@oinzpay.com"}
              {selectedRole && (
                <>
                  <span className="size-1 bg-muted-foreground/30 rounded-full" />
                  <span className="font-bold text-primary">{selectedRole.name}</span>
                </>
              )}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Full Name</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full h-14 bg-secondary/30 border border-border/20 rounded-2xl pl-14 pr-5 text-[13px] font-bold outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                  placeholder="e.g. David Okonjo"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-14 bg-secondary/30 border border-border/20 rounded-2xl pl-14 pr-5 text-[13px] font-bold outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                  placeholder="david@oinzpay.com"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2 relative">
            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Assign System Role</label>
            <div 
              className={cn(
                "relative group cursor-pointer",
                !isRoleDropdownOpen && "z-0"
              )}
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
            >
              <Shield className="absolute left-5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-hover:text-primary transition-colors" />
              <div className={cn(
                "w-full h-14 bg-secondary/30 border border-border/20 rounded-2xl pl-14 pr-12 flex items-center text-[13px] font-bold transition-all",
                isRoleDropdownOpen ? "border-primary/40 ring-4 ring-primary/5" : "hover:border-primary/20",
                !formData.roleId && "text-muted-foreground/50"
              )}>
                {selectedRole ? selectedRole.name : "Select an access role..."}
              </div>
              <div className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground/30">
                <Shield size={16} />
              </div>

              <AnimatePresence>
                {isRoleDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full left-0 right-0 mt-2 bg-card border border-border/40 rounded-3xl shadow-2xl z-[110] overflow-hidden p-2"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-2 border-b border-border/10 mb-2">
                       <input 
                          autoFocus
                          placeholder="Search roles..."
                          className="w-full bg-secondary/50 border-none rounded-xl px-4 py-2 text-[12px] font-bold outline-none"
                          value={roleSearch}
                          onChange={(e) => setRoleSearch(e.target.value)}
                       />
                    </div>
                    <div className="max-h-[200px] overflow-y-auto custom-scrollbar space-y-1">
                      {filteredRoles.length > 0 ? filteredRoles.map(role => (
                        <button
                          key={role.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, roleId: role.id });
                            setIsRoleDropdownOpen(false);
                          }}
                          className={cn(
                            "w-full px-4 py-3 rounded-xl flex items-center justify-between text-[12px] font-bold transition-all",
                            formData.roleId === role.id ? "bg-primary text-white" : "hover:bg-secondary text-foreground"
                          )}
                        >
                          {role.name}
                          {formData.roleId === role.id && <CheckCircle2 size={14} />}
                        </button>
                      )) : (
                        <div className="py-8 text-center space-y-3">
                           <AlertCircle size={24} className="mx-auto text-muted-foreground/30" />
                           <div className="space-y-1 px-4">
                              <p className="text-[11px] font-black uppercase text-muted-foreground/50">No roles found</p>
                              <p className="text-[9px] font-medium text-muted-foreground/40 leading-tight">You must create a role before inviting admins.</p>
                           </div>
                           <button 
                              type="button"
                              onClick={() => { onCreateRole(); onClose(); }}
                              className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                           >
                              + Create New Role
                           </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="p-6 bg-primary/5 border border-primary/10 rounded-[28px] grid grid-cols-2 gap-6 relative overflow-hidden">
             <div className="space-y-3">
                <div className="flex items-center gap-2">
                   <Lock className="size-3 text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Access Policy</span>
                </div>
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center text-[11px] font-medium">
                      <span className="text-muted-foreground">Permissions</span>
                      <span className="text-foreground font-black">Limited Scope</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-medium">
                      <span className="text-muted-foreground">MFA Status</span>
                      <span className="text-emerald-500 font-black">Required</span>
                   </div>
                </div>
             </div>
             <div className="space-y-3 border-l border-primary/10 pl-6">
                <div className="flex items-center gap-2">
                   <Clock className="size-3 text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-primary">Invitation Link</span>
                </div>
                <div className="space-y-1.5">
                   <div className="flex justify-between items-center text-[11px] font-medium">
                      <span className="text-muted-foreground">Expires In</span>
                      <span className="text-foreground font-black">48 Hours</span>
                   </div>
                   <div className="flex justify-between items-center text-[11px] font-medium">
                      <span className="text-muted-foreground">Auto-Revoke</span>
                      <span className="text-amber-500 font-black">Active</span>
                   </div>
                </div>
             </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-border/10">
            <Button 
              type="button" 
              onClick={onClose}
              variant="outline"
              className="flex-1 h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border-border/40 hover:bg-secondary"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!formData.name || !formData.email || !formData.roleId}
              className="flex-[2] h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] bg-primary text-white shadow-xl shadow-primary/20 disabled:opacity-50"
            >
              Send Invitation
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
