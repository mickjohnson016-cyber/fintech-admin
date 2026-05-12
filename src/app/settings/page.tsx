'use client';

import React, { useState } from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import { 
  Activity, 
  ShieldCheck, 
  Users, 
  Globe, 
  Zap, 
  Clock, 
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Server,
  ShieldAlert,
  ArrowUpRight,
  Fingerprint,
  Cpu,
  RefreshCcw,
  ExternalLink,
  Lock as LockIcon,
  Eye,
  Shield,
  X,
  Check,
  Loader2
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function SettingsOverview() {
  const [isGovernanceModalOpen, setIsGovernanceModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-10">
        <SettingsHeader 
          title="Settings Overview" 
          description="Central command for OINZpay platform health, security posture, and administrative governance."
        />

        {/* KPI Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {[
            { label: "Platform Status", value: "Operational", sub: "All systems green", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-500/10", trend: "+99.99%" },
            { label: "Security Health", value: "98/100", sub: "Optimized", icon: Shield, color: "text-blue-500", bg: "bg-blue-500/10", trend: "+2.4%" },
            { label: "Compliance Score", value: "A+", sub: "Audit Ready", icon: ShieldCheck, color: "text-indigo-500", bg: "bg-indigo-500/10", trend: "Steady" },
            { label: "Active Nodes", value: "48", sub: "8 Regions Active", icon: Cpu, color: "text-amber-500", bg: "bg-amber-500/10", trend: "Healthy" },
          ].map((kpi, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="bg-card border border-border/40 rounded-[24px] p-5 hover:bg-secondary/20 hover:shadow-xl transition-all group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110 shadow-inner shrink-0", kpi.bg, kpi.color)}>
                  <kpi.icon size={20} />
                </div>
                <div className="flex flex-col items-end">
                  <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                  <span className="text-[10px] font-black text-emerald-500 mt-1">{kpi.trend}</span>
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-[9px] font-black uppercase tracking-[0.15em] text-muted-foreground/50">{kpi.label}</p>
                <h3 className="text-2xl font-black text-foreground tracking-tight">{kpi.value}</h3>
                <p className="text-[11px] font-medium text-muted-foreground/70">{kpi.sub}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Operational Connectivity & Governance Section */}
        <div className="space-y-8">
          <SettingsCard 
            title="Operational Connectivity" 
            description="Real-time performance metrics for critical infrastructure."
            icon={Zap}
            badge="Healthy"
            badgeVariant="success"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                { name: "MTN Nigeria", type: "Airtime/Data", latency: "112ms", uptime: "100%", status: "online", load: 24 },
                { name: "Airtel Africa", type: "Airtime/Data", latency: "198ms", uptime: "99.9%", status: "online", load: 38 },
                { name: "Glo Mobile", type: "Airtime/Data", latency: "145ms", uptime: "99.9%", status: "online", load: 12 },
                { name: "Flutterwave", type: "Gateway", latency: "420ms", uptime: "99.8%", status: "online", load: 64 },
                { name: "Paystack", type: "Gateway", latency: "365ms", uptime: "100%", status: "online", load: 58 },
                { name: "9mobile", type: "Airtime/Data", latency: "1.4s", uptime: "97.2%", status: "degraded", load: 5 },
              ].map((provider, i) => (
                <div key={i} className="p-4 bg-secondary/20 border border-border/10 rounded-[20px] hover:bg-secondary/40 hover:border-primary/20 transition-all group min-w-0 overflow-hidden">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={cn(
                        "size-2 rounded-full shrink-0",
                        provider.status === "online" ? "bg-emerald-500 shadow-[0_0_8px_#10B981]" : "bg-amber-500 shadow-[0_0_8px_#F59E0B]"
                      )} />
                      <div className="min-w-0">
                        <p className="text-[12px] font-black text-foreground truncate">{provider.name}</p>
                        <p className="text-[9px] font-bold text-muted-foreground/60 uppercase truncate">{provider.type}</p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[11px] font-black text-foreground">{provider.latency}</p>
                      <p className="text-[8px] font-bold text-muted-foreground/40 uppercase">{provider.uptime}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center text-[8px] font-black uppercase text-muted-foreground/40">
                      <span>API Load</span>
                      <span>{provider.load}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          provider.load > 60 ? "bg-amber-500" : "bg-primary"
                        )} 
                        style={{ width: `${provider.load}%` }} 
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>

          {/* Integrated Bottom Audit & Governance Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* Recent Activity Timeline */}
            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-[32px] p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 rounded-xl bg-primary/5 border border-primary/10 flex items-center justify-center text-primary">
                    <Clock size={20} />
                  </div>
                  <div>
                    <h3 className="text-[14px] font-black text-foreground tracking-tight">Recent Activity</h3>
                    <p className="text-[10px] font-medium text-muted-foreground">Real-time system-wide audit</p>
                  </div>
                </div>
                <button 
                  onClick={() => toast.success('Audit Explorer', { description: 'Loading deep operational trail...' })}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  Deep Audit View
                </button>
              </div>

              <div className="space-y-5">
                {[
                  { user: "Sarah K.", action: "Updated KYC Policy v2.4", time: "2m ago", type: "compliance", icon: ShieldCheck },
                  { user: "Mick J.", action: "Revoked API Key: Flutter-Prod", time: "45m ago", type: "security", icon: LockIcon },
                  { user: "System", action: "Automatic Backup Complete", time: "2h ago", type: "ops", icon: RefreshCcw },
                  { user: "Admin", action: "Login: Lagos, Nigeria", time: "4h ago", type: "admin", icon: Eye },
                ].map((log, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "size-8 rounded-lg flex items-center justify-center border",
                        log.type === "security" ? "bg-red-500/5 border-red-500/10 text-red-500" : 
                        log.type === "compliance" ? "bg-primary/5 border-primary/10 text-primary" : 
                        "bg-muted/5 border-border/10 text-muted-foreground"
                      )}>
                        <log.icon size={14} />
                      </div>
                      <div>
                        <p className="text-[12px] font-black text-foreground tracking-tight">{log.user}</p>
                        <p className="text-[10px] font-medium text-muted-foreground">{log.action}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Governance & Security Center */}
            <div className="bg-card/50 backdrop-blur-md border border-border/50 rounded-[32px] p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-10 rounded-xl bg-indigo-500/5 border border-indigo-500/10 flex items-center justify-center text-indigo-500">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h3 className="text-[14px] font-black text-foreground tracking-tight">Governance Posture</h3>
                  <p className="text-[10px] font-medium text-muted-foreground">Platform resilience indexes</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Resilience Scores</span>
                    <TrendingUp size={12} className="text-emerald-500" />
                  </div>
                  <div className="space-y-4">
                    {[
                      { label: "Identity Control", score: 100, color: "bg-emerald-500" },
                      { label: "Network Shield", score: 92, color: "bg-primary" },
                      { label: "Data Encryption", score: 100, color: "bg-emerald-500" },
                    ].map((item, i) => (
                      <div key={i} className="space-y-1.5">
                        <div className="flex justify-between items-center text-[11px] font-bold">
                          <span className="text-foreground/70">{item.label}</span>
                          <span className="text-foreground">{item.score}%</span>
                        </div>
                        <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                          <div className={cn("h-full rounded-full transition-all duration-1000", item.color)} style={{ width: `${item.score}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 border-l border-border/20 pl-6">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">Pending Queue</span>
                    <div className="size-1.5 bg-amber-500 rounded-full animate-pulse" />
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: "REV-9021", type: "Treasury", time: "14m" },
                      { id: "LIM-4402", type: "Threshold", time: "1h" },
                      { id: "ADM-1120", type: "Onboarding", time: "3h" },
                    ].map((req, i) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition-all cursor-pointer group">
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-foreground">{req.id}</p>
                          <p className="text-[9px] font-bold text-muted-foreground/60 uppercase">{req.type}</p>
                        </div>
                        <span className="text-[9px] font-black text-muted-foreground/40 uppercase">{req.time}</span>
                      </div>
                    ))}
                    <button 
                      onClick={() => setIsGovernanceModalOpen(true)}
                      className="w-full py-2 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-lg hover:bg-primary/90 transition-all"
                    >
                      View Governance Queue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* GOVERNANCE QUEUE MODAL */}
      <AnimatePresence>
        {isGovernanceModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsGovernanceModalOpen(false)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="bg-card border border-border w-full max-w-2xl rounded-[32px] shadow-2xl overflow-hidden relative z-10 flex flex-col max-h-[85vh]"
            >
              <div className="p-8 border-b border-border/10 flex items-center justify-between bg-secondary/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center border border-indigo-500/20">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-foreground">Governance Review Queue</h3>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">Pending Multi-sig & Policy Approvals</p>
                  </div>
                </div>
                <button onClick={() => setIsGovernanceModalOpen(false)} className="p-3 hover:bg-secondary rounded-2xl transition-all">
                  <X size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-4">
                {[
                  { id: "REV-9021", type: "Treasury Allocation", requester: "Mick J.", desc: "Approval for ₦25M liquidity move to main float.", priority: "High" },
                  { id: "LIM-4402", type: "Threshold Change", requester: "Sarah K.", desc: "Increase daily withdrawal limit for Tier 3 from ₦5M to ₦10M.", priority: "Medium" },
                  { id: "ADM-1120", type: "Admin Onboarding", requester: "System", desc: "Grant 'Compliance Auditor' role to new user USR-842.", priority: "Low" },
                ].map((req, i) => (
                  <div key={i} className="p-6 bg-secondary/20 border border-border/10 rounded-3xl space-y-4 group hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <p className="text-[11px] font-black text-primary font-mono">{req.id}</p>
                        <h4 className="text-[14px] font-black text-foreground">{req.type}</h4>
                        <p className="text-[11px] font-medium text-muted-foreground">Requested by {req.requester}</p>
                      </div>
                      <span className={cn(
                        "px-2.5 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        req.priority === "High" ? "bg-red-500/5 text-red-500 border-red-500/10" : "bg-amber-500/5 text-amber-500 border-amber-500/10"
                      )}>
                        {req.priority}
                      </span>
                    </div>
                    <p className="text-[12px] font-medium text-muted-foreground leading-relaxed">{req.desc}</p>
                    <div className="flex gap-2">
                      <Button 
                        onClick={() => toast.success('Approved', { description: `Governance request ${req.id} has been signed.` })}
                        className="flex-1 h-10 bg-emerald-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
                      >
                        Approve
                      </Button>
                      <Button 
                        onClick={() => toast.error('Rejected', { description: `Governance request ${req.id} has been declined.` })}
                        variant="outline" 
                        className="flex-1 h-10 border-rose-500/20 text-rose-500 hover:bg-rose-500/5 rounded-xl font-black text-[10px] uppercase tracking-widest"
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-8 border-t border-border/10 bg-secondary/5 flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">3 Items Pending Review</p>
                <div className="flex items-center gap-1">
                  <div className="size-2 bg-emerald-500 rounded-full" />
                  <span className="text-[10px] font-black text-foreground uppercase tracking-widest">All Services Syncing</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
