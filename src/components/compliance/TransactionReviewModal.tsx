'use client';

import React, { useState } from'react';
import { motion, AnimatePresence } from'framer-motion';
import { 
 X, 
 ShieldAlert, 
 CheckCircle2, 
 XCircle, 
 AlertTriangle, 
 Clock, 
 User, 
 ArrowRight,
 ShieldCheck,
 Cpu,
 Wallet,
 Smartphone,
 Globe,
 MoreVertical,
 Download,
 Eye,
 History,
 FileText,
 ExternalLink
} from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from'@/lib/utils';
import { toast } from'sonner';

interface TransactionReviewModalProps {
 transaction: any;
 isOpen: boolean;
 onClose: () => void;
 onApprove: (id: string) => void;
 onReject: (id: string) => void;
 onEscalate: (id: string) => void;
}

export default function TransactionReviewModal({ 
 transaction, 
 isOpen, 
 onClose,
 onApprove,
 onReject,
 onEscalate
}: TransactionReviewModalProps) {
 const [activeTab, setActiveTab] = useState<'details' |'risk' |'history'>('details');

 if (!transaction) return null;

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('en-NG', {
 style:'currency', currency:'NGN', minimumFractionDigits: 0
 }).format(amount).replace('NGN','₦');
 };

 return (
 <AnimatePresence>
 {isOpen && (
 <>
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="fixed inset-0 bg-background/80 backdrop-blur-md z-[200]"
 />

 <motion.div
 initial={{ opacity: 0, x: 100 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 100 }}
 className="fixed inset-y-0 right-0 w-full max-w-2xl bg-card border-l border-border/50 shadow-2xl z-[201] flex flex-col overflow-hidden"
 >
 {/* Header */}
 <div className="p-8 border-b border-border/10 flex items-center justify-between bg-muted/30">
 <div className="space-y-1">
 <div className="flex items-center gap-3">
 <span className="text-2xl font-black text-primary font-mono tracking-tighter">{transaction.id}</span>
 <span className={cn(
"px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
 transaction.status ==='Flagged' ?"bg-rose-500/10 border-rose-500/20 text-rose-500" :"bg-amber-500/10 border-amber-500/20 text-amber-500"
 )}>
 {transaction.status}
 </span>
 </div>
 <h2 className="text-xl font-black text-foreground tracking-tight">Transaction Investigation</h2>
 </div>
 <button 
 onClick={onClose}
 className="p-3 bg-card border border-border/20 rounded-2xl text-muted-foreground hover:text-foreground transition-all"
 >
 <X size={20} />
 </button>
 </div>

 {/* Content Tabs */}
 <div className="px-8 border-b border-border/10 bg-card">
 <div className="flex items-center gap-8">
 {['details','risk','history'].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab as any)}
 className={cn(
"py-4 text-[11px] font-black uppercase tracking-widest transition-all relative",
 activeTab === tab ?"text-primary" :"text-muted-foreground hover:text-foreground"
 )}
 >
 {tab}
 {activeTab === tab && (
 <motion.div layoutId="activeTabTx" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
 )}
 </button>
 ))}
 </div>
 </div>

 {/* Scrollable Content */}
 <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
 {activeTab ==='details' && (
 <>
 {/* Financial Summary */}
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
 <div className="p-6 bg-secondary/30 border border-border/10 rounded-[32px] space-y-1">
 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Gross Amount</p>
 <h3 className="text-2xl font-black text-foreground tracking-tight">{formatCurrency(transaction.amount)}</h3>
 </div>
 <div className="p-6 bg-secondary/30 border border-border/10 rounded-[32px] space-y-1">
 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Fee (System)</p>
 <h3 className="text-2xl font-black text-foreground/40 tracking-tight">{formatCurrency(transaction.amount * 0.015)}</h3>
 </div>
 </div>

 {/* Parties Section */}
 <div className="space-y-4">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction Parties</h4>
 <div className="p-6 bg-secondary/20 border border-border/5 rounded-[32px] space-y-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="size-12 rounded-xl bg-background border border-border/40 flex items-center justify-center text-primary font-black text-lg">
 {transaction.user[0]}
 </div>
 <div>
 <p className="text-[14px] font-black text-foreground tracking-tight">{transaction.user}</p>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Sender Account</p>
 </div>
 </div>
 <Button variant="ghost" size="icon" className="size-8 rounded-lg"><ExternalLink size={14} /></Button>
 </div>
 
 <div className="relative h-8 flex items-center justify-center">
 <div className="absolute inset-0 flex items-center justify-center">
 <div className="w-full h-px bg-border/20" />
 </div>
 <div className="size-8 rounded-full bg-background border border-border/20 flex items-center justify-center z-10">
 <ArrowRight size={14} className="text-muted-foreground" />
 </div>
 </div>

 <div className="flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="size-12 rounded-xl bg-muted border border-border/40 flex items-center justify-center text-muted-foreground font-black text-lg">
 M
 </div>
 <div>
 <p className="text-[14px] font-black text-foreground tracking-tight">Merchant / Receiver</p>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Destination Endpoint</p>
 </div>
 </div>
 <Button variant="ghost" size="icon" className="size-8 rounded-lg"><ExternalLink size={14} /></Button>
 </div>
 </div>
 </div>

 {/* Provider Data */}
 <div className="space-y-4">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Technical Metadata</h4>
 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 bg-secondary/10 border border-border/5 rounded-2xl space-y-1">
 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Gateway Provider</p>
 <p className="text-[12px] font-black text-foreground">Flutterwave (NG)</p>
 </div>
 <div className="p-4 bg-secondary/10 border border-border/5 rounded-2xl space-y-1">
 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Payment Channel</p>
 <p className="text-[12px] font-black text-foreground">{transaction.type}</p>
 </div>
 </div>
 </div>
 </>
 )}

 {activeTab ==='risk' && (
 <div className="space-y-8">
 {/* Risk Score */}
 <div className="space-y-4">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Compliance Scorecard</h4>
 <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[40px] flex flex-col items-center text-center space-y-4">
 <div className="size-20 rounded-full border-4 border-rose-500/20 flex items-center justify-center relative">
 <div className="absolute inset-0 border-4 border-rose-500 rounded-full" style={{ clipPath:`inset(0 0 ${100 - transaction.risk}% 0)` }} />
 <span className="text-3xl font-black text-rose-500">{transaction.risk}</span>
 </div>
 <div>
 <h4 className="text-[14px] font-black text-foreground uppercase tracking-widest">High Risk Activity Detected</h4>
 <p className="text-[11px] font-medium text-muted-foreground mt-1">{transaction.reason}</p>
 </div>
 </div>
 </div>

 {/* Fraud Signals */}
 <div className="space-y-4">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Fraud Signal Intelligence</h4>
 <div className="space-y-2">
 {[
 { signal:'Large Transfer Velocity', status:'critical', icon: ShieldAlert },
 { signal:'New Device Fingerprint', status:'warning', icon: Smartphone },
 { signal:'Unusual Geographical Hop', status:'warning', icon: Globe },
 { signal:'Blacklisted IP Range', status:'safe', icon: ShieldCheck },
 ].map((s, i) => (
 <div key={i} className="p-4 bg-secondary/20 border border-border/5 rounded-2xl flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className={cn(
"size-8 rounded-lg flex items-center justify-center border",
 s.status ==='critical' ?"bg-rose-500/10 text-rose-500 border-rose-500/20" :
 s.status ==='warning' ?"bg-amber-500/10 text-amber-500 border-amber-500/20" :
"bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
 )}>
 <s.icon size={14} />
 </div>
 <span className="text-[12px] font-black text-foreground/80 tracking-tight">{s.signal}</span>
 </div>
 <span className={cn(
"text-[9px] font-black uppercase tracking-widest",
 s.status ==='critical' ?"text-rose-500" :
 s.status ==='warning' ?"text-amber-500" :"text-emerald-500"
 )}>{s.status}</span>
 </div>
 ))}
 </div>
 </div>
 </div>
 )}

 {activeTab ==='history' && (
 <div className="space-y-6">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Transaction Audit Trail</h4>
 <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border/10">
 <div className="relative pl-12 group">
 <div className="absolute left-0 top-0 size-10 rounded-xl border bg-primary/10 border-primary/20 flex items-center justify-center z-10">
 <Clock size={16} className="text-primary" />
 </div>
 <div className="space-y-1">
 <h4 className="text-[13px] font-black text-foreground tracking-tight">Manual Review Initiated</h4>
 <p className="text-[10px] font-bold text-muted-foreground uppercase">{transaction.time}</p>
 <p className="text-[12px] font-medium text-muted-foreground/80 leading-relaxed pt-1">
 System flagged transaction due to compliance rule:"VELOCITY_THRESHOLD_EXCEEDED".
 </p>
 </div>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Footer Actions */}
 <div className="p-8 border-t border-border/10 bg-card grid grid-cols-2 gap-4">
 <Button 
 variant="outline"
 className="h-12 rounded-2xl border-border/40 font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
 onClick={() => onEscalate(transaction.id)}
 >
 <ShieldAlert size={16} /> Escalate Case
 </Button>
 <div className="flex gap-2">
 <Button 
 className="flex-1 h-12 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
 onClick={() => onApprove(transaction.id)}
 >
 <CheckCircle2 size={16} /> Approve
 </Button>
 <Button 
 variant="outline"
 className="h-12 rounded-2xl border-rose-500/20 text-rose-500 hover:bg-rose-500/5 font-black text-[11px] uppercase tracking-widest flex items-center justify-center"
 onClick={() => onReject(transaction.id)}
 >
 <XCircle size={16} />
 </Button>
 </div>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
}
