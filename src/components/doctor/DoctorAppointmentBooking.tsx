import { useState, useEffect } from "react";
import { format, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

interface DoctorAppointmentBookingProps {
  doctorId: string;
  onTimeSelect: (time: string) => void;
  onShowConfirmation: () => void;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  setSelectedDate: (date: Date | undefined) => void;
  loading: boolean;
}

export function DoctorAppointmentBooking({
  doctorId,
  onTimeSelect,
  onShowConfirmation,
  selectedDate,
  selectedTime,
  setSelectedDate,
  loading
}: DoctorAppointmentBookingProps) {
  const [availableTimeSlots, setAvailableTimeSlots] = useState<string[]>([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    if (!selectedDate || !doctorId) return;

    const fetchAvailableSlots = async () => {
      setLoadingSlots(true);
      try {
        const dayOfWeek = selectedDate.getDay();
        const formattedDate = format(selectedDate, 'yyyy-MM-dd');
        
        const { data: availability, error: availabilityError } = await supabase
          .from('doctor_availability')
          .select('start_time, end_time')
          .eq('doctor_id', doctorId)
          .eq('day_of_week', dayOfWeek);

        if (availabilityError || !availability || availability.length === 0) {
          toast({
            title: "No Availability",
            description: "Doctor is not available on this day",
          });
          setAvailableTimeSlots([]);
          return;
        }

        const { data: appointments } = await supabase
          .from('appointments')
          .select('*')
          .eq('doctor_id', doctorId)
          .eq('appointment_date', formattedDate);

        const allSlots: string[] = [];
        
        availability.forEach(slot => {
          const slots = generateTimeSlots(slot.start_time, slot.end_time);
          allSlots.push(...slots);
        });

        const availableSlots = allSlots.filter(timeSlot => {
          return !appointments?.some(appointment => appointment.start_time === timeSlot);
        });

        setAvailableTimeSlots(availableSlots);
      } catch (error) {
        console.error("Error fetching availability:", error);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [doctorId, selectedDate]);

  const generateTimeSlots = (startTime: string, endTime: string) => {
    const start = new Date(`1970-01-01T${startTime}`);
    const end = new Date(`1970-01-01T${endTime}`);
    const slots: string[] = [];

    while (start < end) {
      slots.push(format(start, 'HH:mm:ss'));
      start.setMinutes(start.getMinutes() + 30);
    }

    return slots;
  };

  const formatDisplayTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <h3 className="font-medium">{t('selectDate')}</h3>
          <div className="border rounded-md p-2">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
              className="p-3 pointer-events-auto"
            />
          </div>
        </div>
        
        {selectedDate && (
          <div className="space-y-2">
            <h3 className="font-medium">{t('selectTime')}</h3>
            {loadingSlots ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            ) : (
              <>
                {availableTimeSlots.length > 0 ? (
                  <div className="grid grid-cols-3 gap-2">
                    {availableTimeSlots.map((slot) => (
                      <Button
                        key={slot}
                        variant={selectedTime === slot ? "default" : "outline"}
                        className="flex items-center justify-center text-sm py-1"
                        onClick={() => onTimeSelect(slot)}
                        size="sm"
                      >
                        <Clock className="h-3 w-3 mr-1" />
                        {formatDisplayTime(slot)}
                      </Button>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 py-2">{t('noAvailableSlots')}</p>
                )}
              </>
            )}
          </div>
        )}
        
        <Button 
          className="w-full mt-4" 
          onClick={onShowConfirmation}
          disabled={!selectedDate || !selectedTime || loading}
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {t('processing')}...
            </>
          ) : t('bookAppointment')}
        </Button>
        
        <p className="text-xs text-gray-500 mt-2">
          {t('appointmentRequestInfo')}
        </p>
      </div>
    </div>
  );
}
