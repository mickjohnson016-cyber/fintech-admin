'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MoreVertical, LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface ActionDropdownItem {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'warning' | 'primary';
  disabled?: boolean;
  dividerBefore?: boolean;
  badge?: string;
  shortcut?: string;
}

interface ActionDropdownProps {
  items: ActionDropdownItem[];
  trigger?: React.ReactNode;
  triggerSize?: number;
  triggerClassName?: string;
  menuClassName?: string;
  align?: 'left' | 'right';
  side?: 'top' | 'bottom';
}

export function ActionDropdown({ 
  items, 
  trigger,
  triggerSize = 18, 
  triggerClassName,
  menuClassName,
  align = 'right',
  side = 'bottom'
}: ActionDropdownProps) {
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

  const variants = {
    hidden: { 
      opacity: 0, 
      scale: 0.95, 
      y: side === 'bottom' ? -10 : 10,
      filter: 'blur(4px)'
    },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      filter: 'blur(0px)',
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.98, 
      y: side === 'bottom' ? -5 : 5,
      transition: { duration: 0.1 }
    }
  };

  return (
    <div className="relative inline-block" ref={menuRef}>
      <div
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(prev => !prev);
        }}
      >
        {trigger || (
          <button
            className={cn(
              "flex items-center justify-center p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/80 rounded-xl transition-all duration-200 active:scale-95 shadow-sm border border-transparent hover:border-border/40",
              isOpen && "text-primary bg-primary/5 border-primary/20",
              triggerClassName
            )}
            aria-label="Open actions menu"
            aria-expanded={isOpen}
          >
            <MoreVertical size={triggerSize} strokeWidth={2.5} />
          </button>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={variants}
            className={cn(
              "absolute z-[100] min-w-[240px] max-w-[90vw] bg-card/95 backdrop-blur-xl border border-border/50 rounded-[24px] shadow-[0_20px_50px_rgba(0,0,0,0.15)] py-2.5 overflow-hidden",
              align === 'right' ? 'right-0' : 'left-0',
              side === 'top' ? 'bottom-full mb-2' : 'top-full mt-2',
              // Responsive adjustments
              "sm:min-w-[260px]",
              menuClassName
            )}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-4 py-2 mb-1 flex items-center justify-between">
              <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Operational Actions</p>
              <div className="flex gap-1">
                <div className="w-1 h-1 rounded-full bg-primary/40" />
                <div className="w-1 h-1 rounded-full bg-primary/20" />
              </div>
            </div>
            
            <div className="space-y-1 px-2">
              {items.map((item, i) => (
                <React.Fragment key={i}>
                  {item.dividerBefore && (
                    <div className="h-px bg-border/40 my-2 mx-2" />
                  )}
                  <button
                    onClick={() => {
                      if (!item.disabled && item.onClick) {
                        item.onClick();
                        setIsOpen(false);
                      }
                    }}
                    disabled={item.disabled}
                    className={cn(
                      "group w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-2xl text-left transition-all duration-200",
                      item.variant === 'danger'
                        ? "text-rose-500 hover:bg-rose-500/10"
                        : item.variant === 'warning'
                        ? "text-amber-500 hover:bg-amber-500/10"
                        : item.variant === 'primary'
                        ? "text-primary hover:bg-primary/10"
                        : "text-foreground/80 hover:bg-secondary hover:text-foreground",
                      item.disabled && "opacity-30 cursor-not-allowed",
                      "active:scale-[0.97] touch-none"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "flex items-center justify-center w-8 h-8 rounded-xl transition-all duration-300",
                        item.variant === 'danger' ? "bg-rose-500/5 group-hover:bg-rose-500/20 group-hover:rotate-6" : 
                        item.variant === 'warning' ? "bg-amber-500/5 group-hover:bg-amber-500/20 group-hover:-rotate-6" :
                        "bg-muted/50 group-hover:bg-background/80 shadow-sm group-hover:scale-110"
                      )}>
                        {item.icon && <item.icon size={16} strokeWidth={2.5} />}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[12px] font-black uppercase tracking-wider leading-none">{item.label}</span>
                        {item.shortcut && <span className="text-[9px] font-bold text-muted-foreground/40 mt-0.5">{item.shortcut}</span>}
                      </div>
                    </div>
                    
                    {item.badge && (
                      <span className="px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-[8px] font-black uppercase tracking-widest border border-primary/20">
                        {item.badge}
                      </span>
                    )}
                  </button>
                </React.Fragment>
              ))}
            </div>
            
            {/* Subtle bottom decoration */}
            <div className="mt-2 px-4 py-2 bg-muted/30 flex items-center justify-between border-t border-border/20">
              <span className="text-[8px] font-black text-muted-foreground/40 uppercase tracking-widest">OINZpay Secure</span>
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/40" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
