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
  { id: 'CSV', label: 'CSV Format', description: 'Tabular analytics data for operational review', icon: Table },
  { id: 'PDF', label: 'PDF Report', description: 'Executive-ready financial analytics report', icon: FileText },
  { id: 'JSON', label: 'JSON Data', description: 'Structured data payload for system integration', icon: Code },
  { id: 'XLSX', label: 'Excel Sheet', description: 'Standardized spreadsheet for financial modeling', icon: FileSpreadsheet },
];

interface ExportSelectorProps {
 selectedFormat: ExportFormat;
 onSelect: (format: ExportFormat) => void;
 disabled?: boolean;
}

export function ExportSelector({ selectedFormat, onSelect, disabled }: ExportSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 outline-none" role="radiogroup" aria-label="Export Formats">
      {formats.map((format) => {
        const isActive = selectedFormat === format.id;
        const Icon = format.icon;

        return (
          <button
            key={format.id}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => !disabled && onSelect(format.id)}
            disabled={disabled}
            className={cn(
              "relative flex flex-col items-start p-5 rounded-xl border transition-all duration-300 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
              isActive 
                ? "bg-slate-50 border-primary shadow-sm" 
                : "bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 hover:shadow-sm",
              disabled && "opacity-50 cursor-not-allowed hover:border-slate-200 hover:bg-white hover:shadow-none"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors duration-300",
              isActive 
                ? "bg-primary text-white shadow-sm" 
                : "bg-slate-100 border border-slate-200 text-slate-500 group-hover:text-primary group-hover:bg-slate-50 group-hover:border-slate-300"
            )}>
              <Icon size={18} strokeWidth={2} />
            </div>
            
            <div className="space-y-1.5 w-full pr-6">
              <p className={cn(
                "text-sm font-semibold tracking-tight transition-colors duration-300",
                isActive ? "text-slate-900" : "text-slate-700 group-hover:text-slate-900"
              )}>
                {format.label}
              </p>
              <p className="text-xs font-medium text-slate-500 leading-relaxed">
                {format.description}
              </p>
            </div>

            {isActive && (
              <div className="absolute top-5 right-5 text-primary animate-in zoom-in duration-200">
                <Check size={18} strokeWidth={3} />
              </div>
            )}
          </button>
        );
 })}
 </div>
 );
}
