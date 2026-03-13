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
              className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                tab === "Profile" ? "bg-primary/20 text-primary border border-primary/20" : "text-white/40 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Right: Content Area */}
        <div className="md:col-span-2 space-y-6">
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
        </div>
      </div>
    </div>
  );
}
