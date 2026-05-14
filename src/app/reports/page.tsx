'use client';

import React, { useState } from'react';
import {
 BarChart3,
 TrendingUp,
 ArrowUpRight,
 Download,
 Filter,
 RefreshCw,
 Search,
 MoreHorizontal,
 ChevronDown,
 Calendar,
 PieChart as PieChartIcon,
 Activity,
 Users,
 ShieldAlert,
 BadgeCheck,
 AlertCircle,
 ExternalLink,
 MoreVertical,
 ArrowRight,
 ShieldCheck,
 Clock,
 Briefcase,
 Layers,
 ArrowDownRight,
 FileText,
 UserPlus
} from'lucide-react';
import {
 AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
 PieChart, Pie, Cell, LineChart, Line, Legend, BarChart, Bar
} from'recharts';
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { ChartWrapper } from'@/components/charts/ChartWrapper';
import { Card } from'@/components/ui/card';
import { motion } from'framer-motion';
import Breadcrumbs from'@/components/layout/Breadcrumbs';
import { executeExport } from'@/lib/exportUtils';
import { toast } from'sonner';
import { DashboardGrid } from'@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from'@/components/ui/AdaptiveMetricCard';
import { EmptyState } from'@/components/ui/EmptyState';

// 1. MOCK ANALYTICS DATA
const performanceMetrics = [
 { label:'Net Revenue', value:'₦0', trend:'--', up: null, icon: TrendingUp, color:'text-primary', bg:'bg-primary/10' },
 { label:'Active Users (MAU)', value:'0', trend:'--', up: null, icon: Users, color:'text-indigo-600', bg:'bg-indigo-50' },
 { label:'Retention Rate', value:'0%', trend:'--', up: null, icon: BadgeCheck, color:'text-emerald-600', bg:'bg-emerald-50' },
 { label:'Avg. LTV', value:'₦0', trend:'--', up: null, icon: Briefcase, color:'text-amber-600', bg:'bg-amber-50' },
 { label:'Churn Risk', value:'0%', trend:'--', up: null, icon: ShieldAlert, color:'text-rose-600', bg:'bg-rose-50' },
 { label:'Platform Uptime', value:'0%', trend:'--', up: null, icon: Activity, color:'text-emerald-600', bg:'bg-emerald-50' },
];

const revenueData: any[] = [];

const categoryData: any[] = [];

const providerLatency: any[] = [];

