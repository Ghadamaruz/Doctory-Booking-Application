import React from "react";
import { Tab, Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DatabaseSeeder } from "@/components/dev/DatabaseSeeder";
import { Outlet } from "react-router-dom";

export default function DevTools() {
  return (
    <MainLayout>
      <div className="container py-6">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Developer Tools</CardTitle>
            <CardDescription>
              Tools to help with development and testing of the application
            </CardDescription>
          </CardHeader>
        </Card>

        <Tabs defaultValue="database" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="database">Database Tools</TabsTrigger>
            <TabsTrigger value="testing">Testing</TabsTrigger>
            <TabsTrigger value="utils">Utilities</TabsTrigger>
          </TabsList>
          
          <TabsContent value="database">
            <Card>
              <CardHeader>
                <CardTitle>Test Account Generator</CardTitle>
                <CardDescription>
                  Create test accounts with pre-filled data for doctors and patients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DatabaseSeeder />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="testing">
            <Card>
              <CardHeader>
                <CardTitle>Testing Tools</CardTitle>
                <CardDescription>
                  Tools to help with application testing
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Testing tools will be added in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="utils">
            <Card>
              <CardHeader>
                <CardTitle>Utilities</CardTitle>
                <CardDescription>
                  Miscellaneous development utilities
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Utilities will be added in a future update.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <Outlet />
      </div>
    </MainLayout>
  );
} 