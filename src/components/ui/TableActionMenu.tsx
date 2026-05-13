'use client';

import React from 'react';
import { ActionDropdown, ActionDropdownItem } from './ActionDropdown';
import { MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TableActionMenuProps {
  items: ActionDropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function TableActionMenu({ items, align = 'right', className }: TableActionMenuProps) {
  return (
    <ActionDropdown 
      items={items} 
      align={align}
      trigger={
        <button
          className={cn(
            "p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all border border-transparent hover:border-primary/10",
            className
          )}
        >
          <MoreHorizontal size={16} strokeWidth={2.5} />
        </button>
      }
    />
  );
}
