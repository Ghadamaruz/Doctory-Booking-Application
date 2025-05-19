
export interface Doctor {
  id: string;
  first_name: string;
  last_name: string;
  specialty?: string;
  experience?: string;
  rating?: number;
  image?: string;
  email?: string;
  reviews?: Array<{
    id: string;
    user: string;
    rating: number;
    date: string;
    comment: string;
  }>;
  availability?: Array<{
    day_of_week: number;
    start_time: string;
    end_time: string;
  }>;
  // Add profile properties to ensure compatibility with profiles table
  created_at?: string;
  updated_at?: string;
  role?: "patient" | "doctor" | "admin" | "super_admin";
}

export interface Appointment {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed' | 'rejected';
  notes: string | null;
  doctorName?: string;
  doctorSpecialty?: string;
  doctorImage?: string;
  type?: 'video' | 'in-person';
  address?: string;
  patient_name?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  read: boolean;
  created_at: string;
  related_id?: string;
  type?: string; // Changed from 'appointment' | 'message' | 'system' to string to fix type error
}
