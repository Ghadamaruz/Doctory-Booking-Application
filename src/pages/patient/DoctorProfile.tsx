import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { Doctor } from "@/types/doctor";
import { DoctorHeader } from "@/components/doctor/DoctorHeader";
import { DoctorTabs } from "@/components/doctor/DoctorTabs";
import { DoctorAppointmentBooking } from "@/components/doctor/DoctorAppointmentBooking";
import { AppointmentConfirmationDialog } from "@/components/doctor/AppointmentConfirmationDialog";
import { Dialog, DialogTitle, DialogContent, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useTranslation } from "react-i18next";
import { Loader2, CalendarIcon } from "lucide-react";

// Guest booking form schema
const guestBookingSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters" }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  phone: z.string().min(6, { message: "Please enter a valid phone number" }),
});

type GuestBookingFormValues = z.infer<typeof guestBookingSchema>;

export default function DoctorProfile() {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingDialogOpen, setBookingDialogOpen] = useState(true);
  const { t } = useTranslation();

  // Guest booking form
  const guestForm = useForm<GuestBookingFormValues>({
    resolver: zodResolver(guestBookingSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (!doctorId) return;
    
    const fetchDoctorProfile = async () => {
      setLoading(true);
      try {
        // First, attempt to fetch from profiles table
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', doctorId)
          .eq('role', 'doctor')
          .single();

        if (error) {
          console.error("Doctor profile fetch error:", error);
          
          // If there's an error or no data, use mock data instead
          // This is a fallback for testing/development
          const mockDoctor: Doctor = {
            id: doctorId,
            first_name: "John",
            last_name: "Wilson",
            specialty: "Cardiology",
            experience: "10+ years",
            rating: 4.8,
            image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            email: `dr.wilson@example.com`,
            reviews: [
              {
                id: "1",
                user: "Jane Doe",
                rating: 5,
                date: "2023-04-15",
                comment: "Dr. Wilson is an excellent physician. Very thorough and explains everything clearly."
              },
              {
                id: "2",
                user: "John Smith",
                rating: 4,
                date: "2023-03-22",
                comment: "Great experience. The doctor took time to answer all my questions."
              }
            ]
          };
          
          setDoctor(mockDoctor);
          
          toast({
            title: "Using mock data",
            description: "Could not fetch doctor profile, using sample data instead",
            variant: "default"
          });
          
          return;
        }

        // Successfully fetched data from profiles table
        // Note: After our SQL migration, the database now has all the doctor-specific fields
        const doctorProfile: Doctor = {
          ...data,
          // Use the actual data but provide fallbacks for potentially missing values
          specialty: data.specialty || "Cardiology",
          experience: data.experience || "10+ years",
          rating: data.rating || 4.8,
          image: data.image || "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
          reviews: [
            {
              id: "1",
              user: "Jane Doe",
              rating: 5,
              date: "2023-04-15",
              comment: "Dr. Wilson is an excellent physician. Very thorough and explains everything clearly."
            },
            {
              id: "2",
              user: "John Smith",
              rating: 4,
              date: "2023-03-22",
              comment: "Great experience. The doctor took time to answer all my questions."
            }
          ]
        };

        setDoctor(doctorProfile);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorProfile();
  }, [doctorId]);

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time);
  };

  const handleShowConfirmation = () => {
    if (!selectedDate || !selectedTime) {
      toast({
        title: t("selectionRequired"),
        description: t("selectDateAndTime"),
      });
      return;
    }

    // If user is logged in, show the regular confirmation dialog
    // Otherwise, show the guest booking dialog
    if (user) {
      setConfirmDialogOpen(true);
    } else {
      setGuestDialogOpen(true);
    }
  };

  const handleBookAppointment = async () => {
    if (!doctorId || !selectedDate || !selectedTime) {
      toast({
        title: t("error"),
        description: t("selectDateAndTime"),
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      const startTime = new Date(`1970-01-01T${selectedTime}`);
      const endTime = new Date(startTime);
      endTime.setMinutes(endTime.getMinutes() + 30);
      
      // If user is logged in, use their ID
      // Otherwise create a guest appointment
      if (user) {
        const { error } = await supabase
          .from('appointments')
          .insert({
            patient_id: user.id,
            doctor_id: doctorId,
            appointment_date: format(selectedDate, 'yyyy-MM-dd'),
            start_time: selectedTime,
            end_time: format(endTime, 'HH:mm:ss'),
            status: 'pending'
          });

        if (error) {
          console.error("Booking error:", error);
          toast({
            title: t("bookingError"),
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        // Create notification for the doctor
        await supabase
          .from('notifications')
          .insert({
            user_id: doctorId,
            title: t('newAppointmentRequest'),
            message: `${user.profile?.first_name} ${user.profile?.last_name} ${t('hasRequestedAppointment')} ${format(selectedDate, 'MMM dd')} ${t('at')} ${selectedTime}`,
            type: 'appointment',
            related_id: doctorId
          });

        toast({
          title: t("appointmentBooked"),
          description: `${t('appointmentWith')} ${doctor?.first_name} ${doctor?.last_name} ${t('bookedSuccessfully')}`,
        });

        setConfirmDialogOpen(false);
        setBookingDialogOpen(false);
        navigate("/patient/appointments");
      } else {
        // Handle guest booking form submission
        const guestData = guestForm.getValues();
        
        // For guest bookings, we store their info in notes since we don't have guest fields in database
        const { error } = await supabase
          .from('appointments')
          .insert({
            doctor_id: doctorId,
            // For guest bookings, set patient_id to the doctor ID as a workaround
            // This is temporary until we add proper guest booking support in the database
            patient_id: doctorId, // This is a workaround
            appointment_date: format(selectedDate, 'yyyy-MM-dd'),
            start_time: selectedTime,
            end_time: format(endTime, 'HH:mm:ss'),
            status: 'pending',
            notes: JSON.stringify({
              isGuest: true,
              firstName: guestData.firstName,
              lastName: guestData.lastName,
              email: guestData.email,
              phone: guestData.phone
            })
          });

        if (error) {
          console.error("Guest booking error:", error);
          toast({
            title: t("bookingError"),
            description: error.message,
            variant: "destructive"
          });
          return;
        }

        // Create notification for the doctor about guest booking
        await supabase
          .from('notifications')
          .insert({
            user_id: doctorId,
            title: t('newGuestAppointmentRequest'),
            message: `${guestData.firstName} ${guestData.lastName} (${t('guest')}) ${t('hasRequestedAppointment')} ${format(selectedDate, 'MMM dd')} ${t('at')} ${selectedTime}`,
            type: 'appointment',
            related_id: doctorId
          });

        toast({
          title: t("appointmentBooked"),
          description: `${t('appointmentWith')} ${doctor?.first_name} ${doctor?.last_name} ${t('bookedSuccessfully')}`,
        });

        setGuestDialogOpen(false);
        setBookingDialogOpen(false);
        
        // Show success message with option to sign up
        toast({
          title: t("bookingSuccessful"),
          description: (
            <div className="space-y-2">
              <p>{t('guestBookingConfirmation')}</p>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/auth')}
              >
                {t('createAccount')}
              </Button>
            </div>
          ),
          duration: 10000,
        });
      }
    } catch (error) {
      console.error("Error booking appointment:", error);
      toast({
        title: t("bookingError"),
        description: t("unableToBookAppointment"),
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  // Guest booking form submit handler
  const onSubmitGuestForm = () => {
    handleBookAppointment();
  };

  if (loading && !doctor) return (
    <PatientLayout>
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">Loading doctor profile...</p>
        </div>
      </div>
    </PatientLayout>
  );

  if (!doctor) return (
    <PatientLayout>
      <Card>
        <div className="text-center py-8">
          <h2 className="text-xl font-semibold">Doctor not found</h2>
          <p className="text-gray-500 mt-2">The doctor profile you're looking for doesn't exist</p>
          <Button onClick={() => navigate("/patient/find-doctor")} className="mt-4">
            Back to Find Doctor
          </Button>
        </div>
      </Card>
    </PatientLayout>
  );

  return (
    <PatientLayout>
      <div className="space-y-8">
        <Card className="border-none shadow-none bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="pt-6">
            <DoctorHeader doctor={doctor} />
            
            {/* Quick Booking Button */}
            <div className="mt-4 flex justify-center">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-white"
                onClick={() => setBookingDialogOpen(true)}
              >
                <CalendarIcon className="mr-2 h-5 w-5" />
                Book Appointment
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <DoctorTabs doctor={doctor} />
          </div>
          
          <div>
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start" 
                    onClick={() => setBookingDialogOpen(true)}
                  >
                    <CalendarIcon className="mr-2 h-5 w-5" />
                    Schedule Appointment
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking dialog that appears by default */}
        <Dialog open={bookingDialogOpen} onOpenChange={setBookingDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogTitle>Book an Appointment with Dr. {doctor.first_name} {doctor.last_name}</DialogTitle>
            <DialogDescription>
              Select a date and time to book your appointment with {doctor.specialty} specialist.
            </DialogDescription>
            
            <div className="mt-4">
              <DoctorAppointmentBooking
                doctorId={doctorId!}
                onTimeSelect={handleTimeSelect}
                onShowConfirmation={handleShowConfirmation}
                selectedDate={selectedDate}
                selectedTime={selectedTime}
                setSelectedDate={setSelectedDate}
                loading={loading}
              />
            </div>
          </DialogContent>
        </Dialog>

        {/* Regular appointment confirmation dialog for logged in users */}
        <AppointmentConfirmationDialog
          open={confirmDialogOpen}
          onOpenChange={setConfirmDialogOpen}
          doctor={doctor}
          selectedDate={selectedDate}
          selectedTime={selectedTime}
          onConfirm={handleBookAppointment}
          loading={loading}
        />

        {/* Guest booking dialog */}
        <Dialog open={guestDialogOpen} onOpenChange={setGuestDialogOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogTitle>{t('guestBookingTitle')}</DialogTitle>
            <DialogDescription>
              {t('guestBookingDescription', {
                doctor: `${doctor.first_name} ${doctor.last_name}`,
                date: selectedDate ? format(selectedDate, 'MMM dd, yyyy') : '',
                time: selectedTime || ''
              })}
            </DialogDescription>
            
            <Form {...guestForm}>
              <form onSubmit={guestForm.handleSubmit(onSubmitGuestForm)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={guestForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('firstName')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={guestForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('lastName')}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={guestForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('email')}</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={guestForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('phone')}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter>
                  <Button 
                    variant="outline" 
                    onClick={() => setGuestDialogOpen(false)}
                    disabled={loading}
                  >
                    {t('cancel')}
                  </Button>
                  <Button 
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('booking')}...
                      </>
                    ) : t('confirmBooking')}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </PatientLayout>
  );
}