export default function AnalyticsPage() {
 const [activeMetric, setActiveMetric] = useState('Revenue');

 return (
 <div className="w-full space-y-4 animate-in fade-in duration-700 pb-10">
 <Breadcrumbs />

 {/* 2. HEADER */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
 <h1 className="text-2xl font-black text-foreground tracking-tight">Analytics & Insights</h1>
 
 </motion.div>

 <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-wrap items-center gap-2">
 <Button 
 onClick={() => executeExport({ 
 fileName:'PlatformPerformance', 
 data: [], 
 format:'PDF' 
 })} 
 variant="outline" 
 size="sm" 
 className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground"
 >
 <Download size={14} /> Download PDF Report
 </Button>
 <Button onClick={() => toast.success('Recalculating Insights...', { description:'Refreshing all platform metrics' })} size="sm" className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 font-bold shadow-lg shadow-primary/20 flex items-center gap-2 border-none transition-all">
 <RefreshCw size={14} /> Recalculate
 </Button>
 </motion.div>
 </div>

 {/* 3. KPI STATS ROW */}
 <DashboardGrid cols={6}>
 {performanceMetrics.map((stat, i) => (
 <AdaptiveMetricCard
 key={i}
 label={stat.label}
 value={stat.value}
 icon={stat.icon}
 trend={stat.trend !=='--' ? stat.trend : undefined}
 trendUp={stat.up}
 color={stat.color}
 />
 ))}
 </DashboardGrid>

 {/* 4. CHARTS SECTION */}
 <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

 {/* Revenue Growth */}
 <Card className="lg:col-span-8 p-6">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Revenue Growth</h3>
 <p className="text-[11px] font-bold text-muted-foreground uppercase mt-1 tracking-tight">Daily platform revenue & volume</p>
 </div>
 <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
 <button 
 onClick={() => setActiveMetric('Revenue')}
 className={cn(
"px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
 activeMetric ==='Revenue' ?"bg-secondary shadow-sm border border-primary/20 text-foreground" :"text-muted-foreground hover:text-foreground"
 )}
 >
 Revenue
 </button>
 <button 
 onClick={() => setActiveMetric('Volume')}
 className={cn(
"px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all",
 activeMetric ==='Volume' ?"bg-secondary shadow-sm border border-primary/20 text-foreground" :"text-muted-foreground hover:text-foreground"
 )}
 >
 Volume
 </button>
 </div>
 </div>
 {revenueData.length > 0 ? (
 <ChartWrapper height={300}>
 <AreaChart data={revenueData}>
 <defs>
 <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
 <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1} />
 <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
 </linearGradient>
 </defs>
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" vertical={false} />
 <XAxis dataKey="date" stroke="#64748B" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} dy={10} />
 <YAxis stroke="#64748B" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={(v) =>`₦${v / 1000000}M`} />
 <Tooltip
 contentStyle={{ backgroundColor:'#0D2340', border:'1px solid #11284A', borderRadius:'12px', boxShadow:'0 10px 30px rgba(0,0,0,0.5)', color:'#F8FAFC' }}
 itemStyle={{ color:'#F8FAFC', fontSize:'11px', fontWeight: 700 }}
 formatter={(value: any) => [`₦${(value / 1000000).toFixed(1)}M`,'Revenue']}
 />
 <Area type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={4} fillOpacity={1} fill="url(#colorRev)" />
 </AreaChart>
 </ChartWrapper>
 ) : (
 <div className="h-[300px] flex items-center justify-center">
 <EmptyState 
 icon={TrendingUp}
 title="Awaiting Revenue Data"
 description=""
 />
 </div>
 )}
 </Card>

 {/* Volume Distribution */}
 <Card className="lg:col-span-4 p-6 flex flex-col">
 <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">Volume Distribution</h3>
 <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight mb-8">Transactions by category</p>
 {categoryData.length > 0 ? (
 <ChartWrapper height={240}>
 <PieChart>
 <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
 {categoryData.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
 ))}
 </Pie>
 <Tooltip contentStyle={{ backgroundColor:'#0D2340', border:'1px solid #11284A', borderRadius:'12px', boxShadow:'0 10px 30px rgba(0,0,0,0.5)', color:'#F8FAFC' }} />
 </PieChart>
 </ChartWrapper>
 ) : (
 <div className="h-[240px] flex items-center justify-center">
 <EmptyState 
 compact
 title="No distribution data"
 />
 </div>
 )}
 <div className="space-y-3 mt-auto">
 {categoryData.length > 0 ? categoryData.map((cat, i) => (
 <div key={i} className="flex items-center justify-between">
 <div className="flex items-center gap-2">
 <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
 <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight">{cat.name}</span>
 </div>
 <span className="text-[11px] font-black text-foreground">{cat.value}%</span>
 </div>
 )) : (
 <p className="text-[10px] font-black text-center text-muted-foreground/30 uppercase tracking-widest py-4">No mix data</p>
 )}
 </div>
 </Card>

 </div>

 {/* 5. SECONDARY CHARTS */}
 <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

 {/* Provider Latency */}
 <Card className="p-6">
 <h3 className="text-sm font-black text-foreground uppercase tracking-widest mb-1">Provider Latency (ms)</h3>
 <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-tight mb-8">Real-time API response times</p>
 {providerLatency.length > 0 ? (
 <ChartWrapper height={250}>
 <BarChart data={providerLatency} layout="vertical">
 <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" horizontal={true} vertical={false} />
 <XAxis type="number" hide />
 <YAxis dataKey="name" type="category" stroke="#64748B" fontSize={10} fontWeight={700} axisLine={false} tickLine={false} width={80} />
 <Tooltip cursor={{ fill:'rgba(59, 130, 246, 0.05)' }} contentStyle={{ backgroundColor:'#0D2340', border:'1px solid #11284A', borderRadius:'12px', boxShadow:'0 10px 30px rgba(0,0,0,0.5)', color:'#F8FAFC' }} />
 <Bar dataKey="latency" fill="#3B82F6" radius={[0, 4, 4, 0]} barSize={20}>
 {providerLatency.map((entry, index) => (
 <Cell key={`cell-${index}`} fill={entry.latency > 500 ?'#F43F5E' : entry.latency > 150 ?'#F59E0B' :'#10B981'} />
 ))}
 </Bar>
 </BarChart>
 </ChartWrapper>
 ) : (
 <div className="h-[250px] flex items-center justify-center">
 <EmptyState 
 compact
 icon={BarChart3}
 title="No latency data available"
 />
 </div>
 )}
 </Card>

 {/* User Engagement */}
 <Card className="p-6 flex flex-col">
 <div className="flex items-center justify-between mb-8">
 <div>
 <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Anomaly Detection</h3>
 <p className="text-[11px] font-bold text-muted-foreground uppercase mt-1 tracking-tight">Flagged transaction patterns</p>
 </div>
 <ShieldCheck size={20} className="text-primary" />
 </div>
 <div className="space-y-4">
 { [].length > 0 ? [
 { title:'Concurrent Logins Spike', detail:'142 logins from unusual IP range in Nigeria', time:'12m ago', level:'Medium' },
 { title:'High-Value Transfer Loop', detail:'Duplicate transfers detected between users MJ-01 and AS-04', time:'45m ago', level:'High' },
 { title:'Failed Pin Attempts', detail:'30+ failed education pin requests from single device', time:'1h ago', level:'Low' },
 ].map((alert: any, i: number) => (
 <div key={i} onClick={() => toast("Coming Soon", { description:'Anomaly Forensic Explorer feature is being finalized.' })} className="p-4 bg-muted border border-border rounded-xl hover:bg-secondary hover:border-[#3B82F6]/30 transition-all cursor-pointer group">
 <div className="flex items-center justify-between mb-1">
 <span className="text-[12px] font-black text-foreground">{alert.title}</span>
 <span className={cn(
"text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
 alert.level ==='High' ?'bg-rose-500/10 text-rose-500' :
 alert.level ==='Medium' ?'bg-amber-500/10 text-amber-500' :'bg-muted text-muted-foreground border border-border'
 )}>
 {alert.level}
 </span>
 </div>
 <p className="text-[11px] font-medium text-muted-foreground leading-snug">{alert.detail}</p>
 <div className="flex items-center justify-between mt-3">
 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{alert.time}</span>
 <ArrowRight size={14} className="text-muted-foreground/30 group-hover:text-primary group-hover:translate-x-1 transition-all" />
 </div>
 </div>
 )) : (
 <EmptyState 
 compact
 title="No anomalies detected"
 description=""
 />
 )}
 </div>
 </Card>

 </div>

 </div>
 );
}
