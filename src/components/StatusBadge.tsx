import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = (status: string) => {
    const s = status.toLowerCase();
    if (['active', 'success', 'verified', 'completed', 'matured'].includes(s)) {
      return 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
    }
    if (['failed', 'suspended', 'rejected', 'withdrawn', 'blocked'].includes(s)) {
      return 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20';
    }
    if (['pending', 'limited'].includes(s)) {
      return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
    }
    return 'bg-muted text-muted-foreground border-border';
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${getStatusStyles(status)}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
