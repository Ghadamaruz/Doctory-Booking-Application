import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from "uuid";
import { format, addDays } from "date-fns";

/**
 * Clear all test data from the database
 */
export async function clearTestData() {
  try {
    console.log("Clearing test data...");
    
    // Delete in order to respect foreign key constraints
    const { error: appointmentsError } = await supabase
      .from('appointments')
      .delete()
      .eq('is_test', true);
      
    if (appointmentsError) {
      console.error("Error deleting test appointments:", appointmentsError);
    }
    
    const { error: availabilityError } = await supabase
      .from('doctor_availability')
      .delete()
      .eq('is_test', true);
      
    if (availabilityError) {
      console.error("Error deleting test doctor availability:", availabilityError);
    }
    
    const { error: notificationsError } = await supabase
      .from('notifications')
      .delete()
      .eq('is_test', true);
      
    if (notificationsError) {
      console.error("Error deleting test notifications:", notificationsError);
    }
    
    // Delete profiles last as they reference the others
    const { error: profilesError } = await supabase
      .from('profiles')
      .delete()
      .eq('is_test', true);
      
    if (profilesError) {
      console.error("Error deleting test profiles:", profilesError);
    }
    
    console.log("Test data cleared successfully");
    return { success: true };
  } catch (error) {
    console.error("Error clearing test data:", error);
    return { success: false, error };
  }
}

/**
 * Seed database with test accounts
 */
export async function seedTestAccounts() {
  try {
    console.log("Seeding test accounts...");
    
    // First clear any existing test data
    await clearTestData();
    
    // Create test accounts and return their IDs
    const { doctorIds, patientIds } = await createTestProfiles();
    
    if (doctorIds.length === 0) {
      throw new Error("Failed to create test doctor profiles");
    }
    
    // Create doctor availability for each doctor
    await createDoctorAvailability(doctorIds);
    
    // Create sample appointments between doctors and patients
    if (patientIds.length > 0) {
      await createSampleAppointments(doctorIds, patientIds);
    }
    
    console.log("Test accounts seeded successfully");
    return { success: true, doctorIds, patientIds };
  } catch (error) {
    console.error("Error seeding test accounts:", error);
    return { success: false, error };
  }
}

/**
 * Create test doctor and patient profiles
 */
async function createTestProfiles() {
  const doctorIds = [];
  const patientIds = [];
  
  // Generate an array of doctors with various specialties and ratings
  const doctors = [
    {
      id: uuidv4(),
      first_name: "Emily",
      last_name: "Johnson",
      email: "test.doctor1@example.com",
      role: "doctor",
      specialty: "Cardiology",
      experience: "10+ years",
      rating: 4.7,
      image: "https://randomuser.me/api/portraits/women/32.jpg",
      is_test: true
    },
    {
      id: uuidv4(),
      first_name: "Michael",
      last_name: "Chen",
      email: "test.doctor2@example.com",
      role: "doctor",
      specialty: "Pediatrics",
      experience: "8 years",
      rating: 4.9,
      image: "https://randomuser.me/api/portraits/men/45.jpg",
      is_test: true
    },
    {
      id: uuidv4(),
      first_name: "Sarah",
      last_name: "Williams",
      email: "test.doctor3@example.com",
      role: "doctor",
      specialty: "Dermatology",
      experience: "12 years",
      rating: 4.5,
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      is_test: true
    },
    {
      id: uuidv4(),
      first_name: "David",
      last_name: "Rodriguez",
      email: "test.doctor4@example.com",
      role: "doctor",
      specialty: "Family Medicine",
      experience: "5 years",
      rating: 4.3,
      image: "https://randomuser.me/api/portraits/men/22.jpg",
      is_test: true
    },
    {
      id: uuidv4(),
      first_name: "Aisha",
      last_name: "Khan",
      email: "test.doctor5@example.com",
      role: "doctor",
      specialty: "Neurology",
      experience: "15 years",
      rating: 4.8,
      image: "https://randomuser.me/api/portraits/women/41.jpg",
      is_test: true
    }
  ];
  
  // Generate an array of patients
  const patients = [
    {
      id: uuidv4(),
      first_name: "John",
      last_name: "Smith",
      email: "test.patient1@example.com",
      role: "patient",
      image: "https://randomuser.me/api/portraits/men/33.jpg",
      is_test: true
    },
    {
      id: uuidv4(),
      first_name: "Maria",
      last_name: "Garcia",
      email: "test.patient2@example.com",
      role: "patient",
      image: "https://randomuser.me/api/portraits/women/28.jpg",
      is_test: true
    },
    {
      id: uuidv4(),
      first_name: "Robert",
      last_name: "Lee",
      email: "test.patient3@example.com",
      role: "patient",
      image: "https://randomuser.me/api/portraits/men/55.jpg",
      is_test: true
    }
  ];
  
  // Insert doctors
  const { data: doctorData, error: doctorError } = await supabase
    .from('profiles')
    .insert(doctors)
    .select('id');
    
  if (doctorError) {
    console.error("Error creating test doctors:", doctorError);
  } else if (doctorData) {
    doctorIds.push(...doctorData.map(d => d.id));
    console.log(`Created ${doctorData.length} test doctors`);
  }
  
  // Insert patients
  const { data: patientData, error: patientError } = await supabase
    .from('profiles')
    .insert(patients)
    .select('id');
    
  if (patientError) {
    console.error("Error creating test patients:", patientError);
  } else if (patientData) {
    patientIds.push(...patientData.map(p => p.id));
    console.log(`Created ${patientData.length} test patients`);
  }
  
  return { doctorIds, patientIds };
}

