'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  User, 
  Clock, 
  ShieldAlert, 
  ArrowUpRight,
  MessageSquare,
  History,
  FileText,
  Lock,
  ExternalLink,
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  Send,
  Flag,
  Share2,
  Paperclip,
  Save,
  RotateCcw,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { ActivityTimeline } from '@/components/ui/ActivityTimeline';
import { Ticket } from '@/hooks/useIssues';

interface IssueDetailModalProps {
  issue: Ticket | null;
  isOpen: boolean;
  onClose: () => void;
  onEscalate: (issue: Ticket) => void;
  onResolve: (id: string) => void;
  onAddNote: (id: string, note: string) => void;
  onAssign: (issue: Ticket) => void;
  onUpdateStatus: (id: string, status: Ticket['status']) => void;
  onUpdatePriority: (id: string, priority: Ticket['priority']) => void;
}

export default function IssueDetailModal({ 
  issue, 
  isOpen, 
  onClose, 
  onEscalate,
  onResolve,
  onAddNote,
  onAssign,
  onUpdateStatus,
  onUpdatePriority
}: IssueDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'activity' | 'files' | 'reply'>('overview');
  const [internalNote, setInternalNote] = useState("");
  const [userReply, setUserReply] = useState("");
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  if (!issue) return null;

  const handleAddNote = () => {
    if (!internalNote.trim()) return;
    onAddNote(issue.id, internalNote);
    setInternalNote("");
    toast.success("Note Added", { description: "Internal observation recorded." });
  };

  const handleSendReply = () => {
    if (!userReply.trim()) return;
    toast.success("Reply Sent", { description: "User has been notified via dashboard and email." });
    setUserReply("");
    setActiveTab('overview');
  };

  const handleSaveDraft = () => {
    setIsSavingDraft(true);
    setTimeout(() => {
      setIsSavingDraft(false);
      toast.info("Draft Saved", { description: "Your progress has been cached locally." });
    }, 800);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
          />

          <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 100 }}
            className="fixed inset-y-0 right-0 w-full max-w-2xl bg-card border-l border-border/50 shadow-2xl z-[101] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-8 border-b border-border/10 flex items-center justify-between bg-muted/30">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="text-2xl font-black text-primary font-mono tracking-tighter">{issue.id}</span>
                  
                  {/* Priority Picker */}
                  <div className="relative group/priority">
                    <button className={cn(
                      "px-2.5 py-1 rounded-md text-[9px] font-black uppercase tracking-widest border transition-all",
                      issue.priority === 'Critical' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : 
                      issue.priority === 'High' ? "bg-orange-500/10 border-orange-500/20 text-orange-500" :
                      "bg-muted border-border/40 text-muted-foreground"
                    )}>
                      {issue.priority} Priority
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-32 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover/priority:opacity-100 group-hover/priority:visible transition-all z-50 py-1">
                      {['Low', 'Medium', 'High', 'Critical'].map((p) => (
                        <button 
                          key={p} 
                          onClick={() => onUpdatePriority(issue.id, p as any)}
                          className="w-full px-3 py-1.5 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Status Picker */}
                  <div className="relative group/status">
                    <button className={cn(
                      "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all",
                      issue.status === 'Open' ? "bg-blue-500/10 border-blue-500/20 text-blue-500" :
                      issue.status === 'Investigating' ? "bg-amber-500/10 border-amber-500/20 text-amber-500" :
                      issue.status === 'Escalated' ? "bg-rose-500/10 border-rose-500/20 text-rose-500" :
                      issue.status === 'Resolved' ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-500" :
                      "bg-muted border-border/40 text-muted-foreground"
                    )}>
                      {issue.status}
                    </button>
                    <div className="absolute top-full left-0 mt-2 w-40 bg-card border border-border rounded-xl shadow-xl opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-50 py-1">
                      {['Open', 'Pending', 'Investigating', 'Escalated', 'Resolved', 'Closed'].map((s) => (
                        <button 
                          key={s} 
                          onClick={() => onUpdateStatus(issue.id, s as any)}
                          className="w-full px-3 py-1.5 text-left text-[9px] font-black uppercase tracking-widest text-muted-foreground hover:bg-secondary hover:text-foreground"
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
                <h2 className="text-xl font-black text-foreground tracking-tight">{issue.type}</h2>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => toast.info("Link Copied", { description: "Case deep-link copied to clipboard." })}
                  className="p-3 bg-card border border-border/20 rounded-2xl text-muted-foreground hover:text-foreground transition-all"
                >
                  <Share2 size={18} />
                </button>
                <button 
                  onClick={onClose}
                  className="p-3 bg-card border border-border/20 rounded-2xl text-muted-foreground hover:text-foreground transition-all"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="px-8 border-b border-border/10 bg-card">
              <div className="flex items-center gap-8 overflow-x-auto no-scrollbar">
                {['overview', 'activity', 'files', 'reply'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={cn(
                      "py-4 text-[11px] font-black uppercase tracking-widest transition-all relative whitespace-nowrap",
                      activeTab === tab ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                    {activeTab === tab && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
              {activeTab === 'overview' && (
                <>
                  {/* User Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Reporter Information</h4>
                    <div className="p-6 bg-secondary/30 border border-border/10 rounded-[32px] flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-card border border-border/40 flex items-center justify-center text-primary font-black text-xl shadow-inner shrink-0">
                          {issue.user[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] font-black text-foreground tracking-tight truncate">{issue.user}</p>
                          <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">ID: PLAT-USR-8821</p>
                        </div>
                      </div>
                      <Button variant="outline" className="h-9 rounded-xl border-border/40 font-black text-[9px] uppercase tracking-widest gap-2 shrink-0">
                        View User <ArrowUpRight size={14} />
                      </Button>
                    </div>
                  </div>

                  {/* Assignment Section */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Owner & Team</h4>
                    <div className="p-6 bg-secondary/30 border border-border/10 rounded-[32px] flex flex-col sm:flex-row sm:items-center justify-between gap-6 group">
                      <div className="flex items-center gap-4">
                        <div className="size-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary shrink-0">
                          <User size={24} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[15px] font-black text-foreground tracking-tight truncate">{issue.assignedTo || 'Unassigned'}</p>
                          <p className="text-[11px] font-bold text-muted-foreground/60 uppercase tracking-widest">{issue.assignedTeam || 'No Team Assigned'}</p>
                        </div>
                      </div>
                      <Button 
                        onClick={() => onAssign(issue)}
                        variant="outline" 
                        className="h-9 rounded-xl border-border/40 font-black text-[9px] uppercase tracking-widest gap-2 shrink-0 hover:bg-primary/5 hover:text-primary hover:border-primary/20"
                      >
                        <UserPlus size={14} /> {issue.assignedTo ? 'Change Owner' : 'Assign Admin'}
                      </Button>
                    </div>
                  </div>

                  {/* Issue Description */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Investigation Details</h4>
                    <div className="p-6 bg-secondary/20 border border-border/5 rounded-[32px] space-y-4">
                      <p className="text-[13px] font-medium text-foreground/80 leading-relaxed italic">
                        "{issue.description}"
                      </p>
                      <div className="flex flex-wrap gap-2 pt-2">
                        <div className="px-3 py-1.5 bg-background border border-border/40 rounded-xl flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                          <AlertTriangle size={12} className="text-amber-500" /> Timeout Cluster-B
                        </div>
                        <div className="px-3 py-1.5 bg-background border border-border/40 rounded-xl flex items-center gap-2 text-[10px] font-bold text-muted-foreground">
                          <CheckCircle2 size={12} className="text-emerald-500" /> Ledger Verified
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="space-y-4">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Internal Admin Notes</h4>
                    <div className="relative group">
                      <textarea 
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        placeholder="Add observation or evidence for other admins..."
                        className="w-full bg-secondary/30 border border-border/40 rounded-[24px] p-5 text-sm font-bold min-h-[120px] outline-none focus:bg-background focus:border-primary/40 transition-all no-scrollbar"
                      />
                      <Button 
                        onClick={handleAddNote}
                        className="absolute bottom-4 right-4 h-9 rounded-xl bg-primary text-white px-4 font-black text-[10px] uppercase tracking-widest"
                      >
                        Add Note
                      </Button>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'activity' && (
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Issue Timeline & Audit Trail</h4>
                  <ActivityTimeline events={issue.timeline} />
                </div>
              )}

              {activeTab === 'files' && (
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Attachments & Evidence</h4>
                  <div className="py-20 text-center space-y-4 bg-secondary/10 border-2 border-dashed border-border/20 rounded-[32px]">
                    <div className="size-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto border border-border/10">
                      <Paperclip size={24} className="text-muted-foreground/20" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">Drop files here to attach</p>
                      <p className="text-[9px] font-bold text-muted-foreground/40 uppercase tracking-widest">Max size: 10MB per file</p>
                    </div>
                    <Button variant="outline" className="h-9 rounded-xl border-border/40 font-black text-[9px] uppercase tracking-widest">Select Files</Button>
                  </div>
                </div>
              )}

              {activeTab === 'reply' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Reply to User</h4>
                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <div className="size-1 bg-emerald-500 rounded-full animate-pulse" /> User Online
                    </span>
                  </div>
                  <div className="space-y-4">
                    <div className="relative group">
                      <textarea 
                        value={userReply}
                        onChange={(e) => setUserReply(e.target.value)}
                        placeholder="Compose a message to the user..."
                        className="w-full bg-secondary/30 border border-border/40 rounded-[32px] p-6 text-sm font-bold min-h-[200px] outline-none focus:bg-background focus:border-primary/40 transition-all no-scrollbar"
                      />
                      <div className="absolute bottom-4 right-4 flex items-center gap-2">
                        <Button 
                          onClick={handleSaveDraft}
                          variant="ghost"
                          className="h-9 rounded-xl font-black text-[10px] uppercase tracking-widest gap-2"
                        >
                          {isSavingDraft ? <RotateCcw size={14} className="animate-spin" /> : <Save size={14} />} Save Draft
                        </Button>
                        <Button 
                          onClick={handleSendReply}
                          className="h-10 rounded-xl bg-primary text-white px-6 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center gap-2"
                        >
                          <Send size={14} /> Send Reply
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-start gap-3">
                      <MessageSquare size={16} className="text-primary mt-0.5" />
                      <p className="text-[11px] font-medium text-primary/80 leading-relaxed">
                        User will be notified via their mobile app and registered email address immediately.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="p-8 border-t border-border/10 bg-card flex flex-col sm:flex-row gap-4">
              <Button 
                variant="outline"
                className="flex-1 h-12 rounded-2xl border-border/40 font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2"
                onClick={() => onEscalate(issue)}
              >
                <ShieldAlert size={16} /> Escalate Case
              </Button>
              <Button 
                className={cn(
                  "flex-1 h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg",
                  issue.status === 'Resolved' || issue.status === 'Closed' 
                    ? "bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20" 
                    : "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/20"
                )}
                onClick={() => {
                  if (issue.status === 'Resolved' || issue.status === 'Closed') {
                    onUpdateStatus(issue.id, 'Open');
                    toast.success("Ticket Reopened", { description: "Issue has been returned to the active queue." });
                  } else {
                    onResolve(issue.id);
                  }
                }}
              >
                {issue.status === 'Resolved' || issue.status === 'Closed' ? (
                  <><RotateCcw size={16} /> Reopen Ticket</>
                ) : (
                  <><CheckCircle2 size={16} /> Resolve Issue</>
                )}
              </Button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
