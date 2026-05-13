'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Menu,
  Search,
  Command,
  Sun,
  Moon,
  Bell,
  ShieldCheck,
  ShieldAlert,
  TrendingUp,
  Users,
  AlertTriangle,
  UserPlus,
  Eye,
  ExternalLink,
  MoreVertical,
  Flag,
  CheckCircle2,
  X,
  MessageSquare,
  Zap,
  ArrowRight,
  Filter,
  History,
  Activity,
  Smartphone,
  Lock,
  Clock,
  ChevronRight,
  Shield,
  Layers,
  ArrowLeft,
  Settings2,
  Volume2,
  Mail,
  Vibrate,
  Monitor
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from "@/lib/utils";
import { useLayout } from '@/contexts/LayoutContext';
import { useUser } from '@/contexts/UserContext';
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';

const initialNotifications: any[] = [];

export default function TopNavbar() {
  const { setSidebarOpen, isCollapsed, setIsCollapsed, setIsProfileOpen } = useLayout();
  const { user } = useUser();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [activeCategory, setActiveCategory] = useState('All');
  const [notifs, setNotifs] = useState(initialNotifications);

  // Preferences State
  const [prefs, setPrefs] = useState({
    securityOnly: false,
    muteInvestments: false,
    soundEnabled: true,
    desktopNotifications: true,
    emailEscalation: true
  });

  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('global-search-input');
        if (searchInput) searchInput.focus();
        toast.success('Search activated', { description: 'Command palette ready' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    toast.success(`Searching for "${searchQuery}"...`);
    // In a real app, this might navigate to a results page or filter a list
  };

  // Filter States
  const [filters, setFilters] = useState({
    unreadOnly: false,
    criticalOnly: false,
    assignedToMe: false
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const categories = ['All', 'Security', 'Transactions', 'Users', 'Compliance'];

  const filteredNotifications = useMemo(() => {
    let result = notifs;

    // Category Filter
    if (activeCategory !== 'All') {
      result = result.filter(n => n.category === activeCategory);
    }

    // Quick Filters
    if (filters.unreadOnly) result = result.filter(n => n.unread);
    if (filters.criticalOnly) result = result.filter(n => n.severity === 'critical');

    return result;
  }, [activeCategory, notifs, filters]);

  const unreadCount = notifs.filter(n => n.unread).length;

  const getSeverityStyles = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-500 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
      case 'success': return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-primary bg-primary/10 border-primary/20';
    }
  };

  const togglePref = (key: keyof typeof prefs) => {
    setPrefs(prev => ({ ...prev, [key]: !prev[key] }));
    toast.success(`${key.replace(/([A-Z])/g, ' $1').toLowerCase()} updated`);
  };

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0 z-[70] transition-colors duration-300">
      <div className="flex items-center gap-6 flex-1">
        <button
          onClick={() => setSidebarOpen(true)}
          className="lg:hidden p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all group"
        >
          <Menu size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex p-2.5 bg-card border border-border rounded-xl text-muted-foreground hover:text-foreground transition-all group"
        >
          <Menu size={20} className="group-hover:rotate-90 transition-transform duration-500" />
        </button>

        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-xl relative group">
          <Search size={16} className="absolute left-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            id="global-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search command or customer..."
            className="w-full bg-muted/50 border border-border rounded-2xl py-2 pl-11 pr-16 text-[13px] font-medium text-foreground outline-none focus:bg-background focus:border-primary/40 transition-all"
          />
          <div className="absolute right-3 flex items-center gap-1 bg-card border border-border px-2 py-1 rounded-lg text-[9px] font-black text-muted-foreground shadow-sm">
            <Command size={9} /><span>K</span>
          </div>
        </form>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 pr-6 border-r border-border">
          <button
            onClick={() => {
              if (!mounted) return;
              const nextTheme = theme === 'dark' ? 'light' : 'dark';
              setTheme(nextTheme);
              toast.success(`Switched to ${nextTheme} mode`);
            }}
            className="w-10 h-10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-card rounded-full transition-all"
          >
            {!mounted ? (
              <div className="w-[18px] h-[18px]" />
            ) : (
              theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />
            )}
          </button>

          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowPreferences(false);
              }}
              aria-label="Notifications"
              className={cn(
                "relative flex items-center justify-center w-11 h-11 rounded-full border border-border/40 bg-background/40 backdrop-blur-md transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-primary/50 group active:scale-95",
                showNotifications
                  ? "bg-primary/10 border-primary/30 text-primary shadow-[0_0_15px_rgba(59,130,246,0.1)]"
                  : "text-muted-foreground hover:bg-primary/5 hover:border-primary/20 hover:text-foreground hover:shadow-lg hover:shadow-primary/5"
              )}
            >
              <Bell
                size={20}
                className={cn(
                  "transition-all duration-300 group-hover:scale-110",
                  unreadCount > 0 && !showNotifications && "animate-[bell-swing_2s_infinite_ease-in-out]"
                )}
              />
              {unreadCount > 0 && (
                <span className={cn(
                  "absolute top-1 right-1 flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-rose-500 border-2 border-card text-[9px] font-black text-white shadow-md transition-transform duration-300 translate-x-1/4 -translate-y-1/4",
                  !showNotifications && "animate-pulse"
                )}>
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            <AnimatePresence>
              {showNotifications && (
                <>
                  <div
                    className="fixed inset-0 z-[100]"
                    onClick={() => setShowNotifications(false)}
                  />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10, x: 20 }}
                    className="absolute right-0 mt-4 w-[420px] sm:w-[480px] bg-card/95 backdrop-blur-xl border border-border/40 rounded-[32px] shadow-2xl z-[110] overflow-hidden flex flex-col max-h-[85vh]"
                  >
                    {/* Header */}
                    <div className="p-6 pb-0 space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {showPreferences ? (
                            <button
                              onClick={() => setShowPreferences(false)}
                              className="size-10 bg-secondary/80 border border-border/40 rounded-xl flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
                            >
                              <ArrowLeft size={18} />
                            </button>
                          ) : (
                            <div className="size-10 bg-primary/10 border border-primary/20 rounded-2xl flex items-center justify-center text-primary shadow-inner">
                              <Zap size={20} className="fill-primary/20" />
                            </div>
                          )}
                          <div>
                            <h3 className="text-[14px] font-black text-foreground uppercase tracking-widest">
                              {showPreferences ? "Preferences" : "Ops Console"}
                            </h3>
                            {!showPreferences && (
                              <div className="flex items-center gap-2 mt-0.5">
                                <div className="size-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10B981]" />
                                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">System Online</span>
                              </div>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => setShowPreferences(!showPreferences)}
                          className={cn(
                            "p-2.5 border rounded-xl transition-all",
                            showPreferences
                              ? "bg-primary border-primary text-white"
                              : "bg-secondary/50 border-border/40 text-muted-foreground hover:text-foreground hover:bg-secondary"
                          )}
                        >
                          <Settings2 size={16} />
                        </button>
                      </div>

                      {!showPreferences && (
                        <>
                          {/* Tabs - Responsive Wrap */}
                          <div className="flex flex-wrap items-center gap-1.5 border-b border-border/10 pb-4">
                            {categories.map((cat) => (
                              <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={cn(
                                  "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                                  activeCategory === cat
                                    ? "bg-primary text-white shadow-lg shadow-primary/20"
                                    : "text-muted-foreground/60 hover:text-foreground hover:bg-secondary/50"
                                )}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>

                          {/* Quick Filters */}
                          <div className="flex items-center gap-2 pb-2">
                            <button
                              onClick={() => setFilters(f => ({ ...f, unreadOnly: !f.unreadOnly }))}
                              className={cn(
                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                                filters.unreadOnly ? "bg-amber-500/10 border-amber-500/20 text-amber-500" : "bg-muted/30 border-border/40 text-muted-foreground"
                              )}
                            >
                              Unread
                            </button>
                            <button
                              onClick={() => setFilters(f => ({ ...f, criticalOnly: !f.criticalOnly }))}
                              className={cn(
                                "px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border transition-all",
                                filters.criticalOnly ? "bg-red-500/10 border-red-500/20 text-red-500" : "bg-muted/30 border-border/40 text-muted-foreground"
                              )}
                            >
                              Critical
                            </button>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 overflow-y-auto no-scrollbar py-2">
                      {showPreferences ? (
                        <div className="p-6 space-y-6">
                          <div className="bg-secondary/20 border border-border/10 rounded-2xl p-4 space-y-4">
                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/5 pb-2">Delivery Channels</h4>
                            <div className="space-y-4">
                              {[
                                { id: 'desktopNotifications', label: 'Desktop Notifications', icon: Monitor },
                                { id: 'soundEnabled', label: 'Sound Alerts', icon: Volume2 },
                                { id: 'vibrateEnabled', label: 'Haptic Feedback', icon: Vibrate },
                                { id: 'emailEscalation', label: 'Email Escalations', icon: Mail },
                              ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-3">
                                    <item.icon size={14} className="text-muted-foreground" />
                                    <span className="text-[12px] font-bold text-foreground">{item.label}</span>
                                  </div>
                                  <button
                                    onClick={() => togglePref(item.id as any)}
                                    className={cn(
                                      "w-9 h-5 rounded-full transition-all relative p-1",
                                      prefs[item.id as keyof typeof prefs] ? "bg-primary" : "bg-muted"
                                    )}
                                  >
                                    <div className={cn("size-3 bg-white rounded-full transition-all", prefs[item.id as keyof typeof prefs] ? "translate-x-4" : "translate-x-0")} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="bg-secondary/20 border border-border/10 rounded-2xl p-4 space-y-4">
                            <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-widest border-b border-border/5 pb-2">Filter Priorities</h4>
                            <div className="space-y-4">
                              {[
                                { id: 'securityOnly', label: 'Security Critical Only', desc: 'Mute non-security alerts' },
                                { id: 'muteInvestments', label: 'Mute Investments', desc: 'Silence payout notifications' },
                              ].map((item) => (
                                <div key={item.id} className="flex items-center justify-between">
                                  <div className="space-y-0.5">
                                    <p className="text-[12px] font-bold text-foreground">{item.label}</p>
                                    <p className="text-[9px] font-medium text-muted-foreground">{item.desc}</p>
                                  </div>
                                  <button
                                    onClick={() => togglePref(item.id as any)}
                                    className={cn(
                                      "w-9 h-5 rounded-full transition-all relative p-1",
                                      prefs[item.id as keyof typeof prefs] ? "bg-primary" : "bg-muted"
                                    )}
                                  >
                                    <div className={cn("size-3 bg-white rounded-full transition-all", prefs[item.id as keyof typeof prefs] ? "translate-x-4" : "translate-x-0")} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ) : (
                        <>
                          {filteredNotifications.length > 0 ? (
                            <div className="divide-y divide-border/5 px-4">
                              {filteredNotifications.map((notif) => (
                                <div
                                  key={notif.id}
                                  className={cn(
                                    "p-3 rounded-2xl hover:bg-secondary/40 dark:hover:bg-secondary/20 cursor-pointer transition-all flex flex-col gap-2 group relative mb-1.5 border border-transparent hover:border-border/20",
                                    notif.unread && "bg-primary/[0.02]"
                                  )}
                                >
                                  <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-center gap-3 min-w-0">
                                      <div className={cn(
                                        "size-8 rounded-lg flex items-center justify-center shrink-0 border shadow-inner transition-transform group-hover:scale-105",
                                        getSeverityStyles(notif.severity)
                                      )}>
                                        <notif.icon size={14} />
                                      </div>
                                      <div className="min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                          <span className={cn(
                                            "text-[8px] font-black uppercase tracking-[0.2em] px-1.5 py-0.5 rounded",
                                            getSeverityStyles(notif.severity)
                                          )}>
                                            {notif.category}
                                          </span>
                                        </div>
                                        <h4 className="text-[12px] font-black text-foreground leading-tight tracking-tight truncate">{notif.title}</h4>
                                      </div>
                                    </div>

                                    <div className="flex flex-col items-end shrink-0 gap-1">
                                      <div className="flex items-center gap-1.5">
                                        {notif.unread && <div className="size-1.5 bg-primary rounded-full animate-pulse shadow-[0_0_8px_#3B82F6]" />}
                                        <span className="text-[9px] font-bold text-muted-foreground/40">{notif.time}</span>
                                      </div>
                                      {/* Micro Actions */}
                                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                                        <button
                                          onClick={(e) => { e.stopPropagation(); toast("Coming Soon", { description: 'Case Assignment feature is being finalized.' }); }}
                                          className="h-6 px-2 bg-background border border-border/40 rounded-md text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                                        >
                                          Assign
                                        </button>
                                        <button
                                          onClick={(e) => { e.stopPropagation(); router.push(notif.link); setShowNotifications(false); }}
                                          className="h-6 px-2 bg-background border border-border/40 rounded-md text-[8px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-all"
                                        >
                                          View
                                        </button>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="pl-11 pr-2">
                                    <p className="text-[11px] font-medium text-muted-foreground/70 leading-relaxed line-clamp-2 mb-2">
                                      {notif.desc}
                                    </p>

                                    {/* Metadata Row */}
                                    <div className="flex items-center gap-3 text-[8px] font-black uppercase tracking-widest text-muted-foreground/30 py-1.5 border-t border-border/5">
                                      <span className="flex items-center gap-1">
                                        <Shield size={9} />
                                        Risk: <span className="text-foreground/50">{notif.priority}</span>
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Layers size={9} />
                                        Queue: 3
                                      </span>
                                      <span className="flex items-center gap-1">
                                        <Activity size={9} />
                                        {notif.category}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="py-24 text-center space-y-4 px-8">
                              <div className="size-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto border border-border/10">
                                <CheckCircle2 size={24} className="text-muted-foreground/20" />
                              </div>
                              <div>
                                <p className="text-[11px] font-black text-muted-foreground uppercase tracking-[0.2em]">No notifications available</p>
                                <p className="text-[10px] font-medium text-muted-foreground/60 mt-2">Platform activity and alerts will appear here once connected.</p>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-border/10 bg-secondary/5 flex items-center justify-between">
                      <button
                        onClick={() => { router.push('/compliance'); setShowNotifications(false); }}
                        className="text-[9px] font-black text-muted-foreground uppercase tracking-widest hover:text-primary transition-colors flex items-center gap-2"
                      >
                        <History size={11} /> Audit Trail
                      </button>
                      <button
                        className="text-[9px] font-black text-primary uppercase tracking-widest hover:underline"
                        onClick={() => {
                          if (showPreferences) {
                            setShowPreferences(false);
                          } else {
                            setNotifs(notifs.map(n => ({ ...n, unread: false })));
                            toast.success("Log Cleared");
                          }
                        }}
                      >
                        {showPreferences ? "Close Settings" : "Resolve All"}
                      </button>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div
          onClick={() => setIsProfileOpen(true)}
          className="flex items-center gap-3 group cursor-pointer hover:bg-card p-1.5 px-2 rounded-2xl transition-all"
        >
          <div className="flex flex-col items-end hidden sm:flex">
            <span className="text-[12px] font-black text-foreground tracking-tight">{user.name || "Configure Profile"}</span>
            <div className="flex items-center gap-1.5">
              <div className="size-1 bg-emerald-500 rounded-full" />
              <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">{user.role}</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-secondary border border-border/40 flex items-center justify-center font-black text-primary text-xs shadow-sm transition-transform group-hover:scale-105 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="size-full object-cover" />
            ) : (
              getInitials(user.name)
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
