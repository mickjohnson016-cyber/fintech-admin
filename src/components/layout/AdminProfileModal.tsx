'use client';

import React, { useState, useRef, useMemo, useEffect } from'react';
import { useRouter } from'next/navigation';
import { motion, AnimatePresence } from'framer-motion';
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
 Image as ImageIcon,
 Users,
 Search,
 Filter,
 MoreHorizontal,
 ShieldCheck,
 UserX,
 UserPlus,
 ShieldAlert,
 ChevronRight,
 Plus,
 Clock,
 ExternalLink,
 ShieldClose,
 MoreVertical,
 Activity,
 Key,
 Monitor,
 Lock,
 Globe
} from'lucide-react';
import { useLayout } from'@/contexts/LayoutContext';
import { useUser } from'@/contexts/UserContext';
import { useAuth } from'@/contexts/AuthContext';
import { Button } from'@/components/ui/button';
import { cn } from'@/lib/utils';
import { toast } from'sonner';
import { QuickActionModal } from'@/components/ui/QuickActionModal';

interface Admin {
 id: string;
 name: string;
 email: string;
 role: string;
 status:'Active' |'Suspended' |'Offline';
 lastActive: string;
 avatar: string | null;
}

const AVATAR_OPTIONS = [
 { id:'admin-m', image:'/assets/avatars/admin-m.png' },
 { id:'admin-f', image:'/assets/avatars/admin-f.png' },
 { id:'analyst', image:'/assets/avatars/analyst.png' },
 { id:'compliance', image:'/assets/avatars/compliance.png' },
 { id:'support', image:'/assets/avatars/support.png' },
 { id:'engineering', image:'/assets/avatars/engineering.png' },
 { id:'security', image:'/assets/avatars/security.png' },
 { id:'generic', image:'/assets/avatars/generic.png' },
];

