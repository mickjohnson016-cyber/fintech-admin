'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Search, Filter, Download, Calendar, ArrowUpRight, 
  ArrowDownRight, MoreVertical, MoreHorizontal, ShieldAlert,
  Clock, CheckCircle2, AlertTriangle, RefreshCw, Layers,
  ExternalLink, Eye, Ban, Lock, History, User, Smartphone,
  Globe, ShieldCheck, Mail, FileText, ArrowRight,
  TrendingUp, Activity, BadgeCheck, Zap, ChevronDown, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";

// 1. EXPANDED TRANSACTION MOCK DATA
const txnMetrics = [
  { label: 'Total Volume', value: '₦842.5M', trend: '+14.2%', up: true, icon: Activity, color: 'text-primary' },
  { label: 'Success Rate', value: '98.2%', trend: '+0.4%', up: true, icon: BadgeCheck, color: 'text-emerald-500' },
  { label: 'Failed Payments', value: '42', trend: 'Critical', up: false, icon: AlertTriangle, color: 'text-rose-500' },
  { label: 'Pending Manual Review', value: '18', trend: 'High Priority', up: null, icon: Clock, color: 'text-amber-500' },
  { label: 'Fraud Flags', value: '7', trend: 'Escalated', up: false, icon: ShieldAlert, color: 'text-rose-500' },
  { label: 'Chargebacks', value: '₦2.4M', trend: '3 active', up: false, icon: RefreshCw, color: 'text-purple-500' },
];

const liveFeed = [
  { id: 1, type: 'failed', title: 'Payment Failed: Bank rejection', amount: '₦45,000', user: 'Aminat Y.', time: 'Just now', color: 'bg-rose-500' },
  { id: 2, type: 'large', title: 'Large Transfer: Fraud check required', amount: '₦5,200,000', user: 'Chukwudi O.', time: '4 mins ago', color: 'bg-amber-500' },
  { id: 3, type: 'reversal', title: 'Chargeback Initiated', amount: '₦120,000', user: 'Olumide B.', time: '12 mins ago', color: 'bg-purple-500' },
  { id: 4, type: 'suspicious', title: 'Unusual IP location detected', amount: '₦5,000', user: 'John D.', time: '18 mins ago', color: 'bg-rose-500' },
  { id: 5, type: 'success', title: 'High-Value Payment Successful', amount: '₦1,500,000', user: 'Ngozi O.', time: '24 mins ago', color: 'bg-emerald-500' },
];

const transactionData = [
  { id: 'TXN-984201', sender: 'Ngozi Okonjo', receiver: 'Zenith Bank', type: 'Withdrawal', amount: 500000, fee: 50, status: 'Completed', risk: 0.02, device: 'iPhone 15', channel: 'Mobile App', date: '2024-05-07 10:24 AM' },
  { id: 'TXN-984202', sender: 'Chukwudi Okafor', receiver: 'Mick J.', type: 'Transfer', amount: 120000, fee: 10, status: 'Completed', risk: 0.05, device: 'Samsung S24', channel: 'USSD', date: '2024-05-07 10:15 AM' },
  { id: 'TXN-984203', sender: 'Olumide Bakare', receiver: 'OPay Merchant', type: 'Payment', amount: 8500, fee: 0, status: 'Failed', risk: 0.84, device: 'Web (Chrome)', channel: 'Web App', date: '2024-05-07 10:12 AM' },
  { id: 'TXN-984204', sender: 'Amina Yusuf', receiver: 'GTBank', type: 'Withdrawal', amount: 250000, fee: 50, status: 'Pending', risk: 0.32, device: 'iPhone 13', channel: 'Mobile App', date: '2024-05-07 09:45 AM' },
  { id: 'TXN-984205', sender: 'Ibrahim Danjuma', receiver: 'Kuda Microfinance', type: 'Transfer', amount: 1500000, fee: 100, status: 'Flagged', risk: 0.92, device: 'Web (Edge)', channel: 'Web App', date: '2024-05-07 09:30 AM' },
  { id: 'TXN-984206', sender: 'Blessing Udoh', receiver: 'PalmPay User', type: 'Transfer', amount: 12000, fee: 10, status: 'Reversed', risk: 0.15, device: 'Infinix Hot 10', channel: 'Mobile App', date: '2024-05-07 08:12 AM' },
];

// 2. HELPER COMPONENTS
const Badge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const styles: Record<string, string> = {
    completed: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    failed: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
    pending: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    flagged: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    reversed: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    low: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
    medium: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
    high: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
  };
  return (
    <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", styles[s] || 'bg-muted text-muted-foreground border-border')}>
      {status}
    </span>
  );
};

