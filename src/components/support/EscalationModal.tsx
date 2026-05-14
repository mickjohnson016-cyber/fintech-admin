'use client';

import React, { useState } from'react';
import { motion, AnimatePresence } from'framer-motion';
import { 
 X, 
 ShieldAlert, 
 Users, 
 ShieldCheck, 
 Cpu, 
 Wallet, 
 UserCircle,
 Flag,
 ArrowRight,
 Clock,
 AlertTriangle
} from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from'@/lib/utils';
import { Ticket } from'@/hooks/useIssues';

interface EscalationModalProps {
 issue: Ticket | null;
 isOpen: boolean;
 onClose: () => void;
 onConfirm: (team: string, reason: string, priority: string) => void;
}

const TEAMS = [
 { id:'compliance', name:'Compliance Team', icon: ShieldCheck, desc:'KYC, AML & Fraud screening' },
 { id:'fraud', name:'Anti-Fraud Unit', icon: ShieldAlert, desc:'Immediate transaction investigation' },
 { id:'finance', name:'Finance / Treasury', icon: Wallet, desc:'Settlement & reconciliation issues' },
 { id:'tech', name:'Technical Operations', icon: Cpu, desc:'API errors & system bugs' },
 { id:'superadmin', name:'Super Administrator', icon: UserCircle, desc:'Critical overrides & legal' },
];

export default function EscalationModal({ issue, isOpen, onClose, onConfirm }: EscalationModalProps) {
 const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
 const [reason, setReason] = useState("");
 const [priority, setPriority] = useState('High');

 if (!issue) return null;

 const handleEscalate = () => {
 if (!selectedTeam) return;
 const teamName = TEAMS.find(t => t.id === selectedTeam)?.name || selectedTeam;
 onConfirm(teamName, reason, priority);
 onClose();
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
 className="fixed inset-0 bg-background/80 backdrop-blur-md z-[200]"
 />

 <div className="fixed inset-0 flex items-center justify-center z-[201] p-4 pointer-events-none">
 <motion.div
 initial={{ scale: 0.95, opacity: 0, y: 20 }}
 animate={{ scale: 1, opacity: 1, y: 0 }}
 exit={{ scale: 0.95, opacity: 0, y: 20 }}
 className="w-full max-w-xl bg-card border border-border/50 rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto"
 >
 {/* Header */}
 <div className="p-8 border-b border-border/10 flex items-center justify-between">
 <div className="flex items-center gap-4">
 <div className="size-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500">
 <ShieldAlert size={24} />
 </div>
 <div>
 <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Internal Escalation</h3>
 <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Case: {issue.id}</p>
 </div>
 </div>
 <button 
 onClick={onClose}
 className="p-2 bg-secondary/50 hover:bg-secondary border border-border/20 rounded-xl text-muted-foreground transition-all"
 >
 <X size={18} />
 </button>
 </div>

 {/* Form Content */}
 <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto no-scrollbar">
 {/* Team Selector */}
 <div className="space-y-4">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Select Destination Team</h4>
 <div className="grid grid-cols-1 gap-2">
 {TEAMS.map((team) => (
 <button
 key={team.id}
 onClick={() => setSelectedTeam(team.id)}
 className={cn(
"flex items-center gap-4 p-4 rounded-[24px] border transition-all text-left group",
 selectedTeam === team.id 
 ?"bg-primary/5 border-primary shadow-lg shadow-primary/5" 
 :"bg-secondary/20 border-border/10 hover:bg-secondary/40 hover:border-border/40"
 )}
 >
 <div className={cn(
"size-10 rounded-xl border flex items-center justify-center transition-colors",
 selectedTeam === team.id ?"bg-primary text-white border-primary" :"bg-card border-border/40 text-muted-foreground group-hover:text-primary"
 )}>
 <team.icon size={18} />
 </div>
 <div className="flex-1 min-w-0">
 <p className="text-[13px] font-black text-foreground tracking-tight">{team.name}</p>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{team.desc}</p>
 </div>
 {selectedTeam === team.id && <ArrowRight size={16} className="text-primary" />}
 </button>
 ))}
 </div>
 </div>

 {/* Escalation Context */}
 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div className="space-y-2">
 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Escalation Priority</label>
 <div className="flex p-1 bg-secondary/30 border border-border/10 rounded-xl">
 {['Normal','High','Urgent'].map((p) => (
 <button
 key={p}
 onClick={() => setPriority(p)}
 className={cn(
"flex-1 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all",
 priority === p ?"bg-card text-foreground shadow-sm" :"text-muted-foreground hover:text-foreground"
 )}
 >
 {p}
 </button>
 ))}
 </div>
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Expected SLA</label>
 <div className="relative group">
 <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
 <select className="w-full bg-secondary/30 border border-border/10 rounded-xl py-2.5 pl-10 pr-4 text-[11px] font-black uppercase tracking-widest outline-none focus:bg-background transition-all">
 <option>2 Hours (Urgent)</option>
 <option>6 Hours (High)</option>
 <option>24 Hours (Normal)</option>
 </select>
 </div>
 </div>
 </div>

 <div className="space-y-2">
 <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Escalation Reason</label>
 <textarea 
 value={reason}
 onChange={(e) => setReason(e.target.value)}
 placeholder="Provide justification for the team transfer..."
 className="w-full bg-secondary/30 border border-border/10 rounded-[24px] p-5 text-sm font-bold min-h-[100px] outline-none focus:bg-background transition-all no-scrollbar"
 />
 </div>
 </div>

 {/* Footer */}
 <div className="p-8 border-t border-border/10 bg-muted/30">
 <Button 
 disabled={!selectedTeam}
 onClick={handleEscalate}
 className="w-full h-12 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-rose-500/20 flex items-center justify-center gap-2"
 >
 Confirm Team Transfer <ArrowRight size={16} />
 </Button>
 </div>
 </motion.div>
 </div>
 </>
 )}
 </AnimatePresence>
 );
}