export default function AdminProfileModal() {
 const router = useRouter();
 const { isProfileOpen, setIsProfileOpen } = useLayout();
 const { user, updateUser } = useUser();
 const { logout, user: authUser } = useAuth();
 const [activeTab, setActiveTab] = useState<'profile' |'team'>('profile');
 
 // Profile States
 const [isEditing, setIsEditing] = useState(false);
 const [isUploading, setIsUploading] = useState(false);
 const [formData, setFormData] = useState({ name: user.name, email: user.email });
 const fileInputRef = useRef<HTMLInputElement>(null);

 // Team States
 const [searchTerm, setSearchTerm] = useState('');
 const [activeAdminMenu, setActiveAdminMenu] = useState<string | null>(null);
 const [isAddAdminModalOpen, setIsAddAdminModalOpen] = useState(false);
 const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
 const [adminToDelete, setAdminToDelete] = useState<Admin | null>(null);
 
 const [adminList, setAdminList] = useState<Admin[]>([]);

 useEffect(() => {
 if (isProfileOpen) {
 setFormData({ name: user.name, email: user.email });
 }
 }, [user, isProfileOpen]);

 const filteredAdmins = useMemo(() => {
 return adminList.filter(a => 
 a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
 a.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
 a.role.toLowerCase().includes(searchTerm.toLowerCase())
 );
 }, [adminList, searchTerm]);

 // Navigation Helper
 const handleNavigate = (path: string) => {
 const loadId = toast.loading('Accessing secure section...');
 setTimeout(() => {
 toast.dismiss(loadId);
 setIsProfileOpen(false);
 router.push(path);
 }, 600);
 };

 // Handlers
 const handleSaveProfile = () => {
 updateUser(formData);
 setIsEditing(false);
 toast.success('Identity Updated');
 };

 const handleAvatarSelect = (img: string) => {
 updateUser({ avatar: img });
 toast.success('Avatar Updated');
 };

 const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
 const file = e.target.files?.[0];
 if (!file) return;
 setIsUploading(true);
 setTimeout(() => {
 updateUser({ avatar: URL.createObjectURL(file) });
 setIsUploading(false);
 toast.success('Custom Avatar Uploaded');
 }, 800);
 };

 const handleAddAdmin = (data: any) => {
 const newAdmin: Admin = {
 id:`ADM-${Math.floor(Math.random() * 1000).toString().padStart(3,'0')}`,
 name: data.name,
 email: data.email,
 role: data.role,
 status:'Active',
 lastActive:'Just now',
 avatar: null
 };
 setAdminList(prev => [newAdmin, ...prev]);
 setIsAddAdminModalOpen(false);
 toast.success('Admin Invited');
 };

 const handleDeleteAdmin = () => {
 if (!adminToDelete) return;
 setAdminList(prev => prev.filter(a => a.id !== adminToDelete.id));
 setIsDeleteModalOpen(false);
 setAdminToDelete(null);
 toast.error('Admin Access Revoked');
 };

 const handleToggleStatus = (id: string) => {
 setAdminList(prev => prev.map(a => {
 if (a.id === id) {
 const newStatus = a.status ==='Suspended' ?'Active' :'Suspended';
 toast.info(`Admin ${newStatus}`);
 return { ...a, status: newStatus as any };
 }
 return a;
 }));
 setActiveAdminMenu(null);
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
 className="fixed inset-0 bg-background/90 backdrop-blur-xl z-[150]"
 />

 <div className="fixed inset-0 flex items-center justify-center z-[151] p-4 pointer-events-none">
 <motion.div
 initial={{ scale: 0.95, opacity: 0, y: 10 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.95, opacity: 0, y: 10 }}
 className="w-full max-w-5xl bg-card border border-border/50 rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto flex flex-col md:flex-row h-[85vh] max-h-[800px]"
 >
 {/* Sidebar Tabs */}
 <div className="w-full md:w-72 bg-secondary/30 border-r border-border/20 p-8 flex flex-col shrink-0">
 <div className="flex items-center gap-4 mb-10">
 <div className="size-12 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
 <ShieldCheck size={24} />
 </div>
 <div>
 <h2 className="text-[16px] font-black tracking-tight text-foreground">Admin Center</h2>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Platform Governance</p>
 </div>
 </div>

 <div className="flex-1 space-y-2">
 <button 
 onClick={() => setActiveTab('profile')}
 className={cn(
"w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all",
 activeTab ==='profile' ?"bg-primary text-white shadow-xl shadow-primary/20" :"text-muted-foreground hover:bg-secondary hover:text-foreground"
 )}
 >
 <User size={18} />
 My Identity
 </button>
 <button 
 onClick={() => handleNavigate('/settings/access-keys')}
 className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all"
 >
 <Key size={18} />
 Access Keys
 </button>
 <button 
 onClick={() => setActiveTab('team')}
 className={cn(
"w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest transition-all",
 activeTab ==='team' ?"bg-primary text-white shadow-xl shadow-primary/20" :"text-muted-foreground hover:bg-secondary hover:text-foreground"
 )}
 >
 <Users size={18} />
 Manage Team
 </button>
 </div>

 <div className="pt-6 mt-auto border-t border-border/10">
 <button 
 onClick={() => { logout(); setIsProfileOpen(false); toast.info('Session Ended'); }}
 className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-[12px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 transition-all"
 >
 <LogOut size={18} />
 Sign Out
 </button>
 </div>
 </div>

 {/* Main Content Area */}
 <div className="flex-1 flex flex-col overflow-hidden relative">
  {/* Close Button - Repositioned to top-right with clear area */}
  <div className="absolute top-6 right-6 z-30">
  <button 
  onClick={() => setIsProfileOpen(false)}
  className="p-2.5 bg-background/80 backdrop-blur-md hover:bg-secondary border border-border/40 rounded-2xl text-muted-foreground hover:text-foreground transition-all shadow-sm"
  >
  <X size={18} />
  </button>
  </div>

  <div className="flex-1 overflow-y-auto p-8 md:p-12 md:pt-16 custom-scrollbar">
 <AnimatePresence mode="wait">
 {activeTab === 'profile' ? (
 <motion.div
 key="profile"
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 className="space-y-12 pb-10"
 >
 <div className="space-y-1">
 <h3 className="text-3xl font-black text-foreground tracking-tighter">My Identity</h3>
 <p className="text-sm font-medium text-muted-foreground">Manage your administrative profile and cryptographic identity.</p>
 </div>

 <div className="flex flex-col xl:flex-row gap-12 items-start">
  {/* Avatar Setup */}
  <div className="space-y-6 shrink-0">
  <div className="relative group cursor-pointer size-32" onClick={() => fileInputRef.current?.click()}>
  <div className="size-full rounded-[40px] bg-secondary border-4 border-card shadow-xl flex items-center justify-center overflow-hidden">
  {isUploading ? <Loader2 className="animate-spin text-primary" /> : (
  user.avatar ? <img src={user.avatar} className="size-full object-cover" /> : <User size={48} className="text-muted-foreground/20" />
  )}
  </div>
  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex flex-col items-center justify-center text-white rounded-[40px] gap-1.5 p-2">
  <Camera size={20} className="mb-0.5" />
  <span className="text-[10px] font-black uppercase tracking-[0.15em] leading-none">Update</span>
  </div>
  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
  </div>
 <div className="space-y-1 text-center xl:text-left">
 <p className="text-[13px] font-black text-foreground">{user.name || "Configure Identity"}</p>
 <p className="text-[10px] font-black text-primary uppercase tracking-widest">{user.role || "No role assigned"}</p>
 </div>
 </div>

 {/* Profile Form */}
 <div className="flex-1 space-y-6 w-full">
 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Full Name</label>
 <div className="relative group">
 <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
 <input 
 placeholder="Your full name"
 readOnly={!isEditing}
 value={formData.name}
 onChange={(e) => setFormData({ ...formData, name: e.target.value })}
 className="w-full bg-secondary/30 border border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-primary/40 transition-all"
 />
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Email Address</label>
 <div className="relative group">
 <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
 <input 
 placeholder="Your email address"
 readOnly={!isEditing}
 value={formData.email}
 onChange={(e) => setFormData({ ...formData, email: e.target.value })}
 className="w-full bg-secondary/30 border border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:border-primary/40 transition-all"
 />
 </div>
 </div>
 </div>

 <div className="flex justify-end gap-3 pt-4 border-t border-border/5">
 {isEditing ? (
 <>
 <Button variant="ghost" onClick={() => setIsEditing(false)} className="h-11 rounded-xl px-6 text-[11px] font-black uppercase tracking-widest">Cancel</Button>
 <Button onClick={handleSaveProfile} className="h-11 rounded-xl bg-primary text-white px-8 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Save Profile</Button>
 </>
 ) : (
 <Button onClick={() => setIsEditing(true)} variant="outline" className="h-11 rounded-xl border-border/40 px-8 text-[11px] font-black uppercase tracking-widest">Edit Information</Button>
 )}
 </div>
 </div>
 </div>

 {/* Security & Preferences Section - Functionalized */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
 {/* Security Settings */}
 <div className="space-y-6">
 <div className="flex items-center justify-between border-b border-border/10 pb-4">
 <div className="flex items-center gap-2">
 <Shield size={16} className="text-primary" />
 <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Security & Access</h4>
 </div>
 <button onClick={() => handleNavigate('/settings/security')} className="text-[9px] font-black uppercase text-primary hover:underline">Manage All</button>
 </div>
 <div className="space-y-4">
 <motion.button 
 whileHover={{ scale: 1.01, x: 4 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => handleNavigate('/settings/security')}
 className="w-full flex items-center justify-between p-4 bg-secondary/10 border border-border/5 rounded-2xl hover:bg-secondary/20 hover:border-primary/20 transition-all text-left group"
 >
 <div className="space-y-1">
 <p className="text-[12px] font-black text-foreground group-hover:text-primary transition-colors">Active Sessions</p>
 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">1 Active Session</p>
 </div>
 <Monitor size={16} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
 </motion.button>

 <motion.button 
 whileHover={{ scale: 1.01, x: 4 }}
 whileTap={{ scale: 0.98 }}
 onClick={() => handleNavigate('/settings/security')}
 className="w-full flex items-center justify-between p-4 bg-secondary/10 border border-border/5 rounded-2xl hover:bg-secondary/20 hover:border-primary/20 transition-all text-left group"
 >
 <div className="space-y-1">
 <p className="text-[12px] font-black text-foreground group-hover:text-primary transition-colors">Two-Factor Auth</p>
 <p className="text-[10px] font-medium text-rose-500 uppercase tracking-widest">Disabled</p>
 </div>
 <Lock size={16} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
 </motion.button>
 </div>
 </div>

 {/* Preferences */}
 <div className="space-y-6">
  <div className="flex items-center justify-between border-b border-border/10 pb-4">
  <div className="flex items-center gap-2">
  <Settings size={16} className="text-primary" />
  <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Preferences</h4>
  </div>
  <button onClick={() => handleNavigate('/settings/appearance')} className="text-[9px] font-black uppercase text-primary hover:underline">Customize</button>
  </div>
  <div className="space-y-4">
  <motion.button 
  whileHover={{ scale: 1.01, x: 4 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => handleNavigate('/settings/appearance')}
  className="w-full flex items-center justify-between p-4 bg-secondary/10 border border-border/5 rounded-2xl hover:bg-secondary/20 hover:border-primary/20 transition-all text-left group"
  >
  <div className="space-y-1">
  <p className="text-[12px] font-black text-foreground group-hover:text-primary transition-colors">Default View</p>
  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Platform Overview</p>
  </div>
  <Globe size={16} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
  </motion.button>

  <motion.button 
  whileHover={{ scale: 1.01, x: 4 }}
  whileTap={{ scale: 0.98 }}
  onClick={() => handleNavigate('/settings/organization')}
  className="w-full flex items-center justify-between p-4 bg-secondary/10 border border-border/5 rounded-2xl hover:bg-secondary/20 hover:border-primary/20 transition-all text-left group"
  >
  <div className="space-y-1">
  <p className="text-[12px] font-black text-foreground group-hover:text-primary transition-colors">Data Format</p>
  <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">NGN • UTC+1</p>
  </div>
  <Activity size={16} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
  </motion.button>
  </div>
  </div>
 </div>

  {/* Recent Profile Activity - Functionalized */}
  <div className="space-y-6 pb-6">
  <div className="flex items-center justify-between border-b border-border/10 pb-4">
  <div className="flex items-center gap-2">
  <Activity size={16} className="text-primary" />
  <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">Identity Logs</h4>
  </div>
  <button onClick={() => handleNavigate('/settings/admins')} className="text-[9px] font-black uppercase text-primary hover:underline">Audit View</button>
  </div>
  
  <motion.button 
  whileHover={{ scale: 1.005 }}
  onClick={() => handleNavigate('/settings/admins')}
  className="w-full py-12 text-center border-2 border-dashed border-border/10 rounded-[32px] hover:border-primary/20 hover:bg-primary/[0.02] transition-all cursor-pointer group"
  >
  <Clock size={24} className="mx-auto text-muted-foreground/20 mb-3 group-hover:text-primary/40 transition-colors" />
  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary/60 transition-colors">View Recent Identity Activity</p>
  <p className="text-[9px] font-medium text-muted-foreground/40 mt-1">Access detailed audit trails and session history.</p>
  </motion.button>
  </div>
 </motion.div>
 ) : (
 <motion.div
 key="team"
 initial={{ opacity: 0, x: 10 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: -10 }}
 className="space-y-8 flex flex-col h-full"
 >
 <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
 <div className="space-y-1">
 <h3 className="text-3xl font-black text-foreground tracking-tighter">Team Directory</h3>
 <p className="text-sm font-medium text-muted-foreground">Manage administrative accounts and permissions.</p>
 </div>
 <Button onClick={() => setIsAddAdminModalOpen(true)} className="h-11 rounded-2xl bg-primary text-white px-6 text-[11px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2">
 <UserPlus size={18} /> Add Admin
 </Button>
 </div>

 {/* Search */}
 <div className="p-2 bg-secondary/30 border border-border/20 rounded-2xl">
 <div className="relative group">
 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <input 
 placeholder="Search admins..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-transparent py-3 pl-12 pr-4 text-sm font-bold outline-none"
 />
 </div>
 </div>

 {/* Admin List Area */}
 <div className="flex-1 overflow-y-auto min-h-0 space-y-3 pr-2 custom-scrollbar">
 {filteredAdmins.length > 0 ? filteredAdmins.map((admin) => (
 <div key={admin.id} className="p-4 bg-secondary/10 border border-border/5 rounded-3xl flex items-center justify-between group hover:bg-secondary/30 hover:border-primary/20 transition-all">
 <div className="flex items-center gap-4">
 <div className="size-12 rounded-2xl bg-background border border-border/40 overflow-hidden shrink-0 flex items-center justify-center">
 {admin.avatar ? (
 <img src={admin.avatar} className="size-full object-cover" onError={(e) => (e.currentTarget.src =`https://ui-avatars.com/api/?name=${admin.name}&background=random`)} />
 ) : (
 <User size={24} className="text-muted-foreground/30" />
 )}
 </div>
 <div className="space-y-0.5">
 <div className="flex items-center gap-2">
 <p className="text-[13px] font-black text-foreground leading-none">{admin.name}</p>
 <span className={cn(
"px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
 admin.status ==='Active' ?"bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
 admin.status ==='Suspended' ?"bg-rose-500/10 text-rose-500 border-rose-500/20" :"bg-muted text-muted-foreground border-border/20"
 )}>{admin.status}</span>
 </div>
 <p className="text-[11px] font-medium text-muted-foreground">{admin.email}</p>
 <p className="text-[9px] font-black text-primary uppercase tracking-widest">{admin.role}</p>
 </div>
 </div>

 <div className="flex items-center gap-6">
 <div className="text-right hidden sm:block">
 <p className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">Activity</p>
 <p className="text-[11px] font-bold text-foreground">{admin.lastActive}</p>
 </div>
 <div className="relative">
 <button 
 onClick={() => setActiveAdminMenu(activeAdminMenu === admin.id ? null : admin.id)}
 className="p-2.5 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-primary transition-all"
 >
 <MoreVertical size={18} />
 </button>
 <AnimatePresence>
 {activeAdminMenu === admin.id && (
 <>
 <div className="fixed inset-0 z-30" onClick={() => setActiveAdminMenu(null)} />
 <motion.div 
 initial={{ opacity: 0, scale: 0.95, y: 5 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 5 }}
 className="absolute right-0 mt-3 w-48 bg-card border border-border/40 rounded-2xl shadow-2xl z-40 overflow-hidden p-1.5"
 >
 <button onClick={() => handleToggleStatus(admin.id)} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
 <ShieldAlert size={14} /> {admin.status ==='Suspended' ?'Activate' :'Suspend'}
 </button>
 <button 
 onClick={() => { setAdminToDelete(admin); setIsDeleteModalOpen(true); setActiveAdminMenu(null); }}
 className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5 transition-all"
 >
 <Trash2 size={14} /> Revoke Access
 </button>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 )) : (
 <div className="flex flex-col items-center justify-center py-24 border-2 border-dashed border-border/10 rounded-[40px] text-center">
 <div className="p-6 bg-secondary rounded-full mb-6">
 <Users size={40} className="text-muted-foreground/30" />
 </div>
 <h4 className="text-[14px] font-black text-foreground uppercase tracking-widest">No administrators configured</h4>
 <p className="text-[12px] font-medium text-muted-foreground mt-2 max-w-xs mx-auto">
 Initialize your management cluster by inviting your first team member.
 </p>
 <Button onClick={() => setIsAddAdminModalOpen(true)} variant="outline" className="mt-8 h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40">
 Create First Admin
 </Button>
 </div>
 )}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </motion.div>
 </div>

 <QuickActionModal
 isOpen={isDeleteModalOpen}
 onClose={() => setIsDeleteModalOpen(false)}
 onConfirm={handleDeleteAdmin}
 title="Revoke Admin Access"
 description={`Confirm removal of ${adminToDelete?.name} from system governance.`}
 icon={UserX}
 type="danger"
 confirmLabel="Revoke Access"
 />

 <QuickActionModal
 isOpen={isAddAdminModalOpen}
 onClose={() => setIsAddAdminModalOpen(false)}
 onConfirm={() => {}} // Form handled internally
 title="Invite New Administrator"
 description="Grant system access to a new team member."
 icon={UserPlus}
 confirmLabel="Send Invitation"
 >
 <form onSubmit={(e) => {
 e.preventDefault();
 const formData = new FormData(e.currentTarget);
 handleAddAdmin({
 name: formData.get('name'),
 email: formData.get('email'),
 role: formData.get('role')
 });
 }} className="space-y-4">
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Full Name</label>
 <input name="name" required placeholder="e.g. David Okonjo" className="w-full bg-secondary/50 border border-border/40 rounded-xl p-4 text-[13px] font-bold outline-none focus:border-primary/40" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Email Address</label>
 <input name="email" type="email" required placeholder="admin@oinzpay.com" className="w-full bg-secondary/50 border border-border/40 rounded-xl p-4 text-[13px] font-bold outline-none focus:border-primary/40" />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Role Assignment</label>
 <select name="role" required className="w-full bg-secondary/50 border border-border/40 rounded-xl p-4 text-[13px] font-bold outline-none focus:border-primary/40">
 <option>Super Admin</option>
 <option>Compliance Officer</option>
 <option>Security Engineer</option>
 </select>
 </div>
 <Button type="submit" className="w-full h-12 rounded-xl bg-primary text-white font-black text-[11px] uppercase tracking-widest mt-4">Send Invitation</Button>
 </form>
 </QuickActionModal>
 </>
 )}
 </AnimatePresence>
 );
}
