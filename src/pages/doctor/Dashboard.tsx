
import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calendar, FileText, Users, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

type AppointmentSlot = {
  id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
};

export default function DoctorDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [appointmentSlots, setAppointmentSlots] = useState<AppointmentSlot[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(true);

  useEffect(() => {
    // Redirect if not a doctor
    if (!loading && (!user || user.profile?.role !== 'doctor')) {
      toast.error("Unauthorized access. Please log in as a doctor.");
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    if (user && user.profile?.role === "doctor") {
      setLoadingSlots(true);
      supabase
        .from("appointments")
        .select("*")
        .eq("doctor_id", user.id)
        .limit(5)
        .then(({ data, error }) => {
          if (error) {
            toast.error("Failed to load appointments");
            setAppointmentSlots([]);
          } else {
            setAppointmentSlots(data || []);
          }
          setLoadingSlots(false);
        });
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="container mx-auto p-6 flex justify-center items-center min-h-[50vh]">
          <p>Loading...</p>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto p-6">
        <Card className="mb-6 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-slate-800 dark:to-slate-900 border-none shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {t('doctorDashboard')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl mb-4">{t('welcomeDoctor')} {user?.profile?.last_name || user?.profile?.first_name}</p>
            <p className="text-muted-foreground">
              {t('doctorDashboard')} where you can manage appointments, 
              view patient records, and update your availability.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card className="bg-white/50 dark:bg-slate-900/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center space-y-0 gap-4">
              <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>{t('upcomingAppointments')}</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingSlots ? (
                <p className="text-center text-muted-foreground py-6">Loading...</p>
              ) : appointmentSlots.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">{t('noUpcomingAppointments')}</p>
              ) : (
                <ul className="space-y-2">
                  {appointmentSlots.map(slot => (
                    <li key={slot.id} className="border rounded p-2">
                      <div>{new Date(slot.appointment_date).toLocaleDateString()} - {slot.start_time} to {slot.end_time}</div>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-900/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center space-y-0 gap-4">
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>{t('patientRecords')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">
                {t('noPatientRecords')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/50 dark:bg-slate-900/50 hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center space-y-0 gap-4">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>{t('mySchedule')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-6">
                {t('noAvailabilitySet')}
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className="hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950 dark:hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('signOut')}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
