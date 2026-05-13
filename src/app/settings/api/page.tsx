'use client';

import React, { useState } from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  Key, 
  Terminal, 
  Globe, 
  ShieldCheck, 
  RefreshCcw, 
  Eye, 
  EyeOff, 
  Copy, 
  Plus, 
  Trash2, 
  Activity,
  History,
  CheckCircle2,
  AlertTriangle,
  Code2,
  Zap,
  Webhook,
  MoreVertical,
  ArrowUpRight,
  Loader2
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { QuickActionModal } from '@/components/ui/QuickActionModal';

interface APIKey {
  id: string;
  name: string;
  key: string;
  lastUsed: string;
  created: string;
}

export default function APIKeysIntegrations() {
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [webhooks, setWebhooks] = useState<any[]>([]);
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="API Keys & Integrations" 
        description="Manage your platform's cryptographic keys and third-party webhook integrations."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* API Keys */}
          <SettingsCard 
            title="Management Keys" 
            description="Secure tokens for programmatic access to the OINZpay Core API."
            icon={Key}
          >
            <div className="space-y-4">
               {keys.length > 0 ? (
                 keys.map((apiKey) => (
                   <div key={apiKey.id} className="p-5 bg-secondary/10 border border-border/5 rounded-[28px] hover:border-primary/20 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                         <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-background border border-border/10 flex items-center justify-center text-primary shadow-sm">
                               <Key size={20} />
                            </div>
                            <div>
                               <p className="text-[13px] font-black text-foreground">{apiKey.name}</p>
                               <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">Created: {apiKey.created}</p>
                            </div>
                         </div>
                         <div className="flex items-center gap-2">
                            <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                               <RefreshCcw size={16} />
                            </button>
                            <button className="p-2 text-muted-foreground hover:text-rose-500 transition-colors">
                               <Trash2 size={16} />
                            </button>
                         </div>
                      </div>
                      
                      <div className="flex items-center gap-3 p-3 bg-background border border-border/40 rounded-xl">
                         <code className="flex-1 text-[12px] font-bold font-mono text-muted-foreground overflow-hidden whitespace-nowrap">
                            {showKeys[apiKey.id] ? apiKey.key : '••••••••••••••••••••••••••••••••'}
                         </code>
                         <div className="flex items-center gap-1 border-l border-border/40 pl-3">
                            <button 
                              onClick={() => setShowKeys(prev => ({ ...prev, [apiKey.id]: !prev[apiKey.id] }))}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                               {showKeys[apiKey.id] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                            <button 
                              onClick={() => { navigator.clipboard.writeText(apiKey.key); toast.success('Key Copied'); }}
                              className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                            >
                               <Copy size={14} />
                            </button>
                         </div>
                      </div>
                      <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground/40">
                         <Activity size={12} />
                         <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                   </div>
                 ))
               ) : (
                 <div className="py-20 text-center border-2 border-dashed border-border/10 rounded-[40px]">
                    <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                       <Key size={32} />
                    </div>
                    <h4 className="text-[14px] font-black text-foreground uppercase tracking-widest">No API keys generated</h4>
                    <p className="text-[12px] font-medium text-muted-foreground mt-2 max-w-xs mx-auto">Generate your first cryptographic key to begin integrating with the platform.</p>
                    <Button variant="outline" className="mt-8 h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40">Generate API Key</Button>
                 </div>
               )}
            </div>
          </SettingsCard>

          {/* Webhooks */}
          <SettingsCard 
            title="Webhook Endpoints" 
            description="Receive real-time transaction notifications via HTTP POST requests."
            icon={Webhook}
          >
             <div className="space-y-4">
                {webhooks.length > 0 ? (
                  webhooks.map((webhook) => (
                    <div key={webhook.id} className="p-4 bg-secondary/10 border border-border/5 rounded-2xl flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
                             <Globe size={20} />
                          </div>
                          <div>
                             <p className="text-[13px] font-black text-foreground">{webhook.url}</p>
                             <div className="flex items-center gap-2 mt-0.5">
                                <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase border border-emerald-500/20">{webhook.status}</span>
                                <p className="text-[10px] font-medium text-muted-foreground uppercase">{webhook.events} Events</p>
                             </div>
                          </div>
                       </div>
                       <button className="p-2 text-muted-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                          <MoreVertical size={16} />
                       </button>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-border/10 rounded-[40px]">
                     <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                        <Webhook size={32} />
                     </div>
                     <h4 className="text-[14px] font-black text-foreground uppercase tracking-widest">No webhooks configured</h4>
                     <p className="text-[12px] font-medium text-muted-foreground mt-2">Configure an endpoint to receive real-time platform events.</p>
                     <Button variant="outline" className="mt-8 h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40">Add Endpoint</Button>
                  </div>
                )}
             </div>
          </SettingsCard>
        </div>

        <div className="space-y-8">
           {/* Integration Status */}
           <div className="p-8 bg-card border border-border/40 rounded-[40px] space-y-8 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                    <Zap size={20} />
                 </div>
                 <h3 className="text-[14px] font-black uppercase tracking-widest">Dev Portal</h3>
              </div>
              
              <div className="space-y-6">
                 {[
                   { label: "API Success Rate", value: "0%", trend: "0%", color: "text-muted-foreground" },
                   { label: "Avg Response", value: "0ms", trend: "0%", color: "text-muted-foreground" },
                   { label: "Active Integrations", value: "0", trend: "0%", color: "text-muted-foreground" },
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[11px] font-bold text-muted-foreground">{stat.label}</p>
                         <p className="text-xl font-black text-foreground">{stat.value}</p>
                      </div>
                      <div className={cn("text-[10px] font-black", stat.color)}>{stat.trend}</div>
                   </div>
                 ))}
              </div>

              <Button className="w-full h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">API Documentation</Button>
           </div>

           {/* Quick Actions */}
           <SettingsCard title="Integration Tools" icon={Terminal}>
              <div className="space-y-2">
                 <button className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all text-[11px] font-bold text-foreground">
                    <span>Test Webhook Payload</span>
                    <ArrowUpRight size={14} className="text-muted-foreground" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all text-[11px] font-bold text-foreground">
                    <span>View Integration Logs</span>
                    <History size={14} className="text-muted-foreground" />
                 </button>
              </div>
           </SettingsCard>
        </div>
      </div>
    </div>
  );
}
