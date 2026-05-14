'use client';

import React from'react';
import { motion, AnimatePresence } from'framer-motion';
import { X, LucideIcon, CheckCircle2, AlertCircle, Info } from'lucide-react';
import { Button } from'./button';
import { cn } from'@/lib/utils';

export type QuickActionType ='confirm' |'export' |'input' |'success' |'danger';

interface QuickActionModalProps {
 isOpen: boolean;
 onClose: () => void;
 onConfirm: () => void;
 title: string;
 description?: string;
 icon?: LucideIcon;
 type?: QuickActionType;
 confirmLabel?: string;
 cancelLabel?: string;
 children?: React.ReactNode;
 isLoading?: boolean;
}

export function QuickActionModal({
 isOpen,
 onClose,
 onConfirm,
 title,
 description,
 icon: Icon,
 type ='confirm',
 confirmLabel ='Confirm',
 cancelLabel ='Cancel',
 children,
 isLoading = false
}: QuickActionModalProps) {
 
 const getTypeStyles = () => {
 switch (type) {
 case'danger': return { color:'text-rose-600', bg:'bg-rose-50', button:'bg-rose-600 hover:bg-rose-700' };
 case'success': return { color:'text-emerald-600', bg:'bg-emerald-50', button:'bg-emerald-600 hover:bg-emerald-700' };
 default: return { color:'text-primary', bg:'bg-primary/5', button:'bg-primary hover:bg-primary/90' };
 }
 };

 const styles = getTypeStyles();

 return (
 <AnimatePresence>
 {isOpen && (
 <div className="fixed inset-0 z-[500] flex items-center justify-center p-4">
 {/* Overlay */}
 <motion.div
 initial={{ opacity: 0 }}
 animate={{ opacity: 1 }}
 exit={{ opacity: 0 }}
 onClick={onClose}
 className="absolute inset-0 bg-background/60 backdrop-blur-sm"
 />

 {/* Modal Container */}
 <motion.div
 initial={{ opacity: 0, scale: 0.98, y: 10 }}
 animate={{ opacity: 1, scale: 1, y: 0 }}
 exit={{ opacity: 0, scale: 0.98, y: 10 }}
 className="relative w-full max-w-md bg-card border border-border shadow-xl rounded-xl overflow-hidden"
 >
 <div className="p-6">
 {/* Header */}
 <div className="flex items-center justify-between mb-5">
 <div className={cn("size-10 rounded-lg flex items-center justify-center border border-border/40", styles.bg)}>
 {Icon ? <Icon className={styles.color} size={20} strokeWidth={2} /> : (
 type ==='danger' ? <AlertCircle className={styles.color} size={20} strokeWidth={2} /> :
 type ==='success' ? <CheckCircle2 className={styles.color} size={20} strokeWidth={2} /> :
 <Info className={styles.color} size={20} strokeWidth={2} />
 )}
 </div>
 <button 
 onClick={onClose}
 className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
 >
 <X size={18} strokeWidth={2} />
 </button>
 </div>

 {/* Content */}
 <div className="space-y-1.5 mb-6">
 <h3 className="text-xl font-semibold text-foreground tracking-tight">{title}</h3>
 {description && (
 <p className="text-[14px] text-muted-foreground leading-relaxed">
 {description}
 </p>
 )}
 </div>

 {children && (
 <div className="mb-6">
 {children}
 </div>
 )}

 {/* Footer */}
 <div className="flex items-center gap-3">
 <Button
 variant="ghost"
 onClick={onClose}
 className="flex-1 h-10 rounded-lg text-[13px] font-semibold hover:bg-muted transition-colors"
 >
 {cancelLabel}
 </Button>
 <Button
 onClick={onConfirm}
 disabled={isLoading}
 className={cn(
"flex-1 h-10 rounded-lg text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90",
 styles.button
 )}
 >
 {isLoading ?'Processing...' : confirmLabel}
 </Button>
 </div>
 </div>
 </motion.div>
 </div>
 )}
 </AnimatePresence>
 );
}
