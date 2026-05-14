'use client';

import { useState, useMemo, useEffect } from'react';
import SettingsHeader from'@/components/settings/SettingsHeader';
import SettingsCard from'@/components/settings/SettingsCard';
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
 Loader2,
 ShieldAlert,
 ArrowRightLeft,
 FileText,
 Smartphone,
 Check
} from'lucide-react';
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { toast } from'sonner';
import { motion, AnimatePresence } from'framer-motion';
import { RoleModal, InviteModal } from'@/components/settings/AdminModals';
import { executeExport } from'@/lib/exportUtils';
import { useUser } from'@/contexts/UserContext';
import { QuickActionModal } from'@/components/ui/QuickActionModal';

const getAvatarPath = (avatarId: string | null) => {
 if (!avatarId) return'/assets/avatars/generic.png';
 if (avatarId.startsWith('blob:') || avatarId.startsWith('http') || avatarId.startsWith('data:')) return avatarId;
 
 const paths: Record<string, string> = {
'admin-m':'/assets/avatars/admin-m.png',
'admin-f':'/assets/avatars/admin-f.png',
'analyst':'/assets/avatars/analyst.png',
'compliance':'/assets/avatars/compliance.png',
'support':'/assets/avatars/support.png',
'engineering':'/assets/avatars/engineering.png',
'security':'/assets/avatars/security.png',
'generic':'/assets/avatars/generic.png',
 };
 return paths[avatarId] ||'/assets/avatars/generic.png';
};

