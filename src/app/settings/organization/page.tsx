'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  Building2, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  BadgeCheck, 
  History,
  FileText,
  ChevronRight,
  Plus,
  ExternalLink,
  Briefcase
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function OrganizationSettings() {
  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Organization Settings" 
        description="Manage your enterprise profile, regulatory registrations, and global contact information."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Profile Section */}
          <SettingsCard 
            title="Entity Profile" 
            description="Official corporate information used for platform identity and legal documentation."
            icon={Building2}
          >
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-8 items-start sm:items-center p-6 bg-secondary/30 border border-border/20 rounded-[32px]">
                <div onClick={() => toastActions.showActionToast('Logo Upload', 'Opening secure media library for corporate branding assets...')} className="size-24 rounded-[28px] bg-primary/10 border-2 border-dashed border-primary/30 flex items-center justify-center text-primary group cursor-pointer hover:bg-primary/20 transition-all">
                   <div className="flex flex-col items-center gap-1">
                     <Plus size={24} />
                     <span className="text-[10px] font-black uppercase">Logo</span>
                   </div>
                </div>
                <div className="space-y-4 flex-1 w-full">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Entity Name</label>
                      <input 
                        type="text" 
                        defaultValue="OINZpay Financial Services Ltd."
                        className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 text-[14px] font-black outline-none focus:border-primary/40 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registration Number (RC)</label>
                      <input 
                        type="text" 
                        defaultValue="RC-1920391"
                        className="w-full bg-background border border-border/40 rounded-xl px-4 py-2.5 text-[14px] font-black outline-none focus:border-primary/40 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <SettingsField label="Official Website" icon={Globe}>
                  <input 
                    type="text" 
                    defaultValue="https://oinzpay.com"
                    className="w-64 bg-secondary/50 border border-border/40 rounded-xl px-4 py-2 text-[12px] font-bold outline-none focus:border-primary/40 transition-all"
                  />
                </SettingsField>
                <SettingsField label="Support Email" icon={Mail}>
                  <input 
                    type="text" 
                    defaultValue="ops@oinzpay.com"
                    className="w-64 bg-secondary/50 border border-border/40 rounded-xl px-4 py-2 text-[12px] font-bold outline-none focus:border-primary/40 transition-all"
                  />
                </SettingsField>
                <SettingsField label="Headquarters" icon={MapPin}>
                  <p className="text-[12px] font-bold text-foreground text-right">Lekki Phase 1, Lagos, Nigeria</p>
                </SettingsField>
              </div>
            </div>
          </SettingsCard>

          {/* Regulatory & Compliance */}
          <SettingsCard 
            title="Regulatory Licenses" 
            description="Manage your fintech licenses and regulatory standings."
            icon={ShieldCheck}
          >
            <div className="space-y-4">
              {[
                { name: "CBN PSSP License", id: "PSSP/2024/001", status: "Active", expiry: "Dec 2026", icon: BadgeCheck },
                { name: "NDPR Compliance", id: "DATA-1120-X", status: "Verified", expiry: "Aug 2026", icon: ShieldCheck },
                { name: "PCI DSS v4.0", id: "PCI-9921", status: "Active", expiry: "Nov 2026", icon: FileText },
              ].map((license, i) => (
                <div key={i} className="p-5 bg-secondary/30 border border-border/20 rounded-[28px] flex items-center justify-between group hover:border-primary/30 transition-all">
                  <div className="flex items-center gap-5">
                    <div className="p-3 bg-background border border-border/40 rounded-2xl text-primary">
                      <license.icon size={20} />
                    </div>
                    <div className="space-y-1">
                      <h5 className="text-[14px] font-black text-foreground">{license.name}</h5>
                      <p className="text-[11px] font-bold text-muted-foreground uppercase">{license.id} • Valid until {license.expiry}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                     <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 text-[10px] font-black uppercase rounded-full">{license.status}</span>
                     <button onClick={() => toastActions.showActionToast('License Verification', `Verifying regulatory standing for ${license.name} with external authority...`)} className="p-2.5 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-primary transition-all">
                        <ExternalLink size={16} />
                     </button>
                  </div>
                </div>
              ))}
            </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Operational Jurisdictions */}
          <div className="p-8 bg-card border border-border/40 rounded-[32px] space-y-6 shadow-xl shadow-black/5">
             <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Global Presence</p>
                <h3 className="text-2xl font-black text-foreground tracking-tighter">Active Markets</h3>
             </div>
             
             <div className="space-y-4">
                {[
                  { country: "Nigeria", status: "Primary", nodes: 4 },
                  { country: "Kenya", status: "Active", nodes: 2 },
                  { country: "Ghana", status: "Active", nodes: 2 },
                  { country: "UK", status: "Settlement Only", nodes: 1 },
                ].map((market, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/10 rounded-2xl">
                    <div className="flex items-center gap-3">
                       <Globe size={16} className="text-muted-foreground" />
                       <span className="text-[12px] font-black text-foreground">{market.country}</span>
                    </div>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{market.status}</span>
                  </div>
                ))}
             </div>
             
             <Button onClick={() => toastActions.showActionToast('Jurisdiction Manager', 'Opening global expansion and regional compliance panel...')} variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40">
                Manage Jurisdictions
             </Button>
          </div>

          {/* Department Structure */}
          <SettingsCard 
            title="Departmental Hierarchy" 
            description="Manage organizational units."
            icon={Briefcase}
          >
            <div className="space-y-3">
               {[
                 { name: "Treasury & Finance", members: 12 },
                 { name: "Risk & Compliance", members: 8 },
                 { name: "Engineering & SRE", members: 24 },
                 { name: "Customer Experience", members: 45 },
               ].map((dept, i) => (
                 <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/10 rounded-2xl group cursor-pointer hover:bg-secondary/50 transition-all">
                    <span className="text-[12px] font-black text-foreground">{dept.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-muted-foreground">{dept.members}</span>
                      <ChevronRight size={14} className="text-muted-foreground/30" />
                    </div>
                 </div>
               ))}
               <Button onClick={() => toastActions.showActionToast('Departmental Controls', 'Opening organogram and staff allocation management...')} variant="ghost" className="w-full text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
                 Manage Departments
               </Button>
            </div>
          </SettingsCard>
        </div>
      </div>
    </div>
  );
}
