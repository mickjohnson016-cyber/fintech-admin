'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface ActionMenuItem {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  variant?: 'default' | 'danger';
  disabled?: boolean;
  dividerBefore?: boolean;
}

interface ActionMenuProps {
  items: ActionMenuItem[];
  triggerSize?: number;
  triggerClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
}

export function ActionMenu({ 
  items, 
  triggerSize = 16, 
  triggerClassName,
  menuClassName,
  align = 'right' 
}: ActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
        className={cn(
          "p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all",
          isOpen && "text-primary bg-primary/5",
          triggerClassName
        )}
        aria-label="Actions menu"
        aria-expanded={isOpen}
      >
        <MoreVertical size={triggerSize} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 6 }}
            transition={{ duration: 0.15 }}
            className={cn(
              "absolute top-full mt-2 w-52 bg-card border border-border/40 rounded-2xl shadow-2xl z-50 py-1.5 overflow-hidden",
              align === 'right' ? 'right-0' : 'left-0',
              menuClassName
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {items.map((item, i) => (
              <React.Fragment key={i}>
                {item.dividerBefore && (
                  <div className="h-px bg-border/10 my-1" />
                )}
                <button
                  onClick={() => {
                    if (!item.disabled) {
                      item.onClick();
                      setIsOpen(false);
                    }
                  }}
                  disabled={item.disabled}
                  className={cn(
                    "w-full flex items-center gap-3 px-4 py-2.5 text-left text-[10px] font-black uppercase tracking-widest transition-all",
                    item.variant === 'danger'
                      ? "text-rose-500 hover:bg-rose-500/5"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                    item.disabled && "opacity-30 cursor-not-allowed"
                  )}
                >
                  {item.icon && <item.icon size={14} />}
                  {item.label}
                </button>
              </React.Fragment>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
