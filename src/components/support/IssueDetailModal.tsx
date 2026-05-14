'use client';

import React, { useState } from'react';
import { motion, AnimatePresence } from'framer-motion';
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
} from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from'@/lib/utils';
import { toast } from'sonner';
import { ActivityTimeline } from'@/components/ui/ActivityTimeline';
import { Ticket } from'@/hooks/useIssues';

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
 const [activeTab, setActiveTab] = useState<'overview' |'activity' |'files' |'reply'>('overview');
 const [internalNote, setInternalNote] = useState("");
 const [userReply, setUserReply] = useState("");
 const [isSavingDraft, setIsSavingDraft] = useState(false);

 if (!issue) return null;

 const handleAddNote = () => {
 if (!internalNote.trim()) return;
 onAddNote(issue.id, internalNote);
 setInternalNote("");
 };

 const handleSendReply = () => {
 if (!userReply.trim()) return;
 toast.success("Reply Sent", { description:"User has been notified via dashboard and email." });
 setUserReply("");
 setActiveTab('overview');
 };

 const handleSaveDraft = () => {
 setIsSavingDraft(true);
 setTimeout(() => {
 setIsSavingDraft(false);
 toast.info("Draft Saved");
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
 className="fixed inset-0 bg-background/40 backdrop-blur-sm z-[100]"
 />

 <motion.div
 initial={{ opacity: 0, x: 20 }}
 animate={{ opacity: 1, x: 0 }}
 exit={{ opacity: 0, x: 20 }}
 className="fixed inset-y-0 right-0 w-full max-w-xl bg-card border-l border-border shadow-2xl z-[101] flex flex-col overflow-hidden"
 >
 {/* Header */}
 <div className="p-6 border-b border-border flex flex-col gap-4 bg-muted/10">
 <div className="flex items-center justify-between">
 <div className="flex items-center gap-3">
 <span className="text-xl font-semibold text-primary font-mono tracking-tight">{issue.id}</span>
 <div className="flex items-center gap-2">
 {/* Priority */}
 <div className="relative group/priority">
 <button className={cn(
"px-2 py-0.5 rounded text-[11px] font-semibold tracking-tight border transition-colors",
 issue.priority ==='Critical' ?"bg-rose-50 text-rose-600 border-rose-200" : 
 issue.priority ==='High' ?"bg-orange-50 text-orange-600 border-orange-200" :
"bg-muted/50 text-muted-foreground border-border/50"
 )}>
 {issue.priority}
 </button>
 <div className="absolute top-full left-0 mt-1 w-32 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover/priority:opacity-100 group-hover/priority:visible transition-all z-50 py-1">
 {['Low','Medium','High','Critical'].map((p) => (
 <button 
 key={p} 
 onClick={() => onUpdatePriority(issue.id, p as any)}
 className="w-full px-3 py-1.5 text-left text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
 >
 {p}
 </button>
 ))}
 </div>
 </div>

 {/* Status */}
 <div className="relative group/status">
 <button className={cn(
"px-2 py-0.5 rounded text-[11px] font-semibold tracking-tight border transition-colors",
 issue.status ==='Open' ?"bg-blue-50 text-blue-600 border-blue-200" :
 issue.status ==='Investigating' ?"bg-amber-50 text-amber-600 border-amber-200" :
 issue.status ==='Escalated' ?"bg-rose-50 text-rose-600 border-rose-200" :
 issue.status ==='Resolved' ?"bg-emerald-50 text-emerald-600 border-emerald-200" :
"bg-muted/50 text-muted-foreground border-border/50"
 )}>
 {issue.status}
 </button>
 <div className="absolute top-full left-0 mt-1 w-36 bg-card border border-border rounded-lg shadow-lg opacity-0 invisible group-hover/status:opacity-100 group-hover/status:visible transition-all z-50 py-1">
 {['Open','Pending','Investigating','Escalated','Resolved','Closed'].map((s) => (
 <button 
 key={s} 
 onClick={() => onUpdateStatus(issue.id, s as any)}
 className="w-full px-3 py-1.5 text-left text-[12px] font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
 >
 {s}
 </button>
 ))}
 </div>
 </div>
 </div>
 </div>
 <div className="flex items-center gap-1.5">
 <Button variant="ghost" size="icon" className="size-8 rounded-md" onClick={() => toast.success("Link Copied")}>
 <Share2 size={14} className="text-muted-foreground" />
 </Button>
 <Button variant="ghost" size="icon" className="size-8 rounded-md" onClick={onClose}>
 <X size={16} className="text-muted-foreground" />
 </Button>
 </div>
 </div>
 <h2 className="text-lg font-semibold text-foreground tracking-tight">{issue.type}</h2>
 </div>

 {/* Navigation Tabs */}
 <div className="px-6 border-b border-border bg-card">
 <div className="flex items-center gap-6">
 {['overview','activity','files','reply'].map((tab) => (
 <button
 key={tab}
 onClick={() => setActiveTab(tab as any)}
 className={cn(
"py-3 text-[13px] font-medium transition-all relative",
 activeTab === tab ?"text-primary" :"text-muted-foreground hover:text-foreground"
 )}
 >
 {tab.charAt(0).toUpperCase() + tab.slice(1)}
 {activeTab === tab && (
 <motion.div layoutId="activeTabDetails" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
 )}
 </button>
 ))}
 </div>
 </div>

 {/* Content Area */}
 <div className="flex-1 overflow-y-auto p-6 space-y-8">
 {activeTab ==='overview' && (
 <>
 {/* Info Grid */}
 <div className="grid grid-cols-2 gap-4">
 <div className="p-4 rounded-xl border border-border/50 bg-muted/5 space-y-2">
 <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">Reporter</p>
 <div className="flex items-center gap-2.5">
 <div className="size-8 rounded-md bg-secondary border border-border flex items-center justify-center text-[12px] font-bold text-muted-foreground">
 {issue.user[0]}
 </div>
 <span className="text-[14px] font-medium truncate">{issue.user}</span>
 </div>
 </div>
 <div className="p-4 rounded-xl border border-border/50 bg-muted/5 space-y-2">
 <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-tight">Assignee</p>
 <div className="flex items-center gap-2.5">
 <div className="size-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
 <User size={14} />
 </div>
 <span className="text-[14px] font-medium truncate">{issue.assignedTo ||'Unassigned'}</span>
 </div>
 </div>
 </div>

 {/* Description */}
 <div className="space-y-3">
 <h4 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight">Description</h4>
 <div className="p-4 rounded-xl border border-border/50 bg-muted/5">
 <p className="text-[14px] font-medium text-foreground/80 leading-relaxed">
 {issue.description}
 </p>
 <div className="flex flex-wrap gap-2 mt-4">
 <span className="px-2 py-0.5 rounded-md bg-background border border-border/60 text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
 <AlertTriangle size={12} className="text-amber-500" /> Platform Operational
 </span>
 <span className="px-2 py-0.5 rounded-md bg-background border border-border/60 text-[11px] font-medium text-muted-foreground flex items-center gap-1.5">
 <CheckCircle2 size={12} className="text-emerald-500" /> Ledger Matched
 </span>
 </div>
 </div>
 </div>

 {/* Internal Notes */}
 <div className="space-y-3">
 <h4 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight">Internal Observations</h4>
 <div className="relative">
 <textarea 
 value={internalNote}
 onChange={(e) => setInternalNote(e.target.value)}
 placeholder="Add note for administrative staff..."
 className="w-full bg-background border border-border rounded-xl p-4 text-[14px] font-medium min-h-[100px] outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all resize-none"
 />
 <Button 
 onClick={handleAddNote}
 size="sm"
 className="absolute bottom-3 right-3 h-8 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold"
 >
 Add Note
 </Button>
 </div>
 </div>
 </>
 )}

 {activeTab ==='activity' && (
 <div className="space-y-4">
 <h4 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight">Activity Timeline</h4>
 <ActivityTimeline events={issue.timeline} />
 </div>
 )}

 {activeTab ==='files' && (
 <div className="space-y-4">
 <h4 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight">Attachments</h4>
 <div className="py-16 text-center border-2 border-dashed border-border/50 rounded-xl space-y-4 bg-muted/5">
 <div className="size-12 bg-muted/50 rounded-full flex items-center justify-center mx-auto">
 <Paperclip size={20} className="text-muted-foreground" />
 </div>
 <div className="space-y-1">
 <p className="text-[13px] font-medium text-foreground">Attach evidence or logs</p>
 <p className="text-[12px] text-muted-foreground">Drag and drop or browse files</p>
 </div>
 <Button variant="outline" size="sm" className="h-8 px-4 rounded-lg text-[12px] font-semibold">Select Files</Button>
 </div>
 </div>
 )}

 {activeTab ==='reply' && (
 <div className="space-y-4">
 <div className="flex items-center justify-between">
 <h4 className="text-[12px] font-semibold text-muted-foreground uppercase tracking-tight">Communication</h4>
 <span className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1.5">
 <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse" /> Messenger Sync Active
 </span>
 </div>
 <div className="space-y-4">
 <div className="relative">
 <textarea 
 value={userReply}
 onChange={(e) => setUserReply(e.target.value)}
 placeholder="Type a response to the customer..."
 className="w-full bg-background border border-border rounded-xl p-4 text-[14px] font-medium min-h-[180px] outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all resize-none"
 />
 <div className="absolute bottom-3 right-3 flex items-center gap-2">
 <Button 
 onClick={handleSaveDraft}
 variant="ghost"
 size="sm"
 className="h-8 rounded-lg text-[12px] font-semibold gap-1.5 hover:bg-muted"
 >
 {isSavingDraft ? <RotateCcw size={12} className="animate-spin" /> : <Save size={12} />} Draft
 </Button>
 <Button 
 onClick={handleSendReply}
 size="sm"
 className="h-9 px-4 rounded-lg bg-primary text-primary-foreground text-[12px] font-semibold shadow-sm flex items-center gap-2"
 >
 <Send size={14} /> Send Reply
 </Button>
 </div>
 </div>
 <div className="p-3 bg-primary/5 border border-primary/10 rounded-lg flex items-start gap-3">
 <Info size={14} className="text-primary mt-0.5" />
 <p className="text-[12px] text-primary/80 font-medium">
 The user will receive an instant push notification and email update.
 </p>
 </div>
 </div>
 </div>
 )}
 </div>

 {/* Footer Actions */}
 <div className="p-6 border-t border-border bg-card flex items-center gap-3">
 <Button 
 variant="outline"
 className="flex-1 h-10 rounded-lg text-[13px] font-semibold border-border/60 hover:bg-muted transition-colors gap-2"
 onClick={() => onEscalate(issue)}
 >
 <ShieldAlert size={14} /> Escalate
 </Button>
 <Button 
 className={cn(
"flex-1 h-10 rounded-lg text-[13px] font-semibold text-white transition-opacity hover:opacity-90 gap-2",
 issue.status ==='Resolved' || issue.status ==='Closed' 
 ?"bg-amber-600" 
 :"bg-emerald-600"
 )}
 onClick={() => {
 if (issue.status ==='Resolved' || issue.status ==='Closed') {
 onUpdateStatus(issue.id,'Open');
 toast.success("Ticket Reopened");
 } else {
 onResolve(issue.id);
 }
 }}
 >
 {issue.status ==='Resolved' || issue.status ==='Closed' ? (
 <><RotateCcw size={14} /> Reopen</>
 ) : (
 <><CheckCircle2 size={14} /> Resolve Case</>
 )}
 </Button>
 </div>
 </motion.div>
 </>
 )}
 </AnimatePresence>
 );
}
