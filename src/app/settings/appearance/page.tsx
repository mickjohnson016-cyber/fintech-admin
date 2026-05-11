'use client';

import React from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import SettingsField from '@/components/settings/SettingsField';
import { 
  Palette, 
  Sun, 
  Moon, 
  Monitor, 
  Layout, 
  Type, 
  Sparkles,
  Layers,
  ChevronRight,
  Check,
  Zap,
  MousePointer2
} from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

const themes = [
  { id: 'light', name: 'Standard Light', icon: Sun, color: 'bg-white' },
  { id: 'dark', name: 'Enterprise Dark', icon: Moon, color: 'bg-[#031127]' },
  { id: 'system', name: 'System Default', icon: Monitor, color: 'bg-gradient-to-br from-white to-[#031127]' },
];

export default function AppearanceSettings() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="Appearance" 
        description="Customize your administrative experience. Configure themes, density, and UI behavior."
      />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        <div className="xl:col-span-2 space-y-8">
          {/* Theme Selection */}
          <SettingsCard 
            title="Interface Theme" 
            description="Choose between light, dark, or system-synchronized appearance."
            icon={Palette}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themes.map((t) => (
                <button 
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={cn(
                    "relative p-6 rounded-[32px] border-2 transition-all group overflow-hidden text-left",
                    theme === t.id ? "border-primary bg-primary/5 shadow-xl shadow-primary/5" : "border-border/40 bg-secondary/30 hover:border-primary/20"
                  )}
                >
                  <div className={cn("size-12 rounded-2xl mb-4 flex items-center justify-center border border-border/20", t.color)}>
                    <t.icon size={20} className={cn(theme === t.id ? "text-primary" : "text-muted-foreground")} />
                  </div>
                  <div className="space-y-1">
                    <p className="text-[14px] font-black text-foreground tracking-tight">{t.name}</p>
                    <p className="text-[10px] font-bold text-muted-foreground uppercase">{t.id} mode active</p>
                  </div>
                  {theme === t.id && (
                    <div className="absolute top-4 right-4 p-1.5 bg-primary rounded-full text-white">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </SettingsCard>

          {/* Density & Layout */}
          <SettingsCard 
            title="Layout & Density" 
            description="Optimize the interface for your screen and workflow preference."
            icon={Layout}
          >
            <div className="space-y-2">
              <SettingsField 
                label="Compact Mode" 
                description="Reduce padding and text size to show more data at once."
                icon={Layers}
              >
                <Switch defaultChecked={false} />
              </SettingsField>

              <SettingsField 
                label="Sidebar Collapsed by Default" 
                description="Keep the navigation sidebar collapsed for a more focused workspace."
                icon={ChevronRight}
              >
                <Switch defaultChecked={false} />
              </SettingsField>

              <SettingsField 
                label="Show Data Visualizations" 
                description="Toggle charts and graphical indicators across dashboard views."
                icon={Zap}
              >
                <Switch defaultChecked={true} />
              </SettingsField>
            </div>
          </SettingsCard>

          {/* Accessibility & Motion */}
          <SettingsCard 
            title="Motion & Effects" 
            description="Control UI animations and visual effects."
            icon={Sparkles}
          >
            <div className="space-y-2">
              <SettingsField 
                label="Reduce Motion" 
                description="Disable all non-essential UI animations and transitions."
                icon={Monitor}
              >
                <Switch defaultChecked={false} />
              </SettingsField>

              <SettingsField 
                label="Glassmorphism Effects" 
                description="Enable frosted glass and backdrop blur effects on surfaces."
                icon={Layers}
              >
                <Switch defaultChecked={true} />
              </SettingsField>

              <SettingsField 
                label="Subtle Glow Effects" 
                description="Show glowing indicators on active elements and cards."
                icon={Sparkles}
              >
                <Switch defaultChecked={true} />
              </SettingsField>
            </div>
          </SettingsCard>
        </div>

        <div className="xl:col-span-1 space-y-8">
          {/* Typography */}
          <SettingsCard 
            title="Typography" 
            description="Global font preferences."
            icon={Type}
          >
            <div className="space-y-4">
              <div className="p-5 bg-secondary/30 border border-border/10 rounded-[28px] space-y-4">
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Display Font</p>
                  <p className="text-[16px] font-black text-foreground">Plus Jakarta Sans</p>
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Monospace Font</p>
                  <p className="text-[14px] font-mono font-bold text-foreground">JetBrains Mono</p>
                </div>
              </div>
              <Button variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40">
                Manage Font Weights
              </Button>
            </div>
          </SettingsCard>

          {/* Interactive States Preview */}
          <div className="p-8 bg-card border border-border/40 rounded-[32px] space-y-6 shadow-xl shadow-black/5 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <MousePointer2 size={100} className="text-primary" />
             </div>
             
             <div className="space-y-1 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-widest text-primary">UI Feedback</p>
                <h3 className="text-2xl font-black text-foreground tracking-tighter">Micro-interactions</h3>
             </div>

             <div className="space-y-4 relative z-10">
                <button className="w-full py-3 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                  Hover Me
                </button>
                <div className="flex gap-3">
                   <div className="flex-1 h-12 bg-secondary/50 rounded-2xl animate-pulse" />
                   <div className="flex-1 h-12 bg-secondary/50 rounded-2xl animate-pulse" />
                </div>
                <p className="text-[11px] font-medium text-muted-foreground leading-snug">
                  Animations are hardware accelerated and optimized for 120Hz displays.
                </p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
