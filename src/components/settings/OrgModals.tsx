'use client';

import React, { useState } from'react';
import { X, Building2, Globe, Plus, Trash2, ShieldCheck, MapPin } from'lucide-react';
import { motion, AnimatePresence } from'framer-motion';
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { toast } from'sonner';

interface ModalProps {
 isOpen: boolean;
 onClose: () => void;
 title: string;
 icon: any;
 children: React.ReactNode;
}

const Modal = ({ isOpen, onClose, title, icon: Icon, children }: ModalProps) => {
 if (!isOpen) return null;

 return (
 <AnimatePresence>
 <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="absolute inset-0 bg-background/80 backdrop-blur-md"
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: 20 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: 20 }}
 className="relative w-full max-w-lg bg-card border border-border/50 rounded-[32px] shadow-2xl overflow-hidden"
 >
 <div className="p-8 border-b border-border/10 flex items-center justify-between bg-secondary/5">
 <div className="flex items-center gap-4">
 <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
 <Icon size={24} />
 </div>
 <div>
 <h3 className="text-xl font-black text-foreground">{title}</h3>
 <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">OINZpay Platform Configuration</p>
 </div>
 </div>
 <button onClick={onClose} className="p-3 hover:bg-secondary rounded-2xl transition-all">
 <X size={20} />
 </button>
 </div>
 <div className="p-8 max-h-[70vh] overflow-y-auto no-scrollbar">
 {children}
 </div>
 </motion.div>
 </div>
 </AnimatePresence>
 );
};

export const DepartmentModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
 const [depts, setDepts] = useState([
 { id: 1, name:"Treasury & Finance", head:"David O.", staff: 12 },
 { id: 2, name:"Risk & Compliance", head:"Sarah K.", staff: 8 },
 { id: 3, name:"Engineering & SRE", head:"Mick J.", staff: 24 },
 ]);
 const [newName, setNewName] = useState("");

 const addDept = () => {
 if (!newName) return;
 setDepts([...depts, { id: Date.now(), name: newName, head:"Unassigned", staff: 0 }]);
 setNewName("");
 toast.success("Department Created", { description:`"${newName}" unit added to organizational structure.` });
 };

 const removeDept = (id: number, name: string) => {
 setDepts(depts.filter(d => d.id !== id));
 toast.error("Department Removed", { description:`${name} unit has been deactivated.` });
 };

 return (
 <Modal isOpen={isOpen} onClose={onClose} title="Manage Departments" icon={Building2}>
 <div className="space-y-6">
 <div className="flex gap-2">
 <input 
 value={newName}
 onChange={(e) => setNewName(e.target.value)}
 placeholder="New Department Name..."
 className="flex-1 bg-secondary/30 border border-border/20 rounded-xl px-4 py-3 text-[13px] font-bold outline-none focus:border-primary/40 transition-all"
 />
 <Button onClick={addDept} className="h-12 px-4 rounded-xl bg-primary text-white">
 <Plus size={20} />
 </Button>
 </div>

 <div className="space-y-3">
 {depts.map((dept) => (
 <div key={dept.id} className="p-4 bg-secondary/20 border border-border/10 rounded-2xl flex items-center justify-between group">
 <div>
 <p className="text-[13px] font-black text-foreground">{dept.name}</p>
 <p className="text-[10px] font-medium text-muted-foreground uppercase">{dept.staff} Members • {dept.head}</p>
 </div>
 <button onClick={() => removeDept(dept.id, dept.name)} className="p-2 text-muted-foreground hover:text-red-500 transition-colors">
 <Trash2 size={16} />
 </button>
 </div>
 ))}
 </div>
 </div>
 </Modal>
 );
};

export const JurisdictionModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
 const [markets, setMarkets] = useState([
 { country:"Nigeria", code:"NG", status:"Primary" },
 { country:"Kenya", code:"KE", status:"Active" },
 { country:"Ghana", code:"GH", status:"Active" },
 ]);

 return (
 <Modal isOpen={isOpen} onClose={onClose} title="Operational Jurisdictions" icon={Globe}>
 <div className="space-y-6">
 <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex items-center gap-4">
 <ShieldCheck size={24} className="text-primary shrink-0" />
 <p className="text-[11px] font-medium text-primary/80">
 Adding new jurisdictions requires regulatory approval from local authorities. Contact compliance for regional expansion.
 </p>
 </div>

 <div className="space-y-3">
 {markets.map((m, i) => (
 <div key={i} className="p-4 bg-secondary/20 border border-border/10 rounded-2xl flex items-center justify-between">
 <div className="flex items-center gap-3">
 <div className="size-8 rounded-lg bg-background border border-border/40 flex items-center justify-center font-black text-[10px] text-muted-foreground">
 {m.code}
 </div>
 <span className="text-[13px] font-black text-foreground">{m.country}</span>
 </div>
 <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-md">{m.status}</span>
 </div>
 ))}
 </div>

 <Button onClick={() => toast.info("Regional Expansion", { description:"Opening compliance wizard for new market entry..." })} className="w-full h-12 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20">
 Request New Jurisdiction
 </Button>
 </div>
 </Modal>
 );
};
