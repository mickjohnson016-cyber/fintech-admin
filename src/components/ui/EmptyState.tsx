import { cn } from"@/lib/utils";
import { LucideIcon } from"lucide-react";

interface EmptyStateProps {
 icon?: LucideIcon;
 title: string;
 description?: string;
 className?: string;
 compact?: boolean;
 children?: React.ReactNode;
}

export function EmptyState({ icon: Icon, title, description, className, compact, children }: EmptyStateProps) {
 return (
 <div className={cn(
"w-full flex flex-col items-center justify-center text-center p-8 transition-all animate-in fade-in zoom-in duration-500 min-w-0",
 compact ?"min-h-[200px]" :"min-h-[300px]",
 className
 )}>
 {Icon && (
 <div className="w-16 h-16 bg-muted/50 rounded-[24px] flex items-center justify-center mb-4 shadow-inner ring-1 ring-border/10 shrink-0">
 <Icon size={32} className="text-primary/20" />
 </div>
 )}
 <div className="space-y-4 max-w-sm mx-auto w-full min-w-0 flex flex-col items-center">
 <div className="space-y-2">
 <h3 className="text-[13px] font-black uppercase tracking-[0.2em] text-foreground leading-tight break-words px-4 min-w-[200px] w-full">
 {title}
 </h3>
 {description && (
 <p className="text-[10px] font-medium text-muted-foreground leading-relaxed break-words px-4 min-w-[240px] w-full">
 {description}
 </p>
 )}
 </div>
 {children}
 </div>
 </div>
 );
}
