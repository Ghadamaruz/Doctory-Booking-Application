
# Doctory - Medical Appointment Booking System

## Overview
Doctory is a bilingual (Arabic/English) medical appointment booking system that facilitates connections between patients and doctors. The application supports both Arabic and English interfaces with seamless language switching.

## Features

### Authentication & User Management
- User registration and login system ✅
- Role-based access (Patient/Doctor) ✅
- Profile management ✅
- Automatic session handling and persistence ✅
- Optional authentication for guests ✅

### Doctor Features
- Dashboard with appointment overview (In Progress)
- Availability management ✅
  - Set weekly schedules
  - Define working hours
- View and manage appointments (In Progress)
- Patient record access (Planned)

### Patient Features
- Browse available doctors ✅
- Book appointments (with or without authentication) ✅
- View appointment history ✅
- Manage medical records (Planned)
- Real-time appointment status updates (Planned)

## Implementation Progress

### Completed Features
- Authentication system with role-based access
- Guest access with optional sign-up after booking
- Doctor profile viewing with specialty, reviews, and location information
- Doctor availability management and time slot generation
- Patient appointment booking workflow (authenticated and guest users)
- Basic appointment management
- Authentication timeout handling with refresh capability

### In Progress
- Enhanced error handling
- Doctor dashboard for appointment management
- Real-time notifications
- Medical records management

### Database Structure

#### Tables

1. **profiles**
```sql
- id (UUID, PK)
- first_name (text)
- last_name (text)
- role (enum: 'patient', 'doctor', 'admin', 'super_admin')
- created_at (timestamp)
- updated_at (timestamp)
```

2. **doctor_availability**
```sql
- id (UUID, PK)
- doctor_id (UUID, FK to auth.users)
- day_of_week (integer, 0-6)
- start_time (time)
- end_time (time)
- created_at (timestamp)
```

3. **appointments**
```sql
- id (UUID, PK)
- doctor_id (UUID, FK to auth.users)
- patient_id (UUID, FK to auth.users)
- appointment_date (date)
- start_time (time)
- end_time (time)
- status (text: 'pending', 'confirmed', 'cancelled', 'completed')
- notes (text)
- created_at (timestamp)
```

### Security
- Row Level Security (RLS) policies implemented for all tables
- Role-based access control
- Secure authentication flow
- Support for guest access with appropriate security boundaries

### Internationalization
- Full support for Arabic and English
- RTL/LTR layout handling
- Language detection and persistence
- Translations for all UI elements

## Component Architecture

### Patient Flow
- **FindDoctor**: Browse and search for available doctors
- **DoctorProfile**: View doctor information and book appointments
  - **DoctorHeader**: Doctor's basic information and actions
  - **DoctorTabs**: Tabbed interface for About, Reviews, and Location
  - **DoctorAppointmentBooking**: Date and time selection for booking
  - **AppointmentConfirmationDialog**: Confirm appointment details

### Doctor Flow
- **DoctorDashboard**: Overview of upcoming appointments
- **AvailabilityManager**: Set and manage availability slots
- **AppointmentManager**: Handle appointment requests and management

### Authentication Flow
1. Users can browse and book appointments as guests
2. After booking, guests are prompted to create an account
3. Registration with email/password
4. Profile creation triggered automatically
5. Role assignment during registration
6. Automatic redirection based on role:
   - Doctors → Doctor Dashboard
   - Patients → Patient Dashboard

## Row Level Security Policies

### doctor_availability
- Doctors can manage their own availability
- Public can view all doctor availability

### appointments
- Doctors can view and update their appointments
- Patients can view their own appointments
- Patients can create new appointments

## Technical Notes for Developers

### Authentication System
- Authentication is implemented using Supabase Auth
- The system supports optional authentication for guests
- Authentication state is managed via the AuthProvider component
- The system includes timeout handling with manual refresh capability
- A 5-second timeout is set to prevent indefinite loading states

### State Management
- React Query is used for data fetching and state management
- Context API for auth state (AuthContext)
- Custom hooks for accessing authentication state (useAuth)

### Working with Profiles
- User profiles are automatically created on sign-up
- Profile data is cached and refreshed as needed
- For doctors, mock availability data is automatically generated

### Booking Flow
- The booking system checks doctor availability against the database
- Time slots are generated based on doctor availability and existing appointments
- Both authenticated users and guests can book appointments
- After booking, guests are prompted to create an account

### Code Organization
- Components are organized by feature and role (patient/doctor)
- Shared components are in the common directory
- Authentication components are in the auth directory
- Utilities are in the lib directory

### Key Files:
- `AuthProvider.tsx`: Manages authentication state and session handling
- `Auth.tsx`: Main authentication page with timeout handling
- `DoctorAppointmentBooking.tsx`: Core appointment booking functionality
- `lib/auth.ts`: Auth context and utility functions

## Getting Started

### Prerequisites
- Node.js & npm installed
- Supabase account

### Installation
1. Clone the repository
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### Environment Setup
The application uses Supabase for backend services. No additional environment variables needed as they are pre-configured in the project.

## Technology Stack
- Frontend: React + TypeScript
- UI Components: shadcn/ui
- Styling: Tailwind CSS
- Backend: Supabase
- State Management: React Query
- Internationalization: i18next
- Routing: React Router

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

