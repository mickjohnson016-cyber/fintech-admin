"use client";

import React, { useEffect, useState } from"react";
import { useRouter } from"next/navigation";
import { Command } from"cmdk";
import { 
 LayoutGrid, Users, ArrowLeftRight, Settings, 
 BarChart3, Smartphone, PiggyBank, Search, Moon, Sun, Monitor
} from"lucide-react";
import { toast } from"sonner";
import { cn } from"@/lib/utils";
import { motion, AnimatePresence } from"framer-motion";

export function CommandPalette() {
 const [open, setOpen] = useState(false);
 const router = useRouter();

 useEffect(() => {
 const down = (e: KeyboardEvent) => {
 if (e.key ==="k" && (e.metaKey || e.ctrlKey)) {
 e.preventDefault();
 setOpen((open) => !open);
 }
 };
 document.addEventListener("keydown", down);
 return () => document.removeEventListener("keydown", down);
 }, []);

 const runCommand = (command: () => void) => {
 setOpen(false);
 command();
 };

 return (
 <AnimatePresence>
 {open && (
 <Command.Dialog 
 open={open} 
 onOpenChange={setOpen}
 label="Global Command Menu"
 className="fixed inset-0 z-[200] flex items-center justify-center p-4 pt-[10vh] sm:p-6"
 >
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 transition={{ duration: 0.15 }}
 className="fixed inset-0 bg-background/80 backdrop-blur-sm"
 onClick={() => setOpen(false)}
 />
 <motion.div
 initial={{ opacity: 0, scale: 0.95, y: -10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.95, y: -10 }}
 transition={{ duration: 0.2, ease:"easeOut" }}
 className="relative z-[201] w-full max-w-xl rounded-2xl bg-card border border-border shadow-2xl overflow-hidden"
 >
 <div className="flex items-center border-b border-border px-4">
 <Search size={18} className="mr-2 text-muted-foreground" />
 <Command.Input 
 autoFocus
 placeholder="Type a command or search..." 
 className="flex-1 h-14 bg-transparent outline-none border-none text-foreground text-sm font-medium placeholder:text-muted-foreground"
 />
 <div className="flex items-center gap-1 bg-muted border border-border px-2 py-1 rounded-lg text-[10px] font-black text-muted-foreground">
 ESC
 </div>
 </div>

 <Command.List className="max-h-[350px] overflow-y-auto p-2 scroll-smooth">
 <Command.Empty className="py-6 text-center text-sm font-medium text-muted-foreground">
 No results found.
 </Command.Empty>

 <Command.Group heading={<span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 pb-2 block">Navigation</span>}>
 <Command.Item onSelect={() => runCommand(() => router.push("/dashboard"))} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer transition-colors">
 <LayoutGrid size={16} /> Dashboard
 </Command.Item>
 <Command.Item onSelect={() => runCommand(() => router.push("/transactions"))} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer transition-colors">
 <ArrowLeftRight size={16} /> Transactions
 </Command.Item>
 <Command.Item onSelect={() => runCommand(() => router.push("/users"))} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer transition-colors">
 <Users size={16} /> Users
 </Command.Item>
 <Command.Item onSelect={() => runCommand(() => router.push("/reports"))} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer transition-colors">
 <BarChart3 size={16} /> Analytics
 </Command.Item>
 </Command.Group>

 <Command.Group heading={<span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 py-2 mt-2 block">Modules</span>}>
 <Command.Item onSelect={() => runCommand(() => router.push("/airtime"))} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer transition-colors">
 <Smartphone size={16} /> Airtime & Data
 </Command.Item>
 <Command.Item onSelect={() => runCommand(() => router.push("/savings"))} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer transition-colors">
 <PiggyBank size={16} /> Savings
 </Command.Item>
 </Command.Group>

 <Command.Group heading={<span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest px-2 py-2 mt-2 block">Actions</span>}>
 <Command.Item onSelect={() => runCommand(() => router.push("/settings"))} className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-bold text-muted-foreground aria-selected:bg-primary/10 aria-selected:text-primary cursor-pointer transition-colors">
 <Settings size={16} /> Settings
 </Command.Item>
 </Command.Group>

 </Command.List>
 </motion.div>
 </Command.Dialog>
 )}
 </AnimatePresence>
 );
}
