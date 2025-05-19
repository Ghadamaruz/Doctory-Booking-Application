import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, Database, Trash, RefreshCw } from "lucide-react";
import { seedTestAccounts, clearTestData, getTestProfiles } from "@/lib/seedDatabase";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function DatabaseSeeder() {
  const [isSeeding, setIsSeeding] = useState(false);
  const [isClearing, setIsClearing] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [seedResult, setSeedResult] = useState<{success: boolean, message: string} | null>(null);
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  
  const handleSeed = async () => {
    setIsSeeding(true);
    setSeedResult(null);
    try {
      const result = await seedTestAccounts();
      if (result.success) {
        toast({
          title: "Database Seeded Successfully",
          description: `Created test accounts with sample data`,
        });
        setSeedResult({
          success: true,
          message: "Test accounts created successfully!"
        });
        await fetchTestProfiles();
      } else {
        toast({
          variant: "destructive",
          title: "Seeding Failed",
          description: "Check console for details",
        });
        setSeedResult({
          success: false,
          message: "Failed to create test accounts. See console for details."
        });
      }
    } catch (error) {
      console.error("Error seeding database:", error);
      toast({
        variant: "destructive",
        title: "Seeding Failed",
        description: "Check console for details",
      });
      setSeedResult({
        success: false,
        message: `Error: ${error.message || "Unknown error"}`
      });
    } finally {
      setIsSeeding(false);
    }
  };
  
  const handleClear = async () => {
    setIsClearing(true);
    setSeedResult(null);
    try {
      const result = await clearTestData();
      if (result.success) {
        toast({
          title: "Test Data Cleared",
          description: "All test accounts and related data have been removed",
        });
        setSeedResult({
          success: true,
          message: "Test data cleared successfully!"
        });
        setDoctors([]);
        setPatients([]);
      } else {
        toast({
          variant: "destructive",
          title: "Clearing Failed",
          description: "Check console for details",
        });
        setSeedResult({
          success: false,
          message: "Failed to clear test data. See console for details."
        });
      }
    } catch (error) {
      console.error("Error clearing data:", error);
      toast({
        variant: "destructive",
        title: "Clearing Failed",
        description: "Check console for details",
      });
      setSeedResult({
        success: false,
        message: `Error: ${error.message || "Unknown error"}`
      });
    } finally {
      setIsClearing(false);
    }
  };
  
  const fetchTestProfiles = async () => {
    setIsFetching(true);
    try {
      const profiles = await getTestProfiles();
      setDoctors(profiles.doctors || []);
      setPatients(profiles.patients || []);
    } catch (error) {
      console.error("Error fetching test profiles:", error);
    } finally {
      setIsFetching(false);
    }
  };
  
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
        <Button 
          onClick={handleSeed} 
          disabled={isSeeding || isClearing || isFetching} 
          size="lg"
          className="flex-1"
        >
          {isSeeding ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Seeding Database...
            </>
          ) : (
            <>
              <Database className="mr-2 h-4 w-4" />
              Create Test Accounts
            </>
          )}
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleClear} 
          disabled={isSeeding || isClearing || isFetching}
          className="flex-1"
        >
          {isClearing ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Clearing Test Data...
            </>
          ) : (
            <>
              <Trash className="mr-2 h-4 w-4" />
              Clear Test Data
            </>
          )}
        </Button>
        
        <Button
          variant="ghost"
          onClick={fetchTestProfiles}
          disabled={isSeeding || isClearing || isFetching}
          size="icon"
        >
          <RefreshCw className={`h-4 w-4 ${isFetching ? 'animate-spin' : ''}`} />
        </Button>
      </div>
      
      {seedResult && (
        <Alert variant={seedResult.success ? "default" : "destructive"}>
          <AlertTitle>{seedResult.success ? "Success" : "Error"}</AlertTitle>
          <AlertDescription>
            {seedResult.message}
          </AlertDescription>
        </Alert>
      )}
      
      {doctors.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Doctors ({doctors.length})</CardTitle>
            <CardDescription>Doctor accounts available for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {doctors.map((doctor) => (
                <div key={doctor.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center">
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/20 mr-2">
                      {doctor.image && (
                        <img src={doctor.image} alt={doctor.first_name} className="h-full w-full object-cover" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">Dr. {doctor.first_name} {doctor.last_name}</div>
                      <div className="text-sm text-muted-foreground">{doctor.specialty}</div>
                    </div>
                  </div>
                  <Badge>{doctor.rating?.toFixed(1) || "N/A"}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
      
      {patients.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Test Patients ({patients.length})</CardTitle>
            <CardDescription>Patient accounts available for testing</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {patients.map((patient) => (
                <div key={patient.id} className="flex items-center border-b pb-2">
                  <div className="h-8 w-8 rounded-full overflow-hidden bg-primary/20 mr-2">
                    {patient.image && (
                      <img src={patient.image} alt={patient.first_name} className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{patient.first_name} {patient.last_name}</div>
                    <div className="text-sm text-muted-foreground">{patient.email}</div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 