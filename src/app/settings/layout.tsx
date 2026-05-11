'use client';

import React from 'react';
import SettingsSidebar from '@/components/settings/SettingsSidebar';
import { motion, AnimatePresence } from 'framer-motion';

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full min-h-screen pb-20">
      <div className="flex flex-col lg:flex-row gap-12 relative">
        {/* Left Side: Sticky Navigation */}
        <SettingsSidebar />

        {/* Right Side: Dynamic Content */}
        <main className="flex-1 min-w-0">
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
