'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, BadgeCheck, ShieldCheck, Mail, Phone, MapPin, 
  Calendar, CreditCard, PiggyBank, TrendingUp, History, 
  Smartphone, ShieldAlert, AlertCircle, Ban, Lock, 
  ExternalLink, MoreVertical, Download, CheckCircle2,
  Clock, Activity, Globe, MessageSquare, FileText,
  UserCheck, UserMinus, Zap, Wallet, BarChart3, 
  ChevronRight, RefreshCw, Layers, Send, Bell, 
  Tag, Flag, Info, Trash2, Search, Filter, 
  ArrowRight, Shield, Key, FileDown, Printer, Share2, 
  Loader2, X, Check, LockKeyhole, Eye, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { exportUserStatement } from '@/lib/exportUserStatement';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

// 1. TABS CONFIG
const tabs = [
  { id: 'overview', label: 'Overview', icon: Activity },
  { id: 'financials', label: 'Financials', icon: Wallet },
  { id: 'communication', label: 'Communication', icon: MessageSquare },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  { id: 'activity', label: 'Activity Logs', icon: History },
];

export default function UserProfilePage() {
  const params = useParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('overview');
  const [messageMethod, setMessageMethod] = useState('In-App');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  
  // Export States
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportStep, setExportStep] = useState('select'); 
  const [isGenerating, setIsGenerating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [reportType, setReportType] = useState('Account Summary');

  // MOCK USER DATA
  const user = {
    id: params.id,
    name: 'Ngozi Okonjo',
    email: 'ngozi@example.com',
    phone: '+234 801 234 5678',
    avatar: 'NO',
    status: 'Active',
    kycStatus: 'Verified',
    riskScore: 0.12,
    riskLevel: 'Low',
    dateJoined: 'Nov 12, 2023',
    lastSeen: '2 mins ago',
    address: '14, Admiralty Way, Lekki Phase 1, Lagos',
    totalBalance: 5240500,
    savings: 2840000,
    investments: 2400500,
    kycTier: 'Tier 3 (Unrestricted)',
    bvn: '222****4444',
    nin: '102****9932',
  };

  const reportOptions = [
    { id: 'summary', title: 'Account Summary', icon: Wallet, desc: 'Full profile data, balances, and security status overview.' },
    { id: 'transactions', title: 'Transaction History', icon: History, desc: 'Detailed ledger of all credits, debits, and transfers.' },
    { id: 'compliance', title: 'Compliance Audit', icon: ShieldCheck, desc: 'KYC documents, verification logs, and tier history.' },
    { id: 'risk', title: 'Risk Investigation', icon: ShieldAlert, desc: 'Fraud flags, IP history, and suspicious behavior reports.' },
  ];

  const templates = [
    { label: 'KYC Document Request', subject: 'Document Verification Required', body: 'Dear user, we noticed your KYC documents have expired or are blurry. Please upload a clear copy of your NIN/BVN in the app.' },
    { label: 'Suspicious Activity Warning', subject: 'Security Alert: Unusual Activity', body: 'We detected a login attempt from an unknown device. If this was not you, please lock your account immediately.' },
    { label: 'System Maintenance', subject: 'Scheduled Maintenance Notice', body: 'Our banking services will be temporarily unavailable on Sunday between 2AM and 4AM for scheduled upgrades.' },
    { label: 'Account Tier Upgrade', subject: 'Congratulations! Level Up', body: 'Based on your transaction volume, you are now eligible for a Tier 3 account upgrade. Follow the link to verify.' },
  ];

  const communicationHistory = [
    { id: 1, type: 'Email', subject: 'Monthly Statement - April 2024', status: 'Delivered', time: '2 days ago', admin: 'Mick J.' },
    { id: 2, type: 'In-App', subject: 'Investment Matured', status: 'Read', time: '5 days ago', admin: 'Automated' },
    { id: 3, type: 'SMS', subject: 'OTP Verification', status: 'Failed', time: '1 week ago', admin: 'System' },
  ];

  const adminNotes = [
    { id: 1, text: 'User triggered 3 failed transfers within 20 mins. Risk scoring slightly elevated. Monitoring behavioral pulse.', time: '2h ago', admin: 'Sarah K.' },
    { id: 2, text: 'Verified address proofing via physical document upload. Matching Lekki geo-tag.', time: '3 days ago', admin: 'David O.' },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦');
  };

  const handleGenerateReport = () => {
    setIsGenerating(true);
    setTimeout(() => {
      setIsGenerating(false);
      setExportStep('preview');
      toast.success("Banking report generated successfully");
    }, 2000);
  };

  const handleDownloadStatement = async () => {
    setIsExporting(true);
    try {
      await exportUserStatement(user);
      toast.success("Financial statement downloaded");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF");
    } finally {
      setIsExporting(false);
    }
  };


  return (
    <div className="max-w-[1600px] mx-auto space-y-4 animate-in fade-in duration-700 pb-20">
      <Breadcrumbs />
      
      {/* EXPORT MODAL OVERLAY */}
      <AnimatePresence>
        {showExportModal && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
              onClick={() => setShowExportModal(false)}
            >
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-card border border-border/50 w-full max-w-4xl max-h-[90vh] rounded-[40px] shadow-2xl overflow-hidden flex flex-col"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-8 border-b border-border/10 flex items-center justify-between bg-secondary/5">
                   <div className="flex items-center gap-4">
                      <div className="size-12 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary">
                         <FileText size={24} />
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-foreground tracking-tight">OINZpay Report Engine</h3>
                         <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Exporting data for USR-002291</p>
                      </div>
                   </div>
                   <button 
                    onClick={() => setShowExportModal(false)}
                    className="size-10 bg-muted/50 border border-border/40 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground transition-all"
                   >
                     <X size={20} />
                   </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar">
                   {exportStep === 'select' && (
                     <div className="p-10 space-y-10">
                        <div className="text-center space-y-2">
                           <h4 className="text-lg font-black text-foreground uppercase tracking-widest">Select Report Type</h4>
                           <p className="text-muted-foreground font-medium">Choose the specific dataset you wish to generate for this account.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           {reportOptions.map((opt) => (
                             <button 
                                key={opt.id}
                                onClick={() => { setReportType(opt.title); setExportStep('filter'); }}
                                className={cn(
                                  "p-6 text-left rounded-[32px] border transition-all group flex items-start gap-5",
                                  reportType === opt.title ? "bg-primary/5 border-primary/40 shadow-lg shadow-primary/5" : "bg-secondary/30 border-border/40 hover:bg-secondary/50"
                                )}
                             >
                                <div className={cn(
                                  "size-14 rounded-2xl border flex items-center justify-center shrink-0 transition-all",
                                  reportType === opt.title ? "bg-primary text-white shadow-xl shadow-primary/20" : "bg-background border-border/40 text-muted-foreground group-hover:text-primary"
                                )}>
                                   <opt.icon size={24} />
                                </div>
                                <div className="space-y-1">
                                   <h5 className="text-[15px] font-black text-foreground uppercase tracking-widest">{opt.title}</h5>
                                   <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">{opt.desc}</p>
                                </div>
                             </button>
                           ))}
                        </div>
                     </div>
                   )}

                   {exportStep === 'filter' && (
                     <div className="p-10 space-y-10">
                        <div className="flex items-center gap-4">
                           <button onClick={() => setExportStep('select')} className="text-[11px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                              <ArrowLeft size={14} /> Back to Types
                           </button>
                        </div>
                        <div className="space-y-8">
                           <div className="grid grid-cols-2 gap-8">
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Date Range</label>
                                 <select className="w-full h-14 bg-muted/50 border border-border/40 rounded-2xl px-5 text-[14px] font-bold outline-none focus:border-primary/40">
                                    <option>Last 30 Days</option>
                                    <option>Last 90 Days</option>
                                    <option>Year to Date</option>
                                    <option>Custom Range</option>
                                 </select>
                              </div>
                              <div className="space-y-3">
                                 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Export Format</label>
                                 <div className="flex gap-3">
                                    {['PDF Document', 'CSV Sheet', 'JSON Feed'].map((f) => (
                                      <button key={f} className="flex-1 h-14 bg-muted/50 border border-border/40 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-primary/40 transition-all">
                                         {f}
                                      </button>
                                    ))}
                                 </div>
                              </div>
                           </div>
                           <div className="bg-secondary/20 border border-border/10 rounded-3xl p-8 space-y-6">
                              <h5 className="text-[11px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                                 <ShieldCheck size={16} className="text-primary" />
                                 Compliance & Security Headers
                              </h5>
                              <div className="grid grid-cols-2 gap-4">
                                 {[
                                   { label: 'Add Confidentially Watermark', enabled: true },
                                   { label: 'Include Admin Digital Signature', enabled: true },
                                   { label: 'Export IP & Device Metadata', enabled: false },
                                   { label: 'Protect with Account Password', enabled: false },
                                 ].map((check, i) => (
                                   <div key={i} className="flex items-center justify-between p-3 bg-background border border-border/40 rounded-xl">
                                      <span className="text-[11px] font-bold text-muted-foreground">{check.label}</span>
                                      <div className={cn("size-5 rounded border flex items-center justify-center", check.enabled ? "bg-primary border-primary text-white" : "border-border/40")}>
                                         {check.enabled && <Check size={12} />}
                                      </div>
                                   </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                        <div className="flex justify-end">
                           <Button onClick={handleGenerateReport} disabled={isGenerating} className="h-14 px-10 rounded-2xl bg-primary text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 flex items-center gap-3">
                              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <RefreshCw size={18} />}
                              {isGenerating ? "Building Report..." : "Generate Professional Document"}
                           </Button>
                        </div>
                     </div>
                   )}

                   {exportStep === 'preview' && (
                     <div className="p-10 space-y-10">
                        <div className="bg-white text-slate-900 border border-slate-200 rounded-lg shadow-2xl p-12 min-h-[800px] font-serif relative overflow-hidden">
                           <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] rotate-[-45deg]">
                              <p className="text-[120px] font-black uppercase">OINZpay Confidential</p>
                           </div>
                           <div className="flex justify-between items-start border-b-2 border-slate-900 pb-8 mb-8 relative z-10">
                              <div className="space-y-2">
                                 <h2 className="text-3xl font-black uppercase tracking-tighter">OINZpay</h2>
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Official Banking Intelligence Report</p>
                              </div>
                              <div className="text-right space-y-1">
                                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Report Reference</p>
                                 <p className="text-[14px] font-bold">OP-AUDIT-2291-0524</p>
                                 <p className="text-[9px] font-medium text-slate-400">Generated: May 11, 2024 • 09:44 AM</p>
                              </div>
                           </div>
                           <div className="grid grid-cols-2 gap-12 mb-12 relative z-10 font-sans text-slate-900">
                              <div className="space-y-6">
                                 <h6 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-slate-100 pb-2">Customer Details</h6>
                                 <div className="space-y-3">
                                    <div className="flex justify-between text-[12px]"><span className="text-slate-400">Full Name:</span> <span className="font-bold">{user.name}</span></div>
                                    <div className="flex justify-between text-[12px]"><span className="text-slate-400">Customer ID:</span> <span className="font-bold">USR-002291</span></div>
                                    <div className="flex justify-between text-[12px]"><span className="text-slate-400">KYC Status:</span> <span className="font-bold text-emerald-600">Tier 3 Verified</span></div>
                                    <div className="flex justify-between text-[12px]"><span className="text-slate-400">Risk Assessment:</span> <span className="font-bold text-blue-600">Low (0.12)</span></div>
                                 </div>
                              </div>
                              <div className="space-y-6">
                                 <h6 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-slate-100 pb-2">Financial Snapshot</h6>
                                 <div className="space-y-3">
                                    <div className="flex justify-between text-[12px]"><span className="text-slate-400">Available Balance:</span> <span className="font-black">{formatCurrency(user.totalBalance)}</span></div>
                                    <div className="flex justify-between text-[12px]"><span className="text-slate-400">Investment Pool:</span> <span className="font-black">{formatCurrency(user.investments)}</span></div>
                                    <div className="flex justify-between text-[12px]"><span className="text-slate-400">YTD Volume:</span> <span className="font-black">₦12,400,000</span></div>
                                    <div className="flex justify-between text-[12px]"><span className="text-slate-400">Trust Score:</span> <span className="font-bold text-emerald-600">High (98%)</span></div>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-4 relative z-10 font-sans">
                              <h6 className="text-[10px] font-black uppercase tracking-widest text-primary border-b border-slate-100 pb-2">Recent Ledger Activity</h6>
                              <table className="w-full text-left text-[11px] text-slate-900">
                                 <thead>
                                    <tr className="border-b border-slate-900 bg-slate-50">
                                       <th className="py-3 px-2 font-black uppercase tracking-widest">Date</th>
                                       <th className="py-3 px-2 font-black uppercase tracking-widest">Reference</th>
                                       <th className="py-3 px-2 font-black uppercase tracking-widest">Description</th>
                                       <th className="py-3 px-2 font-black uppercase tracking-widest text-right">Amount</th>
                                       <th className="py-3 px-2 font-black uppercase tracking-widest text-right">Status</th>
                                    </tr>
                                 </thead>
                                 <tbody className="divide-y divide-slate-100">
                                    {[
                                       { d: 'May 10, 2024', r: 'TRX-9921-A', m: 'Agric Plan Maturity', a: '₦1,204,000', s: 'Settled' },
                                       { d: 'May 09, 2024', r: 'TRX-8812-B', m: 'Withdrawal: ZENITH', a: '-₦100,000', s: 'Success' },
                                       { d: 'May 08, 2024', r: 'TRX-4421-C', m: 'Airtime: 08012345678', a: '-₦2,500', s: 'Success' },
                                       { d: 'May 07, 2024', r: 'TRX-1123-D', m: 'Wallet Fund: PAYSTACK', a: '₦50,000', s: 'Success' },
                                    ].map((row, i) => (
                                       <tr key={i}>
                                          <td className="py-4 px-2 font-medium">{row.d}</td>
                                          <td className="py-4 px-2 font-mono text-[9px] text-slate-500">{row.r}</td>
                                          <td className="py-4 px-2 font-bold">{row.m}</td>
                                          <td className="py-4 px-2 text-right font-black">{row.a}</td>
                                          <td className="py-4 px-2 text-right font-bold text-emerald-600">{row.s}</td>
                                       </tr>
                                    ))}
                                 </tbody>
                              </table>
                           </div>
                           <div className="mt-20 border-t border-slate-100 pt-8 flex justify-between items-end relative z-10 font-sans text-slate-400">
                              <div className="space-y-4">
                                 <div className="size-24 bg-slate-50 border-2 border-slate-200 rounded flex items-center justify-center relative">
                                    <p className="text-[10px] font-black uppercase opacity-20 rotate-[-15deg]">Digital Stamp</p>
                                 </div>
                                 <p className="text-[9px] max-w-xs leading-relaxed italic">
                                    Digitally signed by OINZpay Compliance Engine. Confidentiality Tier 4.
                                 </p>
                              </div>
                              <div className="text-right">
                                 <p className="text-[10px] font-black uppercase">Page 1 of 1</p>
                              </div>
                           </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-4">
                           <Button 
                             onClick={handleDownloadStatement}
                             disabled={isExporting}
                             className="h-14 px-10 rounded-2xl bg-slate-900 text-white font-black uppercase text-[11px] tracking-widest flex items-center gap-3"
                           >
                              {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                              {isExporting ? "Exporting..." : "Download PDF"}
                           </Button>
                           <Button className="h-14 px-10 rounded-2xl bg-emerald-600 text-white font-black uppercase text-[11px] tracking-widest flex items-center gap-3">
                              <FileDown size={18} /> Export CSV
                           </Button>
                           <Button variant="outline" className="h-14 px-10 rounded-2xl border-border/40 font-black uppercase text-[11px] tracking-widest flex items-center gap-3">
                              <Printer size={18} /> Print
                           </Button>
                        </div>
                     </div>
                   )}
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* PROFILE HEADER */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button onClick={() => router.back()} className="p-3 bg-card border border-border/50 rounded-2xl text-muted-foreground hover:text-primary hover:bg-secondary transition-all">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-primary to-blue-700 text-white flex items-center justify-center text-2xl font-black shadow-xl shadow-primary/20 border-4 border-card relative">
               {user.avatar}
               <div className="absolute -bottom-1 -right-1 size-5 bg-emerald-500 rounded-full border-4 border-card shadow-lg" />
            </div>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-black text-foreground tracking-tight">{user.name}</h1>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-md text-[10px] font-black uppercase tracking-widest">
                   {user.kycTier}
                </div>
              </div>
              <div className="flex items-center gap-4 text-muted-foreground text-xs font-bold">
                <span className="flex items-center gap-1.5"><Smartphone size={14} /> iPhone 15 Pro • Lagos, NG</span>
                <span className="opacity-30">•</span>
                <span>USR-002291</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-card/50 p-2 rounded-[24px] border border-border/40 shadow-sm">
          <Button 
            onClick={handleDownloadStatement}
            disabled={isExporting}
            variant="ghost" 
            size="sm" 
            className="h-10 rounded-xl font-bold text-muted-foreground hover:bg-secondary flex items-center gap-2"
          >
            {isExporting ? <Loader2 size={16} className="animate-spin" /> : <FileDown size={16} className="text-primary" />}
            {isExporting ? "Generating..." : "Export PDF"}
          </Button>
          <Button variant="ghost" size="sm" className="h-10 rounded-xl font-bold text-muted-foreground hover:bg-secondary flex items-center gap-2" onClick={() => setActiveTab('communication')}>
            <MessageSquare size={16} /> Contact User
          </Button>
          <div className="w-px h-6 bg-border mx-2" />
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => toast.success('Account termination initiated', { description: 'Please follow system prompts to finalize.' })}
            className="h-10 rounded-xl border-rose-500/20 font-bold text-rose-500 bg-rose-500/5 hover:bg-rose-500/10 flex items-center gap-2"
          >
            <Ban size={16} /> Terminate
          </Button>
        </div>
      </div>

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-1 bg-muted/50 p-1.5 rounded-2xl border border-border/40 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
              activeTab === tab.id ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon size={14} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-8">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div key="overview" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Total Balance', val: user.totalBalance, icon: Wallet, color: 'primary' },
                    { label: 'Total Savings', val: user.savings, icon: PiggyBank, color: 'emerald-500' },
                    { label: 'Investments', val: user.investments, icon: TrendingUp, color: 'purple-500' },
                  ].map((stat, i) => (
                    <div key={i} className="bg-card border border-border/40 p-6 rounded-[28px] shadow-sm relative overflow-hidden group">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2">{stat.label}</p>
                      <h3 className="text-2xl font-black text-foreground tracking-tight mb-4">{formatCurrency(stat.val)}</h3>
                      <div className="flex items-center justify-between pt-4 border-t border-border/40">
                         <span className="text-[9px] font-bold text-muted-foreground uppercase">Real-time valuation</span>
                         <stat.icon size={14} className={cn(`text-${stat.color}`)} />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-card border border-border/40 rounded-[32px] p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                      <ShieldCheck size={18} className="text-primary" />
                      Core Identity Data
                    </h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Full Legal Name</p>
                      <p className="text-[15px] font-bold text-foreground">{user.name}</p>
                    </div>
                    <div className="space-y-1.5">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest opacity-60">Primary Email</p>
                      <p className="text-[15px] font-bold text-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'communication' && (
              <motion.div key="communication" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="bg-card border border-border/40 rounded-[32px] overflow-hidden shadow-lg border-primary/10">
                   <div className="p-8 border-b border-border/40 flex items-center justify-between bg-primary/5">
                      <div>
                        <h3 className="text-[15px] font-black text-foreground uppercase tracking-widest flex items-center gap-2">
                           <MessageSquare size={18} className="text-primary" />
                           Communication Console
                        </h3>
                      </div>
                      <div className="flex gap-2">
                         {['In-App', 'Email', 'SMS'].map((m) => (
                           <button key={m} onClick={() => setMessageMethod(m)} className={cn("px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest", messageMethod === m ? "bg-primary text-white" : "bg-muted/50 text-muted-foreground")}>{m}</button>
                         ))}
                      </div>
                   </div>
                   <div className="p-8 space-y-6">
                      <textarea value={selectedTemplate} onChange={(e) => setSelectedTemplate(e.target.value)} rows={6} placeholder="Type your message..." className="w-full bg-muted/50 border border-border/40 rounded-[20px] p-5 text-[14px] outline-none" />
                      <div className="flex justify-end">
                         <Button 
                            onClick={() => {
                               if (!selectedTemplate.trim()) {
                                  toast.error("Message body cannot be empty");
                                  return;
                               }
                               toast.success(`Message sent via ${messageMethod}`, { description: "User will receive a notification shortly" });
                               setSelectedTemplate("");
                            }}
                            className="h-12 px-8 rounded-2xl bg-primary text-white font-black uppercase text-[11px] tracking-widest flex items-center gap-3"
                          >
                            <Send size={16} /> Send Message
                         </Button>
                      </div>
                   </div>
                </div>

                <div className="bg-card border border-border/40 rounded-[32px] p-8 shadow-sm">
                   <h3 className="text-sm font-black text-foreground uppercase tracking-widest flex items-center gap-2 mb-8">
                      <FileText size={18} className="text-amber-500" />
                      Internal Audit Notes
                   </h3>
                   <div className="space-y-4">
                      {adminNotes.map((note) => (
                        <div key={note.id} className="p-5 bg-secondary/20 border border-border/10 rounded-[24px] space-y-2">
                           <div className="flex justify-between items-center">
                              <p className="text-[12px] font-black text-foreground">{note.admin}</p>
                              <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">{note.time}</p>
                           </div>
                           <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">{note.text}</p>
                        </div>
                      ))}
                   </div>
                </div>
              </motion.div>
            )}

            {activeTab !== 'overview' && activeTab !== 'communication' && (
              <motion.div key="placeholder" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-card border border-border/40 rounded-[32px] p-24 text-center">
                <div className="w-20 h-20 bg-muted/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Layers size={32} className="text-primary/20" />
                </div>
                <h3 className="text-lg font-black text-foreground tracking-tight">{tabs.find(t => t.id === activeTab)?.label} Data</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2">Accessing secure banking records for {user.name}.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card border border-border/40 rounded-[32px] p-8 shadow-md border-primary/10">
             <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2 mb-6">
                <FileText size={14} className="text-primary" />
                Reporting Hub
             </h4>
             <div className="space-y-3">
                <button 
                  onClick={handleDownloadStatement}
                  disabled={isExporting}
                  className="w-full flex items-center justify-between p-4 bg-secondary/50 border border-border/40 rounded-2xl hover:bg-secondary transition-all group disabled:opacity-50"
                >
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-background border border-border/40 rounded-xl text-primary">
                        {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Wallet size={16} />}
                      </div>
                      <span className="text-[12px] font-black text-foreground">
                        {isExporting ? "Processing..." : "Statement"}
                      </span>
                   </div>
                   <Download size={14} />
                </button>
                <button onClick={() => { setShowExportModal(true); setReportType('Compliance Audit'); setExportStep('select'); }} className="w-full flex items-center justify-between p-4 bg-secondary/50 border border-border/40 rounded-2xl hover:bg-secondary transition-all group">
                   <div className="flex items-center gap-3">
                      <div className="p-2 bg-background border border-border/40 rounded-xl text-emerald-500"><ShieldCheck size={16} /></div>
                      <span className="text-[12px] font-black text-foreground">Audit</span>
                   </div>
                   <FileDown size={14} />
                </button>
             </div>
          </div>

          <div className="bg-card border border-border/40 rounded-[32px] p-8 shadow-sm space-y-6">
             <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] flex items-center gap-2">
                <Zap size={14} className="text-primary" />
                Controls
             </h4>
             <div className="grid grid-cols-2 gap-3">
               {[
                  { label: 'Freeze', icon: Ban, color: 'text-rose-500 bg-rose-500/5 border-rose-500/10', action: () => toast.error('Freeze User initiated') },
                  { label: 'Verify', icon: UserCheck, color: 'text-emerald-500 bg-emerald-500/5 border-emerald-500/10', action: () => toast.success('Verification Successful') },
                  { label: 'Reset', icon: Key, color: 'text-amber-500 bg-amber-500/5 border-amber-500/10', action: () => toast.warning('Reset Credentials initiated') },
                  { label: 'Flag', icon: Flag, color: 'text-primary bg-primary/5 border-primary/10', action: () => toast.success('User Flagged for Review') },
               ].map((act, i) => (
                 <button 
                  key={i} 
                  onClick={act.action}
                  className={cn("p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all hover:scale-105 active:scale-95", act.color)}
                 >
                    <act.icon size={18} />
                    <span className="text-[10px] font-black uppercase tracking-tight">{act.label}</span>
                 </button>
               ))}
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
