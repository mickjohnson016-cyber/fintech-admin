'use client';

import React from'react';
import SettingsHeader from'@/components/settings/SettingsHeader';
import SettingsCard from'@/components/settings/SettingsCard';
import SettingsField from'@/components/settings/SettingsField';
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
} from'lucide-react';
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { useState, useRef, useEffect } from'react';
import { useBranding } from'@/context/BrandingContext';
import { toast } from'sonner';
import { DepartmentModal, JurisdictionModal } from'@/components/settings/OrgModals';

export default function OrganizationSettings() {
 const { logo, updateLogo, resetLogo, isDefault } = useBranding();
 const fileInputRef = useRef<HTMLInputElement>(null);
 
 // Modal states
 const [isDeptModalOpen, setIsDeptModalOpen] = useState(false);
 const [isJurisModalOpen, setIsJurisModalOpen] = useState(false);

 const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
 const file = event.target.files?.[0];
 if (file) {
 if (file.size > 2 * 1024 * 1024) {
 toast.error('Upload Error', {
 description:'Logo file size exceeds 2MB limit.'
 });
 return;
 }

 const reader = new FileReader();
 reader.onloadend = () => {
 const base64String = reader.result as string;
 updateLogo(base64String);
 };
 reader.readAsDataURL(file);
 }
 };

 const triggerFileUpload = () => {
 fileInputRef.current?.click();
 };

 return (
 <div className="space-y-10">
 <SettingsHeader 
 title="Organization Settings" 
 description=""
 />

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 <div className="xl:col-span-2 space-y-8">
 {/* Profile Section */}
 <SettingsCard 
 title="Entity Profile" 
 description=""
 icon={Building2}
 >
 <div className="space-y-8">
 <div className="flex flex-col sm:flex-row gap-10 items-start sm:items-center p-8 bg-secondary/20 border border-border/20 rounded-[32px] relative overflow-hidden group">
 <div className="absolute top-0 right-0 p-8 opacity-5 -rotate-12 group-hover:rotate-0 transition-transform duration-700">
 <Building2 size={120} />
 </div>
 
 <input 
 type="file" 
 ref={fileInputRef} 
 onChange={handleLogoUpload} 
 accept="image/png, image/jpeg, image/svg+xml, image/webp" 
 className="hidden" 
 />
 
 <div className="flex flex-col items-center gap-4 shrink-0 relative z-10">
 <div 
 onClick={triggerFileUpload} 
 className={cn(
"size-32 rounded-[32px] border-2 border-dashed flex flex-col items-center justify-center group/logo cursor-pointer transition-all overflow-hidden relative shadow-inner",
 !isDefault 
 ?"border-primary/20 bg-card" 
 :"bg-primary/5 border-primary/20 text-primary hover:bg-primary/10"
 )}
 >
 {!isDefault ? (
 <>
 <img src={logo} alt="Org Logo" className="size-full object-cover transition-transform duration-500 group-hover/logo:scale-110" />
 <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/logo:opacity-100 transition-opacity flex items-center justify-center">
 <Plus size={24} className="text-white" />
 </div>
 </>
 ) : (
 <div className="flex flex-col items-center gap-2">
 <Plus size={28} />
 <span className="text-[10px] font-black uppercase tracking-[0.2em]">Upload</span>
 </div>
 )}
 </div>
 
 {!isDefault && (
 <button 
 onClick={(e) => { e.stopPropagation(); resetLogo(); }}
 className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline"
 >
 Reset Branding
 </button>
 )}
 </div>

 <div className="space-y-6 flex-1 w-full relative z-10">
 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Entity Name</label>
 <input 
 type="text" 
 defaultValue="OINZpay Financial Services Ltd."
 className="w-full bg-background border border-border/40 rounded-2xl px-5 py-3 text-[14px] font-black outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
 />
 </div>
 <div className="space-y-2">
 <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registration (RC)</label>
 <input 
 type="text" 
 defaultValue="RC-1920391"
 className="w-full bg-background border border-border/40 rounded-2xl px-5 py-3 text-[14px] font-black outline-none focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
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
 className="w-full sm:w-64 bg-secondary/50 border border-border/40 rounded-xl px-4 py-2 text-[12px] font-bold outline-none focus:border-primary/40 transition-all text-left sm:text-right"
 />
 </SettingsField>
 <SettingsField label="Support Email" icon={Mail}>
 <input 
 type="text" 
 defaultValue="ops@oinzpay.com"
 className="w-full sm:w-64 bg-secondary/50 border border-border/40 rounded-xl px-4 py-2 text-[12px] font-bold outline-none focus:border-primary/40 transition-all text-left sm:text-right"
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
 description=""
 icon={ShieldCheck}
 >
 <div className="space-y-4">
 {([] as any[]).map((license: any, i: number) => (
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
 <button onClick={() => toast.success('License Verification', { description:`Verifying regulatory standing for ${license.name} with external authority...` })} className="p-2.5 bg-background border border-border/40 rounded-xl text-muted-foreground hover:text-primary transition-all">
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
 {([] as any[]).map((market: any, i: number) => (
 <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/10 rounded-2xl">
 <div className="flex items-center gap-3">
 <Globe size={16} className="text-muted-foreground" />
 <span className="text-[12px] font-black text-foreground">{market.country}</span>
 </div>
 <span className="text-[10px] font-bold text-muted-foreground uppercase">{market.status}</span>
 </div>
 ))}
 </div>
 
 <Button onClick={() => setIsJurisModalOpen(true)} variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40">
 Manage Jurisdictions
 </Button>
 </div>

 {/* Department Structure */}
 <SettingsCard 
 title="Departmental Hierarchy" 
 description=""
 icon={Briefcase}
 >
 <div className="space-y-3">
 {([] as any[]).map((dept: any, i: number) => (
 <div key={i} className="flex items-center justify-between p-4 bg-secondary/30 border border-border/10 rounded-2xl group cursor-pointer hover:bg-secondary/50 transition-all">
 <span className="text-[12px] font-black text-foreground">{dept.name}</span>
 <div className="flex items-center gap-2">
 <span className="text-[11px] font-bold text-muted-foreground">{dept.members}</span>
 <ChevronRight size={14} className="text-muted-foreground/30" />
 </div>
 </div>
 ))}
 <Button onClick={() => setIsDeptModalOpen(true)} variant="ghost" className="w-full text-[11px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary">
 Manage Departments
 </Button>
 </div>
 </SettingsCard>
 </div>
 </div>

 <DepartmentModal 
 isOpen={isDeptModalOpen} 
 onClose={() => setIsDeptModalOpen(false)} 
 />
 
 <JurisdictionModal 
 isOpen={isJurisModalOpen} 
 onClose={() => setIsJurisModalOpen(false)} 
 />
 </div>
 );
}
