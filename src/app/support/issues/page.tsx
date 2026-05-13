'use client';

import React, { useState, useMemo } from 'react';
import { 
  MessageSquare, 
  ShieldAlert, 
  Clock, 
  Filter,
  RefreshCw,
  Plus,
  CheckCircle2,
  MoreVertical,
  X,
  Edit2,
  UserPlus,
  ShieldCheck,
  Trash2,
  Eye,
  ArrowUpCircle
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

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);
  const [isEscalating, setIsEscalating] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  const [isNewTicketModalOpen, setIsNewTicketModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const selectedTicket = useMemo(() => {
    if (!selectedTicketId) return null;
    return issues.find(t => t.id === selectedTicketId) || null;
  }, [issues, selectedTicketId]);

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
      toast.error("Export Unavailable");
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
        <span className="font-medium text-primary font-mono text-[13px]">{item.id}</span>
      )
    },
    {
      header: 'User',
      accessorKey: 'user',
      sortable: true,
      cell: (item: Ticket) => (
        <div className="flex items-center gap-2">
          <div className="size-6 rounded bg-muted flex items-center justify-center text-[10px] font-semibold text-muted-foreground">
            {item.user[0]}
          </div>
          <span className="truncate max-w-[120px] font-medium text-foreground">{item.user}</span>
        </div>
      )
    },
    {
      header: 'Type',
      accessorKey: 'type',
      sortable: true,
      cell: (item: Ticket) => (
        <span className="text-[12px] text-muted-foreground">{item.type}</span>
      )
    },
    {
      header: 'Priority',
      accessorKey: 'priority',
      sortable: true,
      cell: (item: Ticket) => (
        <div className="flex items-center gap-2">
          <div className={cn(
            "size-1.5 rounded-full",
            item.priority === 'Critical' ? "bg-rose-500" :
            item.priority === 'High' ? "bg-orange-500" :
            item.priority === 'Medium' ? "bg-amber-500" : "bg-emerald-500"
          )} />
          <span className="text-[12px] font-medium">{item.priority}</span>
        </div>
      )
    },
    {
      header: 'Status',
      accessorKey: 'status',
      sortable: true,
      cell: (item: Ticket) => (
        <span className={cn(
          "px-2 py-0.5 rounded text-[11px] font-medium border",
          item.status === 'Open' ? "bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20" :
          item.status === 'Investigating' ? "bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20" :
          item.status === 'Escalated' ? "bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20" :
          item.status === 'Resolved' ? "bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20" :
          "bg-muted text-muted-foreground border-border"
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
        <span className="text-muted-foreground text-[12px]">{item.assignedTo || '—'}</span>
      )
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <Breadcrumbs />

      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">Issues Center</h1>
          <p className="text-[14px] text-muted-foreground">Manage and resolve administrative incidents.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => toast.success("Synced")}>
            <RefreshCw size={14} className="mr-2" /> Sync Log
          </Button>
          <Button size="sm" onClick={() => setIsNewTicketModalOpen(true)}>
            <Plus size={14} className="mr-2" /> New Ticket
          </Button>
        </div>
      </div>

      <DashboardGrid cols={4}>
        <AdaptiveMetricCard 
          label="Total Active" 
          value={issues.filter(i => i.status !== 'Resolved' && i.status !== 'Closed').length}
          icon={MessageSquare} 
        />
        <AdaptiveMetricCard 
          label="Investigating" 
          value={issues.filter(i => i.status === 'Investigating').length}
          icon={Clock} 
        />
        <AdaptiveMetricCard 
          label="Escalated" 
          value={issues.filter(i => i.status === 'Escalated').length}
          icon={ShieldAlert} 
        />
        <AdaptiveMetricCard 
          label="Resolved" 
          value={issues.filter(i => i.status === 'Resolved' || i.status === 'Closed').length}
          icon={CheckCircle2} 
        />
      </DashboardGrid>

      <div className="space-y-4">
        <DataTable 
          data={issues}
          columns={columns}
          onExport={handleExport}
          onRowClick={(ticket) => setSelectedTicketId(ticket.id)}
          actions={(ticket) => (
            <div className="relative flex items-center justify-end">
              <Button 
                variant="ghost" 
                size="icon" 
                className={cn("size-8", activeMenuId === ticket.id && "bg-muted")}
                onClick={(e) => {
                   e.stopPropagation();
                   setActiveMenuId(activeMenuId === ticket.id ? null : ticket.id);
                }}
              >
                <MoreVertical size={14} />
              </Button>

              <AnimatePresence>
                {activeMenuId === ticket.id && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={(e) => { e.stopPropagation(); setActiveMenuId(null); }} />
                    <motion.div 
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 4 }}
                      className="absolute right-0 top-full mt-1 w-44 bg-card border border-border shadow-md rounded-lg z-20 overflow-hidden p-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {[
                        { label: 'View Details', icon: Eye, onClick: () => { setSelectedTicketId(ticket.id); setActiveMenuId(null); } },
                        { label: 'Edit Ticket', icon: Edit2, onClick: () => { setSelectedTicketId(ticket.id); setActiveMenuId(null); } },
                        { label: 'Assign Admin', icon: UserPlus, onClick: () => { setSelectedTicketId(ticket.id); setIsAssigning(true); setActiveMenuId(null); } },
                        { label: 'Escalate Case', icon: ArrowUpCircle, onClick: () => { setSelectedTicketId(ticket.id); setIsEscalating(true); setActiveMenuId(null); } },
                        { label: 'Close Ticket', icon: ShieldCheck, onClick: () => { closeIssue(ticket.id); setActiveMenuId(null); }, className: 'text-emerald-600' },
                      ].map((item, i) => (
                        <button key={i} onClick={(e) => { e.stopPropagation(); item.onClick(); }}
                          className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors", item.className)}
                        >
                           <item.icon size={14} /> {item.label}
                        </button>
                      ))}
                      <div className="h-px bg-border my-1" />
                      <button onClick={(e) => { e.stopPropagation(); setSelectedTicketId(ticket.id); setIsDeleteModalOpen(true); setActiveMenuId(null); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] font-medium text-destructive hover:bg-destructive/5 transition-colors"
                      >
                         <Trash2 size={14} /> Delete
                      </button>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}
        />
      </div>

      <IssueDetailModal 
        issue={selectedTicket} isOpen={!!selectedTicket && !isEscalating && !isAssigning && !isDeleteModalOpen}
        onClose={() => setSelectedTicketId(null)} onEscalate={() => setIsEscalating(true)}
        onResolve={(id) => resolveIssue(id)} onAddNote={(id, note) => addNote(id, note)}
        onAssign={() => setIsAssigning(true)} onUpdateStatus={(id, status) => updateIssue(id, { status })}
        onUpdatePriority={(id, priority) => updateIssue(id, { priority })}
      />

      <EscalationModal 
        issue={selectedTicket} isOpen={isEscalating} onClose={() => setIsEscalating(false)}
        onConfirm={(team, reason, priority) => {
          if (selectedTicketId) escalateIssue(selectedTicketId, team, reason, priority);
          setIsEscalating(false);
        }}
      />

      <AssignmentModal 
        issue={selectedTicket} isOpen={isAssigning} onClose={() => setIsAssigning(false)}
        onAssign={(admin, team) => {
          if (selectedTicketId) assignIssue(selectedTicketId, admin, team);
          setIsAssigning(false);
        }}
      />

      <AnimatePresence>
        {isNewTicketModalOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsNewTicketModalOpen(false)} className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[300]" />
            <div className="fixed inset-0 flex items-center justify-center z-[301] p-4 pointer-events-none">
              <motion.div initial={{ scale: 0.99, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.99, opacity: 0 }} className="w-full max-w-lg bg-card border border-border shadow-lg rounded-xl overflow-hidden pointer-events-auto">
                <form onSubmit={handleCreateTicket}>
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h3 className="text-lg font-semibold">Create Ticket</h3>
                    <button type="button" onClick={() => setIsNewTicketModalOpen(false)} className="p-1 hover:bg-muted rounded transition-colors"><X size={18} /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-tight">User Identity</label>
                      <input name="user" required placeholder="Account name..." className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Issue Type</label>
                        <select name="type" className="w-full bg-background border border-border rounded-md px-2 py-2 text-sm outline-none">
                          <option>Failed Transaction</option>
                          <option>KYC Rejection</option>
                          <option>Account Locked</option>
                          <option>Card Issues</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Priority</label>
                        <select name="priority" className="w-full bg-background border border-border rounded-md px-2 py-2 text-sm outline-none">
                          <option>Low</option>
                          <option>Medium</option>
                          <option>High</option>
                          <option>Critical</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-muted-foreground uppercase tracking-tight">Description</label>
                      <textarea name="description" required rows={3} placeholder="Incident details..." className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-primary/30 resize-none" />
                    </div>
                  </div>
                  <div className="p-6 pt-0">
                    <Button type="submit" className="w-full">Initialize Ticket</Button>
                  </div>
                </form>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <QuickActionModal 
        isOpen={isDeleteModalOpen} onClose={() => { setIsDeleteModalOpen(false); setSelectedTicketId(null); }}
        onConfirm={executePermanentDelete} title="Delete Ticket"
        description={`Confirm deletion of ${selectedTicketId}. This action is permanent.`}
        type="danger" confirmLabel="Delete"
      />

      <ExportModal 
        isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)}
        title="Export Data" fileName="Incident_Log"
        data={issues.map(i => ({ 'ID': i.id, 'User': i.user, 'Status': i.status }))}
        headers={['ID', 'User', 'Status']}
      />
    </div>
  );
}
