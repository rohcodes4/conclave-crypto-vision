
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  tokenId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationPreferences {
  id: string;
  userId: string;
  newTokens: boolean;
  priceAlerts: boolean;
  tradeConfirmations: boolean;
}

export const useNotifications = () => {
  // Get user notification preferences
  const getNotificationPreferences = async (): Promise<NotificationPreferences | null> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return null;

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', userData.user.id)
      .single();

    if (error) {
      console.error('Error fetching notification preferences:', error);
      return null;
    }

    if (!data) return null;
    
    return {
      id: data.id,
      userId: data.user_id,
      newTokens: data.new_tokens,
      priceAlerts: data.price_alerts,
      tradeConfirmations: data.trade_confirmations
    };
  };

  // Update user notification preferences
  const updateNotificationPreferences = async (preferences: {
    newTokens: boolean;
    priceAlerts: boolean;
    tradeConfirmations: boolean;
  }): Promise<NotificationPreferences | null> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      toast.error('You must be logged in to update notification preferences');
      return null;
    }

    const { data, error } = await supabase
      .from('notification_preferences')
      .update({
        new_tokens: preferences.newTokens,
        price_alerts: preferences.priceAlerts,
        trade_confirmations: preferences.tradeConfirmations
      })
      .eq('user_id', userData.user.id)
      .select()
      .single();

    if (error) {
      toast.error(`Failed to update notification preferences: ${error.message}`);
      console.error('Error updating notification preferences:', error);
      return null;
    }

    if (!data) return null;
    
    toast.success('Notification preferences updated');
    return {
      id: data.id,
      userId: data.user_id,
      newTokens: data.new_tokens,
      priceAlerts: data.price_alerts,
      tradeConfirmations: data.trade_confirmations
    };
  };

  // Get user notifications
  const getUserNotifications = async (limit = 20, offset = 0): Promise<Notification[]> => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return [];

    const { data, error } = await supabase
      .from('notifications')
      .select(`
        *,
        tokens:token_id (
          id,
          name,
          symbol,
          price
        )
      `)
      .eq('user_id', userData.user.id)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    if (!data) return [];

    return data.map(notification => ({
      id: notification.id,
      userId: notification.user_id,
      type: notification.type,
      title: notification.title,
      message: notification.message,
      tokenId: notification.token_id,
      isRead: notification.is_read,
      createdAt: notification.created_at
    }));
  };

  // Mark notification as read
  const markNotificationAsRead = async (notificationId: string) => {
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Mark all notifications as read
  const markAllNotificationsAsRead = async () => {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) return;

    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', userData.user.id)
      .eq('is_read', false);

    if (error) {
      console.error('Error marking all notifications as read:', error);
    } else {
      toast.success('All notifications marked as read');
    }
  };

  // Subscribe to new token notifications - simplified, no browser notifications
  const subscribeToTokenNotifications = () => {
    const channel = supabase
      .channel('public:tokens')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'tokens' 
        }, 
        (payload) => {
          // Notification logic removed as requested
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  return {
    getNotificationPreferences,
    updateNotificationPreferences,
    getUserNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    subscribeToTokenNotifications
  };
};
