'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Circle, 
  CheckCircle2, 
  Clock, 
  User, 
  ShieldAlert, 
  ArrowUpRight,
  MessageSquare,
  FileText
} from 'lucide-react';

export interface TimelineEvent {
  id: string;
  type: 'status_change' | 'assignment' | 'escalation' | 'comment' | 'resolution' | 'note';
  title: string;
  description?: string;
  timestamp: string;
  user: {
    name: string;
    role: string;
    initials: string;
  };
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

const getEventIcon = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'status_change': return <Clock size={14} className="text-amber-500" />;
    case 'assignment': return <User size={14} className="text-primary" />;
    case 'escalation': return <ShieldAlert size={14} className="text-rose-500" />;
    case 'comment': return <MessageSquare size={14} className="text-blue-500" />;
    case 'resolution': return <CheckCircle2 size={14} className="text-emerald-500" />;
    case 'note': return <FileText size={14} className="text-muted-foreground" />;
    default: return <Circle size={14} className="text-muted-foreground" />;
  }
};

const getEventBg = (type: TimelineEvent['type']) => {
  switch (type) {
    case 'status_change': return 'bg-amber-500/10 border-amber-500/20';
    case 'assignment': return 'bg-primary/10 border-primary/20';
    case 'escalation': return 'bg-rose-500/10 border-rose-500/20';
    case 'comment': return 'bg-blue-500/10 border-blue-500/20';
    case 'resolution': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'note': return 'bg-secondary border-border/40';
    default: return 'bg-muted border-border/40';
  }
};

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  if (events.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">No activity recorded</p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-border/10", className)}>
      {events.map((event, index) => (
        <div key={event.id} className="relative pl-12 group">
          {/* Icon Node */}
          <div className={cn(
            "absolute left-0 top-0 size-10 rounded-xl border flex items-center justify-center z-10 transition-transform group-hover:scale-110",
            getEventBg(event.type)
          )}>
            {getEventIcon(event.type)}
          </div>

          {/* Content */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4">
              <h4 className="text-[13px] font-black text-foreground tracking-tight">{event.title}</h4>
              <span className="text-[10px] font-bold text-muted-foreground uppercase">{event.timestamp}</span>
            </div>
            
            {event.description && (
              <p className="text-[12px] font-medium text-muted-foreground/80 leading-relaxed">
                {event.description}
              </p>
            )}

            <div className="flex items-center gap-2 pt-1">
              <div className="size-5 rounded-full bg-secondary border border-border/40 flex items-center justify-center text-[8px] font-black text-muted-foreground">
                {event.user.initials}
              </div>
              <span className="text-[10px] font-bold text-muted-foreground/60">
                {event.user.name} • {event.user.role}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
