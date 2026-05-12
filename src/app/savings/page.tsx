'use client';

import React, { useState } from 'react';
import { 
  PiggyBank, 
  Search,
  ArrowUpRight, 
  ArrowDownRight,
  TrendingUp,
  Download,
  Filter,
  ShieldAlert,
  Clock,
  Unlock,
  AlertCircle,
  UserX,
  Plus,
  MoreHorizontal,
  BadgeCheck,
  ChevronDown,
  RefreshCw,
  Bell,
  ExternalLink,
  ShieldCheck,
  Ban,
  Mail,
  FileText,
  UserCheck,
  Calendar,
  Eye,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { toast } from 'sonner';
import { useTableFilters } from '@/hooks/useTableFilters';
import { useRouter } from 'next/navigation';
import { DashboardGrid } from '@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from '@/components/ui/AdaptiveMetricCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ActionMenu } from '@/components/ui/ActionMenu';

// 1. BANKING OPERATIONS MOCK DATA
const savingsMetrics = [
  { label: 'Total Savings Accounts', value: '0', trend: '--', up: null, subtitle: 'Awaiting sync', icon: PiggyBank, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Total Savings Balance', value: '₦0', trend: '--', up: null, subtitle: 'Awaiting sync', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Maturing Soon', value: '₦0', trend: '0 Plans', up: null, subtitle: 'Awaiting sync', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Locked Savings', value: '₦0', trend: '--', up: null, subtitle: 'Awaiting sync', icon: Unlock, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Suspicious Activity', value: '0 Flags', trend: '--', up: null, subtitle: 'Awaiting sync', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Dormant Accounts', value: '0', trend: '--', up: null, subtitle: 'Awaiting sync', icon: UserX, color: 'text-muted-foreground', bg: 'bg-muted' },
];

const opsAlerts: any[] = [];

const savingsData: any[] = [];

// 2. HELPER COMPONENTS
const Badge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const styles: Record<string, string> = {
    active: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    matured: 'bg-primary/10 text-primary border-primary/20',
    paused: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    frozen: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    flagged: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    verified: 'bg-primary/10 text-primary border-primary/20',
    pending: 'bg-muted dark:bg-secondary text-muted-foreground border-border',
    low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
    high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", styles[s] || styles.pending)}>
      {status}
    </span>
  );
};

