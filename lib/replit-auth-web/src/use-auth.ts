import { useState, useEffect, useCallback } from "react";
import { supabase } from "./supabase";

export interface AuthUser {
  id: string;
  username: string;
  firstName?: string;
  email?: string;
  profileImage?: string;
}

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => Promise<void>;
  mockLogin: () => void;
  logout: () => Promise<void>;
}

export function useAuth(): AuthState {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const syncUser = useCallback((supabaseUser: any) => {
    if (supabaseUser) {
      setUser({
        id: supabaseUser.id,
        username: supabaseUser.email?.split('@')[0] || 'Scholar',
        firstName: supabaseUser.user_metadata?.full_name?.split(' ')[0] || supabaseUser.email?.split('@')[0] || 'Scholar',
        email: supabaseUser.email,
        profileImage: supabaseUser.user_metadata?.avatar_url
      });
    } else if (localStorage.getItem("mock_auth") === "true") {
       setUser({
         id: "mock-user-id",
         username: "DemoScholar",
         firstName: "Demo",
         email: "demo@studyflow.ai"
       });
    } else {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    // Check local storage for mock auth first
    if (localStorage.getItem("mock_auth") === "true") {
      setUser({
        id: "mock-user-id",
        username: "DemoScholar",
        firstName: "Demo",
        email: "demo@studyflow.ai"
      });
      setIsLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      syncUser(session?.user ?? null);
      setIsLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      syncUser(session?.user ?? null);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [syncUser]);

  const login = useCallback(async () => {
    // Try Google login
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    });
    
    if (error) {
      console.error("Supabase Login Error:", error.message);
      // If it's the 400 error, we show a message or just fallback to mock for now
      if (error.message.includes("provider is not enabled")) {
        alert("Google Login is not enabled in your Supabase Dashboard. Entering Demo Mode instead.");
        mockLogin();
      } else {
        throw error;
      }
    }
  }, []);

  const mockLogin = useCallback(() => {
    localStorage.setItem("mock_auth", "true");
    setUser({
      id: "mock-user-id",
      username: "DemoScholar",
      firstName: "Demo",
      email: "demo@studyflow.ai"
    });
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem("mock_auth");
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    mockLogin,
    logout,
  };
}
