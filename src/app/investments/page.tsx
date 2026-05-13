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
  Eye,
  Copy,
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
import { executeExport } from '@/lib/exportUtils';
import { DashboardGrid } from '@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from '@/components/ui/AdaptiveMetricCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { cn } from "@/lib/utils";
import { investments } from '@/lib/mock-data';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { toast } from 'sonner';
import { useTableFilters } from '@/hooks/useTableFilters';
import { TableActionMenu } from '@/components/ui/TableActionMenu';
import { QuickActionModal } from '@/components/ui/QuickActionModal';
import { ExportModal } from '@/components/ui/ExportModal';

// 1. MOCK DATA FOR TABLE
const tableData: any[] = [];

// 1. MOCK DATA FOR ANALYTICS
const activityData: any[] = [];

const statusBreakdown: any[] = [];

const kpiData = [
  { label: 'Active Investments', value: '0', trend: '--', trendUp: null, desc: 'Awaiting sync', icon: Activity, color: 'text-primary' },
  { label: 'Total Investment Volume', value: '₦0', trend: '--', trendUp: null, desc: 'Awaiting sync', icon: Briefcase, color: 'text-emerald-500' },
  { label: 'Pending Maturities', value: '0', trend: '0 due today', trendUp: null, desc: 'Awaiting sync', icon: Clock, color: 'text-amber-500' },
  { label: 'ROI Liability', value: '₦0', trend: '--', trendUp: null, desc: 'Awaiting sync', icon: Layers, color: 'text-purple-500' },
  { label: 'Suspicious Activity', value: '0', trend: '--', trendUp: null, desc: 'Awaiting sync', icon: ShieldAlert, color: 'text-rose-500' },
  { label: 'Active Investors', value: '0', trend: '--', trendUp: null, desc: 'Awaiting sync', icon: Users, color: 'text-indigo-500' },
];

