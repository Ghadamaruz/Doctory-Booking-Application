
import { useState } from "react";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

interface AuthCardProps {
  doctorOnly?: boolean;
  optional?: boolean;
}

export function AuthCard({ doctorOnly = false, optional = false }: AuthCardProps) {
  const [isSignUp, setIsSignUp] = useState(false);

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <>
      {isSignUp ? (
        <SignUpForm onToggleAuthMode={toggleAuthMode} doctorOnly={doctorOnly} optional={optional} />
      ) : (
        <SignInForm onToggleAuthMode={toggleAuthMode} doctorOnly={doctorOnly} optional={optional} />
      )}
    </>
  );
}
