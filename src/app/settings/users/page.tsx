'use client';

import React, { useState } from 'react';
import SettingsHeader from '@/components/settings/SettingsHeader';
import SettingsCard from '@/components/settings/SettingsCard';
import { 
  Users2, 
  Search, 
  Filter, 
  MoreVertical, 
  ShieldCheck, 
  ShieldAlert, 
  Ban, 
  Snowflake as Freeze, 
  LogOut, 
  FileText, 
  CheckCircle2, 
  XCircle,
  TrendingUp,
  Wallet,
  Smartphone,
  ChevronRight,
  ArrowUpRight,
  History,
  Activity,
  MapPin,
  Clock,
  Fingerprint,
  X,
  CreditCard
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { executeExport } from '@/lib/exportUtils';
import { Loader2 } from 'lucide-react';

// Mock User Data - Removed for production-ready empty state
const mockUsers: any[] = [];

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [isExporting, setIsExporting] = useState(false);

  const filteredUsers = mockUsers.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.accountNumber.includes(searchQuery) ||
    user.id.includes(searchQuery)
  );

  const handleExportUsers = async () => {
    setIsExporting(true);
    try {
      await executeExport({
        format: 'CSV',
        fileName: 'User_Directory',
        data: filteredUsers.map(({ initials, ...rest }) => rest) // Clean data for CSV
      });
    } catch (error) {
      console.error("Export error:", error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleUserAction = (action: string, userName: string) => {
    toast.success(`${action} Successful`, {
      description: `Administrative command for "${userName}" has been processed.`
    });
  };

  return (
    <div className="space-y-10">
      <SettingsHeader 
        title="User Account Management" 
        description="Inspect and manage customer banking profiles, account levels, and platform activity."
      />

      <div className="space-y-6">
        {/* Search & Filter Bar */}
        <div className="flex flex-col md:flex-row gap-4 items-center bg-card border border-border/40 p-4 rounded-[32px] shadow-sm">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name, email, phone or account number..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-secondary/30 border border-border/20 rounded-2xl py-3.5 pl-12 pr-4 text-[13px] font-medium outline-none focus:bg-background focus:border-primary/40 transition-all"
            />
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <Button onClick={() => toast.info('Filter User Directory', { description: 'Opening advanced user segmentation panel...' })} variant="outline" className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2">
              <Filter size={14} /> Filter
            </Button>
            <Button 
              disabled={isExporting}
              onClick={handleExportUsers} 
              className="h-12 px-6 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 flex items-center gap-2 min-w-[140px]"
            >
              {isExporting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  Exporting...
                </>
              ) : (
                "Export Users"
              )}
            </Button>
          </div>
        </div>

        {/* User Table Card */}
        <SettingsCard 
          title="Customer Directory" 
          description="Global directory of OINZpay retail accounts."
          icon={Users2}
        >
          <div className="overflow-x-auto -mx-8 px-8">
            <table className="w-full text-left border-separate border-spacing-y-4">
              <thead>
                <tr className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
                  <th className="px-6 py-2">Customer</th>
                  <th className="px-6 py-2">Account Details</th>
                  <th className="px-6 py-2">Status</th>
                  <th className="px-6 py-2 text-right">Balance</th>
                  <th className="px-6 py-2 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    onClick={() => setSelectedUser(user)}
                    className="group cursor-pointer"
                  >
                    <td className="px-6 py-4 bg-secondary/20 border-y border-l border-border/10 rounded-l-[24px] group-hover:bg-secondary/40 group-hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="size-11 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-black text-sm">
                          {user.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-[14px] font-black text-foreground truncate">{user.name}</p>
                          <p className="text-[11px] font-medium text-muted-foreground truncate">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 bg-secondary/20 border-y border-border/10 group-hover:bg-secondary/40 group-hover:border-primary/20 transition-all">
                      <div className="space-y-1">
                        <p className="text-[12px] font-bold text-foreground">{user.accountNumber}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-[9px] font-black uppercase px-2 py-0.5 bg-muted rounded-md text-muted-foreground">{user.tier}</span>
                          <span className={cn(
                            "text-[9px] font-black uppercase px-2 py-0.5 rounded-md",
                            user.kycStatus === "Verified" ? "bg-emerald-500/10 text-emerald-500" : user.kycStatus === "Pending" ? "bg-amber-500/10 text-amber-500" : "bg-red-500/10 text-red-500"
                          )}>{user.kycStatus}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 bg-secondary/20 border-y border-border/10 group-hover:bg-secondary/40 group-hover:border-primary/20 transition-all">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "size-2 rounded-full",
                          user.status === "active" ? "bg-emerald-500 shadow-[0_0_8px_#10B981]" : user.status === "flagged" ? "bg-amber-500 shadow-[0_0_8px_#F59E0B]" : "bg-red-500 shadow-[0_0_8px_#EF4444]"
                        )} />
                        <span className="text-[11px] font-black uppercase tracking-widest text-foreground">{user.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 bg-secondary/20 border-y border-border/10 text-right group-hover:bg-secondary/40 group-hover:border-primary/20 transition-all">
                      <p className="text-[14px] font-black text-foreground">{user.balance}</p>
                      <p className="text-[10px] font-medium text-muted-foreground uppercase">{user.lastActive}</p>
                    </td>
                    <td className="px-6 py-4 bg-secondary/20 border-y border-r border-border/10 rounded-r-[24px] text-right group-hover:bg-secondary/40 group-hover:border-primary/20 transition-all">
                      <button onClick={(e) => { e.stopPropagation(); toast.info('User Operations', { description: `Managing profile permissions for ${user.id}` }); }} className="p-2.5 text-muted-foreground hover:text-primary transition-colors">
                        <MoreVertical size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="py-20 text-center">
                       <div className="flex flex-col items-center gap-3 opacity-30">
                          <Users2 size={40} className="text-muted-foreground" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">No users created yet</p>
                       </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </SettingsCard>
      </div>

      {/* User Details Slide-over/Modal */}
      <AnimatePresence>
        {selectedUser && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedUser(null)}
              className="fixed inset-0 bg-background/80 backdrop-blur-md z-[100]"
            />
            <motion.div 
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 h-full w-full max-w-2xl bg-card border-l border-border/50 z-[101] shadow-2xl flex flex-col"
            >
              {/* Profile Header */}
              <div className="p-8 border-b border-border/20 flex items-start justify-between">
                <div className="flex items-center gap-6">
                  <div className="size-20 rounded-[32px] bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-black text-3xl">
                    {selectedUser.initials}
                  </div>
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black text-foreground tracking-tighter">{selectedUser.name}</h2>
                    <div className="flex items-center gap-3">
                      <p className="text-[13px] font-medium text-muted-foreground">{selectedUser.email}</p>
                      <span className="size-1 bg-muted-foreground/30 rounded-full" />
                      <p className="text-[13px] font-bold text-foreground">{selectedUser.phone}</p>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedUser(null)}
                  className="p-3 bg-secondary/50 hover:bg-secondary border border-border/20 rounded-2xl text-muted-foreground transition-all"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex px-8 border-b border-border/10 bg-secondary/10">
                {["Overview", "Information", "Transactions", "Security"].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab.toLowerCase())}
                    className={cn(
                      "px-6 py-4 text-[11px] font-black uppercase tracking-widest relative transition-colors",
                      activeTab === tab.toLowerCase() ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {tab}
                    {activeTab === tab.toLowerCase() && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                    )}
                  </button>
                ))}
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto p-8 no-scrollbar space-y-8">
                {activeTab === "overview" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-6 bg-secondary/20 border border-border/20 rounded-[32px] space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Wallet Balance</p>
                        <h4 className="text-2xl font-black text-foreground">{selectedUser.balance}</h4>
                        <div className="flex items-center gap-1.5 text-emerald-500 font-bold text-[11px]">
                          <ArrowUpRight size={14} /> +₦12,400.00 today
                        </div>
                      </div>
                      <div className="p-6 bg-secondary/20 border border-border/20 rounded-[32px] space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Total Savings</p>
                        <h4 className="text-2xl font-black text-foreground">₦450,000.00</h4>
                        <div className="flex items-center gap-1.5 text-primary font-bold text-[11px]">
                          <TrendingUp size={14} /> 12.5% APY Active
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <h4 className="text-[12px] font-black uppercase tracking-widest text-foreground px-1">Account Metrics</h4>
                      <div className="grid grid-cols-3 gap-4">
                        {[
                          { label: "Tier Level", value: selectedUser.tier, icon: ShieldCheck, color: "text-primary" },
                          { label: "KYC Status", value: selectedUser.kycStatus, icon: Fingerprint, color: "text-emerald-500" },
                          { label: "Account ID", value: selectedUser.id, icon: FileText, color: "text-muted-foreground" },
                        ].map((metric, i) => (
                          <div key={i} className="p-4 bg-card border border-border/20 rounded-2xl space-y-1">
                            <metric.icon size={16} className={metric.color} />
                            <p className="text-[10px] font-black uppercase tracking-tight text-muted-foreground/60">{metric.label}</p>
                            <p className="text-[13px] font-black text-foreground">{metric.value}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 rounded-[32px] flex items-center justify-between">
                       <div className="space-y-1">
                          <p className="text-[13px] font-black text-foreground uppercase tracking-wider">Referral Program</p>
                          <p className="text-[11px] font-medium text-muted-foreground">User has invited 12 customers this month.</p>
                       </div>
                       <div className="text-right">
                          <p className="text-lg font-black text-primary">₦6,000.00</p>
                          <p className="text-[9px] font-bold text-muted-foreground uppercase">Earnings</p>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === "information" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="grid grid-cols-2 gap-8">
                       <div className="space-y-6">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Full Legal Name</p>
                             <p className="text-[15px] font-bold text-foreground">{selectedUser.name}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">BVN Status</p>
                             <div className="flex items-center gap-2 text-emerald-500">
                                <CheckCircle2 size={16} />
                                <span className="text-[13px] font-black uppercase tracking-widest">Verified (2218****33)</span>
                             </div>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Residential Address</p>
                             <p className="text-[13px] font-medium text-foreground leading-relaxed">
                                42, Victoria Island Estate, Phase 2, Lagos, Nigeria.
                             </p>
                          </div>
                       </div>
                       <div className="space-y-6">
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Date of Birth</p>
                             <p className="text-[14px] font-bold text-foreground">January 14, 1994</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Registration Date</p>
                             <p className="text-[14px] font-bold text-foreground">{selectedUser.joinedDate}</p>
                          </div>
                          <div>
                             <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 mb-1">Last Active Device</p>
                             <div className="flex items-center gap-2 text-foreground">
                                <Smartphone size={16} className="text-muted-foreground" />
                                <span className="text-[13px] font-bold">iPhone 15 Pro Max (iOS 17.4)</span>
                             </div>
                          </div>
                       </div>
                    </div>
                  </div>
                )}

                {activeTab === "transactions" && (
                  <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    {[
                      { type: "Transfer", desc: "Sent to Segun Arinze", amount: "-₦50,000.00", status: "Success", date: "Today, 2:14 PM", icon: ArrowUpRight, color: "text-red-500", bg: "bg-red-500/10" },
                      { type: "Deposit", desc: "Wallet Funding via Card", amount: "+₦200,000.00", status: "Success", date: "Today, 10:05 AM", icon: CreditCard, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                      { type: "Airtime", desc: "MTN Top-up for 080345***", amount: "-₦2,000.00", status: "Success", date: "Yesterday, 8:45 PM", icon: Smartphone, color: "text-red-500", bg: "bg-red-500/10" },
                      { type: "Savings", desc: "Interest Yield Credit", amount: "+₦420.50", status: "Success", date: "Yesterday, 12:00 AM", icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10" },
                    ].map((tx, i) => (
                      <div key={i} className="p-5 bg-secondary/20 border border-border/10 rounded-[24px] flex items-center justify-between group hover:bg-secondary/40 transition-all">
                        <div className="flex items-center gap-4">
                          <div className={cn("p-3 rounded-2xl", tx.bg, tx.color)}>
                            <tx.icon size={18} />
                          </div>
                          <div className="space-y-1">
                            <p className="text-[13px] font-black text-foreground">{tx.desc}</p>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase text-muted-foreground/60 tracking-widest">
                               <span>{tx.type}</span>
                               <span className="size-1 bg-muted-foreground/30 rounded-full" />
                               <span>{tx.date}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className={cn("text-[14px] font-black", tx.color)}>{tx.amount}</p>
                          <span className="text-[9px] font-black uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md tracking-tighter">SUCCESS</span>
                        </div>
                      </div>
                    ))}
                    <Button variant="outline" className="w-full h-12 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40">
                      View All 142 Transactions
                    </Button>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="p-8 bg-red-500/5 border border-red-500/20 rounded-[32px] space-y-4">
                       <div className="flex items-center gap-4">
                          <div className="p-3 bg-red-500 text-white rounded-2xl shadow-lg shadow-red-500/20">
                             <ShieldAlert size={24} />
                          </div>
                          <div className="space-y-1">
                             <h5 className="text-[16px] font-black text-foreground">Risk Assessment</h5>
                             <p className="text-[12px] font-medium text-muted-foreground">User has low fraud probability based on historical activity.</p>
                          </div>
                          <div className="ml-auto text-right">
                             <p className="text-2xl font-black text-red-500">12</p>
                             <p className="text-[9px] font-bold text-muted-foreground uppercase">Score / 100</p>
                          </div>
                       </div>
                    </div>

                    <div className="space-y-4">
                       <h4 className="text-[12px] font-black uppercase tracking-widest text-foreground px-1">Security Logs</h4>
                       <div className="space-y-4">
                          {[
                            { event: "Successful Login", device: "iPhone 15 Pro", location: "Lagos, NG", time: "2m ago", icon: Smartphone },
                            { event: "PIN Reset Attempt", device: "Web Terminal", location: "London, UK", time: "14h ago", icon: History, alert: true },
                            { event: "New Device Linked", device: "MacBook Air M2", location: "Lagos, NG", time: "2 days ago", icon: Activity },
                          ].map((log, i) => (
                            <div key={i} className="flex items-center justify-between p-4 bg-card border border-border/20 rounded-2xl">
                               <div className="flex items-center gap-4">
                                  <div className={cn("p-2 rounded-xl bg-muted text-muted-foreground", log.alert && "bg-amber-500/10 text-amber-500")}>
                                     <log.icon size={16} />
                                  </div>
                                  <div className="space-y-1">
                                     <p className="text-[12px] font-bold text-foreground">{log.event}</p>
                                     <p className="text-[10px] text-muted-foreground font-medium">{log.device} • {log.location}</p>
                                  </div>
                               </div>
                               <span className="text-[10px] font-black text-muted-foreground uppercase">{log.time}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Footer - Actions */}
              <div className="p-8 border-t border-border/20 bg-secondary/10 grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Button onClick={() => handleUserAction('Account Frozen', selectedUser.name)} variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center justify-center gap-2">
                    <Freeze size={14} /> Freeze Account
                  </Button>
                  <Button onClick={() => handleUserAction('Account Suspended', selectedUser.name)} variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40 hover:bg-red-500/10 hover:text-red-500 hover:border-red-500/20 transition-all flex items-center justify-center gap-2">
                    <Ban size={14} /> Suspend User
                  </Button>
                </div>
                <div className="space-y-2">
                  <Button onClick={() => handleUserAction('KYC Level Verified', selectedUser.name)} className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary text-white shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
                    <CheckCircle2 size={14} /> Verify KYC Level
                  </Button>
                  <Button onClick={() => handleUserAction('PIN Reset Initiated', selectedUser.name)} variant="outline" className="w-full h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40 flex items-center justify-center gap-2">
                    <History size={14} /> Reset Transaction PIN
                  </Button>
                </div>
                <Button onClick={() => executeExport({ format: 'PDF', fileName: `Statement_${selectedUser.id}`, data: [selectedUser] })} variant="outline" className="col-span-2 h-11 rounded-2xl font-black text-[10px] uppercase tracking-widest border-border/40 flex items-center justify-center gap-2">
                  <FileText size={14} /> Export Account Statement
                </Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
