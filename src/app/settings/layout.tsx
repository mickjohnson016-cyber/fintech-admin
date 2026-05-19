'use client';

import React, { useEffect } from 'react';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import { motion, AnimatePresence } from 'framer-motion';
import Breadcrumbs from '@/components/layout/Breadcrumbs';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && (!user || user.role !== 'super_admin')) {
      router.replace('/dashboard');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <p className="text-sm font-bold text-muted-foreground tracking-widest uppercase animate-pulse">Verifying Authorization...</p>
      </div>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="w-full min-h-screen pb-20">
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 relative">
        {/* Left Side: Sticky Navigation */}
        <SettingsSidebar />

        {/* Right Side: Dynamic Content */}
        <main className="flex-1 min-w-0">
          <Breadcrumbs className="mb-6" />
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
