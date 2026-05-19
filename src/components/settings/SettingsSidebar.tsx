'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutGrid,
  Building2,
  Users2,
  ShieldCheck,
  CreditCard,
  Wallet,
  Plug2,
  Scale,
  Code2,
  AlertTriangle,
  Search,
  ChevronRight,
  Shield,
  Zap,
  Globe,
  Settings2,
  Lock,
  Eye
} from 'lucide-react';
import { cn } from "@/lib/utils";

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  href: string;
  variant?: "danger" | "default";
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const menuGroups: MenuGroup[] = [
  {
    title: "General",
    items: [
      { id: "overview", label: "Overview", icon: LayoutGrid, href: "/settings" },
      { id: "users", label: "User Accounts", icon: Users2, href: "/settings/users" },
      { id: "organization", label: "Organization", icon: Building2, href: "/settings/organization" },
      { id: "admins", label: "Admin & Roles", icon: Users2, href: "/settings/admins" },
    ]
  },
  {
    title: "System & Security",
    items: [
      { id: "security", label: "Security Center", icon: ShieldCheck, href: "/settings/security" },
    ]
  },
  {
    title: "Preferences",
    items: [
      { id: "danger", label: "Danger Zone", icon: AlertTriangle, href: "/settings/danger", variant: "danger" },
    ]
  }
];

export default function SettingsSidebar() {
  const pathname = usePathname();
  const [searchQuery, setSearchQuery] = useState("");

  const filteredGroups = menuGroups.map(group => ({
    ...group,
    items: group.items.filter(item =>
      item.label.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(group => group.items.length > 0);

  return (
    <div className="w-full lg:w-72 flex flex-col gap-8 lg:sticky lg:top-8 lg:h-[calc(100vh-10rem)] lg:overflow-y-auto lg:pr-4 scrollbar-hide">
      {/* Search Settings */}
      <div className="relative group px-1">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search settings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-card/50 backdrop-blur-md border border-border/40 rounded-2xl py-3.5 pl-11 pr-4 text-[13px] font-medium outline-none focus:bg-card focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all placeholder:text-muted-foreground/50"
        />
      </div>

      {/* Navigation Groups */}
      <div className="space-y-10 pb-8">
        {filteredGroups.map((group) => (
          <div key={group.title} className="space-y-4">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 flex items-center justify-between">
              {group.title}
              <div className="h-[1px] flex-1 bg-border/20 ml-4" />
            </h3>
            <div className="space-y-1.5">
              {group.items.map((item) => {
                const isActive = pathname === item.href;
                const isDanger = item.variant === "danger";

                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-2xl text-[13px] font-bold transition-all group relative overflow-hidden",
                      isActive
                        ? "bg-primary/10 text-primary shadow-sm shadow-primary/5"
                        : isDanger
                          ? "text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                          : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                    )}
                  >
                    <div className="flex items-center gap-3.5 z-10">
                      <div className={cn(
                        "p-2 rounded-xl transition-all duration-300",
                        isActive ? "bg-primary/20 scale-110 shadow-inner" : "bg-transparent group-hover:bg-secondary/80"
                      )}>
                        <item.icon size={18} className={cn(
                          "transition-transform",
                          isActive ? "text-primary" : "text-muted-foreground/60 group-hover:text-foreground"
                        )} />
                      </div>
                      <span className="tracking-tight">{item.label}</span>
                    </div>

                    {isActive && (
                      <div className="size-1.5 bg-primary rounded-full shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                    )}

                    {!isActive && (
                      <ChevronRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-muted-foreground/40" />
                    )}

                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(59,130,246,0.5)]" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
