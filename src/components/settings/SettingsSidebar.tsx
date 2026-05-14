'use client';

import React, { useState } from'react';
import Link from'next/link';
import { usePathname } from'next/navigation';
import {
 LayoutGrid,
 Building2,
 Users2,
 ShieldCheck,
 CreditCard,
 Wallet,
 Plug2,
 Bell,
 Scale,
 Code2,
 Activity,
 Palette,
 AlertTriangle,
 Search,
 ChevronRight,
 Shield,
 Zap,
 Globe,
 Settings2,
 Lock,
 Cpu,
 Eye
} from'lucide-react';
import { cn } from"@/lib/utils";

const menuGroups = [
 {
 title:"General",
 items: [
 { id:"overview", label:"Overview", icon: LayoutGrid, href:"/settings" },
 { id:"users", label:"User Accounts", icon: Users2, href:"/settings/users" },
 { id:"organization", label:"Organization", icon: Building2, href:"/settings/organization" },
 { id:"admins", label:"Admin & Roles", icon: Users2, href:"/settings/admins" },
 ]
 },
 {
 title:"Security & Governance",
 items: [
 { id:"security", label:"Security Center", icon: ShieldCheck, href:"/settings/security" },
 ]
 },
 {
 title:"Financial Controls",
 items: [
 { id:"transactions", label:"Transaction Controls", icon: CreditCard, href:"/settings/transactions" },
 { id:"savings", label:"Savings & Investments", icon: Wallet, href:"/settings/savings" },
 { id:"providers", label:"Provider Controls", icon: Zap, href:"/settings/providers" },
 ]
 },
 {
 title:"System Operations",
 items: [
 { id:"notifications", label:"Notifications", icon: Bell, href:"/settings/notifications" },
 { id:"infrastructure", label:"Infrastructure", icon: Activity, href:"/settings/infrastructure" },
 ]
 },
 {
 title:"Preferences",
 items: [
 { id:"appearance", label:"Appearance", icon: Palette, href:"/settings/appearance" },
 { id:"danger", label:"Danger Zone", icon: AlertTriangle, href:"/settings/danger", variant:"danger" },
 ]
 }
];

export default function SettingsSidebar() {
 const pathname = usePathname();
 const [searchQuery, setSearchQuery] = useState("");

 const filteredGroups = menuGroups.map(group => ({
 ...group,
 items: group.items.filter(item =>
 item.label.toLowerCase().includes(searchQuery.toLowerCase())
 )
 })).filter(group => group.items.length > 0);

 return (
 <div className="w-full lg:w-72 flex flex-col gap-8 lg:sticky lg:top-8 lg:h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-4 scrollbar-hide">
 {/* Search Settings */}
 <div className="relative group px-1">
 <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
 <input
 type="text"
 placeholder="Search settings..."
 value={searchQuery}
 onChange={(e) => setSearchQuery(e.target.value)}
 className="w-full bg-card/50 backdrop-blur-md border border-border/40 rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-medium outline-none focus:bg-card focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-muted-foreground/50"
 />
 </div>

 {/* Navigation Groups */}
 <div className="space-y-10 pb-8">
 {filteredGroups.map((group) => (
 <div key={group.title} className="space-y-4">
 <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center justify-between">
 {group.title}
 <div className="h-[1px] flex-1 bg-border/20 ml-4" />
 </h3>
 <div className="space-y-1.5">
 {group.items.map((item) => {
 const isActive = pathname === item.href;
 const isDanger = item.variant ==="danger";

 return (
 <Link
 key={item.id}
 href={item.href}
 className={cn(
"flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden",
 isActive
 ?"bg-primary/10 text-primary shadow-sm shadow-primary/5"
 : isDanger
 ?"text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
 :"text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
 )}
 >
 <div className="flex items-center gap-3.5 z-10">
 <div className={cn(
"p-2 rounded-xl transition-all duration-300",
 isActive ?"bg-primary/20 scale-110 shadow-inner" :"bg-transparent group-hover:bg-secondary/80"
 )}>
 <item.icon size={18} className={cn(
"transition-transform",
 isActive ?"text-primary" :"text-muted-foreground/60 group-hover:text-foreground"
 )} />
 </div>
 <span className="tracking-tight">{item.label}</span>
 </div>

 {isActive && (
 <div className="size-1.5 bg-primary rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
 )}

 {!isActive && (
 <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground/40" />
 )}

 {isActive && (
 <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(59,130,246,0.5)]" />
 )}
 </Link>
 );
 })}
 </div>
 </div>
 ))}
 </div>

 {/* Security Health Widget */}
 <div className="mt-auto p-6 bg-gradient-to-br from-card to-secondary/30 border border-border/40 rounded-[32px] relative overflow-hidden group shadow-xl shadow-black/5">
 <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity -rotate-12 group-hover:rotate-0 duration-500">
 <Shield size={120} className="text-primary" />
 </div>
 <div className="space-y-5 relative z-10">
 <div className="flex justify-between items-start">
 <div>
 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Security Score</p>
 <div className="flex items-end gap-2">
 <span className="text-3xl font-black text-foreground tracking-tighter">98.4</span>
 <span className="text-[11px] font-black text-emerald-500 mb-1 bg-emerald-500/10 px-2 py-0.5 rounded-lg tracking-tighter">ELITE</span>
 </div>
 </div>
 <div className="p-2 bg-primary/10 rounded-xl text-primary">
 <Zap size={16} />
 </div>
 </div>
 <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden border border-border/10">
 <div className="bg-gradient-to-r from-primary to-blue-400 h-full w-[98.4%] rounded-full shadow-[0_0_12px_rgba(59,130,246,0.4)]" />
 </div>
 <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">
 All protocols active. System resilience at maximum.
 </p>
 </div>
 </div>
 </div>
 );
}
