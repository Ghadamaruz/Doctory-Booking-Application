// Minimal helper to create a notification record in Supabase
export const createNotification = async (
  notificationData,
  client
) => {
  try {
    await client
      .from('notifications')
      .insert({
        ...notificationData,
        read: false,
        created_at: new Date().toISOString(),
      });
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};
