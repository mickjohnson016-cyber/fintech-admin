'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  CreditCard, 
  ShieldAlert, 
  Zap, 
  History, 
  TrendingUp, 
  Activity, 
  AlertTriangle,
  ArrowRightLeft,
  Clock,
  Ban,
  ShieldCheck,
  CheckCircle2,
  Percent,
  Coins,
  ChevronRight
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";

export default function TransactionControls() {
  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Transaction Controls" 
        description="Configure platform-wide transaction limits, fraud thresholds, and automated settlement rules."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Global Limits */}
          <SettingsCard 
            title="Global Transaction Limits" 
            description="Set maximum allowable amounts for different transaction types across the platform."
            icon={TrendingUp}
          >
            <div className="space-y-8">
              <div className="space-y-6">
                {[
                  { label: "Daily Transfer Limit", desc: "Maximum cumulative outgoing transfers per user.", value: "₦5,000,000", max: 10000000, current: 5000000 },
                  { label: "Single Transaction Cap", desc: "Hard limit for any single transaction attempt.", value: "₦1,000,000", max: 5000000, current: 1000000 },
                  { label: "Daily Bill Payment Limit", desc: "Airtime, Data, and Utility total per user.", value: "₦250,000", max: 1000000, current: 250000 },
                ].map((limit, i) => (
                  <div key={i} className="space-y-5 p-6 bg-secondary/30 border border-border/20 rounded-[28px] hover:border-primary/20 hover:bg-secondary/40 transition-all group">
                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <p className="text-[14px] font-black text-foreground tracking-tight truncate">{limit.label}</p>
                        <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">{limit.desc}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-lg font-black text-primary tracking-tighter">{limit.value}</p>
                        <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">Max: {limit.max.toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="px-1">
                      <Slider defaultValue={[limit.current]} max={limit.max} step={10000} className="py-2" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SettingsCard>

          {/* Fraud & AML Rules */}
          <SettingsCard 
            title="Fraud & Risk Engine" 
            description="Configure automated triggers and velocity checks to prevent illicit activity."
            icon={ShieldAlert}
          >
            <div className="space-y-2">
              <SettingsField 
                label="Transaction Velocity Check" 
                description="Flag users attempting more than 10 transactions within a 5-minute window."
                icon={Activity}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="Auto-Freeze High Risk" 
                description="Automatically freeze accounts flagged by the AML scoring system (Score > 85)."
                icon={Ban}
              >
                <Switch defaultChecked={false} />
              </SettingsField>

              <SettingsField 
                label="Sanction List Matching" 
                description="Cross-reference all recipients against international and local sanction lists."
                icon={ShieldCheck}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="Manual Review Threshold" 
                description="Transactions above this amount require human authorization before settlement."
                icon={CheckCircle2}
              >
                <div className="flex items-center gap-3">
                   <span className="text-[12px] font-black text-foreground">₦</span>
                   <input 
                    type="text" 
                    defaultValue="500,000"
                    className="w-24 bg-background border border-border/40 rounded-xl px-3 py-1.5 text-[12px] font-black outline-none focus:border-primary/40 transition-all text-right"
                   />
                </div>
              </SettingsField>
            </div>
          </SettingsCard>

          {/* Settlement Windows */}
          <SettingsCard 
            title="Settlement & Reversals" 
            description="Configure the timing for fund movements and reversal policies."
            icon={ArrowRightLeft}
          >
            <div className="space-y-2">
              <SettingsField 
                label="Standard Settlement Window" 
                description="Default time to settle successful transactions to provider accounts."
                icon={Clock}
              >
                <select defaultValue="Next Day (T+1)" className="bg-secondary/50 border border-border/40 rounded-xl px-4 py-2 text-[12px] font-black uppercase outline-none focus:border-primary/40 transition-all">
                  <option>Instant (T+0)</option>
                  <option>Next Day (T+1)</option>
                  <option>48 Hours (T+2)</option>
                </select>
              </SettingsField>

              <SettingsField 
                label="Auto-Reversal on Provider Fail" 
                description="Instantly refund users if provider API returns a terminal failure code."
                icon={History}
              >
                <Switch defaultChecked={true} />
              </SettingsField>
            </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Operational Status */}
          <div className="p-8 bg-card border border-border/40 rounded-[32px] space-y-8 shadow-xl shadow-black/5">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                <Activity size={14} />
                Real-time Velocity
              </div>
              <h3 className="text-3xl font-black text-foreground tracking-tighter">Normal</h3>
              <p className="text-[13px] font-medium text-muted-foreground leading-relaxed">
                Platform is currently processing 42 transactions per second. All within safety thresholds.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { label: "Successful", val: "99.8%", color: "text-emerald-500" },
                { label: "Flagged", val: "0.15%", color: "text-amber-500" },
                { label: "Failed", val: "0.05%", color: "text-red-500" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">{stat.label}</span>
                  <span className={cn("text-[14px] font-black", stat.color)}>{stat.val}</span>
                </div>
              ))}
            </div>

            <div className="h-24 w-full bg-secondary/30 rounded-2xl flex items-end gap-1 p-4">
              {[40, 60, 45, 80, 55, 70, 90, 65, 50, 75, 85, 60].map((h, i) => (
                <div key={i} className="flex-1 bg-primary/20 hover:bg-primary/40 transition-all rounded-t-sm" style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <SettingsCard 
            title="Emergency Controls" 
            description="Immediate actions for crisis management."
            icon={AlertTriangle}
          >
            <div className="flex flex-col gap-3">
              <Button variant="outline" className="w-full h-auto py-3 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-red-500/20 text-red-500 hover:bg-red-500/10 flex items-center justify-start gap-3 whitespace-normal text-left">
                <Ban size={18} className="shrink-0" />
                <span>Global Transaction Freeze</span>
              </Button>
              <Button variant="outline" className="w-full h-auto py-3 px-4 rounded-2xl font-black text-[10px] uppercase tracking-widest border-amber-500/20 text-amber-500 hover:bg-amber-500/10 flex items-center justify-start gap-3 whitespace-normal text-left">
                <ShieldAlert size={18} className="shrink-0" />
                <span>Enforce Strict AML Mode</span>
              </Button>
            </div>
          </SettingsCard>

          {/* Commission & Fees */}
          <SettingsCard 
            title="Fee Configuration" 
            description="Manage platform service charges."
            icon={Coins}
          >
            <div className="space-y-4">
              {[
                { label: "Outward Transfer", fee: "₦10.00", type: "Flat" },
                { label: "Bill Payments", fee: "1.5%", type: "Percentage" },
                { label: "International", fee: "2.0%", type: "Percentage" },
              ].map((fee, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/10 rounded-2xl">
                   <div className="space-y-0.5">
                     <p className="text-[12px] font-black text-foreground">{fee.label}</p>
                     <p className="text-[9px] font-bold text-muted-foreground uppercase">{fee.type}</p>
                   </div>
                   <div className="flex items-center gap-3">
                     <span className="text-[13px] font-black text-primary">{fee.fee}</span>
                     <ChevronRight size={14} className="text-muted-foreground/30" />
                   </div>
                </div>
              ))}
              <Button className="w-full h-11 rounded-2xl font-black text-[11px] uppercase tracking-widest">
                Edit Fee Schedule
              </Button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
