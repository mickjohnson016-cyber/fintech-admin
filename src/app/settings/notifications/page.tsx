'use client';

import React, { useState } from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  Bell, 
  Mail, 
  MessageSquare, 
  Smartphone, 
  Clock, 
  History, 
  Settings2, 
  Eye, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Plus,
  Trash2,
  Send,
  MoreVertical,
  X
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';

interface Template {
  id: string;
  name: string;
  trigger: string;
  channels: ('email' | 'sms' | 'push')[];
}

export default function Notifications() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [activeLogs, setActiveLogs] = useState<any[]>([]);

  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Notification & Template Engine" 
        description="Manage automated system communications, delivery channels, and message templates."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Channel Controls */}
          <SettingsCard 
            title="Communication Channels" 
            description="Toggle and configure global delivery vectors for system alerts."
            icon={Zap}
          >
            <div className="space-y-6">
               {[
                 { label: "Email Gateway", desc: "Dispatch receipts and security alerts via SMTP/SendGrid.", icon: Mail },
                 { label: "SMS Gateway", desc: "Send OTPs and critical alerts via Twilio/Termii.", icon: MessageSquare },
                 { label: "Push Notifications", desc: "Mobile app engagement via Firebase Cloud Messaging.", icon: Smartphone },
               ].map((channel, i) => (
                 <SettingsField key={i} label={channel.label} description={channel.desc} icon={channel.icon}>
                   <Switch />
                 </SettingsField>
               ))}
            </div>
          </SettingsCard>

          {/* Template Management */}
          <SettingsCard 
            title="Message Templates" 
            description="Pre-configured content for automated system triggers."
            icon={Settings2}
          >
             <div className="space-y-4">
                {templates.length > 0 ? (
                  templates.map((template) => (
                    <div key={template.id} className="p-4 bg-secondary/10 border border-border/5 rounded-2xl flex items-center justify-between group">
                       <div className="flex items-center gap-4">
                          <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-primary">
                             <Settings2 size={20} />
                          </div>
                          <div>
                             <p className="text-[13px] font-black text-foreground">{template.name}</p>
                             <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{template.trigger}</p>
                          </div>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="flex -space-x-1">
                             {template.channels.map((ch) => (
                                <div key={ch} className="size-6 rounded-full bg-secondary border border-background flex items-center justify-center text-muted-foreground">
                                   {ch === 'email' ? <Mail size={12} /> : ch === 'sms' ? <MessageSquare size={12} /> : <Smartphone size={12} />}
                                </div>
                             ))}
                          </div>
                          <button className="p-2 text-muted-foreground hover:text-primary transition-all opacity-0 group-hover:opacity-100">
                             <MoreVertical size={16} />
                          </button>
                       </div>
                    </div>
                  ))
                ) : (
                  <div className="py-20 text-center border-2 border-dashed border-border/10 rounded-[40px]">
                     <div className="size-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6 text-muted-foreground/20">
                        <Bell size={32} />
                     </div>
                     <h4 className="text-[14px] font-black text-foreground uppercase tracking-widest">No templates defined</h4>
                     <p className="text-[12px] font-medium text-muted-foreground mt-2 max-w-xs mx-auto">Create communication templates to automate platform triggers.</p>
                     <Button variant="outline" className="mt-8 h-11 px-8 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40">Add New Template</Button>
                  </div>
                )}
             </div>
          </SettingsCard>
        </div>

        <div className="space-y-8">
           {/* Delivery Health */}
           <div className="p-8 bg-card border border-border/40 rounded-[40px] space-y-8 shadow-sm">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-2xl bg-secondary flex items-center justify-center text-muted-foreground">
                    <Send size={20} />
                 </div>
                 <h3 className="text-[14px] font-black uppercase tracking-widest">Delivery Health</h3>
              </div>
              
              <div className="space-y-6">
                 {[
                   { label: "Delivery Rate", value: "0%", trend: "0%", color: "text-muted-foreground" },
                   { label: "Bounce Rate", value: "0%", trend: "0%", color: "text-muted-foreground" },
                   { label: "Total Sent", value: "0", trend: "0%", color: "text-muted-foreground" },
                 ].map((stat, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <div className="space-y-1">
                         <p className="text-[11px] font-bold text-muted-foreground">{stat.label}</p>
                         <p className="text-xl font-black text-foreground">{stat.value}</p>
                      </div>
                      <div className={cn("text-[10px] font-black", stat.color)}>{stat.trend}</div>
                   </div>
                 ))}
              </div>

              <Button className="w-full h-11 rounded-xl bg-primary text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">Delivery Report</Button>
           </div>

           {/* Recent Dispatch Logs */}
           <SettingsCard title="Dispatch History" icon={History}>
              <div className="space-y-4">
                 {activeLogs.length > 0 ? (
                    activeLogs.map((log, i) => (
                       <div key={i} className="flex items-start gap-3">
                          <div className="size-2 rounded-full bg-primary mt-1.5" />
                          <div className="space-y-0.5">
                             <p className="text-[11px] font-black text-foreground">{log.template}</p>
                             <p className="text-[9px] font-medium text-muted-foreground uppercase">{log.recipient} • {log.time}</p>
                          </div>
                       </div>
                    ))
                 ) : (
                    <div className="py-10 text-center opacity-30">
                       <Clock size={32} className="mx-auto mb-2" />
                       <p className="text-[9px] font-black uppercase tracking-widest">No recent dispatches</p>
                    </div>
                 )}
                 <button className="w-full text-[9px] font-black uppercase text-primary tracking-widest pt-4 border-t border-border/5 hover:underline text-center">Open Logs Terminal</button>
              </div>
           </SettingsCard>
        </div>
      </div>
    </div>
  );
}
