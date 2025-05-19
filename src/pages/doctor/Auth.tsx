
import React from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Stethoscope } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function DoctorAuth() {
  const { t } = useTranslation();
  
  return (
    <MainLayout>
      <div className="container max-w-screen-lg mx-auto py-8">
        <div className="flex flex-col items-center mb-8">
          <div className="p-3 bg-primary/10 rounded-full mb-4">
            <Stethoscope className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">{t('doctorPortal')}</h1>
          <p className="text-muted-foreground text-center max-w-md">
            {t('doctorPortalDesc', 'Sign in to manage your appointments, update availability, and connect with patients')}
          </p>
        </div>
        
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle>{t('welcomeDoctor')}</CardTitle>
            <CardDescription>
              {t('doctorSignInPrompt', 'Please sign in to access your dashboard')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AuthForm doctorOnly={true} />
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
