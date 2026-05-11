'use client';

import React from 'react';
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
  Shield
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { motion } from 'framer-motion';

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
  return (
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
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6"
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
            className="bg-card/40 backdrop-blur-sm border border-border/50 rounded-[32px] p-6 hover:bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all group"
          >
            <div className="flex items-start justify-between mb-5">
              <div className={cn("p-4 rounded-2xl transition-transform group-hover:scale-110 group-hover:rotate-3 shadow-inner", kpi.bg, kpi.color)}>
                <kpi.icon size={24} />
              </div>
              <div className="flex flex-col items-end">
                <ArrowUpRight size={16} className="text-muted-foreground/30 group-hover:text-primary transition-colors" />
                <span className="text-[10px] font-black text-emerald-500 mt-2">{kpi.trend}</span>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">{kpi.label}</p>
              <h3 className="text-3xl font-black text-foreground tracking-tight">{kpi.value}</h3>
              <p className="text-[12px] font-medium text-muted-foreground">{kpi.sub}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Provider Health Monitor */}
        <div className="xl:col-span-2 space-y-8">
          <SettingsCard 
            title="Operational Connectivity" 
            description="Real-time performance metrics for critical payment gateways and utility infrastructure."
            icon={Zap}
            badge="Healthy"
            badgeVariant="success"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "MTN Nigeria", type: "Airtime/Data", latency: "112ms", uptime: "100%", status: "online", load: 24 },
                { name: "Airtel Africa", type: "Airtime/Data", latency: "198ms", uptime: "99.9%", status: "online", load: 38 },
                { name: "Glo Mobile", type: "Airtime/Data", latency: "145ms", uptime: "99.9%", status: "online", load: 12 },
                { name: "Flutterwave", type: "Gateway", latency: "420ms", uptime: "99.8%", status: "online", load: 64 },
                { name: "Paystack", type: "Gateway", latency: "365ms", uptime: "100%", status: "online", load: 58 },
                { name: "9mobile", type: "Airtime/Data", latency: "1.4s", uptime: "97.2%", status: "degraded", load: 5 },
              ].map((provider, i) => (
                <div key={i} className="p-5 bg-secondary/30 border border-border/20 rounded-[24px] hover:bg-secondary/50 hover:border-primary/20 transition-all group">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "size-2.5 rounded-full",
                        provider.status === "online" ? "bg-emerald-500 shadow-[0_0_12px_#10B981]" : "bg-amber-500 shadow-[0_0_12px_#F59E0B]"
                      )} />
                      <div>
                        <p className="text-[13px] font-black text-foreground">{provider.name}</p>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{provider.type}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[12px] font-black text-foreground">{provider.latency}</p>
                      <p className="text-[9px] font-bold text-muted-foreground uppercase">{provider.uptime}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] font-black uppercase text-muted-foreground/60">
                      <span>API Load</span>
                      <span>{provider.load}%</span>
                    </div>
                    <div className="h-1 w-full bg-muted/40 rounded-full overflow-hidden">
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

          {/* Pending Approval Center */}
          <SettingsCard 
            title="Governance Queue" 
            description="Administrative actions requiring high-level authorization."
            icon={ShieldAlert}
            badge="3 Pending"
            badgeVariant="warning"
          >
            <div className="space-y-4">
              {[
                { title: "Treasury Reversal", amount: "₦1,250,000.00", requester: "Sarah Kong", id: "REV-9021", time: "14 mins ago" },
                { title: "System Parameter Shift", amount: "AML Thresholds", requester: "Auto-Scale", id: "LIM-4402", time: "1 hour ago" },
                { title: "New Admin Onboarding", amount: "David O. (DevOps)", requester: "Mick Jagger", id: "ADM-1120", time: "3 hours ago" },
              ].map((req, i) => (
                <div key={i} className="p-6 bg-secondary/30 border border-border/20 rounded-[28px] flex items-center justify-between group hover:border-primary/40 hover:bg-secondary/40 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-background border border-border/40 rounded-2xl text-muted-foreground group-hover:text-primary transition-colors">
                      <LockIcon size={18} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[14px] font-black text-foreground tracking-tight">{req.title}</p>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground">
                        <span>{req.amount}</span>
                        <span className="size-1 bg-muted-foreground/30 rounded-full" />
                        <span>{req.requester}</span>
                        <span className="size-1 bg-muted-foreground/30 rounded-full" />
                        <span className="font-bold text-primary/80">{req.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase mr-2">{req.time}</span>
                    <button className="px-6 py-2.5 bg-primary text-white text-[11px] font-black uppercase tracking-widest rounded-xl hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
                      Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>
        </div>

        {/* Audit & Compliance Sidebar */}
        <div className="xl:col-span-1 space-y-8">
          <SettingsCard 
            title="Real-time Audit" 
            description="System-wide administrative log."
            icon={Clock}
          >
            <div className="space-y-8 relative before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-border/40">
              {[
                { user: "Sarah K.", action: "Updated KYC Policy v2.4", time: "2 mins ago", type: "compliance", icon: ShieldCheck },
                { user: "Mick J.", action: "Revoked API Key: Flutter-Prod", time: "45 mins ago", type: "security", icon: LockIcon },
                { user: "System", action: "Automatic Backup Complete", time: "2 hours ago", type: "ops", icon: RefreshCcw },
                { user: "Admin", action: "Login: 192.168.1.1 (Lagos)", time: "4 hours ago", type: "admin", icon: Eye },
              ].map((log, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer relative z-10">
                  <div className={cn(
                    "size-4 rounded-full border-2 border-background flex items-center justify-center -ml-[7px]",
                    log.type === "security" ? "bg-red-500" : log.type === "compliance" ? "bg-primary" : "bg-muted"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <log.icon size={12} className="text-muted-foreground" />
                      <p className="text-[12px] font-black text-foreground">{log.user}</p>
                    </div>
                    <p className="text-[12px] font-medium text-muted-foreground leading-tight">{log.action}</p>
                    <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest mt-1">{log.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-8 py-4 bg-secondary/50 hover:bg-secondary border border-border/40 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all flex items-center justify-center gap-2">
              Deep Audit View
              <ExternalLink size={12} />
            </button>
          </SettingsCard>

          <SettingsCard 
            title="Security Posture" 
            description="Platform resilience score."
            icon={Shield}
          >
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Health Index</p>
                  <h4 className="text-4xl font-black text-foreground">98.4</h4>
                </div>
                <div className="size-20 relative flex items-center justify-center">
                  <svg className="size-full -rotate-90">
                    <circle 
                      cx="40" cy="40" r="34" 
                      className="fill-none stroke-muted/20 stroke-[6]" 
                    />
                    <circle 
                      cx="40" cy="40" r="34" 
                      className="fill-none stroke-primary stroke-[6]" 
                      strokeDasharray="213.6"
                      strokeDashoffset="3.4"
                      strokeLinecap="round"
                    />
                  </svg>
                  <span className="absolute text-[12px] font-black text-primary">A+</span>
                </div>
              </div>

              <div className="space-y-5">
                {[
                  { label: "Identity Control", score: 100, status: "Active" },
                  { label: "Network Shield", score: 92, status: "Review" },
                  { label: "Data Encryption", score: 100, status: "Active" },
                ].map((item, i) => (
                  <div key={i} className="space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{item.label}</span>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.status}</p>
                      </div>
                      <span className="text-[12px] font-black text-foreground">{item.score}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          "h-full rounded-full",
                          item.score === 100 ? "bg-emerald-500" : "bg-primary"
                        )} 
                        style={{ width: `${item.score}%` }} 
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
