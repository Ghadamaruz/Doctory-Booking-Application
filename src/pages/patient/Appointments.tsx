
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  ArrowRight, 
  Clock, 
  Video, 
  MapPin, 
  AlertCircle, 
  CheckCircle2,
  XCircle,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

type Appointment = {
  id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes: string | null;
  doctorName?: string;
  doctorSpecialty?: string;
  doctorImage?: string;
  type?: string;
  address?: string;
};

export default function Appointments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState<Appointment | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [appointmentToReject, setAppointmentToReject] = useState<Appointment | null>(null);
  const [reason, setReason] = useState("");
  
  useEffect(() => {
    if (!user) return;
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Check if user is a doctor (for demonstration)
      const isDoctor = user?.profile?.role === 'doctor';
      
      // Fetch appointments based on user role
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq(isDoctor ? 'doctor_id' : 'patient_id', user.id);

      if (error) throw error;

      // Fetch doctor profiles for these appointments
      const enhancedAppointments = await Promise.all(
        (data || []).map(async (appointment) => {
          // Get doctor profile
          const { data: doctorData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', appointment.doctor_id)
            .single();

          return {
            ...appointment,
            doctorName: doctorData ? `Dr. ${doctorData.first_name || ''} ${doctorData.last_name || ''}` : 'Unknown Doctor',
            doctorSpecialty: "Cardiology", // Mock data
            doctorImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
            type: Math.random() > 0.5 ? "video" : "in-person", // Mock data
            address: "123 Medical Center, New York, NY" // Mock data
          };
        })
      );

      setAppointments(enhancedAppointments);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      toast({
        title: "Error",
        description: "Failed to load appointments",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRequest = (appointment: Appointment) => {
    setAppointmentToCancel(appointment);
    setCancelDialogOpen(true);
  };

  const handleRejectRequest = (appointment: Appointment) => {
    setAppointmentToReject(appointment);
    setRejectDialogOpen(true);
  };

  const confirmCancel = async () => {
    if (!appointmentToCancel) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'canceled' })
        .eq('id', appointmentToCancel.id);

      if (error) throw error;

      toast({
        title: "Appointment Canceled",
        description: "Your appointment has been successfully canceled",
      });

      setCancelDialogOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Error canceling appointment:", error);
      toast({
        title: "Error",
        description: "Failed to cancel appointment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const confirmReject = async () => {
    if (!appointmentToReject) return;
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ 
          status: 'rejected',
          notes: reason || "Appointment rejected by doctor"
        })
        .eq('id', appointmentToReject.id);

      if (error) throw error;

      toast({
        title: "Appointment Rejected",
        description: "The appointment request has been rejected",
      });

      setRejectDialogOpen(false);
      fetchAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      toast({
        title: "Error",
        description: "Failed to reject appointment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
      setReason("");
    }
  };

  const handleConfirmAppointment = async (appointmentId: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId);

      if (error) throw error;

      toast({
        title: "Appointment Confirmed",
        description: "The appointment has been confirmed",
      });

      fetchAppointments();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Error",
        description: "Failed to confirm appointment",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle2 className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200"><AlertCircle className="h-3 w-3 mr-1" />Pending</Badge>;
      case "completed":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
      case "canceled":
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-200"><XCircle className="h-3 w-3 mr-1" />Canceled</Badge>;
      case "rejected":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-200"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return null;
    }
  };

  const formatAppointmentDate = (dateString: string) => {
    try {
      return format(parseISO(dateString), 'MMM d, yyyy');
    } catch (error) {
      console.error("Date formatting error:", error);
      return dateString;
    }
  };

  const formatAppointmentTime = (timeString: string) => {
    try {
      // Parse time - add a date to make it a valid datetime
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return format(date, 'h:mm a');
    } catch (error) {
      console.error("Time formatting error:", error);
      return timeString;
    }
  };

  const upcomingAppointments = appointments.filter(
    app => app.status === "confirmed" || app.status === "pending"
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === "completed" || app.status === "canceled" || app.status === "rejected"
  );

  const isDoctor = user?.profile?.role === 'doctor';

  return (
    <PatientLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-purple-600" />
              Your Appointments
            </CardTitle>
            <CardDescription>
              Manage all your upcoming and past medical appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-lg font-medium">Summary</h3>
                <p className="text-sm text-gray-500">You have {upcomingAppointments.length} upcoming appointments</p>
              </div>
              {!isDoctor && (
                <Button onClick={() => window.location.href = "/patient/find-doctor"}>
                  Book New Appointment
                </Button>
              )}
            </div>

            {upcomingAppointments.length > 0 && (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Upcoming Appointment Card */}
                <Card>
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Next Appointment</p>
                          <h3 className="font-semibold">{upcomingAppointments[0].doctorName}</h3>
                          <p className="text-sm text-gray-500">{upcomingAppointments[0].doctorSpecialty}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{formatAppointmentDate(upcomingAppointments[0].appointment_date)}</p>
                          <p className="text-sm text-gray-500">{formatAppointmentTime(upcomingAppointments[0].start_time)}</p>
                        </div>
                      </div>
                      {upcomingAppointments[0].type === "video" ? (
                        <Button variant="outline" className="w-full">
                          Join Video Call <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      ) : (
                        <Button variant="outline" className="w-full">
                          View Details <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Appointments Tabs */}
        <Card>
          <CardHeader>
            <Tabs defaultValue="upcoming" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
            
              <TabsContent value="upcoming" className="mt-0">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {upcomingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {upcomingAppointments.map((appointment) => (
                          <Card key={appointment.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/4 bg-gray-100 p-4 flex items-center justify-center">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold">{appointment.appointment_date ? format(parseISO(appointment.appointment_date), "d") : ""}</p>
                                    <p className="text-gray-600 font-medium">{appointment.appointment_date ? format(parseISO(appointment.appointment_date), "MMM yyyy") : ""}</p>
                                    <p className="mt-2 flex items-center justify-center text-sm">
                                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                      {formatAppointmentTime(appointment.start_time)}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="p-4 flex-1">
                                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-shrink-0">
                                      <img 
                                        src={appointment.doctorImage} 
                                        alt={appointment.doctorName} 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                                      />
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h3 className="font-bold">{appointment.doctorName}</h3>
                                          <p className="text-gray-600">{appointment.doctorSpecialty}</p>
                                        </div>
                                        <div>
                                          {getStatusBadge(appointment.status)}
                                        </div>
                                      </div>
                                      
                                      <p className="text-gray-600 flex items-center">
                                        {appointment.type === "video" ? (
                                          <>
                                            <Video className="h-4 w-4 mr-1 text-gray-500" />
                                            Video Consultation
                                          </>
                                        ) : (
                                          <>
                                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                            {appointment.address}
                                          </>
                                        )}
                                      </p>

                                      {appointment.notes && (
                                        <p className="text-gray-600 text-sm italic">
                                          Note: {appointment.notes}
                                        </p>
                                      )}
                                      
                                      <div className="pt-2 flex flex-wrap gap-2">
                                        {appointment.status === "confirmed" && appointment.type === "video" && (
                                          <Button size="sm">
                                            Join Video Call <ArrowRight className="ml-1 h-4 w-4" />
                                          </Button>
                                        )}
                                        
                                        <Button variant="outline" size="sm">
                                          View Details
                                        </Button>

                                        {isDoctor && appointment.status === "pending" && (
                                          <>
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                              onClick={() => handleConfirmAppointment(appointment.id)}
                                            >
                                              Confirm
                                            </Button>
                                            <Button 
                                              variant="outline" 
                                              size="sm" 
                                              className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                              onClick={() => handleRejectRequest(appointment)}
                                            >
                                              Reject
                                            </Button>
                                          </>
                                        )}
                                        
                                        {!isDoctor && appointment.status !== "completed" && (
                                          <Button 
                                            variant="outline" 
                                            size="sm" 
                                            className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                            onClick={() => handleCancelRequest(appointment)}
                                          >
                                            Cancel
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <Calendar className="h-6 w-6 text-gray-500" />
                        </div>
                        <h3 className="font-medium text-lg">No Upcoming Appointments</h3>
                        <p className="text-gray-500 mt-1 mb-4">
                          You don't have any upcoming appointments scheduled
                        </p>
                        {!isDoctor && (
                          <Button onClick={() => window.location.href = "/patient/find-doctor"}>
                            Book an Appointment
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-0">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {pastAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {pastAppointments.map((appointment) => (
                          <Card key={appointment.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/4 bg-gray-100 p-4 flex items-center justify-center">
                                  <div className="text-center">
                                    <p className="text-2xl font-bold">{appointment.appointment_date ? format(parseISO(appointment.appointment_date), "d") : ""}</p>
                                    <p className="text-gray-600 font-medium">{appointment.appointment_date ? format(parseISO(appointment.appointment_date), "MMM yyyy") : ""}</p>
                                    <p className="mt-2 flex items-center justify-center text-sm">
                                      <Clock className="h-4 w-4 mr-1 text-gray-500" />
                                      {formatAppointmentTime(appointment.start_time)}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="p-4 flex-1">
                                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                                    <div className="flex-shrink-0">
                                      <img 
                                        src={appointment.doctorImage} 
                                        alt={appointment.doctorName} 
                                        className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                                      />
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h3 className="font-bold">{appointment.doctorName}</h3>
                                          <p className="text-gray-600">{appointment.doctorSpecialty}</p>
                                        </div>
                                        <div>
                                          {getStatusBadge(appointment.status)}
                                        </div>
                                      </div>
                                      
                                      <p className="text-gray-600 flex items-center">
                                        {appointment.type === "video" ? (
                                          <>
                                            <Video className="h-4 w-4 mr-1 text-gray-500" />
                                            Video Consultation
                                          </>
                                        ) : (
                                          <>
                                            <MapPin className="h-4 w-4 mr-1 text-gray-500" />
                                            {appointment.address}
                                          </>
                                        )}
                                      </p>

                                      {appointment.notes && (
                                        <p className="text-gray-600 text-sm italic">
                                          Note: {appointment.notes}
                                        </p>
                                      )}
                                      
                                      <div className="pt-2 flex gap-2">
                                        <Button variant="outline" size="sm">
                                          View Details
                                        </Button>
                                        
                                        {!isDoctor && (
                                          <Button variant="outline" size="sm">
                                            Book Again
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                          <User className="h-6 w-6 text-gray-500" />
                        </div>
                        <h3 className="font-medium text-lg">No Past Appointments</h3>
                        <p className="text-gray-500 mt-1">
                          You don't have any past appointment records
                        </p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
            </Tabs>
          </CardHeader>
          <CardContent>
            {/* The content is now properly inside the Tabs component */}
          </CardContent>
        </Card>
      </div>

      {/* Cancel Confirmation Dialog */}
      <Dialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancel Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to cancel this appointment? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCancelDialogOpen(false)} disabled={loading}>
              Keep Appointment
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmCancel}
              disabled={loading}
            >
              {loading ? "Canceling..." : "Yes, Cancel Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Appointment Dialog (for doctors) */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Appointment Request</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this appointment request.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-2">
            <textarea
              className="w-full p-2 border rounded-md"
              rows={3}
              placeholder="Reason for rejection (optional)"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            ></textarea>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)} disabled={loading}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmReject}
              disabled={loading}
            >
              {loading ? "Rejecting..." : "Reject Appointment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </PatientLayout>
  );
}
