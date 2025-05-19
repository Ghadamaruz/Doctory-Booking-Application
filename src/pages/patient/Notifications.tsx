
import React, { useState, useEffect } from "react";
import { PatientLayout } from "@/components/layout/PatientLayout";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bell, Calendar, User, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { Notification } from "@/types/doctor";

export default function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetchNotifications();
  }, [user]);

  const fetchNotifications = async () => {
    if (!user) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id);
        
      if (error) throw error;
      
      setNotifications(data || []);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      toast({
        title: "Error",
        description: "Could not load notifications",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', id);
        
      if (error) throw error;
      
      setNotifications(notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleNotificationClick = async (notification: Notification) => {
    await markAsRead(notification.id);
    
    if (notification.type === 'appointment' && notification.related_id) {
      navigate('/patient/appointments');
    } else if (notification.type === 'message' && notification.related_id) {
      navigate('/patient/messages');
    }
  };

  const getNotificationIcon = (type: string | undefined) => {
    switch(type) {
      case 'appointment':
        return <Calendar className="h-4 w-4 text-amber-600" />;
      case 'message':
        return <MessageSquare className="h-4 w-4 text-green-600" />;
      default:
        return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getNotificationIconColor = (type: string | undefined) => {
    switch(type) {
      case 'appointment':
        return 'bg-amber-100';
      case 'message':
        return 'bg-green-100';
      default:
        return 'bg-blue-100';
    }
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown time";
    }
  };

  const markAllAsRead = async () => {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', user?.id)
        .eq('read', false);
        
      if (error) throw error;
      
      setNotifications(notifications.map(notif => ({ ...notif, read: true })));
      
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      toast({
        title: "Error",
        description: "Failed to mark notifications as read",
        variant: "destructive"
      });
    }
  };

  return (
    <PatientLayout>
      <div className="space-y-8">
        <Card className="bg-gradient-to-r from-amber-50 to-orange-50">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-amber-600" />
              Notifications
            </CardTitle>
            {notifications.some(n => !n.read) && (
              <Button size="sm" variant="outline" onClick={markAllAsRead}>
                Mark all as read
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-500"></div>
                </div>
              ) : notifications.length > 0 ? (
                notifications.map((notification) => (
                  <Card 
                    key={notification.id} 
                    className={`hover:bg-gray-50 transition-colors ${!notification.read ? 'border-l-4 border-amber-500' : ''}`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div className={`h-8 w-8 rounded-full ${getNotificationIconColor(notification.type)} flex items-center justify-center`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                          <h3 className={`font-semibold ${!notification.read ? 'text-black' : 'text-gray-700'}`}>{notification.title}</h3>
                          <p className={`text-sm ${!notification.read ? 'text-gray-600' : 'text-gray-500'}`}>{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-1">{getTimeAgo(notification.created_at)}</p>
                        </div>
                        {!notification.read && (
                          <div className="h-2 w-2 rounded-full bg-amber-500"></div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="mx-auto w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-amber-600" />
                  </div>
                  <h3 className="font-medium text-lg">No Notifications</h3>
                  <p className="text-gray-500 mt-1 mb-4">
                    You don't have any notifications right now
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </PatientLayout>
  );
}
