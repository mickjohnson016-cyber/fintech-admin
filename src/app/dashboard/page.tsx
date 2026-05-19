
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
import { CardActionMenu } from '@/components/ui/CardActionMenu';
import { QuickActionModal } from '@/components/ui/QuickActionModal';
import { ExportModal } from '@/components/ui/ExportModal';

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount).replace('NGN', '₦');
};

export default function DashboardPage() {
    const [activeTab, setActiveTab] = useState('Overview');
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isTargetModalOpen, setIsTargetModalOpen] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const router = useRouter();

    const handleRefresh = () => {
        setIsRefreshing(true);
        setTimeout(() => {
            setIsRefreshing(false);
            toast.success('Data Synced');
        }, 1500);
    };

    const handleExport = () => {
        setIsExportModalOpen(true);
    };

    return (
        <div className="w-full space-y-6 animate-in fade-in duration-500 pb-12">
            <Breadcrumbs />

            {/* Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
                <div className="space-y-1">
                    <h1 className="text-2xl font-semibold text-foreground tracking-tight">Executive Dashboard</h1>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        variant="outline"
                        size="icon"
                        className="h-9 w-9 rounded-lg border-border/60 shadow-sm"
                    >
                        <RefreshCw size={14} className={cn("text-muted-foreground", isRefreshing && "animate-spin")} />
                    </Button>
                </div>
            </div>

            {/* KPI Cards */}
            <DashboardGrid cols={4}>
                <AdaptiveMetricCard
                    label="Total Users"
                    value="0"
                    icon={Users}
                    trend="--"
                />
                <AdaptiveMetricCard
                    label="Total Transactions"
                    value="0"
                    icon={ShoppingBag}
                    trend="--"
                />
                <AdaptiveMetricCard
                    label="Today's Revenue"
                    value={formatCurrency(0)}
                    icon={TrendingUp}
                    trend="--"
                />
                <AdaptiveMetricCard
                    label="Smart Savings"
                    value={formatCurrency(0)}
                    icon={CreditCard}
                    trend="--"
                />
            </DashboardGrid>

            {/* Main Analytics Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                {/* Sales Chart */}
                <Card className="lg:col-span-8 overflow-hidden border-border/50">
                    <div className="p-6 border-b border-border/40 flex justify-between items-center bg-muted/5">
                        <div>
                            <h3 className="text-sm font-semibold text-foreground tracking-tight">Monthly Performance</h3>
                            <p className="text-[12px] text-muted-foreground mt-0.5">Aggregated sales and volume trends.</p>
                        </div>
                        <CardActionMenu items={[
                            { label: 'Export Data', icon: Download, onClick: () => setIsExportModalOpen(true) },
                            { label: 'Sync Records', icon: RefreshCw, onClick: handleRefresh },
                            { label: 'Detailed Analytics', icon: Eye, onClick: () => router.push('/reports'), dividerBefore: true },
                        ]} />
                    </div>
                    <div className="p-6 min-h-[300px] flex items-center justify-center">
                        <EmptyState
                            icon={BarChart3}
                            title="Awaiting Analytics Data"
                            description=""
                        />
                    </div>
                </Card>

                {/* Goal Gauge */}
                <Card className="lg:col-span-4 p-6 flex flex-col border-border/50">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-sm font-semibold text-foreground tracking-tight">Revenue Goal</h3>
                        <CardActionMenu items={[
                            { label: 'Update Target', icon: TrendingUp, onClick: () => setIsTargetModalOpen(true) },
                            { label: 'Export Goals', icon: Download, onClick: () => setIsExportModalOpen(true) },
                        ]} />
                    </div>

                    <div className="flex-1 flex items-center justify-center">
                        <EmptyState
                            compact
                            title="No targets initialized"
                        />
                    </div>

                    <div className="grid grid-cols-3 w-full mt-6 pt-5 border-t border-border/40 gap-4">
                        <div className="text-center space-y-1">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">Target</p>
                            <p className="text-[13px] font-semibold text-foreground">--</p>
                        </div>
                        <div className="text-center space-y-1 border-x border-border/40">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">Current</p>
                            <p className="text-[13px] font-semibold text-foreground">--</p>
                        </div>
                        <div className="text-center space-y-1">
                            <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">Velocity</p>
                            <p className="text-[13px] font-semibold text-foreground">--</p>
                        </div>
                    </div>
                </Card>

            </div>

            {/* Transaction Feed */}
            <Card className="overflow-hidden border-border/50">
                <div className="px-6 py-4 border-b border-border/40 flex items-center justify-between bg-muted/10">
                    <h3 className="text-[13px] font-semibold text-foreground">Transaction Pulse</h3>
                    <Button onClick={() => router.push('/transactions')} variant="ghost" size="sm" className="text-[12px] font-semibold text-primary hover:bg-primary/10 rounded-lg h-8">
                        View Ledger
                    </Button>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-muted/5 text-[11px] font-semibold text-muted-foreground uppercase tracking-tight border-b border-border/30">
                                <th className="px-6 py-3.5">Customer Profile</th>
                                <th className="px-6 py-3.5">Payment Method</th>
                                <th className="px-6 py-3.5">Settlement Amount</th>
                                <th className="px-6 py-3.5 text-center">Status</th>
                                <th className="px-6 py-3.5 text-right">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td colSpan={5} className="px-6 py-20 text-center">
                                    <EmptyState
                                        icon={Database}
                                        title="Ledger is Empty"
                                        description=""
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* MODALS */}
            <ExportModal
                isOpen={isExportModalOpen}
                onClose={() => setIsExportModalOpen(false)}
                title="Export Executive Analytics"
                fileName="Executive_Analytics_Report"
                data={[]}
                headers={['Metric', 'Value', 'Trend', 'Status']}
            />

            <QuickActionModal
                isOpen={isTargetModalOpen}
                onClose={() => setIsTargetModalOpen(false)}
                onConfirm={() => {
                    setIsTargetModalOpen(false);
                    toast.success('Target Updated');
                }}
                title="Set Revenue Target"
                description=""
                icon={TrendingUp}
            >
                <div className="space-y-4 pt-2">
                    <div className="space-y-1.5">
                        <label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight ml-0.5">Target Amount (NGN)</label>
                        <input
                            type="text"
                            placeholder="e.g. 5,000,000"
                            className="w-full bg-background border border-border rounded-lg px-4 py-2.5 outline-none focus:ring-2 focus:ring-primary/10 transition-all font-medium text-sm"
                        />
                    </div>
                </div>
            </QuickActionModal>

        </div>
    );
}
