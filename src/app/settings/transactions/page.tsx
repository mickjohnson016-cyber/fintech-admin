'use client';

import React, { useState } from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  ArrowRightLeft, 
  ShieldCheck, 
  Ban, 
  Percent, 
  Wallet, 
  AlertCircle,
  Clock,
  History,
  ShieldAlert,
  ArrowUpRight,
  Filter,
  CheckCircle2,
  X,
  CreditCard,
  Zap,
  DollarSign
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { QuickActionModal } from '@/components/ui/QuickActionModal';

export default function TransactionControls() {
  const [globalFreeze, setGlobalFreeze] = useState(false);
  const [strictAML, setStrictAML] = useState(false);
  const [feeRules, setFeeRules] = useState<any[]>([]);

  const handleToggleFreeze = (enabled: boolean) => {
    setGlobalFreeze(enabled);
    if (enabled) {
      toast.error('Global Freeze Active', { description: 'All outgoing transactions have been suspended.' });
    } else {
      toast.success('System Thawed', { description: 'Transaction processing resumed.' });
    }
  };

  const handleDeleteRule = (id: string) => {
    setFeeRules(prev => prev.filter(r => r.id !== id));
    toast.error('Fee Rule Removed');
  };

  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Transaction & Fraud Controls" 
        description="Configure platform limits, transaction fee matrices, and real-time fraud mitigation rules."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Global Guardrails */}
          <SettingsCard 
            title="Operational Guardrails" 
            description="High-level circuit breakers for platform-wide liquidity and security."
            icon={ShieldCheck}
          >
            <div className="space-y-6">
               <SettingsField label="Global Transaction Freeze" description="Instantly kill all transaction processing. Use for emergency downtime." icon={Ban}>
                  <Switch checked={globalFreeze} onCheckedChange={handleToggleFreeze} />
               </SettingsField>
               <SettingsField label="Strict AML Mode" description="Require enhanced due diligence for all transactions regardless of amount." icon={ShieldAlert}>
                  <Switch checked={strictAML} onCheckedChange={setStrictAML} />
               </SettingsField>
            </div>
          </SettingsCard>

          {/* Limits & Thresholds */}
          <SettingsCard 
            title="Transaction Thresholds" 
            description="Configure maximum velocity and amount limits per account tier."
            icon={Wallet}
          >
             <div className="space-y-8">
                {[
                  { label: "Daily Transfer Limit", min: 0, max: 10000000, value: 0 },
                  { label: "Daily Bill Payment", min: 0, max: 500000, value: 0 },
                  { label: "Withdrawal Ceiling", min: 0, max: 2000000, value: 0 },
                ].map((limit, i) => (
                  <div key={i} className="space-y-4">
                     <div className="flex justify-between items-center">
                        <label className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">{limit.label}</label>
                        <span className="text-sm font-black text-foreground">₦{limit.value.toLocaleString()}</span>
                     </div>
                     <input type="range" className="w-full h-1.5 bg-secondary rounded-full appearance-none cursor-pointer accent-primary" />
                     <div className="flex justify-between text-[8px] font-black text-muted-foreground/40 uppercase tracking-tighter">
                        <span>Min: ₦{limit.min.toLocaleString()}</span>
                        <span>Max: ₦{limit.max.toLocaleString()}</span>
                     </div>
                  </div>
                ))}
                <Button className="w-full h-12 rounded-xl bg-primary text-white font-black text-[10px] uppercase tracking-widest shadow-xl shadow-primary/20">Apply New Thresholds</Button>
             </div>
          </SettingsCard>

          {/* Fee Matrix */}
          <SettingsCard 
            title="Global Fee Matrix" 
            description="Rule-based fee calculations for platform-wide revenue generation."
            icon={Percent}
          >
             <div className="space-y-4">
                {feeRules.length > 0 ? (
                  feeRules.map((rule) => (
                    <div key={rule.id} className="p-4 bg-secondary/10 border border-border/5 rounded-2xl flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
                             <rule.icon size={20} />
                          </div>
                          <div>
                             <p className="text-[13px] font-black text-foreground">{rule.name}</p>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase">{rule.type}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-6">
                          <p className="text-[13px] font-black text-primary">{rule.value}</p>
                          <button onClick={() => handleDeleteRule(rule.id)} className="text-muted-foreground hover:text-rose-500 transition-colors">
                             <X size={16} />
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-border/10 rounded-[40px]">
                     <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                        <DollarSign size={32} />
                     </div>
                     <h4 className="text-[14px] font-black text-foreground uppercase tracking-widest">No fee rules configured</h4>
                     <p className="text-[12px] font-medium text-muted-foreground mt-2">Initialize your revenue model by creating your first fee rule.</p>
                     <Button variant="outline" className="mt-8 h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40">Create Fee Rule</Button>
                  </div>
                )}
             </div>
          </SettingsCard>
        </div>

        <div className="space-y-8">
           {/* Risk Summary */}
           <div className="p-8 bg-card border border-border/40 rounded-[40px] space-y-8 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                    <ShieldCheck size={20} />
                 </div>
                 <h3 className="text-[14px] font-black uppercase tracking-widest">Risk Engine</h3>
              </div>
              
              <div className="space-y-6">
                 {[
                   { label: "Flagged Trans.", value: "0", trend: "0%", color: "text-muted-foreground" },
                   { label: "Blocked IPs", value: "0", trend: "0%", color: "text-muted-foreground" },
                   { label: "System Uptime", value: "0%", trend: "0%", color: "text-muted-foreground" },
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

              <Button className="w-full h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Run Compliance Audit</Button>
           </div>

           {/* Quick Actions */}
           <SettingsCard title="Control Shortcuts" icon={Zap}>
              <div className="space-y-2">
                 <button className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all text-[11px] font-bold text-foreground">
                    <span>Export Risk Report</span>
                    <ArrowUpRight size={14} className="text-muted-foreground" />
                 </button>
                 <button className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all text-[11px] font-bold text-foreground">
                    <span>Purge Transaction Logs</span>
                    <History size={14} className="text-muted-foreground" />
                 </button>
              </div>
           </SettingsCard>
        </div>
      </div>
    </div>
  );
}
