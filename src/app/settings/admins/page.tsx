'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import { 
  Users2, 
  UserPlus, 
  ShieldCheck, 
  Key, 
  MoreVertical, 
  Search,
  Mail,
  Shield,
  Activity,
  ChevronRight,
  UserCheck,
  Lock as LockIcon,
  Globe,
  Settings,
  X,
  Plus
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const roles = [
  { name: "Super Admin", count: 2, color: "bg-red-500", desc: "Full system access, all permissions." },
  { name: "Compliance Officer", count: 3, color: "bg-blue-500", desc: "Access to KYC, AML, and reports." },
  { name: "Finance Manager", count: 2, color: "bg-emerald-500", desc: "Treasury and settlement controls." },
  { name: "Operations", count: 5, color: "bg-amber-500", desc: "Provider and transaction management." },
  { name: "Support Agent", count: 8, color: "bg-purple-500", desc: "View only, customer issue resolution." },
];

const admins = [
  { name: "Mick Jagger", email: "mick@oinzpay.com", role: "Super Admin", status: "Active", lastActive: "2m ago", avatar: "MJ" },
  { name: "Sarah Kong", email: "sarah.k@oinzpay.com", role: "Compliance Officer", status: "Active", lastActive: "14m ago", avatar: "SK" },
  { name: "David Olatunji", email: "david.o@oinzpay.com", role: "Finance Manager", status: "Active", lastActive: "1h ago", avatar: "DO" },
  { name: "Jessica Smith", email: "jess@oinzpay.com", role: "Operations", status: "Offline", lastActive: "4h ago", avatar: "JS" },
];

export default function AdminManagement() {
  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Admin & Role Management" 
        description="Govern administrative access via Role-Based Access Control (RBAC). Manage users, permissions, and security scopes."
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Role Overview */}
        <div className="xl:col-span-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {roles.map((role, i) => (
            <div key={i} className="bg-card border border-border/40 rounded-[28px] p-6 hover:border-primary/30 hover:bg-secondary/20 transition-all group">
              <div className="flex items-start justify-between mb-4">
                <div className={cn("size-3 rounded-full", role.color)} />
                <span className="text-[10px] font-black text-muted-foreground uppercase">{role.count} Admins</span>
              </div>
              <h4 className="text-[14px] font-black text-foreground tracking-tight mb-1">{role.name}</h4>
              <p className="text-[11px] font-medium text-muted-foreground leading-snug mb-4">{role.desc}</p>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                Edit Permissions <ChevronRight size={12} />
              </button>
            </div>
          ))}
          <button className="border-2 border-dashed border-border/40 rounded-[28px] p-6 flex flex-col items-center justify-center gap-3 hover:border-primary/40 hover:bg-primary/5 transition-all group">
            <div className="p-3 bg-secondary rounded-2xl group-hover:bg-primary group-hover:text-white transition-all">
              <Plus size={20} />
            </div>
            <span className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">New Role</span>
          </button>
        </div>

        {/* Admin Table */}
        <div className="xl:col-span-3">
          <SettingsCard 
            title="Administrative Directory" 
            description="List of all accounts with administrative dashboard access."
            icon={Users2}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-secondary/30 p-4 rounded-2xl border border-border/20">
                <div className="relative w-full sm:w-80 group">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Search by name or email..." 
                    className="w-full bg-background border border-border/40 rounded-xl py-2.5 pl-10 pr-4 text-[13px] font-medium outline-none focus:border-primary/40 transition-all"
                  />
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button variant="outline" className="flex-1 sm:flex-none h-11 rounded-xl font-black text-[10px] uppercase tracking-widest">
                    Filter Roles
                  </Button>
                  <Button className="flex-1 sm:flex-none h-11 rounded-xl font-black text-[10px] uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 flex items-center gap-2">
                    <UserPlus size={16} />
                    Invite Admin
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {admins.map((admin, i) => (
                  <div key={i} className="flex items-center justify-between p-5 bg-secondary/20 border border-border/10 rounded-[24px] hover:border-primary/20 hover:bg-secondary/40 transition-all group">
                    <div className="flex items-center gap-5">
                      <div className="size-12 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center text-primary font-black text-lg">
                        {admin.avatar}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h5 className="text-[15px] font-black text-foreground tracking-tight">{admin.name}</h5>
                          <span className={cn(
                            "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                            admin.status === "Active" ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-muted text-muted-foreground border-border/50"
                          )}>
                            {admin.status}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-[12px] font-medium text-muted-foreground">
                          <span className="flex items-center gap-1.5"><Mail size={12} /> {admin.email}</span>
                          <span className="size-1 bg-muted-foreground/30 rounded-full" />
                          <span className="flex items-center gap-1.5 font-bold text-foreground/80">{admin.role}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Last Activity</p>
                        <p className="text-[12px] font-bold text-foreground">{admin.lastActive}</p>
                      </div>
                      <button className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </SettingsCard>
        </div>

        {/* Permission Overview Sidebar */}
        <div className="xl:col-span-1 space-y-8">
          <SettingsCard 
            title="Permission Matrix" 
            description="Quick reference for role capabilities."
            icon={ShieldCheck}
          >
            <div className="space-y-6">
              {[
                { label: "Transactions", items: ["View", "Create", "Approve", "Refund"], active: [0, 1, 2, 3] },
                { label: "KYC/AML", items: ["View", "Review", "Override", "Delete"], active: [0, 1] },
                { label: "Provider Config", items: ["View", "Modify", "Disable", "Reset"], active: [0] },
              ].map((scope, i) => (
                <div key={i} className="space-y-3">
                  <h6 className="text-[10px] font-black uppercase tracking-[0.15em] text-muted-foreground/60">{scope.label}</h6>
                  <div className="flex flex-wrap gap-2.5">
                    {scope.items.map((item, j) => (
                      <div key={j} className={cn(
                        "px-3 py-2 rounded-xl border text-[10px] font-black uppercase tracking-widest flex items-center justify-between gap-3 transition-all min-w-[90px]",
                        scope.active.includes(j) ? "bg-primary/10 border-primary/20 text-primary shadow-sm" : "bg-muted/30 border-border/10 text-muted-foreground opacity-50"
                      )}>
                        <span className="truncate">{item}</span>
                        {scope.active.includes(j) ? <UserCheck size={12} className="shrink-0 text-primary" /> : <X size={12} className="shrink-0 opacity-40" />}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <Button variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-primary/20 text-primary hover:bg-primary/5">
                View Full RBAC Grid
              </Button>
            </div>
          </SettingsCard>

          <SettingsCard 
            title="Access Governance" 
            description="Global access policies."
            icon={LockIcon}
          >
              {/* Access Governance Policies */}
              <div className="space-y-6">
                {[
                  { label: "Auto-Revoke", desc: "Revoke access after 90 days of inactivity.", icon: Activity },
                  { label: "Multi-Admin Approval", desc: "Require 2 admins for sensitive changes.", icon: Shield },
                  { label: "Regional Scoping", desc: "Restrict admins by geographical data.", icon: Globe },
                ].map((policy, i) => (
                  <div key={i} className="flex gap-5 items-start group">
                    <div className="p-3 bg-secondary/50 border border-border/30 rounded-2xl text-muted-foreground group-hover:text-primary group-hover:bg-primary/5 transition-all shadow-sm shrink-0">
                      <policy.icon size={18} />
                    </div>
                    <div className="space-y-1.5 py-0.5">
                      <p className="text-[13px] font-black text-foreground tracking-tight leading-none">{policy.label}</p>
                      <p className="text-[11px] font-medium text-muted-foreground leading-relaxed">{policy.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
