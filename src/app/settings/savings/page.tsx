'use client';

import React from'react';
import SettingsHeader from'@/components/settings/SettingsHeader';
import SettingsCard from'@/components/settings/SettingsCard';
import SettingsField from'@/components/settings/SettingsField';
import { 
 Wallet, 
 TrendingUp, 
 ShieldCheck, 
 Coins, 
 Lock as LockIcon, 
 Activity, 
 BarChart3, 
 ChevronRight,
 ArrowUpRight,
 Percent,
 Clock,
 Briefcase,
 AlertTriangle,
 Zap,
 CheckCircle2
} from'lucide-react';
import { Switch } from"@/components/ui/switch";
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";

export default function SavingsInvestmentControls() {
 return (
 <div className="space-y-10">
 <SettingsHeader 
 title="Savings & Investment Controls" 
 description=""
 />

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 <div className="xl:col-span-2 space-y-8">
 {/* Interest Rates & Yields */}
 <SettingsCard 
 title="Yield & Interest Configuration" 
 description=""
 icon={Percent}
 >
 <div className="space-y-6">
 {([] as any[]).map((product, i) => (
 <div key={i} className="p-6 bg-secondary/30 border border-border/20 rounded-[32px] flex items-center justify-between group hover:border-primary/30 transition-all">
 <div className="flex items-center gap-5">
 <div className="p-3 bg-background border border-border/40 rounded-2xl text-primary">
 <product.icon size={20} />
 </div>
 <div className="space-y-1">
 <h5 className="text-[14px] font-black text-foreground">{product.label}</h5>
 <p className="text-[10px] font-bold text-muted-foreground uppercase">Current APY</p>
 </div>
 </div>
 <div className="flex items-center gap-8">
 <div className="text-right">
 <p className="text-[20px] font-black text-primary tracking-tighter">{product.apy}</p>
 <p className="text-[10px] font-bold text-emerald-500 uppercase">{product.trend}</p>
 </div>
 <Button variant="outline" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-9">
 Adjust
 </Button>
 </div>
 </div>
 ))}
 </div>
 </SettingsCard>

 {/* Operational Rules */}
 <SettingsCard 
 title="Operational Constraints" 
 description=""
 icon={Activity}
 >
 <div className="space-y-2">
 <SettingsField 
 label="Early Liquidation Penalty" 
 description=""
 icon={AlertTriangle}
 >
 <div className="flex items-center gap-2">
 <span className="text-[12px] font-black text-foreground">25%</span>
 <span className="text-[9px] font-bold text-muted-foreground uppercase">of interest</span>
 </div>
 </SettingsField>

 <SettingsField 
 label="Auto-Rollover Default" 
 description=""
 icon={Clock}
 >
 <Switch defaultChecked={true} />
 </SettingsField>

 <SettingsField 
 label="Partial Liquidation" 
 description=""
 icon={Briefcase}
 >
 <Switch defaultChecked={false} />
 </SettingsField>
 </div>
 </SettingsCard>

 {/* Asset Allocation */}
 <SettingsCard 
 title="Portfolio Rebalancing" 
 description=""
 icon={BarChart3}
 >
 <div className="space-y-6">
 {([] as any[]).map((asset, i) => (
 <div key={i} className="space-y-3">
 <div className="flex justify-between items-end">
 <div className="space-y-0.5">
 <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{asset.label}</span>
 <p className="text-[9px] font-bold text-muted-foreground uppercase">Risk Level: {asset.risk}</p>
 </div>
 <span className="text-[12px] font-black text-foreground">{asset.allocation}%</span>
 </div>
 <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
 <div className="h-full bg-primary rounded-full" style={{ width:`${asset.allocation}%` }} />
 </div>
 </div>
 ))}
 <Button className="w-full h-11 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-primary text-white">
 Rebalance Treasury
 </Button>
 </div>
 </SettingsCard>
 </div>

 <div className="xl:col-span-1 space-y-8">
 {/* Fund Health */}
 <div className="p-8 bg-card border border-border/40 rounded-[32px] space-y-8 shadow-xl shadow-black/5">
 <div className="flex justify-between items-start">
 <div className="space-y-1">
 <p className="text-[10px] font-black uppercase tracking-widest text-primary flex items-center gap-2">
 <Coins size={14} />
 Total AUM
 </p>
 <h3 className="text-3xl font-black text-foreground tracking-tighter">₦0.00</h3>
 <p className="text-[12px] font-medium text-muted-foreground">Assets Under Management</p>
 </div>
 <div className="p-3 bg-primary/10 rounded-2xl text-primary">
 <BarChart3 size={20} />
 </div>
 </div>

 <div className="space-y-6">
 <div className="space-y-2">
 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
 <span>Liabilities</span>
 <span>₦0.00</span>
 </div>
 <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
 <div className="h-full bg-amber-500 rounded-full" style={{ width:"0%" }} />
 </div>
 </div>
 <div className="space-y-2">
 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
 <span>Treasury Reserve</span>
 <span>₦0.00</span>
 </div>
 <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
 <div className="h-full bg-emerald-500 rounded-full" style={{ width:"0%" }} />
 </div>
 </div>
 </div>

 <div className="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-2xl flex items-center gap-3">
 <CheckCircle2 size={16} className="text-emerald-500" />
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Reserve Ratio Status: --</p>
 </div>
 </div>

 {/* Product Performance */}
 <SettingsCard 
 title="Active Maturation" 
 description=""
 icon={Zap}
 >
 <div className="space-y-4">
 {([] as any[]).map((item, i) => (
 <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/10 rounded-2xl">
 <div className="space-y-0.5">
 <p className="text-[12px] font-black text-foreground">{item.amount}</p>
 <p className="text-[9px] font-bold text-muted-foreground uppercase">{item.product}</p>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-black text-primary uppercase">{item.date}</p>
 <p className="text-[8px] font-bold text-muted-foreground uppercase">Maturing</p>
 </div>
 </div>
 ))}
 <Button variant="ghost" className="w-full text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
 View Maturity Calendar
 </Button>
 </div>
 </SettingsCard>

 {/* Risk Management */}
 <SettingsCard 
 title="Yield Governance" 
 description=""
 icon={ShieldCheck}
 >
 <div className="space-y-2">
 <SettingsField label="Auto-Yield Throttle" description="">
 <Switch defaultChecked={true} />
 </SettingsField>
 <SettingsField label="Liquidity Buffer" description="">
 <Switch defaultChecked={true} />
 </SettingsField>
 </div>
 </SettingsCard>
 </div>
 </div>
 </div>
 );
}
