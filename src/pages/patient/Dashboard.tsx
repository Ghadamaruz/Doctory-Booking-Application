
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, User, Bell, FileText, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";

export default function PatientDashboard() {
  return (
    <PatientLayout>
      <div className="space-y-8">
        {/* Hero Section with gradient background */}
        <Card className="overflow-hidden">
          <CardContent className="p-0">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-90" />
              <div className="relative p-8 md:p-12 text-white">
                <div className="max-w-2xl">
                  <h1 className="text-3xl md:text-4xl font-bold mb-4">Welcome to Your Health Portal</h1>
                  <p className="text-lg opacity-90 mb-6">
                    Take control of your health journey with easy access to appointments, specialists, and personalized care.
                  </p>
                  <Button
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-blue-50"
                    asChild
                  >
                    <Link to="/patient/find-doctor">
                      Find a Doctor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Statistics Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Calendar className="h-5 w-5" />
                Upcoming Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">No upcoming appointments</p>
                <Button variant="outline" asChild>
                  <Link to="/patient/appointments">Schedule Now →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions Card with Grid Layout */}
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" className="flex flex-col gap-2 h-auto p-4 hover:bg-blue-50">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <span>Book</span>
                </Button>
                <Button variant="outline" className="flex flex-col gap-2 h-auto p-4 hover:bg-blue-50">
                  <User className="h-5 w-5 text-blue-600" />
                  <span>Profile</span>
                </Button>
                <Button variant="outline" className="flex flex-col gap-2 h-auto p-4 hover:bg-blue-50">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span>Records</span>
                </Button>
                <Button variant="outline" className="flex flex-col gap-2 h-auto p-4 hover:bg-blue-50">
                  <Bell className="h-5 w-5 text-blue-600" />
                  <span>Alerts</span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Doctors Card */}
          <Card className="bg-gradient-to-br from-teal-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <User className="h-5 w-5" />
                Your Care Team
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">Connect with specialists</p>
                <Button variant="outline" asChild className="text-teal-600 hover:text-teal-700">
                  <Link to="/patient/find-doctor">Find Specialists →</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Health Tips Carousel */}
        <Card className="bg-gradient-to-r from-sky-50 to-indigo-50 p-6">
          <CardHeader>
            <CardTitle className="text-2xl text-sky-900">Health & Wellness Tips</CardTitle>
          </CardHeader>
          <CardContent>
            <Carousel className="w-full max-w-5xl mx-auto">
              <CarouselContent>
                {[
                  {
                    title: "Regular Check-ups",
                    description: "Schedule regular health check-ups to maintain your wellbeing",
                    color: "from-sky-500"
                  },
                  {
                    title: "Stay Active",
                    description: "30 minutes of daily exercise can significantly improve your health",
                    color: "from-indigo-500"
                  },
                  {
                    title: "Mental Wellness",
                    description: "Take time for mindfulness and stress management",
                    color: "from-violet-500"
                  }
                ].map((tip, index) => (
                  <CarouselItem key={index}>
                    <Card className={`bg-gradient-to-r ${tip.color} to-transparent border-0`}>
                      <CardContent className="flex flex-col items-center justify-center p-6 text-white min-h-[200px]">
                        <h3 className="text-xl font-semibold mb-2">{tip.title}</h3>
                        <p className="text-center opacity-90">{tip.description}</p>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
