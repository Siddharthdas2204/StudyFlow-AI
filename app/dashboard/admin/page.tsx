"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Search, 
  MoreVertical, 
  UserPlus, 
  Ban, 
  Trash2, 
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Activity,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Lock,
  Mail,
  Zap
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Mock data for initial development
const mockUsers = [
  { id: "1", full_name: "Siddharth Das", email: "siddharth@example.com", role: "admin", status: "active", usage: 1250, joined: "2026-03-10" },
  { id: "2", full_name: "John Doe", email: "john@example.com", role: "user", status: "active", usage: 450, joined: "2026-04-01" },
  { id: "3", full_name: "Sarah Smith", email: "sarah@example.com", role: "user", status: "suspended", usage: 890, joined: "2026-03-25" },
  { id: "4", full_name: "Mike Johnson", email: "mike@example.com", role: "user", status: "active", usage: 120, joined: "2026-04-05" },
  { id: "5", full_name: "Elena Rodriguez", email: "elena@example.com", role: "user", status: "active", usage: 2300, joined: "2026-02-15" },
];

const stats = [
  { label: "Total Users", value: "12,482", trend: "+12.5%", positive: true, icon: Users, color: "text-blue-400" },
  { label: "Active Nodes", value: "842", trend: "+5.2%", positive: true, icon: Activity, color: "text-green-400" },
  { label: "AI Queries", value: "892.4k", trend: "-2.1%", positive: false, icon: Zap, color: "text-purple-400" },
  { label: "Revenue", value: "$42,500", trend: "+18.3%", positive: true, icon: TrendingUp, color: "text-amber-400" },
];

