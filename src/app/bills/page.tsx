'use client';

import React, { useState } from'react';
import { 
 CreditCard, 
 Search, 
 Filter, 
 Download, 
 Calendar, 
 ChevronDown,
 ArrowUpRight, 
 ArrowDownRight,
 CheckCircle2,
 XCircle,
 Clock,
 RefreshCw,
 ShieldAlert,
 Activity,
 Zap,
 Tv,
 Wifi,
 Gamepad2,
 GraduationCap,
 Music,
 Smartphone,
 ExternalLink,
 BadgeCheck,
 AlertTriangle,
 Database,
 Signal,
 HelpCircle,
 Eye,
 FileText,
 Copy
} from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from"@/lib/utils";
import Breadcrumbs from'@/components/layout/Breadcrumbs';
import { toast } from'sonner';
import { useTableFilters } from'@/hooks/useTableFilters';
import { executeExport } from'@/lib/exportUtils';
import { DashboardGrid } from'@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from'@/components/ui/AdaptiveMetricCard';
import { EmptyState } from'@/components/ui/EmptyState';
import { TableActionMenu } from'@/components/ui/TableActionMenu';
import { QuickActionModal } from'@/components/ui/QuickActionModal';
import { ExportModal } from'@/components/ui/ExportModal';

// 1. BILL PAYMENTS MOCK DATA
const billMetrics = [
 { label:'Total Transactions', value:'0', trend:'--', up: null, icon: CreditCard, color:'text-primary', bg:'bg-primary/10' },
 { label:'Successful Payments', value:'0', trend:'0%', up: null, icon: CheckCircle2, color:'text-emerald-600', bg:'bg-emerald-50' },
 { label:'Failed Payments', value:'0', trend:'0%', up: null, icon: XCircle, color:'text-rose-600', bg:'bg-rose-50' },
 { label:'Total Volume', value:'₦0', trend:'--', up: null, icon: Activity, color:'text-indigo-600', bg:'bg-indigo-50' },
 { label:'Active Providers', value:'0', trend:'Awaiting Sync', up: null, icon: Signal, color:'text-amber-600', bg:'bg-amber-50' },
 { label:'Pending Verif.', value:'0', trend:'--', up: null, icon: Clock, color:'text-muted-foreground', bg:'bg-muted' },
];

const billCategories = [
 { name:'Electricity', icon: Zap, count:'0', volume:'₦0', success:'0%', color:'text-amber-500', bg:'bg-amber-50' },
 { name:'TV Subscription', icon: Tv, count:'0', volume:'₦0', success:'0%', color:'text-primary', bg:'bg-primary/10' },
 { name:'Betting', icon: Gamepad2, count:'0', volume:'₦0', success:'0%', color:'text-purple-500', bg:'bg-purple-50' },
 { name:'Internet', icon: Wifi, count:'0', volume:'₦0', success:'0%', color:'text-emerald-500', bg:'bg-emerald-50' },
 { name:'Education', icon: GraduationCap, count:'0', volume:'₦0', success:'0%', color:'text-rose-500', bg:'bg-rose-50' },
 { name:'Streaming', icon: Music, count:'0', volume:'₦0', success:'0%', color:'text-pink-500', bg:'bg-pink-50' },
 { name:'Airtime/Data', icon: Smartphone, count:'0', volume:'₦0', success:'0%', color:'text-indigo-500', bg:'bg-indigo-50' },
];

const providerHealth: any[] = [];

const billTransactions: any[] = [];

const riskAlerts: any[] = [];

