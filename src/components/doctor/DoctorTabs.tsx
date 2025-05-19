
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MapPin, Phone, Mail } from "lucide-react";
import { Doctor } from "@/types/doctor";

interface DoctorTabsProps {
  doctor: Doctor;
}

export function DoctorTabs({ doctor }: DoctorTabsProps) {
  return (
    <Tabs defaultValue="about">
      <TabsList className="mb-4">
        <TabsTrigger value="about">About</TabsTrigger>
        <TabsTrigger value="reviews">Reviews</TabsTrigger>
        <TabsTrigger value="location">Location</TabsTrigger>
      </TabsList>
      
      <TabsContent value="about" className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Biography</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Dr. {doctor.first_name} {doctor.last_name} is a renowned specialist with {doctor.experience} of practical experience. Specializing in {doctor.specialty}, the doctor has helped numerous patients with various conditions and health concerns.</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Education & Training</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start">
                <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">MD in {doctor.specialty}</p>
                  <p className="text-sm text-gray-500">Harvard Medical School • 2010</p>
                </div>
              </li>
              <li className="flex items-start">
                <div className="mr-2 mt-1 bg-blue-100 p-1 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium">Residency in {doctor.specialty}</p>
                  <p className="text-sm text-gray-500">Mayo Clinic • 2013</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="reviews">
        <Card>
          <CardHeader>
            <CardTitle>Patient Reviews</CardTitle>
            <p className="text-sm text-gray-500">
              {doctor.reviews?.length} reviews • {doctor.rating} average rating
            </p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {doctor.reviews?.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-0">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{review.user}</p>
                      <p className="text-sm text-gray-500">{review.date}</p>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="location">
        <Card>
          <CardHeader>
            <CardTitle>Office Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="text-gray-700 mb-2">
                <MapPin className="h-4 w-4 inline mr-2" />
                123 Medical Center, New York, NY
              </p>
              <p className="text-gray-700 mb-2">
                <Phone className="h-4 w-4 inline mr-2" />
                (212) 555-1234
              </p>
              <p className="text-gray-700">
                <Mail className="h-4 w-4 inline mr-2" />
                {doctor.email || `dr.${doctor.first_name?.toLowerCase()}@medclinic.com`}
              </p>
            </div>
            <div className="bg-gray-200 h-40 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">Map placeholder</p>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
