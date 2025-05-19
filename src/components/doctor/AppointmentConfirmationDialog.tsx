
import { format } from "date-fns";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Doctor } from "@/types/doctor";

interface AppointmentConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  doctor: Doctor;
  selectedDate: Date | undefined;
  selectedTime: string | null;
  onConfirm: () => void;
  loading: boolean;
}

export function AppointmentConfirmationDialog({
  open,
  onOpenChange,
  doctor,
  selectedDate,
  selectedTime,
  onConfirm,
  loading
}: AppointmentConfirmationDialogProps) {
  const formatDisplayTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(hours, 10));
    date.setMinutes(parseInt(minutes, 10));
    return format(date, 'h:mm a');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Appointment Request</DialogTitle>
          <DialogDescription>
            You're about to request an appointment with Dr. {doctor.first_name} {doctor.last_name}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-gray-500">Date</h4>
              <p className="text-lg">{selectedDate ? format(selectedDate, 'MMMM d, yyyy') : ''}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">Time</h4>
              <p className="text-lg">{selectedTime ? formatDisplayTime(selectedTime) : ''}</p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500">Doctor</h4>
            <div className="flex items-center mt-1">
              <Avatar className="w-10 h-10 rounded-full mr-3">
                <img src={doctor.image} alt={doctor.first_name} className="w-full h-full object-cover" />
              </Avatar>
              <div>
                <p className="font-medium">Dr. {doctor.first_name} {doctor.last_name}</p>
                <p className="text-sm text-gray-500">{doctor.specialty}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Processing...
              </>
            ) : "Confirm Request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
