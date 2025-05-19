
import React from "react";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function Messages() {
  return (
    <PatientLayout>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-blue-600" />
              Messages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input className="pl-10" placeholder="Search conversations..." />
            </div>
            <div className="space-y-4">
              {["Dr. Sarah Wilson", "Dr. Michael Brown", "Dr. Emily Chen"].map((doctor) => (
                <Card key={doctor} className="hover:bg-gray-50 transition-colors cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-100 to-blue-200 flex items-center justify-center">
                        {doctor[3]}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{doctor}</h3>
                        <p className="text-sm text-gray-500">Last message: 2 hours ago</p>
                      </div>
                    </div>
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
