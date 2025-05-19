
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/use-toast";
import { Users, Stethoscope, Loader2 } from "lucide-react";
import { addMockDoctorAvailability } from "@/lib/auth";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useTranslation } from "react-i18next";

interface SignUpFormProps {
  onToggleAuthMode: () => void;
  doctorOnly?: boolean;
  optional?: boolean;
}

export function SignUpForm({ onToggleAuthMode, doctorOnly = false, optional = false }: SignUpFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [role, setRole] = useState<"doctor" | "patient">(doctorOnly ? "doctor" : "patient");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      console.log("Attempting to sign up with:", { email, firstName, lastName, role });
      
      // Validate that this is for doctors only if doctorOnly is true
      if (doctorOnly && role !== "doctor") {
        throw new Error(t('doctorOnlyPortal'));
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            role: role,
          },
        },
      });

      if (error) {
        console.error("Sign-up error:", error);
        throw error;
      }
      
      console.log("Sign up response:", data);
      
      if (role === "doctor" && data.user) {
        try {
          // Add mock availability for doctors
          await addMockDoctorAvailability(data.user.id);
          console.log("Added mock availability for doctor", data.user.id);
        } catch (availError) {
          console.error("Error adding mock doctor availability:", availError);
          // We continue even if this fails
        }
      }

      toast({
        title: t('accountCreated'),
        description: t('checkEmailVerify'),
      });
      
      // For development without email verification
      if (data.session) {
        console.log("Session created, redirecting user");
        toast({
          title: t('loginSuccessful'),
          description: t('welcomeToApp'),
        });
        
        // Redirect based on role
        if (role === "doctor") {
          navigate("/doctor");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMsg = (error as Error).message || t('unexpectedError');
      setErrorMessage(errorMsg);
      toast({
        variant: "destructive",
        title: t('authFailed'),
        description: errorMsg,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Add a function to skip and continue as guest
  const continueAsGuest = () => {
    toast({
      title: t('continuingAsGuest'),
      description: t('youCanSignUpLater'),
    });
    navigate(-1); // Go back to the previous page
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{doctorOnly ? t('doctorRegistration') : t('createAccount')}</CardTitle>
        <CardDescription>
          {doctorOnly 
            ? t('registerAsDoctor')
            : t('enterInfoCreateAccount')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUp} className="space-y-4">
          {errorMessage && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
              {errorMessage}
            </div>
          )}
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">{t('firstName')}</Label>
              <Input
                id="firstName"
                placeholder={t('firstNamePlaceholder')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{t('lastName')}</Label>
              <Input
                id="lastName"
                placeholder={t('lastNamePlaceholder')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          
          {!doctorOnly && (
            <div className="space-y-2">
              <Label>{t('iAmA')}</Label>
              <RadioGroup 
                defaultValue="patient" 
                value={role}
                onValueChange={(value: "patient" | "doctor") => setRole(value)}
                className="flex space-x-4"
                disabled={isLoading}
              >
                <div 
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    role === 'patient' 
                      ? 'bg-primary/10 border-primary' 
                      : 'border-transparent hover:bg-accent/30'
                  }`}
                >
                  <RadioGroupItem 
                    value="patient" 
                    id="patient" 
                    className="hidden" 
                  />
                  <Label 
                    htmlFor="patient" 
                    className="flex items-center cursor-pointer"
                  >
                    <Users 
                      className={`mr-2 ${
                        role === 'patient' 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                    {t('patient')}
                  </Label>
                </div>
                <div 
                  className={`flex items-center space-x-2 p-3 rounded-lg border-2 transition-all ${
                    role === 'doctor' 
                      ? 'bg-primary/10 border-primary' 
                      : 'border-transparent hover:bg-accent/30'
                  }`}
                >
                  <RadioGroupItem 
                    value="doctor" 
                    id="doctor" 
                    className="hidden" 
                  />
                  <Label 
                    htmlFor="doctor" 
                    className="flex items-center cursor-pointer"
                  >
                    <Stethoscope 
                      className={`mr-2 ${
                        role === 'doctor' 
                          ? 'text-primary' 
                          : 'text-muted-foreground'
                      }`} 
                    />
                    {t('doctor')}
                  </Label>
                </div>
              </RadioGroup>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t('creatingAccount')}...
              </>
            ) : (
              t('signUp')
            )}
          </Button>
          
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={onToggleAuthMode}
            disabled={isLoading}
          >
            {t('alreadyHaveAccount')}
          </Button>

          {optional && (
            <Button
              type="button"
              variant="ghost"
              className="w-full"
              onClick={continueAsGuest}
              disabled={isLoading}
            >
              {t('skipAndContinueAsGuest')}
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
