'use client';

import React, { useState } from 'react';
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
  AlertTriangle,
  Loader2,
  CheckCircle2,
  Plus
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { QuickActionModal } from '@/components/ui/QuickActionModal';

interface Provider {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'maintenance';
  latency: string;
  uptime: string;
  icon: any;
  color: string;
  bg: string;
}

export default function ProviderControls() {
  const [providers, setProviders] = useState<Provider[]>([]);

  const [isRetrying, setIsRetrying] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<Provider | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Bill Payment & Provider Controls" 
        description="Monitor and manage upstream utility providers, telco APIs, and payment gateway integrations."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Provider Directory */}
          <SettingsCard 
            title="Service Integrations" 
            description="Operational controls for all third-party utility APIs."
            icon={Zap}
          >
            <div className="space-y-4">
               {providers.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {providers.map((provider) => (
                     <div key={provider.id} className="p-5 bg-secondary/10 border border-border/5 rounded-[28px] hover:border-primary/20 hover:bg-secondary/20 transition-all group relative">
                        <div className="flex items-start justify-between mb-6">
                           <div className={cn("size-12 rounded-2xl flex items-center justify-center border border-border/10 shadow-inner", provider.bg, provider.color)}>
                              <provider.icon size={24} />
                           </div>
                           <div className="flex flex-col items-end gap-2">
                              <span className={cn(
                                "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                                provider.status === 'online' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/50"
                              )}>{provider.status}</span>
                              <Switch 
                                checked={provider.status === 'online'} 
                                onCheckedChange={(enabled) => {
                                  setProviders(prev => prev.map(p => p.id === provider.id ? { ...p, status: enabled ? 'online' : 'offline' } : p));
                                  toast.success(enabled ? 'Provider Enabled' : 'Provider Disabled');
                                }} 
                              />
                           </div>
                        </div>
                        <h4 className="text-[13px] font-black text-foreground tracking-tight mb-1">{provider.name}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">{provider.type}</p>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/5">
                           <div className="space-y-1">
                              <p className="text-[8px] font-black text-muted-foreground/40 uppercase">Latency</p>
                              <p className="text-[12px] font-black text-foreground">{provider.latency}</p>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[8px] font-black text-muted-foreground/40 uppercase">Uptime</p>
                              <p className="text-[12px] font-black text-foreground">{provider.uptime}</p>
                           </div>
                        </div>
                        <button 
                          onClick={() => { setSelectedProvider(provider); setIsEditModalOpen(true); }}
                          className="absolute bottom-4 right-4 p-2 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-primary opacity-0 group-hover:opacity-100 transition-all"
                        >
                           <Settings2 size={14} />
                        </button>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-20 text-center border-2 border-dashed border-border/10 rounded-[40px]">
                    <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                      <Zap size={32} />
                    </div>
                    <h4 className="text-[14px] font-black text-foreground uppercase tracking-widest">No active integrations</h4>
                    <p className="text-[12px] font-medium text-muted-foreground mt-2 max-w-xs mx-auto">Configure your first upstream provider to begin routing traffic.</p>
                    <Button variant="outline" className="mt-8 h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40">
                       Add New Provider
                    </Button>
                 </div>
               )}
            </div>
          </SettingsCard>

          {/* Failover Policy */}
          <SettingsCard 
            title="Failover & Routing Engine" 
            description="Intelligent traffic switching during upstream maintenance or outages."
            icon={RefreshCcw}
          >
             <div className="space-y-6">
                <SettingsField label="Automatic Failover" description="Switch to backup provider when primary latency exceeds 200ms." icon={ShieldAlert}>
                   <Switch />
                </SettingsField>
                <div className="p-6 bg-primary/5 border border-primary/10 rounded-[28px] space-y-4">
                   <div className="flex items-center gap-2">
                      <Activity size={14} className="text-primary" />
                      <span className="text-[10px] font-black uppercase text-primary tracking-widest">Dynamic Priority Matrix</span>
                   </div>
                   <div className="py-8 text-center opacity-20">
                      <p className="text-[10px] font-black uppercase tracking-widest">No priority rules defined</p>
                   </div>
                   <Button variant="ghost" className="w-full h-10 border border-primary/20 text-primary text-[10px] font-black uppercase tracking-widest rounded-xl">Define Backup Route</Button>
                </div>
             </div>
          </SettingsCard>
        </div>

        <div className="space-y-8">
           {/* Global Metrics */}
           <div className="p-8 bg-card border border-border/40 rounded-[40px] space-y-8 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                    <Gauge size={20} />
                 </div>
                 <h3 className="text-[14px] font-black uppercase tracking-widest">Performance</h3>
              </div>
              
              <div className="space-y-6">
                 {[
                   { label: "Avg Handshake", value: "0ms", trend: "0%", color: "text-muted-foreground" },
                   { label: "Successful Hops", value: "0", trend: "0%", color: "text-muted-foreground" },
                   { label: "Revenue Leakage", value: "₦0.00", trend: "0%", color: "text-muted-foreground" },
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

              <Button className="w-full h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Refresh Health Status</Button>
           </div>

           {/* Emergency Controls */}
           <div className="p-8 bg-rose-500/5 border border-rose-500/10 rounded-[40px] space-y-6">
              <div className="flex items-center gap-3 text-rose-500">
                 <AlertTriangle size={20} />
                 <h3 className="text-[14px] font-black uppercase tracking-widest">Emergency</h3>
              </div>
              <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
                 Immediately suspend all bill payment processing across the platform in case of critical upstream breach or fraud.
              </p>
              <Button variant="outline" className="w-full h-12 rounded-xl border-rose-500/30 text-rose-500 hover:bg-rose-500 hover:text-white font-black text-[10px] uppercase tracking-widest transition-all">Global Kill-Switch</Button>
           </div>
        </div>
      </div>

      <QuickActionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onConfirm={() => setIsEditModalOpen(false)}
        title="Configure Provider"
        description={`Modify the operational parameters for ${selectedProvider?.name}.`}
        icon={Settings2}
        confirmLabel="Update Configuration"
      >
        <div className="space-y-4">
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Profit Margin (%)</label>
              <input type="number" defaultValue="2.5" className="w-full bg-secondary/50 border border-border/20 rounded-xl p-4 text-[13px] font-bold outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-muted-foreground tracking-widest ml-1">Connection Timeout (ms)</label>
              <input type="number" defaultValue="5000" className="w-full bg-secondary/50 border border-border/20 rounded-xl p-4 text-[13px] font-bold outline-none" />
           </div>
        </div>
      </QuickActionModal>
    </div>
  );
}
