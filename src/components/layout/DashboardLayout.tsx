'use client';

import React from 'react';
import { LayoutProvider } from '@/contexts/LayoutContext';
import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <LayoutProvider>
      <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
          <TopNavbar />

          {/* Main Scrolling Container */}
          <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-muted p-4 lg:p-8 transition-all duration-300 no-scrollbar">
            <div className="max-w-[1600px] w-full mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </LayoutProvider>
  );
}
