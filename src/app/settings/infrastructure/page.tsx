'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  Server, 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  ShieldCheck, 
  Zap, 
  Globe, 
  Search,
  RefreshCcw,
  AlertTriangle,
  ChevronRight,
  TrendingUp,
  Clock,
  Terminal,
  Layers,
  Gauge
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import Breadcrumbs from '@/components/layout/Breadcrumbs';

export default function InfrastructureSettings() {
  return (
    <div className="space-y-6">
      <Breadcrumbs />
      <SettingsHeader 
        title="Infrastructure & Monitoring" 
        description="Monitor system health, manage cloud resources, and configure automated scaling and backup policies."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Node Health */}
          <SettingsCard 
            title="Cluster Status" 
            description="Real-time performance metrics for global application nodes."
            icon={Server}
            badge="Healthy"
            badgeVariant="success"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: "Core-Engine-NG-01", region: "Lagos, NG", cpu: "24%", ram: "4.2GB", status: "online", load: "Healthy" },
                { name: "Core-Engine-NG-02", region: "Lagos, NG", cpu: "18%", ram: "3.8GB", status: "online", load: "Healthy" },
                { name: "Auth-Node-UK-01", region: "London, UK", cpu: "12%", ram: "2.1GB", status: "online", load: "Idle" },
                { name: "Worker-Pool-SA-01", region: "Cape Town, SA", cpu: "65%", ram: "12.4GB", status: "online", load: "High Load" },
              ].map((node, i) => (
                <div key={i} onClick={() => toast.success('Node Telemetry', { description: `Inspecting real-time metrics for ${node.name}...` })} className="p-5 bg-secondary/30 border border-border/20 rounded-[32px] hover:bg-secondary/50 hover:border-primary/20 transition-all group cursor-pointer">
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]" />
                      <div>
                        <h5 className="text-[13px] font-black text-foreground tracking-tight">{node.name}</h5>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase">{node.region}</p>
                      </div>
                    </div>
                    <span className="text-[9px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-lg">{node.load}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground/60">
                           <span>CPU</span>
                           <span>{node.cpu}</span>
                        </div>
                        <div className="h-1 w-full bg-muted/40 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full" style={{ width: node.cpu }} />
                        </div>
                     </div>
                     <div className="space-y-1.5">
                        <div className="flex justify-between text-[9px] font-black uppercase text-muted-foreground/60">
                           <span>RAM</span>
                           <span>{node.ram}</span>
                        </div>
                        <div className="h-1 w-full bg-muted/40 rounded-full overflow-hidden">
                           <div className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
                        </div>
                     </div>
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>

          {/* Database & Storage */}
          <SettingsCard 
            title="Database & Storage" 
            description="Manage data persistence layer, indexing performance, and backup frequency."
            icon={Database}
          >
            <div className="space-y-2">
              <SettingsField 
                label="Automated Point-in-Time Backup" 
                description="Enable continuous incremental backups for the primary PostgreSQL cluster."
                icon={RefreshCcw}
              >
                <Switch defaultChecked={true} onCheckedChange={(checked) => toast.success(checked ? 'PITR Enabled' : 'PITR Disabled', { description: 'Continuous backup status updated.' })} />
              </SettingsField>

              <SettingsField 
                label="Read Replica Auto-Scaling" 
                description="Spin up additional read replicas when database CPU exceeds 70%."
                icon={TrendingUp}
              >
                <Switch defaultChecked={true} onCheckedChange={(checked) => toast.success(checked ? 'Auto-Scaling Active' : 'Scaling Restricted', { description: 'DB replica management policy updated.' })} />
              </SettingsField>

              <SettingsField 
                label="Data Retention Policy" 
                description="Keep transaction logs in hot storage for 12 months, then archive to S3."
                icon={Clock}
              >
                <select defaultValue="12 Months" className="bg-secondary/50 border border-border/40 rounded-xl px-4 py-2 text-[12px] font-black uppercase outline-none focus:border-primary/40 transition-all">
                  <option>6 Months</option>
                  <option>12 Months</option>
                  <option>24 Months</option>
                </select>
              </SettingsField>

              <SettingsField 
                label="Binary Log Purging" 
                description="Automatically purge binlogs older than 7 days."
                icon={HardDrive}
              >
                <Switch defaultChecked={true} onCheckedChange={(checked) => toast.success(checked ? 'Log Purge Active' : 'Log Purge Disabled', { description: 'Binlog retention policy updated.' })} />
              </SettingsField>
            </div>
          </SettingsCard>

          {/* SRE Controls */}
          <SettingsCard 
            title="Scaling & Resilience" 
            description="Configure automated cluster scaling and traffic routing."
            icon={Zap}
          >
            <div className="space-y-4 p-6 bg-secondary/30 border border-border/20 rounded-[32px]">
              <div className="flex justify-between items-center mb-6">
                <div className="space-y-1">
                  <h6 className="text-[14px] font-black text-foreground">Horizontal Pod Autoscaler (HPA)</h6>
                  <p className="text-[11px] font-medium text-muted-foreground">Global scaling target across all AWS/Azure clusters.</p>
                </div>
                <Switch defaultChecked={true} onCheckedChange={(checked) => toast.success(checked ? 'K8s HPA Enabled' : 'HPA Disabled', { description: 'Cluster scaling is now managed manually.' })} />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                 {[
                   { label: "Min Nodes", val: "4", icon: Layers },
                   { label: "Max Nodes", val: "24", icon: Layers },
                   { label: "Target CPU", val: "65%", icon: Cpu },
                 ].map((stat, i) => (
                   <div key={i} className="p-4 bg-background/50 border border-border/10 rounded-2xl flex flex-col items-center gap-1">
                      <stat.icon size={16} className="text-primary mb-1" />
                      <p className="text-[10px] font-black uppercase text-muted-foreground/60">{stat.label}</p>
                      <p className="text-[14px] font-black text-foreground">{stat.val}</p>
                   </div>
                 ))}
              </div>
            </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Real-time Performance Gauge */}
          <div className="p-8 bg-card border border-border/40 rounded-[32px] space-y-8 shadow-xl shadow-black/5">
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                  <Gauge size={14} />
                  System Latency
                </p>
                <h3 className="text-3xl font-black text-foreground tracking-tighter">42ms</h3>
                <p className="text-[12px] font-medium text-muted-foreground">Average P99 Response Time</p>
             </div>

             <div className="space-y-6">
                {[
                  { label: "API Gateway", val: "12ms", target: "15ms", color: "text-emerald-500" },
                  { label: "Auth Middleware", val: "8ms", target: "10ms", color: "text-emerald-500" },
                  { label: "DB Query Execution", val: "22ms", target: "25ms", color: "text-amber-500" },
                ].map((lat, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <div className="space-y-0.5">
                        <p className="text-[11px] font-black uppercase tracking-widest text-foreground">{lat.label}</p>
                        <p className="text-[9px] font-bold text-muted-foreground uppercase">Target: {lat.target}</p>
                     </div>
                     <span className={cn("text-[14px] font-black", lat.color)}>{lat.val}</span>
                  </div>
                ))}
             </div>

             <div className="h-20 w-full flex items-end gap-1 px-2">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div 
                    key={i} 
                    className="flex-1 bg-primary/20 rounded-t-sm" 
                    style={{ height: `${Math.random() * 60 + 20}%` }} 
                  />
                ))}
             </div>
          </div>

          {/* Infrastructure Alerts */}
          <SettingsCard 
            title="System Incidents" 
            description="Infrastructure-level health alerts."
            icon={AlertTriangle}
          >
            <div className="space-y-4">
              {[
                { title: "S3 Snapshot Delay", status: "Resolved", time: "12h ago", color: "bg-emerald-500" },
                { title: "High RAM Usage (Worker-01)", status: "Alert", time: "14m ago", color: "bg-amber-500" },
              ].map((alert, i) => (
                <div key={i} className="p-4 bg-secondary/30 border border-border/10 rounded-2xl flex items-center justify-between group hover:bg-secondary/50 transition-all">
                  <div className="flex items-center gap-3">
                     <div className={cn("size-2 rounded-full", alert.color)} />
                     <div className="space-y-0.5">
                       <p className="text-[12px] font-black text-foreground">{alert.title}</p>
                       <p className="text-[9px] font-bold text-muted-foreground uppercase">{alert.time}</p>
                     </div>
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{alert.status}</span>
                </div>
              ))}
              <Button 
                onClick={() => toast.success('Incident Command Center', { description: 'Displaying real-time critical path monitoring.' })}
                variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40"
              >
                 Incident Command Center
              </Button>
            </div>
          </SettingsCard>

          {/* SRE Quick Access */}
          <div className="p-6 bg-secondary/40 border border-border/20 rounded-[32px] space-y-4">
             <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-2">
               <Terminal size={14} />
               SRE Toolkit
             </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button onClick={() => toast.success('Log Streamer', { description: 'Opening real-time Kubernetes log aggregator...' })} className="p-3 bg-background border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all text-center">
                  K8s Logs
                </button>
                <button onClick={() => toast.success('Identity Access', { description: 'Opening secure SSH key management vault...' })} className="p-3 bg-background border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all text-center">
                  SSH Keys
                </button>
                <button onClick={() => toast.success('Network Config', { description: 'Opening Cloudflare/Route53 DNS dashboard...' })} className="p-3 bg-background border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all text-center">
                  DNS Config
                </button>
                <button onClick={() => toast.success('Security Status', { description: 'Inspecting SSL/TLS certificate expiry and health...' })} className="p-3 bg-background border border-border/40 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all text-center">
                  SSL Status
                </button>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
