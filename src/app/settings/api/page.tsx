'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  Code2, 
  Key, 
  Globe, 
  Webhook, 
  Activity, 
  ShieldCheck, 
  Terminal, 
  ExternalLink,
  ChevronRight,
  Eye,
  RefreshCcw,
  Zap,
  Lock as LockIcon,
  Plus,
  Cpu
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function ApiSettings() {
  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="API & Integrations" 
        description="Manage programmatic access to the OINZpay ecosystem. Configure API keys, webhooks, and third-party developer integrations."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* API Keys Management */}
          <SettingsCard 
            title="Management API Keys" 
            description="Secure keys for authenticating administrative and system-level API requests."
            icon={Key}
          >
            <div className="space-y-4">
              {[
                { name: "Production_Core_Service", key: "sk_live_************************4a2x", type: "Secret", status: "Active", lastUsed: "2m ago" },
                { name: "CI_CD_Deploy_Bot", key: "sk_live_************************9b1z", type: "Secret", status: "Active", lastUsed: "4h ago" },
                { name: "Staging_Testing_Key", key: "sk_test_************************5f0w", type: "Test", status: "Revoked", lastUsed: "12d ago" },
              ].map((key, i) => (
                <div key={i} className={cn(
                  "p-6 border rounded-[32px] flex items-center justify-between transition-all group",
                  key.status === "Active" ? "bg-secondary/30 border-border/20 hover:border-primary/20" : "bg-muted/30 border-border/10 opacity-60"
                )}>
                  <div className="flex items-center gap-5">
                    <div className={cn(
                      "p-3 rounded-2xl",
                      key.type === "Secret" ? "bg-primary/10 text-primary" : "bg-amber-500/10 text-amber-500"
                    )}>
                      <LockIcon size={20} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-3">
                        <h5 className="text-[14px] font-black text-foreground tracking-tight">{key.name}</h5>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                          key.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-red-500/10 text-red-500 border-red-500/20"
                        )}>
                          {key.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[12px] font-mono text-muted-foreground">
                        <span>{key.key}</span>
                        <span className="size-1 bg-muted-foreground/30 rounded-full" />
                        <span className="text-[10px] font-black uppercase tracking-widest font-sans">{key.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2.5 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-primary transition-all">
                      <Eye size={16} />
                    </button>
                    <button className="p-2.5 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-red-500 transition-all">
                      <RefreshCcw size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <Button className="w-full h-12 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] bg-primary text-white shadow-lg shadow-primary/20 flex items-center gap-2">
                <Plus size={18} />
                Generate Management Key
              </Button>
            </div>
          </SettingsCard>

          {/* Webhook Configuration */}
          <SettingsCard 
            title="Webhook Endpoints" 
            description="Configure destinations for real-time system event streaming."
            icon={Webhook}
          >
            <div className="space-y-4">
              {[
                { url: "https://api.external-monitor.com/v1/webhooks", events: ["trans.success", "user.kyc.failed"], status: "Healthy" },
                { url: "https://ops-bridge.oinzpay.internal/events", events: ["*"], status: "Degraded" },
              ].map((webhook, i) => (
                <div key={i} className="p-6 bg-secondary/30 border border-border/20 rounded-[32px] space-y-4 group hover:border-primary/30 transition-all">
                   <div className="flex justify-between items-start">
                     <div className="space-y-1">
                        <p className="text-[14px] font-black text-foreground tracking-tight truncate max-w-md">{webhook.url}</p>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {webhook.events.map((event, j) => (
                            <span key={j} className="px-2 py-0.5 bg-background border border-border/40 rounded-lg text-[9px] font-black uppercase text-muted-foreground">{event}</span>
                          ))}
                        </div>
                     </div>
                     <div className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        webhook.status === "Healthy" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                     )}>
                        {webhook.status}
                     </div>
                   </div>
                   <div className="flex items-center justify-between pt-4 border-t border-border/10">
                      <div className="flex items-center gap-3">
                         <button className="text-[10px] font-black text-primary uppercase tracking-widest">Test Webhook</button>
                         <button className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Edit</button>
                      </div>
                      <Switch defaultChecked={true} />
                   </div>
                </div>
              ))}
              <Button variant="outline" className="w-full h-12 rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] border-border/40">
                Add Webhook Endpoint
              </Button>
            </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Developer Resources */}
          <div className="p-8 bg-gradient-to-br from-card to-secondary/30 border border-border/40 rounded-[32px] space-y-6 shadow-xl shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Terminal size={100} className="text-primary" />
            </div>
            
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
                <Code2 size={14} />
                Dev Ecosystem
              </p>
              <h3 className="text-2xl font-black text-foreground tracking-tighter">Documentation</h3>
              <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                Access the complete API reference, SDKs, and integration guides for the OINZpay Core Engine.
              </p>
            </div>

            <div className="space-y-3 relative z-10">
              {[
                { label: "Core API Ref", icon: Globe },
                { label: "Mobile SDKs", icon: Cpu },
                { label: "Webhook Events", icon: Webhook },
              ].map((link, i) => (
                <button key={i} className="w-full p-4 bg-background/50 border border-border/20 rounded-2xl flex items-center justify-between group hover:bg-background transition-all">
                  <div className="flex items-center gap-3">
                    <link.icon size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="text-[12px] font-black uppercase tracking-widest text-foreground">{link.label}</span>
                  </div>
                  <ExternalLink size={14} className="text-muted-foreground/30" />
                </button>
              ))}
            </div>
          </div>

          {/* Rate Limiting Stats */}
          <SettingsCard 
            title="API Traffic Control" 
            description="Global throughput and rate limit status."
            icon={Zap}
          >
            <div className="space-y-6">
              {[
                { label: "Management API", usage: "1.2k/min", limit: "5k/min", status: "Healthy" },
                { label: "User Core API", usage: "45k/min", limit: "100k/min", status: "Healthy" },
                { label: "Webhook Engine", usage: "850/min", limit: "2k/min", status: "Healthy" },
              ].map((stat, i) => (
                <div key={i} className="space-y-3">
                  <div className="flex justify-between items-end">
                    <div className="space-y-0.5">
                       <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{stat.label}</span>
                       <p className="text-[9px] font-bold text-muted-foreground uppercase">{stat.status}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[12px] font-black text-foreground">{stat.usage}</p>
                       <p className="text-[9px] font-bold text-muted-foreground/40 uppercase">Limit: {stat.limit}</p>
                    </div>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${(parseInt(stat.usage) / parseInt(stat.limit)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>

          {/* Security Features */}
          <SettingsCard 
            title="Integrity Features" 
            description="Advanced API security protocols."
            icon={ShieldCheck}
          >
            <div className="space-y-2">
              <SettingsField label="IP Pinning" icon={Globe}>
                <Switch defaultChecked={true} />
              </SettingsField>
              <SettingsField label="Payload Encryption" icon={LockIcon}>
                <Switch defaultChecked={true} />
              </SettingsField>
              <SettingsField label="Request Signing" icon={Terminal}>
                <Switch defaultChecked={true} />
              </SettingsField>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
