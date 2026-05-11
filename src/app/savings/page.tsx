'use client';

import React, { useState } from 'react';
import { 
  PiggyBank, 
  Search, 
  MoreVertical, 
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
  Calendar
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

// 1. BANKING OPERATIONS MOCK DATA
const savingsMetrics = [
  { label: 'Total Savings Accounts', value: '142,402', trend: '+12.4%', up: true, subtitle: 'Across all plan types', icon: PiggyBank, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Total Savings Balance', value: '₦42.8B', trend: '+18.7%', up: true, subtitle: 'Platform liquidity exposure', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Maturing Soon', value: '₦1.2B', trend: '240 Plans', up: null, subtitle: 'Due within 7 days', icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Locked Savings', value: '₦28.4B', trend: '68% of total', up: null, subtitle: 'Fixed term deposits', icon: Unlock, color: 'text-purple-600', bg: 'bg-purple-50' },
  { label: 'Suspicious Activity', value: '14 Flags', trend: 'High Priority', up: false, subtitle: 'Potential AML/Fraud risk', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Dormant Accounts', value: '2,840', trend: '2% of total', up: false, subtitle: 'Inactive > 90 days', icon: UserX, color: 'text-muted-foreground', bg: 'bg-muted' },
];

const opsAlerts = [
  { id: 1, type: 'large_deposit', title: '₦5,000,000 Deposit detected', user: 'Chukwudi Okafor', time: '2 mins ago', color: 'bg-emerald-500' },
  { id: 2, type: 'failed_autosave', title: 'Auto-save failed (Insufficient funds)', user: 'Amina Yusuf', time: '12 mins ago', color: 'bg-amber-500' },
  { id: 3, type: 'frozen_account', title: 'Savings account frozen (Compliance)', user: 'Olumide Bakare', time: '45 mins ago', color: 'bg-rose-500' },
  { id: 4, type: 'maturity_alert', title: 'Locked Savings Plan matured', user: 'Ngozi Okonjo', time: '1 hour ago', color: 'bg-primary/100' },
  { id: 5, type: 'kyc_missing', title: 'Missing KYC for high-balance account', user: 'Ibrahim Danjuma', time: '2 hours ago', color: 'bg-purple-500' },
];

const savingsData = [
  { 
    id: 'SAV-849204', 
    user: { name: 'Ngozi Okonjo', id: 'USR-2024-001', avatar: 'NO' },
    plan: { name: 'Emergency Fund', type: 'Flexible', duration: 'Ongoing' },
    balance: 2500000,
    target: 5000000,
    contribution: 250000,
    lastDeposit: '2024-05-06',
    maturity: 'N/A',
    autoSave: true,
    risk: 'Low',
    kyc: 'Verified',
    status: 'Active'
  },
  { 
    id: 'SAV-128394', 
    user: { name: 'Chukwudi Okafor', id: 'USR-2024-002', avatar: 'CO' },
    plan: { name: 'Dec Wedding', type: 'Locked', duration: '12 Months' },
    balance: 850000,
    target: 2000000,
    contribution: 150000,
    lastDeposit: '2024-05-04',
    maturity: '2024-12-01',
    autoSave: true,
    risk: 'Low',
    kyc: 'Verified',
    status: 'Active'
  },
  { 
    id: 'SAV-992837', 
    user: { name: 'Olumide Bakare', id: 'USR-2024-003', avatar: 'OB' },
    plan: { name: 'New Car', type: 'Fixed', duration: '24 Months' },
    balance: 1250000,
    target: 5000000,
    contribution: 200000,
    lastDeposit: '2024-04-20',
    maturity: '2025-10-01',
    autoSave: false,
    risk: 'Medium',
    kyc: 'Pending',
    status: 'Flagged'
  },
  { 
    id: 'SAV-447283', 
    user: { name: 'Amina Yusuf', id: 'USR-2024-004', avatar: 'AY' },
    plan: { name: 'House Rent', type: 'Flexible', duration: '12 Months' },
    balance: 450000,
    target: 1500000,
    contribution: 50000,
    lastDeposit: '2024-05-01',
    maturity: '2024-12-31',
    autoSave: true,
    risk: 'Low',
    kyc: 'Verified',
    status: 'Paused'
  },
  { 
    id: 'SAV-662839', 
    user: { name: 'Ibrahim Danjuma', id: 'USR-2024-005', avatar: 'ID' },
    plan: { name: 'Education Fund', type: 'Locked', duration: '60 Months' },
    balance: 8900000,
    target: 10000000,
    contribution: 500000,
    lastDeposit: '2024-05-02',
    maturity: '2028-05-01',
    autoSave: true,
    risk: 'High',
    kyc: 'Verified',
    status: 'Frozen'
  }
];

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
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦');
  };

  const calculateProgress = (current: number, target: number) => {
    return Math.min(Math.round((current / target) * 100), 100);
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-10">
      
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
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <FileText size={14} /> Generate Report
          </Button>
          <Button size="sm" className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 font-bold shadow-lg shadow-primary/20 transition-all border-none">
            System Config
          </Button>
        </div>
      </div>

      {/* 4. OVERVIEW METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {savingsMetrics.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-2xl group relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2 rounded-xl group-hover:scale-110 transition-transform", stat.color, "bg-background border border-border")}>
                <stat.icon size={18} />
              </div>
              {stat.trend && (
                <div className={cn("text-[10px] font-black px-2 py-0.5 rounded-lg", stat.up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                  {stat.trend}
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-black text-foreground tracking-tight">{stat.value}</h3>
              <p className="text-[9px] font-bold text-muted-foreground italic truncate">{stat.subtitle}</p>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-all w-full" />
          </div>
        ))}
      </div>

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
          {[
            { label: 'All Status', icon: ChevronDown },
            { label: 'Plan Type', icon: ChevronDown },
            { label: 'Maturity', icon: Calendar },
            { label: 'Risk Level', icon: ShieldAlert },
          ].map((f, i) => (
            <button key={i} className="flex-1 xl:flex-none flex items-center justify-between gap-3 px-4 py-2 bg-card border border-border rounded-xl text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              {f.label} <f.icon size={12} className="text-muted-foreground" />
            </button>
          ))}
          <Button variant="ghost" size="icon" className="border border-border rounded-xl h-9 w-9 bg-card hover:bg-secondary">
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
                {savingsData.map((plan) => {
                  const progress = calculateProgress(plan.balance, plan.target);
                  return (
                    <tr key={plan.id} className="hover:bg-secondary transition-colors group border-b border-border last:border-0 cursor-pointer">
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
                        <Button variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><MoreVertical size={14} /></Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-muted flex items-center justify-between border-t border-border">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Showing 5 of 142,402 savings plans</p>
            <div className="flex items-center gap-1">
              <button className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Prev</button>
              <button className="w-8 h-8 bg-primary text-white rounded-lg font-black text-[10px]">1</button>
              <button className="w-8 h-8 bg-card border border-border text-muted-foreground rounded-lg font-black text-[10px] hover:bg-secondary transition-all">2</button>
              <button className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
