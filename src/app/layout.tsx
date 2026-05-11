import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import { cn } from "@/lib/utils";

import { ThemeProvider } from '@/components/ThemeProvider'
import { Toaster } from 'sonner'
import { CommandPalette } from '@/components/CommandPalette'
import DashboardLayout from '@/components/layout/DashboardLayout'

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const font = Plus_Jakarta_Sans({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'OINZpay Admin | Seamless Possibilities',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)} suppressHydrationWarning>
      <body className={cn(font.className, "antialiased")} suppressHydrationWarning>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <DashboardLayout>
            {children}
          </DashboardLayout>
          <Toaster 
            position="bottom-right" 
            richColors
          />
          <CommandPalette />
        </ThemeProvider>
      </body>
    </html>
  )
}
