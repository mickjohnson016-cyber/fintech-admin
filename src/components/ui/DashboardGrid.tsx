import { cn } from"@/lib/utils";

interface DashboardGridProps {
 children: React.ReactNode;
 cols?: 1 | 2 | 3 | 4 | 5 | 6 | 12;
 className?: string;
}

export function DashboardGrid({ children, cols = 4, className }: DashboardGridProps) {
 const colMap = {
 1:"grid-cols-1",
 2:"grid-cols-1 md:grid-cols-2",
 3:"grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
 4:"grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
 5:"grid-cols-1 md:grid-cols-3 lg:grid-cols-5",
 6:"grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6",
 12:"grid-cols-1 lg:grid-cols-12",
 };

 return (
 <div className={cn("grid gap-4 w-full", colMap[cols], className)}>
 {children}
 </div>
 );
}