const operationalAlerts: any[] = [];

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
  const [selectedInvestment, setSelectedInvestment] = useState<any>(null);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const {
    searchTerm,
    setSearchTerm,
    filteredData,
    statusFilter,
    setStatusFilter
  } = useTableFilters(tableData, {
    searchKeys: ['name', 'id', 'plan']
  });

  const handleFreeze = () => {
    setIsActionLoading(true);
    setTimeout(() => {
      toast.error('Investment Frozen', { description: `Record ${selectedInvestment?.id} has been suspended for compliance review.` });
      setIsFreezeModalOpen(false);
      setIsActionLoading(false);
      setSelectedInvestment(null);
    }, 1500);
  };

  const handleExport = () => {
    setIsExportModalOpen(true);
  };

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
          <button onClick={() => toast.success('Calendar Picker', { description: 'Opening operational date range selector...' })} className="flex items-center gap-3 px-3 py-2 bg-card border border-border rounded-xl text-xs font-bold text-muted-foreground hover:bg-secondary shadow-sm transition-all">
            <span className="text-muted-foreground">May 20, 2025 - Jun 20, 2025</span>
            <Calendar size={14} className="text-muted-foreground" />
          </button>
          <Button onClick={() => toast.success('Advanced Filters', { description: 'Opening forensic filter panel...' })} variant="outline" size="sm" className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground">
            <Filter size={14} /> Filters
          </Button>
          <Button 
            onClick={() => executeExport({ 
              fileName: 'InvestmentPerformance', 
              data: [], 
              format: 'PDF' 
            })} 
            size="sm" 
            className="h-9 rounded-xl bg-primary hover:bg-primary/90 text-white px-4 font-bold shadow-lg shadow-primary/20 flex items-center gap-2 transition-all border-none"
          >
            Generate Report <ChevronDown size={14} />
          </Button>
        </div>
      </div>

      {/* 4. KPI CARDS GRID */}
      <DashboardGrid cols={6}>
        {kpiData.map((kpi, i) => (
          <AdaptiveMetricCard
            key={i}
            label={kpi.label}
            value={kpi.value}
            icon={kpi.icon}
            trend={kpi.trend}
            trendUp={kpi.trendUp}
            description={kpi.desc}
            color={kpi.color}
          />
        ))}
      </DashboardGrid>

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

            {activityData.length > 0 ? (
              <ChartWrapper height={320} className="min-h-[320px]">
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
            ) : (
              <div className="h-[320px] flex items-center justify-center">
                <EmptyState 
                  icon={TrendingUp}
                  title="Awaiting Performance Data"
                  description="Market metrics and investor activity will appear once connected."
                />
              </div>
            )}

            <div className="mt-6 pt-6 border-t border-border grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Invested', value: '₦0', trend: '0%', up: null },
                { label: 'Total Matured', value: '₦0', trend: '0%', up: null },
                { label: 'Total ROI', value: '₦0', trend: '0%', up: null },
                { label: 'Active Yield', value: '0.0%', trend: '0%', up: null },
              ].map((stat, i) => (
                <div key={i} className="space-y-1">
                  <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-foreground">{stat.value}</span>
                    {stat.trend !== '0%' && (
                      <span className={cn(
                        "text-[9px] font-black px-1.5 py-0.5 rounded-lg",
                        stat.up ? "bg-emerald-500/10 text-emerald-500" : "bg-rose-500/10 text-rose-500"
                      )}>
                        {stat.trend}
                      </span>
                    )}
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
              {statusBreakdown.length > 0 ? (
                <ChartWrapper height={200}>
                  <PieChart>
                    <Pie data={statusBreakdown} innerRadius={60} outerRadius={85} paddingAngle={8} dataKey="value" stroke="none">
                      {statusBreakdown.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: 'hsl(var(--foreground))' }} />
                  </PieChart>
                </ChartWrapper>
              ) : (
                <div className="h-[200px] flex items-center justify-center">
                  <EmptyState 
                    compact
                    title="No status data"
                  />
                </div>
              )}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-foreground">0</span>
                <span className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em] mt-0.5">Total</span>
              </div>
            </div>

            <div className="space-y-2.5">
              {statusBreakdown.length > 0 ? statusBreakdown.map((item, i) => (
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
              )) : (
                <p className="text-[10px] font-black text-center text-muted-foreground/30 uppercase tracking-widest py-4">No mix data</p>
              )}
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
              <Button onClick={() => toast.success('Export CSV Initiated', { description: 'Generating Recent Investments CSV...' })} variant="ghost" size="icon" className="h-8 w-8 bg-muted border border-border text-muted-foreground hover:text-primary rounded-xl"><Download size={16} /></Button>
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
                {filteredData.length > 0 ? filteredData.map((row, i) => (
                  <tr key={i} onClick={() => toast.success('Opening Investment Details', { description: `Record: ${row.id}` })} className="hover:bg-secondary transition-all cursor-pointer border-b border-border last:border-0">
                    <td className="px-4 py-2.5">
                      <div className="flex items-center gap-3">
                        <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-black text-[9px] shrink-0 border border-border">
                          {row.name.split(' ').map((n: string) => n[0]).join('')}
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
                      <TableActionMenu items={[
                        { label: 'View Portfolio', icon: Eye, onClick: () => toast.success('Opening Portfolio', { description: `Loading investment details for ${row.id}` }) },
                        { label: 'Copy Record ID', icon: Copy, onClick: () => { navigator.clipboard.writeText(row.id); toast.success('Copied', { description: row.id }); } },
                        { label: 'Export Report', icon: Download, onClick: () => { setSelectedInvestment(row); setIsExportModalOpen(true); }, dividerBefore: true },
                        { label: 'Freeze Account', icon: ShieldAlert, onClick: () => { setSelectedInvestment(row); setIsFreezeModalOpen(true); }, variant: 'danger', dividerBefore: true },
                      ]} />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={9} className="px-4 py-20 text-center">
                      <EmptyState 
                        icon={TrendingUp}
                        title="No matching investments"
                        description="Refine your search or filters"
                      />
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* MODALS */}
      <QuickActionModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        onConfirm={handleFreeze}
        title="Freeze Investment"
        description="Are you sure you want to freeze this investment record? All payouts and modifications will be blocked."
        type="danger"
        confirmLabel="Freeze Record"
        isLoading={isActionLoading}
        icon={ShieldAlert}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Investment Data"
        description="Select the report granularity and export format for this investment portfolio."
        fileName={`Investment_Report_${selectedInvestment?.id || 'All'}`}
        data={selectedInvestment ? [selectedInvestment] : filteredData}
        headers={['id', 'name', 'plan', 'amount', 'roi', 'status', 'risk', 'end']}
      />

    </div>
  );
}
