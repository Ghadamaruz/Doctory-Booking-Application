
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Home,
  Search,
  Calendar,
  FileText,
  MessageSquare,
  User,
  Bell,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { ThemeToggle } from "@/components/common/ThemeToggle";

export function PatientSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const menuItems = [
    { icon: Home, label: t('dashboard'), path: "/patient" },
    { icon: Search, label: t('findDoctor'), path: "/patient/find-doctor" },
    { icon: Calendar, label: t('appointments'), path: "/patient/appointments" },
    { icon: FileText, label: t('medicalRecords'), path: "/patient/records" },
    { icon: MessageSquare, label: t('messages'), path: "/patient/messages" },
    { icon: User, label: t('profile'), path: "/patient/profile" },
    { icon: Bell, label: t('notifications'), path: "/patient/notifications" },
  ];

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/auth");
    } catch (error) {
      toast.error("Error logging out");
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-xl font-semibold">{t('patientPortal')}</h2>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SidebarTrigger />
          </div>
        </div>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                asChild
                isActive={location.pathname === item.path}
              >
                <Link to={item.path} className="w-full">
                  <item.icon />
                  <span>{item.label}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <Button 
          variant="ghost" 
          className="w-full justify-start px-4"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('logout')}</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
