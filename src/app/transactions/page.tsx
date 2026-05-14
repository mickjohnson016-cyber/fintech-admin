'use client';

import React, { useState } from'react';
import { useRouter } from'next/navigation';
import { Button } from'@/components/ui/button';
import { cn } from"@/lib/utils";
import Breadcrumbs from'@/components/layout/Breadcrumbs';
import { useTableFilters } from'@/hooks/useTableFilters';
import { toast } from'sonner';
import { motion, AnimatePresence } from'framer-motion';
import { exportTransactionReceipt } from'@/lib/exportTransactionReceipt';
import { executeExport } from'@/lib/exportUtils';
import { 
 X, Shield, AlertTriangle, Check, UserCheck, 
 UserMinus, MessageSquare, Send, Loader2,
 AlertCircle, Info, ArrowRight, Smartphone,
 ExternalLink, Eye, RefreshCw, Layers, ShieldAlert,
 Download, Calendar, Search, Filter, MoreVertical,
 MoreHorizontal, Clock, CheckCircle2, Globe, ShieldCheck,
 Mail, FileText, TrendingUp, Activity, BadgeCheck, Zap, ChevronDown,
 ArrowUpRight, ArrowDownRight, Ban, Lock, History, User
} from'lucide-react';
import { DashboardGrid } from'@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from'@/components/ui/AdaptiveMetricCard';
import { EmptyState } from'@/components/ui/EmptyState';

// Transaction type for backend integration
interface TransactionRecord {
 id: string;
 sender: string;
 receiver: string;
 type: string;
 amount: number;
 fee: number;
 status: string;
 risk: number;
 device: string;
 channel: string;
 date: string;
}

const txnMetrics = [
 { label:'Total Volume', value:'--', trend:'--', up: null, icon: Activity, color:'text-primary' },
 { label:'Success Rate', value:'--', trend:'--', up: null, icon: BadgeCheck, color:'text-emerald-500' },
 { label:'Failed Payments', value:'0', trend:'--', up: null, icon: AlertTriangle, color:'text-rose-500' },
 { label:'Pending Manual Review', value:'0', trend:'--', up: null, icon: Clock, color:'text-amber-500' },
 { label:'Fraud Flags', value:'0', trend:'--', up: null, icon: ShieldAlert, color:'text-rose-500' },
 { label:'Chargebacks', value:'--', trend:'--', up: null, icon: RefreshCw, color:'text-purple-500' },
];

// Empty — awaiting backend integration
const transactionData: TransactionRecord[] = [];

// 2. HELPER COMPONENTS
const Badge = ({ status }: { status: string }) => {
 const s = status.toLowerCase();
 const styles: Record<string, string> = {
 completed:'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
 failed:'bg-rose-500/10 text-rose-600 border-rose-500/20',
 pending:'bg-amber-500/10 text-amber-600 border-amber-500/20',
 flagged:'bg-orange-500/10 text-orange-600 border-orange-500/20',
 reversed:'bg-purple-500/10 text-purple-600 border-purple-500/20',
 low:'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
 medium:'bg-amber-500/10 text-amber-600 border-amber-500/20',
 high:'bg-rose-500/10 text-rose-600 border-rose-500/20',
 };
 return (
 <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", styles[s] ||'bg-muted text-muted-foreground border-border')}>
 {status}
 </span>
 );
};

