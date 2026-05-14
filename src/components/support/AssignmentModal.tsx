'use client';

import React, { useState } from'react';
import { motion, AnimatePresence } from'framer-motion';
import { 
 X, 
 Search, 
 User, 
 Users, 
 Check, 
 ArrowRight,
 ShieldCheck,
 ShieldAlert,
 Cpu,
 Wallet
} from'lucide-react';
import { Button } from'@/components/ui/button';
import { cn } from'@/lib/utils';

interface AssignmentModalProps {
 issue: any;
 isOpen: boolean;
 onClose: () => void;
 onAssign: (adminName: string, teamName: string) => void;
}

const ADMINS = [
 { name:'Mick Johnson', team:'Compliance', role:'Senior Analyst', initials:'MJ' },
 { name:'Sarah Chen', team:'Fraud Unit', role:'Forensic Lead', initials:'SC' },
 { name:'David Okafor', team:'Tech Ops', role:'DevOps Engineer', initials:'DO' },
 { name:'Aisha Bello', team:'Finance', role:'Treasury Manager', initials:'AB' },
];

const TEAMS = [
 { name:'Compliance Squad', icon: ShieldCheck },
 { name:'Anti-Fraud Unit', icon: ShieldAlert },
 { name:'Technical Operations', icon: Cpu },
 { name:'Treasury & Settlement', icon: Wallet },
];

export default function AssignmentModal({ issue, isOpen, onClose, onAssign }: AssignmentModalProps) {
 const [searchTerm, setSearchTerm] = useState("");
 const [selectedAdmin, setSelectedAdmin] = useState<string | null>(null);

 if (!issue) return null;

 const filteredAdmins = ADMINS.filter(a => 
 a.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
 a.team.toLowerCase().includes(searchTerm.toLowerCase())
 );

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
 className="w-full max-w-lg bg-card border border-border/50 rounded-[40px] shadow-2xl overflow-hidden pointer-events-auto"
 >
 {/* Header */}
 <div className="p-8 border-b border-border/10 flex items-center justify-between bg-muted/30">
 <div className="flex items-center gap-4">
 <div className="size-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
 <User size={24} />
 </div>
 <div>
 <h3 className="text-xl font-black text-foreground tracking-tight uppercase">Assign Reviewer</h3>
 <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">Case: {issue.id}</p>
 </div>
 </div>
 <button onClick={onClose} className="p-2 bg-secondary/50 hover:bg-secondary border border-border/20 rounded-xl text-muted-foreground transition-all">
 <X size={18} />
 </button>
 </div>

 {/* Search */}
 <div className="p-8 pb-4">
 <div className="relative group">
 <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <input 
 type="text"
 placeholder="Search by name, team, or role..."
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-secondary/30 border border-border/10 rounded-2xl py-3 pl-12 pr-4 text-sm font-bold outline-none focus:bg-background focus:border-primary/40 transition-all"
 />
 </div>
 </div>

 {/* Admin List */}
 <div className="p-8 pt-0 space-y-2 max-h-[40vh] overflow-y-auto no-scrollbar">
 <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Available Administrators</h4>
 {filteredAdmins.map((admin) => (
 <button
 key={admin.name}
 onClick={() => setSelectedAdmin(admin.name)}
 className={cn(
"w-full flex items-center justify-between p-4 rounded-[24px] border transition-all text-left group",
 selectedAdmin === admin.name 
 ?"bg-primary/5 border-primary shadow-lg shadow-primary/5" 
 :"bg-secondary/20 border-border/10 hover:bg-secondary/40 hover:border-border/40"
 )}
 >
 <div className="flex items-center gap-4">
 <div className={cn(
"size-10 rounded-xl border flex items-center justify-center font-black text-xs transition-colors",
 selectedAdmin === admin.name ?"bg-primary text-white border-primary" :"bg-card border-border/40 text-muted-foreground"
 )}>
 {admin.initials}
 </div>
 <div>
 <p className="text-[13px] font-black text-foreground tracking-tight">{admin.name}</p>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{admin.role} • {admin.team}</p>
 </div>
 </div>
 {selectedAdmin === admin.name && (
 <div className="size-6 rounded-full bg-primary flex items-center justify-center text-white shadow-lg">
 <Check size={14} />
 </div>
 )}
 </button>
 ))}
 {filteredAdmins.length === 0 && (
 <div className="py-10 text-center">
 <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">No admins found</p>
 </div>
 )}
 </div>

 {/* Footer */}
 <div className="p-8 border-t border-border/10 bg-muted/30">
 <Button 
 disabled={!selectedAdmin}
 onClick={() => {
 const admin = ADMINS.find(a => a.name === selectedAdmin);
 if (admin) onAssign(admin.name, admin.team);
 }}
 className="w-full h-12 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black text-[11px] uppercase tracking-widest shadow-lg shadow-primary/20 flex items-center justify-center gap-2"
 >
 Confirm Assignment <ArrowRight size={16} />
 </Button>
 </div>
 </motion.div>
 </div>
 </>
 )}
 </AnimatePresence>
 );
}
