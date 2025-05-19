
import { createContext, useContext } from "react";
import { User, Session } from "@supabase/supabase-js";
import { Database } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type UserWithProfile = User & { profile: Profile | null };

export type AuthContextType = {
  session: Session | null;
  user: UserWithProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
  refreshUserProfile: (userId: string) => Promise<Profile | null>;
};

export const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
  refreshUserProfile: async () => null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// Helper function to add doctor availability
export const addMockDoctorAvailability = async (doctorId: string) => {
  const { data, error } = await supabase
    .from('doctor_availability')
    .select('*')
    .eq('doctor_id', doctorId);

  if (error) {
    console.error("Error checking doctor availability:", error);
    return;
  }

  // Only add availability if none exists
  if (data && data.length === 0) {
    // Add availability for all weekdays
    const availabilityData = [];
    for (let day = 0; day < 7; day++) {
      availabilityData.push({
        doctor_id: doctorId,
        day_of_week: day,
        start_time: '09:00:00',
        end_time: '17:00:00'
      });
    }

    const { error: insertError } = await supabase
      .from('doctor_availability')
      .insert(availabilityData);

    if (insertError) {
      console.error("Error adding doctor availability:", insertError);
    }
  }
};
