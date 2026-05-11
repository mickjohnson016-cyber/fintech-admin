'use client';

import React, { useState } from 'react';
import {
  Users, TrendingUp, CreditCard, ShoppingBag,
  ArrowUp, ArrowDown, MoreVertical, Calendar, ChevronDown, RefreshCw
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { transactions, chartData } from '@/lib/mock-data';
import StatusBadge from '@/components/StatusBadge';
import { ChartWrapper } from '@/components/charts/ChartWrapper';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { motion } from 'framer-motion';

const barData = [
  { name: 'Jan', value: 200 }, { name: 'Feb', value: 380 },
  { name: 'Mar', value: 180 }, { name: 'Apr', value: 280 },
  { name: 'May', value: 180 }, { name: 'Jun', value: 160 },
  { name: 'Jul', value: 270 }, { name: 'Aug', value: 100 },
  { name: 'Sep', value: 200 }, { name: 'Oct', value: 380 },
  { name: 'Nov', value: 260 }, { name: 'Dec', value: 140 },
];

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount).replace('NGN', '₦');
};

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('Overview');

  return (
    <div className="w-full space-y-4 animate-in fade-in duration-700 pb-10">
      {/* 1. OPERATIONS HEADER */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-xl font-black text-foreground tracking-tight">Executive Dashboard</h1>
          <p className="text-muted-foreground font-bold text-[11px] uppercase tracking-widest mt-0.5">Platform Performance & Operations Overview</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex items-center gap-2">
          <div className="flex items-center gap-2 bg-card border border-border px-3 py-1.5 rounded-xl shadow-sm text-[11px] font-black text-muted-foreground">
            <Calendar size={14} className="text-primary" />
            <span>MAY 7 - MAY 13</span>
            <ChevronDown size={12} />
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl border border-border bg-card hover:bg-secondary"><RefreshCw size={14} className="text-muted-foreground" /></Button>
        </motion.div>
      </div>

      {/* ===== KPI CARDS — 4 COLUMNS ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">

        {/* Card 1 */}
        <Card className="p-4 group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform border border-primary/20">
              <Users size={16} />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center gap-1">12.5% <ArrowUp size={10} /></span>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Users</p>
          <h3 className="text-xl font-black text-foreground tracking-tight mt-0.5">3,782</h3>
          <div className="absolute bottom-0 left-0 h-1 bg-primary opacity-0 group-hover:opacity-100 transition-all w-full" />
        </Card>

        {/* Card 2 */}
        <Card className="p-4 group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 rounded-lg bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform border border-rose-500/20">
              <ShoppingBag size={16} />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-rose-500/10 text-rose-500 flex items-center gap-1">9.05% <ArrowDown size={10} /></span>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Transactions</p>
          <h3 className="text-xl font-black text-foreground tracking-tight mt-0.5">5,359</h3>
          <div className="absolute bottom-0 left-0 h-1 bg-rose-500 opacity-0 group-hover:opacity-100 transition-all w-full" />
        </Card>

        {/* Card 3 */}
        <Card className="p-4 group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform border border-emerald-500/20">
              <TrendingUp size={16} />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center gap-1">18.7% <ArrowUp size={10} /></span>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Today's Revenue</p>
          <h3 className="text-xl font-black text-foreground tracking-tight mt-0.5">{formatCurrency(45800)}</h3>
          <div className="absolute bottom-0 left-0 h-1 bg-emerald-500 opacity-0 group-hover:opacity-100 transition-all w-full" />
        </Card>

        {/* Card 4 */}
        <Card className="p-4 group relative overflow-hidden">
          <div className="flex justify-between items-start mb-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform border border-indigo-500/20">
              <CreditCard size={16} />
            </div>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center gap-1">8.3% <ArrowUp size={10} /></span>
          </div>
          <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Smart Savings</p>
          <h3 className="text-xl font-black text-foreground tracking-tight mt-0.5">{formatCurrency(245000)}</h3>
          <div className="absolute bottom-0 left-0 h-1 bg-indigo-500 opacity-0 group-hover:opacity-100 transition-all w-full" />
        </Card>

      </div>

      {/* ===== CHARTS — 2 COLUMNS SIDE BY SIDE ===== */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">

        {/* Monthly Sales Bar Chart */}
        <Card className="lg:col-span-8 p-5">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Monthly Sales Analytics</h3>
            <button className="text-muted-foreground hover:text-foreground"><MoreVertical size={16} /></button>
          </div>
          <ChartWrapper height={250}>
            <BarChart data={barData} barGap={8}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="currentColor" className="text-muted-foreground" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} dy={10} />
              <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} />
              <Tooltip cursor={{ fill: 'hsl(var(--primary) / 0.05)' }} contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={24} />
            </BarChart>
          </ChartWrapper>
        </Card>

        {/* Monthly Target Gauge */}
        <Card className="lg:col-span-4 p-5 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-1">
            <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Goal Status</h3>
            <button className="text-muted-foreground hover:text-foreground"><MoreVertical size={16} /></button>
          </div>
          <p className="w-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-6">Monthly Target Performance</p>

          <div className="relative w-full">
            <ChartWrapper height={180}>
              <PieChart>
                <Pie data={[{ value: 75.55 }, { value: 24.45 }]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} paddingAngle={0} dataKey="value">
                  <Cell fill="hsl(var(--primary))" stroke="none" />
                  <Cell fill="hsl(var(--muted))" stroke="none" />
                </Pie>
              </PieChart>
            </ChartWrapper>
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center pb-2">
              <p className="text-3xl font-black text-foreground">75%</p>
              <span className="text-[9px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full mt-1 inline-block">+10%</span>
            </div>
          </div>

          <div className="grid grid-cols-3 w-full mt-6 pt-5 border-t border-border gap-2">
            <div className="text-center">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Target</p>
              <p className="text-xs font-black text-foreground mt-1">₦20K</p>
            </div>
            <div className="text-center border-x border-border px-2">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Revenue</p>
              <p className="text-xs font-black text-foreground mt-1">₦15K</p>
            </div>
            <div className="text-center">
              <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Daily</p>
              <p className="text-xs font-black text-foreground mt-1">₦3K</p>
            </div>
          </div>
        </Card>

      </div>

      {/* ===== STATISTICS SECTION ===== */}
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
        <ChartWrapper height={250}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148, 163, 184, 0.05)" vertical={false} />
            <XAxis dataKey="date" stroke="currentColor" className="text-muted-foreground" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} />
            <YAxis stroke="currentColor" className="text-muted-foreground" fontSize={10} fontWeight={700} tickLine={false} axisLine={false} />
            <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '12px', color: 'hsl(var(--foreground))' }} itemStyle={{ color: 'hsl(var(--foreground))' }} />
            <Line type="monotone" dataKey="volume" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ r: 3, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }} activeDot={{ r: 5, fill: 'hsl(var(--primary))', stroke: 'hsl(var(--background))', strokeWidth: 2 }} />
          </LineChart>
        </ChartWrapper>
      </Card>

      {/* ===== RECENT TRANSACTIONS TABLE ===== */}
      <Card className="overflow-hidden min-w-0 shadow-sm p-0">
        <div className="px-5 py-4 border-b border-border flex items-center justify-between bg-background">
          <h3 className="text-sm font-black text-foreground uppercase tracking-widest">Transaction Ledger</h3>
          <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase tracking-widest text-primary hover:bg-primary/10">View All</Button>
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
            <tbody className="divide-y divide-border">
              {transactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-secondary transition-colors group cursor-pointer">
                  <td className="px-5 py-2.5">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-[9px] font-black group-hover:bg-primary group-hover:text-white transition-all border border-border">
                        {txn.sender[0]}
                      </div>
                      <span className="text-[12px] font-black text-foreground">{txn.sender}</span>
                    </div>
                  </td>
                  <td className="px-5 py-2.5">
                    <span className="text-[9px] font-black text-muted-foreground uppercase bg-muted px-2 py-0.5 rounded-md border border-border">
                      {txn.type}
                    </span>
                  </td>
                  <td className="px-5 py-2.5 text-[12px] font-black text-foreground">{formatCurrency(txn.amount)}</td>
                  <td className="px-5 py-2.5 text-center">
                    <StatusBadge status={txn.status} />
                  </td>
                  <td className="px-5 py-2.5 text-right text-[10px] font-black text-muted-foreground uppercase tracking-tighter">{txn.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

    </div>
  );
}
