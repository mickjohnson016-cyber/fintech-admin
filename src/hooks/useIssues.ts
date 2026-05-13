'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

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

export interface Ticket {
  id: string;
  user: string;
  type: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  status: 'Open' | 'Pending' | 'Investigating' | 'Escalated' | 'Resolved' | 'Closed';
  assignedTo: string;
  assignedTeam?: string;
  createdDate: string;
  lastUpdated: string;
  description: string;
  timeline: TimelineEvent[];
}

export function useIssues() {
  const [issues, setIssues] = useState<Ticket[]>([]);

  const addIssue = useCallback((newIssue: Ticket) => {
    setIssues(prev => [newIssue, ...prev]);
    toast.success("Ticket Created", { description: `Issue ${newIssue.id} is now in the queue.` });
  }, []);

  const updateIssue = useCallback((id: string, updates: Partial<Ticket>) => {
    setIssues(prev => prev.map(issue => 
      issue.id === id ? { ...issue, ...updates, lastUpdated: new Date().toLocaleTimeString() } : issue
    ));
  }, []);

  const addTimelineEvent = useCallback((issueId: string, event: Omit<TimelineEvent, 'id' | 'timestamp'>) => {
    const newEvent: TimelineEvent = {
      ...event,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: 'Just now'
    };

    setIssues(prev => prev.map(issue => 
      issue.id === issueId 
        ? { 
            ...issue, 
            timeline: [newEvent, ...issue.timeline],
            lastUpdated: 'Just now'
          } 
        : issue
    ));
  }, []);

  const assignIssue = useCallback((id: string, adminName: string, teamName?: string) => {
    updateIssue(id, { assignedTo: adminName, assignedTeam: teamName, status: 'Investigating' });
    addTimelineEvent(id, {
      type: 'assignment',
      title: 'Issue Assigned',
      description: `Assigned to ${adminName}${teamName ? ` (${teamName})` : ''}.`,
      user: { name: 'Admin', role: 'System', initials: 'AD' }
    });
    toast.success("Assignment Updated", { description: `Issue assigned to ${adminName}.` });
  }, [updateIssue, addTimelineEvent]);

  const escalateIssue = useCallback((id: string, team: string, reason: string, priority: string) => {
    updateIssue(id, { status: 'Escalated', priority: priority as any });
    addTimelineEvent(id, {
      type: 'escalation',
      title: 'Issue Escalated',
      description: `Escalated to ${team}. Reason: ${reason}`,
      user: { name: 'Admin', role: 'System', initials: 'AD' }
    });
    toast.warning("Issue Escalated", { description: `Transferred to ${team} for review.` });
  }, [updateIssue, addTimelineEvent]);

  const resolveIssue = useCallback((id: string) => {
    updateIssue(id, { status: 'Resolved' });
    addTimelineEvent(id, {
      type: 'resolution',
      title: 'Issue Resolved',
      description: 'Marked as resolved by admin.',
      user: { name: 'Admin', role: 'System', initials: 'AD' }
    });
    toast.success("Issue Resolved", { description: "The ticket has been closed." });
  }, [updateIssue, addTimelineEvent]);

  const addNote = useCallback((id: string, note: string) => {
    addTimelineEvent(id, {
      type: 'note',
      title: 'Internal Note',
      description: note,
      user: { name: 'Current Admin', role: 'Operations', initials: 'CA' }
    });
  }, [addTimelineEvent]);

  const deleteIssue = useCallback((id: string) => {
    setIssues(prev => prev.filter(issue => issue.id !== id));
    toast.error("Ticket Deleted", { description: "The record has been permanently removed from the system." });
  }, []);

  return {
    issues,
    addIssue,
    updateIssue,
    assignIssue,
    escalateIssue,
    resolveIssue,
    deleteIssue,
    addNote,
    setIssues
  };
}
