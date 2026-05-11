'use client';

import React, { useState } from 'react';
import { 
  CreditCard, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  ChevronDown, 
  MoreVertical, 
  ArrowUpRight, 
  ArrowDownRight,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  ShieldAlert,
  Activity,
  Zap,
  Tv,
  Wifi,
  Gamepad2,
  GraduationCap,
  Music,
  Smartphone,
  ExternalLink,
  BadgeCheck,
  AlertTriangle,
  Database,
  Signal,
  HelpCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { toastActions } from '@/lib/toastActions';
import { useTableFilters } from '@/hooks/useTableFilters';

// 1. BILL PAYMENTS MOCK DATA
const billMetrics = [
  { label: 'Total Transactions', value: '84,204', trend: '+12.4%', up: true, icon: CreditCard, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Successful Payments', value: '82,140', trend: '97.5%', up: true, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Failed Payments', value: '1,042', trend: '1.2%', up: false, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Total Volume', value: '₦142.8M', trend: '+18.7%', up: true, icon: Activity, color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { label: 'Active Providers', value: '24', trend: 'All Live', up: true, icon: Signal, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Pending Verif.', value: '18', trend: 'Action Reqd', up: null, icon: Clock, color: 'text-muted-foreground', bg: 'bg-muted' },
];

const billCategories = [
  { name: 'Electricity', icon: Zap, count: '12.4K', volume: '₦42.5M', success: '98.2%', color: 'text-amber-500', bg: 'bg-amber-50' },
  { name: 'TV Subscription', icon: Tv, count: '28.1K', volume: '₦38.2M', success: '99.1%', color: 'text-primary', bg: 'bg-primary/10' },
  { name: 'Betting', icon: Gamepad2, count: '15.6K', volume: '₦22.1M', success: '94.5%', color: 'text-purple-500', bg: 'bg-purple-50' },
  { name: 'Internet', icon: Wifi, count: '10.2K', volume: '₦18.4M', success: '97.8%', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { name: 'Education', icon: GraduationCap, count: '4.8K', volume: '₦8.2M', success: '99.5%', color: 'text-rose-500', bg: 'bg-rose-50' },
  { name: 'Streaming', icon: Music, count: '8.4K', volume: '₦6.5M', success: '98.9%', color: 'text-pink-500', bg: 'bg-pink-50' },
  { name: 'Airtime/Data', icon: Smartphone, count: '42.1K', volume: '₦84.2M', success: '99.8%', color: 'text-indigo-500', bg: 'bg-indigo-50' },
];

const providerHealth = [
  { name: 'DSTV / GOtv API', uptime: '99.98%', latency: '142ms', status: 'Operational', color: 'bg-emerald-500' },
  { name: 'Ikeja Electric', uptime: '98.45%', latency: '840ms', status: 'Degraded', color: 'bg-amber-500' },
  { name: 'Bet9ja API', uptime: '99.12%', latency: '210ms', status: 'Operational', color: 'bg-emerald-500' },
  { name: 'JAMB / WAEC PINS', uptime: '100.0%', latency: '95ms', status: 'Operational', color: 'bg-emerald-500' },
  { name: 'Smile / Spectranet', uptime: '96.20%', latency: '1.2s', status: 'Critical', color: 'bg-rose-500' },
];

const billTransactions = [
  { id: 'BILL-948201', customer: 'Ngozi Okonjo', type: 'Electricity', provider: 'IKEDC', amount: 25000, status: 'Successful', channel: 'Mobile App', ref: '0492830192', time: 'Just now' },
  { id: 'BILL-948202', customer: 'Chukwudi Okafor', type: 'TV Subscription', provider: 'DSTV', amount: 14500, status: 'Pending', channel: 'USSD', ref: '9928374012', time: '2 mins ago' },
  { id: 'BILL-948203', customer: 'Olumide Bakare', type: 'Betting', provider: 'Bet9ja', amount: 5000, status: 'Failed', channel: 'Web App', ref: '8827364019', time: '12 mins ago' },
  { id: 'BILL-948204', customer: 'Amina Yusuf', type: 'Internet', provider: 'Smile', amount: 15000, status: 'Successful', channel: 'Mobile App', ref: '7728394011', time: '24 mins ago' },
  { id: 'BILL-948205', customer: 'Ibrahim Danjuma', type: 'Education', provider: 'JAMB', amount: 4800, status: 'Processing', channel: 'Web App', ref: '6627384910', time: '45 mins ago' },
  { id: 'BILL-948206', customer: 'Blessing Udoh', type: 'Streaming', provider: 'Netflix', amount: 4400, status: 'Reversed', channel: 'Mobile App', ref: '5528374912', time: '1 hour ago' },
];

const riskAlerts = [
  { id: 1, title: 'Unusual Volume Spike', detail: 'Electricity payments up 400% in Lagos region', time: '10 mins ago', level: 'Medium' },
  { id: 2, title: 'Repeated Failed Attempts', detail: 'User USR-2049 failed DSTV payment 8 times', time: '24 mins ago', level: 'High' },
  { id: 3, title: 'Duplicate Meter Number', detail: 'Meter #849201 used across 4 different accounts', time: '1 hour ago', level: 'Critical' },
];

// 2. HELPER COMPONENTS
const Badge = ({ status, type }: { status?: string, type?: string }) => {
  if (status) {
    const s = status.toLowerCase();
    const styles: Record<string, string> = {
      successful: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
      pending: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
      failed: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
      reversed: 'bg-muted dark:bg-secondary text-muted-foreground dark:text-muted-foreground border-border dark:border-border',
      processing: 'bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary border-blue-100 dark:border-primary/20',
    };
    return (
      <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", styles[s] || 'bg-muted text-muted-foreground')}>
        {status}
      </span>
    );
  }

  if (type) {
    const t = type.toLowerCase();
    const styles: Record<string, string> = {
      electricity: 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20',
      'tv subscription': 'bg-primary/10 dark:bg-primary/10 text-primary dark:text-primary border-blue-100 dark:border-primary/20',
      betting: 'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20',
      internet: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20',
      education: 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20',
      streaming: 'bg-pink-50 dark:bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-500/20',
    };
    return (
      <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-tight border", styles[t] || 'bg-muted text-muted-foreground')}>
        {type}
      </span>
    );
  }
  return null;
};

export default function BillPaymentsPage() {
  const [activeTab, setActiveTab] = useState('All Payments');
  
  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    statusFilter,
    setStatusFilter
  } = useTableFilters(billTransactions, {
    searchKeys: ['customer', 'id', 'type', 'provider', 'ref']
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦');
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-700 pb-10">
      <Breadcrumbs />
      
      {/* 3. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Bill Payments</h1>
            <div className="flex items-center gap-1.5 bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full border border-emerald-500/20 shadow-sm">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Live Processing</span>
            </div>
          </div>
          <p className="text-muted-foreground font-medium text-[13px]">
            Monitor utility transactions, provider health, and automated billing operations.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <div onClick={() => toastActions.showActionToast('Calendar Picker', 'Selecting billing operational window...')} className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl shadow-sm text-[11px] font-black text-muted-foreground cursor-pointer hover:bg-secondary transition-all">
            <Calendar size={14} className="text-primary" />
            <span>MAY 7 - MAY 13</span>
            <ChevronDown size={12} />
          </div>
          <Button onClick={() => toastActions.triggerExport('CSV', 'BillPaymentsLedger', filteredData)} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Download size={14} /> Export CSV
          </Button>
          <Button onClick={() => toastActions.showActionToast('Audit Logs', 'Opening global billing audit trail...')} size="sm" className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all border-none">
            <BadgeCheck size={16} /> Audit Logs
          </Button>
        </div>
      </div>

      {/* 4. KPI STATS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {billMetrics.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-4 rounded-xl group relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2 rounded-lg group-hover:scale-110 transition-transform", stat.color, "bg-background border border-border")}>
                <stat.icon size={16} />
              </div>
              {stat.trend && (
                <div className={cn("text-[9px] font-black px-1.5 py-0.5 rounded-md", stat.up === true ? "bg-emerald-500/10 text-emerald-500" : stat.up === false ? "bg-rose-500/10 text-rose-500" : "bg-muted text-muted-foreground")}>
                  {stat.trend}
                </div>
              )}
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</p>
              <h3 className="text-xl font-black text-foreground tracking-tight">{stat.value}</h3>
            </div>
            <div className="absolute bottom-0 left-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-all w-full" />
          </div>
        ))}
      </div>

      {/* 5. BILL CATEGORIES STRIP */}
      <div className="bg-card border border-border rounded-xl p-1.5 overflow-hidden flex items-center shadow-sm">
        <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 w-full">
          {billCategories.map((cat, i) => (
            <div key={i} className="flex items-center gap-4 px-4 py-2 bg-muted border border-border rounded-xl hover:bg-secondary hover:border-primary/20 transition-all shrink-0 cursor-pointer">
              <div className={cn("p-2 rounded-lg bg-background border border-border", cat.color)}>
                <cat.icon size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-[11px] font-black text-foreground truncate">{cat.name}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">{cat.count} txns</span>
                  <span className="text-[9px] font-black text-emerald-500">{cat.success}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 6. PROVIDER HEALTH SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {providerHealth.map((provider, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-3 flex flex-col gap-3 group hover:border-[#3B82F6]/30 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-black text-foreground truncate">{provider.name}</span>
              <div className={cn("w-1.5 h-1.5 rounded-full shadow-lg", provider.color)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Uptime</p>
                <p className="text-[10px] font-bold text-foreground">{provider.uptime}</p>
              </div>
              <div>
                <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Latency</p>
                <p className="text-[10px] font-bold text-foreground">{provider.latency}</p>
              </div>
            </div>
            <div className="pt-2 border-t border-border flex items-center justify-between">
              <span className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">{provider.status}</span>
              <button onClick={() => toastActions.showActionToast(`Refreshing ${provider.name}...`)}>
                <RefreshCw size={10} className="text-muted-foreground group-hover:rotate-180 transition-transform duration-700" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 7. MAIN CONTENT AREA (TABLE + RISK) */}
      <div className="space-y-6">
        
        {/* Main Ledger */}
        <div className="bg-card border border-border rounded-[24px] overflow-hidden flex flex-col min-w-0 shadow-sm">
          <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background sticky top-0 z-10">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
                {['All Payments', 'Utility', 'TV & Media', 'Betting', 'Failed'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      activeTab === tab ? "bg-secondary text-foreground shadow-sm border border-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search ref, customer, meter..." 
                  className="bg-muted border border-border rounded-xl py-1.5 px-9 text-[11px] font-bold text-foreground outline-none focus:bg-secondary focus:border-primary/40 transition-all w-64" 
                />
              </div>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted border border-border text-muted-foreground hover:text-primary rounded-xl"><Filter size={14} /></Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Transaction ID</th>
                  <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Customer</th>
                  <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Bill Type</th>
                  <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Provider</th>
                  <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                  <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                  <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Reference</th>
                  <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">Time</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((txn) => (
                  <tr key={txn.id} onClick={() => toastActions.showActionToast('Opening Bill Record', `Reference: ${txn.ref}`)} className="hover:bg-secondary transition-colors group border-b border-border last:border-0 cursor-pointer">
                    <td className="px-5 py-2.5">
                      <span className="text-[11px] font-black text-foreground uppercase tracking-tighter">{txn.id}</span>
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center font-black text-[9px] text-muted-foreground border border-border">
                          {txn.customer[0]}
                        </div>
                        <span className="text-[12px] font-black text-foreground truncate max-w-[120px]">{txn.customer}</span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5">
                      <Badge type={txn.type} />
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 rounded bg-muted border border-border flex items-center justify-center">
                          <Database size={10} className="text-muted-foreground" />
                        </div>
                        <span className="text-[11px] font-bold text-muted-foreground">{txn.provider}</span>
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-[12px] font-black text-foreground">{formatCurrency(txn.amount)}</td>
                    <td className="px-5 py-2.5 text-center">
                      <Badge status={txn.status} />
                    </td>
                    <td className="px-5 py-2.5">
                      <div className="flex items-center gap-1.5 group/ref cursor-pointer">
                        <span className="text-[10px] font-black text-muted-foreground uppercase group-hover/ref:text-primary transition-colors">{txn.ref}</span>
                        <ExternalLink size={10} className="text-muted-foreground/30 group-hover/ref:text-muted-foreground transition-colors" />
                      </div>
                    </td>
                    <td className="px-5 py-2.5 text-right text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{txn.time}</td>
                    <td className="px-5 py-2.5 text-right shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button onClick={() => toastActions.showActionToast('Bill Record Details', `Inspecting reference: ${txn.ref}`)} variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><MoreVertical size={14} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="px-6 py-4 bg-muted flex items-center justify-between border-t border-border">
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Showing 6 of 84,204 utility payments</p>
            <div className="flex items-center gap-1">
              <button onClick={() => toastActions.showActionToast('Loading Previous Page')} className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Prev</button>
              <button className="w-8 h-8 bg-primary text-white rounded-lg font-black text-[10px] shadow-lg shadow-primary/20">1</button>
              <button onClick={() => toastActions.showActionToast('Loading Page 2')} className="w-8 h-8 bg-card border border-border text-muted-foreground rounded-lg font-black text-[10px] hover:bg-secondary transition-all">2</button>
              <button onClick={() => toastActions.showActionToast('Loading Next Page')} className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Next</button>
            </div>
          </div>
        </div>

        {/* 8. FRAUD / RISK MONITORING */}
        <div className="bg-card border border-border rounded-[24px] overflow-hidden flex flex-col shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background">
            <div className="flex items-center gap-2">
              <ShieldAlert size={16} className="text-rose-500" />
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Operational Risk Queue</h3>
            </div>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">Monitor Dashboard</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
            {riskAlerts.map((alert) => (
              <div key={alert.id} className="p-5 hover:bg-secondary transition-all group cursor-pointer">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[12px] font-black text-foreground group-hover:text-rose-500 transition-colors">{alert.title}</span>
                  <span className={cn(
                    "px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
                    alert.level === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 
                    alert.level === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-amber-500/10 text-amber-500'
                  )}>
                    {alert.level}
                  </span>
                </div>
                <p className="text-[11px] font-medium text-muted-foreground leading-snug mb-3">{alert.detail}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{alert.time}</span>
                  <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-rose-500 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
