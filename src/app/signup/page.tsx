'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { signup } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password.trim()) {
      setError('Please fill in all the required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setIsSigningUp(true);

    try {
      await signup(email.trim(), password);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
      setIsSigningUp(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 w-full bg-white relative overflow-hidden">
      {/* Subtle Micro-pattern background */}
      <div className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-[360px] relative z-10"
      >
        {/* Minimal OINZPAY Title */}
        <div className="text-center mb-10">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">OINZPAY</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">Register Administrator</p>
        </div>

        {/* Minimal Registration Card */}
        <div className="bg-white border border-slate-100 rounded-[28px] p-8 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.04)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div className="space-y-1.5">
                <input
                  type="email"
                  value={email}
                  disabled={isSigningUp}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email Address"
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-50"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="space-y-1.5 relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled={isSigningUp}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl pl-4 pr-10 text-xs font-bold outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-50"
                  required
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isSigningUp}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 size-5 flex items-center justify-center text-slate-400 hover:text-slate-600 focus:outline-none transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>

              {/* Confirm Password Input */}
              <div className="space-y-1.5">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  disabled={isSigningUp}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="w-full h-12 bg-slate-50 border border-slate-100 rounded-xl px-4 text-xs font-bold outline-none focus:bg-white focus:border-primary/40 focus:ring-4 focus:ring-primary/5 transition-all disabled:opacity-50"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-[10px] font-bold text-rose-500 text-center leading-tight bg-rose-50 border border-rose-100/50 rounded-xl p-3">
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Sign Up Button */}
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center text-[10px] font-black uppercase tracking-wider transition-all hover:bg-slate-850 active:scale-[0.98] disabled:opacity-80 disabled:cursor-not-allowed"
            >
              {isSigningUp ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Registering...</span>
                </div>
              ) : (
                <span>Register</span>
              )}
            </button>
          </form>
        </div>

        {/* Minimal Login Switcher */}
        <div className="text-center mt-6">
          <Link href="/login" className="text-[10px] font-bold text-slate-400 hover:text-slate-650 transition-colors">
            Already have an account? Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