// 2. HELPER COMPONENTS
const Badge = ({ status, type }: { status?: string, type?: string }) => {
 if (status) {
 const s = status.toLowerCase();
 const styles: Record<string, string> = {
 successful:'bg-emerald-50 text-emerald-600 border-emerald-100',
 pending:'bg-amber-50 text-amber-600 border-amber-100',
 failed:'bg-rose-50 text-rose-600 border-rose-100',
 reversed:'bg-muted text-muted-foreground border-border',
 processing:'bg-primary/10 text-primary border-blue-100',
 };
 return (
 <span className={cn("px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border", styles[s] ||'bg-muted text-muted-foreground')}>
 {status}
 </span>
 );
 }

 if (type) {
 const t = type.toLowerCase();
 const styles: Record<string, string> = {
 electricity:'bg-amber-50 text-amber-600 border-amber-100',
'tv subscription':'bg-primary/10 text-primary border-blue-100',
 betting:'bg-purple-50 text-purple-600 border-purple-100',
 internet:'bg-emerald-50 text-emerald-600 border-emerald-100',
 education:'bg-rose-50 text-rose-600 border-rose-100',
 streaming:'bg-pink-50 text-pink-600 border-pink-100',
 };
 return (
 <span className={cn("px-2 py-0.5 rounded-lg text-[9px] font-bold uppercase tracking-tight border", styles[t] ||'bg-muted text-muted-foreground')}>
 {type}
 </span>
 );
 }
 return null;
};

