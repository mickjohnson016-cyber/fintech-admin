'use client';

import React, { useState, useMemo } from 'react';
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
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { exportUserStatement } from '@/lib/exportUserStatement';
import { executeExport } from '@/lib/exportUtils';
import { useTableFilters } from '@/hooks/useTableFilters';
import { useRouter } from 'next/navigation';
import { DashboardGrid } from '@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from '@/components/ui/AdaptiveMetricCard';
import { EmptyState } from '@/components/ui/EmptyState';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { ActionMenu } from '@/components/ui/ActionMenu';

// --- MOCK DATA ---

// User type for backend integration
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

// Empty — awaiting backend integration
const users: UserRecord[] = [];

const metrics = [
  { label: 'Total Customers', value: '0', trend: '--', up: null, icon: Users, color: 'primary' },
  { label: 'Active Users (24h)', value: '0', trend: '--', up: null, icon: Activity, color: 'emerald' },
  { label: 'Pending KYC', value: '0', trend: '--', up: null, icon: ShieldCheck, color: 'amber' },
  { label: 'Flagged Accounts', value: '0', trend: '--', up: null, icon: ShieldAlert, color: 'rose' },
  { label: 'Device Collision', value: '0', trend: '--', up: null, icon: Smartphone, color: 'orange' },
  { label: 'Suspended', value: '0', trend: '--', up: null, icon: UserX, color: 'muted' },
];

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const router = useRouter();

  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    statusFilter,
    setStatusFilter
  } = useTableFilters(users, {
    searchKeys: ['name', 'email', 'id', 'phone']
  });

  const handleExportStatement = async (user: any) => {
    if (!user) return;
    setIsExporting(true);
    try {
      await exportUserStatement(user);
      toast.success("Statement exported successfully");
    } catch (error) {
      console.error("PDF Export Error:", error);
      toast.error("Failed to generate statement");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-4 pb-20 animate-in fade-in duration-700">
      <Breadcrumbs />

      {/* 1. PREMIUM HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tighter">Customer Directory</h1>
          <p className="text-[13px] font-medium text-muted-foreground">Manage platform users, investigate risk levels, and govern retail accounts.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => executeExport({ fileName: 'CustomerDirectory', data: users, format: 'CSV' })}
            variant="outline" 
            className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest bg-card border-border/40 hover:bg-secondary flex items-center gap-2"
          >
            <Download size={14} /> Export Report
          </Button>
          <Button onClick={() => toast.success('Onboarding Wizard', { description: 'Initializing new account creation flow...' })} className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 flex items-center gap-2">
            <Plus size={14} /> New Manual Account
          </Button>
        </div>
      </div>

      {/* 2. ANALYTICS GRID */}
      <DashboardGrid cols={6}>
        {metrics.map((stat, i) => (
          <AdaptiveMetricCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend !== '--' ? stat.trend : undefined}
            trendUp={stat.up}
            color={
              stat.color === 'primary' ? 'text-primary' :
              stat.color === 'emerald' ? 'text-emerald-500' :
              stat.color === 'amber' ? 'text-amber-500' :
              stat.color === 'rose' ? 'text-red-500' :
              stat.color === 'orange' ? 'text-orange-500' : 'text-muted-foreground'
            }
          />
        ))}
      </DashboardGrid>

      {/* 3. FILTER & SEARCH SECTION */}
      <div className="bg-card border border-border/40 rounded-[28px] p-4 flex flex-col xl:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Search by name, email, phone or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-secondary/30 border border-border/20 rounded-xl py-2.5 pl-12 pr-4 text-[13px] font-medium outline-none focus:bg-background focus:border-primary/40 transition-all placeholder:text-muted-foreground/60"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 bg-secondary/40 border border-border/20 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground outline-none focus:border-primary/40 transition-all"
          >
            <option value="all">All Users</option>
            <option value="Active">Active</option>
            <option value="Flagged">Flagged</option>
            <option value="Frozen">Frozen</option>
            <option value="Limited">Limited</option>
          </select>
          <Button onClick={() => toast.success('Filter Suite', { description: 'Applying advanced behavioral segmenting...' })} variant="ghost" className="h-9 w-9 p-0 rounded-xl border border-border/20 hover:bg-secondary">
            <Filter size={14} className="text-muted-foreground" />
          </Button>
        </div>
      </div>

      {/* 4. CUSTOMER LEDGER TABLE */}
      <div className="bg-card border border-border/40 rounded-[32px] overflow-hidden shadow-sm flex flex-col">
        <div className="px-8 py-5 border-b border-border/10 bg-secondary/10 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-[12px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
              <Building2 size={16} className="text-primary" />
              Platform Ledger
            </h3>
            <div className="h-4 w-[1px] bg-border/20" />
            <div className="flex items-center gap-1.5 text-emerald-500 bg-emerald-500/5 px-2.5 py-1 rounded-lg border border-emerald-500/10">
              <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-black uppercase tracking-widest">Live Updates</span>
            </div>
          </div>
          <div className="flex bg-muted/50 p-1 rounded-xl border border-border/20">
            {['all', 'Active', 'Flagged', 'Frozen'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  statusFilter === status ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto overflow-y-hidden">
          <table className="w-full text-left border-separate border-spacing-0">
            <thead>
              <tr className="bg-secondary/5 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                <th className="px-8 py-4 border-b border-border/10">Customer Information</th>
                <th className="px-8 py-4 border-b border-border/10">Compliance & Risk</th>
                <th className="px-8 py-4 border-b border-border/10">Operational Trust</th>
                <th className="px-8 py-4 border-b border-border/10 text-right">Balance Details</th>
                <th className="px-8 py-4 border-b border-border/10 text-right"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/10">
              {filteredData.length > 0 ? filteredData.map((user) => (
                <tr
                  key={user.id}
                  onClick={() => router.push(`/users/${user.id}`)}
                  className="group hover:bg-secondary/20 transition-all cursor-pointer relative"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className="size-11 rounded-2xl bg-secondary border border-border/40 flex items-center justify-center text-foreground font-black text-xs transition-all group-hover:border-primary/40 group-hover:shadow-lg group-hover:shadow-primary/5">
                          {user.initials}
                        </div>
                        <div className={cn(
                          "absolute -bottom-1 -right-1 size-3.5 rounded-full border-2 border-card",
                          user.status === 'Active' ? "bg-emerald-500 shadow-[0_0_8px_#10B981]" : "bg-red-500 shadow-[0_0_8px_#EF4444]"
                        )} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[14px] font-black text-foreground truncate group-hover:text-primary transition-colors">{user.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[10px] font-bold text-muted-foreground truncate">{user.id}</span>
                          <span className="size-1 bg-muted-foreground/20 rounded-full" />
                          <span className="text-[10px] font-black text-primary/80 uppercase tracking-tighter bg-primary/5 px-1.5 rounded">Tier 3</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                          user.kycStatus === 'Verified' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        )}>
                          {user.kycStatus}
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-widest border",
                          user.riskLevel === 'Low' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                          Risk: {user.riskLevel}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div className={cn("h-full", user.riskScore > 50 ? "bg-red-500" : "bg-emerald-500")} style={{ width: `${user.riskScore}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-muted-foreground/60">{user.riskScore}%</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Smartphone size={12} className={cn(user.deviceTrust === 'High' ? "text-emerald-500" : "text-red-500")} />
                        <span className="text-[11px] font-bold text-foreground">Device: {user.deviceTrust}</span>
                      </div>
                      <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                        <MapPin size={10} /> {user.lastLocation}
                        <span className="size-1 bg-muted-foreground/30 rounded-full" />
                        <Smartphone size={10} /> {user.linkedDevices} Devices
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="space-y-0.5">
                      <p className="text-[14px] font-black text-foreground">{user.balance}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">Last Seen: {user.lastActive}</p>
                    </div>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <ActionMenu triggerSize={18} items={[
                      { label: 'View Profile', icon: Eye, onClick: () => router.push(`/users/${user.id}`) },
                      { label: 'Copy User ID', icon: Copy, onClick: () => { navigator.clipboard.writeText(user.id); toast.success('Copied', { description: user.id }); } },
                      { label: 'Export Statement', icon: Download, onClick: () => toast.success('Export Started', { description: `Statement for ${user.name} initiated.` }), dividerBefore: true },
                      { label: 'Suspend Account', icon: Ban, onClick: () => toast.error('Account Suspended', { description: `${user.name} has been temporarily suspended.` }), variant: 'danger', dividerBefore: true },
                    ]} />
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <EmptyState 
                      icon={Users}
                      title="No users found"
                      description="Platform directory is currently empty"
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-secondary/5 border-t border-border/10 flex items-center justify-between px-8">
          <p className="text-[11px] font-bold text-muted-foreground uppercase">Showing 0 Customers</p>
          <div className="flex gap-2">
            <Button onClick={() => toast.info('Pagination', { description: 'Loading previous customer segment...' })} variant="outline" size="sm" className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40 opacity-50">Previous</Button>
            <Button onClick={() => toast.info('Pagination', { description: 'Loading next customer segment...' })} variant="outline" size="sm" className="h-9 px-4 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40">Next Page</Button>
          </div>
        </div>
      </div>

      {/* 5. USER DETAIL DRAWER */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border/50 z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-border/20 flex items-start justify-between bg-secondary/10">
                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-[32px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-3xl shadow-xl shadow-primary/5">
                    {selectedUser.initials}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-foreground tracking-tighter">{selectedUser.name}</h2>
                    <div className="flex items-center gap-3">
                      <p className="text-[13px] font-medium text-muted-foreground">{selectedUser.email}</p>
                      <span className="size-1 bg-muted-foreground/30 rounded-full" />
                      <p className="text-[13px] font-bold text-foreground">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedUser(null)} className="p-3 bg-secondary/50 hover:bg-secondary border border-border/20 rounded-2xl text-muted-foreground transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-10">
                {/* Section: Balances */}
                <DashboardGrid cols={3}>
                  {[
                    { label: "Wallet Balance", value: selectedUser.balance, icon: Wallet, color: "text-primary" },
                    { label: "Total Savings", value: selectedUser.savings, icon: PiggyBank, color: "text-emerald-500" },
                    { label: "Investments", value: selectedUser.investments, icon: TrendingUp, color: "text-amber-500" },
                  ].map((metric, i) => (
                    <div key={i} className="p-5 bg-secondary/20 border border-border/10 rounded-3xl space-y-2 min-w-0">
                      <metric.icon size={18} className={metric.color} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 truncate">{metric.label}</p>
                      <p className="text-[16px] font-black text-foreground truncate">{metric.value}</p>
                    </div>
                  ))}
                </DashboardGrid>

                {/* Section: Behavioral Health */}
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2 px-1">
                    <Activity size={16} className="text-primary" />
                    Behavioral Analytics
                  </h4>
                  <div className="p-8 bg-card border border-border/20 rounded-[32px] space-y-8">
                    <div className="grid grid-cols-2 gap-8">
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Device Integrity</p>
                          <div className="flex items-center gap-3">
                            <div className={cn("p-2 rounded-lg", selectedUser.deviceTrust === 'High' ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500")}>
                              <Smartphone size={16} />
                            </div>
                            <span className="text-[14px] font-black uppercase tracking-tight">{selectedUser.deviceTrust} Confidence</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Last Login Location</p>
                          <div className="flex items-center gap-3">
                            <div className="p-2 bg-secondary/50 rounded-lg text-muted-foreground">
                              <MapPin size={16} />
                            </div>
                            <span className="text-[14px] font-black tracking-tight">{selectedUser.lastLocation} (Verified IP)</span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Activity Score</p>
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <span className="text-xl font-black text-foreground">{selectedUser.activityScore}%</span>
                              <span className="text-[9px] font-bold text-emerald-500 uppercase">Excellent</span>
                            </div>
                            <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                              <div className="h-full bg-primary rounded-full shadow-[0_0_10px_rgba(59,130,246,0.3)]" style={{ width: `${selectedUser.activityScore}%` }} />
                            </div>
                          </div>
                        </div>
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">Active Sessions</p>
                          <div className="flex items-center gap-2">
                            {[1, 2].map(s => (
                              <div key={s} className="px-2 py-1 bg-emerald-500/5 text-emerald-500 border border-emerald-500/10 rounded-md text-[9px] font-black uppercase">Live Session {s}</div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Compliance */}
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2 px-1">
                    <ShieldCheck size={16} className="text-primary" />
                    KYC & Compliance
                  </h4>
                  <div className="space-y-3">
                    {[
                      { label: "Account Tier", value: selectedUser.kycLevel, icon: Zap, status: "Verified" },
                      { label: "BVN Verification", value: "2214****88", icon: Fingerprint, status: "Verified" },
                      { label: "Address Proof", value: "Verified Utility Bill", icon: MapPin, status: "Verified" },
                    ].map((item, i) => (
                      <div key={i} className="p-4 bg-secondary/10 border border-border/10 rounded-2xl flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="size-10 bg-card border border-border/40 rounded-xl flex items-center justify-center text-primary"><item.icon size={18} /></div>
                          <div>
                            <p className="text-[13px] font-black text-foreground">{item.value}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.label}</p>
                          </div>
                        </div>
                        <CheckCircle2 size={16} className="text-emerald-500" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section: Recent Activity */}
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2 px-1">
                    <History size={16} className="text-primary" />
                    Transaction Pulse
                  </h4>
                  <div className="space-y-2">
                    {[
                      { type: "Debit", desc: "Sent to Segun Arinze", amount: "-₦45,000", time: "2h ago", icon: ArrowUpRight, color: "text-red-500" },
                      { type: "Credit", desc: "Wallet Funding (Zenith)", amount: "+₦200,000", time: "14h ago", icon: ArrowDownRight, color: "text-emerald-500" },
                    ].map((txn, i) => (
                      <div key={i} className="p-4 border border-border/10 rounded-2xl flex items-center justify-between hover:bg-secondary/20 transition-all cursor-default">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-2 rounded-xl", txn.color === "text-red-500" ? "bg-red-500/10 text-red-500" : "bg-emerald-500/10 text-emerald-500")}>
                            <txn.icon size={16} />
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-foreground">{txn.desc}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{txn.time}</p>
                          </div>
                        </div>
                        <p className={cn("text-[14px] font-black", txn.color)}>{txn.amount}</p>
                      </div>
                    ))}
                    <Button variant="ghost" className="w-full text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary mt-2">Explore 142 Transactions</Button>
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-8 border-t border-border/20 bg-secondary/10 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Button onClick={() => toast.error('Account Frozen', { description: `${selectedUser.name}'s wallet and cards have been suspended.` })} className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-red-500/20 flex items-center justify-center gap-2">
                    <LockIcon size={14} /> Freeze Account
                  </Button>
                  <Button onClick={() => toast.error('Access Revoked', { description: 'Administrative access revoked for this profile.' })} variant="outline" className="w-full h-12 border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2">
                    <UserX size={14} /> Suspend Access
                  </Button>
                </div>
                <div className="space-y-2">
                  <Button onClick={() => toast.success('Tier Upgrade Initiated', { description: 'Evaluating account for Tier 4 eligibility...' })} className="w-full h-12 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-2">
                    <UserCheck size={14} /> Upgrade Tier
                  </Button>
                  <Button
                    variant="outline"
                    disabled={isExporting}
                    onClick={() => handleExportStatement(selectedUser)}
                    className="w-full h-12 border-border/40 text-muted-foreground rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
                  >
                    {isExporting ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />}
                    {isExporting ? "Generating PDF..." : "Export Statement"}
                  </Button>
                </div>
                <div className="col-span-2 p-4 bg-muted/50 border border-border/20 rounded-2xl space-y-2">
                  <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 px-1">
                    <History size={12} /> Admin Notes
                  </div>
                  <textarea
                    placeholder="Add operational notes about this customer..."
                    className="w-full bg-transparent border-none text-[13px] font-medium placeholder:text-muted-foreground/40 outline-none resize-none h-16"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
