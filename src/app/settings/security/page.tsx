'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  ShieldCheck, 
  Lock as LockIcon, 
  Smartphone, 
  Key, 
  Globe, 
  History, 
  Monitor, 
  AlertTriangle,
  Fingerprint,
  ShieldAlert,
  ChevronRight,
  Shield,
  Eye,
  LogOut,
  MapPin,
  Clock
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function SecurityCenter() {
  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Security Center" 
        description="Manage your platform's security perimeter, access policies, and authentication protocols."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Authentication Section */}
          <SettingsCard 
            title="Authentication & Access" 
            description="Configure how admins access the dashboard and enforce security standards."
            icon={LockIcon}
          >
            <div className="space-y-2">
              <SettingsField 
                label="Two-Factor Authentication (2FA)" 
                description="Enforce 2FA for all administrative accounts via Authenticator app or YubiKey."
                icon={Smartphone}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="Strict Password Policy" 
                description="Minimum 12 characters, including special symbols and rotational requirements."
                icon={Key}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="Session Timeout" 
                description="Automatically log out inactive admins after a period of inactivity."
                icon={Clock}
              >
                <select defaultValue="1 Hour" className="bg-secondary/50 border border-border/40 rounded-xl px-4 py-2 text-[12px] font-black uppercase outline-none focus:border-primary/40 transition-all">
                  <option>15 Minutes</option>
                  <option>30 Minutes</option>
                  <option>1 Hour</option>
                  <option>4 Hours</option>
                </select>
              </SettingsField>

              <SettingsField 
                label="IP Whitelisting" 
                description="Restrict access to specific office or VPN IP addresses."
                icon={Globe}
              >
                <Button variant="outline" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-9">
                  Configure IPs
                </Button>
              </SettingsField>
            </div>
          </SettingsCard>

          {/* Active Sessions */}
          <SettingsCard 
            title="Active Management Sessions" 
            description="Real-time view of all currently authenticated administrative sessions."
            icon={Monitor}
            badge="4 Active"
            badgeVariant="success"
          >
            <div className="space-y-4">
              {[
                { device: "MacBook Pro 16\"", location: "Lagos, Nigeria", ip: "102.89.2.44", status: "Current Session", icon: Monitor, current: true },
                { device: "iPhone 15 Pro", location: "London, UK", ip: "212.58.244.71", status: "Active 12m ago", icon: Smartphone, current: false },
                { device: "Windows Terminal", location: "San Francisco, US", ip: "172.217.164.142", status: "Active 2h ago", icon: Monitor, current: false },
              ].map((session, i) => (
                <div key={i} className={cn(
                  "p-5 border rounded-[24px] flex flex-col sm:flex-row sm:items-center justify-between gap-5 transition-all group",
                  session.current ? "bg-primary/5 border-primary/20 shadow-lg shadow-primary/5" : "bg-secondary/30 border-border/20 hover:bg-secondary/50"
                )}>
                  <div className="flex items-center gap-5 min-w-0 flex-1">
                    <div className={cn(
                      "p-3 rounded-2xl shrink-0",
                      session.current ? "bg-primary text-white" : "bg-background border border-border/40 text-muted-foreground"
                    )}>
                      <session.icon size={20} />
                    </div>
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <p className="text-[14px] font-black text-foreground truncate">{session.device}</p>
                        {session.current && (
                          <span className="px-2 py-0.5 bg-emerald-500 text-white text-[9px] font-black uppercase rounded-full shrink-0">Current</span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] font-medium text-muted-foreground overflow-hidden">
                        <MapPin size={12} className="shrink-0" />
                        <span className="truncate">{session.location}</span>
                        <span className="size-1 bg-muted-foreground/30 rounded-full shrink-0" />
                        <span className="font-mono">{session.ip}</span>
                      </div>
                    </div>
                  </div>
                  {!session.current && (
                    <button className="sm:w-auto w-full p-2.5 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest shrink-0">
                      <LogOut size={14} />
                      Revoke
                    </button>
                  )}
                </div>
              ))}
              <button className="w-full py-4 text-[11px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-red-500 transition-colors">
                Revoke All Other Sessions
              </button>
            </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Security Score Card */}
          <div className="p-8 bg-gradient-to-br from-primary/20 via-card to-card border border-border/40 rounded-[32px] space-y-6 relative overflow-hidden shadow-2xl shadow-black/10">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Shield size={120} className="text-primary" />
            </div>
            
            <div className="space-y-2 relative z-10">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
                <ShieldCheck size={14} />
                Security Health Score
              </div>
              <div className="flex items-baseline gap-2">
                <h3 className="text-5xl font-black text-foreground tracking-tighter">98</h3>
                <span className="text-lg font-bold text-muted-foreground">/100</span>
              </div>
              <p className="text-[13px] font-medium text-muted-foreground">
                Your security posture is exceptional. Only 2 minor policy optimizations recommended.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-border/20 relative z-10">
              {[
                { label: "MFA Enforcement", status: "Optimal", color: "text-emerald-500" },
                { label: "Root Access", status: "Restricted", color: "text-emerald-500" },
                { label: "Audit Logging", status: "Active", color: "text-emerald-500" },
                { label: "API Isolation", status: "Optimal", color: "text-emerald-500" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase">{item.label}</span>
                  <span className={cn("text-[11px] font-black uppercase tracking-widest", item.color)}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Threat Map/Alerts */}
          <SettingsCard 
            title="Threat Intelligence" 
            description="Detected anomalies and blocked attempts."
            icon={ShieldAlert}
          >
            <div className="space-y-6">
              {[
                { type: "Brute Force", count: "12 blocked", detail: "Mainly from CN/RU nodes", color: "bg-red-500" },
                { type: "Credential Stuffing", count: "89 prevented", detail: "Last 24 hours", color: "bg-amber-500" },
                { type: "Unusual API Load", count: "Normal", detail: "No spike detected", color: "bg-emerald-500" },
              ].map((threat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[11px] font-black uppercase tracking-wider">
                    <span className="text-foreground">{threat.type}</span>
                    <span className="text-muted-foreground">{threat.count}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/40 rounded-full overflow-hidden">
                    <div className={cn("h-full rounded-full w-full opacity-30", threat.color)} />
                  </div>
                  <p className="text-[9px] font-bold text-muted-foreground uppercase">{threat.detail}</p>
                </div>
              ))}
            </div>
          </SettingsCard>

          {/* API Key Management */}
          <SettingsCard 
            title="Secret Management" 
            description="Manage administrative API keys and secrets."
            icon={Fingerprint}
          >
            <div className="space-y-4">
              <div className="p-4 bg-secondary/50 border border-border/30 rounded-2xl space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[11px] font-black uppercase text-foreground">Production_Key_01</span>
                  <span className="text-[9px] font-bold text-muted-foreground uppercase">Exp: 12/26</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-background border border-border/20 rounded-xl px-3 py-2 text-[10px] font-mono text-muted-foreground overflow-hidden whitespace-nowrap opacity-60">
                    pk_live_************************
                  </div>
                  <button className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary/20 transition-all">
                    <Eye size={14} />
                  </button>
                </div>
              </div>
              <Button className="w-full rounded-2xl h-11 font-black text-[11px] uppercase tracking-[0.15em]">
                Generate New Key
              </Button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
