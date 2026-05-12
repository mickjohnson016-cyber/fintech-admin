'use client';

import React, { useState } from 'react';
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
  MoreVertical,
  ChevronRight,
  Download,
  X
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

export default function IssuesCenterPage() {
  const { 
    issues, 
    addIssue, 
    assignIssue, 
    escalateIssue, 
    resolveIssue, 
    addNote, 
    updateIssue 
  } = useIssues();

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [isEscalating, setIsEscalating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);

  const selectedTicket = issues.find(t => t.id === selectedTicketId) || null;

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
      }]
    };

    addIssue(newIssue);
    setIsNewTicketModalOpen(false);
  };

  const columns = [
    {
      header: 'Ticket ID',
      accessorKey: 'id',
      sortable: true,
      cell: (item: Ticket) => (
        <span className="font-black text-primary font-mono">{item.id}</span>
      )
    },
    {
      header: 'User',
      accessorKey: 'user',
      sortable: true,
      cell: (item: Ticket) => (
        <div className="flex items-center gap-2">
          <div className="size-6 rounded-lg bg-secondary border border-border/40 flex items-center justify-center text-[10px] font-black text-muted-foreground">
            {item.user[0]}
          </div>
          <span className="truncate max-w-[120px] font-bold">{item.user}</span>
        </div>
      )
    },
    {
      header: 'Issue Type',
      accessorKey: 'type',
      sortable: true,
      cell: (item: Ticket) => (
        <span className="px-2 py-1 rounded-md bg-secondary/50 text-[10px] font-black uppercase tracking-tight text-foreground/70">
          {item.type}
        </span>
      )
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (item: Ticket) => (
        <div className="flex items-center gap-1.5">
          <div className={cn(
            "size-1.5 rounded-full",
            item.priority === 'Critical' ? "bg-rose-500 shadow-[0_0_8px_#F43F5E]" :
            item.priority === 'High' ? "bg-orange-500" :
            item.priority === 'Medium' ? "bg-amber-500" : "bg-emerald-500"
          )} />
          <span className={cn(
            "text-[11px] font-black uppercase tracking-tighter",
            item.priority === 'Critical' ? "text-rose-500" : "text-foreground/70"
          )}>{item.priority}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (item: Ticket) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
          item.status === 'Open' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
          item.status === 'Investigating' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
          item.status === 'Escalated' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
          item.status === 'Resolved' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
          "bg-muted border-border/40 text-muted-foreground"
        )}>
          {item.status}
        </span>
      )
    },
    {
      header: 'Assigned To',
      accessorKey: 'assignedTo',
      sortable: true,
      cell: (item: Ticket) => (
        <span className="text-muted-foreground italic text-[11px] font-bold">{item.assignedTo || 'Unassigned'}</span>
      )
    },
    {
      header: 'Updated',
      accessorKey: 'lastUpdated',
      sortable: true,
      cell: (item: Ticket) => (
        <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.lastUpdated}</span>
      )
    }
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      <Breadcrumbs />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-foreground tracking-tighter flex items-center gap-3">
            Issues Center
            <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest border border-primary/20">Operational</span>
          </h1>
          <p className="text-[13px] font-medium text-muted-foreground">Manage user reports, investigate incidents, and escalate operational blockers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            className="h-11 rounded-2xl border-border/40 font-black text-[11px] uppercase tracking-widest flex items-center gap-2"
            onClick={() => toast.success("Queue Refreshed", { description: "Incident log synchronized with backend." })}
          >
            <RefreshCw size={14} /> Sync Log
          </Button>
          <Button 
            className="h-11 rounded-2xl bg-primary text-white px-6 font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
            onClick={() => setIsNewTicketModalOpen(true)}
          >
            <Plus size={16} /> New Ticket
          </Button>
        </div>
      </div>

      <DashboardGrid cols={4}>
        <AdaptiveMetricCard 
          label="Total Active" 
          value={issues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length.toString()}
          icon={MessageSquare} 
          trend="-- %" 
          trendUp={null}
          color="primary"
        />
        <AdaptiveMetricCard 
          label="Pending Investigation" 
          value={issues.filter(i => i.status === 'Investigating').length.toString()}
          icon={Clock} 
          trend="-- %" 
          trendUp={null}
          color="amber"
        />
        <AdaptiveMetricCard 
          label="Escalated Cases" 
          value={issues.filter(i => i.status === 'Escalated').length.toString()}
          icon={ShieldAlert} 
          trend="-- %" 
          trendUp={null}
          color="rose"
        />
        <AdaptiveMetricCard 
          label="Resolved (All time)" 
          value={issues.filter(i => i.status === 'Resolved').length.toString()}
          icon={CheckCircle2} 
          trend="-- %" 
          trendUp={null}
          color="emerald"
        />
      </DashboardGrid>

      <div className="pt-2">
        <DataTable 
          data={issues}
          columns={columns}
          emptyTitle="No issues reported"
          emptyDescription="Platform operational health is optimal. New incident reports will appear here."
          searchPlaceholder="Search by ID, User, or Issue Type..."
          onRowClick={(ticket) => setSelectedTicketId(ticket.id)}
          actions={(ticket) => (
            <div className="flex items-center justify-end gap-1">
              <Button variant="ghost" size="icon" className="size-8 rounded-lg" onClick={(e) => { e.stopPropagation(); setSelectedTicketId(ticket.id); }}>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Button>
            </div>
          )}
        />
      </div>

      {/* MODALS */}
      <IssueDetailModal 
        issue={selectedTicket}
        isOpen={!!selectedTicket && !isEscalating && !isAssigning}
        onClose={() => setSelectedTicketId(null)}
        onEscalate={() => setIsEscalating(true)}
        onResolve={(id) => resolveIssue(id)}
        onAddNote={(id, note) => addNote(id, note)}
        onAssign={() => setIsAssigning(true)}
        onUpdateStatus={(id, status) => updateIssue(id, { status })}
        onUpdatePriority={(id, priority) => updateIssue(id, { priority })}
      />

      <EscalationModal 
        issue={selectedTicket}
        isOpen={isEscalating}
        onClose={() => setIsEscalating(false)}
        onConfirm={(team, reason, priority) => {
          if (selectedTicketId) escalateIssue(selectedTicketId, team, reason, priority);
        }}
      />

      <AssignmentModal 
        issue={selectedTicket}
        isOpen={isAssigning}
        onClose={() => setIsAssigning(false)}
        onAssign={(admin, team) => {
          if (selectedTicketId) assignIssue(selectedTicketId, admin, team);
          setIsAssigning(false);
        }}
      />

      {/* NEW TICKET MODAL (Administrative Tool) */}
      <AnimatePresence>
        {isNewTicketModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewTicketModalOpen(false)} className="fixed inset-0 bg-background/80 backdrop-blur-md z-[300]" />
            <div className="fixed inset-0 flex items-center justify-center z-[301] p-4 pointer-events-none">
              <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="w-full max-w-lg bg-card border border-border rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto">
                <form onSubmit={handleCreateTicket}>
                  <div className="p-8 border-b border-border/10 flex items-center justify-between">
                    <h3 className="text-xl font-black text-foreground uppercase tracking-tight">Create Manual Ticket</h3>
                    <button type="button" onClick={() => setIsNewTicketModalOpen(false)} className="p-2 hover:bg-secondary rounded-xl transition-all"><X size={18} /></button>
                  </div>
                  <div className="p-8 space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Customer Name</label>
                      <input name="user" required placeholder="Full Name or Username" className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:bg-background transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Issue Type</label>
                        <select name="type" className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-background transition-all">
                          <option>Failed Transaction</option>
                          <option>KYC Rejection</option>
                          <option>Account Locked</option>
                          <option>Card Issues</option>
                          <option>Refund Request</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Initial Priority</label>
                        <select name="priority" className="w-full bg-secondary/30 border border-border/10 rounded-xl px-4 py-3 text-xs font-bold outline-none focus:bg-background transition-all">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Case Description</label>
                      <textarea name="description" required rows={3} placeholder="Provide initial context for the investigation..." className="w-full bg-secondary/30 border border-border/10 rounded-2xl px-4 py-3 text-sm font-bold outline-none focus:bg-background transition-all resize-none" />
                    </div>
                  </div>
                  <div className="p-8 pt-0">
                    <Button type="submit" className="w-full h-12 rounded-2xl bg-primary text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20">Generate Operational Ticket</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
