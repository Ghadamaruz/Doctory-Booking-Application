
import React, { useEffect } from "react";
import { AuthForm } from "@/components/auth/AuthForm";
import { MainLayout } from "@/components/layout/MainLayout";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

export default function Auth() {
  const { user, loading, refreshUserProfile } = useAuth();
  const navigate = useNavigate();

  // Redirect authenticated users to their appropriate dashboard
  useEffect(() => {
    if (user && !loading) {
      console.log("Auth page: User authenticated with role:", user.profile?.role);
      
      const role = user.profile?.role;
      if (role === 'doctor') {
        console.log("Redirecting to doctor dashboard");
        navigate('/doctor');
      } else if (role === 'patient') {
        console.log("Redirecting to patient dashboard");
        navigate('/patient');
      } else {
        console.log("Unknown role, redirecting to home");
        navigate('/');
      }
    }
  }, [user, loading, navigate]);

  // Function to handle manual refresh when loading gets stuck
  const handleManualRefresh = async () => {
    if (user?.id) {
      await refreshUserProfile(user.id);
    } else {
      // Force reload the page to clear any cached state
      window.location.reload();
    }
  };

  // If still loading after 3 seconds, show refresh button
  const [showRefresh, setShowRefresh] = React.useState(false);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (loading) {
        setShowRefresh(true);
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [loading]);

  // Return to previous page
  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <MainLayout>
      <div className="container max-w-screen-lg mx-auto py-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center space-y-4 h-[50vh]">
            <div className="w-[60%] max-w-md h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="bg-primary h-full animate-pulse" style={{ width: '75%' }}></div>
            </div>
            <p className="text-muted-foreground">Loading your profile...</p>
            {showRefresh && (
              <div className="flex flex-col items-center space-y-2">
                <p className="text-sm text-muted-foreground">Taking longer than expected</p>
                <div className="flex space-x-4">
                  <Button 
                    variant="outline" 
                    onClick={handleManualRefresh}
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={handleGoBack}
                  >
                    Continue as guest
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <AuthForm optional={true} />
        )}
      </div>
    </MainLayout>
  );
}