export default function BillPaymentsPage() {
 const [activeTab, setActiveTab] = useState('All Payments');
 const [selectedTxn, setSelectedTxn] = useState<any>(null);
 const [isReportModalOpen, setIsReportModalOpen] = useState(false);
 const [isActionLoading, setIsActionLoading] = useState(false);
 
 const [selectedProvider, setSelectedProvider] = useState<any>(null);
 const [isRefreshingProvider, setIsRefreshingProvider] = useState<string | null>(null);

 const {
 searchTerm,
 setSearchTerm,
 filteredData,
 statusFilter,
 setStatusFilter
 } = useTableFilters(billTransactions, {
 searchKeys: ['customer','id','type','provider','ref']
 });

 const handleGenerateReport = () => {
 setIsReportModalOpen(true);
 };

 const formatCurrency = (amount: number) => {
 return new Intl.NumberFormat('en-NG', {
 style:'currency', currency:'NGN', minimumFractionDigits: 0
 }).format(amount).replace('NGN','₦');
 };

 return (
 <div className="w-full space-y-4 animate-in fade-in duration-700 pb-10">
 <Breadcrumbs />
 
 {/* 3. OPERATIONS HEADER */}
 <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
 <div>
 <div className="flex items-center gap-3 mb-1">
 <h1 className="text-2xl font-black text-foreground tracking-tight">Bill Payments</h1>
 </div>
 
 </div>
 
 <div className="flex flex-wrap items-center gap-2">
 <Button 
 onClick={() => executeExport({ fileName:'BillPayments', data: filteredData, format:'CSV' })}
 variant="outline" 
 size="sm" 
 className="h-9 rounded-xl border-border font-bold text-muted-foreground bg-card shadow-sm flex items-center gap-2 hover:bg-secondary hover:text-foreground"
 >
 <Download size={14} /> Export CSV
 </Button>
 </div>
 </div>

 {/* 4. KPI STATS ROW */}
 <DashboardGrid cols={6}>
 {billMetrics.map((stat, i) => (
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

 {/* 5. BILL CATEGORIES STRIP */}
 <div className="bg-card border border-border rounded-xl p-1.5 overflow-hidden flex items-center shadow-sm">
 <div className="flex overflow-x-auto no-scrollbar gap-1.5 p-1 w-full">
 {billCategories.map((cat, i) => (
 <div key={i} className="flex items-center gap-4 px-4 py-2 bg-muted border border-border rounded-xl hover:bg-secondary hover:border-primary/20 transition-all shrink-0 cursor-pointer">
 <div className={cn("p-2 rounded-lg bg-background border border-border", cat.color)}>
 <cat.icon size={18} />
 </div>
 <div className="min-w-0">
 <p className="text-[11px] font-black text-foreground truncate">{cat.name}</p>
 <div className="flex items-center gap-2 mt-0.5">
 <span className="text-[9px] font-bold text-muted-foreground uppercase">{cat.count} txns</span>
 <span className="text-[9px] font-black text-emerald-500">{cat.success}</span>
 </div>
 </div>
 </div>
 ))}
 </div>
 </div>

 <DashboardGrid cols={5}>
 {providerHealth.length > 0 ? providerHealth.map((provider: any, i: number) => (
 <div key={i} className="bg-card border border-border rounded-xl p-3 flex flex-col gap-3 group hover:border-[#3B82F6]/30 transition-all shadow-sm min-w-0">
 {/* ... provider logic ... */}
 </div>
 )) : (
 <div className="col-span-full">
 <EmptyState 
 compact
 icon={Signal}
 title="No Provider Telemetry"
 description=""
 />
 </div>
 )}
 </DashboardGrid>

 {/* 7. MAIN CONTENT AREA (TABLE + RISK) */}
 <div className="space-y-6">
 
 {/* Main Ledger */}
 <div className="bg-card border border-border rounded-[24px] overflow-hidden flex flex-col min-w-0 shadow-sm">
 <div className="px-6 py-4 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4 bg-background sticky top-0 z-10">
 <div className="flex items-center gap-6">
 <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
 {['All Payments','Utility','TV & Media','Betting','Failed'].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab)}
 className={cn(
"px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
 activeTab === tab ?"bg-secondary text-foreground shadow-sm border border-primary/20" :"text-muted-foreground hover:text-foreground"
 )}
 >
 {tab}
 </button>
 ))}
 </div>
 </div>
 <div className="flex items-center gap-2">
 <div className="relative group">
 <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <input 
 type="text" 
 placeholder="Search ref, customer, meter..." 
 className="bg-muted border border-border rounded-xl py-1.5 px-9 text-[11px] font-bold text-foreground outline-none focus:bg-secondary focus:border-primary/40 transition-all w-64" 
 />
 </div>
 <Button variant="ghost" size="icon" className="h-8 w-8 bg-muted border border-border text-muted-foreground hover:text-primary rounded-xl"><Filter size={14} /></Button>
 </div>
 </div>
 
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[1200px]">
 <thead>
 <tr className="bg-muted border-b border-border">
 <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Transaction ID</th>
 <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Customer</th>
 <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Bill Type</th>
 <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Provider</th>
 <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Amount</th>
 <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-center">Status</th>
 <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest">Reference</th>
 <th className="px-5 py-3 text-[9px] font-black text-muted-foreground uppercase tracking-widest text-right">Time</th>
 <th className="px-5 py-3"></th>
 </tr>
 </thead>
 <tbody className="divide-y divide-border">
 {filteredData.length > 0 ? filteredData.map((txn) => (
 <tr key={txn.id} onClick={() => toast.success('Opening Bill Record', { description:`Reference: ${txn.ref}` })} className="hover:bg-secondary transition-colors group border-b border-border last:border-0 cursor-pointer">
 <td className="px-5 py-2.5">
 <span className="text-[11px] font-black text-foreground uppercase tracking-tighter">{txn.id}</span>
 </td>
 <td className="px-5 py-2.5">
 <div className="flex items-center gap-2">
 <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center font-black text-[9px] text-muted-foreground border border-border">
 {txn.customer[0]}
 </div>
 <span className="text-[12px] font-black text-foreground truncate max-w-[120px]">{txn.customer}</span>
 </div>
 </td>
 <td className="px-5 py-2.5">
 <Badge type={txn.type} />
 </td>
 <td className="px-5 py-2.5">
 <div className="flex items-center gap-1.5">
 <div className="w-4 h-4 rounded bg-muted border border-border flex items-center justify-center">
 <Database size={10} className="text-muted-foreground" />
 </div>
 <span className="text-[11px] font-bold text-muted-foreground">{txn.provider}</span>
 </div>
 </td>
 <td className="px-5 py-2.5 text-[12px] font-black text-foreground">{formatCurrency(txn.amount)}</td>
 <td className="px-5 py-2.5 text-center">
 <Badge status={txn.status} />
 </td>
 <td className="px-5 py-2.5">
 <div className="flex items-center gap-1.5 group/ref cursor-pointer">
 <span className="text-[10px] font-black text-muted-foreground uppercase group-hover/ref:text-primary transition-colors">{txn.ref}</span>
 <ExternalLink size={10} className="text-muted-foreground/30 group-hover/ref:text-muted-foreground transition-colors" />
 </div>
 </td>
 <td className="px-5 py-2.5 text-right text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{txn.time}</td>
 <td className="px-5 py-2.5 text-right shrink-0" onClick={(e) => e.stopPropagation()}>
 <div className="flex items-center justify-end gap-1">
 <Button 
 onClick={() => {
 toast.loading('Fetching receipt...', { id:'receipt-load' });
 setTimeout(() => {
 toast.success('Receipt Generated', { id:'receipt-load', description:`Record ${txn.id} ready for download.` });
 }, 1000);
 }}
 variant="ghost" 
 size="icon" 
 className="h-7 w-7 rounded-lg hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all"
 >
 <Download size={14} />
 </Button>
 <TableActionMenu items={[
 { label:'Copy Reference', icon: Copy, onClick: () => { navigator.clipboard.writeText(txn.ref); toast.success('Copied', { description: txn.ref }); } },
 { label:'View Receipt', icon: Eye, onClick: () => { toast.loading('Fetching receipt...', { id:'bill-receipt' }); setTimeout(() => toast.success('Receipt Ready', { id:'bill-receipt', description:`PDF generated for ${txn.ref}` }), 800); } },
 { label:'Generate Report', icon: FileText, onClick: () => { setSelectedTxn(txn); setIsReportModalOpen(true); }, dividerBefore: true },
 ]} />
 </div>
 </td>
 </tr>
 )) : (
 <tr>
 <td colSpan={9} className="px-5 py-20 text-center">
 <EmptyState 
 icon={CreditCard}
 title="No Payments Logged"
 description=""
 />
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>
 
 <div className="px-6 py-4 bg-muted flex items-center justify-between border-t border-border">
 <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Showing {filteredData.length} utility payments</p>
 <div className="flex items-center gap-1">
 <button onClick={() => toast.success('Loading Previous Page')} className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Prev</button>
 <button className="w-8 h-8 bg-primary text-white rounded-lg font-black text-[10px] shadow-lg shadow-primary/20">1</button>
 <button onClick={() => toast.success('Loading Page 2')} className="w-8 h-8 bg-card border border-border text-muted-foreground rounded-lg font-black text-[10px] hover:bg-secondary transition-all">2</button>
 <button onClick={() => toast.success('Loading Next Page')} className="px-3 py-1.5 bg-card border border-border rounded-lg text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all">Next</button>
 </div>
 </div>
 </div>

 {/* 8. FRAUD / RISK MONITORING */}
 <div className="bg-card border border-border rounded-[24px] overflow-hidden flex flex-col shadow-sm">
 <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-background">
 <div className="flex items-center gap-2">
 <ShieldAlert size={16} className="text-rose-500" />
 <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Operational Risk Queue</h3>
 </div>
 <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline transition-all">Monitor Dashboard</button>
 </div>
 <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-border">
 {riskAlerts.length > 0 ? riskAlerts.map((alert) => (
 <div key={alert.id} className="p-5 hover:bg-secondary transition-all group cursor-pointer">
 <div className="flex items-center justify-between mb-2">
 <span className="text-[12px] font-black text-foreground group-hover:text-rose-500 transition-colors">{alert.title}</span>
 <span className={cn(
"px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest",
 alert.level ==='Critical' ?'bg-rose-500/10 text-rose-500' : 
 alert.level ==='High' ?'bg-orange-500/10 text-orange-500' :'bg-amber-500/10 text-amber-500'
 )}>
 {alert.level}
 </span>
 </div>
 <p className="text-[11px] font-medium text-muted-foreground leading-snug mb-3">{alert.detail}</p>
 <div className="flex items-center justify-between">
 <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{alert.time}</span>
 <ArrowUpRight size={14} className="text-muted-foreground/30 group-hover:text-rose-500 transition-all" />
 </div>
 </div>
 )) : (
 <div className="col-span-3">
 <EmptyState 
 compact
 title="No critical risks identified"
 />
 </div>
 )}
 </div>
 </div>
 </div>

 {/* MODALS */}
 <ExportModal
 isOpen={isReportModalOpen}
 onClose={() => setIsReportModalOpen(false)}
 title="Compliance Report"
 description=""
 fileName={`Compliance_Report_${selectedTxn?.id ||'All'}`}
 data={selectedTxn ? [selectedTxn] : filteredData}
 headers={['id','customer','type','provider','amount','status','ref','time']}
 />

 </div>
 );
}
