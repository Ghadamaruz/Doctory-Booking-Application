
import React from "react";
import { AuthCard } from "./form/AuthCard";
import { useTranslation } from "react-i18next";

interface AuthFormProps {
  doctorOnly?: boolean;
  optional?: boolean;
}

export function AuthForm({ doctorOnly = false, optional = false }: AuthFormProps) {
  const { t } = useTranslation();
  
  return (
    <div className="w-full">
      <h2 className="text-center text-lg font-medium mb-4">
        {doctorOnly ? t('doctorLogin') : optional ? t('optionalLogin') : t('patientLogin')}
      </h2>
      <AuthCard doctorOnly={doctorOnly} optional={optional} />
      {optional && (
        <p className="text-center mt-4 text-muted-foreground text-sm">
          {t('guestBookingNotice')}
        </p>
      )}
    </div>
  );
}
