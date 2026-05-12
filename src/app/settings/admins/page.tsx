'use client';

import { useState, useMemo } from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import {
  Users2,
  UserPlus,
  ShieldCheck,
  Key,
  MoreVertical,
  Search,
  Mail,
  Shield,
  Activity,
  ChevronRight,
  UserCheck,
  Lock as LockIcon,
  Globe,
  Settings,
  X,
  Plus,
  Trash2,
  Edit2,
  UserX,
  History,
  CheckCircle2,
  Filter,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { RoleModal, InviteModal } from '@/components/settings/AdminModals';
import { executeExport } from '@/lib/exportUtils';

const roles = [
  { name: "Super Admin", count: 2, color: "bg-red-500", desc: "Full system access, all permissions." },
  { name: "Compliance Officer", count: 3, color: "bg-blue-500", desc: "Access to KYC, AML, and reports." },
  { name: "Finance Manager", count: 2, color: "bg-emerald-500", desc: "Treasury and settlement controls." },
  { name: "Operations", count: 5, color: "bg-amber-500", desc: "Provider and transaction management." },
  { name: "Support Agent", count: 8, color: "bg-purple-500", desc: "View only, customer issue resolution." },
];

const admins = [
  { name: "Mick Jagger", email: "mick@oinzpay.com", role: "Super Admin", status: "Active", lastActive: "2m ago", avatar: "MJ" },
  { name: "Sarah Kong", email: "sarah.k@oinzpay.com", role: "Compliance Officer", status: "Active", lastActive: "14m ago", avatar: "SK" },
  { name: "David Olatunji", email: "david.o@oinzpay.com", role: "Finance Manager", status: "Active", lastActive: "1h ago", avatar: "DO" },
  { name: "Jessica Smith", email: "jess@oinzpay.com", role: "Operations", status: "Offline", lastActive: "4h ago", avatar: "JS" },
];

export default function AdminManagement() {
  const [adminList, setAdminList] = useState([
    { id: 'ADM-001', name: "Mick Jagger", email: "mick@oinzpay.com", role: "Super Admin", status: "Active", lastActive: "2m ago", avatar: "MJ" },
    { id: 'ADM-002', name: "Sarah Kong", email: "sarah.k@oinzpay.com", role: "Compliance Officer", status: "Active", lastActive: "14m ago", avatar: "SK" },
    { id: 'ADM-003', name: "David Olatunji", email: "david.o@oinzpay.com", role: "Finance Manager", status: "Active", lastActive: "1h ago", avatar: "DO" },
    { id: 'ADM-004', name: "Jessica Smith", email: "jess@oinzpay.com", role: "Operations", status: "Offline", lastActive: "4h ago", avatar: "JS" },
  ]);

  const [roleList, setRoleList] = useState([
    { id: 'ROLE-001', name: "Super Admin", count: 2, color: "bg-red-500", desc: "Full system access, all permissions." },
    { id: 'ROLE-002', name: "Compliance Officer", count: 3, color: "bg-blue-500", desc: "Access to KYC, AML, and reports." },
    { id: 'ROLE-003', name: "Finance Manager", count: 2, color: "bg-emerald-500", desc: "Treasury and settlement controls." },
    { id: 'ROLE-004', name: "Operations", count: 5, color: "bg-amber-500", desc: "Provider and transaction management." },
    { id: 'ROLE-005', name: "Support Agent", count: 8, color: "bg-purple-500", desc: "View only, customer issue resolution." },
  ]);

  const [permissions, setPermissions] = useState([
    { label: "Transactions", items: ["View", "Create", "Approve", "Refund"], active: [0, 1, 2, 3] },
    { label: "KYC/AML", items: ["View", "Review", "Override", "Delete"], active: [0, 1] },
    { label: "Provider Config", items: ["View", "Modify", "Disable", "Reset"], active: [0] },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState("All Roles");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Modal States
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<any>(null);
  
  // Security & Governance states
  const [governanceRole, setGovernanceRole] = useState("Super Admin");
  const [autoRevokeEnabled, setAutoRevokeEnabled] = useState(true);
  const [multiApprovalEnabled, setMultiApprovalEnabled] = useState(true);
  const [regionalScopeEnabled, setRegionalScopeEnabled] = useState(false);
  const [isAuditRunning, setIsAuditRunning] = useState(false);

  // Filtered Admins
  const filteredAdmins = useMemo(() => {
    return adminList.filter(admin => {
      const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           admin.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesRole = selectedRoleFilter === "All Roles" || admin.role === selectedRoleFilter;
      return matchesSearch && matchesRole;
    });
  }, [adminList, searchTerm, selectedRoleFilter]);

  // Role Actions
  const handleSaveRole = (data: any) => {
    if (selectedRole) {
      setRoleList(prev => prev.map(r => r.id === selectedRole.id ? { ...r, ...data } : r));
      toast.success('Role Updated', { description: `Configuration for "${data.name}" has been synchronized.` });
    } else {
      const newRole = {
        ...data,
        id: `ROLE-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        count: 0
      };
      setRoleList(prev => [...prev, newRole]);
      toast.success('Role Created', { description: `New access scope "${data.name}" is now active.` });
    }
    setSelectedRole(null);
  };

  const deleteRole = (id: string, name: string) => {
    setRoleList(prev => prev.filter(r => r.id !== id));
    toast.error('Role Deleted', { description: `${name} has been purged from system definitions.` });
  };

  // Admin Actions
  const handleInviteAdmin = (data: any) => {
    const newAdmin = {
      id: `ADM-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
      ...data,
      status: "Active",
      lastActive: "Just now",
      avatar: data.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    };
    setAdminList(prev => [newAdmin, ...prev]);
    toast.success('Invitation Sent', { description: `A secure onboarding link has been dispatched to ${data.email}.` });
  };

  const deleteAdmin = (id: string, name: string) => {
    setAdminList(prev => prev.filter(a => a.id !== id));
    toast.error('Account Revoked', { description: `${name}'s administrative privileges have been terminated.` });
  };

  const toggleAdminStatus = (id: string) => {
    setAdminList(prev => prev.map(a => {
      if (a.id === id) {
        const newStatus = a.status === "Active" ? "Offline" : "Active";
        toast.success('Status Toggled', { description: `${a.name} is now ${newStatus}.` });
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  const togglePermission = (scopeIndex: number, itemIndex: number) => {
    const newPermissions = [...permissions];
    const activeItems = [...newPermissions[scopeIndex].active];

    if (activeItems.includes(itemIndex)) {
      newPermissions[scopeIndex].active = activeItems.filter(i => i !== itemIndex);
    } else {
      newPermissions[scopeIndex].active = [...activeItems, itemIndex];
    }

    setPermissions(newPermissions);
    toast.success('Policy Updated', { description: `Granular permission changed in ${newPermissions[scopeIndex].label} scope.` });
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <SettingsHeader
        title="Admin & Role Management"
        description="Govern administrative access via Role-Based Access Control (RBAC). Manage users, permissions, and security scopes."
      />

      <div className="max-w-7xl mx-auto space-y-6">
        {/* Role Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {roleList.map((role) => (
            <div key={role.id} className="bg-card border border-border/40 rounded-[24px] p-5 hover:border-primary/30 hover:bg-secondary/20 transition-all group relative overflow-hidden">
              <div className="flex items-start justify-between mb-3">
                <div className={cn("size-2.5 rounded-full shadow-sm", role.color)} />
                <button
                  onClick={() => deleteRole(role.id, role.name)}
                  className="size-6 bg-secondary/50 rounded-lg flex items-center justify-center text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-red-500 hover:bg-red-500/10 transition-all"
                >
                  <Trash2 size={12} />
                </button>
              </div>
              <h4 className="text-[13px] font-black text-foreground tracking-tight mb-1">{role.name}</h4>
              <p className="text-[10px] font-medium text-muted-foreground leading-snug mb-3 line-clamp-2">{role.desc}</p>
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => { setSelectedRole(role); setIsRoleModalOpen(true); }}
                  className="text-[9px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all"
                >
                  Edit <ChevronRight size={10} />
                </button>
                <span className="text-[9px] font-black text-muted-foreground/40 uppercase">{role.count} Admins</span>
              </div>
            </div>
          ))}
          <button 
            onClick={() => { setSelectedRole(null); setIsRoleModalOpen(true); }}
            className="border-2 border-dashed border-border/40 rounded-[24px] p-5 flex flex-col items-center justify-center gap-2 hover:border-primary/40 hover:bg-primary/5 transition-all group min-h-[120px]"
          >
            <div className="p-2 bg-secondary rounded-xl group-hover:bg-primary group-hover:text-white transition-all">
              <Plus size={16} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Role</span>
          </button>
        </div>

        {/* Admin Table */}
        <SettingsCard
          title="Administrative Directory"
          description="Accounts with system access."
          icon={Users2}
        >
          <div className="flex flex-col gap-6">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-border/20">
              <div className="relative w-full sm:w-64 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="text"
                  placeholder="Search..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-background border border-border/40 rounded-xl py-2 pl-10 pr-4 text-[12px] font-medium outline-none focus:border-primary/40 transition-all"
                />
              </div>
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <select
                  value={selectedRoleFilter}
                  onChange={(e) => setSelectedRoleFilter(e.target.value)}
                  className="flex-1 sm:flex-none h-10 px-4 bg-background border border-border/40 rounded-xl text-[9px] font-black uppercase tracking-widest outline-none focus:border-primary/40 transition-all"
                >
                  <option>All Roles</option>
                  {roleList.map(r => <option key={r.id}>{r.name}</option>)}
                </select>
                <Button onClick={() => setIsInviteModalOpen(true)} className="flex-1 sm:flex-none h-10 rounded-xl font-black text-[9px] uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 flex items-center gap-2">
                  <UserPlus size={14} />
                  Invite
                </Button>
              </div>
            </div>

            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {filteredAdmins.map((admin) => (
                  <motion.div
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    key={admin.id}
                    className="flex items-center justify-between p-4 bg-secondary/10 border border-border/5 rounded-[20px] hover:border-primary/20 hover:bg-secondary/20 transition-all group relative"
                  >
                    <div className="flex items-center gap-4">
                      <div className="size-10 rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/10 flex items-center justify-center text-primary font-black text-sm shadow-inner shrink-0">
                        {admin.avatar}
                      </div>
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <h5 className="text-[13px] font-black text-foreground tracking-tight">{admin.name}</h5>
                          <span className={cn(
                            "px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-colors",
                            admin.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/50"
                          )}>
                            {admin.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                          <span>{admin.email}</span>
                          <span className="size-0.5 bg-muted-foreground/30 rounded-full" />
                          <span className="font-bold text-foreground/70">{admin.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right hidden sm:block">
                        <p className="text-[8px] font-black uppercase tracking-widest text-muted-foreground/40">Active</p>
                        <p className="text-[11px] font-bold text-foreground">{admin.lastActive}</p>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setActiveMenu(activeMenu === admin.id ? null : admin.id)}
                          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-all"
                        >
                          <MoreVertical size={18} />
                        </button>

                        {activeMenu === admin.id && (
                          <>
                            <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
                            <div className="absolute right-0 mt-2 w-44 bg-card border border-border/40 rounded-xl shadow-xl z-20 overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-200">
                              <button onClick={() => { toggleAdminStatus(admin.id); setActiveMenu(null); }} className="w-full px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2.5">
                                <Activity size={14} /> Status
                              </button>
                              <button onClick={() => { toast.success('Password Reset', { description: `Security token dispatched to ${admin.email}.` }); setActiveMenu(null); }} className="w-full px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground flex items-center gap-2.5">
                                <Key size={14} /> Credentials
                              </button>
                              <div className="h-[1px] bg-border/10 my-1" />
                              <button onClick={() => { deleteAdmin(admin.id, admin.name); setActiveMenu(null); }} className="w-full px-3 py-2 text-left text-[10px] font-black uppercase tracking-widest text-red-500 hover:bg-red-500/5 flex items-center gap-2.5">
                                <UserX size={14} /> Revoke
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {filteredAdmins.length === 0 && (
                <div className="py-12 text-center space-y-3 bg-secondary/5 rounded-[24px] border border-dashed border-border/40">
                  <Search size={20} className="text-muted-foreground/20 mx-auto" />
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">No matching admins</p>
                </div>
              )}
            </div>
          </div>
        </SettingsCard>

        {/* New Integrated Security & Governance Section */}
        <div className="bg-card border border-border/50 rounded-[32px] p-8 shadow-sm space-y-8 mt-6">
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-2xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary shrink-0">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h3 className="text-[16px] font-black text-foreground tracking-tight">Security & Governance</h3>
              <p className="text-[12px] font-medium text-muted-foreground">RBAC Policies and Global Guardrails</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Governance Policies */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Governance Policies</h4>
                <Activity size={14} className="text-muted-foreground/30" />
              </div>
              <div className="space-y-1">
                {[
                  { id: 'pol-1', label: "Auto-Revoke", desc: "Revoke after 90d inactivity", icon: Activity, active: autoRevokeEnabled, setter: setAutoRevokeEnabled },
                  { id: 'pol-2', label: "Multi-Approval", desc: "Two admins for sensitive changes", icon: Shield, active: multiApprovalEnabled, setter: setMultiApprovalEnabled },
                  { id: 'pol-3', label: "Regional Scope", desc: "Restrict by geography", icon: Globe, active: regionalScopeEnabled, setter: setRegionalScopeEnabled },
                ].map((policy) => (
                  <button
                    key={policy.id}
                    onClick={() => {
                      policy.setter(!policy.active);
                      toast.success(policy.active ? `${policy.label} disabled` : `${policy.label} enabled`);
                    }}
                    className="w-full flex items-center justify-between py-3 px-2 hover:bg-secondary/40 rounded-xl transition-all group cursor-pointer"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("size-8 rounded-lg flex items-center justify-center border transition-all", policy.active ? "bg-primary/5 border-primary/20 text-primary" : "bg-muted/10 border-border/10 text-muted-foreground/40")}>
                        <policy.icon size={16} />
                      </div>
                      <div className="text-left">
                        <p className="text-[13px] font-bold text-foreground/80 group-hover:text-foreground">{policy.label}</p>
                        <p className="text-[10px] font-medium text-muted-foreground/60">{policy.desc}</p>
                      </div>
                    </div>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                      policy.active ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground/30 border-border/10"
                    )}>
                      {policy.active ? "Enabled" : "Off"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Policy Matrix */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border/40 pb-3">
                <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/50">Policy Matrix: {governanceRole.toUpperCase()}</h4>
                <button 
                  onClick={() => {
                    const nextRole = governanceRole === "Super Admin" ? "Compliance Officer" : "Super Admin";
                    setGovernanceRole(nextRole);
                    toast.success("Policy role switched", { description: `Viewing ${nextRole} policy matrix` });
                  }} 
                  className="text-[10px] font-black text-primary uppercase flex items-center gap-1 hover:underline transition-all"
                >
                  Switch Role <ChevronRight size={12} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                {permissions[0].items.map((item, j) => {
                  const isActive = permissions[0].active.includes(j);
                  return (
                    <button
                      key={j}
                      onClick={() => togglePermission(0, j)}
                      className="flex items-center justify-between py-3 px-2 hover:bg-secondary/30 rounded-xl transition-all group"
                    >
                      <span className="text-[13px] font-bold text-foreground/80 group-hover:text-foreground">{item}</span>
                      {isActive ? (
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      ) : (
                        <X size={16} className="text-muted-foreground/20" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-6 flex items-center gap-4">
                <Button 
                  onClick={() => executeExport({ 
                    fileName: 'RBAC_Policy_Matrix', 
                    data: permissions, 
                    format: 'PDF' 
                  })} 
                  variant="outline" 
                  className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40 hover:bg-secondary px-6"
                >
                  Export Policy
                </Button>
                <div 
                  onClick={() => {
                    setIsAuditRunning(true);
                    toast.success("Audit session started", { description: "Live governance monitoring enabled" });
                    setTimeout(() => setIsAuditRunning(false), 3000);
                  }}
                  className={cn(
                    "flex gap-2 items-center rounded-xl px-3 py-2 cursor-pointer transition-all border",
                    isAuditRunning ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" : "bg-primary/5 border-primary/10 text-primary hover:bg-primary/10"
                  )}
                >
                  {isAuditRunning ? (
                    <>
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Audit Running...</span>
                    </>
                  ) : (
                    <>
                      <Activity size={14} />
                      <span className="text-[9px] font-black uppercase tracking-widest">Audit Active</span>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Management Modals */}
      <RoleModal
        isOpen={isRoleModalOpen}
        onClose={() => { setIsRoleModalOpen(false); setSelectedRole(null); }}
        role={selectedRole}
        onSave={handleSaveRole}
      />
      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        roles={roleList}
        onInvite={handleInviteAdmin}
      />
    </div>
  );
}
