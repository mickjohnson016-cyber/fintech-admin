
'use client';

import React, { useState, useEffect, useMemo } from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import { 
  Key, 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Trash2, 
  Copy, 
  ShieldCheck, 
  Clock, 
  User, 
  AlertTriangle,
  ExternalLink,
  ChevronRight,
  ShieldAlert
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { AccessKey, UserRole } from '@/types/auth';
import { keyManagementService } from '@/services/keyManagementService';
import { GenerateKeyModal } from '@/components/settings/KeyModals';
import { QuickActionModal } from '@/components/ui/QuickActionModal';

export default function AccessKeyManagement() {
  const [keys, setKeys] = useState<AccessKey[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('All Roles');
  const [statusFilter, setStatusFilter] = useState<string>('All Status');
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [keyToDelete, setKeyToDelete] = useState<AccessKey | null>(null);

  const fetchKeys = async () => {
    setIsLoading(true);
    const data = await keyManagementService.getKeys();
    setKeys(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const filteredKeys = useMemo(() => {
    return keys.filter(k => {
      const matchesSearch = k.assignedTo.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           k.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = roleFilter === 'All Roles' || k.role === roleFilter;
      const matchesStatus = statusFilter === 'All Status' || k.status === statusFilter;
      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [keys, searchTerm, roleFilter, statusFilter]);

  const handleRevoke = async (id: string) => {
    await keyManagementService.revokeKey(id);
    toast.success('Key revoked successfully');
    fetchKeys();
  };

  const handleDelete = async () => {
    if (!keyToDelete) return;
    await keyManagementService.deleteKey(keyToDelete.id);
    toast.success('Key permanently deleted');
    setKeyToDelete(null);
    fetchKeys();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard');
  };

  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Admin Access Authorization" 
        description="Manage secure access keys and platform governance policies."
      />

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-card border border-border/40 p-4 rounded-[32px] shadow-sm">
        <div className="relative flex-1 group w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            placeholder="Search by user or key ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/30 border border-border/20 rounded-2xl py-3 pl-12 pr-4 text-[12px] font-medium outline-none focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <select 
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="h-11 bg-background border border-border/40 rounded-xl px-4 text-[10px] font-black uppercase outline-none focus:border-primary/40 transition-all"
          >
            <option>All Roles</option>
            <option>Super Admin</option>
            <option>Operations Admin</option>
            <option>Compliance Admin</option>
            <option>Finance Admin</option>
            <option>Support Admin</option>
          </select>
          <Button 
            onClick={() => setIsGenerateModalOpen(true)}
            className="h-11 rounded-xl bg-primary text-white px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2 shrink-0"
          >
            <Plus size={16} /> Generate Key
          </Button>
        </div>
      </div>

      <SettingsCard title="Authorization Cluster" icon={Key}>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border/10 bg-secondary/5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                <th className="px-5 py-3">Assigned User</th>
                <th className="px-5 py-3">Key Identity</th>
                <th className="px-5 py-3">Authorization</th>
                <th className="px-5 py-3">Security Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {filteredKeys.length > 0 ? filteredKeys.map((k) => (
                <tr key={k.id} className="group hover:bg-secondary/10 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-black text-[10px]">
                        {k.assignedTo.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-[12px] font-black text-foreground">{k.assignedTo}</p>
                        <p className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">ID: {k.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <code className="text-[11px] font-black font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded-md border border-border/20">
                      {k.keyDisplay}
                    </code>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex flex-col gap-0.5">
                      <span className="text-[11px] font-black text-foreground uppercase tracking-widest">{k.role}</span>
                      <span className="text-[9px] font-medium text-muted-foreground uppercase tracking-widest">Global Policy</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className={cn(
                        "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                        k.status === 'Active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :
                        k.status === 'Expired' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                        "bg-rose-500/10 text-rose-500 border-rose-500/20"
                      )}>
                        {k.status}
                      </span>
                      {k.expirationDate && (
                        <span className="text-[10px] font-medium text-muted-foreground flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(k.expirationDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={() => copyToClipboard(k.id)} 
                        className="p-2 bg-transparent hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all"
                        title="Copy Key ID"
                      >
                        <Copy size={14} />
                      </button>
                      <button className="p-2 bg-transparent hover:bg-secondary rounded-lg text-muted-foreground hover:text-foreground transition-all" title="View Details">
                        <ExternalLink size={14} />
                      </button>
                      <button 
                        onClick={() => handleRevoke(k.id)}
                        disabled={k.status !== 'Active'}
                        className="p-2 bg-transparent hover:bg-amber-500/10 rounded-lg text-muted-foreground hover:text-amber-500 transition-all disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-muted-foreground"
                        title="Revoke Key"
                      >
                        <ShieldAlert size={14} />
                      </button>
                      <button 
                        onClick={() => setKeyToDelete(k)}
                        className="p-2 bg-transparent hover:bg-rose-500/10 rounded-lg text-muted-foreground hover:text-rose-500 transition-all"
                        title="Delete Permanently"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="py-24 text-center">
                    <div className="flex flex-col items-center gap-4 opacity-30">
                      <Key size={48} className="text-muted-foreground" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No Access Keys Initialized</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </SettingsCard>

      <GenerateKeyModal 
        isOpen={isGenerateModalOpen} 
        onClose={() => setIsGenerateModalOpen(false)} 
        onSuccess={fetchKeys}
      />

      <QuickActionModal
        isOpen={!!keyToDelete}
        onClose={() => setKeyToDelete(null)}
        onConfirm={handleDelete}
        title="Permanently Delete Key"
        description={`This action cannot be undone. The access key for ${keyToDelete?.assignedTo} will be permanently removed from the system logs and authorization state.`}
        icon={Trash2}
        type="danger"
        confirmLabel="Delete Key"
      />
    </div>
  );
}
