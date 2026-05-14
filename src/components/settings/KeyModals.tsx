
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShieldCheck, Key, User, Copy, CheckCircle2, AlertTriangle, ShieldAlert, Eye, EyeOff, RotateCcw, Ban, Clock } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from 'sonner';
import { UserRole, AccessKey } from '@/types/auth';
import { keyManagementService } from '@/services/keyManagementService';

interface GenerateKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function GenerateKeyModal({ isOpen, onClose, onSuccess }: GenerateKeyModalProps) {
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('Operations Admin');
  const [expiry, setExpiry] = useState<string>('90');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState<AccessKey | null>(null);
  const [isKeyVisible, setIsKeyVisible] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsGenerating(true);
    try {
      const newKey = await keyManagementService.generateKey(name, role, expiry === 'Never' ? null : parseInt(expiry));
      setGeneratedKey(newKey);
      onSuccess();
    } catch (error) {
      toast.error('Generation Failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Key Copied Securely');
  };

  const handleClose = () => {
    setGeneratedKey(null);
    setName('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />
          <motion.div 
            initial={{ scale: 0.95, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            className={cn("bg-card border border-border w-full rounded-[40px] shadow-2xl overflow-hidden relative z-10 flex flex-col", generatedKey ? "max-w-md" : "max-w-lg")}
          >
            <div className="p-8 border-b border-border/10 flex items-center justify-between bg-secondary/5">
              <div className="flex items-center gap-4">
                <div className="size-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center border border-primary/20">
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-foreground">Authorization Engine</h3>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Initialize Secure Access Key</p>
                </div>
              </div>
              <button onClick={handleClose} className="p-3 hover:bg-secondary rounded-2xl transition-all">
                <X size={20} />
              </button>
            </div>

            <div className="p-10">
              {!generatedKey ? (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Admin Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input 
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="e.g. Michael Chen"
                          className="w-full h-14 bg-secondary/30 border border-border/40 rounded-2xl pl-12 pr-4 text-[13px] font-bold outline-none focus:bg-background focus:border-primary/40 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Assigned Role</label>
                        <select 
                          value={role}
                          onChange={(e) => setRole(e.target.value as UserRole)}
                          className="w-full h-14 bg-secondary/30 border border-border/40 rounded-2xl px-5 text-[12px] font-black uppercase outline-none focus:border-primary/40"
                        >
                          <option>Super Admin</option>
                          <option>Operations Admin</option>
                          <option>Compliance Admin</option>
                          <option>Finance Admin</option>
                          <option>Support Admin</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Expiration Policy</label>
                        <select 
                          value={expiry}
                          onChange={(e) => setExpiry(e.target.value)}
                          className="w-full h-14 bg-secondary/30 border border-border/40 rounded-2xl px-5 text-[12px] font-black uppercase outline-none focus:border-primary/40"
                        >
                          <option value="30">30 Days</option>
                          <option value="90">90 Days</option>
                          <option value="365">1 Year</option>
                          <option value="Never">Infinite Access</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 border border-amber-500/10 rounded-2xl p-4 flex gap-3">
                    <ShieldAlert size={16} className="text-amber-500 shrink-0" />
                    <p className="text-[11px] font-medium text-amber-600 leading-relaxed">
                      Generated keys are visible <span className="font-black">ONLY ONCE</span>. Ensure the key is stored in a secure hardware vault or password manager immediately.
                    </p>
                  </div>

                  <Button 
                    type="submit" 
                    disabled={isGenerating}
                    className="w-full h-14 rounded-2xl bg-primary text-white font-black uppercase text-[11px] tracking-widest shadow-xl shadow-primary/20 flex items-center justify-center gap-3"
                  >
                    {isGenerating ? <CheckCircle2 className="animate-pulse" size={18} /> : <Key size={18} />}
                    {isGenerating ? "Generating Secure Entropy..." : "Authorize New Access Key"}
                  </Button>
                </form>
              ) : (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div className="flex items-start justify-between border-b border-border/10 pb-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-500 border border-emerald-500/20">
                        <CheckCircle2 size={20} />
                      </div>
                      <div>
                        <h4 className="text-[14px] font-black text-foreground uppercase tracking-tight">Key Generated</h4>
                        <p className="text-[11px] font-medium text-muted-foreground">Provisioned for {generatedKey.assignedTo}</p>
                      </div>
                    </div>
                    <span className="px-2 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5">
                      <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Active Status
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-secondary/30 border border-border/40 rounded-xl p-4">
                      <div className="flex justify-between items-center mb-3">
                         <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Secret Access Key</span>
                      </div>
                      <div className="flex items-center justify-between bg-background border border-border/60 rounded-lg p-3">
                        <code className="text-[13px] font-black font-mono text-foreground tracking-widest">
                          {isKeyVisible ? generatedKey.fullKey : "OINZ-ADM-" + "•".repeat(20)}
                        </code>
                        <div className="flex gap-2">
                           <button onClick={() => setIsKeyVisible(!isKeyVisible)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 rounded-md border border-border/40 hover:bg-secondary">
                              {isKeyVisible ? <EyeOff size={14}/> : <Eye size={14}/>}
                           </button>
                           <button onClick={() => copyToClipboard(generatedKey.fullKey!)} className="p-1.5 text-muted-foreground hover:text-foreground transition-colors bg-secondary/50 rounded-md border border-border/40 hover:bg-secondary">
                              <Copy size={14}/>
                           </button>
                        </div>
                      </div>
                      <p className="text-[10px] text-muted-foreground mt-3 flex items-center gap-1.5 bg-amber-500/5 text-amber-600 p-2 rounded-lg border border-amber-500/10">
                        <ShieldAlert size={12} className="shrink-0"/> Please copy this key now. It will not be shown again.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-secondary/20 border border-border/30 rounded-xl p-3 flex items-center gap-3">
                          <User size={14} className="text-muted-foreground" />
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Assigned Role</p>
                            <p className="text-[11px] font-bold text-foreground">{generatedKey.role}</p>
                          </div>
                       </div>
                       <div className="bg-secondary/20 border border-border/30 rounded-xl p-3 flex items-center gap-3">
                          <Clock size={14} className="text-muted-foreground" />
                          <div>
                            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Expiration</p>
                            <p className="text-[11px] font-bold text-foreground">{generatedKey.expirationDate ? new Date(generatedKey.expirationDate).toLocaleDateString() : 'Never'}</p>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border/10">
                    <div className="flex gap-2">
                      <Button onClick={() => setGeneratedKey(null)} variant="outline" className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest border-border/40 hover:bg-secondary flex items-center gap-2 text-muted-foreground transition-all">
                         <RotateCcw size={14}/> Regenerate
                      </Button>
                      <Button onClick={async () => { await keyManagementService.revokeKey(generatedKey.id); toast.error('Key Revoked'); onSuccess(); handleClose(); }} variant="outline" className="h-9 px-4 rounded-lg text-[10px] font-black uppercase tracking-widest border-rose-500/20 text-rose-500 hover:bg-rose-500/10 flex items-center gap-2 transition-all">
                         <Ban size={14}/> Deactivate
                      </Button>
                    </div>
                    <Button onClick={handleClose} className="h-9 px-6 rounded-lg text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-foreground/90 transition-all shadow-md">
                      Done
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
