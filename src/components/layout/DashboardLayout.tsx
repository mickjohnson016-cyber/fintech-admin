'use client';

import React from'react';
import { usePathname } from'next/navigation';
import { LayoutProvider } from'@/contexts/LayoutContext';
import Sidebar from'@/components/layout/Sidebar';
import TopNavbar from'@/components/layout/TopNavbar';
import AdminProfileModal from'@/components/layout/AdminProfileModal';
import { ProtectedRoute } from'../auth/ProtectedRoute';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  if (isLoginPage) {
    return (
      <ProtectedRoute>
        {children}
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <LayoutProvider>
        <div className="flex h-screen overflow-hidden bg-background transition-colors duration-300">
          <Sidebar />

          {/* Main Content Area */}
          <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
            <TopNavbar />

            {/* Main Scrolling Container */}
            <main className="flex-1 overflow-y-auto bg-gradient-to-br from-background to-muted p-4 sm:p-6 lg:p-8 transition-all duration-300 no-scrollbar">
              <div className="max-w-[1600px] w-full mx-auto min-w-0">
                {children}
              </div>
            </main>
          </div>
        </div>
        <AdminProfileModal />
      </LayoutProvider>
    </ProtectedRoute>
  );
}
