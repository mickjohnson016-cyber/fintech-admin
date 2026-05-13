'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { FileText, Table, Code, FileSpreadsheet, Check } from 'lucide-react';
import { motion } from 'framer-motion';

export type ExportFormat = 'CSV' | 'PDF' | 'JSON' | 'XLSX';

interface FormatOption {
  id: ExportFormat;
  label: string;
  description: string;
  icon: any;
}

const formats: FormatOption[] = [
  { id: 'CSV', label: 'CSV Format', description: 'Raw comma-separated values', icon: Table },
  { id: 'PDF', label: 'PDF Report', description: 'Print-ready visual document', icon: FileText },
  { id: 'JSON', label: 'JSON Data', description: 'Structured developer format', icon: Code },
  { id: 'XLSX', label: 'Excel Sheet', description: 'Spreadsheet compatibility', icon: FileSpreadsheet },
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
              "relative flex flex-col items-start p-4 rounded-[24px] border transition-all duration-300 text-left group",
              isActive 
                ? "bg-primary/5 border-primary shadow-[0_0_20px_rgba(37,99,235,0.1)]" 
                : "bg-secondary/30 border-border/50 hover:border-primary/30 hover:bg-secondary/50",
              disabled && "opacity-50 cursor-not-allowed"
            )}
          >
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center mb-3 transition-colors",
              isActive ? "bg-primary text-white" : "bg-card border border-border text-muted-foreground group-hover:text-primary"
            )}>
              <Icon size={20} strokeWidth={2.5} />
            </div>
            
            <div className="space-y-1">
              <p className={cn(
                "text-[12px] font-black uppercase tracking-widest",
                isActive ? "text-primary" : "text-foreground"
              )}>
                {format.label}
              </p>
              <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-60">
                {format.description}
              </p>
            </div>

            {isActive && (
              <motion.div 
                layoutId="active-check"
                className="absolute top-4 right-4 text-primary"
              >
                <Check size={20} strokeWidth={3} />
              </motion.div>
            )}
          </button>
        );
      })}
    </div>
  );
}
