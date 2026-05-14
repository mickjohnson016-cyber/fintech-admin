'use client';

import React from'react';
import SettingsHeader from'@/components/settings/SettingsHeader';
import SettingsCard from'@/components/settings/SettingsCard';
import SettingsField from'@/components/settings/SettingsField';
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
} from'lucide-react';
import { Switch } from"@/components/ui/switch";
import { Button } from"@/components/ui/button";
import { cn } from"@/lib/utils";
import { toast } from'sonner';


export default function AppearanceSettings() {

 return (
 <div className="space-y-10">
 <SettingsHeader 
 title="Appearance" 
 description=""
 />

 <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
 <div className="xl:col-span-2 space-y-8">

 {/* Density & Layout */}
 <SettingsCard 
 title="Layout & Density" 
 description=""
 icon={Layout}
 >
 <div className="space-y-2">
 <SettingsField 
 label="Compact Mode" 
 description=""
 icon={Layers}
 >
 <Switch defaultChecked={false} onCheckedChange={(checked) => toast.success(checked ?'Compact Mode Active' :'Standard Spacing Restored', { description:'Re-adjusting interface density...' })} />
 </SettingsField>

 <SettingsField 
 label="Sidebar Collapsed by Default" 
 description=""
 icon={ChevronRight}
 >
 <Switch defaultChecked={false} onCheckedChange={(checked) => toast.success(checked ?'Collapsed Navigation' :'Expanded Navigation', { description:'Updating sidebar persistence behavior...' })} />
 </SettingsField>

 <SettingsField 
 label="Show Data Visualizations" 
 description=""
 icon={Zap}
 >
 <Switch defaultChecked={true} onCheckedChange={(checked) => toast.success(checked ?'Charts Enabled' :'Charts Hidden', { description:'Updating dashboard rendering engine...' })} />
 </SettingsField>
 </div>
 </SettingsCard>

 {/* Accessibility & Motion */}
 <SettingsCard 
 title="Motion & Effects" 
 description=""
 icon={Sparkles}
 >
 <div className="space-y-2">
 <SettingsField 
 label="Reduce Motion" 
 description=""
 icon={Monitor}
 >
 <Switch defaultChecked={false} onCheckedChange={(checked) => toast.success(checked ?'Motion Reduced' :'Motion Enabled', { description:'Updating accessibility preferences...' })} />
 </SettingsField>

 <SettingsField 
 label="Glassmorphism Effects" 
 description=""
 icon={Layers}
 >
 <Switch defaultChecked={true} onCheckedChange={(checked) => toast.success(checked ?'Blur Effects Enabled' :'Blur Effects Disabled', { description:'Updating visual depth settings...' })} />
 </SettingsField>

 <SettingsField 
 label="Subtle Glow Effects" 
 description=""
 icon={Sparkles}
 >
 <Switch defaultChecked={true} onCheckedChange={(checked) => toast.success(checked ?'Glow Effects Enabled' :'Glow Effects Disabled', { description:'Updating premium aesthetic filters...' })} />
 </SettingsField>
 </div>
 </SettingsCard>
 </div>

 <div className="xl:col-span-1 space-y-8">
 {/* Typography */}
 <SettingsCard 
 title="Typography" 
 description=""
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
 <Button onClick={() => toast.success('Font Manager', { description:'Opening typography and weight distribution panel...' })} variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40">
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
 <button onClick={() => toast.success('Interaction Active', { description:'Micro-interaction feedback triggered successfully.' })} className="w-full py-3 bg-primary text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
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
