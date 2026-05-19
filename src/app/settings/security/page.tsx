'use client';

import React, { useState, useEffect } from'react';
import { motion } from'framer-motion';
import SettingsHeader from'@/components/settings/SettingsHeader';
import SettingsCard from'@/components/settings/SettingsCard';
import SettingsField from'@/components/settings/SettingsField';
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
 Clock,
 Plus,
 Trash2,
 CheckCircle2,
 X,
 Loader2
} from'lucide-react';
import { Switch } from"@/components/ui/switch";
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { toast } from'sonner';
import { QuickActionModal } from'@/components/ui/QuickActionModal';

interface Session {
 id: string;
 device: string;
 location: string;
 ip: string;
 current: boolean;
 icon: any;
}

export default function SecurityCenter() {
 const [sessions, setSessions] = useState<Session[]>([
 { id:'sess_current', device:'Current Session • Browser', location:'Unknown Location', ip:'0.0.0.0', current: true, icon: Monitor },
 ]);

 const [whitelistedIPs, setWhitelistedIPs] = useState<any[]>([]);

 const [isIPModalOpen, setIsIPModalOpen] = useState(false);
 const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
 const [selectedSession, setSelectedSession] = useState<Session | null>(null);
 const [securityScore, setSecurityScore] = useState(0);
 const safeScore = Number(securityScore) || 0;

 const [isAnalyzing, setIsAnalyzing] = useState(false);

 const handleAnalyze = () => {
 setIsAnalyzing(true);
 toast.loading('Scanning platform perimeters...', { id: 'vuln-scan' });
 
 setTimeout(() => {
 setIsAnalyzing(false);
 setSecurityScore(84);
 toast.success('Analysis Complete', { 
 id: 'vuln-scan', 
 description: '84% resilience score achieved. Identified 2 minor configuration drift items.' 
 });
 }, 3000);
 };

 const handleRevokeSession = () => {
 if (!selectedSession) return;
 setSessions(prev => prev.filter(s => s.id !== selectedSession.id));
 setIsRevokeModalOpen(false);
 setSelectedSession(null);
 toast.success('Session Revoked');
 };

 const handleRevokeAllOthers = () => {
 toast.promise(new Promise(r => setTimeout(r, 1000)), {
 loading:'Terminating other sessions...',
 success: () => {
 setSessions(prev => prev.filter(s => s.current));
 return'Cleanup Complete';
 },
 error:'Failed to terminate sessions'
 });
 };

 return (
 <div className="space-y-10">
 <SettingsHeader 
 title="Security & Governance" 
 description=""
 />
 <div className="max-w-4xl space-y-8">
 {/* Active Sessions */}
 <SettingsCard 
 title="Authenticated Sessions" 
 description=""
 icon={Monitor}
 >
 <div className="space-y-3">
 {sessions.map((session) => (
 <div key={session.id} className="flex items-center justify-between p-4 bg-secondary/10 border border-border/5 rounded-2xl group hover:border-primary/20 transition-all">
 <div className="flex items-center gap-4">
 <div className="size-10 rounded-xl bg-background border border-border flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
 <session.icon size={20} />
 </div>
 <div>
 <div className="flex items-center gap-2">
 <p className="text-[13px] font-black text-foreground">{session.device}</p>
 {session.current && (
 <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 text-[8px] font-black uppercase tracking-widest border border-emerald-500/20">Current</span>
 )}
 </div>
 <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground uppercase tracking-widest mt-0.5">
 <MapPin size={10} /> {session.location}
 <span className="size-1 bg-muted-foreground/30 rounded-full" />
 <Globe size={10} /> {session.ip}
 </div>
 </div>
 </div>
 {!session.current && (
 <button 
 onClick={() => { setSelectedSession(session); setIsRevokeModalOpen(true); }}
 className="p-2 text-muted-foreground hover:text-rose-500 transition-colors"
 >
 <LogOut size={18} />
 </button>
 )}
 </div>
 ))}
 <div className="pt-4 flex justify-end">
 <Button onClick={handleRevokeAllOthers} variant="ghost" className="text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/5">Terminate All Other Sessions</Button>
 </div>
 </div>
 </SettingsCard>

 {/* Network Perimeter */}
 <SettingsCard 
 title="Network Perimeter Control" 
 description=""
 icon={Globe}
 >
 <div className="space-y-4">
 {whitelistedIPs.length > 0 ? (
 whitelistedIPs.map((ip) => (
 <div key={ip.id} className="flex items-center justify-between p-4 bg-secondary/10 border border-border/5 rounded-2xl">
 <div>
 <p className="text-[13px] font-black text-foreground">{ip.address}</p>
 <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{ip.label}</p>
 </div>
 <button onClick={() => setWhitelistedIPs(prev => prev.filter(i => i.id !== ip.id))} className="text-muted-foreground hover:text-rose-500 transition-colors">
 <Trash2 size={16} />
 </button>
 </div>
 ))
 ) : (
 <div className="py-12 text-center border-2 border-dashed border-border/10 rounded-[32px]">
 <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">No IP restrictions configured</p>
 <p className="text-[11px] font-medium text-muted-foreground mt-2">Platform is currently accessible from all network vectors.</p>
 </div>
 )}
 <Button onClick={() => setIsIPModalOpen(true)} variant="outline" className="w-full h-12 rounded-xl font-black text-[10px] uppercase tracking-widest border-border/40 gap-2">
 <Plus size={16} /> Add Whitelisted IP
 </Button>
 </div>
 </SettingsCard>
 </div>

 <QuickActionModal
 isOpen={isRevokeModalOpen}
 onClose={() => setIsRevokeModalOpen(false)}
 onConfirm={handleRevokeSession}
 title="Revoke Session"
 description=""
 icon={LogOut}
 type="danger"
 confirmLabel="Terminate Session"
 />

 <QuickActionModal
 isOpen={isIPModalOpen}
 onClose={() => setIsIPModalOpen(false)}
 onConfirm={() => setIsIPModalOpen(false)}
 title="Add Whitelisted IP"
 description=""
 icon={Globe}
 confirmLabel="Authorize Address"
 >
 <div className="space-y-4">
 <input placeholder="0.0.0.0/0" className="w-full bg-secondary/50 border border-border/20 rounded-xl p-4 text-[13px] font-bold outline-none" />
 <input placeholder="Label (e.g. Head Office)" className="w-full bg-secondary/50 border border-border/20 rounded-xl p-4 text-[13px] font-bold outline-none" />
 </div>
 </QuickActionModal>
 </div>
 );
}
