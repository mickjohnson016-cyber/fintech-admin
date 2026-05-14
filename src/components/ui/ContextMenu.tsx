'use client';

import React, { useState, useEffect, useRef } from'react';
import { motion, AnimatePresence } from'framer-motion';
import { cn } from'@/lib/utils';
import { ActionDropdownItem } from'./ActionDropdown';

interface ContextMenuProps {
 items: ActionDropdownItem[];
 children: React.ReactNode;
 className?: string;
}

export function ContextMenu({ items, children, className }: ContextMenuProps) {
 const [position, setPosition] = useState<{ x: number, y: number } | null>(null);
 const menuRef = useRef<HTMLDivElement>(null);

 const handleContextMenu = (e: React.MouseEvent) => {
 e.preventDefault();
 setPosition({ x: e.clientX, y: e.clientY });
 };

 useEffect(() => {
 const handleClickOutside = (e: MouseEvent) => {
 if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
 setPosition(null);
 }
 };
 const handleScroll = () => setPosition(null);
 
 if (position) {
 document.addEventListener('mousedown', handleClickOutside);
 window.addEventListener('scroll', handleScroll);
 }
 
 return () => {
 document.removeEventListener('mousedown', handleClickOutside);
 window.removeEventListener('scroll', handleScroll);
 };
 }, [position]);

 return (
 <div onContextMenu={handleContextMenu} className={cn("contents", className)}>
 {children}
 
 <AnimatePresence>
 {position && (
 <motion.div
 ref={menuRef}
 initial={{ opacity: 0, scale: 0.9, y: 5 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.9, y: 5 }}
 style={{ 
 position:'fixed', 
 top: position.y, 
 left: position.x,
 zIndex: 1000 
 }}
 className="min-w-[200px] bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl py-2 overflow-hidden"
 >
 <div className="px-3 py-1.5 mb-1">
 <p className="text-[9px] font-black text-muted-foreground uppercase tracking-[0.2em]">Context Actions</p>
 </div>
 
 <div className="space-y-0.5 px-1.5">
 {items.map((item, i) => (
 <React.Fragment key={i}>
 {item.dividerBefore && (
 <div className="h-px bg-border/40 my-1 mx-2" />
 )}
 <button
 onClick={() => {
 if (!item.disabled && item.onClick) {
 item.onClick();
 setPosition(null);
 }
 }}
 disabled={item.disabled}
 className={cn(
"group w-full flex items-center justify-between gap-3 px-3 py-2 rounded-xl text-left transition-all duration-200",
 item.variant ==='danger'
 ?"text-rose-500 hover:bg-rose-500/10"
 :"text-foreground/80 hover:bg-secondary hover:text-foreground",
 item.disabled &&"opacity-30 cursor-not-allowed"
 )}
 >
 <div className="flex items-center gap-3">
 {item.icon && <item.icon size={14} className="opacity-50 group-hover:opacity-100" />}
 <span className="text-[11px] font-black uppercase tracking-wider">{item.label}</span>
 </div>
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
