'use client';

import React, { useState } from'react';
import { 
 ChevronDown, 
 ChevronUp, 
 Search, 
 Filter, 
 Download, 
 ChevronLeft,
 ChevronRight
} from'lucide-react';
import { cn } from'@/lib/utils';
import { Button } from'@/components/ui/button';
import { EmptyState } from'@/components/ui/EmptyState';

interface Column<T> {
 header: string;
 accessorKey: keyof T | string;
 cell?: (item: T) => React.ReactNode;
 sortable?: boolean;
 className?: string;
}

interface DataTableProps<T> {
 data: T[];
 columns: Column<T>[];
 pageSize?: number;
 onRowClick?: (item: T) => void;
 isLoading?: boolean;
 emptyTitle?: string;
 emptyDescription?: string;
 searchPlaceholder?: string;
 actions?: (item: T) => React.ReactNode;
 emptyAction?: React.ReactNode;
 onExport?: () => void;
}

export function DataTable<T>({ 
 data, 
 columns, 
 pageSize = 10, 
 onRowClick,
 isLoading = false,
 emptyTitle ="No data available",
 emptyDescription ="There are no records to display at this time.",
 searchPlaceholder ="Search records...",
 actions,
 emptyAction,
 onExport
}: DataTableProps<T>) {
 const [searchTerm, setSearchTerm] = useState("");
 const [currentPage, setCurrentPage] = useState(1);
 const [sortConfig, setSortConfig] = useState<{ key: string, direction:'asc' |'desc' } | null>(null);

 // Sorting logic
 const sortedData = React.useMemo(() => {
 let sortableItems = [...data];
 if (sortConfig !== null) {
 sortableItems.sort((a: any, b: any) => {
 if (a[sortConfig.key] < b[sortConfig.key]) {
 return sortConfig.direction ==='asc' ? -1 : 1;
 }
 if (a[sortConfig.key] > b[sortConfig.key]) {
 return sortConfig.direction ==='asc' ? 1 : -1;
 }
 return 0;
 });
 }
 return sortableItems;
 }, [data, sortConfig]);

 // Filtering logic
 const filteredData = React.useMemo(() => {
 return sortedData.filter((item: any) => 
 Object.values(item).some(
 (val) => val && val.toString().toLowerCase().includes(searchTerm.toLowerCase())
 )
 );
 }, [sortedData, searchTerm]);

 // Pagination logic
 const totalPages = Math.ceil(filteredData.length / pageSize);
 const paginatedData = filteredData.slice(
 (currentPage - 1) * pageSize,
 currentPage * pageSize
 );

 const requestSort = (key: string) => {
 let direction:'asc' |'desc' ='asc';
 if (sortConfig && sortConfig.key === key && sortConfig.direction ==='asc') {
 direction ='desc';
 }
 setSortConfig({ key, direction });
 };

 return (
 <div className="space-y-4">
 {/* Table Controls */}
 <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
 <div className="relative flex-1 max-w-sm group">
 <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" />
 <input 
 type="text"
 placeholder={searchPlaceholder}
 value={searchTerm}
 onChange={(e) => setSearchTerm(e.target.value)}
 className="w-full bg-background border border-border/60 rounded-lg py-2 pl-10 pr-4 text-sm font-medium outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/50 transition-all"
 />
 </div>
 <div className="flex items-center gap-2">
 <Button variant="outline" className="h-9 px-3 rounded-lg border-border/60 text-xs font-semibold gap-2">
 <Filter size={14} /> Filter
 </Button>
 <Button 
 variant="outline" 
 className="h-9 px-3 rounded-lg border-border/60 text-xs font-semibold gap-2"
 onClick={onExport}
 >
 <Download size={14} /> Export
 </Button>
 </div>
 </div>

 {/* Table Container */}
 <div className="bg-card border border-border/50 rounded-xl overflow-hidden shadow-sm">
 <div className="overflow-x-auto">
 <table className="w-full text-left border-collapse min-w-[800px]">
 <thead>
 <tr className="border-b border-border/40 bg-muted/30">
 {columns.map((column, i) => (
 <th 
 key={i}
 onClick={() => column.sortable && requestSort(column.accessorKey as string)}
 className={cn(
"px-4 py-3.5 text-[12px] font-semibold text-muted-foreground tracking-tight whitespace-nowrap",
 column.sortable &&"cursor-pointer hover:text-foreground transition-colors",
 column.className
 )}
 >
 <div className="flex items-center gap-2">
 {column.header}
 {column.sortable && (
 <div className="flex flex-col opacity-30">
 <ChevronUp size={10} className={cn(sortConfig?.key === column.accessorKey && sortConfig.direction ==='asc' &&"text-primary opacity-100")} />
 <ChevronDown size={10} className={cn(sortConfig?.key === column.accessorKey && sortConfig.direction ==='desc' &&"text-primary opacity-100")} />
 </div>
 )}
 </div>
 </th>
 ))}
 {actions && <th className="px-4 py-3.5 text-[12px] font-semibold text-muted-foreground text-right">Actions</th>}
 </tr>
 </thead>
 <tbody className="divide-y divide-border/30">
 {isLoading ? (
 Array.from({ length: 5 }).map((_, i) => (
 <tr key={i} className="animate-pulse">
 {columns.map((_, j) => (
 <td key={j} className="px-4 py-4">
 <div className="h-4 bg-muted rounded w-3/4" />
 </td>
 ))}
 {actions && <td className="px-4 py-4"><div className="h-4 bg-muted rounded w-8 ml-auto" /></td>}
 </tr>
 ))
 ) : paginatedData.length > 0 ? (
 paginatedData.map((item, i) => (
 <tr 
 key={i} 
 onClick={() => onRowClick?.(item)}
 className={cn(
"group transition-colors hover:bg-muted/30",
 onRowClick &&"cursor-pointer"
 )}
 >
 {columns.map((column, j) => (
 <td key={j} className={cn("px-4 py-3.5 text-sm font-medium text-foreground/80 transition-colors", column.className)}>
 {column.cell ? column.cell(item) : (item as any)[column.accessorKey]}
 </td>
 ))}
 {actions && (
 <td className="px-4 py-3.5 text-right" onClick={(e) => e.stopPropagation()}>
 {actions(item)}
 </td>
 )}
 </tr>
 ))
 ) : (
 <tr>
 <td colSpan={columns.length + (actions ? 1 : 0)} className="py-20 text-center">
 <EmptyState 
 title={emptyTitle}
 description={emptyDescription}
 >
 {emptyAction}
 </EmptyState>
 </td>
 </tr>
 )}
 </tbody>
 </table>
 </div>

 {/* Pagination */}
 {filteredData.length > pageSize && (
 <div className="px-4 py-3 border-t border-border/40 flex items-center justify-between bg-muted/10">
 <p className="text-[12px] font-medium text-muted-foreground">
 Showing <span className="text-foreground">{((currentPage - 1) * pageSize) + 1}</span> to <span className="text-foreground">{Math.min(currentPage * pageSize, filteredData.length)}</span> of <span className="text-foreground">{filteredData.length}</span>
 </p>
 <div className="flex items-center gap-1">
 <Button 
 variant="ghost" 
 size="sm" 
 className="h-8 w-8 p-0"
 onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
 disabled={currentPage === 1}
 >
 <ChevronLeft size={16} />
 </Button>
 <Button 
 variant="ghost" 
 size="sm" 
 className="h-8 w-8 p-0"
 onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
 disabled={currentPage === totalPages}
 >
 <ChevronRight size={16} />
 </Button>
 </div>
 </div>
 )}
 </div>
 </div>
 );
}
