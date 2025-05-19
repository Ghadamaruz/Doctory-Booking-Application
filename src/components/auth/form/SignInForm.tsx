
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";

interface SignInFormProps {
  onToggleAuthMode: () => void;
  doctorOnly?: boolean;
  optional?: boolean;
}

export function SignInForm({ onToggleAuthMode, doctorOnly = false, optional = false }: SignInFormProps) {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      // Clear any existing sessions first to prevent conflicts
      await supabase.auth.signOut();
      
      console.log("Attempting to sign in with:", { email });
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error("Sign-in error:", error);
        throw error;
      }
      
      console.log("Sign in successful:", data);
      
      // Get user role from metadata
      const userRole = data.user?.user_metadata.role;
      console.log("User role:", userRole);
      
      // Verify this is a doctor if doctorOnly is true
      if (doctorOnly && userRole !== "doctor") {
        throw new Error(t('doctorOnlyPortal'));
      }
      
      toast({
        title: t('loginSuccessful'),
        description: t('welcomeBack'),
      });
      
      // Redirect based on user role
      if (userRole === "doctor") {
        navigate("/doctor");
      } else {
        navigate("/");
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
        <CardTitle>{doctorOnly ? t('doctorSignIn') : t('signIn')}</CardTitle>
        <CardDescription>
          {doctorOnly 
            ? t('enterCredentialsDoctorDashboard') 
            : t('enterCredentialsSignIn')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignIn} className="space-y-4">
          {errorMessage && (
            <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">
              {errorMessage}
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
                {t('signingIn')}...
              </>
            ) : (
              t('signIn')
            )}
          </Button>
          
          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={onToggleAuthMode}
            disabled={isLoading}
          >
            {t('dontHaveAccount')}
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
