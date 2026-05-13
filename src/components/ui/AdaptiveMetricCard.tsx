import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight } from "lucide-react";

interface AdaptiveMetricCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean | null;
  description?: string;
  color?: string;
  className?: string;
}

export function AdaptiveMetricCard({
  label,
  value,
  icon: Icon,
  trend,
  trendUp,
  description,
  color = "text-primary",
  className
}: AdaptiveMetricCardProps) {
  return (
    <Card className={cn("p-6 flex flex-col justify-between h-full min-h-[140px] shadow-sm border-border/50 hover:border-border transition-colors rounded-xl", className)}>
      <div className="flex justify-between items-start">
        <div className={cn("size-9 rounded-lg flex items-center justify-center bg-secondary/50 border border-border/40", color)}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border",
            trendUp === true ? "bg-emerald-50/50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" : 
            trendUp === false ? "bg-rose-50/50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/20" : 
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
          <p className="text-[12px] text-muted-foreground/70 leading-relaxed mt-1">{description}</p>
        )}
      </div>
    </Card>
  );
}