export default function TransactionsOperationsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦');
  };

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-700 pb-10">
      
      {/* 3. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Transaction Operations</h1>
            <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm">
              <ShieldCheck size={10} fill="currentColor" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium text-[13px]">
            Real-time transaction monitoring, fraud detection, and payment investigation console.
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Download size={14} /> Export CSV
          </Button>
          <Button variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Layers size={14} /> Review Queue
          </Button>
          <Button size="sm" className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 font-bold shadow-lg shadow-primary/20 transition-all border-none">
            Escalate Case
          </Button>
        </div>
      </div>

      {/* 4. OVERVIEW METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {txnMetrics.map((stat, i) => (
          <div key={i} className="bg-card border border-border p-5 rounded-2xl group relative overflow-hidden shadow-sm">
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2 rounded-xl group-hover:scale-110 transition-transform", stat.color, "bg-background border border-border")}>
                <stat.icon size={18} />
              </div>
              {stat.trend && (
                <div className={cn("text-[10px] font-black px-2 py-0.5 rounded-lg", stat.up === true ? "bg-emerald-500/10 text-emerald-500" : stat.up === false ? "bg-rose-500/10 text-rose-500" : "bg-amber-500/10 text-amber-500")}>
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

      {/* 5. ADVANCED FILTER BAR */}
      <div className="bg-card border border-border rounded-2xl p-4 flex flex-col xl:flex-row items-center gap-4 shadow-sm">
        <div className="relative flex-1 w-full group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by Transaction ID, sender name, receiver, or user ID..." 
            className="w-full bg-muted border border-border rounded-xl py-2.5 pl-11 pr-4 text-xs font-bold text-foreground placeholder:text-muted-foreground outline-none focus:bg-secondary focus:border-primary/40 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2 w-full xl:w-auto">
          {[
            { label: 'Date Range', icon: Calendar },
            { label: 'Status', icon: ChevronDown },
            { label: 'Txn Type', icon: Layers },
            { label: 'Risk Score', icon: ShieldAlert },
          ].map((f, i) => (
            <button key={i} className="flex-1 xl:flex-none flex items-center justify-between gap-3 px-4 py-2 bg-muted border border-border rounded-xl text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground transition-all">
              {f.label} <f.icon size={12} className="text-muted-foreground" />
            </button>
          ))}
          <Button variant="ghost" size="icon" className="border border-border rounded-xl h-9 w-9 bg-muted hover:bg-secondary text-muted-foreground hover:text-foreground">
            <RefreshCw size={16} />
          </Button>
        </div>
      </div>

      {/* 6. MAIN CONTENT AREA (FULL WIDTH) */}
      <div className="w-full">
        
        {/* Main Transaction Table */}
        <div className="bg-card border border-border rounded-[24px] overflow-hidden flex flex-col min-w-0 shadow-sm">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background sticky top-0 z-10">
            <div className="flex items-center gap-4">
              <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Transaction Ledger</h3>
              <div className="flex items-center gap-2">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Live Processing</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10 transition-all">Bulk Export</Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Txn ID</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Sender / Receiver</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Type</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Amount & Fee</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Risk Index</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Device/Channel</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">Date & Time</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {transactionData.map((txn) => (
                  <tr 
                    key={txn.id} 
                    className="hover:bg-secondary transition-colors group cursor-pointer"
                    onClick={() => router.push(`/transactions/${txn.id}`)}
                  >
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-background text-muted-foreground flex items-center justify-center font-black text-[9px] group-hover:bg-primary group-hover:text-white transition-all shrink-0 border border-border">
                          TX
                        </div>
                        <span className="text-[11px] font-black font-mono text-primary truncate max-w-[120px]">{txn.id}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[13px] font-black text-foreground leading-none truncate max-w-[150px]">{txn.sender}</span>
                          <ArrowRight size={10} className="text-muted-foreground shrink-0" />
                          <span className="text-[13px] font-bold text-muted-foreground leading-none truncate max-w-[150px]">{txn.receiver}</span>
                        </div>
                        <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-tighter">P2P Transfer</div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <span className="px-2 py-0.5 rounded-lg bg-muted text-muted-foreground text-[9px] font-black uppercase tracking-widest border border-border">{txn.type}</span>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="text-[13px] font-black text-foreground">{formatCurrency(txn.amount)}</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Fee: {formatCurrency(txn.fee)}</div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[9px] font-bold">
                          <span className="text-muted-foreground">Fraud Index</span>
                          <span className={cn(txn.risk > 0.5 ? "text-rose-600 dark:text-rose-500" : "text-emerald-600 dark:text-emerald-500")}>{(txn.risk * 100).toFixed(0)}%</span>
                        </div>
                        <div className="w-20 h-1 bg-background rounded-full overflow-hidden">
                          <div 
                            className={cn("h-full", txn.risk > 0.7 ? "bg-rose-500" : txn.risk > 0.4 ? "bg-amber-500" : "bg-emerald-500")}
                            style={{ width: `${txn.risk * 100}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-2">
                        <Smartphone size={12} className="text-muted-foreground shrink-0" />
                        <span className="text-[11px] font-bold text-muted-foreground truncate max-w-[100px]">{txn.device}</span>
                      </div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{txn.channel}</div>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <Badge status={txn.status} />
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="text-[11px] font-bold text-muted-foreground">{txn.date.split(' ')[0]}</div>
                      <div className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{txn.date.split(' ').slice(1).join(' ')}</div>
                    </td>
                    <td className="px-4 py-2.5 text-right relative" onClick={(e) => e.stopPropagation()}>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
                      >
                        <Eye size={14} />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
