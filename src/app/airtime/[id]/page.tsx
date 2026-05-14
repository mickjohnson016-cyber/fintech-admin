'use client';

import React, { useState } from'react';
import Image from'next/image';
import { useParams, useRouter } from'next/navigation';
import {
 ArrowLeft, ShieldCheck, ShieldAlert, Clock, 
 CheckCircle2, AlertTriangle, RefreshCw, History,
 Smartphone, Globe, MapPin, ExternalLink, 
 MoreVertical, Download, Zap, FileText,
 User, CreditCard, Banknote, HelpCircle,
 Lock, Ban, Mail, CheckCircle, XCircle,
 Info, Activity, Fingerprint, Network,
 ChevronRight, BadgeCheck, TrendingUp,
 Signal, Radio, Phone, Share2
} from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from"@/lib/utils";

// 1. TIMELINE DATA
const timeline = [
 { id: 1, title:'Recharge Request Received', time:'May 07, 2024 • 10:24:02 AM', desc:'Channel: Mobile App (v4.2)', status:'done' },
 { id: 2, title:'Vendor API Call Initiated', time:'May 07, 2024 • 10:24:05 AM', desc:'MTN Direct VTU Gateway', status:'done' },
 { id: 3, title:'Network Confirmation', time:'May 07, 2024 • 10:24:08 AM', desc:'Response Code: 200 (Success)', status:'done' },
 { id: 4, title:'Customer Notified', time:'May 07, 2024 • 10:24:12 AM', desc:'Push & SMS notification sent', status:'done' },
];