export default function SavingsOperationsPage() {
  const router = useRouter();
  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    statusFilter,
    setStatusFilter
  } = useTableFilters(savingsData, {
    searchKeys: ['user.name', 'id', 'plan.name', 'plan.type']
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦');
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-700 pb-10">
      <Breadcrumbs />
      
      {/* 3. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Smart Savings Monitoring</h1>
            <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-sm">
              <ShieldCheck size={10} fill="currentColor" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium text-[13px]">
            Real-time platform liquidity, maturity tracking, and savings risk assessment.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => toast.success('Export CSV Initiated', { description: 'Generating Savings Ledger CSV...' })} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Download size={14} /> Export CSV
          </Button>
          <Button onClick={() => toast.success('Report Generation Initiated', { description: 'Generating Savings Growth Report (PDF)...' })} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <FileText size={14} /> Generate Report
          </Button>
          <Button onClick={() => toast.success('Savings Policy Editor', { description: 'Opening global savings rules and interest yield configuration...' })} size="sm" className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 font-bold shadow-lg shadow-primary/20 transition-all border-none">
            System Config
          </Button>
        </div>
      </div>

      {/* 4. OVERVIEW METRICS GRID */}
      <DashboardGrid cols={6}>
        {savingsMetrics.map((stat, i) => (
          <AdaptiveMetricCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend !== '--' ? stat.trend : undefined}
            trendUp={stat.up}
            description={stat.subtitle}
            color={stat.color}
          />
        ))}
      </DashboardGrid>

      {/* 5. ADVANCED FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col xl:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by customer name, ID, or phone..." 
            className="w-full bg-muted border border-border rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none focus:bg-secondary focus:border-primary/40 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 bg-card border border-border rounded-xl px-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary/40"
          >
             <option value="all">All Status</option>
             <option value="Active">Active</option>
             <option value="Flagged">Flagged</option>
             <option value="Paused">Paused</option>
             <option value="Frozen">Frozen</option>
          </select>
          <Button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} variant="ghost" size="icon" className="border border-border rounded-xl h-9 w-9 bg-card hover:bg-secondary">
            <RefreshCw size={16} className="text-muted-foreground" />
          </Button>
        </div>
      </div>
          {/* 6. MAIN CONTENT AREA (FULL WIDTH) */}
      <div className="w-full">
        
        {/* Main Savings Table */}
        <div className="bg-card border border-border rounded-2xl overflow-hidden flex flex-col min-w-0 shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background sticky top-0 z-10">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Savings Operations Console</h3>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Monitoring</span>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Customer</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Plan Details</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Balance / Target</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Contribution</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">AutoSave</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Risk/KYC</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.length > 0 ? filteredData.map((plan) => {
                  const progress = calculateProgress(plan.balance, plan.target);
                  return (
                    <tr key={plan.id} onClick={() => router.push(`/users/${plan.user.id}`)} className="hover:bg-secondary transition-colors group border-b border-border last:border-0 cursor-pointer">
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[10px] border border-border shadow-sm shrink-0">
                            {plan.user.avatar}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[12px] font-black text-foreground leading-none truncate max-w-[150px]">{plan.user.name}</span>
                              <BadgeCheck size={10} className="text-primary shrink-0" />
                            </div>
                            <div className="text-[9px] font-bold text-muted-foreground mt-0.5 uppercase tracking-tighter">ID: {plan.user.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="text-[12px] font-black text-foreground truncate max-w-[180px]">{plan.plan.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[8px] font-black text-primary uppercase tracking-widest">{plan.plan.type}</span>
                          <span className="w-1 h-1 bg-border rounded-full" />
                          <span className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">{plan.plan.duration}</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 min-w-[180px]">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[12px] font-black text-foreground">{formatCurrency(plan.balance)}</span>
                          <span className="text-[8px] font-black text-muted-foreground uppercase">Target: {formatCurrency(plan.target)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 h-1 bg-background rounded-full overflow-hidden">
                            <div 
                              className={cn("h-full transition-all duration-1000", progress === 100 ? 'bg-emerald-500' : 'bg-primary')}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                          <span className="text-[9px] font-black text-foreground min-w-[20px]">{progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="text-[12px] font-black text-emerald-600 dark:text-emerald-500">{formatCurrency(plan.contribution)}</div>
                        <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest">Monthly</div>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {plan.autoSave ? (
                          <div className="flex items-center justify-center gap-1.5 text-emerald-500">
                            <RefreshCw size={10} className="animate-spin-slow shrink-0" />
                            <span className="text-[9px] font-black uppercase">Active</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-muted-foreground uppercase">Off</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-center space-y-1">
                        <div className="flex flex-col items-center gap-1">
                          <Badge status={plan.risk} />
                          <Badge status={plan.kyc} />
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        <Badge status={plan.status} />
                      </td>
                      <td className="px-4 py-2.5 text-right shrink-0" onClick={(e) => e.stopPropagation()}>
                        <ActionMenu triggerSize={14} items={[
                          { label: 'View Details', icon: Eye, onClick: () => toast.success('Opening Details', { description: `Loading savings plan ${plan.id}` }) },
                          { label: 'Copy Plan ID', icon: Copy, onClick: () => { navigator.clipboard.writeText(plan.id); toast.success('Copied', { description: plan.id }); } },
                          { label: 'Export Statement', icon: Download, onClick: () => toast.success('Export Started', { description: `Generating statement for ${plan.id}` }), dividerBefore: true },
                          { label: 'Flag for Review', icon: ShieldAlert, onClick: () => toast.warning('Flagged', { description: `Plan ${plan.id} marked for compliance review.` }), variant: 'danger', dividerBefore: true },
                        ]} />
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-20 text-center">
                      <EmptyState 
                        icon={PiggyBank}
                        title="No savings plans found"
                        description="Awaiting backend connection"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-muted flex items-center justify-between border-t border-border">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Showing 0 savings plans</p>
            <div className="flex items-center gap-1">
              <button onClick={() => toast.success('Loading Previous Page')} className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Prev</button>
              <button className="w-8 h-8 bg-primary text-white rounded-lg font-black text-[10px]">1</button>
              <button onClick={() => toast.success('Loading Page 2')} className="w-8 h-8 bg-card border border-border text-muted-foreground rounded-lg font-black text-[10px] hover:bg-secondary transition-all">2</button>
              <button onClick={() => toast.success('Loading Next Page')} className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
