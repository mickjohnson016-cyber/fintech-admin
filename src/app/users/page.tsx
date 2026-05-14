'use client';

import React, { useState, useMemo } from'react';
import {
 Search,
 Filter,
 UserX,
 RefreshCw,
 TrendingUp,
 ShieldAlert,
 ShieldCheck,
 Users,
 Activity,
 Smartphone,
 CreditCard,
 Lock as LockIcon,
 History,
 AlertCircle,
 ChevronDown,
 FileText,
 ArrowUpRight,
 ArrowDownRight,
 PiggyBank,
 UserCheck,
 MoreHorizontal,
 Download,
 MapPin,
 Fingerprint,
 Zap,
 Clock,
 X,
 Plus,
 ArrowRight,
 CheckCircle2,
 AlertTriangle,
 Wallet,
 Building2,
 Trash2,
 Loader2,
 Eye,
 Copy,
 Ban
} from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from"@/lib/utils";
import { motion, AnimatePresence } from'framer-motion';
import { toast } from'sonner';
import { exportUserStatement } from'@/lib/exportUserStatement';
import { executeExport } from'@/lib/exportUtils';
import { useTableFilters } from'@/hooks/useTableFilters';
import { useRouter } from'next/navigation';
import { DashboardGrid } from'@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from'@/components/ui/AdaptiveMetricCard';
import { EmptyState } from'@/components/ui/EmptyState';
import Breadcrumbs from'@/components/layout/Breadcrumbs';
import { TableActionMenu } from'@/components/ui/TableActionMenu';
import { QuickActionModal } from'@/components/ui/QuickActionModal';
import { ExportModal } from'@/components/ui/ExportModal';

interface UserRecord {
 id: string;
 name: string;
 email: string;
 phone: string;
 balance: string;
 savings: string;
 investments: string;
 kycLevel: string;
 kycStatus: string;
 status: string;
 riskLevel: string;
 riskScore: number;
 deviceTrust: string;
 lastLocation: string;
 linkedDevices: number;
 activityScore: number;
 lastActive: string;
 initials: string;
}

const users: UserRecord[] = [];

const metrics = [
 { label:'Total Customers', value:'0', trend:'--', up: null, icon: Users },
 { label:'Active Users (24h)', value:'0', trend:'--', up: null, icon: Activity },
 { label:'Pending KYC', value:'0', trend:'--', up: null, icon: ShieldCheck },
 { label:'Flagged Accounts', value:'0', trend:'--', up: null, icon: ShieldAlert },
 { label:'Device Collision', value:'0', trend:'--', up: null, icon: Smartphone },
 { label:'Suspended', value:'0', trend:'--', up: null, icon: UserX },
];

