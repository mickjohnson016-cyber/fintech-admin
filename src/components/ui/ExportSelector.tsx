'use client';

import React from'react';
import { cn } from'@/lib/utils';
import { FileText, Table, Code, FileSpreadsheet, Check } from'lucide-react';

export type ExportFormat ='CSV' |'PDF' |'JSON' |'XLSX';

interface FormatOption {
 id: ExportFormat;
 label: string;
 description: string;
 icon: any;
}

const formats: FormatOption[] = [
 { id:'CSV', label:'CSV Format', description:'Raw comma-separated values', icon: Table },
 { id:'PDF', label:'PDF Report', description:'Print-ready visual document', icon: FileText },
 { id:'JSON', label:'JSON Data', description:'Structured developer format', icon: Code },
 { id:'XLSX', label:'Excel Sheet', description:'Spreadsheet compatibility', icon: FileSpreadsheet },
];

interface ExportSelectorProps {
 selectedFormat: ExportFormat;
 onSelect: (format: ExportFormat) => void;
 disabled?: boolean;
}

export function ExportSelector({ selectedFormat, onSelect, disabled }: ExportSelectorProps) {
 return (
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
 {formats.map((format) => {
 const isActive = selectedFormat === format.id;
 const Icon = format.icon;

 return (
 <button
 key={format.id}
 onClick={() => !disabled && onSelect(format.id)}
 disabled={disabled}
 className={cn(
"relative flex flex-col items-start p-4 rounded-xl border transition-all duration-200 text-left group",
 isActive 
 ?"bg-primary/5 border-primary" 
 :"bg-card border-border/60 hover:border-primary/40 hover:bg-muted/50",
 disabled &&"opacity-50 cursor-not-allowed"
 )}
 >
 <div className={cn(
"w-10 h-10 rounded-lg flex items-center justify-center mb-3 transition-colors",
 isActive ?"bg-primary text-white" :"bg-muted border border-border/40 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5"
 )}>
 <Icon size={18} strokeWidth={2} />
 </div>
 
 <div className="space-y-1">
 <p className={cn(
"text-[12px] font-bold uppercase tracking-tight",
 isActive ?"text-primary" :"text-foreground"
 )}>
 {format.label}
 </p>
 <p className="text-[10px] font-medium text-muted-foreground uppercase opacity-70">
 {format.description}
 </p>
 </div>

 {isActive && (
 <div className="absolute top-4 right-4 text-primary">
 <Check size={16} strokeWidth={3} />
 </div>
 )}
 </button>
 );
 })}
 </div>
 );
}
