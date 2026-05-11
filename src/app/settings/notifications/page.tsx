'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  ShieldAlert, 
  Activity, 
  Lock as LockIcon, 
  Eye, 
  Search,
  Settings2,
  ChevronRight,
  Send,
  Clock,
  CheckCircle2,
  Zap,
  Globe
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function NotificationSettings() {
  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Notifications" 
        description="Configure how the platform communicates with admins and users across different channels."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Channel Management */}
          <SettingsCard 
            title="Notification Channels" 
            description="Enable or disable global communication delivery methods."
            icon={Globe}
          >
            <div className="space-y-2">
              <SettingsField 
                label="Email Delivery (SMTP/SendGrid)" 
                description="Primary channel for official communication and transaction receipts."
                icon={Mail}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="SMS Gateway (Twilio/Termii)" 
                description="Used for high-priority alerts and 2FA codes."
                icon={MessageSquare}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="Mobile Push (FCM/OneSignal)" 
                description="Real-time app notifications for transaction updates."
                icon={Smartphone}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="System Webhooks" 
                description="Stream events to external monitoring services."
                icon={Zap}
              >
                <Switch defaultChecked={false} />
              </SettingsField>
            </div>
          </SettingsCard>

          {/* Admin Alerts */}
          <SettingsCard 
            title="Administrative Alerts" 
            description="Configure which events trigger notifications for the admin team."
            icon={ShieldAlert}
          >
            <div className="space-y-6">
              <div className="space-y-2">
                <h4 className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4">Security Events</h4>
                <SettingsField label="Suspicious Login Attempt" icon={LockIcon}>
                  <div className="flex gap-4">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Mail size={12} /> Email</span>
                    <Switch defaultChecked={true} />
                  </div>
                </SettingsField>
                <SettingsField label="Admin Permission Change" icon={Settings2}>
                  <div className="flex gap-4">
                    <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Mail size={12} /> Email</span>
                    <Switch defaultChecked={true} />
                  </div>
                </SettingsField>
              </div>

              <div className="space-y-2 pt-6 border-t border-border/10">
                <h4 className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-4">Operational Events</h4>
                <SettingsField label="Provider Connectivity Drop" icon={Activity}>
                  <div className="flex gap-4">
                     <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Smartphone size={12} /> SMS</span>
                     <Switch defaultChecked={true} />
                  </div>
                </SettingsField>
                <SettingsField label="High-Value Transaction Flag" icon={Zap}>
                   <div className="flex gap-4">
                     <span className="text-[11px] font-bold text-muted-foreground uppercase flex items-center gap-1.5"><Smartphone size={12} /> SMS</span>
                     <Switch defaultChecked={true} />
                  </div>
                </SettingsField>
              </div>
            </div>
          </SettingsCard>

          {/* Notification Templates */}
          <SettingsCard 
            title="Communication Templates" 
            description="Manage the content and design of automated system messages."
            icon={Send}
          >
            <div className="space-y-4">
              {[
                { name: "Welcome Email", type: "Email", lastEdited: "2d ago" },
                { name: "Transaction OTP", type: "SMS", lastEdited: "14d ago" },
                { name: "Investment Maturation", type: "Push", lastEdited: "1m ago" },
                { name: "KYC Rejection", type: "Email", lastEdited: "5d ago" },
              ].map((template, i) => (
                <div key={i} className="p-5 bg-secondary/30 border border-border/10 rounded-[28px] flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-background border border-border/40 rounded-2xl text-muted-foreground group-hover:text-primary transition-colors">
                      <Mail size={16} />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[14px] font-black text-foreground">{template.name}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase">{template.type} • Last edited {template.lastEdited}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="p-2.5 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-primary transition-all">
                      <Eye size={16} />
                    </button>
                    <button className="p-2.5 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-primary transition-all">
                      <Settings2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                View All Templates
              </Button>
            </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Real-time Preview Widget */}
          <div className="p-8 bg-card border border-border/40 rounded-[32px] space-y-6 shadow-xl shadow-black/5 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-5">
              <Smartphone size={100} className="text-primary" />
            </div>
            
            <div className="space-y-2 relative z-10">
              <p className="text-[10px] font-black uppercase tracking-widest text-primary">Live Preview</p>
              <h3 className="text-2xl font-black text-foreground tracking-tighter">Mobile Push</h3>
            </div>

            <div className="bg-secondary/40 border border-border/20 rounded-3xl p-5 relative z-10">
               <div className="flex items-center gap-3 mb-3">
                  <div className="size-8 bg-primary rounded-xl flex items-center justify-center text-white font-black text-[10px]">OINZ</div>
                  <div className="flex-1">
                    <p className="text-[11px] font-black text-foreground">OINZpay Admin</p>
                    <p className="text-[9px] font-medium text-muted-foreground">Just now</p>
                  </div>
               </div>
               <div className="space-y-1">
                 <p className="text-[13px] font-black text-foreground tracking-tight">Security Alert: Blocked Login</p>
                 <p className="text-[11px] font-medium text-muted-foreground leading-snug">
                   An unusual login attempt from 102.89.2.44 was blocked. Review security logs.
                 </p>
               </div>
            </div>

            <Button className="w-full h-11 rounded-2xl font-black text-[11px] uppercase tracking-widest bg-primary text-white">
              Send Test Notification
            </Button>
          </div>

          {/* Delivery Stats */}
          <SettingsCard 
            title="Delivery Performance" 
            description="Success rates for all channels."
            icon={Activity}
          >
            <div className="space-y-6">
              {[
                { label: "Email Success", rate: "99.2%", status: "Healthy" },
                { label: "SMS Delivery", rate: "94.5%", status: "Degraded" },
                { label: "Push Delivery", rate: "99.9%", status: "Healthy" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider">
                    <span className="text-muted-foreground">{stat.label}</span>
                    <span className={cn(
                      "font-black",
                      stat.status === "Healthy" ? "text-emerald-500" : "text-amber-500"
                    )}>{stat.rate}</span>
                  </div>
                  <div className="h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full",
                        stat.status === "Healthy" ? "bg-primary" : "bg-amber-500"
                      )} 
                      style={{ width: stat.rate }} 
                    />
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>

          {/* Quiet Hours */}
          <SettingsCard 
            title="Maintenance Mode" 
            description="Global suppression of non-critical alerts."
            icon={Clock}
          >
            <div className="space-y-4">
              <SettingsField label="Admin Quiet Hours" description="Silence all non-emergency alerts from 11 PM to 6 AM.">
                <Switch defaultChecked={false} />
              </SettingsField>
              <Button variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40">
                Configure Schedule
              </Button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
