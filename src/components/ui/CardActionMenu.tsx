'use client';

import React from 'react';
import { ActionDropdown, ActionDropdownItem } from './ActionDropdown';
import { Settings } from 'lucide-react';

interface CardActionMenuProps {
  items: ActionDropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function CardActionMenu({ items, align = 'right', className }: CardActionMenuProps) {
  return (
    <ActionDropdown 
      items={items} 
      align={align} 
      triggerClassName={className}
      triggerSize={16}
    />
  );
}
