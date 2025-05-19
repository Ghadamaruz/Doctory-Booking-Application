
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Star, MapPin, User, Phone, Mail, Video } from "lucide-react";
import { Doctor } from "@/types/doctor";

interface DoctorHeaderProps {
  doctor: Doctor;
}

export function DoctorHeader({ doctor }: DoctorHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row gap-6 items-start">
      <Avatar className="w-24 h-24 rounded-lg border-4 border-white shadow-md">
        <img src={doctor.image} alt={doctor.first_name} className="w-full h-full object-cover" />
      </Avatar>
      
      <div className="space-y-2 flex-1">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h1 className="text-2xl font-bold">Dr. {doctor.first_name} {doctor.last_name}</h1>
            <p className="text-gray-500">{doctor.specialty}</p>
          </div>
          
          <div className="flex items-center space-x-1">
            <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
            <span className="font-semibold">{doctor.rating}</span>
            <span className="text-gray-500">({doctor.reviews?.length} reviews)</span>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline" className="flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            New York Medical Center
          </Badge>
          <Badge variant="outline" className="flex items-center gap-1">
            <User className="h-3 w-3" />
            {doctor.experience} experience
          </Badge>
        </div>
        
        <div className="flex gap-3 mt-4">
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            Call
          </Button>
          <Button size="sm" variant="outline" className="flex items-center gap-2">
            <Mail className="h-4 w-4" />
            Message
          </Button>
          <Button size="sm" className="flex items-center gap-2">
            <Video className="h-4 w-4" />
            Video Consult
          </Button>
        </div>
      </div>
    </div>
  );
}
