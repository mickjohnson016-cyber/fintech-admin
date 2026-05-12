'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, ShieldCheck, ShieldAlert, Clock, 
  CheckCircle2, AlertTriangle, RefreshCw, History,
  Smartphone, Globe, MapPin, ExternalLink, 
  MoreVertical, Download, Zap, FileText,
  User, CreditCard, Banknote, HelpCircle,
  Lock, Ban, Mail, CheckCircle, XCircle,
  Info, Activity, Fingerprint, Network,
  ChevronRight, BadgeCheck, TrendingUp, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { toast } from 'sonner';

// 1. TIMELINE DATA
// Empty timeline — awaiting backend integration
const timeline: any[] = [];

export default function TransactionDetailsPage() {
  const params = useParams();
  const router = useRouter();

  // Placeholder for backend integration
  const txn = {
    id: params.id,
    amount: 0,
    fee: 0,
    total: 0,
    status: 'Pending',
    type: '---',
    date: '---',
    time: '---',
    reference: '---',
    sender: { name: '---', id: '---', phone: '---', email: '---' },
    receiver: { name: '---', account: '---', branch: '---' },
    metadata: {
      ip: '---',
      location: '---',
      device: '---',
      os: '---',
      browser: '---',
      channel: '---'
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦');
  };

  return (
    <div className="max-w-[1400px] mx-auto space-y-4 animate-in fade-in duration-700">
      <Breadcrumbs />
      
      {/* 2. HEADER & PRIMARY ACTIONS */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => router.back()}
            className="p-3 bg-card border border-border rounded-2xl text-muted-foreground hover:text-white hover:bg-secondary transition-all shadow-sm"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-xl font-black text-foreground tracking-tight">Transaction <span className="text-primary font-mono">#{txn.id}</span></h1>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[9px] font-black uppercase tracking-widest border border-emerald-500/20 flex items-center gap-1.5">
                <CheckCircle size={10} fill="currentColor" className="text-emerald-500" /> Completed
              </span>
            </div>
            <div className="flex items-center gap-4 text-muted-foreground text-xs font-bold">
              <span>Ref: {txn.reference}</span>
              <span>•</span>
              <span>{txn.date} at {txn.time}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button onClick={() => toast.success('Export Initiated', { description: `Generating receipt for ${txn.id} (PDF)...` })} variant="outline" size="sm" className="h-10 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Download size={16} /> Receipt
          </Button>
          <Button onClick={() => toast.success('Reversal Initiated', { description: 'Communication with bank started.' })} variant="outline" size="sm" className="h-10 rounded-xl border-rose-500/20 font-bold text-rose-500 bg-card hover:bg-rose-500/5 shadow-sm flex items-center gap-2">
            <RefreshCw size={16} /> Reverse Payment
          </Button>
          <Button onClick={() => toast.success('Case Escalated', { description: 'A compliance officer will review this transaction shortly' })} size="sm" className="h-10 rounded-xl bg-primary hover:bg-primary/90 text-white px-6 font-bold shadow-lg shadow-blue-500/10 flex items-center gap-2 border-none">
            <ShieldAlert size={16} /> Escalate
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: PRIMARY TRANSACTION DATA */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Main Transaction Summary */}
          <div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border bg-background">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Transaction Amount</p>
                  <h3 className="text-3xl font-black text-foreground tracking-tighter">{formatCurrency(txn.amount)}</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Processing Fee</p>
                  <h3 className="text-xl font-black text-muted-foreground tracking-tighter">{formatCurrency(txn.fee)}</h3>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Impact</p>
                  <h3 className="text-xl font-black text-foreground tracking-tighter">{formatCurrency(txn.total)}</h3>
                </div>
              </div>
            </div>

            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-10">
              {/* Sender Details */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-primary rounded-full" /> Sender Information
                </h4>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-sm border border-primary/20">
                    NO
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-foreground mb-0.5">{txn.sender.name}</p>
                    <p className="text-[12px] font-bold text-muted-foreground">{txn.sender.email}</p>
                    <p className="text-[12px] font-bold text-muted-foreground">{txn.sender.phone}</p>
                    <button 
                      onClick={() => router.push(`/users/${txn.sender.id}`)}
                      className="mt-3 text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1"
                    >
                      View Customer Profile <ExternalLink size={10} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Receiver Details */}
              <div className="space-y-6">
                <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Beneficiary Details
                </h4>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-black text-sm border border-emerald-500/20">
                    ZB
                  </div>
                  <div>
                    <p className="text-[15px] font-black text-foreground mb-0.5">{txn.receiver.name}</p>
                    <p className="text-[12px] font-bold text-muted-foreground">Account: {txn.receiver.account}</p>
                    <p className="text-[12px] font-bold text-muted-foreground">Branch: {txn.receiver.branch}</p>
                    <div className="mt-3 inline-flex items-center gap-1.5 px-2 py-0.5 bg-emerald-500/10 text-emerald-500 rounded-lg text-[9px] font-black uppercase tracking-widest">
                      <ShieldCheck size={10} /> Verified Destination
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction Metadata & Device Logs */}
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-2">
              <Fingerprint size={18} className="text-primary" />
              Technical & Device Context
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'IP Address', value: txn.metadata.ip, icon: Globe },
                { label: 'Geolocation', value: txn.metadata.location, icon: MapPin },
                { label: 'Device ID', value: txn.metadata.device, icon: Smartphone },
                { label: 'Operating System', value: txn.metadata.os, icon: Activity },
                { label: 'App Version', value: txn.metadata.browser, icon: Info },
                { label: 'Gateway Channel', value: txn.metadata.channel, icon: Network },
              ].map((m, i) => (
                <div key={i} className="space-y-1 group">
                  <div className="flex items-center gap-2 text-muted-foreground mb-1">
                    <m.icon size={12} />
                    <p className="text-[9px] font-black uppercase tracking-widest">{m.label}</p>
                  </div>
                  <p className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{m.value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Timeline */}
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-8 flex items-center gap-2">
              <History size={18} className="text-primary" />
              Processing Lifecycle
            </h3>
            <div className="space-y-8">
              {timeline.length > 0 ? timeline.map((step, i) => (
                <div key={step.id} className="relative flex gap-6">
                  {i !== timeline.length - 1 && (
                    <div className="absolute left-[11px] top-6 w-[2px] h-[calc(100%+32px)] bg-border" />
                  )}
                  <div className={cn("w-6 h-6 rounded-full shrink-0 flex items-center justify-center z-10", step.status === 'done' ? 'bg-emerald-500 text-white' : 'bg-border text-muted-foreground')}>
                    {step.status === 'done' ? <CheckCircle2 size={14} /> : <Clock size={14} />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-[13px] font-black text-foreground">{step.title}</p>
                    <p className="text-[11px] font-bold text-muted-foreground">{step.time}</p>
                    <p className="text-[11px] font-medium text-muted-foreground italic mt-1">{step.desc}</p>
                  </div>
                </div>
              )) : (
                <div className="p-8 border-2 border-dashed border-border/20 rounded-[24px] text-center">
                   <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">No processing lifecycle events recorded.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: RISK & OPERATIONS */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Risk Score Panel */}
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-md relative overflow-hidden group">
            <div className="absolute -right-4 -bottom-4 opacity-10 group-hover:opacity-20 transition-opacity">
              <ShieldAlert size={120} className="text-muted-foreground/20" />
            </div>
            <div className="flex items-center justify-between mb-8">
              <h4 className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Risk Analysis Engine</h4>
              <BadgeCheck size={20} className="text-emerald-500" />
            </div>
            
            <div className="space-y-8 relative z-10">
              <div className="text-center py-4">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-2">Confidence Score</p>
                <div className="text-5xl font-black text-foreground tracking-tighter">--</div>
                <p className="text-[11px] font-bold text-emerald-500 dark:text-emerald-400 mt-2">Nominal / Low Risk</p>
              </div>

              <div className="space-y-4">
                {[
                  { label: 'Device Reputation', status: '--', color: 'text-muted-foreground' },
                  { label: 'IP Proxy Check', status: '--', color: 'text-muted-foreground' },
                  { label: 'Velocity Check', status: '--', color: 'text-muted-foreground' },
                  { label: 'AML Screening', status: '--', color: 'text-muted-foreground' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-muted-foreground">{r.label}</span>
                    <span className={cn("font-black uppercase tracking-widest", r.color)}>{r.status}</span>
                  </div>
                ))}
              </div>
              
              <button 
                onClick={() => toast("Coming Soon", { description: 'Forensic Investigation feature is being finalized.' })}
                className="w-full py-3.5 bg-primary hover:bg-primary/90 text-white rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-lg shadow-primary/20"
              >
                View Full Forensic Report
              </button>
            </div>
          </div>

          {/* Quick Support / Action */}
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm space-y-8">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operational Actions</h4>
            
            <div className="space-y-2">
              <button onClick={() => toast.success('Re-try Attempted', { description: 'Gateway response pending' })} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-secondary group transition-all text-muted-foreground hover:text-foreground">
                <div className="flex items-center gap-3">
                  <Zap size={16} className="text-muted-foreground group-hover:text-primary" />
                  <span className="text-[12px] font-black uppercase tracking-widest">Manual Re-try</span>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
              <button onClick={() => toast("Coming Soon", { description: 'Support Ticketing feature is being finalized.' })} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-secondary group transition-all text-muted-foreground hover:text-foreground">
                <div className="flex items-center gap-3">
                  <AlertCircle size={16} className="text-muted-foreground group-hover:text-amber-500" />
                  <span className="text-[12px] font-black uppercase tracking-widest">Open Support Ticket</span>
                </div>
                <ChevronRight size={14} className="text-muted-foreground" />
              </button>
              <button onClick={() => toast.error('Beneficiary Blocked', { description: 'Address has been added to restricted list.' })} className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-500/10 group transition-all text-rose-500">
                <div className="flex items-center gap-3">
                  <Ban size={16} className="text-rose-500/50 group-hover:text-rose-500" />
                  <span className="text-[12px] font-black uppercase tracking-widest">Block Beneficiary</span>
                </div>
                <ChevronRight size={14} className="text-rose-500/50" />
              </button>
            </div>
          </div>

          {/* Internal Memo */}
          <div className="bg-card border border-border rounded-[32px] p-8 shadow-sm">
            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Compliance Notes</h4>
            <div className="p-4 border-2 border-dashed border-border/20 rounded-2xl text-center">
              <p className="text-[12px] font-medium text-muted-foreground leading-relaxed italic">
                No internal compliance notes have been recorded for this transaction.
              </p>
            </div>
            <button 
              onClick={() => toast("Coming Soon", { description: 'Compliance Memos feature is being finalized.' })}
              className="w-full mt-4 py-2 text-[10px] font-black text-primary uppercase tracking-widest hover:underline text-left"
            >
              Add New Note +
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