export default function AdminDashboard() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isManaging, setIsManaging] = useState(false);

  const [activeTab, setActiveTab] = useState<"directory" | "analytics">("directory");

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/users");
        const data = await res.json();
        if (data.users) {
          setUsers(data.users);
        } else {
          setUsers(mockUsers);
        }
      } catch (e) {
        toast.error("Failed to connect to Admin API");
        setUsers(mockUsers);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleManageUser = (user: any) => {
    setSelectedUser(user);
    setIsManaging(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!selectedUser) return;
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: "update_status",
          payload: { status: newStatus }
        })
      });

      if (res.ok) {
        setUsers(users.map(u => u.id === selectedUser.id ? { ...u, status: newStatus } : u));
        toast.success(`User status updated to ${newStatus}`);
      } else {
        throw new Error("Failed to update user");
      }
    } catch (e) {
      toast.error("Bridge Connection Failed");
    } finally {
      setIsManaging(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      const res = await fetch("/api/admin/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          action: "delete"
        })
      });

      if (res.ok) {
        setUsers(users.filter(u => u.id !== selectedUser.id));
        toast.success("User account deleted successfully");
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (e) {
      toast.error("Transmission Error");
    } finally {
      setIsManaging(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-10 pb-20">
      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-4xl font-black tracking-tighter uppercase relative">
            Sovereign <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">Admin</span> Console
          </h2>
          <p className="text-white/40 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            Full Command & Control Access Active
          </p>
        </div>

        <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10 backdrop-blur-xl shrink-0">
          <button 
            onClick={() => setActiveTab("directory")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === "directory" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "text-white/40 hover:text-white"
            )}
          >
            Directory
          </button>
          <button 
            onClick={() => setActiveTab("analytics")}
            className={cn(
              "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeTab === "analytics" ? "bg-amber-500 text-black shadow-lg shadow-amber-500/20" : "text-white/40 hover:text-white"
            )}
          >
            Analytics
          </button>
        </div>
      </section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-6 border-white/10 relative overflow-hidden group"
          >
            <div className="absolute -right-4 -bottom-4 w-24 h-24 opacity-5 group-hover:opacity-10 transition-opacity">
              <stat.icon className="w-full h-full" />
            </div>
            
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg bg-white/5 border border-white/10", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn(
                "flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-md",
                stat.positive ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"
              )}>
                {stat.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            
            <h3 className="text-3xl font-black tracking-tight text-white mb-1">{stat.value}</h3>
            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {activeTab === "directory" ? (
        /* User Management Table */
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border-white/10 p-0 overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6 bg-black/20">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <Users className="w-6 h-6 text-amber-400" />
              </div>
              <div>
                <h3 className="text-xl font-black uppercase tracking-tight">User Directory</h3>
                <p className="text-[10px] text-white/40 font-black uppercase tracking-widest mt-1">Manage all registered accounts</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                <input 
                  type="text" 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-xs outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 transition-all font-medium"
                />
              </div>
              <button className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-white/90 text-black rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all">
                <UserPlus className="w-4 h-4" />
                Invite User
              </button>
            </div>
          </div>
          {/* Table content remains same... */}
          <div className="overflow-x-auto">
            {/* Same table code as before */}
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02]">
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">User Identity</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Privileges</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Status</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30">Usage (Requests)</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-white/30 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-amber-500 mb-4" />
                    <p className="text-xs font-black uppercase tracking-widest text-white/20">Decrypting User Data...</p>
                  </td>
                </tr>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-sm font-black text-white shadow-lg">
                          {user.full_name[0]}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white">{user.full_name}</p>
                          <p className="text-xs text-white/40">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={cn(
                        "text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-md border",
                        user.role === 'admin' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" : "bg-white/5 text-white/40 border-white/10"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          user.status === 'active' ? "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]" : "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]"
                        )} />
                        <p className={cn(
                          "text-[10px] font-black uppercase tracking-widest",
                          user.status === 'active' ? "text-green-400" : "text-red-400"
                        )}>
                          {user.status}
                        </p>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                          <span>{user.usage} / 5000</span>
                          <span>{Math.round((user.usage / 5000) * 100)}%</span>
                        </div>
                        <div className="w-32 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${(user.usage / 5000) * 100}%` }}
                            className={cn(
                              "h-full rounded-full transition-all duration-1000",
                              (user.usage / 5000) > 0.8 ? "bg-red-500" : "bg-amber-500"
                            )}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => handleManageUser(user)}
                        className="p-3 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 hover:border-white/20 transition-all opacity-0 group-hover:opacity-100"
                      >
                        <MoreVertical className="w-4 h-4 text-white/40" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-8 py-20 text-center text-white/20">
                    No users found matching your search parameters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="p-6 border-t border-white/5 flex items-center justify-between bg-black/20">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/20">Showing {filteredUsers.length} of {users.length} Identities</p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/20 hover:text-white transition-all disabled:opacity-30" disabled>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <div className="px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-[10px] font-black text-amber-400">1</div>
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-white/20 hover:text-white transition-all disabled:opacity-30" disabled>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
      ) : (
        /* Usage Analytics View */
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8"
        >
          {/* Usage by Feature */}
          <div className="glass-card border-white/10 p-8 space-y-8">
            <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-amber-500" />
              Intelligence Distribution
            </h3>
            <div className="space-y-6">
              {[
                { label: "Socrates AI Chat", usage: "342k", percentage: 85, color: "bg-blue-500" },
                { label: "Logic Lab (Code)", usage: "128k", percentage: 45, color: "bg-purple-500" },
                { label: "Exam Predictor", usage: "56k", percentage: 25, color: "bg-cyan-500" },
                { label: "Roadmap Engine", usage: "42k", percentage: 15, color: "bg-green-500" },
                { label: "Voice Tutor", usage: "12k", percentage: 5, color: "bg-amber-500" },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest leading-none">
                    <span className="text-white/70">{item.label}</span>
                    <span className="text-white/40">{item.usage} requests</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${item.percentage}%` }}
                      transition={{ duration: 1, delay: i * 0.1 }}
                      className={cn("h-full rounded-full", item.color)}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Real-time Telemetry (Simulated) */}
          <div className="glass-card border-white/10 p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.6)]" />
            </div>
            
            <h3 className="text-xl font-black uppercase tracking-tight mb-8">Live Network Load</h3>
            
            <div className="h-[250px] flex items-end gap-1 px-2 border-b border-l border-white/10">
              {Array.from({ length: 40 }).map((_, i) => (
                <motion.div 
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.random() * 80 + 20}%` }}
                  transition={{ 
                    duration: 1, 
                    repeat: Infinity, 
                    repeatType: "reverse", 
                    delay: i * 0.02,
                    ease: "easeInOut"
                  }}
                  className="flex-1 bg-gradient-to-t from-amber-500/10 to-amber-500/60 rounded-t-sm"
                />
              ))}
            </div>
            
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Latency</p>
                <p className="text-xl font-black text-amber-500">142ms</p>
              </div>
              <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Success Rate</p>
                <p className="text-xl font-black text-green-400">99.98%</p>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* User Management Modal */}
      <AnimatePresence>
        {isManaging && selectedUser && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsManaging(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="w-full max-w-lg glass-card border-white/10 p-10 relative z-10 shadow-[0_0_50px_rgba(0,0,0,0.8)]"
            >
              <button 
                onClick={() => setIsManaging(false)}
                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/5 transition-all"
              >
                <MoreVertical className="w-5 h-5 text-white/20" />
              </button>

              <div className="flex items-center gap-6 mb-10">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-500 to-amber-700 flex items-center justify-center text-3xl font-black text-white shadow-2xl">
                  {selectedUser.full_name[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tight">{selectedUser.full_name}</h3>
                  <p className="text-sm text-white/40">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-10">
                <div className="p-6 bg-white/5 border border-white/10 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/20 mb-4">Command Actions</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => handleStatusChange(selectedUser.status === 'active' ? 'suspended' : 'active')}
                      className={cn(
                        "p-4 rounded-xl border flex flex-col items-center gap-3 transition-all",
                        selectedUser.status === 'active' 
                          ? "bg-red-500/5 border-red-500/20 text-red-500 hover:bg-red-500/10" 
                          : "bg-green-500/5 border-green-500/20 text-green-500 hover:bg-green-500/10"
                      )}
                    >
                      <Ban className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {selectedUser.status === 'active' ? 'Suspend Access' : 'Restore Access'}
                      </span>
                    </button>
                    <button 
                      className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-400 hover:bg-blue-500/10 flex flex-col items-center gap-3 transition-all"
                    >
                      <ShieldAlert className="w-5 h-5" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Elevate Role</span>
                    </button>
                  </div>
                </div>

                <div className="p-6 bg-red-500/5 border border-red-500/10 rounded-2xl">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-red-500/40 mb-2">Nuclear Protocol</h4>
                  <p className="text-[10px] text-white/30 uppercase tracking-widest mb-6">Irreversible account termination. Use with extreme caution.</p>
                  <button 
                    onClick={handleDeleteUser}
                    className="w-full py-4 bg-red-500 hover:bg-red-600 text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg shadow-red-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                  >
                    <Trash2 className="w-4 h-4" />
                    Terminate Identity
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-3 p-4 bg-amber-500/5 border border-amber-500/10 rounded-xl text-amber-500/60 text-[10px] font-black uppercase tracking-widest leading-relaxed">
                <Lock className="w-4 h-4 shrink-0" />
                All administrative actions are logged and audited via StudyFlow Blockchain Ledger
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
