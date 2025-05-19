import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import { MapPin, Star, Search, Loader2 } from "lucide-react";
import useSearchDoctors from "@/hooks/useSearchDoctors";
import { Doctor } from "@/types/doctor";
import { getTestProfiles, seedTestAccounts } from "@/lib/seedDatabase";

export default function FindDoctor() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") || "");
  const initialQuery = searchParams.get("q") || "";
  
  // Use the custom hook to search for doctors
  const { 
    doctors, 
    isLoading, 
    error, 
    setSearchQuery 
  } = useSearchDoctors(initialQuery, { sortByRating: true });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    setSearchQuery(query);
    
    if (query) {
      navigate(`/patient/find-doctor?q=${query}`);
    } else {
      navigate("/patient/find-doctor");
    }
  };

  // Function to create test data if none exists
  const createTestDoctors = async () => {
    try {
      // First check if we already have test doctors
      const { doctors } = await getTestProfiles();
      
      if (doctors && doctors.length > 0) {
        toast({
          title: "Test Doctors Available",
          description: `${doctors.length} test doctors already exist. Go to Dev Tools to manage test data.`,
        });
        return;
      }
      
      // If no test doctors exist, create them
      toast({
        title: "Creating Test Doctors",
        description: "Please wait while we set up test data...",
      });
      
      const result = await seedTestAccounts();
      
      if (result.success) {
        toast({
          title: "Test Doctors Created",
          description: "You can now search for test doctors",
        });
        // Refresh the search to display the new test doctors
        setSearchQuery(searchTerm);
      } else {
        toast({
          title: "Error",
          description: "Failed to create test doctors. Check console for details.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error creating test doctors:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      {/* Search Header */}
      <Card className="mb-4">
        <CardHeader>
          <CardTitle>Find a Doctor</CardTitle>
          <CardDescription>Search for doctors by name or specialty</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
            <Input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
            <div className="flex gap-2 w-full sm:w-auto">
              <Button type="submit" className="flex-1 sm:flex-initial">
                <Search className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button 
                onClick={createTestDoctors} 
                variant="outline" 
                type="button"
                className="flex-1 sm:flex-initial"
              >
                Create Test Doctors
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Doctor List */}
      <Card>
        <CardHeader>
          <CardTitle>Available Doctors</CardTitle>
          <CardDescription>
            {isLoading 
              ? "Searching for doctors..." 
              : searchTerm 
                ? `Search results for "${searchTerm}"` 
                : "Browse our list of available doctors"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[60vh] w-full rounded-md border">
            <div className="p-4 space-y-4">
              {isLoading ? (
                <div className="flex justify-center items-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : doctors.length > 0 ? (
                doctors.map((doctor) => (
                  <div
                    key={doctor.id}
                    className="flex flex-col sm:flex-row items-center sm:items-start gap-4 p-4 rounded-md hover:bg-gray-100 transition-colors cursor-pointer border border-gray-100 hover:border-primary hover:shadow-md"
                    onClick={() => navigate(`/patient/doctor/${doctor.id}`)}
                  >
                    <Avatar className="w-16 h-16">
                      {doctor.image ? (
                        <img src={doctor.image} alt={`${doctor.first_name} ${doctor.last_name}`} className="object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-primary/10 text-lg font-semibold text-primary">
                          {doctor.first_name?.[0]}{doctor.last_name?.[0]}
                        </div>
                      )}
                    </Avatar>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-semibold">Dr. {doctor.first_name} {doctor.last_name}</h3>
                      <p className="text-gray-500">{doctor.specialty || "General Physician"}</p>
                      {doctor.experience && (
                        <p className="text-sm text-gray-500">{doctor.experience} experience</p>
                      )}
                      <div className="flex items-center justify-center sm:justify-start space-x-2 mt-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-medium">{doctor.rating?.toFixed(1) || "N/A"}</span>
                      </div>
                    </div>
                    <div className="flex sm:flex-col gap-2 mt-2 sm:mt-0">
                      <Button 
                        size="sm"
                        className="bg-primary hover:bg-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patient/doctor/${doctor.id}`);
                        }}
                      >
                        Book Appointment
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/patient/doctor/${doctor.id}`);
                        }}
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No doctors found matching your search.</p>
                  <Button 
                    onClick={createTestDoctors} 
                    variant="outline"
                  >
                    Create Test Doctors
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}
