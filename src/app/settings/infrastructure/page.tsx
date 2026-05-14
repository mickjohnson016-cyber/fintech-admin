'use client';

import React, { useState } from'react';
import SettingsHeader from'@/components/settings/SettingsHeader';
import SettingsCard from'@/components/settings/SettingsCard';
import SettingsField from'@/components/settings/SettingsField';
import { 
 Server, 
 Cpu, 
 Database, 
 Activity, 
 ShieldCheck, 
 RefreshCcw, 
 History, 
 AlertTriangle,
 ChevronRight,
 HardDrive,
 Network,
 Terminal,
 Zap,
 CheckCircle2,
 Loader2,
 X,
 Gauge
} from'lucide-react';
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { toast } from'sonner';

interface Node {
 id: string;
 name: string;
 region: string;
 status:'healthy' |'warning' |'error';
 load: number;
}

export default function InfrastructureMonitoring() {
 const [nodes, setNodes] = useState<Node[]>([
 { id: 'node-1', name: 'Primary API Gateway', region: 'NG-LAG-1', status: 'healthy', load: 42 },
 { id: 'node-2', name: 'Transaction Processor', region: 'NG-LAG-2', status: 'healthy', load: 68 },
 { id: 'node-3', name: 'Auth & Identity Node', region: 'EU-LON-1', status: 'warning', load: 89 }
 ]);
 const [isRecycling, setIsRecycling] = useState<string | null>(null);

 const handleRecycle = (nodeId: string) => {
 setIsRecycling(nodeId);
 toast.loading('Initiating node recycle...', { id: `recycle-${nodeId}` });
 
 setTimeout(() => {
 setIsRecycling(null);
 setNodes(prev => prev.map(n => n.id === nodeId ? { ...n, status: 'healthy', load: 12 } : n));
 toast.success('Node Recycled Successfully', { id: `recycle-${nodeId}`, description: 'Traffic has been re-routed to the fresh instance.' });
 }, 2500);
 };

 return (
 <div className="space-y-10">
 <SettingsHeader 
 title="Infrastructure & SRE Monitoring" 
 description=""
 />

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 <div className="xl:col-span-2 space-y-8">
 {/* Cluster Health */}
 <SettingsCard 
 title="Compute Cluster Management" 
 description=""
 icon={Server}
 >
 <div className="space-y-4">
 {nodes.length > 0 ? (
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 {nodes.map((node) => (
 <div key={node.id} className="p-5 bg-secondary/10 border border-border/5 rounded-[28px] hover:border-primary/20 transition-all group">
 <div className="flex items-start justify-between mb-6">
 <div className="size-12 rounded-2xl bg-background border border-border/10 flex items-center justify-center text-primary shadow-sm">
 <Cpu size={24} />
 </div>
 <div className={cn(
"px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
 node.status ==='healthy' ?"bg-emerald-500/10 text-emerald-500 border-emerald-500/20" :"bg-rose-500/10 text-rose-500 border-rose-500/20"
 )}>{node.status}</div>
 </div>
 <h4 className="text-[13px] font-black text-foreground tracking-tight mb-1">{node.name}</h4>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">{node.region}</p>
 <div className="space-y-2">
 <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
 <span className="text-muted-foreground/40">CPU LOAD</span>
 <span className="text-foreground">{node.load}%</span>
 </div>
 <div className="h-1.5 bg-secondary rounded-full overflow-hidden">
 <div className="h-full bg-primary transition-all" style={{ width:`${node.load}%` }} />
 </div>
 </div>
 <div className="pt-6 mt-6 border-t border-border/5 flex gap-2">
 <Button 
 onClick={() => handleRecycle(node.id)}
 disabled={isRecycling === node.id}
 className="flex-1 h-10 bg-secondary hover:bg-secondary/80 text-foreground text-[10px] font-black uppercase tracking-widest rounded-xl"
 >
 {isRecycling === node.id ? <Loader2 className="animate-spin" size={14} /> : <RefreshCcw size={14} />}
 Recycle
 </Button>
 </div>
 </div>
 ))}
 </div>
 ) : (
 <div className="py-20 text-center border-2 border-dashed border-border/10 rounded-[40px]">
 <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
 <Server size={32} />
 </div>
 <h4 className="text-[14px] font-black text-foreground uppercase tracking-widest">No nodes detected</h4>
 <p className="text-[12px] font-medium text-muted-foreground mt-2 max-w-xs mx-auto">Initialize your cluster by connecting your first compute instance.</p>
 <Button variant="outline" className="mt-8 h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40">Register Node</Button>
 </div>
 )}
 </div>
 </SettingsCard>

 {/* Database & Replication */}
 <SettingsCard 
 title="Data Persistance Layer" 
 description=""
 icon={Database}
 >
 <div className="p-8 bg-primary/5 border border-primary/10 rounded-[28px] space-y-6">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="size-10 rounded-xl bg-background border border-primary/20 flex items-center justify-center text-primary">
 <Database size={20} />
 </div>
 <div className="space-y-0.5">
 <p className="text-[13px] font-black text-foreground">Main Postgres Cluster</p>
 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Status: Ready</p>
 </div>
 </div>
 <div className="text-right">
 <p className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">Replication Lag</p>
 <p className="text-lg font-black text-foreground">0ms</p>
 </div>
 </div>
 <div className="grid grid-cols-3 gap-6 pt-6 border-t border-primary/10">
 {[
 { label:"Storage Used", value:"0%" },
 { label:"Active Conns", value:"0" },
 { label:"IOPS Peak", value:"0" },
 ].map((metric, i) => (
 <div key={i} className="space-y-1">
 <p className="text-[9px] font-black text-muted-foreground/40 uppercase tracking-widest">{metric.label}</p>
 <p className="text-[13px] font-black text-foreground">{metric.value}</p>
 </div>
 ))}
 </div>
 </div>
 </SettingsCard>
 </div>

 <div className="space-y-8">
 {/* Global Telemetry */}
 <div className="p-8 bg-card border border-border/40 rounded-[40px] space-y-8 shadow-sm">
 <div className="flex items-center gap-3">
 <div className="size-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
 <Gauge size={20} />
 </div>
 <h3 className="text-[14px] font-black uppercase tracking-widest">Telemetry</h3>
 </div>
 
 <div className="space-y-6">
 {[
 { label:"Global Latency", value:"0ms", trend:"0%", color:"text-muted-foreground" },
 { label:"Requests/Sec", value:"0", trend:"0%", color:"text-muted-foreground" },
 { label:"Error Rate", value:"0.00%", trend:"0%", color:"text-muted-foreground" },
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

 <Button className="w-full h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">System Snapshot</Button>
 </div>

 {/* SRE Toolkit */}
 <SettingsCard title="SRE Toolkit" icon={Terminal}>
 <div className="space-y-2">
 {[
 { label:"Flush Global Cache", icon: RefreshCcw },
 { label:"Run Data Migration", icon: HardDrive },
 { label:"DNS Propagation Check", icon: Network },
 ].map((tool, i) => (
 <button key={i} className="w-full flex items-center justify-between p-4 bg-secondary/30 rounded-xl hover:bg-secondary/50 transition-all text-[11px] font-bold text-foreground">
 <span>{tool.label}</span>
 <tool.icon size={14} className="text-muted-foreground" />
 </button>
 ))}
 </div>
 </SettingsCard>
 </div>
 </div>
 </div>
 );
}