export default function TransactionsOperationsPage() {
 const router = useRouter();
 const [data, setData] = useState<TransactionRecord[]>(transactionData);
 const [isEscalateModalOpen, setIsEscalateModalOpen] = useState(false);
 const [isReviewDrawerOpen, setIsReviewDrawerOpen] = useState(false);
 const [selectedTxn, setSelectedTxn] = useState<any>(null);
 const [isSubmitting, setIsSubmitting] = useState(false);

 // Escalation Form State
 const [escalationLevel, setEscalationLevel] = useState('Level 1');
 const [department, setDepartment] = useState('Compliance');
 const [reason, setReason] = useState('');

 const {
 searchTerm,
 setSearchTerm,
 filteredData,
 statusFilter,
 setStatusFilter
 } = useTableFilters(data, {
 searchKeys: ['id','sender','receiver','type']
 });

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('en-NG', {
 style:'currency', currency:'NGN', minimumFractionDigits: 0
 }).format(amount).replace('NGN','₦');
 };

 const handleEscalateSubmit = () => {
 if (!reason.trim()) {
 toast.error("Required Field", { description:"Please provide a detailed justification for this escalation." });
 return;
 }

 setIsSubmitting(true);
 // Simulate API delay
 setTimeout(() => {
 setData(prev => prev.map(t => 
 t.id === selectedTxn?.id ? { ...t, status:'Flagged', risk: Math.min(t.risk + 0.2, 1) } : t
 ));
 toast.success('Escalation Finalized', { 
 description:`${selectedTxn?.id} has been moved to ${department} for ${escalationLevel} review.` 
 });
 setIsSubmitting(false);
 setIsEscalateModalOpen(false);
 setReason('');
 }, 1500);
 };

 const handleReviewAction = (txnId: string, action:'Approve' |'Reject' |'Suspicious') => {
 setData(prev => prev.map(t => {
 if (t.id === txnId) {
 if (action ==='Approve') return { ...t, status:'Completed', risk: 0.05 };
 if (action ==='Reject') return { ...t, status:'Failed', risk: 0.95 };
 if (action ==='Suspicious') return { ...t, status:'Flagged', risk: 0.85 };
 }
 return t;
 }));
 
 if (action ==='Approve') {
 toast.success('Transaction Approved', { description:`${txnId} has been released to the gateway.` });
 } else if (action ==='Reject') {
 toast.error('Transaction Rejected', { description:`${txnId} has been blocked and funds reversed.` });
 } else {
 toast.warning('Marked Suspicious', { description:`${txnId} moved to high-risk investigation pool.` });
 }
 };

 return (
 <div className="w-full space-y-4 animate-in fade-in duration-700 pb-10">
 <Breadcrumbs />

 {/* 3. OPERATIONS HEADER */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <div>
 <div className="flex items-center gap-2 mb-1">
 <h1 className="text-2xl font-black text-foreground tracking-tight">Transaction Operations</h1>
 </div>
 
 </div>

 <div className="flex flex-wrap items-center gap-2">
 <Button onClick={() => executeExport({ fileName:'TransactionLedger', data: filteredData, format:'CSV' })} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
 <Download size={14} /> Export CSV
 </Button>
 <Button onClick={() => router.push('/compliance/review-queue?from=transactions')} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground relative">
 <Layers size={14} /> Review Queue
 <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center shadow-lg border-2 border-background">
 {data.filter(t => t.status ==='Flagged' || t.status ==='Pending').length}
 </span>
 </Button>
 </div>
 </div>

 {/* 4. OVERVIEW METRICS GRID */}
 <DashboardGrid cols={6}>
 {txnMetrics.map((stat, i) => (
 <AdaptiveMetricCard
 key={i}
 label={stat.label}
 value={stat.value}
 icon={stat.icon}
 trend={stat.trend !=='--' ? stat.trend : undefined}
 trendUp={stat.up}
 color={stat.color}
 />
 ))}
 </DashboardGrid>

 {/* 5. ADVANCED FILTER BAR */}
 <div className="bg-card border border-border rounded-xl p-2.5 flex flex-col xl:flex-row items-center gap-3 shadow-sm">
 <div className="relative flex-1 w-full group">
 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search by Transaction ID, sender name, receiver..."
 className="w-full bg-muted border border-border rounded-lg py-2 pl-9 pr-3 text-[12px] font-bold text-foreground placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/40 transition-all"
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 />
 </div>
 <div className="flex items-center gap-2 w-full xl:w-auto">
 <Button onClick={() => toast.success('Refreshing Ledger...', { description:'Syncing with transaction service' })} variant="ghost" size="icon" className="border border-border rounded-lg h-9 w-9 bg-muted hover:bg-secondary text-muted-foreground hover:text-foreground">
 <RefreshCw size={14} />
 </Button>
 </div>
 </div>

 {/* 6. MAIN CONTENT AREA (FULL WIDTH) */}
 <div className="w-full">
 <div className="bg-card border border-border rounded-[20px] overflow-hidden flex flex-col min-w-0 shadow-sm">
 <div className="px-5 py-3 border-b border-border flex items-center justify-between bg-background sticky top-0 z-10">
 <div className="flex items-center gap-3">
 <h3 className="text-[11px] font-black text-foreground uppercase tracking-[0.15em]">Transaction Ledger</h3>
 </div>
 <div className="flex items-center gap-3">
 <Button 
 onClick={() => executeExport({ fileName:'Transactions', data: filteredData, format:'CSV' })}
 variant="outline" 
 className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest bg-card border-border/40 hover:bg-secondary flex items-center gap-2"
 >
 <Download size={14} /> Export History
 </Button>
 </div>
 </div>

 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[1200px]">
 <thead className="sticky top-0 bg-muted z-20">
 <tr className="border-b border-border">
 <th className="px-4 py-2.5 text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Txn ID</th>
 <th className="px-4 py-2.5 text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Sender / Receiver</th>
 <th className="px-4 py-2.5 text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Type</th>
 <th className="px-4 py-2.5 text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Amount & Fee</th>
 <th className="px-4 py-2.5 text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Risk Index</th>
 <th className="px-4 py-2.5 text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em]">Device/Channel</th>
 <th className="px-4 py-2.5 text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] text-center">Status</th>
 <th className="px-4 py-2.5 text-[8px] font-black text-muted-foreground uppercase tracking-[0.2em] text-right">Date & Time</th>
 <th className="px-4 py-2.5"></th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {filteredData.length > 0 ? filteredData.map((txn) => (
 <tr
 key={txn.id}
 className="hover:bg-secondary/50 transition-colors group cursor-pointer"
 onClick={() => router.push(`/transactions/${txn.id}`)}
 >
 <td className="px-4 py-2 text-xs">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-lg bg-background text-muted-foreground flex items-center justify-center font-black text-[8px] group-hover:bg-primary group-hover:text-white transition-all shrink-0 border border-border">
 TX
 </div>
 <span className="text-[10px] font-black font-mono text-primary truncate max-w-[80px]">{txn.id}</span>
 </div>
 </td>
 <td className="px-4 py-2 text-xs">
 <div className="space-y-0.5">
 <div className="flex items-center gap-1.5">
 <span className="text-[12px] font-black text-foreground leading-none truncate max-w-[120px]">{txn.sender}</span>
 <ArrowRight size={10} className="text-muted-foreground shrink-0 opacity-40" />
 <span className="text-[12px] font-bold text-muted-foreground leading-none truncate max-w-[120px]">{txn.receiver}</span>
 </div>
 </div>
 </td>
 <td className="px-4 py-2 text-xs">
 <span className="px-1.5 py-0.5 rounded-md bg-muted text-muted-foreground text-[8px] font-black uppercase tracking-widest border border-border">{txn.type}</span>
 </td>
 <td className="px-4 py-2 text-xs">
 <div className="text-[12px] font-black text-foreground">{formatCurrency(txn.amount)}</div>
 <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">Fee: {formatCurrency(txn.fee)}</div>
 </td>
 <td className="px-4 py-2 text-xs">
 <div className="space-y-1">
 <div className="flex items-center justify-between text-[8px] font-bold mb-1">
 <span className={cn(txn.risk > 0.5 ?"text-rose-600" :"text-emerald-600")}>{(txn.risk * 100).toFixed(0)}% RISK</span>
 </div>
 <div className="w-16 h-1 bg-background rounded-full overflow-hidden border border-border/10">
 <div
 className={cn("h-full", txn.risk > 0.7 ?"bg-rose-500" : txn.risk > 0.4 ?"bg-amber-500" :"bg-emerald-500")}
 style={{ width:`${txn.risk * 100}%` }}
 />
 </div>
 </div>
 </td>
 <td className="px-4 py-2 text-xs">
 <div className="flex items-center gap-1.5">
 <Smartphone size={10} className="text-muted-foreground shrink-0" />
 <span className="text-[10px] font-bold text-muted-foreground truncate max-w-[80px]">{txn.device}</span>
 </div>
 </td>
 <td className="px-4 py-2 text-xs text-center">
 <Badge status={txn.status} />
 </td>
 <td className="px-4 py-2 text-xs text-right">
 <div className="text-[10px] font-bold text-muted-foreground">{txn.date.split('')[0]}</div>
 <div className="text-[8px] font-bold text-muted-foreground uppercase tracking-widest mt-0.5">{txn.date.split('').slice(1).join('')}</div>
 </td>
 <td className="px-4 py-2 text-right relative" onClick={(e) => e.stopPropagation()}>
 <div className="flex items-center gap-1 justify-end">
 <Button
 variant="ghost"
 size="icon"
 title="View Details"
 className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all hover:scale-110"
 onClick={() => router.push(`/transactions/${txn.id}`)}
 >
 <Eye size={13} />
 </Button>
 <Button
 variant="ghost"
 size="icon"
 title="Escalate Case"
 className="h-7 w-7 rounded-lg hover:bg-amber-500/10 text-muted-foreground hover:text-amber-500 transition-all hover:scale-110"
 onClick={() => { setSelectedTxn(txn); setIsEscalateModalOpen(true); }}
 >
 <ShieldAlert size={13} />
 </Button>
 <div className="relative group/menu">
 <Button
 variant="ghost"
 size="icon"
 className="h-7 w-7 rounded-lg hover:bg-secondary text-muted-foreground transition-all hover:scale-110"
 >
 <MoreHorizontal size={13} />
 </Button>
 <div className="absolute right-0 top-full mt-1 w-44 bg-card border border-border rounded-xl shadow-2xl opacity-0 invisible group-hover/menu:opacity-100 group-hover/menu:visible transition-all z-[60] py-1.5 overflow-hidden ring-1 ring-black/5">
 <button 
 onClick={() => {
 navigator.clipboard.writeText(txn.id);
 toast.success("ID Copied", { description:"Transaction reference copied to clipboard." });
 }}
 className="w-full px-3 py-1.5 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-primary flex items-center gap-2.5"
 >
 <FileText size={12} /> Copy ID
 </button>
 <button 
 onClick={() => exportTransactionReceipt(txn)}
 className="w-full px-3 py-1.5 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-primary flex items-center gap-2.5"
 >
 <Download size={12} /> Export Receipt
 </button>
 <button 
 onClick={() => toast.success("Payment Retried", { description:"Resending request to gateway pool..." })}
 className="w-full px-3 py-1.5 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-primary flex items-center gap-2.5"
 >
 <RefreshCw size={12} /> Retry Payment
 </button>
 <div className="h-px bg-border my-1 mx-1.5" />
 <button 
 onClick={() => toast.error("Account Frozen", { description:"Risk protocol triggered for this profile." })}
 className="w-full px-3 py-1.5 text-left text-[9px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 flex items-center gap-2.5"
 >
 <Lock size={12} /> Freeze Profile
 </button>
 </div>
 </div>
 </div>
 </td>
 </tr>
 )) : (
 <tr>
 <td colSpan={6} className="px-5 py-24 text-center">
 <EmptyState 
 icon={Activity}
 title="No transactions found"
 description=""
 />
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 </div>
 </div>

 {/* ESCALATION MODAL */}
 <AnimatePresence>
 {isEscalateModalOpen && (
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={() => setIsEscalateModalOpen(false)}
 className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
 />
 <motion.div 
 initial={{ scale: 0.9, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.9, opacity: 0, y: 20 }}
 className="bg-card border border-border w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden relative z-10"
 >
 <div className="p-8 border-b border-border flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center border border-rose-500/20">
 <ShieldAlert size={20} />
 </div>
 <div>
 <h3 className="text-lg font-black text-foreground">Escalate Transaction</h3>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Case ID: {selectedTxn?.id}</p>
 </div>
 </div>
 <button onClick={() => setIsEscalateModalOpen(false)} className="text-muted-foreground hover:text-foreground">
 <X size={20} />
 </button>
 </div>

 <div className="p-8 space-y-6">
 <div className="grid grid-cols-2 gap-4">
 <div className="space-y-1.5">
 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Priority Level</label>
 <select 
 value={escalationLevel}
 onChange={(e) => setEscalationLevel(e.target.value)}
 className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-primary/40"
 >
 <option>Level 1 (Standard)</option>
 <option>Level 2 (Priority)</option>
 <option>Level 3 (Critical)</option>
 </select>
 </div>
 <div className="space-y-1.5">
 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Department</label>
 <select 
 value={department}
 onChange={(e) => setDepartment(e.target.value)}
 className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-xs font-bold outline-none focus:border-primary/40"
 >
 <option>Compliance</option>
 <option>Fraud Engine</option>
 <option>Executive Ops</option>
 <option>Legal</option>
 </select>
 </div>
 </div>

 <div className="space-y-1.5">
 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Investigation Reason</label>
 <textarea 
 value={reason}
 onChange={(e) => setReason(e.target.value)}
 rows={4}
 placeholder="Provide detailed justification for this escalation..."
 className="w-full bg-muted border border-border rounded-2xl px-4 py-3 text-xs font-bold outline-none focus:border-primary/40 resize-none"
 />
 </div>

 <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl p-4 flex gap-3">
 <AlertCircle size={16} className="text-rose-500 shrink-0" />
 <p className="text-[11px] font-medium text-rose-600 leading-relaxed">
 Escalating this case will freeze related funds and alert the internal compliance squad for immediate manual forensic review.
 </p>
 </div>

 <Button 
 onClick={handleEscalateSubmit}
 disabled={isSubmitting}
 className="w-full h-12 rounded-xl bg-primary text-white font-black uppercase text-[11px] tracking-widest shadow-lg shadow-primary/20"
 >
 {isSubmitting ? <Loader2 size={16} className="animate-spin" /> :"Submit Escalation"}
 </Button>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>

 {/* REVIEW QUEUE DRAWER */}
 <AnimatePresence>
 {isReviewDrawerOpen && (
 <div className="fixed inset-0 z-[100] flex justify-end">
 <motion.div 
 initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
 onClick={() => setIsReviewDrawerOpen(false)}
 className="absolute inset-0 bg-background/80 backdrop-blur-sm" 
 />
 <motion.div 
 initial={{ x:'100%' }}
 animate={{ x: 0 }}
 exit={{ x:'100%' }}
 transition={{ type:'spring', damping: 25, stiffness: 200 }}
 className="bg-card border-l border-border w-full max-w-xl shadow-2xl relative z-10 flex flex-col"
 >
 <div className="p-8 border-b border-border flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center border border-primary/20">
 <Layers size={20} />
 </div>
 <div>
 <h3 className="text-lg font-black text-foreground">Compliance Review Queue</h3>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
 {data.filter(t => t.status ==='Flagged' || t.status ==='Pending').length} cases requiring attention
 </p>
 </div>
 </div>
 <button onClick={() => setIsReviewDrawerOpen(false)} className="text-muted-foreground hover:text-foreground">
 <X size={20} />
 </button>
 </div>

 <div className="flex-1 overflow-y-auto p-8 space-y-4 no-scrollbar">
 {data.filter(t => t.status ==='Flagged' || t.status ==='Pending').map((txn) => (
 <div key={txn.id} className="p-6 bg-muted/50 border border-border rounded-3xl space-y-4 group hover:border-primary/40 transition-all">
 <div className="flex justify-between items-start">
 <div className="space-y-1">
 <p className="text-[11px] font-black text-primary font-mono">{txn.id}</p>
 <h4 className="text-[14px] font-black text-foreground">{txn.sender}</h4>
 <p className="text-[11px] font-bold text-muted-foreground">Amount: {formatCurrency(txn.amount)}</p>
 </div>
 <Badge status={txn.status} />
 </div>
 
 <div className="flex gap-2">
 <Button 
 onClick={() => handleReviewAction(txn.id,'Approve')}
 variant="outline" 
 size="sm" 
 className="flex-1 h-9 rounded-xl border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/10 text-[10px] font-black uppercase"
 >
 Approve
 </Button>
 <Button 
 onClick={() => handleReviewAction(txn.id,'Suspicious')}
 variant="outline" 
 size="sm" 
 className="flex-1 h-9 rounded-xl border-amber-500/20 text-amber-500 hover:bg-amber-500/10 text-[10px] font-black uppercase"
 >
 Suspicious
 </Button>
 <Button 
 onClick={() => handleReviewAction(txn.id,'Reject')}
 variant="outline" 
 size="sm" 
 className="flex-1 h-9 rounded-xl border-rose-500/20 text-rose-500 hover:bg-rose-500/10 text-[10px] font-black uppercase"
 >
 Reject
 </Button>
 </div>
 </div>
 ))}

 {data.filter(t => t.status ==='Flagged' || t.status ==='Pending').length === 0 && (
 <div className="h-full flex flex-col items-center justify-center text-center space-y-4 opacity-50">
 <CheckCircle2 size={48} className="text-emerald-500" />
 <div>
 <p className="text-[14px] font-black text-foreground uppercase tracking-widest">Queue is Clear</p>
 <p className="text-xs font-medium text-muted-foreground">All pending transactions have been reviewed.</p>
 </div>
 </div>
 )}
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 </div>
 );
}
