'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  Zap, 
  Activity, 
  Server, 
  ShieldAlert, 
  RefreshCcw, 
  Settings2, 
  Globe,
  Signal,
  ArrowUpRight,
  Gauge,
  Wifi,
  Tv,
  Gamepad2,
  Phone,
  Power,
  ChevronRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const providers = [
  { name: "MTN Nigeria", icon: Phone, type: "Telco", latency: "112ms", uptime: "100%", status: "online", color: "text-amber-500", bg: "bg-amber-500/10" },
  { name: "Airtel Africa", icon: Phone, type: "Telco", latency: "198ms", uptime: "99.9%", status: "online", color: "text-red-500", bg: "bg-red-500/10" },
  { name: "Glo Mobile", icon: Phone, type: "Telco", latency: "145ms", uptime: "99.9%", status: "online", color: "text-emerald-500", bg: "bg-emerald-500/10" },
  { name: "Multichoice (DSTV)", icon: Tv, type: "Cable TV", latency: "420ms", uptime: "99.8%", status: "online", color: "text-blue-500", bg: "bg-blue-500/10" },
  { name: "BetKing API", icon: Gamepad2, type: "Betting", latency: "180ms", uptime: "100%", status: "online", color: "text-purple-500", bg: "bg-purple-500/10" },
  { name: "EKEDC (Electric)", icon: Power, type: "Utility", latency: "1.4s", uptime: "97.2%", status: "degraded", color: "text-amber-500", bg: "bg-amber-500/10" },
];

export default function ProviderControls() {
  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Bill Payment & Provider Controls" 
        description="Monitor and manage upstream utility providers, telco APIs, and betting gateway integrations."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Provider Directory */}
          <SettingsCard 
            title="Active Service Integrations" 
            description="Real-time status and operational controls for all third-party utility APIs."
            icon={Zap}
            badge="All Live"
            badgeVariant="success"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {providers.map((provider, i) => (
                <div key={i} className="p-6 bg-secondary/30 border border-border/20 rounded-[32px] hover:bg-secondary/50 hover:border-primary/20 transition-all group">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex gap-4">
                      <div className={cn("p-3 rounded-2xl", provider.bg, provider.color)}>
                        <provider.icon size={20} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-[14px] font-black text-foreground tracking-tight">{provider.name}</h5>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{provider.type}</p>
                      </div>
                    </div>
                    <div className={cn(
                      "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                      provider.status === "online" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                    )}>
                      {provider.status}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 bg-background/50 border border-border/10 rounded-2xl">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Latency</p>
                      <p className="text-[13px] font-black text-foreground tracking-tight">{provider.latency}</p>
                    </div>
                    <div className="p-3 bg-background/50 border border-border/10 rounded-2xl">
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Uptime</p>
                      <p className="text-[13px] font-black text-foreground tracking-tight">{provider.uptime}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-border/10">
                    <div className="flex items-center gap-2">
                      <Settings2 size={14} className="text-muted-foreground" />
                      <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">Settings</span>
                    </div>
                    <Switch defaultChecked={provider.status === "online"} />
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>

          {/* Failover Configuration */}
          <SettingsCard 
            title="API Failover & Resilience" 
            description="Configure automated retry logic and secondary provider routing."
            icon={RefreshCcw}
          >
            <div className="space-y-2">
              <SettingsField 
                label="Automated Failover" 
                description="Automatically switch to secondary provider if primary latency exceeds 2 seconds."
                icon={Signal}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="Retry Strategy" 
                description="Max retries before flagging a transaction as provider-failed."
                icon={RefreshCcw}
              >
                <select defaultValue="2 Retries" className="bg-secondary/50 border border-border/40 rounded-xl px-4 py-2 text-[12px] font-black uppercase outline-none focus:border-primary/40 transition-all">
                  <option>1 Retry</option>
                  <option>2 Retries</option>
                  <option>3 Retries</option>
                </select>
              </SettingsField>

              <SettingsField 
                label="Maintenance Mode Routing" 
                description="Route traffic to backup clusters during scheduled provider maintenance."
                icon={ShieldAlert}
              >
                <Switch defaultChecked={true} />
              </SettingsField>
            </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Uptime Monitoring */}
          <div className="p-8 bg-card border border-border/40 rounded-[32px] space-y-8 shadow-xl shadow-black/5">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Activity size={14} />
                  Live Monitoring
                </p>
                <h3 className="text-3xl font-black text-foreground tracking-tighter">99.98%</h3>
                <p className="text-[12px] font-medium text-muted-foreground">Global Aggregate Uptime</p>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
                <TrendingUp size={20} />
              </div>
            </div>

            <div className="space-y-6">
              {[
                { label: "Telco API Stack", uptime: "100%", status: "Operational" },
                { label: "Utility Gateway", uptime: "98.4%", status: "Degraded" },
                { label: "Betting Node", uptime: "99.9%", status: "Operational" },
              ].map((stack, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{stack.label}</span>
                    <span className="text-[12px] font-black text-foreground">{stack.uptime}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        stack.status === "Operational" ? "bg-emerald-500" : "bg-amber-500"
                      )} 
                      style={{ width: stack.uptime }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Critical Alerts */}
          <SettingsCard 
            title="Provider Incidents" 
            description="Recent issues with upstream services."
            icon={AlertTriangle}
          >
            <div className="space-y-4">
              {[
                { title: "EKEDC API Timeout", time: "14m ago", status: "Investigating", color: "bg-amber-500" },
                { title: "Glo Data Latency Spike", time: "2h ago", status: "Resolved", color: "bg-emerald-500" },
              ].map((incident, i) => (
                <div key={i} className="p-4 bg-secondary/30 border border-border/10 rounded-2xl flex items-center gap-4">
                  <div className={cn("size-2 rounded-full", incident.color)} />
                  <div className="flex-1">
                    <p className="text-[12px] font-black text-foreground leading-tight">{incident.title}</p>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground uppercase mt-1">
                      <span>{incident.time}</span>
                      <span className="size-1 bg-muted-foreground/30 rounded-full" />
                      <span className="text-foreground/80">{incident.status}</span>
                    </div>
                  </div>
                  <ChevronRight size={14} className="text-muted-foreground/30" />
                </div>
              ))}
              <Button variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest">
                Full Incident History
              </Button>
            </div>
          </SettingsCard>

          {/* Commission Config */}
          <SettingsCard 
            title="Profitability Rules" 
            description="Manage provider-specific margins."
            icon={Gauge}
          >
            <div className="space-y-4">
              {[
                { label: "Airtime Markup", value: "3.5%", target: "Base Cost" },
                { label: "Data Commission", value: "₦50.00", target: "Per Transaction" },
              ].map((rule, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/10 rounded-2xl">
                  <div className="space-y-0.5">
                    <p className="text-[12px] font-black text-foreground">{rule.label}</p>
                    <p className="text-[9px] font-bold text-muted-foreground uppercase">{rule.target}</p>
                  </div>
                  <span className="text-[13px] font-black text-primary">{rule.value}</span>
                </div>
              ))}
              <Button className="w-full h-11 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-primary text-white">
                Modify Margins
              </Button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
