'use client';

import React, { useState } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/EmptyState';

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
}

export function DataTable<T>({ 
  data, 
  columns, 
  pageSize = 10, 
  onRowClick,
  isLoading = false,
  emptyTitle = "No data available",
  emptyDescription = "There are no records to display at this time.",
  searchPlaceholder = "Search records...",
  actions
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null);

  // Sorting logic
  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig !== null) {
      sortableItems.sort((a: any, b: any) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
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
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return (
    <div className="space-y-4">
      {/* Table Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm group">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-muted/50 border border-border/40 rounded-2xl py-2.5 pl-11 pr-4 text-[13px] font-bold outline-none focus:bg-background focus:border-primary/40 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="h-10 rounded-xl border-border/40 font-black text-[10px] uppercase tracking-widest gap-2">
            <Filter size={14} /> Filter
          </Button>
          <Button variant="outline" className="h-10 rounded-xl border-border/40 font-black text-[10px] uppercase tracking-widest gap-2">
            <Download size={14} /> Export
          </Button>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card border border-border/40 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-border/5 bg-muted/30">
                {columns.map((column, i) => (
                  <th 
                    key={i}
                    onClick={() => column.sortable && requestSort(column.accessorKey as string)}
                    className={cn(
                      "px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] whitespace-nowrap",
                      column.sortable && "cursor-pointer hover:text-foreground transition-colors",
                      column.className
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {column.header}
                      {column.sortable && (
                        <div className="flex flex-col opacity-30">
                          <ChevronUp size={10} className={cn(sortConfig?.key === column.accessorKey && sortConfig.direction === 'asc' && "text-primary opacity-100")} />
                          <ChevronDown size={10} className={cn(sortConfig?.key === column.accessorKey && sortConfig.direction === 'desc' && "text-primary opacity-100")} />
                        </div>
                      )}
                    </div>
                  </th>
                ))}
                {actions && <th className="px-6 py-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.15em] text-right">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/5">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {columns.map((_, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-muted rounded-md w-3/4" />
                      </td>
                    ))}
                    {actions && <td className="px-6 py-4"><div className="h-4 bg-muted rounded-md w-10 ml-auto" /></td>}
                  </tr>
                ))
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, i) => (
                  <tr 
                    key={i} 
                    onClick={() => onRowClick?.(item)}
                    className={cn(
                      "group transition-all hover:bg-secondary/20",
                      onRowClick && "cursor-pointer"
                    )}
                  >
                    {columns.map((column, j) => (
                      <td key={j} className={cn("px-6 py-4 text-[13px] font-bold text-foreground/80 group-hover:text-foreground transition-colors", column.className)}>
                        {column.cell ? column.cell(item) : (item as any)[column.accessorKey]}
                      </td>
                    ))}
                    {actions && (
                      <td className="px-6 py-4 text-right">
                        {actions(item)}
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + (actions ? 1 : 0)} className="py-20">
                    <EmptyState 
                      title={emptyTitle}
                      description={emptyDescription}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {filteredData.length > pageSize && (
          <div className="px-6 py-4 border-t border-border/5 flex items-center justify-between bg-muted/10">
            <p className="text-[11px] font-bold text-muted-foreground">
              Showing <span className="text-foreground">{(currentPage - 1) * pageSize + 1}</span> to <span className="text-foreground">{Math.min(currentPage * pageSize, filteredData.length)}</span> of <span className="text-foreground">{filteredData.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg border-border/40"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={14} />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 rounded-lg border-border/40"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
