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
    <Card className={cn("p-5 group relative overflow-hidden flex flex-col justify-between h-full min-h-[140px] min-w-0 shadow-sm", className)}>
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-xl group-hover:scale-110 transition-transform bg-background border border-border shrink-0", color)}>
          <Icon size={18} />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center gap-1 text-[9px] font-black px-1.5 py-0.5 rounded-lg border shrink-0",
            trendUp === true ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : 
            trendUp === false ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : 
            "bg-muted text-muted-foreground border-border"
          )}>
            {trendUp === true && <ArrowUpRight size={9} />}
            {trendUp === false && <ArrowDownRight size={9} />}
            {trend}
          </div>
        )}
      </div>
      
      <div className="space-y-1 min-w-0">
        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">{label}</p>
        <h3 className="text-xl font-black text-foreground tracking-tight truncate">{value}</h3>
        {description && (
          <p className="text-[10px] font-medium text-muted-foreground/60 leading-tight mt-1 line-clamp-1 break-words">{description}</p>
        )}
      </div>
      
      <div className={cn("absolute bottom-0 left-0 h-1 transition-all w-0 group-hover:w-full opacity-50", color.replace('text-', 'bg-'))} />
    </Card>
  );
}
