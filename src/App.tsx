import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/components/auth/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import PatientDashboard from "./pages/patient/Dashboard";
import FindDoctor from "./pages/patient/FindDoctor";
import DoctorProfile from "./pages/patient/DoctorProfile";
import Appointments from "./pages/patient/Appointments";
import Records from "./pages/patient/Records";
import Messages from "./pages/patient/Messages";
import Profile from "./pages/patient/Profile";
import Notifications from "./pages/patient/Notifications";
import DoctorDashboard from "./pages/doctor/Dashboard";
import DoctorAuth from "./pages/doctor/Auth";
import DoctorAppointments from "./pages/doctor/Appointments";
import DoctorNotifications from "./pages/doctor/Notifications";
import DevTools from "./pages/DevTools";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/auth" element={<Auth />} />
              
              {/* Patient routes - no authentication required */}
              <Route path="/patient/find-doctor" element={<FindDoctor />} />
              <Route path="/patient/doctor/:doctorId" element={<DoctorProfile />} />
              
              {/* Doctor authentication and routes */}
              <Route path="/doctor/auth" element={<DoctorAuth />} />
              <Route path="/doctor" element={<DoctorDashboard />} />
              <Route path="/doctor/appointments" element={<DoctorAppointments />} />
              <Route path="/doctor/notifications" element={<DoctorNotifications />} />
              
              {/* Legacy routes */}
              <Route path="/patient" element={<PatientDashboard />} />
              <Route path="/patient/appointments" element={<Appointments />} />
              <Route path="/patient/records" element={<Records />} />
              <Route path="/patient/messages" element={<Messages />} />
              <Route path="/patient/profile" element={<Profile />} />
              <Route path="/patient/notifications" element={<Notifications />} />
              
              {/* Developer tools */}
              <Route path="/dev" element={<DevTools />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
