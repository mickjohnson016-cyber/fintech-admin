'use client';

import React, { useState } from 'react';
import { 
  Layers, Search, Filter, ArrowRight, ShieldAlert, 
  CheckCircle2, XCircle, AlertTriangle, Clock, 
  ExternalLink, ChevronRight, User, MoreHorizontal,
  Download, History, UserCheck, UserX, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from "@/lib/utils";
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

// Mock data for the review queue
const initialQueue = [
  { id: 'TXN-984205', user: 'Ibrahim Danjuma', amount: 1500000, risk: 92, time: '30m ago', reason: 'Large transfer to unverified merchant', status: 'Flagged', type: 'Transfer' },
  { id: 'TXN-984204', user: 'Amina Yusuf', amount: 250000, risk: 32, time: '45m ago', reason: 'First-time withdrawal', status: 'Pending', type: 'Withdrawal' },
  { id: 'TXN-984199', user: 'Blessing Udoh', amount: 12000, risk: 88, time: '1h ago', reason: 'Device linked to banned account', status: 'Flagged', type: 'Payment' },
  { id: 'TXN-984188', user: 'David Olatunji', amount: 50000, risk: 45, time: '2h ago', reason: 'High velocity activity', status: 'Pending', type: 'Transfer' },
];

export default function ReviewQueuePage() {
  const [queue, setQueue] = useState(initialQueue);
  const [filter, setFilter] = useState<'all' | 'pending' | 'flagged' | 'high risk'>('all');

  const filteredQueue = queue.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'pending') return item.status === 'Pending';
    if (filter === 'flagged') return item.status === 'Flagged';
    if (filter === 'high risk') return item.risk > 80;
    return true;
  });

  const handleAction = (id: string, action: 'Approve' | 'Reject' | 'Escalate') => {
    setQueue(prev => prev.filter(item => item.id !== id));
    if (action === 'Approve') {
      toast.success('Transaction Approved', { description: `${id} has been released.` });
    } else if (action === 'Reject') {
      toast.error('Transaction Rejected', { description: `${id} has been blocked.` });
    } else {
      toast.warning('Case Escalated', { description: `${id} moved to Senior Compliance.` });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700 pb-20">
      <Breadcrumbs />
      
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-black text-foreground tracking-tight flex items-center gap-3">
            <Layers className="text-primary" />
            Compliance Review Queue
          </h1>
          <p className="text-muted-foreground font-medium text-[13px] mt-1">
            Manual investigation pool for high-risk and pending transactions.
          </p>
        </div>
        
        <div className="flex items-center gap-2 bg-muted p-1 rounded-xl border border-border">
          {['all', 'pending', 'flagged', 'high risk'].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t as any)}
              className={cn(
                "px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                filter === t ? "bg-card text-foreground shadow-sm border border-border" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {filteredQueue.map((item) => (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-card border border-border rounded-[24px] p-6 hover:shadow-xl transition-all group"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-start gap-6">
                  <div className={cn(
                    "size-14 rounded-2xl flex items-center justify-center border shrink-0",
                    item.risk > 80 ? "bg-rose-500/10 border-rose-500/20 text-rose-500" : "bg-primary/10 border-primary/20 text-primary"
                  )}>
                    <ShieldAlert size={24} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-black text-foreground">{item.user}</h3>
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border",
                        item.status === 'Flagged' ? "bg-rose-500/10 text-rose-500 border-rose-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                      )}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[11px] font-black text-primary font-mono">{item.id} • {item.type}</p>
                    <p className="text-xs font-medium text-muted-foreground mt-2 flex items-center gap-1.5">
                      <AlertTriangle size={12} className="text-amber-500" />
                      {item.reason}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col lg:items-end gap-1 shrink-0">
                  <div className="text-2xl font-black text-foreground">₦{item.amount.toLocaleString()}</div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col items-end">
                      <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Risk Score</span>
                      <span className={cn("text-sm font-black", item.risk > 80 ? "text-rose-500" : "text-amber-500")}>{item.risk}/100</span>
                    </div>
                    <div className="w-12 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div className={cn("h-full", item.risk > 80 ? "bg-rose-500" : "bg-amber-500")} style={{ width: `${item.risk}%` }} />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 border-t lg:border-t-0 lg:border-l border-border pt-6 lg:pt-0 lg:pl-6">
                  <Button 
                    onClick={() => handleAction(item.id, 'Approve')}
                    className="h-10 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl px-6 font-black text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-500/20"
                  >
                    Approve
                  </Button>
                  <Button 
                    onClick={() => handleAction(item.id, 'Reject')}
                    variant="outline"
                    className="h-10 border-rose-500/20 text-rose-500 hover:bg-rose-500/5 rounded-xl px-6 font-black text-[10px] uppercase tracking-widest"
                  >
                    Reject
                  </Button>
                  <Button 
                    onClick={() => handleAction(item.id, 'Escalate')}
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-xl text-muted-foreground hover:text-primary hover:bg-primary/5"
                  >
                    <ArrowRight size={18} />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
          
          {filteredQueue.length === 0 && (
            <div className="py-20 flex flex-col items-center justify-center text-center space-y-4">
              <div className="size-20 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center">
                <CheckCircle2 size={40} />
              </div>
              <div>
                <h2 className="text-xl font-black text-foreground uppercase tracking-tight">Queue is Empty</h2>
                <p className="text-muted-foreground text-sm font-medium">All high-risk transactions have been processed.</p>
              </div>
              <Button onClick={() => setQueue(initialQueue)} variant="link" className="text-primary font-bold">Reset Simulation</Button>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
