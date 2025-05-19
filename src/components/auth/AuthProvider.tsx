
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { AuthContext, UserWithProfile, addMockDoctorAvailability } from "@/lib/auth";
import { toast } from "@/components/ui/use-toast";

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState<UserWithProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Function to clear auth state - useful for sign out and error handling
  const clearAuthState = () => {
    setUser(null);
    setSession(null);
    setLoading(false);
  };

  // Function to refresh and fetch user profile
  const refreshUserProfile = async (userId: string) => {
    setLoading(true);
    try {
      console.log("Refreshing profile for user:", userId);
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          variant: "destructive",
          title: "Error loading profile",
          description: "Please try refreshing the page",
        });
        clearAuthState();
        return null;
      }
      
      console.log("Profile refreshed:", profile);
      
      // If it's a doctor without availability data, add mock data
      if (profile?.role === 'doctor') {
        try {
          await addMockDoctorAvailability(userId);
          console.log("Mock doctor availability data checked/added");
        } catch (error) {
          console.error("Error adding mock availability data:", error);
        }
      }
      
      return profile;
    } catch (error) {
      console.error("Error in refreshUserProfile:", error);
      clearAuthState();
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Set a shorter timeout to prevent indefinite loading (5 seconds instead of 10)
    const loadingTimeout = setTimeout(() => {
      if (loading) {
        console.log("Auth loading timeout reached, resetting state");
        clearAuthState();
        // Don't show toast for timeout since users might be using as guests
      }
    }, 5000); 

    // First, set up the auth listener to handle changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state changed:", event, session?.user?.id);
      setSession(session);
      
      if (session?.user) {
        try {
          const profile = await refreshUserProfile(session.user.id);
          const enhancedUser = {
            ...session.user,
            profile,
          } as UserWithProfile;
          
          console.log("Setting enhanced user:", enhancedUser);
          setUser(enhancedUser);
        } catch (error) {
          console.error("Error enhancing user with profile:", error);
          clearAuthState();
        }
      } else {
        clearAuthState();
      }
    });

    // Then check for existing session
    const getSession = async () => {
      try {
        console.log("Checking for existing session");
        const {
          data: { session },
        } = await supabase.auth.getSession();
        
        console.log("Existing session found:", session?.user?.id);
        setSession(session);
        
        if (session?.user) {
          try {
            const profile = await refreshUserProfile(session.user.id);
            const enhancedUser = {
              ...session.user,
              profile,
            } as UserWithProfile;
            
            console.log("Setting enhanced user from existing session:", enhancedUser);
            setUser(enhancedUser);
          } catch (error) {
            console.error("Error enhancing user with profile from session:", error);
            clearAuthState();
          }
        } else {
          clearAuthState();
        }
      } catch (error) {
        console.error("Error in getSession:", error);
        clearAuthState();
      }
    };

    getSession();

    return () => {
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const value = {
    session,
    user,
    loading,
    signOut: async () => {
      console.log("Signing out");
      setLoading(true);
      try {
        const { error } = await supabase.auth.signOut();
        if (error) {
          console.error("Error signing out:", error);
          toast({
            variant: "destructive",
            title: "Error signing out",
            description: error.message,
          });
        } else {
          clearAuthState();
          toast({
            title: "Signed out successfully",
            description: "You've been logged out",
          });
        }
      } catch (error) {
        console.error("Exception during sign out:", error);
      } finally {
        setLoading(false);
      }
    },
    refreshUserProfile, // Expose the refresh function to be called when needed
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