export default function AdminManagement() {
 const { user: currentUser } = useUser();
 
 const [adminList, setAdminList] = useState<any[]>([]);
 const [roleList, setRoleList] = useState<any[]>([]);
 const [activityLogs, setActivityLogs] = useState<any[]>([]);

 const [searchTerm, setSearchTerm] = useState("");
 const [selectedRoleFilter, setSelectedRoleFilter] = useState("All Roles");
 const [activeMenu, setActiveMenu] = useState<string | null>(null);

 // Modal States
 const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
 const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [selectedRole, setSelectedRole] = useState<any>(null);
 const [selectedAdmin, setSelectedAdmin] = useState<any>(null);
 
 // Governance states
 const [governanceRole, setGovernanceRole] = useState("No Role Assigned");
 const [autoRevokeEnabled, setAutoRevokeEnabled] = useState(false);
 const [multiApprovalEnabled, setMultiApprovalEnabled] = useState(false);
 const [regionalScopeEnabled, setRegionalScopeEnabled] = useState(false);
 const [isAuditRunning, setIsAuditRunning] = useState(false);

 const [permissions, setPermissions] = useState([
 { label:"Transactions", items: ["View","Create","Approve","Refund"], active: [] },
 { label:"KYC/AML", items: ["View","Review","Override","Delete"], active: [] },
 { label:"Provider Config", items: ["View","Modify","Disable","Reset"], active: [] },
 ]);

 const filteredAdmins = useMemo(() => {
 return adminList.filter(admin => {
 const matchesSearch = admin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
 admin.email.toLowerCase().includes(searchTerm.toLowerCase());
 const matchesRole = selectedRoleFilter ==="All Roles" || admin.role === selectedRoleFilter;
 return matchesSearch && matchesRole;
 });
 }, [adminList, searchTerm, selectedRoleFilter]);

 // Actions
 const handleSaveRole = (data: any) => {
 if (selectedRole) {
 setRoleList(prev => prev.map(r => r.id === selectedRole.id ? { ...r, ...data } : r));
 toast.success('Role Updated');
 } else {
 setRoleList(prev => [...prev, { ...data, id:`ROLE-${Math.random().toString(36).substr(2, 4)}`, count: 0 }]);
 toast.success('Role Created');
 }
 setSelectedRole(null);
 };

 const handleDeleteAdmin = () => {
 if (!selectedAdmin) return;
 setAdminList(prev => prev.filter(a => a.id !== selectedAdmin.id));
 setIsDeleteModalOpen(false);
 setSelectedAdmin(null);
 toast.error('Admin Access Revoked');
 };

 const handleToggleStatus = (id: string) => {
 setAdminList(prev => prev.map(a => {
 if (a.id === id) {
 const newStatus = a.status ==='Active' ?'Suspended' :'Active';
 toast.info(`Admin ${newStatus}`);
 return { ...a, status: newStatus };
 }
 return a;
 }));
 setActiveMenu(null);
 };

 const togglePermission = (scopeIndex: number, itemIndex: number) => {
 const newPermissions = [...permissions];
 const activeItems = [...newPermissions[scopeIndex].active] as number[];
 if (activeItems.includes(itemIndex)) {
 newPermissions[scopeIndex].active = activeItems.filter(i => i !== itemIndex);
 } else {
 newPermissions[scopeIndex].active = [...activeItems, itemIndex];
 }
 setPermissions(newPermissions);
 toast.success('Policy Updated');
 };

 return (
 <div className="space-y-10">
 <SettingsHeader
 title="Admin & Role Management"
 description=""
 />

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 <div className="xl:col-span-2 space-y-8">
 {/* Active Roles */}
 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
 {roleList.map((role) => (
 <div key={role.id} className="p-6 bg-card border border-border/40 rounded-[32px] hover:border-primary/30 transition-all group relative overflow-hidden shadow-sm">
 <div className="flex justify-between items-start mb-4">
 <div className="size-12 rounded-2xl bg-secondary/50 border border-border/10 overflow-hidden flex items-center justify-center">
 <img src={getAvatarPath(role.avatar)} className="size-full object-cover" />
 </div>
 <button onClick={() => { setSelectedRole(role); setIsRoleModalOpen(true); }} className="p-2 text-muted-foreground hover:text-primary transition-colors">
 <Edit2 size={14} />
 </button>
 </div>
 <h4 className="text-[13px] font-black text-foreground mb-1">{role.name}</h4>
 <p className="text-[10px] font-medium text-muted-foreground mb-4 line-clamp-2">{role.desc}</p>
 <div className="flex items-center justify-between pt-4 border-t border-border/5">
 <span className="text-[9px] font-black uppercase text-muted-foreground/40">{role.count} Active Admins</span>
 <ChevronRight size={14} className="text-muted-foreground/20 group-hover:text-primary transition-all group-hover:translate-x-1" />
 </div>
 </div>
 ))}
 <button 
 onClick={() => { setSelectedRole(null); setIsRoleModalOpen(true); }}
 className="border-2 border-dashed border-border/40 rounded-[32px] flex flex-col items-center justify-center gap-2 hover:bg-primary/5 hover:border-primary/20 transition-all min-h-[140px]"
 >
 <div className="p-2 bg-secondary rounded-xl"><Plus size={16} /></div>
 <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">New Role</span>
 </button>
 </div>

 {/* Admin Directory */}
 <SettingsCard
 title="Administrative Directory"
 description=""
 icon={Users2}
 >
 <div className="space-y-6">
 <div className="flex flex-col sm:flex-row gap-4 p-4 bg-secondary/30 rounded-[24px] border border-border/20">
 <div className="relative flex-1 group">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <input 
 placeholder="Search admins..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-background border border-border/40 rounded-xl py-2.5 pl-12 pr-4 text-[12px] font-medium outline-none focus:border-primary/40 transition-all"
 />
 </div>
 <select 
 value={selectedRoleFilter}
 onChange={(e) => setSelectedRoleFilter(e.target.value)}
 className="h-11 bg-background border border-border/40 rounded-xl px-4 text-[10px] font-black uppercase outline-none"
 >
 <option>All Roles</option>
 {roleList.map(r => <option key={r.id}>{r.name}</option>)}
 </select>
 <Button onClick={() => setIsInviteModalOpen(true)} className="h-11 rounded-xl bg-primary text-white px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2 shrink-0">
 <UserPlus size={16} /> Invite
 </Button>
 </div>

 <div className="space-y-3">
 <AnimatePresence mode="popLayout">
   {filteredAdmins.length > 0 && filteredAdmins.map((admin) => (
 <motion.div
 layout
 initial={{ opacity: 0, y: 10 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 key={admin.id}
 className="p-4 bg-secondary/10 border border-border/5 rounded-[24px] flex items-center justify-between group hover:border-primary/20 hover:bg-secondary/20 transition-all"
 >
 <div className="flex items-center gap-4">
 <div className="size-12 rounded-2xl bg-background border border-border/40 overflow-hidden flex items-center justify-center">
 <img src={getAvatarPath(admin.avatar)} className="size-full object-cover" onError={(e) => (e.currentTarget.src =`https://ui-avatars.com/api/?name=${admin.name}&background=random`)} />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <p className="text-[13px] font-black text-foreground">{admin.name}</p>
 <span className={cn(
"px-1.5 py-0.5 rounded-full text-[8px] font-black uppercase border",
 admin.status ==="Active" ?"bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :"bg-rose-500/10 text-rose-500 border-rose-500/20"
 )}>{admin.status}</span>
 </div>
 <p className="text-[11px] font-medium text-muted-foreground">{admin.email}</p>
 <p className="text-[9px] font-black text-primary uppercase mt-0.5 tracking-widest">{admin.role}</p>
 </div>
 </div>
 <div className="flex items-center gap-6">
 <div className="text-right hidden sm:block">
 <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Active</p>
 <p className="text-[11px] font-bold text-foreground">{admin.lastActive}</p>
 </div>
 <div className="relative">
 <button 
 onClick={() => setActiveMenu(activeMenu === admin.id ? null : admin.id)}
 className="p-2 text-muted-foreground hover:text-primary transition-all"
 >
 <MoreVertical size={18} />
 </button>
 {activeMenu === admin.id && (
 <>
 <div className="fixed inset-0 z-10" onClick={() => setActiveMenu(null)} />
 <div className="absolute right-0 mt-2 w-48 bg-card border border-border/40 rounded-2xl shadow-2xl z-20 overflow-hidden p-1.5 animate-in fade-in zoom-in-95 duration-200">
 <button onClick={() => handleToggleStatus(admin.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase text-muted-foreground hover:bg-secondary hover:text-foreground">
 <ShieldAlert size={14} /> {admin.status ==='Suspended' ?'Activate' :'Suspend'}
 </button>
 <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase text-muted-foreground hover:bg-secondary hover:text-foreground">
 <Key size={14} /> Credentials
 </button>
 <div className="h-px bg-border/5 my-1" />
 <button onClick={() => { setSelectedAdmin(admin); setIsDeleteModalOpen(true); setActiveMenu(null); }} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase text-rose-500 hover:bg-rose-500/5">
 <UserX size={14} /> Revoke Access
 </button>
 </div>
 </>
 )}
 </div>
 </div>
 </motion.div>
 ))}
 {filteredAdmins.length === 0 && (
 <div className="py-20 text-center border-2 border-dashed border-border/10 rounded-[40px]">
 <Users2 size={40} className="mx-auto text-muted-foreground/20 mb-4" />
 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No administrators configured</p>
 </div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </SettingsCard>
 </div>

 <div className="xl:col-span-1 space-y-8">
 {/* Governance Panel */}
 <div className="p-8 bg-card border border-border/40 rounded-[40px] space-y-8 shadow-sm">
 <div className="flex items-center gap-3 text-primary">
 <ShieldCheck size={20} />
 <h3 className="text-[14px] font-black uppercase tracking-widest">Governance Control</h3>
 </div>

 <div className="space-y-4">
 {[
 { label:"Auto-Revoke", desc:"Purge after 90d inactivity", active: autoRevokeEnabled, setter: setAutoRevokeEnabled },
 { label:"Multi-Approval", desc:"Requires 2 admins for payouts", active: multiApprovalEnabled, setter: setMultiApprovalEnabled },
 { label:"Regional Scope", desc:"Geo-fence admin sessions", active: regionalScopeEnabled, setter: setRegionalScopeEnabled },
 ].map((policy, i) => (
 <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 rounded-2xl border border-border/10">
 <div className="space-y-0.5">
 <p className="text-[12px] font-black text-foreground">{policy.label}</p>
 <p className="text-[9px] font-medium text-muted-foreground">{policy.desc}</p>
 </div>
 <button onClick={() => policy.setter(!policy.active)} className={cn(
"px-2 py-0.5 rounded-full text-[8px] font-black uppercase border transition-all",
 policy.active ?"bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :"bg-muted text-muted-foreground border-border/50"
 )}>{policy.active ?"ON" :"OFF"}</button>
 </div>
 ))}
 </div>

 <div className="space-y-4 pt-6 border-t border-border/10">
 <div className="flex items-center justify-between">
 <h4 className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Policy Matrix</h4>
 <select 
 value={governanceRole}
 onChange={(e) => setGovernanceRole(e.target.value)}
 className="text-[10px] font-black text-primary uppercase bg-transparent outline-none"
 >
 <option>No Role Assigned</option>
 {roleList.map(r => <option key={r.id}>{r.name}</option>)}
 </select>
 </div>
 <div className="grid grid-cols-2 gap-2">
 {permissions[0].items.map((item, j) => {
 const isActive = permissions[0].active.includes(j);
 return (
 <button 
 key={j} 
 onClick={() => togglePermission(0, j)}
 className={cn(
"flex items-center justify-between p-3 rounded-xl border text-[11px] font-bold transition-all",
 isActive ?"bg-primary/5 border-primary/20 text-primary" :"bg-secondary/20 border-border/5 text-muted-foreground"
 )}
 >
 {item}
 {isActive && <Check size={12} />}
 </button>
 );
 })}
 </div>
 </div>

 <div className="pt-4">
 <Button 
 onClick={() => {
 setIsAuditRunning(true);
 toast.success("Audit Logging Active");
 setTimeout(() => setIsAuditRunning(false), 2500);
 }}
 className="w-full h-11 rounded-xl bg-secondary hover:bg-secondary/80 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2"
 >
 {isAuditRunning ? <Loader2 className="animate-spin" size={14} /> : <Activity size={14} />}
 {isAuditRunning ?"Auditing System..." :"Start Governance Audit"}
 </Button>
 </div>
 </div>

 {/* Activity Logs */}
 <SettingsCard title="Recent Activity" icon={History}>
 <div className="space-y-4">
 {activityLogs.length > 0 ? activityLogs.map((log, i) => (
 <div key={i} className="flex items-start gap-3">
 <div className="size-2 rounded-full bg-primary mt-1.5" />
 <div className="space-y-0.5">
 <p className="text-[11px] font-black text-foreground">{log.action}</p>
 <p className="text-[9px] font-medium text-muted-foreground uppercase">{log.user} • {log.time}</p>
 </div>
 </div>
 )) : (
 <div className="py-10 text-center">
 <p className="text-[9px] font-black uppercase text-muted-foreground/30 tracking-widest">No activity available</p>
 </div>
 )}
 </div>
 </SettingsCard>
 </div>
 </div>

 {/* Modals */}
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
 onInvite={(data) => {
 setAdminList(prev => [...prev, { ...data, id:`ADM-${Math.random().toString(36).substr(2, 4)}`, status:'Active', lastActive:'Just now' }]);
 toast.success('Admin Invited');
 }}
 onCreateRole={() => setIsRoleModalOpen(true)}
 />
 <QuickActionModal
 isOpen={isDeleteModalOpen}
 onClose={() => setIsDeleteModalOpen(false)}
 onConfirm={handleDeleteAdmin}
 title="Revoke Admin Access"
 description={`Confirming removal of administrator account from system governance.`}
 icon={UserX}
 type="danger"
 confirmLabel="Revoke Access"
 />
 </div>
 );
}
