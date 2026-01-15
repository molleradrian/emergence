import { useState, useEffect } from 'react';
// import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  useEffect(() => {
    // BYPASS: Local Sovereign Mode
    const mockUser: User = {
      id: "sovereign-001",
      email: "sovereign@nexus.local",
      aud: "authenticated",
      role: "authenticated",
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
      confirmed_at: new Date().toISOString(),
      last_sign_in_at: new Date().toISOString(),
      phone: "",
      factors: []
    };

    setTimeout(() => {
      console.log("useAuth: Setting user and clearing loading state");
      setUser(mockUser);
      setIsUserLoading(false);
    }, 100); // Fake loading for effect

    /* 
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      setIsUserLoading(false);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
    */
  }, []);

  return { user, isUserLoading, auth: {} as any }; // Mock auth object
}
