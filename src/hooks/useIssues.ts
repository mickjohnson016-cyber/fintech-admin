'use client';

import { useReducer, useCallback, useEffect } from 'react';
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

export interface Note {
  id: string;
  content: string;
  author: string;
  createdAt: string;
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
  notes: Note[];
}

type Action = 
  | { type: 'ADD_ISSUE', payload: Ticket }
  | { type: 'UPDATE_ISSUE', id: string, updates: Partial<Ticket> }
  | { type: 'DELETE_ISSUE', id: string }
  | { type: 'ADD_TIMELINE_EVENT', id: string, event: Omit<TimelineEvent, 'id' | 'timestamp'> }
  | { type: 'ADD_NOTE', id: string, note: Note }
  | { type: 'SET_ISSUES', payload: Ticket[] }
  | { type: 'LOAD_PERSISTED_STATE', payload: Ticket[] };

const STORAGE_KEY = 'oinzpay_admin_issues_v1';

function issuesReducer(state: Ticket[], action: Action): Ticket[] {
  let newState: Ticket[];

  switch (action.type) {
    case 'ADD_ISSUE':
      newState = [action.payload, ...state];
      break;
    
    case 'UPDATE_ISSUE':
      newState = state.map(ticket => 
        ticket.id === action.id 
          ? { ...ticket, ...action.updates, lastUpdated: new Date().toLocaleTimeString() } 
          : ticket
      );
      break;

    case 'DELETE_ISSUE':
      console.log("[Reducer] Deleting Issue ID:", action.id);
      console.log("[Reducer] Current State IDs:", state.map(t => t.id));
      newState = state.filter(ticket => ticket.id !== action.id);
      console.log("[Reducer] New State IDs:", newState.map(t => t.id));
      break;

    case 'ADD_TIMELINE_EVENT': {
      const newEvent: TimelineEvent = {
        ...action.event,
        id: Math.random().toString(36).substr(2, 9),
        timestamp: 'Just now'
      };
      newState = state.map(ticket => 
        ticket.id === action.id 
          ? { 
              ...ticket, 
              timeline: [newEvent, ...ticket.timeline],
              lastUpdated: 'Just now'
            } 
          : ticket
      );
      break;
    }

    case 'ADD_NOTE':
      newState = state.map(ticket => 
        ticket.id === action.id 
          ? { 
              ...ticket, 
              notes: [...(ticket.notes || []), action.note],
              lastUpdated: 'Just now'
            } 
          : ticket
      );
      break;

    case 'SET_ISSUES':
    case 'LOAD_PERSISTED_STATE':
      newState = action.payload;
      break;

    default:
      return state;
  }

  // Persist to storage after every mutation
  if (typeof window !== 'undefined' && action.type !== 'LOAD_PERSISTED_STATE') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
  }
  
  return newState;
}

export function useIssues() {
  const [issues, dispatch] = useReducer(issuesReducer, []);

  // Initialization: Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        dispatch({ type: 'LOAD_PERSISTED_STATE', payload: parsed });
      } catch (e) {
        console.error("Failed to load persisted issues:", e);
      }
    }
  }, []);

  const addIssue = useCallback((newIssue: Ticket) => {
    dispatch({ type: 'ADD_ISSUE', payload: newIssue });
    toast.success("Ticket Created", { description: `Issue ${newIssue.id} is now in the queue.` });
  }, []);

  const updateIssue = useCallback((id: string, updates: Partial<Ticket>) => {
    dispatch({ type: 'UPDATE_ISSUE', id, updates });
  }, []);

  const assignIssue = useCallback((id: string, adminName: string, teamName?: string) => {
    dispatch({ type: 'UPDATE_ISSUE', id, updates: { assignedTo: adminName, assignedTeam: teamName, status: 'Investigating' } });
    dispatch({ 
      type: 'ADD_TIMELINE_EVENT', 
      id, 
      event: {
        type: 'assignment',
        title: 'Issue Assigned',
        description: `Assigned to ${adminName}${teamName ? ` (${teamName})` : ''}.`,
        user: { name: 'Admin', role: 'System', initials: 'AD' }
      } 
    });
    toast.success("Assignment Updated", { description: `Issue assigned to ${adminName}.` });
  }, []);

  const escalateIssue = useCallback((id: string, team: string, reason: string, priority: string) => {
    dispatch({ type: 'UPDATE_ISSUE', id, updates: { status: 'Escalated', priority: priority as any } });
    dispatch({ 
      type: 'ADD_TIMELINE_EVENT', 
      id, 
      event: {
        type: 'escalation',
        title: 'Issue Escalated',
        description: `Escalated to ${team}. Reason: ${reason}`,
        user: { name: 'Admin', role: 'System', initials: 'AD' }
      } 
    });
    toast.warning("Issue Escalated", { description: `Transferred to ${team} for review.` });
  }, []);

  const resolveIssue = useCallback((id: string) => {
    dispatch({ type: 'UPDATE_ISSUE', id, updates: { status: 'Resolved' } });
    dispatch({ 
      type: 'ADD_TIMELINE_EVENT', 
      id, 
      event: {
        type: 'resolution',
        title: 'Issue Resolved',
        description: 'Marked as resolved by admin.',
        user: { name: 'Admin', role: 'System', initials: 'AD' }
      } 
    });
    toast.success("Issue Resolved", { description: "The ticket has been closed." });
  }, []);

  const closeIssue = useCallback((id: string) => {
    dispatch({ type: 'UPDATE_ISSUE', id, updates: { status: 'Closed' } });
    dispatch({ 
      type: 'ADD_TIMELINE_EVENT', 
      id, 
      event: {
        type: 'status_change',
        title: 'Ticket Closed',
        description: 'The issue has been marked as closed by administrator.',
        user: { name: 'Admin', role: 'System', initials: 'AD' }
      } 
    });
    toast.info("Ticket Closed", { description: "The issue has been removed from active view." });
  }, []);

  const addNote = useCallback((id: string, content: string) => {
    const newNote: Note = {
      id: Math.random().toString(36).substr(2, 9),
      content,
      author: 'Current Admin',
      createdAt: new Date().toISOString()
    };
    dispatch({ type: 'ADD_NOTE', id, note: newNote });
    dispatch({ 
      type: 'ADD_TIMELINE_EVENT', 
      id, 
      event: {
        type: 'note',
        title: 'Internal Note Added',
        description: content,
        user: { name: 'Admin', role: 'Operations', initials: 'AD' }
      } 
    });
    toast.success("Note Added", { description: "Internal observation recorded." });
  }, []);

  const deleteIssue = useCallback((id: string) => {
    console.log("[Hook] deleteIssue called for ID:", id);
    dispatch({ type: 'DELETE_ISSUE', id });
    toast.error("Ticket Deleted", { description: `Issue ${id} has been permanently removed.` });
  }, []);

  return {
    issues,
    addIssue,
    updateIssue,
    assignIssue,
    escalateIssue,
    resolveIssue,
    closeIssue,
    deleteIssue,
    addNote,
    setIssues: (payload: Ticket[]) => dispatch({ type: 'SET_ISSUES', payload })
  };
}
