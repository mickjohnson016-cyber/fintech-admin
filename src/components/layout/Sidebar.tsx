'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users, ArrowLeftRight, Smartphone, PiggyBank, TrendingUp,
  BarChart3, Settings, LogOut, LayoutGrid, Zap, ShieldCheck,
  CreditCard, PanelLeftClose, Menu
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/contexts/LayoutContext';

const corePlatform = [
  { name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
  { name: 'Users', icon: Users, href: '/users' },
  { name: 'Transactions', icon: ArrowLeftRight, href: '/transactions' },
  { name: 'Investments', icon: TrendingUp, href: '/investments' },
];

const financialModules = [
  { name: 'Airtime & Data', icon: Smartphone, href: '/airtime', isNew: true },
  { name: 'Savings', icon: PiggyBank, href: '/savings', isNew: true },
  { name: 'Bill Payments', icon: CreditCard, href: '/bills' },
];

const systemSettings = [
  { name: 'Reports', icon: BarChart3, href: '/reports' },
  { name: 'Compliance', icon: ShieldCheck, href: '/compliance' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed } = useLayout();
  const pathname = usePathname();

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[80] lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Aside */}
      <aside
        className={cn(
          "fixed top-0 left-0 z-[90] h-screen border-r transition-[width,transform,opacity] duration-300 ease-in-out lg:static lg:translate-x-0",
          "bg-muted border-border flex flex-col overflow-hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-0 opacity-0 border-none lg:w-0" : "w-64 opacity-100"
        )}
      >
        {/* Sidebar Brand & Toggle */}
        <div className={cn(
          "flex items-center p-6 px-8 justify-between transition-all duration-300",
          isCollapsed && "opacity-0"
        )}>
          <Link href="/dashboard" className="flex items-center gap-3 group overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500 shrink-0">
              <Zap size={22} fill="currentColor" />
            </div>
            {!isCollapsed && (
              <span className="text-2xl font-black text-foreground tracking-tighter uppercase animate-in slide-in-from-left-2 duration-300">OINZpay</span>
            )}
          </Link>

          <button
            onClick={() => setIsCollapsed(true)}
            className="p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-xl transition-all"
          >
            <PanelLeftClose size={20} />
          </button>
        </div>

        {/* Sidebar Nav */}
        <div className={cn(
          "flex-1 overflow-y-auto px-4 py-2 space-y-6 pb-10 transition-all duration-500",
          isCollapsed ? "opacity-0 translate-x-[-20px]" : "opacity-100 translate-x-0"
        )}>
          <div>
            <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Core Platform</p>
            <nav className="space-y-1">
              {corePlatform.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon size={18} className={cn(isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">Financial Modules</p>
            <nav className="space-y-1">
              {financialModules.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon size={18} className={cn(isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                    <span className="flex-1">{item.name}</span>
                    {item.isNew && <span className="px-1.5 py-0.5 rounded bg-primary/20 text-primary text-[8px] font-black uppercase tracking-tighter">New</span>}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <p className="px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] mb-4">System Utilities</p>
            <nav className="space-y-1">
              {systemSettings.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200 group",
                      isActive
                        ? "bg-primary text-white shadow-lg shadow-primary/30"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    )}
                  >
                    <item.icon size={18} className={cn(isActive ? "text-white" : "group-hover:text-primary transition-colors")} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Sidebar Profile Card */}
        <motion.div
          initial={false}
          animate={{ opacity: isCollapsed ? 0 : 1, y: isCollapsed ? 20 : 0 }}
          className={cn(
            "mt-auto border-t border-border p-6 transition-all duration-500",
            isCollapsed && "pointer-events-none"
          )}
        >
          <div onClick={() => toastActions.showActionToast('Opening Profile Settings', 'Navigating to personal account controls')} className="flex items-center gap-4 bg-secondary rounded-[24px] border border-border p-3 px-4 group cursor-pointer hover:bg-card transition-all duration-300">
            <div className="w-10 h-10 rounded-full bg-primary/10 border-2 border-border flex items-center justify-center font-black text-primary text-sm shadow-sm relative shrink-0">
              MJ
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-muted rounded-full"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-foreground truncate leading-none">Mick J.</p>
              <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest">Administrator</p>
            </div>
          </div>
        </motion.div>
      </aside>
    </>
  );
}
