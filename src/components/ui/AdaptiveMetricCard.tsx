import { Card } from"@/components/ui/card";
import { cn } from"@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from"lucide-react";

interface AdaptiveMetricCardProps {
 label: string;
 value: string | number;
 icon: LucideIcon;
 trend?: string;
 trendUp?: boolean | null;
 description?: string;
 color?: string; // Kept for API compatibility but internally unified
 className?: string;
}

export function AdaptiveMetricCard({
 label,
 value,
 icon: Icon,
 trend,
 trendUp,
 description,
 color,
 className
}: AdaptiveMetricCardProps) {
 return (
 <Card className={cn("p-6 flex flex-col justify-between h-full min-h-[140px] shadow-sm border-border/40 hover:border-border/80 transition-all rounded-xl bg-card", className)}>
 <div className="flex justify-between items-start">
 <div className="size-10 rounded-lg flex items-center justify-center bg-secondary/50 border border-border/40 text-muted-foreground/80">
 <Icon size={20} strokeWidth={2} />
 </div>
 {trend && (
 <div className={cn(
"flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border",
 trendUp === true ?"bg-emerald-50 text-emerald-600 border-emerald-100" : 
 trendUp === false ?"bg-rose-50 text-rose-600 border-rose-100" : 
"bg-muted/50 text-muted-foreground border-border/50"
 )}>
 {trendUp === true && <ArrowUpRight size={12} />}
 {trendUp === false && <ArrowDownRight size={12} />}
 {trend}
 </div>
 )}
 </div>
 
 <div className="mt-4 space-y-1">
 <p className="text-[12px] font-medium text-muted-foreground tracking-tight">{label}</p>
 <div className="flex items-baseline gap-2">
 <h3 className="text-2xl font-semibold text-foreground tracking-tight">{value}</h3>
 </div>
 {description && (
 <p className="text-[12px] text-muted-foreground/60 leading-relaxed mt-1">{description}</p>
 )}
 </div>
 </Card>
 );
}
