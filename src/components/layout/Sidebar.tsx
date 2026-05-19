'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users, ArrowLeftRight, Smartphone, PiggyBank, TrendingUp,
  BarChart3, Settings, LogOut, LayoutGrid, Zap, ShieldCheck,
  CreditCard, PanelLeftClose, Menu, MessageSquare, Key,
  Wallet, Building2, Bell, Activity, User
} from 'lucide-react';
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useLayout } from '@/contexts/LayoutContext';
import { useBranding } from '@/context/BrandingContext';
import { useUser } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/utils/permissionUtils';

const corePlatform = [
  { name: 'Dashboard', icon: LayoutGrid, href: '/dashboard' },
  { name: 'Customers', icon: Users, href: '/users' },
  { name: 'Wallets', icon: Wallet, href: '/savings' },
  { name: 'Transactions', icon: ArrowLeftRight, href: '/transactions' },
  { name: 'Analytics', icon: BarChart3, href: '/reports' },
];

const financialModules = [
  { name: 'Airtime & Data', icon: Smartphone, href: '/airtime' },
  { name: 'Investments', icon: TrendingUp, href: '/investments' },
  { name: 'Bill Payments', icon: CreditCard, href: '/bills' },
];

const mainNavigation = [
  { name: 'Compliance', icon: ShieldCheck, href: '/compliance' },
  { name: 'Issues Center', icon: MessageSquare, href: '/support/issues' },
  { name: 'Settings', icon: Settings, href: '/settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen, isCollapsed, setIsCollapsed, setIsProfileOpen } = useLayout();
  const { logo: brandingLogo } = useBranding();
  const { user: authUser } = useAuth();
  const { user: profileUser } = useUser();
  const [mounted, setMounted] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return '??';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const filteredNavigation = mainNavigation.filter(item => {
    if (item.name === 'Settings' && authUser?.role !== 'super_admin') {
      return false;
    }
    return true;
  });

  const menuItems = [
    { label: 'Core Platform', items: corePlatform },
    { label: 'Financial Modules', items: financialModules },
    { label: 'System & Governance', items: filteredNavigation },
  ];

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
          "fixed top-0 left-0 z-[90] h-screen border-r transition-all duration-300 ease-in-out lg:static lg:translate-x-0 lg:shrink-0",
          "bg-muted border-border flex flex-col overflow-hidden",
          // Mobile: translate based on sidebarOpen
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
          // Desktop: width 0 when collapsed, 256px when expanded
          isCollapsed ? "lg:w-0 lg:border-none" : "lg:w-64",
          // Mobile always 256px wide
          "w-64"
        )}
      >
        {/* Sidebar Brand & Toggle */}
        <div className="flex items-center p-6 px-8 justify-start transition-all duration-300">
          <Link href="/dashboard" className="flex items-center gap-3 group overflow-hidden">
            <div className="w-10 h-10 rounded-2xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30 group-hover:rotate-12 transition-transform duration-500 shrink-0 overflow-hidden relative">
              {mounted && brandingLogo !== "/logo.svg" ? (
                <img src={brandingLogo} alt="Logo" className="size-full object-cover" />
              ) : (
                <Zap size={22} fill="currentColor" />
              )}
            </div>
            <span className="text-2xl font-black text-foreground tracking-tighter uppercase animate-in slide-in-from-left-2 duration-300">OINZpay</span>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2 pb-10 transition-all duration-500">
          <div>
            {menuItems.map((group) => (
              <div key={group.label} className="mb-6 last:mb-0">
                <p className="px-4 text-[10px] font-black text-muted-foreground/40 uppercase tracking-[0.2em] mb-3">{group.label}</p>
                <nav className="space-y-1">
                  {group.items.map((item) => {
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
            ))}
          </div>
        </div>

        {/* Sidebar Profile Card */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, y: 0 }}
          className="mt-auto border-t border-border p-6 transition-all duration-500"
        >
          <div onClick={() => setIsProfileOpen(true)} className="flex items-center gap-4 bg-secondary rounded-[24px] border border-border p-3 px-4 group cursor-pointer hover:bg-card transition-all duration-300">
            <div className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center font-black text-primary text-xs shadow-sm relative shrink-0 overflow-hidden">
              {profileUser?.avatar ? (
                <img src={profileUser.avatar} alt={authUser?.name || profileUser.name} className="size-full object-cover" />
              ) : (
                <User size={18} className="text-muted-foreground/50" />
              )}
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-secondary rounded-full group-hover:border-card transition-colors"></span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-black text-foreground truncate leading-none">{authUser?.name || profileUser?.name || "Identity Needed"}</p>
              <p className="text-[10px] font-bold text-muted-foreground mt-1 uppercase tracking-widest text-muted-foreground/60">{authUser?.role || profileUser?.role}</p>
            </div>
          </div>
        </motion.div>
      </aside>
    </>
  );
}
