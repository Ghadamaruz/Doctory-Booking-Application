
import React from "react";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "lucide-react";

export default function Profile() {
  return (
    <PatientLayout>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6 text-purple-600" />
              Profile Settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Personal Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Name: John Doe</p>
                    <p className="text-sm text-gray-500">Email: john@example.com</p>
                    <p className="text-sm text-gray-500">Phone: (555) 123-4567</p>
                    <Button variant="outline" className="mt-4">
                      Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Medical History</h3>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Blood Type: A+</p>
                    <p className="text-sm text-gray-500">Allergies: None</p>
                    <p className="text-sm text-gray-500">Conditions: None</p>
                    <Button variant="outline" className="mt-4">
                      Update Medical Info
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
