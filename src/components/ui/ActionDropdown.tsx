'use client';

import React, { useState, useRef, useEffect } from'react';
import { MoreVertical, LucideIcon, ChevronRight } from'lucide-react';
import { cn } from'@/lib/utils';
import { motion, AnimatePresence, Variants } from 'framer-motion';

export interface ActionDropdownItem {
 label: string;
 icon?: LucideIcon;
 onClick?: () => void;
 variant?:'default' |'danger' |'warning' |'primary';
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
 align?:'left' |'right';
 side?:'top' |'bottom';
}

export function ActionDropdown({ 
 items, 
 trigger,
 triggerSize = 18, 
 triggerClassName,
 menuClassName,
 align ='right',
 side ='bottom'
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
 if (e.key ==='Escape') setIsOpen(false);
 };
 document.addEventListener('mousedown', handleClickOutside);
 document.addEventListener('keydown', handleEsc);
 return () => {
 document.removeEventListener('mousedown', handleClickOutside);
 document.removeEventListener('keydown', handleEsc);
 };
 }, [isOpen]);

 const variants: Variants = {
 hidden: { 
 opacity: 0, 
 scale: 0.98, 
 y: side ==='bottom' ? -5 : 5,
 },
 visible: { 
 opacity: 1, 
 scale: 1, 
 y: 0,
 transition: {
 type:"spring",
 stiffness: 500,
 damping: 30
 }
 },
 exit: { 
 opacity: 0, 
 scale: 0.98, 
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
 className="cursor-pointer"
 >
 {trigger || (
 <button
 className={cn(
"flex items-center justify-center p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors border border-transparent hover:border-border/60",
 isOpen &&"text-primary bg-primary/5 border-primary/20",
 triggerClassName
 )}
 aria-label="Open actions menu"
 aria-expanded={isOpen}
 >
 <MoreVertical size={triggerSize} />
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
"absolute z-[100] min-w-[200px] bg-card border border-border shadow-lg rounded-lg py-1.5 overflow-hidden",
 align ==='right' ?'right-0' :'left-0',
 side ==='top' ?'bottom-full mb-2' :'top-full mt-2',
 menuClassName
 )}
 onClick={(e) => e.stopPropagation()}
 >
 <div className="space-y-0.5 px-1.5">
 {items.map((item, i) => (
 <React.Fragment key={i}>
 {item.dividerBefore && (
 <div className="h-px bg-border/40 my-1.5 mx-1" />
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
"group w-full flex items-center justify-between gap-3 px-2.5 py-2 rounded-md text-left transition-colors",
 item.variant ==='danger'
 ?"text-rose-600 hover:bg-rose-50"
 : item.variant ==='warning'
 ?"text-amber-600 hover:bg-amber-50"
 : item.variant ==='primary'
 ?"text-primary hover:bg-primary/5"
 :"text-foreground/80 hover:bg-muted hover:text-foreground",
 item.disabled &&"opacity-40 cursor-not-allowed"
 )}
 >
 <div className="flex items-center gap-2.5">
 {item.icon && (
 <div className="flex items-center justify-center shrink-0">
 <item.icon size={14} className="transition-transform group-hover:scale-105" />
 </div>
 )}
 <div className="flex flex-col">
 <span className="text-[13px] font-semibold tracking-tight">{item.label}</span>
 </div>
 </div>
 
 {item.badge && (
 <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-[10px] font-bold">
 {item.badge}
 </span>
 )}
 {item.shortcut && <span className="text-[10px] font-medium text-muted-foreground/40">{item.shortcut}</span>}
 </button>
 </React.Fragment>
 ))}
 </div>
 </motion.div>
 )}
 </AnimatePresence>
 </div>
 );
}
