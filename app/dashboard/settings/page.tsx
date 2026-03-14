"use client";

import { useEffect, useState } from "react";
import { User, Mail, Shield, Smartphone, Bell, Eye, EyeOff, Save, Loader2, Camera } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    bio: ""
  });
  const [activeTab, setActiveTab] = useState("Profile");

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        setFormData({
          fullName: user.user_metadata?.full_name || "",
          username: user.user_metadata?.username || user.email?.split("@")[0] || "",
          bio: user.user_metadata?.bio || ""
        });
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
          username: formData.username,
          bio: formData.bio
        }
      });
      if (error) throw error;
      toast.success("Profile updated successfully");
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-10">
      <div>
        <h2 className="text-3xl font-bold tracking-tight mb-2">Account Settings</h2>
        <p className="text-white/50 text-sm">Manage your profile, security, and notification preferences.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Section Tabs (Conceptual for now) */}
        <div className="space-y-2">
          {["Profile", "Security", "Notifications", "Subscription"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab ? "bg-primary/20 text-primary border border-primary/20" : "text-white/40 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right: Content Area */}
        <div className="md:col-span-2 space-y-6">
          {activeTab === "Profile" && (
            <>
              <div className="glass-card p-8">
                <div className="flex items-start gap-8 mb-10">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary to-purple-600 border-2 border-white/10 overflow-hidden">
                      {user?.user_metadata?.avatar_url ? (
                        <img src={user.user_metadata.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl font-bold">
                          {user?.email?.[0].toUpperCase()}
                        </div>
                      )}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full shadow-lg hover:scale-110 transition-all">
                      <Camera className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold">{formData.fullName || "Your Name"}</h4>
                    <p className="text-sm text-white/40">{user?.email}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] font-black uppercase tracking-widest bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                        Pro Scholar
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Full Name</label>
                      <input 
                        type="text"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Username</label>
                      <input 
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-white/30 px-1">Bio</label>
                    <textarea 
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full h-32 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                      placeholder="Tell Socrates about your learning goals..."
                    />
                  </div>

                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl font-bold shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50"
                  >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </button>
                </div>
              </div>

              <div className="glass-card p-8 bg-red-500/5 border-red-500/10">
                <h4 className="text-sm font-bold text-red-500 mb-2 uppercase tracking-widest">Danger Zone</h4>
                <p className="text-xs text-white/40 mb-6">Once you delete your account, there is no going back. Please be certain.</p>
                <button className="px-6 py-2 border border-red-500/20 text-red-500 text-xs font-bold rounded-lg hover:bg-red-500 hover:text-white transition-all">
                  Delete Account
                </button>
              </div>
            </>
          )}

          {activeTab === "Security" && (
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6">Security Settings</h3>
              <div className="space-y-6">
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">Two-Factor Authentication</h4>
                      <p className="text-xs text-white/40 mt-1">Add an extra layer of security to your account.</p>
                    </div>
                    <button className="px-4 py-2 bg-primary/20 text-primary rounded-lg text-xs font-bold uppercase tracking-widest border border-primary/20">Enable</button>
                  </div>
                </div>
                <div className="p-4 bg-white/5 border border-white/10 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-sm">Change Password</h4>
                      <p className="text-xs text-white/40 mt-1">Update your login password securely.</p>
                    </div>
                    <button className="px-4 py-2 bg-white/10 text-white rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-white/20">Update</button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "Notifications" && (
            <div className="glass-card p-8">
              <h3 className="text-xl font-bold mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { title: "Email Updates", desc: "Receive updates on product features and news." },
                  { title: "Study Reminders", desc: "Daily reminders to keep up with your roadmap." },
                  { title: "Job Alerts", desc: "Get notified when new jobs match your profile." }
                ].map((item, i) => (
                  <label key={i} className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:bg-white/[0.07] transition-all">
                    <div>
                      <h4 className="font-bold text-sm">{item.title}</h4>
                      <p className="text-xs text-white/40 mt-1">{item.desc}</p>
                    </div>
                    <div className="w-10 h-6 bg-primary rounded-full relative shadow-[0_0_10px_rgba(139,92,246,0.5)]">
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1" />
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {activeTab === "Subscription" && (
            <div className="glass-card p-8 relative overflow-hidden">
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[80px] rounded-full pointer-events-none" />
               <div className="relative z-10 flex flex-col items-center text-center space-y-4">
                 <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 text-primary shadow-lg mb-2">
                   <Shield className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-black uppercase tracking-tight text-gradient">Pro Scholar Active</h3>
                 <p className="text-white/40 text-sm">Your subscription renews on April 15, 2026.</p>
                 <button className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl mt-4 font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">
                   Manage Billing
                 </button>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
