-- Add is_test column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;

-- Add is_test column to doctor_availability table
ALTER TABLE doctor_availability ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;

-- Add is_test column to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;

-- Add is_test column to notifications table
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS is_test BOOLEAN DEFAULT false;

-- Add indexes for faster filtering of test data
CREATE INDEX IF NOT EXISTS idx_profiles_is_test ON profiles(is_test);
CREATE INDEX IF NOT EXISTS idx_doctor_availability_is_test ON doctor_availability(is_test);
CREATE INDEX IF NOT EXISTS idx_appointments_is_test ON appointments(is_test);
CREATE INDEX IF NOT EXISTS idx_notifications_is_test ON notifications(is_test); 