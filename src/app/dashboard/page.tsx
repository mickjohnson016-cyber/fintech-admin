'use client';

import React, { useState } from 'react';
import {
  Users, TrendingUp, CreditCard, ShoppingBag,
  ArrowUp, Calendar, ChevronDown, RefreshCw,
  BarChart3, LineChart as LineChartIcon, Database,
  Download, FileText, Eye
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card } from '@/components/ui/card';
import { motion } from 'framer-motion';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { DashboardGrid } from '@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from '@/components/ui/AdaptiveMetricCard';
import { EmptyState } from '@/components/ui/EmptyState';
import { ActionMenu } from '@/components/ui/ActionMenu';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount).replace('NGN', '₦');
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');
  const router = useRouter();

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-700 pb-10">
      <Breadcrumbs />
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-xl font-black text-foreground tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground font-bold text-[11px] uppercase tracking-widest mt-0.5">Platform Performance & Operations Overview</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-2">
          <div onClick={() => toast.info('Module Coming Soon', { description: 'The Date Range Picker is currently under development.' })} className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl shadow-sm text-[11px] font-black text-muted-foreground cursor-pointer hover:bg-secondary transition-all">
            <Calendar size={14} className="text-primary" />
            <span>SELECT RANGE</span>
            <ChevronDown size={12} />
          </div>
          <Button onClick={() => toast.success('Data Refreshed', { description: 'Fetching latest platform metrics...' })} variant="ghost" size="icon" className="h-8 w-8 rounded-xl border border-border bg-card hover:bg-secondary"><RefreshCw size={14} className="text-muted-foreground" /></Button>
        </motion.div>
      </div>

      {/* ===== KPI CARDS — 4 COLUMNS ===== */}
      <DashboardGrid cols={4}>
        <AdaptiveMetricCard
          label="Total Users"
          value="0"
          icon={Users}
          trend="--"
          color="text-primary"
        />
        <AdaptiveMetricCard
          label="Total Transactions"
          value="0"
          icon={ShoppingBag}
          trend="--"
          color="text-rose-500"
        />
        <AdaptiveMetricCard
          label="Today's Revenue"
          value={formatCurrency(0)}
          icon={TrendingUp}
          trend="--"
          color="text-emerald-500"
        />
        <AdaptiveMetricCard
          label="Smart Savings"
          value={formatCurrency(0)}
          icon={CreditCard}
          trend="--"
          color="text-indigo-500"
        />
      </DashboardGrid>

      {/* ===== CHARTS — 2 COLUMNS SIDE BY SIDE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Monthly Sales Bar Chart — Empty State */}
        <Card className="lg:col-span-8 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Monthly Sales Analytics</h3>
            <ActionMenu items={[
              { label: 'Export CSV', icon: Download, onClick: () => toast.success('Export Started', { description: 'Sales analytics data export initiated.' }) },
              { label: 'Refresh Data', icon: RefreshCw, onClick: () => toast.success('Refreshed', { description: 'Analytics data synced with latest records.' }) },
              { label: 'View Full Report', icon: Eye, onClick: () => router.push('/reports'), dividerBefore: true },
            ]} />
          </div>
          <div className="min-h-[300px] flex items-center justify-center">
            <EmptyState 
              icon={BarChart3}
              title="Awaiting Analytics Data"
              description="Platform performance metrics will synchronize upon backend integration."
            />
          </div>
        </Card>

        {/* Monthly Target Gauge — Empty State */}
        <Card className="lg:col-span-4 p-5 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-1">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Goal Status</h3>
            <ActionMenu items={[
              { label: 'Set Monthly Target', icon: TrendingUp, onClick: () => toast.success('Target Configuration', { description: 'Navigate to Settings to configure revenue targets.' }) },
              { label: 'Export Goal Data', icon: Download, onClick: () => toast.success('Export Started', { description: 'Goal status data export initiated.' }) },
              { label: 'View Reports', icon: FileText, onClick: () => router.push('/reports'), dividerBefore: true },
            ]} />
          </div>
          <p className="w-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Monthly Target Performance</p>

          <div className="min-h-[180px] w-full flex items-center justify-center">
            <EmptyState 
              compact
              title="No targets initialized"
            />
          </div>

          <div className="grid grid-cols-3 w-full mt-6 pt-5 border-t border-border gap-2">
            <div className="text-center">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Target</p>
              <p className="text-xs font-black text-foreground mt-1">--</p>
            </div>
            <div className="text-center border-x border-border px-2">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Revenue</p>
              <p className="text-xs font-black text-foreground mt-1">--</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Daily</p>
              <p className="text-xs font-black text-foreground mt-1">--</p>
            </div>
          </div>
        </Card>

      </div>

      {/* ===== STATISTICS SECTION — Empty State ===== */}
      <Card className="p-5">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Volume Statistics</h3>
            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Transaction flow performance metrics</p>
          </div>
          <div className="flex items-center gap-1 bg-muted p-1 rounded-xl border border-border">
            {['Overview', 'Sales', 'Revenue'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  activeTab === tab ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
        <div className="min-h-[250px] flex items-center justify-center">
          <EmptyState 
            icon={LineChartIcon}
            title="No volume data"
            description="Connect backend to view statistics"
          />
        </div>
      </Card>

      {/* ===== RECENT TRANSACTIONS TABLE — Empty State ===== */}
      <Card className="overflow-hidden min-w-0 shadow-sm p-0">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-background">
          <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Transaction Ledger</h3>
          <Button onClick={() => router.push('/transactions')} variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">View All</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-muted text-[9px] font-black text-muted-foreground uppercase tracking-widest border-b border-border">
                <th className="px-5 py-3">Customer Profile</th>
                <th className="px-5 py-3">Method</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Date & Time</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="px-5 py-16 text-center">
                  <EmptyState 
                    icon={Database}
                    title="Ledger is Empty"
                    description="Recent transaction records will be securely logged here once processed."
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
