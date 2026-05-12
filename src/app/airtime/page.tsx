'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  Smartphone, Search, Filter, Download, Calendar, 
  ArrowUpRight, MoreVertical, MoreHorizontal, ShieldAlert,
  Clock, CheckCircle2, AlertTriangle, RefreshCw, Layers,
  ExternalLink, Eye, Ban, Lock, History, User, 
  Globe, ShieldCheck, Mail, FileText, ArrowRight,
  TrendingUp, Activity, BadgeCheck, Zap,
  Database, Wifi, Phone, Radio, Signal, HelpCircle,
  ChevronDown, ChevronRight, Share2, Trash2, UserPlus,
  MessageSquare, UserX
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils";
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { toast } from 'sonner';
import { useTableFilters } from '@/hooks/useTableFilters';
import { executeExport } from '@/lib/exportUtils';
import { DashboardGrid } from '@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from '@/components/ui/AdaptiveMetricCard';
import { EmptyState } from '@/components/ui/EmptyState';

// 1. EXPANDED TELECOM MOCK DATA
const telecomMetrics = [
  { label: 'Recharge Volume', value: '₦0', trend: '--', up: null, icon: Signal, color: 'text-primary', bg: 'bg-primary/10' },
  { label: 'Success Rate', value: '0%', trend: '--', up: null, icon: BadgeCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Failed Recharges', value: '0', trend: '--', up: null, icon: AlertTriangle, color: 'text-rose-600', bg: 'bg-rose-50' },
  { label: 'Pending Vendor', value: '0', trend: '--', up: null, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Top Network', value: '--', trend: '₦0 Vol', up: null, icon: Radio, color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { label: 'Total Commission', value: '₦0', trend: '--', up: null, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
];

const telecomAlerts: any[] = [];

const airtimeData: any[] = [];

// 2. HELPER COMPONENTS
const Badge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const styles: Record<string, string> = {
    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    failed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    reversed: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", styles[s] || 'bg-muted text-muted-foreground border-border')}>
      {status}
    </span>
  );
};

const NetworkLogo = ({ network }: { network: string }) => {
  const n = network.toLowerCase();
  const logos: Record<string, string> = {
    mtn: '/networks/mtn.svg',
    airtel: '/networks/airtel.svg',
    glo: '/networks/glo.svg',
    '9mobile': '/networks/9mobile.svg',
  };
  
  return (
    <div className="w-6 h-6 rounded-lg overflow-hidden border border-border dark:border-border bg-white dark:bg-card flex items-center justify-center shadow-sm">
      <Image 
        src={logos[n] || '/networks/mtn.svg'} 
        alt={network} 
        width={24} 
        height={24} 
        className="object-contain"
      />
    </div>
  );
};

export default function TelecomOperationsPage() {
  const router = useRouter();
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    statusFilter,
    setStatusFilter
  } = useTableFilters(airtimeData, {
    searchKeys: ['user', 'phone', 'id', 'network', 'type']
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
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Telecom Operations</h1>
            <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm">
              <ShieldCheck size={10} fill="currentColor" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium text-[13px]">
            Monitor airtime/data sales, vendor connectivity, and telecom infrastructure health.
          </p>
        </motion.div>
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-wrap items-center gap-2">
          <Button 
            onClick={() => executeExport({ fileName: 'TelecomRecharges', data: filteredData, format: 'CSV' })}
            variant="outline" 
            size="sm" 
            className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground"
          >
            <Download size={14} /> Export CSV
          </Button>
          <Button onClick={() => toast.success('Bulk Retry Initiated', { description: '124 failed recharges have been queued for processing.' })} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <RefreshCw size={14} /> Retry Failed
          </Button>
          <Button onClick={() => toast.success('Vendor Bridge', { description: 'Connecting to real-time telecom gateway pool...' })} size="sm" className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 font-bold shadow-lg shadow-primary/20 transition-all border-none">
            Open Vendor Queue
          </Button>
        </motion.div>
      </div>

      {/* 4. OVERVIEW METRICS GRID */}
      <DashboardGrid cols={6}>
        {telecomMetrics.map((stat, i) => (
          <AdaptiveMetricCard
            key={i}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            trend={stat.trend !== '--' ? stat.trend : undefined}
            trendUp={stat.up}
            color={stat.color}
          />
        ))}
      </DashboardGrid>

      {/* 5. ADVANCED FILTER BAR */}
      <Card className="p-4 flex flex-col xl:flex-row items-center gap-4">
        <div className="relative flex-1 w-full group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by ID, Phone, or User..." 
            className="w-full bg-muted border border-border rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none focus:bg-secondary focus:border-primary/40 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {[
            { label: 'MTN', network: 'MTN' },
            { label: 'Airtel', network: 'Airtel' },
            { label: 'Glo', network: 'Glo' },
            { label: '9mobile', network: '9mobile' },
          ].map((f, i) => (
            <button key={i} onClick={() => setSearchTerm(f.network)} className="flex-1 xl:flex-none flex items-center justify-between gap-3 px-4 py-2 bg-card border border-border rounded-xl text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              {f.label}
            </button>
          ))}
          <div className="w-px h-6 bg-border mx-2" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-9 bg-card border border-border rounded-xl px-4 text-[11px] font-black uppercase tracking-widest outline-none focus:border-primary/40"
          >
             <option value="all">All Status</option>
             <option value="Completed">Completed</option>
             <option value="Failed">Failed</option>
             <option value="Pending">Pending</option>
             <option value="Reversed">Reversed</option>
          </select>
          <Button onClick={() => { setSearchTerm(''); setStatusFilter('all'); }} variant="ghost" size="icon" className="border border-border rounded-xl h-9 w-9 bg-card hover:bg-secondary">
            <RefreshCw size={16} className="text-muted-foreground" />
          </Button>
        </div>
      </Card>
          {/* 6. MAIN CONTENT AREA (FULL WIDTH TABLE) */}
      <div className="w-full">
        
        {/* Telecom Transaction Table */}
        <Card className="overflow-hidden flex flex-col min-w-0 p-0">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Recharge Ledger</h3>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Vendor API: Connected</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={() => toast.success('Bulk Retry Initiated', { description: 'Resubmitting failed telecom transactions.' })} variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all">Bulk Re-try</Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">ID</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">User Details</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Network / Plan</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Amount / Comm.</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Device</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.length > 0 ? filteredData.map((txn) => (
                  <tr key={txn.id} onClick={() => toast.success('Opening Audit Log', { description: `Record: ${txn.id}` })} className="hover:bg-secondary transition-colors group border-b border-border last:border-0 cursor-pointer">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-black font-mono text-primary truncate max-w-[100px]">{txn.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="space-y-0.5">
                        <p className="text-[12px] font-black text-foreground leading-none truncate max-w-[200px]">{txn.user}</p>
                        <p className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                          {txn.phone}
                        </p>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <NetworkLogo network={txn.network} />
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-foreground truncate">{txn.network}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{txn.type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-[12px] font-black text-foreground">{formatCurrency(txn.amount)}</div>
                      <div className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest mt-0.5">Comm: {formatCurrency(txn.commission)}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <Smartphone size={12} className="text-muted-foreground shrink-0" />
                        <span className="text-[11px] font-bold text-muted-foreground truncate">{txn.device}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge status={txn.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="text-[11px] font-bold text-muted-foreground">{txn.date}</div>
                    </td>
                    <td className="px-4 py-2.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                        onClick={() => router.push(`/airtime/${txn.id}`)}
                      >
                        <Eye size={14} />
                      </Button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-4 py-20 text-center">
                      <EmptyState 
                        icon={Signal}
                        title="No Recharges Found"
                        description="Telecom transaction logs will synchronize upon backend activation."
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
