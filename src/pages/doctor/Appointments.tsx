import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { DoctorLayout } from "@/components/layout/DoctorLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  CheckCircle2,
  XCircle,
  Clock, 
  Video,
  MapPin,
  AlertCircle,
  User
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { format, parseISO } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Appointment } from "@/types/doctor";
import { useNavigate } from "react-router-dom";

export default function DoctorAppointments() {
  const [activeTab, setActiveTab] = useState("pending");
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [appointmentToReject, setAppointmentToReject] = useState<Appointment | null>(null);
  const [reason, setReason] = useState("");
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!user) return;
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Fetch appointments for the doctor
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('doctor_id', user.id);

      if (error) throw error;

      // Fetch patient profiles for these appointments
      const enhancedAppointments: Appointment[] = await Promise.all(
        (data || []).map(async (appointment: any) => {
          // Get patient profile
          const { data: patientData } = await supabase
            .from('profiles')
            .select('first_name, last_name')
            .eq('id', appointment.patient_id)
            .single();

          return {
            ...appointment,
            patient_name: patientData ? `${patientData.first_name || ''} ${patientData.last_name || ''}` : 'Unknown Patient',
            type: Math.random() > 0.5 ? "video" : "in-person", // Mock data
            address: "123 Medical Center, New York, NY" // Mock data
          } as Appointment;
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

  const handleRejectRequest = (appointment: Appointment) => {
    setAppointmentToReject(appointment);
    setRejectDialogOpen(true);
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

      // Create notification for the patient
      await createNotification({
        user_id: appointmentToReject.patient_id,
        title: "Appointment Rejected",
        message: `Your appointment on ${format(parseISO(appointmentToReject.appointment_date), 'MMM d, yyyy')} at ${formatAppointmentTime(appointmentToReject.start_time)} has been rejected.${reason ? ` Reason: ${reason}` : ''}`,
        related_id: appointmentToReject.id,
        type: "appointment"
      }, supabase);

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

  const handleConfirmAppointment = async (appointmentId: string, patientId: string, appointmentDate: string, appointmentTime: string) => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status: 'confirmed' })
        .eq('id', appointmentId);

      if (error) throw error;

      // Create notification for the patient
      await createNotification({
        user_id: patientId,
        title: "Appointment Confirmed",
        message: `Your appointment on ${format(parseISO(appointmentDate), 'MMM d, yyyy')} at ${formatAppointmentTime(appointmentTime)} has been confirmed.`,
        related_id: appointmentId,
        type: "appointment"
      }, supabase);

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

  // Filter appointments based on status
  const pendingAppointments = appointments.filter(
    app => app.status === "pending"
  );
  
  const upcomingAppointments = appointments.filter(
    app => app.status === "confirmed" && new Date(`${app.appointment_date}T${app.start_time}`) > new Date()
  );
  
  const pastAppointments = appointments.filter(
    app => app.status === "completed" || app.status === "canceled" || app.status === "rejected" || 
           (app.status === "confirmed" && new Date(`${app.appointment_date}T${app.start_time}`) <= new Date())
  );

  return (
    <DoctorLayout>
      <div className="space-y-8">
        {/* Header Section */}
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-6 w-6 text-blue-600" />
              Appointment Management
            </CardTitle>
            <CardDescription>
              Review and manage your patient appointments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-lg font-medium">Appointment Summary</h3>
                <p className="text-sm text-gray-500">
                  You have {pendingAppointments.length} pending requests and {upcomingAppointments.length} upcoming appointments
                </p>
              </div>
              <Button onClick={() => navigate("/doctor/availability")}>
                Manage Availability
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Tabs */}
        <Card>
          <CardHeader>
            <Tabs defaultValue="pending" onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Requests {pendingAppointments.length > 0 && `(${pendingAppointments.length})`}
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  Upcoming {upcomingAppointments.length > 0 && `(${upcomingAppointments.length})`}
                </TabsTrigger>
                <TabsTrigger value="past">Past</TabsTrigger>
              </TabsList>
              
              <TabsContent value="pending" className="mt-0">
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {pendingAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {pendingAppointments.map((appointment) => (
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
                                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-8 w-8 text-blue-600" />
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h3 className="font-bold">{appointment.patient_name}</h3>
                                          <p className="text-gray-600">Appointment Request</p>
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
                                      
                                      <div className="pt-2 flex flex-wrap gap-2">
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="text-green-500 hover:text-green-600 hover:bg-green-50"
                                          onClick={() => handleConfirmAppointment(appointment.id, appointment.patient_id, appointment.appointment_date, appointment.start_time)}
                                          disabled={loading}
                                        >
                                          Confirm
                                        </Button>
                                        <Button 
                                          variant="outline" 
                                          size="sm" 
                                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                                          onClick={() => handleRejectRequest(appointment)}
                                          disabled={loading}
                                        >
                                          Reject
                                        </Button>
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
                        <h3 className="font-medium text-lg">No Pending Requests</h3>
                        <p className="text-gray-500 mt-1">
                          You don't have any pending appointment requests
                        </p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
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
                                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-8 w-8 text-blue-600" />
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h3 className="font-bold">{appointment.patient_name}</h3>
                                          <p className="text-gray-600">Confirmed Appointment</p>
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
                                      
                                      <div className="pt-2 flex gap-2">
                                        {appointment.type === "video" && (
                                          <Button size="sm">
                                            Start Video Call
                                          </Button>
                                        )}
                                        <Button variant="outline" size="sm">
                                          View Patient Details
                                        </Button>
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
                        <p className="text-gray-500 mt-1">
                          You don't have any upcoming appointments scheduled
                        </p>
                      </div>
                    )}
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="past" className="mt-0">
                {/* Similar to the above tabs content, with past appointments */}
                {loading ? (
                  <div className="flex justify-center py-10">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                  </div>
                ) : (
                  <>
                    {pastAppointments.length > 0 ? (
                      <div className="space-y-4">
                        {/* Past appointments list */}
                        {pastAppointments.map((appointment) => (
                          <Card key={appointment.id} className="overflow-hidden">
                            <CardContent className="p-0">
                              {/* Similar structure to above appointment cards */}
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
                                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                                        <User className="h-8 w-8 text-blue-600" />
                                      </div>
                                    </div>
                                    
                                    <div className="flex-1 space-y-2">
                                      <div className="flex items-start justify-between">
                                        <div>
                                          <h3 className="font-bold">{appointment.patient_name}</h3>
                                          <p className="text-gray-600">{appointment.status === "completed" ? "Completed Appointment" : appointment.status === "rejected" ? "Rejected Request" : "Canceled Appointment"}</p>
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
                                      
                                      <div className="pt-2">
                                        <Button variant="outline" size="sm">
                                          View Details
                                        </Button>
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
        </Card>
      </div>

      {/* Reject Appointment Dialog */}
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
    </DoctorLayout>
  );
}
