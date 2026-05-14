'use client';

import React from'react';
import { Save, Search, Bell, History, CheckCircle2 } from'lucide-react';
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";

interface SettingsHeaderProps {
 title: string;
 description: string;
 lastUpdated?: string;
 isSaving?: boolean;
}

export default function SettingsHeader({
 title,
 description,
 lastUpdated ="2 mins ago",
 isSaving = false
}: SettingsHeaderProps) {
 return (
  <div className="flex flex-col gap-4 mb-10">
  {/* Main Header Content */}
  <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
  <div className="space-y-2">
  <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-4">
  {title}
  </h1>
  </div>
  </div>
  </div>
 );
}
