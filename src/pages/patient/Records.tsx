
import React from "react";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText } from "lucide-react";

export default function Records() {
  return (
    <PatientLayout>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-teal-50 to-green-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-6 w-6 text-teal-600" />
              Medical Records
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {["Lab Results", "Prescriptions", "Medical History"].map((category) => (
                <Card key={category} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-2">{category}</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Access and manage your {category.toLowerCase()}
                    </p>
                    <Button variant="outline" className="w-full">
                      View {category}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
