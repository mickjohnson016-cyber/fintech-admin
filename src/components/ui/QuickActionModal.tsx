'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LucideIcon, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

export type QuickActionType = 'confirm' | 'export' | 'input' | 'success' | 'danger';

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
  type = 'confirm',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  children,
  isLoading = false
}: QuickActionModalProps) {
  
  const getTypeStyles = () => {
    switch (type) {
      case 'danger': return { color: 'text-rose-500', bg: 'bg-rose-500/10', button: 'bg-rose-500 hover:bg-rose-600' };
      case 'success': return { color: 'text-emerald-500', bg: 'bg-emerald-500/10', button: 'bg-emerald-500 hover:bg-emerald-600' };
      case 'export': return { color: 'text-primary', bg: 'bg-primary/10', button: 'bg-primary hover:bg-primary/90' };
      default: return { color: 'text-primary', bg: 'bg-primary/10', button: 'bg-primary hover:bg-primary/90' };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/60 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md bg-card border border-border/50 rounded-[40px] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.2)] overflow-hidden"
          >
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center", styles.bg)}>
                  {Icon ? <Icon className={styles.color} size={24} strokeWidth={2.5} /> : (
                    type === 'danger' ? <AlertCircle className={styles.color} size={24} strokeWidth={2.5} /> :
                    type === 'success' ? <CheckCircle2 className={styles.color} size={24} strokeWidth={2.5} /> :
                    <Info className={styles.color} size={24} strokeWidth={2.5} />
                  )}
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
                >
                  <X size={20} strokeWidth={2.5} />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-2 mb-8">
                <h3 className="text-2xl font-black text-foreground tracking-tight leading-tight">{title}</h3>
                {description && (
                  <p className="text-sm font-bold text-muted-foreground leading-relaxed uppercase tracking-wide opacity-70">
                    {description}
                  </p>
                )}
              </div>

              {children && (
                <div className="mb-8">
                  {children}
                </div>
              )}

              {/* Footer */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={cn(
                    "flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-95",
                    styles.button
                  )}
                >
                  {isLoading ? 'Processing...' : confirmLabel}
                </Button>
                <Button
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest hover:bg-secondary transition-all active:scale-95"
                >
                  {cancelLabel}
                </Button>
              </div>
            </div>
            
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-16 -mb-16 pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