/**
 * Create availability schedules for doctors
 */
async function createDoctorAvailability(doctorIds) {
  const availabilityRecords = [];
  
  // For each doctor, create availability for all days of the week
  doctorIds.forEach(doctorId => {
    // Different schedules for different doctors to make it realistic
    for (let day = 0; day < 7; day++) {
      // Weekdays (0-4) have different hours than weekends (5-6)
      const isWeekend = day >= 5;
      const startHour = isWeekend ? 10 : 9; // Start at 9 AM weekdays, 10 AM weekends
      const endHour = isWeekend ? 14 : 17;  // End at 5 PM weekdays, 2 PM weekends
      
      // Format hours as HH:00:00
      const startTime = `${startHour.toString().padStart(2, '0')}:00:00`;
      const endTime = `${endHour.toString().padStart(2, '0')}:00:00`;
      
      availabilityRecords.push({
        doctor_id: doctorId,
        day_of_week: day,
        start_time: startTime,
        end_time: endTime,
        is_test: true
      });
    }
  });
  
  // Insert all availability records
  const { data, error } = await supabase
    .from('doctor_availability')
    .insert(availabilityRecords);
    
  if (error) {
    console.error("Error creating doctor availability:", error);
  } else {
    console.log(`Created availability for ${doctorIds.length} doctors`);
  }
}

/**
 * Create sample appointments between doctors and patients
 */
async function createSampleAppointments(doctorIds, patientIds) {
  const appointments = [];
  const today = new Date();
  const statuses = ['pending', 'confirmed', 'completed', 'cancelled'];
  
  // Create upcoming appointments (some for each doctor with each patient)
  doctorIds.forEach((doctorId, dIndex) => {
    patientIds.forEach((patientId, pIndex) => {
      // Create 2 appointments per doctor-patient pair
      for (let i = 0; i < 2; i++) {
        // Different days for different appointments
        const dayOffset = dIndex + pIndex + i * 2 + 1;
        const appointmentDate = addDays(today, dayOffset);
        const formattedDate = format(appointmentDate, 'yyyy-MM-dd');
        
        // Different times based on index
        const hourOffset = (dIndex + pIndex + i) % 8 + 9; // Between 9 AM and 4 PM
        const startTime = `${hourOffset.toString().padStart(2, '0')}:00:00`;
        const endTime = `${hourOffset.toString().padStart(2, '0')}:30:00`;
        
        // Different statuses for variety
        const status = i === 0 ? 'confirmed' : statuses[(dIndex + pIndex) % statuses.length];
        
        appointments.push({
          doctor_id: doctorId,
          patient_id: patientId,
          appointment_date: formattedDate,
          start_time: startTime,
          end_time: endTime,
          status: status,
          notes: "This is a test appointment",
          is_test: true
        });
      }
    });
  });
  
  // Insert all appointments
  const { data, error } = await supabase
    .from('appointments')
    .insert(appointments);
    
  if (error) {
    console.error("Error creating sample appointments:", error);
  } else {
    console.log(`Created ${appointments.length} test appointments`);
  }
}

/**
 * Get all test profiles from the database
 */
export async function getTestProfiles() {
  try {
    // Get test doctors
    const { data: doctors, error: doctorsError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'doctor')
      .eq('is_test', true)
      .order('rating', { ascending: false });
      
    if (doctorsError) {
      console.error("Error fetching test doctors:", doctorsError);
    }
    
    // Get test patients
    const { data: patients, error: patientsError } = await supabase
      .from('profiles')
      .select('*')
      .eq('role', 'patient')
      .eq('is_test', true);
      
    if (patientsError) {
      console.error("Error fetching test patients:", patientsError);
    }
    
    return {
      doctors: doctors || [],
      patients: patients || []
    };
  } catch (error) {
    console.error("Error getting test profiles:", error);
    return { doctors: [], patients: [] };
  }
} 