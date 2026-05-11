'use client';

import React from 'react';
import { cn } from "@/lib/utils";
import { LucideIcon } from 'lucide-react';

interface SettingsFieldProps {
  label: string;
  description?: string;
  children: React.ReactNode;
  icon?: LucideIcon;
  className?: string;
}

export default function SettingsField({ 
  label, 
  description, 
  children, 
  icon: Icon,
  className 
}: SettingsFieldProps) {
  return (
    <div className={cn("flex flex-col sm:flex-row sm:items-center justify-between gap-6 py-6 first:pt-0 last:pb-0 border-b border-border/40 last:border-0 group", className)}>
      <div className="flex gap-4">
        {Icon && (
          <div className="p-2.5 h-fit bg-secondary/50 border border-border/30 rounded-xl text-muted-foreground group-hover:text-primary transition-colors">
            <Icon size={16} />
          </div>
        )}
        <div className="space-y-1">
          <label className="text-[13px] font-black text-foreground tracking-tight block">
            {label}
          </label>
          {description && (
            <p className="text-[11px] font-medium text-muted-foreground leading-relaxed max-w-md">
              {description}
            </p>
          )}
        </div>
      </div>
      
      <div className="flex-1 flex justify-end items-center">
        <div className="w-full sm:w-auto flex justify-end">
          {children}
        </div>
      </div>
    </div>
  );
}
