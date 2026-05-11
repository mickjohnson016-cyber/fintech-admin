'use client';

import React from 'react';
import { Save, Search, Bell, History, CheckCircle2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SettingsHeaderProps {
  title: string;
  description: string;
  lastUpdated?: string;
  isSaving?: boolean;
}

export default function SettingsHeader({ 
  title, 
  description, 
  lastUpdated = "2 mins ago", 
  isSaving = false 
}: SettingsHeaderProps) {
  return (
    <div className="flex flex-col gap-8 mb-10">
      {/* Breadcrumbs & Status */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
          <span>Settings</span>
          <span className="opacity-40">/</span>
          <span className="text-foreground">{title}</span>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-secondary/50 border border-border/50 rounded-full text-[10px] font-black uppercase tracking-widest text-muted-foreground">
            <History size={12} className="text-primary" />
            Last updated: <span className="text-foreground ml-1">{lastUpdated}</span>
          </div>
          {isSaving ? (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary animate-pulse">
              <div className="size-1.5 bg-primary rounded-full" />
              Saving changes...
            </div>
          ) : (
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-emerald-500">
              <CheckCircle2 size={12} />
              All changes saved
            </div>
          )}
        </div>
      </div>

      {/* Main Header Content */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-4">
            {title}
            <div className="h-8 w-[2px] bg-primary/20 rotate-12 hidden sm:block" />
          </h1>
          <p className="text-muted-foreground font-medium text-[15px] max-w-2xl">
            {description}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="h-11 px-6 rounded-2xl border-border/50 font-bold text-muted-foreground bg-card/50 hover:bg-secondary hover:text-foreground transition-all"
          >
            Cancel
          </Button>
          <Button 
            className="h-11 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 flex items-center gap-2.5 transition-all border-none"
          >
            <Save size={18} />
            Save Configuration
          </Button>
        </div>
      </div>
    </div>
  );
}
