'use client';

import React, { useState, useEffect } from 'react';
import { X, Shield, Lock, User, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, children }: ModalProps) => {
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
          className="relative w-full max-w-lg bg-card border border-border/50 rounded-[32px] shadow-2xl overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-border/10">
            <h3 className="text-lg font-black tracking-tight">{title}</h3>
            <button onClick={onClose} className="p-2 hover:bg-secondary rounded-xl transition-colors">
              <X size={20} className="text-muted-foreground" />
            </button>
          </div>
          <div className="p-6 max-h-[70vh] overflow-y-auto scrollbar-hide">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

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
  const [formData, setFormData] = useState(role || { name: '', desc: '', color: 'bg-primary' });

  useEffect(() => {
    if (role) setFormData(role);
    else setFormData({ name: '', desc: '', color: 'bg-primary' });
  }, [role]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={role ? "Edit Role" : "Create New Role"}>
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
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Role Theme</label>
          <div className="flex gap-3">
            {['bg-red-500', 'bg-blue-500', 'bg-emerald-500', 'bg-amber-500', 'bg-purple-500', 'bg-primary'].map((color) => (
              <button
                key={color}
                type="button"
                onClick={() => setFormData({ ...formData, color })}
                className={cn(
                  "size-8 rounded-full border-2 transition-all",
                  color,
                  formData.color === color ? "border-foreground scale-110 shadow-lg" : "border-transparent opacity-60 hover:opacity-100"
                )}
              />
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
  onInvite 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  roles: any[];
  onInvite: (data: any) => void;
}) => {
  const [formData, setFormData] = useState({ name: '', email: '', role: roles[0]?.name || '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onInvite(formData);
    onClose();
    setFormData({ name: '', email: '', role: roles[0]?.name || '' });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Administrator">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-secondary/30 border border-border/20 rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold outline-none focus:border-primary/40 transition-all"
              placeholder="Full name"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              required
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-secondary/30 border border-border/20 rounded-2xl py-4 pl-12 pr-4 text-[13px] font-bold outline-none focus:border-primary/40 transition-all"
              placeholder="email@oinzpay.com"
            />
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Assign Role</label>
          <select
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full h-14 bg-secondary/30 border border-border/20 rounded-2xl px-4 text-[13px] font-bold outline-none focus:border-primary/40 transition-all appearance-none"
          >
            {roles.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
          </select>
        </div>
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-2">
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-widest">Access Preview</span>
          </div>
          <p className="text-[10px] font-medium text-primary/70 leading-relaxed">
            Invitees will receive a secure link to set up their credentials. Default security policies will apply immediately.
          </p>
        </div>
        <Button type="submit" className="w-full h-14 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] bg-primary text-white shadow-xl shadow-primary/20">
          Send Invitation
        </Button>
      </form>
    </Modal>
  );
};
