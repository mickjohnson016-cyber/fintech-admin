'use client';

import React, { useState } from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import {
  ShieldCheck,
  ShieldAlert,
  Users,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  TrendingUp,
  Activity,
  AlertTriangle,
  Fingerprint,
  FileText,
  Scale,
  Ban,
  Eye,
  ArrowUpRight,
  MapPin,
  Smartphone,
  History,
  X,
  Zap,
  Filter,
  Download,
  AlertCircle,
  MoreVertical,
  Flag,
  UserCheck,
  UserX,
  Lock,
  ExternalLink,
  Info,
  Loader2,
  Layers
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { executeExport } from '@/lib/exportUtils';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

// --- MOCK DATA ---

const complianceStats = [
  { label: "Flagged Accounts", value: "142", trend: "+12.5%", status: "critical", icon: ShieldAlert },
  { label: "Pending KYC", value: "2,845", trend: "-5.2%", status: "active", icon: Users },
  { label: "Fraud Alerts", value: "24", trend: "Steady", status: "warning", icon: AlertTriangle },
  { label: "Blocked IP Range", value: "18", trend: "+2", status: "active", icon: Zap },
];

const kycQueue = [
  { id: "KYC-0091", name: "Ahmed Musa", level: "Tier 3", docs: "NIN, Utility", time: "2m ago", score: 12, status: "Pending", initials: "AM" },
  { id: "KYC-0082", name: "Blessing Okon", level: "Tier 2", docs: "Passport", time: "14m ago", score: 45, status: "Flagged", initials: "BO" },
  { id: "KYC-0075", name: "David Olatunji", level: "Tier 3", docs: "BVN, License", time: "1h ago", score: 8, status: "Pending", initials: "DO" },
  { id: "KYC-0064", name: "Jessica Smith", level: "Tier 1", docs: "BVN", time: "4h ago", score: 92, status: "Critical", initials: "JS" },
];

const fraudFeed = [
  { type: "Velocity Spike", user: "USR-9921", amount: "₦2.4M", severity: "High", time: "Just now", desc: "Multiple transfers to new beneficiaries within 10 mins." },
  { type: "Location Mismatch", user: "USR-1120", amount: "₦15,000", severity: "Med", time: "5m ago", desc: "Login from Lagos, Transaction initiated from London VPN." },
  { type: "Device Collision", user: "USR-4402", amount: "N/A", severity: "Low", time: "12m ago", desc: "Account accessed from device linked to 3 other banned accounts." },
];

const amlAlerts = [
  { title: "Layering Detection", score: 88, accounts: 4, volume: "₦12.5M", status: "Active Investigation" },
  { title: "Structured Deposits", score: 72, accounts: 1, volume: "₦4.8M", status: "Manual Review" },
];

const auditLogs = [
  { admin: "Mick Jagger", action: "Revoked Global Freeze", target: "Platform", time: "2m ago", ip: "192.168.1.1" },
  { admin: "Sarah Kong", action: "Approved KYC Tier 3", target: "USR-8821", time: "15m ago", ip: "192.168.1.42" },
  { admin: "System", action: "Auto-Flagged Transaction", target: "TXN-9902", time: "1h ago", ip: "Internal" },
];

export default function ComplianceOperations() {
  const [selectedCase, setSelectedCase] = useState<any>(null);
  const [activeQueueTab, setActiveQueueTab] = useState("all");
  const [isClusterDrawerOpen, setIsClusterDrawerOpen] = useState(false);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <div className="space-y-6 pb-20">
      <Breadcrumbs />
      <SettingsHeader 
        title="Compliance & Fraud Ops" 
        description="Enterprise Risk Management system. Monitor AML/KYC flows, investigate fraud markers, and govern platform integrity."
      />

      {/* 1. STATS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {complianceStats.map((stat, i) => (
          <div key={i} className="bg-card border border-border/40 rounded-[32px] p-6 relative overflow-hidden group hover:bg-secondary/20 transition-all">
            <div className="flex justify-between items-start mb-5 relative z-10">
              <div className={cn(
                "p-4 rounded-2xl",
                stat.status === "critical" ? "bg-red-500/10 text-red-500" : stat.status === "warning" ? "bg-amber-500/10 text-amber-500" : "bg-primary/10 text-primary"
              )}>
                <stat.icon size={22} />
              </div>
              <span className={cn(
                "text-[10px] font-black px-2 py-1 rounded-lg uppercase tracking-tighter",
                stat.trend.startsWith('+') ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
              )}>
                {stat.trend}
              </span>
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">{stat.label}</p>
              <h3 className="text-3xl font-black text-foreground tracking-tight">{stat.value}</h3>
            </div>
            <div className={cn(
              "absolute -bottom-1 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-all",
              stat.status === "critical" ? "bg-red-500 shadow-[0_0_15px_#EF4444]" : "bg-primary shadow-[0_0_15px_#3B82F6]"
            )} />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* 2. KYC REVIEW QUEUE */}
        <div className="xl:col-span-2 space-y-8">
          <div className="bg-card border border-border/40 rounded-[32px] overflow-hidden shadow-sm">
            <div className="p-8 border-b border-border/10 bg-secondary/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <h3 className="text-[15px] font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Fingerprint size={18} className="text-primary" />
                  KYC Verification Queue
                </h3>
                <p className="text-[11px] font-medium text-muted-foreground mt-1">Manage inbound identity verification requests.</p>
              </div>
              <div className="flex items-center gap-2 bg-muted/50 p-1 rounded-xl border border-border/20">
                {["all", "pending", "flagged", "critical"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveQueueTab(tab)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      activeQueueTab === tab ? "bg-primary text-white shadow-lg" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/10 bg-secondary/5">
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Customer</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Submission</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Risk Score</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Status</th>
                    <th className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {kycQueue.map((item) => (
                    <tr key={item.id} className="group hover:bg-secondary/30 transition-all cursor-pointer" onClick={() => setSelectedCase(item)}>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-xs">
                            {item.initials}
                          </div>
                          <div>
                            <p className="text-[13px] font-black text-foreground">{item.name}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{item.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="space-y-1">
                          <p className="text-[12px] font-bold text-foreground">{item.docs}</p>
                          <p className="text-[10px] text-muted-foreground flex items-center gap-1"><Clock size={10} /> {item.time}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                            <div className={cn(
                              "h-full rounded-full",
                              item.score > 70 ? "bg-red-500" : item.score > 30 ? "bg-amber-500" : "bg-emerald-500"
                            )} style={{ width: `${item.score}%` }} />
                          </div>
                          <span className={cn(
                            "text-[11px] font-black",
                            item.score > 70 ? "text-red-500" : item.score > 30 ? "text-amber-500" : "text-emerald-500"
                          )}>{item.score}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className={cn(
                          "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                          item.status === "Pending" ? "bg-primary/5 text-primary border-primary/10" : item.status === "Flagged" ? "bg-amber-500/5 text-amber-500 border-amber-500/10" : "bg-red-500/5 text-red-500 border-red-500/10"
                        )}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button onClick={(e) => { e.stopPropagation(); toast.success('Approve KYC', { description: 'User KYC has been successfully approved.' }); }} className="p-2 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500 hover:text-white rounded-lg transition-all"><UserCheck size={14} /></button>
                          <button onClick={(e) => { e.stopPropagation(); toast.error('Reject KYC', { description: 'User KYC has been rejected and flagged.' }); }} className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-all"><UserX size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-secondary/5 border-t border-border/10 flex justify-center">
              <Button 
                onClick={() => toast.success('Fetching Records', { description: 'Loading next batch of pending reviews...' })}
                variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary"
              >
                Load Next 20 Pending Reviews
              </Button>
            </div>
          </div>

          {/* 3. LIVE FRAUD FEED */}
          <div className="bg-card border border-border/40 rounded-[32px] p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-[15px] font-black text-foreground uppercase tracking-wider flex items-center gap-2">
                  <Activity size={18} className="text-red-500" />
                  Live Risk Monitoring
                </h3>
                <p className="text-[11px] font-medium text-muted-foreground">Real-time fraud detection engine feed.</p>
              </div>
              <div className="flex items-center gap-1">
                <div className="size-2 bg-red-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Monitoring Active</span>
              </div>
            </div>

            <div className="space-y-4 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border/20">
              {fraudFeed.map((alert, i) => (
                <div key={i} className="flex gap-6 relative z-10 group">
                  <div className={cn(
                    "size-10 rounded-xl flex items-center justify-center border transition-all group-hover:scale-110 shadow-lg",
                    alert.severity === "High" ? "bg-red-500/10 text-red-500 border-red-500/20 shadow-red-500/5" : "bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-amber-500/5"
                  )}>
                    <AlertTriangle size={18} />
                  </div>
                  <div className="flex-1 bg-secondary/20 border border-border/10 rounded-[28px] p-6 hover:bg-secondary/40 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <div className="space-y-1">
                        <h5 className="text-[14px] font-black text-foreground tracking-tight">{alert.type}</h5>
                        <div className="flex items-center gap-3 text-[10px] font-bold text-muted-foreground uppercase">
                          <span className="text-primary">{alert.user}</span>
                          <span className="size-1 bg-muted-foreground/30 rounded-full" />
                          <span>{alert.amount}</span>
                          <span className="size-1 bg-muted-foreground/30 rounded-full" />
                          <span>{alert.time}</span>
                        </div>
                      </div>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white shadow-lg",
                        alert.severity === "High" ? "bg-red-500 shadow-red-500/20" : "bg-amber-500 shadow-amber-500/20"
                      )}>
                        {alert.severity} Risk
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">{alert.desc}</p>
                    <div className="mt-4 flex gap-2">
                      <Button onClick={() => setSelectedCase(kycQueue[0])} size="sm" className="h-8 rounded-lg bg-primary text-white text-[9px] font-black uppercase tracking-widest">Investigate</Button>
                      <Button onClick={() => toast.success('Alert Dismissed', { description: 'Risk marker archived for audit.' })} variant="outline" size="sm" className="h-8 rounded-lg text-[9px] font-black uppercase tracking-widest border-border/40">Dismiss</Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 4. AML & RISK PANELS */}
        <div className="xl:col-span-1 space-y-8">

          {/* AML Panel */}
          <div className="bg-card border border-border/40 rounded-[32px] p-8 space-y-8 shadow-xl shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Scale size={120} className="text-primary" />
            </div>
            <div className="space-y-1 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Intelligence Hub</p>
              <h3 className="text-2xl font-black text-foreground tracking-tighter">AML Monitoring</h3>
            </div>

            <div className="space-y-4 relative z-10">
              {amlAlerts.map((alert, i) => (
                <div key={i} className="p-6 bg-secondary/30 border border-border/20 rounded-[28px] space-y-4 hover:border-primary/40 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h6 className="text-[13px] font-black text-foreground">{alert.title}</h6>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{alert.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black text-foreground">{alert.score}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">Threat Score</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center bg-background/50 p-3 rounded-2xl border border-border/10">
                    <div className="text-center flex-1 border-r border-border/10">
                      <p className="text-[11px] font-black text-foreground">{alert.accounts}</p>
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Nodes</p>
                    </div>
                    <div className="text-center flex-1">
                      <p className="text-[11px] font-black text-foreground">{alert.volume}</p>
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-tighter">Exposure</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setIsAnalyzing(true);
                      setTimeout(() => {
                        setIsAnalyzing(false);
                        setIsClusterDrawerOpen(true);
                        toast.success("Cluster analysis completed", { description: "Deep-scanning associated wallet addresses..." });
                      }, 2000);
                    }} 
                    className="w-full py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
                  >
                    {isAnalyzing ? <Loader2 size={14} className="animate-spin" /> : "Analyze Clusters"}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* 5. AUDIT LOGS */}
          <div className="bg-card border border-border/40 rounded-[32px] p-8 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-[14px] font-black text-foreground uppercase tracking-widest">Ops Audit Trail</h3>
              <button onClick={() => toast.success('Refreshing Logs', { description: 'Syncing latest administrative actions...' })} className="p-2 text-muted-foreground hover:text-primary transition-all"><History size={18} /></button>
            </div>
            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[1px] before:bg-border/20">
              {auditLogs.map((log, i) => (
                <div key={i} className="flex gap-4 relative z-10">
                  <div className="size-6 rounded-full bg-background border border-border flex items-center justify-center -ml-[1px]">
                    <div className="size-1.5 bg-primary rounded-full" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="text-[12px] font-black text-foreground">{log.admin}</p>
                      <span className="text-[9px] font-black text-muted-foreground/40 uppercase">{log.time}</span>
                    </div>
                    <p className="text-[11px] font-medium text-muted-foreground leading-tight">{log.action}</p>
                    <div className="flex items-center gap-1.5 text-[9px] font-bold text-primary/70 uppercase">
                      <ShieldCheck size={10} /> {log.target}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Button 
              onClick={() => setIsAuditModalOpen(true)}
              variant="outline" 
              className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40"
            >
              Full Audit Explorer
            </Button>
          </div>
        </div>
      </div>

      {/* 6. INVESTIGATION WORKSPACE (SLIDE-OVER) */}
      <AnimatePresence>
        {selectedCase && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedCase(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border/50 z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b border-border/20 flex items-start justify-between bg-secondary/10">
                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-[32px] bg-red-500/10 border-2 border-red-500/20 flex items-center justify-center text-red-500 font-black text-3xl shadow-xl shadow-red-500/5">
                    {selectedCase.initials}
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black text-foreground tracking-tighter">{selectedCase.name}</h2>
                      <span className="px-3 py-1 bg-red-500 text-white text-[9px] font-black uppercase rounded-full shadow-lg shadow-red-500/20">Investigation Active</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[13px] font-bold text-muted-foreground uppercase tracking-widest">{selectedCase.id}</p>
                      <span className="size-1 bg-muted-foreground/30 rounded-full" />
                      <p className="text-[13px] font-black text-red-500">Threat Level: High</p>
                    </div>
                  </div>
                </div>
                <button onClick={() => setSelectedCase(null)} className="p-3 bg-secondary/50 hover:bg-secondary border border-border/20 rounded-2xl text-muted-foreground transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-10">
                {/* Section: Risk Summary */}
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { label: "Fraud Score", value: "92/100", icon: AlertTriangle, color: "text-red-500" },
                    { label: "Device Health", value: "Flagged", icon: Smartphone, color: "text-amber-500" },
                    { label: "Sanctions", value: "Clean", icon: ShieldCheck, color: "text-emerald-500" },
                  ].map((metric, i) => (
                    <div key={i} className="p-5 bg-secondary/20 border border-border/10 rounded-3xl space-y-2">
                      <metric.icon size={18} className={metric.color} />
                      <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{metric.label}</p>
                      <p className="text-[15px] font-black text-foreground">{metric.value}</p>
                    </div>
                  ))}
                </div>

                {/* Section: Behavioral Analytics */}
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                    <Activity size={16} className="text-primary" />
                    Behavioral Markers
                  </h4>
                  <div className="p-8 bg-card border border-border/20 rounded-[32px] space-y-6">
                    <div className="flex justify-between items-center">
                      <p className="text-[13px] font-bold text-foreground">Transaction Velocity</p>
                      <span className="text-[11px] font-black text-red-500">EXCEEDED (14/hr)</span>
                    </div>
                    <div className="h-2 w-full bg-muted/30 rounded-full overflow-hidden">
                      <div className="h-full bg-red-500 w-[85%] rounded-full shadow-[0_0_10px_#EF4444]" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 pt-4">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Primary Location</p>
                        <p className="text-[14px] font-black text-foreground">Lagos, Nigeria</p>
                        <p className="text-[11px] text-red-500 font-bold">Inconsistent with VPN Use</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Success Rate</p>
                        <p className="text-[14px] font-black text-foreground">12.4%</p>
                        <p className="text-[11px] text-amber-500 font-bold">High Failure Pattern</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Section: Linked Entities */}
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black uppercase tracking-[0.2em] text-foreground flex items-center gap-2">
                    <ArrowUpRight size={16} className="text-primary" />
                    Associated Nodes
                  </h4>
                  <div className="space-y-3">
                    {[
                      { id: "USR-0042", rel: "Shared Device", score: "High Risk" },
                      { id: "USR-1192", rel: "Common Payee", score: "Med Risk" },
                    ].map((link, i) => (
                      <div key={i} className="p-4 bg-secondary/10 border border-border/10 rounded-2xl flex items-center justify-between group hover:bg-secondary/20 transition-all">
                        <div className="flex items-center gap-4">
                          <div className="size-8 bg-card border border-border/40 rounded-lg flex items-center justify-center"><Users size={14} /></div>
                          <div>
                            <p className="text-[13px] font-black text-foreground">{link.id}</p>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase">{link.rel}</p>
                          </div>
                        </div>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{link.score}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Toolbar */}
              <div className="p-8 border-t border-border/20 bg-secondary/10 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Button onClick={() => toast.error('Portfolio Frozen', { description: 'All associated accounts have been locked.' })} className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-red-500/20">Freeze Entire Portfolio</Button>
                  <Button onClick={() => toast.error('Reported', { description: 'Entity flagged for identity theft in regional database.' })} variant="outline" className="w-full h-12 border-red-500/20 text-red-500 hover:bg-red-500/5 rounded-2xl font-black text-[11px] uppercase tracking-widest">Mark as Identity Theft</Button>
                </div>
                <div className="space-y-2">
                  <Button onClick={() => toast.success('EDD Requested', { description: 'User notified to provide enhanced documentation.' })} className="w-full h-12 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-widest shadow-xl shadow-primary/20">Request Enhanced Due Diligence</Button>
                  <Button onClick={() => toast.success('Escalated', { description: 'Case assigned to Senior Compliance Officer.' })} variant="outline" className="w-full h-12 border-border/40 text-muted-foreground rounded-2xl font-black text-[11px] uppercase tracking-widest">Escalate to Senior Compliance</Button>
                </div>
                <Button 
                  onClick={() => toast.success('Report Generation Initiated', { description: `Generating investigation report for ${selectedCase.id}...` })}
                  variant="outline" className="col-span-2 h-12 border-border/40 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
                >
                  <Download size={16} /> Export SAR Investigation Report (STR-9921)
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* 7. CLUSTER ANALYSIS DRAWER */}
      <AnimatePresence>
        {isClusterDrawerOpen && (
          <div className="fixed inset-0 z-[102] flex justify-end">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsClusterDrawerOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="bg-card border-l border-border/50 w-full max-w-2xl shadow-2xl relative z-[103] flex flex-col"
            >
              <div className="p-8 border-b border-border/20 flex items-center justify-between bg-secondary/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
                    <Activity size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Cluster Forensic Analysis</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Layering & Node Investigation Pool</p>
                  </div>
                </div>
                <button onClick={() => setIsClusterDrawerOpen(false)} className="p-3 hover:bg-secondary rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
                {/* Velocity Analysis */}
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-primary">Velocity Analysis</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-secondary/20 border border-border/10 rounded-3xl space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase">Linked Transactions</p>
                      <p className="text-2xl font-black text-foreground">142</p>
                      <p className="text-[10px] font-bold text-red-500 flex items-center gap-1"><TrendingUp size={10} /> +12% spike detected</p>
                    </div>
                    <div className="p-6 bg-secondary/20 border border-border/10 rounded-3xl space-y-2">
                      <p className="text-[10px] font-black text-muted-foreground uppercase">Risk Score</p>
                      <p className="text-2xl font-black text-foreground">88/100</p>
                      <p className="text-[10px] font-bold text-amber-500">High Confidence</p>
                    </div>
                  </div>
                </div>

                {/* Fingerprint Analysis */}
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-primary">Device Fingerprinting</h4>
                  <div className="p-6 bg-secondary/10 border border-border/10 rounded-3xl space-y-6">
                    {[
                      { label: "Repeated IP Activity", value: "8 Active Clusters", status: "Critical" },
                      { label: "Device Collision", value: "4 Accounts/Device", status: "Warning" },
                      { label: "VPN/Proxy Detection", value: "Residential Proxy", status: "High Risk" },
                    ].map((item, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <div className="space-y-1">
                          <p className="text-[13px] font-black text-foreground">{item.label}</p>
                          <p className="text-[11px] font-medium text-muted-foreground">{item.value}</p>
                        </div>
                        <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">{item.status}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Visual Cluster Map Placeholder */}
                <div className="space-y-4">
                  <h4 className="text-[12px] font-black uppercase tracking-widest text-primary">Node Relationship Map</h4>
                  <div className="aspect-video bg-muted/30 border-2 border-dashed border-border/40 rounded-[32px] flex flex-col items-center justify-center text-center p-8">
                    <Layers size={48} className="text-muted-foreground/30 mb-4" />
                    <p className="text-sm font-black text-foreground/40 uppercase tracking-widest">Generating Live Node Map...</p>
                    <p className="text-xs font-medium text-muted-foreground/50 mt-2">Visualizing links between USR-9921 and USR-1120</p>
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border/20 bg-secondary/10 flex gap-4">
                <Button onClick={() => { setIsClusterDrawerOpen(false); toast.error("Cluster Frozen", { description: "All 14 linked nodes have been globally blocked." }); }} className="flex-1 h-12 bg-red-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest">Freeze Entire Cluster</Button>
                <Button onClick={() => setIsClusterDrawerOpen(false)} variant="outline" className="flex-1 h-12 border-border/40 rounded-2xl font-black text-[11px] uppercase tracking-widest">Dismiss Analysis</Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 8. FULL AUDIT EXPLORER MODAL */}
      <AnimatePresence>
        {isAuditModalOpen && (
          <div className="fixed inset-0 z-[105] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsAuditModalOpen(false)}
              className="absolute inset-0 bg-background/90 backdrop-blur-xl" 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-card border border-border w-full max-w-5xl h-[80vh] rounded-[40px] shadow-2xl overflow-hidden relative z-[106] flex flex-col"
            >
              <div className="p-10 border-b border-border/20 flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="size-14 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                    <History size={28} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-foreground tracking-tight">Enterprise Audit Explorer</h3>
                    <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Comprehensive Platform Governance Trail</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input type="text" placeholder="Search logs..." className="bg-secondary/50 border border-border/20 rounded-xl py-2.5 pl-12 pr-6 text-xs font-bold outline-none focus:border-primary/40 w-64 transition-all" />
                  </div>
                  <button onClick={() => setIsAuditModalOpen(false)} className="p-3 hover:bg-secondary rounded-2xl transition-all"><X size={24} /></button>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-10 space-y-6 no-scrollbar">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {["All Activity", "Admin Actions", "Security Events", "Compliance"].map((filter) => (
                      <button key={filter} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-secondary/50 border border-border/20 text-muted-foreground hover:text-primary hover:bg-primary/5 transition-all">{filter}</button>
                    ))}
                  </div>
                   <Button 
                    onClick={() => executeExport({ fileName: 'AuditLogs', data: [
                      { admin: "Mick Jagger", role: "Super Admin", action: "Modified Global Rate Limit", target: "Platform", time: "2m ago", ip: "192.168.1.1", severity: "Medium" },
                      { admin: "Sarah Kong", role: "Compliance", action: "Approved KYC Tier 3", target: "USR-8821", time: "15m ago", ip: "192.168.1.42", severity: "Low" },
                      { admin: "System", role: "Automated", action: "Banned Account: Fraud Detection", target: "USR-0042", time: "1h ago", ip: "Internal", severity: "High" },
                    ], format: 'CSV' })}
                    variant="outline" 
                    className="h-10 rounded-xl flex items-center gap-2 text-[10px] font-black uppercase tracking-widest border-border/40"
                  >
                    <Download size={14} /> Export Audit Log
                  </Button>
                </div>

                <div className="space-y-3">
                  {[
                    { admin: "Mick Jagger", role: "Super Admin", action: "Modified Global Rate Limit", target: "Platform", time: "2m ago", ip: "192.168.1.1", severity: "Medium" },
                    { admin: "Sarah Kong", role: "Compliance", action: "Approved KYC Tier 3", target: "USR-8821", time: "15m ago", ip: "192.168.1.42", severity: "Low" },
                    { admin: "System", role: "Automated", action: "Banned Account: Fraud Detection", target: "USR-0042", time: "1h ago", ip: "Internal", severity: "High" },
                    { admin: "Jessica White", role: "Ops", action: "Exported Transaction Ledger (CSV)", target: "Platform", time: "3h ago", ip: "10.0.0.54", severity: "Low" },
                    { admin: "Mick Jagger", role: "Super Admin", action: "Updated Role: Junior Compliance", target: "USR-9021", time: "5h ago", ip: "192.168.1.1", severity: "Medium" },
                  ].map((log, i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-secondary/10 border border-border/10 rounded-3xl hover:bg-secondary/20 transition-all group">
                      <div className="flex items-center gap-6">
                        <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-foreground font-black text-xs">
                          {log.admin.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-[14px] font-black text-foreground">{log.admin}</p>
                            <span className="text-[9px] font-black text-muted-foreground/40 uppercase bg-muted/50 px-1.5 py-0.5 rounded-md">{log.role}</span>
                          </div>
                          <p className="text-[12px] font-medium text-muted-foreground mt-0.5">{log.action}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-12 text-right">
                        <div>
                          <p className="text-[11px] font-black text-foreground">{log.target}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">Target Node</p>
                        </div>
                        <div>
                          <p className="text-[11px] font-black text-foreground">{log.ip}</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">IP Address</p>
                        </div>
                        <div className="w-24">
                          <span className={cn(
                            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                            log.severity === "High" ? "bg-red-500/10 text-red-500" : log.severity === "Medium" ? "bg-amber-500/10 text-amber-500" : "bg-emerald-500/10 text-emerald-500"
                          )}>
                            {log.severity}
                          </span>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground/30 uppercase w-16">{log.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
