'use client';

import React, { useState } from 'react';
import { 
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
  UserPlus,
  Settings,
  Bell,
  CheckCircle2,
  AlertTriangle,
  HelpCircle
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { investments } from '@/lib/mock-data';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { toastActions } from '@/lib/toastActions';
import { useTableFilters } from '@/hooks/useTableFilters';

// 1. MOCK DATA FOR TABLE
const tableData = [
  { name: 'Ngozi Okonjo', id: 'INV-001245', plan: 'Fixed Plan', amount: 5000000, roi: '12.5%', status: 'Active', risk: 'Low', end: 'May 2025' },
  { name: 'Chukwudi Okafor', id: 'INV-001246', plan: 'Agric Plan', amount: 200000, roi: '10.0%', status: 'Matured', risk: 'Low', end: 'Nov 2024' },
  { name: 'Amina Yusuf', id: 'INV-001247', plan: 'Estate Plan', amount: 1500000, roi: '15.0%', status: 'Pending', risk: 'Med', end: 'May 2026' },
];

// 1. MOCK DATA FOR ANALYTICS
const activityData = [
  { date: 'May 20', investments: 400, maturities: 240, roi: 120, withdrawals: 80 },
  { date: 'May 24', investments: 600, maturities: 380, roi: 210, withdrawals: 140 },
  { date: 'May 27', investments: 500, maturities: 450, roi: 180, withdrawals: 100 },
  { date: 'Jun 1', investments: 800, maturities: 310, roi: 340, withdrawals: 210 },
  { date: 'Jun 5', investments: 700, maturities: 520, roi: 290, withdrawals: 180 },
  { date: 'Jun 10', investments: 900, maturities: 440, roi: 410, withdrawals: 260 },
  { date: 'Jun 14', investments: 850, maturities: 610, roi: 380, withdrawals: 230 },
  { date: 'Jun 17', investments: 1100, maturities: 580, roi: 450, withdrawals: 310 },
  { date: 'Jun 20', investments: 1000, maturities: 720, roi: 420, withdrawals: 290 },
];

const statusBreakdown = [
  { name: 'Active', value: 8942, color: '#2979FF', percentage: '63.0%' },
  { name: 'Matured', value: 2450, color: '#10B981', percentage: '17.2%' },
  { name: 'Pending', value: 1420, color: '#F59E0B', percentage: '10.0%' },
  { name: 'Frozen', value: 680, color: '#6366F1', percentage: '4.8%' },
  { name: 'Under Review', value: 712, color: '#FF5630', percentage: '5.0%' },
];

const kpiData = [
  { title: 'Active Investments', value: '14,204', trend: '+12.4%', trendUp: true, desc: 'vs last 30 days', icon: Activity, color: 'text-primary', bg: 'bg-primary/10', link: 'View All' },
  { title: 'Total Investment Volume', value: '₦12.8B', trend: '+18.7%', trendUp: true, desc: 'vs last 30 days', icon: Briefcase, color: 'text-emerald-500', bg: 'bg-emerald-50', link: 'View Analytics' },
  { title: 'Pending Maturities', value: '₦420M', trend: '12 due today', trendUp: null, desc: 'Critical liquidity', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50', link: 'View Maturities' },
  { title: 'ROI Liability', value: '₦1.4B', trend: '+5.2%', trendUp: true, desc: 'vs last 30 days', icon: Layers, color: 'text-purple-500', bg: 'bg-purple-50', link: 'View ROI Report' },
  { title: 'Suspicious Activity', value: '12 Flags', trend: 'High Priority', trendUp: false, desc: 'Immediate review', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50', link: 'Review Flags' },
  { title: 'Active Investors', value: '8,942', trend: '+420 last 30 days', trendUp: true, desc: 'Growth index', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50', link: 'View Investors' },
];

const operationalAlerts = [
  { id: 1, title: '12 investments pending maturity today', time: '09:20 AM', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  { id: 2, title: '3 high-risk accounts flagged', time: '09:15 AM', icon: ShieldAlert, color: 'text-rose-500', bg: 'bg-rose-50' },
  { id: 3, title: '₦240M ROI payout due tomorrow', time: '09:10 AM', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
  { id: 4, title: '5 failed KYC-linked investments', time: '09:05 AM', icon: Users, color: 'text-primary', bg: 'bg-primary/10' },
];

const quickActions = [
  { title: 'Search Investor', icon: Search },
  { title: 'Bulk Actions', icon: Layers },
  { title: 'Create Announcement', icon: FileText },
  { title: 'Export Data', icon: Download },
  { title: 'System Settings', icon: Settings },
];

// 2. HELPER COMPONENTS
const Badge = ({ children, className }: { children: React.ReactNode, className?: string }) => (
  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider", className)}>
    {children}
  </span>
);

export default function InvestmentsPage() {
  const [activeTab, setActiveTab] = useState('Daily');

  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    statusFilter,
    setStatusFilter
  } = useTableFilters(tableData, {
    searchKeys: ['name', 'id', 'plan']
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency', currency: 'NGN', minimumFractionDigits: 0
    }).format(amount).replace('NGN', '₦');
  };

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-700 pb-10">
      <Breadcrumbs />
      
      {/* 3. HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-2xl font-black text-foreground tracking-tight">Investment Operations</h1>
            <div className="w-4 h-4 rounded-full bg-primary/10 text-primary flex items-center justify-center border border-primary/20 shadow-sm">
              <ShieldCheck size={10} fill="currentColor" className="text-primary" />
            </div>
          </div>
          <p className="text-muted-foreground font-medium text-[13px]">
            Monitor customer investments, performance, and platform exposure in real-time.
          </p>
        </motion.div>

        <div className="flex flex-wrap items-center gap-2">
          <button onClick={() => toastActions.showActionToast('Calendar Picker', 'Opening operational date range selector...')} className="flex items-center gap-3 px-3 py-2 bg-card border border-border rounded-xl text-xs font-bold text-muted-foreground hover:bg-secondary shadow-sm transition-all">
            <span className="text-muted-foreground">May 20, 2025 - Jun 20, 2025</span>
            <Calendar size={14} className="text-muted-foreground" />
          </button>
          <Button onClick={() => toastActions.showActionToast('Advanced Filters', 'Opening forensic filter panel...')} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Filter size={14} /> Filters
          </Button>
          <Button onClick={() => toastActions.triggerExport('CSV', 'InvestmentsLedger', filteredData)} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Download size={14} /> Export
          </Button>
          <Button onClick={() => toastActions.triggerExport('PDF', 'InvestmentPerformanceReport', filteredData)} size="sm" className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all border-none">
            Generate Report <ChevronDown size={14} />
          </Button>
        </div>
      </div>

      {/* 4. KPI CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6 gap-4">
        {kpiData.map((kpi, i) => (
          <Card key={i} className="p-5 group relative overflow-hidden">
            <div className="flex justify-between items-start mb-3">
              <div className={cn("p-2 rounded-xl group-hover:scale-110 transition-transform", kpi.color, "bg-background border border-border")}>
                <kpi.icon size={18} />
              </div>
              {kpi.trendUp !== null && (
                <div className={cn("flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-lg", kpi.trendUp ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500")}>
                  {kpi.trendUp ? <ArrowUpRight size={9} /> : <ArrowDownRight size={9} />}
                  {kpi.trend}
                </div>
              )}
            </div>
            <div className="space-y-0.5 mb-3">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{kpi.title}</p>
              <h3 className="text-xl font-black text-foreground tracking-tight">{kpi.value}</h3>
              <p className="text-[9px] font-bold text-muted-foreground italic">
                {kpi.trendUp !== null ? <span className="text-primary mr-1">◆</span> : <span className="text-amber-500 mr-1">◆</span>}
                {kpi.desc}
              </p>
            </div>
            <div onClick={() => toastActions.showActionToast(`Navigating to ${kpi.link}...`)} className="pt-3 border-t border-border flex items-center justify-between group-hover:text-primary transition-colors cursor-pointer">
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-primary">{kpi.link}</span>
              <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform text-muted-foreground group-hover:text-primary" />
            </div>
          </Card>
        ))}
      </div>

      {/* 5. ANALYTICS & CONTENT SECTION (FULL WIDTH) */}
      <div className="w-full space-y-6">
        
        {/* Analytics Section */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          
          {/* Investment Activity Overview */}
          <Card className="xl:col-span-8 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-black text-foreground tracking-tight">Activity Overview</h3>
                  <HelpCircle size={12} className="text-muted-foreground" />
                </div>
                <div className="flex items-center gap-4 mt-3">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-primary" />
                    <span className="text-[10px] font-bold text-muted-foreground">Investments</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span className="text-[10px] font-bold text-muted-foreground">Maturities</span>
                  </div>
                </div>
              </div>
              <div className="flex bg-muted p-1 rounded-xl border border-border">
                {['Daily', 'Weekly', 'Monthly'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      activeTab === tab ? "bg-card text-foreground shadow-sm border border-border dark:bg-secondary dark:border-primary/20" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <ChartWrapper height={280}>
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorInv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorMat" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="#64748B" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} dy={8} />
                <YAxis stroke="#64748B" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} tickFormatter={(v) => v === 0 ? '' : `₦${v}M`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: 'hsl(var(--foreground))' }} 
                  itemStyle={{ fontWeight: 800, fontSize: '11px', color: 'hsl(var(--foreground))' }}
                />
                <Area type="monotone" dataKey="investments" stroke="#3B82F6" strokeWidth={3} fill="url(#colorInv)" />
                <Area type="monotone" dataKey="maturities" stroke="#10B981" strokeWidth={3} fill="url(#colorMat)" />
              </AreaChart>
            </ChartWrapper>

            <div className="mt-6 pt-6 border-t border-border grid grid-cols-4 gap-2">
              {[
                { label: 'Total Invested', value: '₦12.8B', trend: '+18%', up: true },
                { label: 'Total Matured', value: '₦8.4B', trend: '+15%', up: true },
                { label: 'Total ROI', value: '₦1.2B', trend: '+8%', up: true },
                { label: 'Total Withdr.', value: '₦2.6B', trend: '-11%', up: false },
              ].map((m, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest truncate">{m.label}</p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="text-[13px] font-black text-foreground tracking-tight">{m.value}</span>
                    <span className={cn("text-[8px] font-black flex items-center", m.up ? "text-emerald-500" : "text-rose-500")}>
                      {m.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Investment Status Breakdown */}
          <Card className="xl:col-span-4 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-foreground tracking-tight">Status Mix</h3>
                <HelpCircle size={10} className="text-muted-foreground" />
              </div>
            </div>
            
            <div className="flex-1 w-full relative mb-6">
              <ChartWrapper height={200}>
                <PieChart>
                  <Pie data={statusBreakdown} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                    {statusBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: 'hsl(var(--foreground))' }} />
                </PieChart>
              </ChartWrapper>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-foreground">14.2K</span>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-0.5">Total</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {statusBreakdown.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[11px] font-bold text-muted-foreground">{item.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-black text-foreground">{item.value.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-muted-foreground min-w-[35px] text-right">{item.percentage}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Table Section */}
        <Card className="overflow-hidden min-w-0 shadow-sm p-0">
          <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background sticky top-0 z-10">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-black text-foreground tracking-tight">Recent Investments</h3>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative group">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="bg-muted border border-border rounded-xl py-1.5 px-9 text-[11px] font-bold text-foreground outline-none focus:bg-secondary transition-all w-48" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 bg-card border border-border rounded-xl px-3 text-[10px] font-black uppercase tracking-widest outline-none focus:border-primary/40"
              >
                <option value="all">All Status</option>
                <option value="Active">Active</option>
                <option value="Matured">Matured</option>
                <option value="Pending">Pending</option>
              </select>
              <Button onClick={() => toastActions.triggerExport('CSV', 'RecentInvestments')} variant="ghost" size="icon" className="h-8 w-8 bg-muted border border-border text-muted-foreground hover:text-primary rounded-xl"><Download size={16} /></Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-muted border-b border-border">
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Investor</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">ID</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Plan</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">ROI</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Risk</th>
                  <th className="px-4 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">Maturity</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredData.map((row, i) => (
                  <tr key={i} onClick={() => toastActions.showActionToast('Opening Investment Details', `Record: ${row.id}`)} className="hover:bg-secondary transition-all cursor-pointer border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[9px] shrink-0 border border-border">
                          {row.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <span className="text-[12px] font-black text-foreground truncate max-w-[150px]">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-[11px] font-bold text-muted-foreground uppercase truncate max-w-[80px]">{row.id}</td>
                    <td className="px-4 py-2.5 text-[11px] font-bold text-foreground truncate max-w-[120px]">{row.plan}</td>
                    <td className="px-4 py-2.5 text-[12px] font-black text-foreground">{formatCurrency(row.amount)}</td>
                    <td className="px-4 py-2.5 text-[12px] font-black text-emerald-500">{row.roi}</td>
                    <td className="px-4 py-2.5 text-center"><Badge className={cn("text-[8px] border", row.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : row.status === 'Matured' ? 'bg-primary/10 text-primary border-primary/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20')}>{row.status}</Badge></td>
                    <td className="px-4 py-2.5 text-center"><Badge className={cn("text-[8px] border", row.risk === 'Low' ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20')}>{row.risk}</Badge></td>
                    <td className="px-4 py-2.5 text-right text-[11px] font-bold text-muted-foreground">{row.end}</td>
                    <td className="px-4 py-2.5 text-right shrink-0" onClick={(e) => e.stopPropagation()}>
                      <Button onClick={() => toastActions.showActionToast('Investment Details', `Inspecting Record: ${row.id}`)} variant="ghost" size="icon" className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"><MoreVertical size={14} /></Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

    </div>
  );
}
