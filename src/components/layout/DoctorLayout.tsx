
import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Calendar, User, Bell, Clock, ArrowRight } from "lucide-react";
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { LanguageSwitcher } from "@/components/common/LanguageSwitcher";

type DoctorLayoutProps = {
  children: React.ReactNode;
};

export function DoctorLayout({ children }: DoctorLayoutProps) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      title: "Dashboard",
      path: "/doctor",
      icon: <Clock className="h-5 w-5 mr-2" />,
    },
    {
      title: "Appointments",
      path: "/doctor/appointments",
      icon: <Calendar className="h-5 w-5 mr-2" />,
    },
    {
      title: "Availability",
      path: "/doctor/availability",
      icon: <Clock className="h-5 w-5 mr-2" />,
    },
    {
      title: "Profile",
      path: "/doctor/profile",
      icon: <User className="h-5 w-5 mr-2" />,
    },
    {
      title: "Notifications",
      path: "/doctor/notifications",
      icon: <Bell className="h-5 w-5 mr-2" />,
    }
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <header className="bg-white shadow dark:bg-gray-800">
        <div className="px-4 py-3 mx-auto max-w-[1400px]">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/doctor" className="flex items-center">
                <span className="text-xl font-bold text-primary">Doctory</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <LanguageSwitcher />
              <div className="flex items-center">
                <Avatar className="h-8 w-8 border-2 border-primary">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.profile?.first_name?.[0] || "D"}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-2 hidden md:block">
                  <p className="text-sm font-medium">
                    {user?.profile?.first_name} {user?.profile?.last_name}
                  </p>
                  <p className="text-xs text-muted-foreground">Doctor</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                Log Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex mx-auto max-w-[1400px]">
        {/* Sidebar Navigation */}
        <div className="w-64 p-4 hidden md:block">
          <nav className="space-y-2 mt-6">
            {menuItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                className={`flex items-center px-4 py-2.5 text-sm rounded-md ${
                  location.pathname === item.path
                    ? "bg-primary text-white"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
                }`}
              >
                {item.icon}
                {item.title}
              </Link>
            ))}
          </nav>
        </div>

        {/* Main Content */}
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
    </div>
  );
}
