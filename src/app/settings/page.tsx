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
import { DashboardGrid } from '@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from '@/components/ui/AdaptiveMetricCard';
import { EmptyState } from '@/components/ui/EmptyState';

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
        <DashboardGrid cols={4}>
          {[
            { label: "Platform Status", value: "Offline", sub: "Awaiting Sync", icon: Activity, color: "text-muted-foreground", bg: "bg-muted", trend: "--" },
            { label: "Security Health", value: "0/100", sub: "Initializing", icon: Shield, color: "text-muted-foreground", bg: "bg-muted", trend: "--" },
            { label: "Compliance Score", value: "--", sub: "Not Audited", icon: ShieldCheck, color: "text-muted-foreground", bg: "bg-muted", trend: "--" },
            { label: "Active Nodes", value: "0", sub: "No Regions Active", icon: Cpu, color: "text-muted-foreground", bg: "bg-muted", trend: "--" },
          ].map((kpi, i) => (
            <AdaptiveMetricCard
              key={i}
              label={kpi.label}
              value={kpi.value}
              icon={kpi.icon}
              trend={kpi.trend !== '--' ? kpi.trend : undefined}
              description={kpi.sub}
              color={kpi.color}
            />
          ))}
        </DashboardGrid>

        {/* Operational Connectivity & Governance Section */}
        <div className="space-y-8">
          <SettingsCard 
            title="Operational Connectivity" 
            description="Real-time performance metrics for critical infrastructure."
            icon={Zap}
            badge="Healthy"
            badgeVariant="success"
          >
            <DashboardGrid cols={3}>
              {([] as any[]).length > 0 ? ([] as any[]).map((provider: any, i: number) => (
                <div key={i} className="p-4 bg-secondary/20 border border-border/10 rounded-[20px] hover:bg-secondary/40 hover:border-primary/20 transition-all group min-w-0 overflow-hidden">
                  {/* ... provider logic ... */}
                </div>
              )) : (
                <div className="col-span-full">
                  <EmptyState 
                    compact
                    title="No connectivity logs"
                    description="Real-time provider latency and uptime logs will appear here."
                  />
                </div>
              )}
            </DashboardGrid>
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
                {([] as any[]).length > 0 ? ([] as any[]).map((log: any, i: number) => (
                  <div key={i} className="flex items-center justify-between group cursor-pointer hover:translate-x-1 transition-all">
                    {/* ... log logic ... */}
                  </div>
                )) : (
                   <EmptyState 
                    compact
                    title="No recent activity"
                    description="Live operational trails will appear here."
                   />
                )}
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
                      { label: "Identity Control", score: 0, color: "bg-muted" },
                      { label: "Network Shield", score: 0, color: "bg-muted" },
                      { label: "Data Encryption", score: 0, color: "bg-muted" },
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
                    {([] as any[]).length > 0 ? ([] as any[]).map((req: any, i: number) => (
                      <div key={i} className="flex items-center justify-between p-2.5 bg-secondary/20 rounded-xl hover:bg-secondary/40 transition-all cursor-pointer group">
                        <div className="min-w-0">
                          <p className="text-[11px] font-black text-foreground">{req.id}</p>
                          <p className="text-[9px] font-bold text-muted-foreground/60 uppercase">{req.type}</p>
                        </div>
                        <span className="text-[9px] font-black text-muted-foreground/40 uppercase">{req.time}</span>
                      </div>
                    )) : (
                      <div className="py-8 text-center opacity-30">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Queue Empty</p>
                      </div>
                    )}
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
                {([] as any[]).length > 0 ? ([] as any[]).map((req: any, i: number) => (
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
                )) : (
                   <div className="py-20 text-center">
                      <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground opacity-30">Governance queue is clear</p>
                   </div>
                )}
              </div>

              <div className="p-8 border-t border-border/10 bg-secondary/5 flex items-center justify-between">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">0 Items Pending Review</p>
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