export default function UsersPage() {
 const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
 const [userToSuspend, setUserToSuspend] = useState<UserRecord | null>(null);
 const [userToReset, setUserToReset] = useState<UserRecord | null>(null);
 const [isExporting, setIsExporting] = useState(false);
 const [isActionLoading, setIsActionLoading] = useState(false);
 const [isExportModalOpen, setIsExportModalOpen] = useState(false);
 
 const router = useRouter();

 const handleSuspend = () => {
 if (!userToSuspend) return;
 setIsActionLoading(true);
 setTimeout(() => {
 toast.error('Account Suspended', { description:`${userToSuspend.name} has been restricted.` });
 setUserToSuspend(null);
 setIsActionLoading(false);
 }, 1500);
 };

 const handlePasswordReset = () => {
 if (!userToReset) return;
 setIsActionLoading(true);
 setTimeout(() => {
 toast.success('Reset Email Sent', { description:`A link has been sent to ${userToReset.email}.` });
 setUserToReset(null);
 setIsActionLoading(false);
 }, 1500);
 };

 const {
 searchTerm,
 setSearchTerm,
 filteredData,
 statusFilter,
 setStatusFilter
 } = useTableFilters(users, {
 searchKeys: ['name','email','id','phone']
 });

 const handleExportStatement = async (user: any) => {
 if (!user) return;
 setIsExporting(true);
 try {
 await exportUserStatement(user);
 toast.success("Statement exported");
 } catch (error) {
 console.error("PDF Export Error:", error);
 toast.error("Export failed");
 } finally {
 setIsExporting(false);
 }
 };

 return (
 <div className="space-y-6 pb-20 animate-in fade-in duration-500">
 <Breadcrumbs />

 {/* Header */}
 <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
 <div className="space-y-1">
 <h1 className="text-2xl font-semibold text-foreground tracking-tight">Customer Directory</h1>
 <p className="text-[14px] text-muted-foreground">Monitor user activity, risk assessments, and account governance.</p>
 </div>
 <div className="flex items-center gap-2">
 <Button 
 onClick={() => setIsExportModalOpen(true)}
 variant="outline" 
 className="h-9 px-4 rounded-lg text-[13px] font-semibold border-border/60 hover:bg-muted flex items-center gap-2"
 >
 <Download size={14} /> Export Report
 </Button>
 </div>
 </div>

 {/* Analytics Grid */}
 <DashboardGrid cols={6}>
 {metrics.map((stat, i) => (
 <AdaptiveMetricCard
 key={i}
 label={stat.label}
 value={stat.value}
 icon={stat.icon}
 trend={stat.trend !=='--' ? stat.trend : undefined}
 trendUp={stat.up}
 />
 ))}
 </DashboardGrid>

 {/* Filter & Search Section */}
 <div className="flex flex-col xl:flex-row items-center justify-between gap-4">
 <div className="relative flex-1 w-full group max-w-md">
 <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
 <input
 type="text"
 placeholder="Search by name, email, or account ID..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-background border border-border/60 rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all"
 />
 </div>
 <div className="flex items-center gap-2 w-full xl:w-auto">
 <select
 value={statusFilter}
 onChange={(e) => setStatusFilter(e.target.value)}
 className="h-9 bg-background border border-border/60 rounded-lg px-3 text-[13px] font-semibold text-muted-foreground outline-none focus:border-primary/50 transition-all appearance-none min-w-[140px]"
 >
 <option value="all">All Statuses</option>
 <option value="Active">Active</option>
 <option value="Flagged">Flagged</option>
 <option value="Frozen">Frozen</option>
 <option value="Limited">Limited</option>
 </select>
 </div>
 </div>

 {/* Table Section */}
 <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
 <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-muted/10">
 <h3 className="text-[13px] font-semibold text-foreground flex items-center gap-2">
 Customer Ledger
 </h3>
 <div className="flex bg-muted/50 p-1 rounded-lg border border-border/20">
 {['all','Active','Flagged','Frozen'].map((status) => (
 <button
 key={status}
 onClick={() => setStatusFilter(status)}
 className={cn(
"px-3 py-1 rounded-md text-[11px] font-semibold transition-all",
 statusFilter === status ?"bg-primary text-primary-foreground shadow-sm" :"text-muted-foreground hover:text-foreground"
 )}
 >
 {status.charAt(0).toUpperCase() + status.slice(1)}
 </button>
 ))}
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse">
 <thead>
 <tr className="bg-muted/5 text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">
 <th className="px-6 py-3 border-b border-border/30">Customer</th>
 <th className="px-6 py-3 border-b border-border/30">Compliance</th>
 <th className="px-6 py-3 border-b border-border/30">Trust Score</th>
 <th className="px-6 py-3 border-b border-border/30 text-right">Activity</th>
 <th className="px-6 py-3 border-b border-border/30"></th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border/30">
 {filteredData.length > 0 ? filteredData.map((user) => (
 <tr
 key={user.id}
 onClick={() => router.push(`/users/${user.id}`)}
 className="group hover:bg-muted/30 transition-colors cursor-pointer"
 >
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="relative">
 <div className="size-10 rounded-lg bg-secondary border border-border flex items-center justify-center text-foreground font-semibold text-sm">
 {user.initials}
 </div>
 <div className={cn(
"absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-card",
 user.status ==='Active' ?"bg-emerald-500" :"bg-rose-500"
 )} />
 </div>
 <div className="min-w-0">
 <p className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors">{user.name}</p>
 <p className="text-[12px] text-muted-foreground truncate">{user.email}</p>
 </div>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-2">
 <span className={cn(
"px-1.5 py-0.5 rounded text-[10px] font-semibold border",
 user.kycStatus ==='Verified' ?"bg-emerald-50 text-emerald-600 border-emerald-200" :"bg-amber-50 text-amber-600 border-amber-200"
 )}>
 {user.kycStatus}
 </span>
 <span className={cn(
"px-1.5 py-0.5 rounded text-[10px] font-semibold border",
 user.riskLevel ==='Low' ?"bg-emerald-50 text-emerald-600 border-emerald-200" :"bg-rose-50 text-rose-600 border-rose-200"
 )}>
 {user.riskLevel} Risk
 </span>
 </div>
 </td>
 <td className="px-6 py-4">
 <div className="flex items-center gap-3">
 <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
 <div className={cn("h-full", user.riskScore > 70 ?"bg-rose-500" : user.riskScore > 30 ?"bg-amber-500" :"bg-emerald-500")} style={{ width:`${user.riskScore}%` }} />
 </div>
 <span className="text-[12px] font-medium text-muted-foreground">{user.riskScore}%</span>
 </div>
 </td>
 <td className="px-6 py-4 text-right">
 <div className="space-y-0.5">
 <p className="text-[13px] font-semibold text-foreground">{user.balance}</p>
 <p className="text-[11px] text-muted-foreground uppercase tracking-tight">{user.lastActive}</p>
 </div>
 </td>
 <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
 <TableActionMenu items={[
 { label:'View Profile', icon: Eye, onClick: () => router.push(`/users/${user.id}`) },
 { label:'Copy User ID', icon: Copy, onClick: () => { navigator.clipboard.writeText(user.id); toast.success('Copied'); } },
 { label:'Reset Password', icon: LockIcon, onClick: () => setUserToReset(user), dividerBefore: true },
 { label:'Export Statement', icon: Download, onClick: () => handleExportStatement(user), dividerBefore: true },
 { label:'Suspend Account', icon: Ban, onClick: () => setUserToSuspend(user), variant:'danger', dividerBefore: true },
 ]} />
 </td>
 </tr>
 )) : (
 <tr>
 <td colSpan={5} className="px-6 py-20 text-center">
 <EmptyState 
 icon={Users}
 title="No users found"
 description=""
 />
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 <div className="px-6 py-4 border-t border-border/40 flex items-center justify-between bg-muted/5">
 <p className="text-[12px] font-medium text-muted-foreground">Showing {filteredData.length} customers</p>
 <div className="flex gap-2">
 <Button onClick={() => toast.info('Loading previous segment')} variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-xs font-semibold opacity-50">Previous</Button>
 <Button onClick={() => toast.info('Loading next segment')} variant="ghost" size="sm" className="h-8 px-3 rounded-lg text-xs font-semibold">Next Page</Button>
 </div>
 </div>
 </div>

 {/* MODALS */}
 <ExportModal
 isOpen={isExportModalOpen}
 onClose={() => setIsExportModalOpen(false)}
 title="Export Customer Directory"
 fileName="OINZpay_Customer_Directory"
 data={users}
 headers={['id','name','email','phone','balance','status','kycLevel','riskLevel']}
 />
 <QuickActionModal
 isOpen={!!userToSuspend}
 onClose={() => setUserToSuspend(null)}
 onConfirm={handleSuspend}
 title="Suspend Account"
 description=""
 type="danger"
 confirmLabel="Suspend User"
 isLoading={isActionLoading}
 icon={UserX}
 />

 <QuickActionModal
 isOpen={!!userToReset}
 onClose={() => setUserToReset(null)}
 onConfirm={handlePasswordReset}
 title="Reset Password"
 description=""
 confirmLabel="Send Reset Link"
 isLoading={isActionLoading}
 icon={LockIcon}
 />
 </div>
 );
}
