
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, ArrowRight, Loader2, Key, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function LoginPage() {
  const [name, setName] = useState('');
  const [accessKey, setAccessKey] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAuthenticating(true);

    // temporary development auth bypass
    const mockUser = {
      id: 'dev-admin',
      name: name || 'Development Admin',
      role: 'Super Admin',
      accessKeyId: 'KEY-DEV',
      lastLogin: new Date().toISOString(),
      status: 'Active'
    };

    const sessionToken = btoa(JSON.stringify({ ...mockUser, expiry: Date.now() + 1000 * 60 * 60 * 24 * 365 }));
    localStorage.setItem('oinz_admin_session', sessionToken);

    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 w-full bg-white selection:bg-primary/10">
      {/* Background Micro-patterns */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[400px] relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">OINZpay</h1>
          <div className="mt-2 flex flex-col items-center gap-1">
            <h2 className="text-[14px] font-black text-slate-800">Secure Admin Access</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Authorized Personnel Only</p>
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-white border border-slate-100 rounded-[32px] p-8 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.06)]">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter legal name"
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all"
                  />
                </div>
              </div>

              {/* Access Key Field */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Access Key</label>
                <div className="relative group">
                  <Key className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    type="password"
                    value={accessKey}
                    onChange={(e) => setAccessKey(e.target.value)}
                    placeholder="OINZ-ADM-••••-••••"
                    className="w-full h-14 bg-slate-50 border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-bold font-mono outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all tracking-[0.2em]"
                  />
                </div>
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-start gap-3"
                >
                  <ShieldCheck className="size-4 text-rose-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] font-bold text-rose-600 leading-tight">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button 
              type="submit"
              disabled={isAuthenticating}
              className={cn(
                "w-full h-14 rounded-2xl bg-slate-900 text-white flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden",
                isAuthenticating ? "opacity-90" : "hover:bg-primary active:scale-[0.98]"
              )}
            >
              {isAuthenticating ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="size-5 animate-spin" />
                  <span className="text-[11px] font-black uppercase tracking-widest">Verifying Identity</span>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-[11px] font-black uppercase tracking-widest">Access Dashboard</span>
                  <ArrowRight size={16} />
                </div>
              )}
            </button>
          </form>

          {/* Security Footer */}
          <div className="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 rounded-full border border-slate-100">
              <ShieldCheck size={12} className="text-emerald-500" />
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">Enterprise Grade Encryption</span>
            </div>
            <p className="text-[9px] font-medium text-slate-300 text-center max-w-[240px]">
              Access attempts are logged and monitored by our Global Security Operations Center.
            </p>
          </div>
        </div>

        {/* Support Link */}
        <p className="text-center mt-8 text-[11px] font-bold text-slate-400">
          Lost your access key? <button className="text-primary hover:underline">Contact System Admin</button>
        </p>
      </motion.div>
    </div>
  );
}