export default function AirtimeDetailsPage() {
 const params = useParams();
 const router = useRouter();

 const txn = {
 id: params.id,
 amount: 5000,
 commission: 150,
 status:'Completed',
 type:'Airtime Recharge',
 network:'MTN',
 phone:'0803 123 4567',
 date:'May 07, 2024',
 time:'10:24 AM',
 reference:'RECH-84920485920',
 vendorRef:'MTN-VTU-92048-XYZ',
 user: { name:'Ngozi Okonjo', id:'USR-2024-001', email:'ngozi@example.com' },
 metadata: {
 ip:'102.89.2.14',
 location:'Lagos, Nigeria',
 device:'iPhone 15 Pro Max',
 channel:'Mobile App'
 }
 };

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('en-NG', {
 style:'currency', currency:'NGN', minimumFractionDigits: 0
 }).format(amount).replace('NGN','₦');
 };

 const NetworkLogo = ({ network }: { network: string }) => {
 const n = network.toLowerCase();
 const logos: Record<string, string> = {
 mtn:'/networks/mtn.svg',
 airtel:'/networks/airtel.svg',
 glo:'/networks/glo.svg',
'9mobile':'/networks/9mobile.svg',
 };
 return (
 <div className="w-12 h-12 rounded-2xl overflow-hidden border border-border bg-white flex items-center justify-center shadow-sm">
 <Image src={logos[n] ||'/networks/mtn.svg'} alt={network} width={48} height={48} className="object-contain" />
 </div>
 );
 };

 return (
 <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-8 space-y-8 animate-in fade-in duration-700">
 
 {/* 2. HEADER & PRIMARY ACTIONS */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <div className="flex items-center gap-6">
 <button 
 onClick={() => router.back()}
 className="p-3 bg-white border border-slate-200 rounded-2xl text-muted-foreground hover:text-[#0A1628] hover:bg-muted transition-all shadow-sm"
 >
 <ArrowLeft size={20} />
 </button>
 <div>
 <div className="flex items-center gap-3 mb-1">
 <h1 className="text-xl font-black text-[#0A1628] tracking-tight">Recharge <span className="text-primary font-mono">#{txn.id}</span></h1>
 <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[9px] font-black uppercase tracking-widest border border-emerald-100 flex items-center gap-1.5">
 <CheckCircle size={10} fill="currentColor" className="text-emerald-500" /> Success
 </span>
 </div>
 <div className="flex items-center gap-4 text-muted-foreground text-xs font-bold">
 <span>Vendor Ref: {txn.vendorRef}</span>
 <span>•</span>
 <span>{txn.date} at {txn.time}</span>
 </div>
 </div>
 </div>

 <div className="flex flex-wrap items-center gap-2">
 <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-200 font-bold text-muted-foreground bg-white shadow-sm flex items-center gap-2">
 <Share2 size={16} /> Share Receipt
 </Button>
 <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-200 font-bold text-muted-foreground bg-white shadow-sm flex items-center gap-2">
 <RefreshCw size={16} /> Retry Failed
 </Button>
 <Button size="sm" className="h-10 rounded-xl bg-[#2979FF] hover:bg-blue-600 text-white px-6 font-bold shadow-lg shadow-primary/20 flex items-center gap-2">
 <History size={16} /> View API Logs
 </Button>
 </div>
 </div>

 <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
 
 {/* LEFT COLUMN: PRIMARY TRANSACTION DATA */}
 <div className="lg:col-span-8 space-y-8">
 
 {/* Main Summary */}
 <div className="bg-white border border-slate-200 rounded-[32px] overflow-hidden shadow-sm">
 <div className="p-8 border-b border-slate-50 bg-muted/30">
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 <div className="space-y-1">
 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Purchase Amount</p>
 <h3 className="text-3xl font-black text-[#0A1628] tracking-tighter">{formatCurrency(txn.amount)}</h3>
 </div>
 <div className="space-y-1">
 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Platform Commission</p>
 <h3 className="text-xl font-black text-emerald-500 tracking-tighter">+{formatCurrency(txn.commission)}</h3>
 </div>
 <div className="space-y-1">
 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Network Provider</p>
 <div className="flex items-center gap-2 mt-1">
 <NetworkLogo network={txn.network} />
 <span className="text-xl font-black text-[#0A1628]">{txn.network}</span>
 </div>
 </div>
 </div>
 </div>

 <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
 {/* Customer Information */}
 <div className="space-y-6">
 <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
 <User size={14} className="text-primary" /> Customer Information
 </h4>
 <div>
 <p className="text-[15px] font-black text-[#0A1628] mb-0.5">{txn.user.name}</p>
 <p className="text-[12px] font-bold text-muted-foreground">{txn.user.email}</p>
 <button className="mt-3 text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
 View Full Profile <ExternalLink size={10} />
 </button>
 </div>
 </div>

 {/* Destination Details */}
 <div className="space-y-6">
 <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
 <Phone size={14} className="text-emerald-500" /> Target Phone Number
 </h4>
 <div>
 <p className="text-[18px] font-black text-[#0A1628] mb-0.5 tracking-tight">{txn.phone}</p>
 <p className="text-[12px] font-bold text-muted-foreground">{txn.network} Nigeria</p>
 <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-lg text-[9px] font-black uppercase tracking-widest border border-emerald-100">
 <BadgeCheck size={10} /> Verified Number
 </div>
 </div>
 </div>
 </div>
 </div>

 {/* Technical Context */}
 <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
 <h3 className="text-sm font-black text-[#0A1628] uppercase tracking-widest mb-8 flex items-center gap-2">
 <Fingerprint size={18} className="text-primary" />
 Technical Diagnostics
 </h3>
 
 <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
 {[
 { label:'Source IP', value: txn.metadata.ip, icon: Globe },
 { label:'Origin City', value: txn.metadata.location, icon: MapPin },
 { label:'User Device', value: txn.metadata.device, icon: Smartphone },
 { label:'API Channel', value: txn.metadata.channel, icon: Network },
 { label:'Vendor Status', value:'API-200-OK', icon: ShieldCheck },
 { label:'Retry Count', value:'0 Retries', icon: RefreshCw },
 ].map((m, i) => (
 <div key={i} className="space-y-1 group">
 <div className="flex items-center gap-2 text-muted-foreground mb-1">
 <m.icon size={12} />
 <p className="text-[9px] font-black uppercase tracking-widest">{m.label}</p>
 </div>
 <p className="text-[13px] font-bold text-[#0A1628] group-hover:text-primary transition-colors">{m.value}</p>
 </div>
 ))}
 </div>
 </div>

 {/* Detailed Timeline */}
 <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
 <h3 className="text-sm font-black text-[#0A1628] uppercase tracking-widest mb-8 flex items-center gap-2">
 <History size={18} className="text-primary" />
 Operations Timeline
 </h3>
 <div className="space-y-8">
 {timeline.map((step, i) => (
 <div key={step.id} className="relative flex gap-6">
 {i !== timeline.length - 1 && (
 <div className="absolute left-[11px] top-6 w-[2px] h-[calc(100%+32px)] bg-slate-100" />
 )}
 <div className={cn("w-6 h-6 rounded-full shrink-0 flex items-center justify-center z-10", step.status ==='done' ?'bg-emerald-500 text-white' :'bg-slate-100 text-secondary-foreground')}>
 {step.status ==='done' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
 </div>
 <div className="space-y-1">
 <p className="text-[13px] font-black text-[#0A1628]">{step.title}</p>
 <p className="text-[11px] font-bold text-muted-foreground">{step.time}</p>
 <p className="text-[11px] font-medium text-muted-foreground italic mt-1">{step.desc}</p>
 </div>
 </div>
 ))}
 </div>
 </div>
 </div>

 {/* RIGHT COLUMN: RISK & VENDOR OPERATIONS */}
 <div className="lg:col-span-4 space-y-6">
 
 {/* Vendor API Panel */}
 <div className="bg-[#0A1628] rounded-[32px] p-8 shadow-xl relative overflow-hidden group">
 <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
 <Radio size={120} className="text-white" />
 </div>
 <div className="flex items-center justify-between mb-8">
 <h4 className="text-[11px] font-black text-white/60 uppercase tracking-[0.2em]">Vendor Diagnostic</h4>
 <BadgeCheck size={20} className="text-emerald-500" />
 </div>
 
 <div className="space-y-8 relative z-10">
 <div className="p-4 bg-background/5 border border-white/10 rounded-2xl space-y-4">
 <div className="flex items-center justify-between">
 <span className="text-[12px] font-bold text-white/60">Response Latency</span>
 <span className="text-[13px] font-black text-emerald-400">124ms</span>
 </div>
 <div className="flex items-center justify-between">
 <span className="text-[12px] font-bold text-white/60">Provider Message</span>
 <span className="text-[13px] font-black text-white">SUCCESS_CONFIRMED</span>
 </div>
 </div>

 <div className="space-y-4">
 {[
 { label:'Vendor Balance', status:'Healthy', color:'text-emerald-400' },
 { label:'Network Uptime', status:'99.9%', color:'text-emerald-400' },
 { label:'API Consistency', status:'Optimal', color:'text-emerald-400' },
 ].map((r, i) => (
 <div key={i} className="flex items-center justify-between text-[11px]">
 <span className="font-bold text-white/60">{r.label}</span>
 <span className={cn("font-black uppercase tracking-widest", r.color)}>{r.status}</span>
 </div>
 ))}
 </div>
 
 <button className="w-full py-3.5 bg-[#2979FF] hover:bg-blue-600 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20">
 Sync with Network Provider
 </button>
 </div>
 </div>

 {/* Quick Actions Panel */}
 <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm space-y-8">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operational Oversight</h4>
 
 <div className="space-y-2">
 <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-muted group transition-all text-muted-foreground hover:text-[#0A1628]">
 <div className="flex items-center gap-3">
 <RefreshCw size={16} className="text-secondary-foreground group-hover:text-primary" />
 <span className="text-[12px] font-black uppercase tracking-widest">Manual Re-try</span>
 </div>
 <ChevronRight size={14} className="text-secondary-foreground" />
 </button>
 <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-50 group transition-all text-rose-500">
 <div className="flex items-center gap-3">
 <Ban size={16} className="text-rose-300 group-hover:text-rose-500" />
 <span className="text-[12px] font-black uppercase tracking-widest">Block Mobile Number</span>
 </div>
 <ChevronRight size={14} className="text-rose-300" />
 </button>
 </div>
 </div>

 {/* Compliance Review */}
 <div className="bg-white border border-slate-200 rounded-[32px] p-8 shadow-sm">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Operations Note</h4>
 <div className="p-4 bg-muted rounded-2xl">
 <p className="text-[12px] font-medium text-muted-foreground leading-relaxed italic">
"Automatic retry succeeded after initial vendor timeout. Vendor API responded on attempt #1."
 </p>
 <div className="mt-4 flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-[#0A1628] text-white flex items-center justify-center text-[10px] font-black italic">S</div>
 <span className="text-[10px] font-black text-[#0A1628] uppercase tracking-widest">System Bot • 10:24 AM</span>
 </div>
 </div>
 </div>

 </div>

 </div>

 </div>
 );
}
