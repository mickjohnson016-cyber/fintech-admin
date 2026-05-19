'use client';

import React, { useState, useMemo, useEffect } from 'react';
import {
	MessageSquare,
	ShieldAlert,
	AlertCircle,
	Clock,
	User,
	Filter,
	RefreshCw,
	Plus,
	ArrowUpRight,
	Search,
	CheckCircle2,
	AlertTriangle,
	History,
	ChevronRight,
	Download,
	X,
	XCircle,
	Trash2,
	FileText,
	Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { DataTable } from '@/components/ui/DataTable';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { DashboardGrid } from '@/components/ui/DashboardGrid';
import { AdaptiveMetricCard } from '@/components/ui/AdaptiveMetricCard';
import IssueDetailModal from '@/components/support/IssueDetailModal';
import EscalationModal from '@/components/support/EscalationModal';
import AssignmentModal from '@/components/support/AssignmentModal';
import { useIssues, Ticket } from '@/hooks/useIssues';
import { QuickActionModal } from '@/components/ui/QuickActionModal';
import { ExportModal } from '@/components/ui/ExportModal';

export default function IssuesCenterPage() {
	const {
		issues,
		addIssue,
		assignIssue,
		escalateIssue,
		resolveIssue,
		closeIssue,
		deleteIssue,
		addNote,
		updateIssue
	} = useIssues();

	// Primary Management State
	const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);


	// Modal Visibility States
	const [isEscalating, setIsEscalating] = useState(false);
	const [isAssigning, setIsAssigning] = useState(false);
	const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
	const [isExportModalOpen, setIsExportModalOpen] = useState(false);

	// Derived State
	const selectedTicket = useMemo(() => {
		if (!selectedTicketId) return null;
		return issues.find((t: Ticket) => t.id === selectedTicketId) || null;
	}, [issues, selectedTicketId]);

	// Operational Handlers
	const handleCreateTicket = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);

		const newIssue: Ticket = {
			id: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
			user: formData.get('user') as string,
			type: formData.get('type') as string,
			priority: formData.get('priority') as any,
			status: 'Open',
			assignedTo: '',
			description: formData.get('description') as string,
			createdDate: new Date().toLocaleDateString(),
			lastUpdated: 'Just now',
			timeline: [{
				id: '1',
				type: 'status_change',
				title: 'Ticket Created',
				description: 'New ticket initialized via administrative console.',
				timestamp: 'Just now',
				user: { name: 'Admin', role: 'System', initials: 'AD' }
			}],
			notes: []
		};

		addIssue(newIssue);
		setIsNewTicketModalOpen(false);
	};

	const handleExport = () => {
		if (issues.length === 0) {
			toast.error("Export Unavailable", { description: "No incident records found in current queue." });
			return;
		}
		setIsExportModalOpen(true);
	};

	const executePermanentDelete = () => {
		if (selectedTicketId) {
			deleteIssue(selectedTicketId);
			setIsDeleteModalOpen(false);
			setSelectedTicketId(null);
		}
	};

	const columns = [
		{
			header: 'Ticket ID',
			accessorKey: 'id',
			sortable: true,
			cell: (item: Ticket) => (
				<span className="font-semibold text-primary font-mono text-[13px]">{item.id}</span>
			)
		},
		{
			header: 'User',
			accessorKey: 'user',
			sortable: true,
			cell: (item: Ticket) => (
				<div className="flex items-center gap-2.5">
					<div className="size-6 rounded-md bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground uppercase">
						{item.user[0]}
					</div>
					<span className="truncate max-w-[120px] font-medium">{item.user}</span>
				</div>
			)
		},
		{
			header: 'Issue Type',
			accessorKey: 'type',
			sortable: true,
			cell: (item: Ticket) => (
				<span className="px-2 py-0.5 rounded bg-secondary/80 text-[11px] font-medium text-muted-foreground/90 border border-border/40">
					{item.type}
				</span>
			)
		},
		{
			header: 'Priority',
			accessorKey: 'priority',
			sortable: true,
			cell: (item: Ticket) => (
				<div className="flex items-center gap-2">
					<div className={cn(
						"size-1.5 rounded-full shadow-sm",
						item.priority === 'Critical' ? "bg-rose-500" :
							item.priority === 'High' ? "bg-orange-500" :
								item.priority === 'Medium' ? "bg-amber-500" : "bg-emerald-500"
					)} />
					<span className="text-[12px] font-medium text-foreground/80">{item.priority}</span>
				</div>
			)
		},
		{
			header: 'Status',
			accessorKey: 'status',
			sortable: true,
			cell: (item: Ticket) => (
				<span className={cn(
					"px-2 py-0.5 rounded text-[11px] font-semibold tracking-tight border transition-colors",
					item.status === 'Open' ? "bg-blue-50 text-blue-600 border-blue-200" :
						item.status === 'Investigating' ? "bg-amber-50 text-amber-600 border-amber-200" :
							item.status === 'Escalated' ? "bg-rose-50 text-rose-600 border-rose-200" :
								item.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-200" :
									"bg-muted/50 text-muted-foreground border-border/50"
				)}>
					{item.status}
				</span>
			)
		},
		{
			header: 'Assigned',
			accessorKey: 'assignedTo',
			sortable: true,
			cell: (item: Ticket) => (
				<span className="text-muted-foreground text-[12px] font-medium truncate max-w-[100px]">
					{item.assignedTo || '—'}
				</span>
			)
		},
		{
			header: 'Last Updated',
			accessorKey: 'lastUpdated',
			sortable: true,
			cell: (item: Ticket) => (
				<span className="text-[11px] font-medium text-muted-foreground">{item.lastUpdated}</span>
			)
		}
	];

	return (
		<div className="space-y-8 animate-in fade-in duration-500 pb-12">
			<Breadcrumbs />

			{/* Header Section */}
			<div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
				<div className="space-y-1.5">
					<div className="flex items-center gap-3">
						<h1 className="text-3xl font-bold text-foreground tracking-tight">Issues Center</h1>
					</div>

				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="h-10 px-4 rounded-lg border-border/60 text-xs font-semibold gap-2 shadow-sm"
						onClick={() => toast.success("Queue Synced")}
					>
						<RefreshCw size={14} className="text-muted-foreground" /> Sync Log
					</Button>
					<Button
						className="h-10 px-5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold shadow-sm hover:opacity-90 transition-opacity gap-2"
						onClick={() => setIsNewTicketModalOpen(true)}
					>
						<Plus size={16} /> New Ticket
					</Button>
				</div>
			</div>

			{/* Metrics Section */}
			<DashboardGrid cols={4}>
				<AdaptiveMetricCard
					label="Total Active"
					value={issues.filter((i: Ticket) => i.status !== 'Resolved' && i.status !== 'Closed').length}
					icon={MessageSquare}
					color="text-primary"
				/>
				<AdaptiveMetricCard
					label="Investigating"
					value={issues.filter((i: Ticket) => i.status === 'Investigating').length}
					icon={Clock}
					color="text-amber-500"
				/>
				<AdaptiveMetricCard
					label="Escalated"
					value={issues.filter((i: Ticket) => i.status === 'Escalated').length}
					icon={ShieldAlert}
					color="text-rose-500"
				/>
				<AdaptiveMetricCard
					label="Resolved"
					value={issues.filter((i: Ticket) => i.status === 'Resolved' || i.status === 'Closed').length}
					icon={CheckCircle2}
					color="text-emerald-500"
				/>
			</DashboardGrid>

			{/* Main Ticket Table */}
			<div className="space-y-4">
				<DataTable
					data={issues}
					columns={columns}
					emptyTitle="No issues reported"
					emptyDescription="Platform health is currently optimal. Incident reports will appear here."
					emptyAction={
						<Button onClick={() => setIsNewTicketModalOpen(true)} variant="outline" className="h-9 px-4 rounded-lg text-xs font-semibold">
							Create First Ticket
						</Button>
					}
					onExport={handleExport}
					searchPlaceholder="Filter by ID, user, or type..."
					onRowClick={(ticket: Ticket) => setSelectedTicketId(ticket.id)}
					actions={(ticket: Ticket) => (
						<div className="relative flex items-center justify-end">
							<Button
								variant="ghost"
								size="icon"
								className="size-8 rounded-md text-rose-600 hover:text-rose-700 hover:bg-rose-50/50 transition-colors"
								onClick={(e: React.MouseEvent) => {
									e.stopPropagation();
									if (window.confirm(`Are you sure you want to delete ticket ${ticket.id}?`)) {
										deleteIssue(ticket.id);
									}
								}}
							>
								<Trash2 size={16} />
							</Button>
						</div>
					)}
				/>
			</div>

			{/* MODALS */}

			{/* 1. Ticket Details / Investigation Modal */}
			<IssueDetailModal
				issue={selectedTicket}
				isOpen={!!selectedTicket && !isEscalating && !isAssigning && !isDeleteModalOpen}
				onClose={() => setSelectedTicketId(null)}
				onEscalate={() => setIsEscalating(true)}
				onResolve={(id: string) => resolveIssue(id)}
				onAddNote={(id: string, note: string) => addNote(id, note)}
				onAssign={() => setIsAssigning(true)}
				onUpdateStatus={(id: string, status: any) => updateIssue(id, { status })}
				onUpdatePriority={(id: string, priority: any) => updateIssue(id, { priority })}
			/>

			{/* 2. Escalation Workflow */}
			<EscalationModal
				issue={selectedTicket}
				isOpen={isEscalating}
				onClose={() => setIsEscalating(false)}
				onConfirm={(team: string, reason: string, priority: any) => {
					if (selectedTicketId) escalateIssue(selectedTicketId, team, reason, priority);
					setIsEscalating(false);
				}}
			/>

			{/* 3. Assignment Workflow */}
			<AssignmentModal
				issue={selectedTicket}
				isOpen={isAssigning}
				onClose={() => setIsAssigning(false)}
				onAssign={(admin: string, team: string) => {
					if (selectedTicketId) assignIssue(selectedTicketId, admin, team);
					setIsAssigning(false);
				}}
			/>

			{/* 4. Manual Ticket Creation */}
			<AnimatePresence>
				{isNewTicketModalOpen && (
					<>
						<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewTicketModalOpen(false)} className="fixed inset-0 bg-background/60 backdrop-blur-sm z-[300]" />
						<div className="fixed inset-0 flex items-center justify-center z-[301] p-4 pointer-events-none">
							<motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.98, opacity: 0 }} className="w-full max-w-lg bg-card border border-border shadow-xl rounded-2xl overflow-hidden pointer-events-auto">
								<form onSubmit={handleCreateTicket}>
									<div className="p-6 border-b border-border flex items-center justify-between">
										<h3 className="text-lg font-bold text-foreground tracking-tight">Create Manual Ticket</h3>
										<button type="button" onClick={() => setIsNewTicketModalOpen(false)} className="p-1.5 hover:bg-muted rounded-md transition-colors"><X size={18} /></button>
									</div>
									<div className="p-6 space-y-5">
										<div className="space-y-1.5">
											<label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight ml-0.5">Customer Identity</label>
											<input name="user" required placeholder="Name or account reference..." className="w-full bg-background border border-border/80 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all" />
										</div>
										<div className="grid grid-cols-2 gap-4">
											<div className="space-y-1.5">
												<label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight ml-0.5">Issue Type</label>
												<select name="type" className="w-full bg-background border border-border/80 rounded-lg px-3 py-2.5 text-[13px] font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
													<option>Failed Transaction</option>
													<option>KYC Rejection</option>
													<option>Account Locked</option>
													<option>Card Issues</option>
													<option>Refund Request</option>
												</select>
											</div>
											<div className="space-y-1.5">
												<label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight ml-0.5">Priority</label>
												<select name="priority" className="w-full bg-background border border-border/80 rounded-lg px-3 py-2.5 text-[13px] font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none">
													<option>Low</option>
													<option>Medium</option>
													<option>High</option>
													<option>Critical</option>
												</select>
											</div>
										</div>
										<div className="space-y-1.5">
											<label className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight ml-0.5">Case Context</label>
											<textarea name="description" required rows={3} placeholder="Provide initial observations for the investigation..." className="w-full bg-background border border-border/80 rounded-lg px-4 py-2.5 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 transition-all resize-none" />
										</div>
									</div>
									<div className="p-6 pt-2">
										<Button type="submit" className="w-full h-11 rounded-lg bg-primary text-primary-foreground font-semibold text-sm shadow-sm hover:opacity-90 transition-opacity">Initialize Ticket</Button>
									</div>
								</form>
							</motion.div>
						</div>
					</>
				)}
			</AnimatePresence>

			{/* 5. Delete Confirmation (Authoritative Flow) */}
			<QuickActionModal
				isOpen={isDeleteModalOpen}
				onClose={() => {
					setIsDeleteModalOpen(false);
					setSelectedTicketId(null);
				}}
				onConfirm={executePermanentDelete}
				title="Delete Operational Ticket"
				description={`Confirming permanent deletion of ticket ${selectedTicketId}. This will purge all associated logs from the operational queue.`}
				icon={Trash2}
				type="danger"
				confirmLabel="Delete Ticket"
			/>

			{/* 6. Data Export Modal */}
			<ExportModal
				isOpen={isExportModalOpen}
				onClose={() => setIsExportModalOpen(false)}
				title="Export Operational Records"
				fileName="Operational_Issues_Report"
				data={issues.map((i: Ticket) => ({
					'Ticket ID': i.id,
					'User': i.user,
					'Type': i.type,
					'Priority': i.priority,
					'Status': i.status,
					'Assigned Admin': i.assignedTo || 'Unassigned',
					'Date Created': i.createdDate,
					'Last Updated': i.lastUpdated
				}))}
				headers={['Ticket ID', 'User', 'Type', 'Priority', 'Status', 'Assigned Admin', 'Date Created', 'Last Updated']}
			/>
		</div>
	);
}
