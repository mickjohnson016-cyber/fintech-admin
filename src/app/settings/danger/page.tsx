'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  AlertTriangle, 
  Trash2, 
  RotateCcw, 
  Ban, 
  ShieldAlert, 
  History, 
  XOctagon, 
  Zap,
  ChevronRight,
  ShieldX,
  Database,
  Key,
  Lock as LockIcon
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function DangerZone() {
  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Danger Zone" 
        description="Irreversible actions and emergency platform controls. Exercise extreme caution when modifying these settings."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Destructive Actions */}
          <SettingsCard 
            title="Irreversible Configuration Changes" 
            description="These actions will permanently modify or delete platform data and configurations."
            icon={AlertTriangle}
            badge="Extreme Caution"
            badgeVariant="danger"
          >
            <div className="space-y-2">
              <SettingsField 
                label="Revoke All Administrative Access" 
                description="Immediately invalidate all active admin sessions and API keys. Use only in case of a major security breach."
                icon={Ban}
              >
                <Button variant="outline" className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-red-500/20 text-red-500 hover:bg-red-500/10">
                   Revoke All
                </Button>
              </SettingsField>

              <SettingsField 
                label="Reset System AML Thresholds" 
                description="Wipe all custom AML rules and revert to platform defaults. This will impact fraud detection immediately."
                icon={RotateCcw}
              >
                <Button variant="outline" className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-amber-500/20 text-amber-500 hover:bg-amber-500/10">
                   Reset Defaults
                </Button>
              </SettingsField>

              <SettingsField 
                label="Clear Provider Cache" 
                description="Flush all cached provider responses. May cause temporary latency spikes as data is refetched."
                icon={Zap}
              >
                <Button variant="outline" className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40 text-muted-foreground">
                   Clear Cache
                </Button>
              </SettingsField>

              <SettingsField 
                label="Archive System Audit Logs" 
                description="Move all audit logs older than 2 years to offline storage. They will no longer be searchable in the dashboard."
                icon={History}
              >
                <Button variant="outline" className="h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40 text-muted-foreground">
                   Archive Logs
                </Button>
              </SettingsField>
            </div>
          </SettingsCard>

          {/* Emergency Platform State */}
          <SettingsCard 
            title="Emergency Platform Controls" 
            description="Global overrides for critical platform functionality."
            icon={ShieldAlert}
          >
             <div className="space-y-6">
                <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-[32px] space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-500 text-white rounded-2xl">
                         <XOctagon size={24} />
                      </div>
                      <div className="space-y-1">
                         <h5 className="text-[16px] font-black text-foreground">Global Platform Freeze</h5>
                         <p className="text-[12px] font-medium text-muted-foreground">Immediately stop all transactions, withdrawals, and bill payments across OINZpay.</p>
                      </div>
                   </div>
                   <Button className="w-full h-12 bg-red-500 hover:bg-red-600 text-white rounded-2xl font-black text-[12px] uppercase tracking-[0.2em] shadow-xl shadow-red-500/20">
                      Initiate Global Freeze
                   </Button>
                </div>

                <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-[32px] space-y-4">
                   <div className="flex items-center gap-4">
                      <div className="p-3 bg-amber-500 text-white rounded-2xl">
                         <ShieldX size={24} />
                      </div>
                      <div className="space-y-1">
                         <h5 className="text-[16px] font-black text-foreground">Mandatory Password Reset</h5>
                         <p className="text-[12px] font-medium text-muted-foreground">Force all administrative users to reset their passwords on next login.</p>
                      </div>
                   </div>
                   <Button variant="outline" className="w-full h-12 border-amber-500/40 text-amber-500 hover:bg-amber-500/5 rounded-2xl font-black text-[12px] uppercase tracking-[0.2em]">
                      Force Reset for 12 Admins
                   </Button>
                </div>
             </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Access Verification */}
          <div className="p-8 bg-card border border-border/40 rounded-[32px] space-y-6 shadow-xl shadow-black/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <LockIcon size={100} className="text-red-500" />
             </div>
             
             <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-red-500">Security Requirement</p>
                <h3 className="text-2xl font-black text-foreground tracking-tighter">Multi-Sig Approval</h3>
                <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                  Actions in the Danger Zone require authorization from at least two Super Admins.
                </p>
             </div>

             <div className="space-y-4 relative z-10">
                <div className="p-4 bg-secondary/30 border border-border/10 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 font-black text-[10px]">MJ</div>
                      <span className="text-[12px] font-black text-foreground">Mick Jagger</span>
                   </div>
                   <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500">Authorized</span>
                </div>
                <div className="p-4 bg-secondary/30 border border-border/10 rounded-2xl flex items-center justify-between opacity-50">
                   <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground font-black text-[10px]">??</div>
                      <span className="text-[12px] font-black text-foreground">Waiting for Admin...</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Database Reset Preview */}
          <SettingsCard 
            title="Database Operations" 
            description="Dangerous database-level commands."
            icon={Database}
          >
            <div className="space-y-4">
               <div className="p-4 bg-secondary/30 border border-border/10 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] font-black uppercase text-foreground">Staging Environment</p>
                    <span className="text-[9px] font-bold text-muted-foreground uppercase">Inactive</span>
                  </div>
                  <Button variant="outline" className="w-full h-10 rounded-xl font-black text-[10px] uppercase tracking-widest border-red-500/20 text-red-500 hover:bg-red-500/10">
                     Wipe Staging DB
                  </Button>
               </div>
               <p className="text-[11px] font-medium text-muted-foreground leading-snug px-2">
                 Wiping the staging database is irreversible and will delete all test users and transactions.
               </p>
            </div>
          </SettingsCard>

          {/* API Key Revocation */}
          <SettingsCard 
            title="Secret Revocation" 
            description="Immediate key invalidation."
            icon={Key}
          >
            <div className="space-y-3">
               <Button variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40 text-muted-foreground hover:text-red-500">
                 Revoke Mobile SDK Keys
               </Button>
               <Button variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40 text-muted-foreground hover:text-red-500">
                 Revoke Internal Node Keys
               </Button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
