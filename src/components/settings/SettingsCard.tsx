'use client';

import React from'react';
import { cn } from"@/lib/utils";
import { LucideIcon } from'lucide-react';

interface SettingsCardProps {
 title: string;
 description?: string;
 icon?: LucideIcon;
 children: React.ReactNode;
 className?: string;
 badge?: string;
 badgeVariant?:'default' |'success' |'warning' |'danger';
}

export default function SettingsCard({ 
 title, 
 description, 
 icon: Icon, 
 children, 
 className,
 badge,
 badgeVariant ='default'
}: SettingsCardProps) {
 const badgeStyles = {
 default:"bg-secondary text-muted-foreground border-border/50",
 success:"bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
 warning:"bg-amber-500/10 text-amber-500 border-amber-500/20",
 danger:"bg-destructive/10 text-destructive border-destructive/20",
 };

 return (
 <div className={cn(
"bg-card border border-border/40 rounded-[32px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 min-w-0 w-full",
 className
 )}>
 {/* Card Header */}
 <div className="p-8 pb-4 flex items-start justify-between">
 <div className="flex gap-5">
 {Icon && (
 <div className="p-3 bg-secondary rounded-[20px] text-primary group-hover:scale-110 transition-transform">
 <Icon size={22} />
 </div>
 )}
 <div className="space-y-1">
 <div className="flex items-center gap-3">
 <h3 className="text-[15px] font-black text-foreground uppercase tracking-wider">{title}</h3>
 {badge && (
 <span className={cn(
"px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
 badgeStyles[badgeVariant]
 )}>
 {badge}
 </span>
 )}
 </div>
 </div>
 </div>
 </div>

 {/* Card Content */}
 <div className="p-8 pt-4">
 {children}
 </div>
 </div>
 );
}
