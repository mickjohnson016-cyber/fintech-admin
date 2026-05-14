'use client';

import React, { useState } from'react';
import { 
 Layers, Search, Filter, ArrowRight, ShieldAlert, 
 CheckCircle2, XCircle, AlertTriangle, Clock, 
 ExternalLink, ChevronRight, User, MoreHorizontal,
 Download, History, UserCheck, UserX, Shield,
 RefreshCw, FileText
} from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from"@/lib/utils";
import Breadcrumbs from'@/components/layout/Breadcrumbs';
import { toast } from'sonner';
import { motion, AnimatePresence } from'framer-motion';
import { EmptyState } from'@/components/ui/EmptyState';
import TransactionReviewModal from'@/components/compliance/TransactionReviewModal';
import AssignmentModal from'@/components/support/AssignmentModal';

// --- TYPES ---
interface ReviewItem {
 id: string;
 user: string;
 amount: number;
 risk: number;
 time: string;
 reason: string;
 status:'Flagged' |'Pending' |'Completed' |'Rejected';
 type: string;
 assignedTo?: string;
}

// Start EMPTY as per instructions
const initialQueue: ReviewItem[] = [];

import { useRouter, useSearchParams } from'next/navigation';

export default function ReviewQueuePage() {
 const router = useRouter();
 const searchParams = useSearchParams();
 const from = searchParams.get('from');

 const [queue, setQueue] = useState<ReviewItem[]>(initialQueue);
 const [filter, setFilter] = useState<'all' |'pending' |'flagged' |'high risk'>('all');
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedTxId, setSelectedTxId] = useState<string | null>(null);
 const [assigningTxId, setAssigningTxId] = useState<string | null>(null);
 const [openMenuId, setOpenMenuId] = useState<string | null>(null);

 const selectedTransaction = queue.find(t => t.id === selectedTxId) || null;
 const assigningTransaction = queue.find(t => t.id === assigningTxId) || null;

 const filteredQueue = queue.filter(item => {
 const matchesSearch = item.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
 item.id.toLowerCase().includes(searchTerm.toLowerCase());
 
 if (!matchesSearch) return false;
 if (filter ==='all') return true;
 if (filter ==='pending') return item.status ==='Pending';
 if (filter ==='flagged') return item.status ==='Flagged';
 if (filter ==='high risk') return item.risk > 80;
 return true;
 });

 const handleAction = (id: string, action:'Approve' |'Reject' |'Escalate' |'Assign') => {
 if (action ==='Approve') {
 setQueue(prev => prev.map(t => t.id === id ? { ...t, status:'Completed' as const } : t).filter(t => t.id !== id));
 toast.success('Transaction Approved', { description:`Item ${id} has been successfully released.` });
 } else if (action ==='Reject') {
 setQueue(prev => prev.map(t => t.id === id ? { ...t, status:'Rejected' as const } : t).filter(t => t.id !== id));
 toast.error('Transaction Rejected', { description:`Item ${id} has been blocked and flagged.` });
 } else if (action ==='Escalate') {
 setQueue(prev => prev.map(t => t.id === id ? { ...t, status:'Flagged' as const, risk: 100 } : t));
 toast.warning('Case Escalated', { description:`Item ${id} moved to high-priority compliance squad.` });
 } else if (action ==='Assign') {
 setAssigningTxId(id);
 }
 setSelectedTxId(null);
 setOpenMenuId(null);
 };

 const handleAssign = (adminName: string) => {
 if (assigningTxId) {
 setQueue(prev => prev.map(t => t.id === assigningTxId ? { ...t, assignedTo: adminName } : t));
 toast.success('Reviewer Assigned', { description:`${adminName} is now investigating ${assigningTxId}.` });
 setAssigningTxId(null);
 }
 };

 // Define custom breadcrumbs based on source
 const customBreadcrumbs = from ==='transactions' ? [
 { label:'Transactions', href:'/transactions' },
 { label:'Review Queue', href:'/compliance/review-queue', isLast: true }
 ] : [
 { label:'Compliance', href:'/compliance' },
 { label:'Review Queue', href:'/compliance/review-queue', isLast: true }
 ];

 return (
 <div className="space-y-6 animate-in fade-in duration-700 pb-20">
 <Breadcrumbs items={customBreadcrumbs} />
 
 <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-6">
 <div className="flex items-center gap-4">
 <Button 
 onClick={() => router.back()} 
 variant="ghost" 
 size="icon" 
 className="size-10 rounded-xl border border-border/40 hover:bg-secondary shrink-0"
 >
 <ArrowRight className="rotate-180" size={18} />
 </Button>
 <div>
 <h1 className="text-3xl font-black text-foreground tracking-tighter flex items-center gap-3">
 <Layers className="text-primary size-8" />
 Compliance Queue
 </h1>
 <p className="text-muted-foreground font-medium text-[13px] mt-1">
 Investigate high-risk patterns and manually authorize pending transactions.
 </p>
 </div>
 </div>
 
 <div className="flex flex-wrap items-center gap-3">
 <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-2xl border border-border/40">
 {['all','pending','flagged','high risk'].map((t) => (
 <button
 key={t}
 onClick={() => setFilter(t as any)}
 className={cn(
"px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
 filter === t ?"bg-card text-foreground shadow-sm border border-border/40" :"text-muted-foreground hover:text-foreground"
 )}
 >
 {t}
 </button>
 ))}
 </div>
 <Button variant="outline" className="h-11 rounded-2xl border-border/40 font-black text-[11px] uppercase tracking-widest gap-2">
 <Download size={14} /> Export Queue
 </Button>
 <Button 
 onClick={() => toast.success("Queue Synced", { description:"Review pool updated from security engine." })}
 variant="ghost" 
 size="icon" 
 className="size-11 rounded-2xl border border-border/40 bg-card hover:bg-secondary"
 >
 <RefreshCw size={16} className="text-muted-foreground" />
 </Button>
 </div>
 </div>

 {/* Search Bar */}
 <div className="relative group max-w-md">
 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <input 
 type="text"
 placeholder="Search by User or Transaction ID..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-card border border-border/40 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:bg-background focus:border-primary/40 transition-all shadow-sm"
 />
 </div>

 <div className="grid grid-cols-1 gap-4">
 <AnimatePresence mode="popLayout">
 {filteredQueue.map((item) => (
 <motion.div
 key={item.id}
 layout
 initial={{ opacity: 0, y: 20 }}
 animate={{ opacity: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95 }}
 onClick={() => setSelectedTxId(item.id)}
 className="bg-card border border-border/40 rounded-[32px] p-6 hover:shadow-xl hover:border-primary/20 transition-all group cursor-pointer relative"
 >
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
 <div className="flex items-start gap-6">
 <div className={cn(
"size-16 rounded-2xl flex items-center justify-center border-2 shrink-0 transition-transform group-hover:scale-105",
 item.risk > 80 ?"bg-rose-500/10 border-rose-500/20 text-rose-500" :"bg-primary/10 border-primary/20 text-primary"
 )}>
 <ShieldAlert size={28} />
 </div>
 <div className="space-y-1">
 <div className="flex items-center gap-3">
 <h3 className="text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors">{item.user}</h3>
 <span className={cn(
"px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-sm",
 item.status ==='Flagged' ?"bg-rose-500/10 text-rose-500 border-rose-500/20" :"bg-amber-500/10 text-amber-500 border-amber-500/20"
 )}>
 {item.status}
 </span>
 {item.assignedTo && (
 <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 border border-primary/10 rounded-lg">
 <User size={10} className="text-primary" />
 <span className="text-[9px] font-black text-primary uppercase">{item.assignedTo}</span>
 </div>
 )}
 </div>
 <p className="text-[12px] font-black text-primary font-mono tracking-tight">{item.id} • {item.type}</p>
 <div className="flex items-center gap-2 mt-3 p-2 bg-secondary/30 rounded-xl border border-border/10 w-fit">
 <AlertTriangle size={14} className="text-amber-500" />
 <span className="text-[11px] font-bold text-muted-foreground truncate max-w-[300px]">{item.reason}</span>
 </div>
 </div>
 </div>

 <div className="flex flex-col lg:items-end gap-2 shrink-0 bg-secondary/10 p-4 rounded-2xl border border-border/5">
 <div className="text-3xl font-black text-foreground tracking-tighter">₦{item.amount.toLocaleString()}</div>
 <div className="flex items-center gap-4">
 <div className="flex flex-col items-end">
 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Risk Score</span>
 <span className={cn("text-sm font-black", item.risk > 80 ?"text-rose-500" :"text-amber-500")}>{item.risk}/100</span>
 </div>
 <div className="w-20 h-2 bg-muted rounded-full overflow-hidden border border-border/10">
 <div className={cn("h-full transition-all duration-1000", item.risk > 80 ?"bg-rose-500" :"bg-amber-500")} style={{ width:`${item.risk}%` }} />
 </div>
 </div>
 </div>

 <div className="flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-border/10 pt-6 lg:pt-0 lg:pl-8">
 <Button 
 onClick={(e) => { e.stopPropagation(); handleAction(item.id,'Approve'); }}
 className="h-12 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl px-8 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-emerald-500/20 transition-all hover:scale-105"
 >
 Approve
 </Button>
 <Button 
 onClick={(e) => { e.stopPropagation(); handleAction(item.id,'Reject'); }}
 variant="outline"
 className="h-12 border-rose-500/20 text-rose-500 hover:bg-rose-500/5 rounded-2xl px-8 font-black text-[11px] uppercase tracking-widest"
 >
 Reject
 </Button>
 
 <div className="relative">
 <Button 
 variant="ghost"
 size="icon"
 onClick={(e) => {
 e.stopPropagation();
 setOpenMenuId(openMenuId === item.id ? null : item.id);
 }}
 className="size-12 rounded-2xl text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all"
 >
 <MoreHorizontal size={20} />
 </Button>

 <AnimatePresence>
 {openMenuId === item.id && (
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 10 }}
 className="absolute right-0 top-full mt-2 w-48 bg-card border border-border shadow-2xl rounded-2xl p-2 z-50 pointer-events-auto"
 onClick={(e) => e.stopPropagation()}
 >
 <button 
 onClick={() => handleAction(item.id,'Assign')}
 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
 >
 <User size={14} className="text-primary" /> Assign Reviewer
 </button>
 <button 
 onClick={() => handleAction(item.id,'Escalate')}
 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
 >
 <ShieldAlert size={14} className="text-rose-500" /> Escalate Case
 </button>
 <div className="h-px bg-border/10 my-1" />
 <button 
 onClick={() => toast.success("ID Copied", { description: item.id })}
 className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-secondary text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all"
 >
 <FileText size={14} /> Copy Reference
 </button>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 </div>
 </div>
 </motion.div>
 ))}
 
 {filteredQueue.length === 0 && (
 <div className="py-32">
 <EmptyState 
 icon={CheckCircle2}
 title="Review Queue is Clear"
 description=""
 />
 </div>
 )}
 </AnimatePresence>
 </div>

 {/* DETAILED INVESTIGATION MODAL */}
 <TransactionReviewModal 
 transaction={selectedTransaction}
 isOpen={!!selectedTransaction}
 onClose={() => setSelectedTxId(null)}
 onApprove={(id) => handleAction(id,'Approve')}
 onReject={(id) => handleAction(id,'Reject')}
 onEscalate={(id) => handleAction(id,'Escalate')}
 />

 {/* ASSIGNMENT MODAL */}
 <AssignmentModal 
 issue={assigningTransaction}
 isOpen={!!assigningTransaction}
 onClose={() => setAssigningTxId(null)}
 onAssign={(adminName) => handleAssign(adminName)}
 />
 </div>
 );
}

