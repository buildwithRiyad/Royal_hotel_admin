import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { getPusherClient } from '@/lib/pusher';

type NotificationPayload = {
  message: string;
  type?: 'success' | 'error' | 'loading' | 'default';
};

const showNotification = ({ message, type }: NotificationPayload) => {
  if (type === 'error') {
    toast.error(message);
    return;
  }

  if (type === 'loading') {
    toast.loading(message);
    return;
  }

  toast.success(message);
};

export const useNotifications = (userId?: number) => {
  useEffect(() => {
    if (!userId) return;

    const pusher = getPusherClient();
    if (!pusher) return; // SSR-safety: ensure client exists before subscribing
    const channelName = `notifications-${userId}`;
    const channel = pusher.subscribe(channelName);
    channel.bind('notification', (data: NotificationPayload) => {
      showNotification(data);
    });

    const globalInfoChannel = pusher.subscribe('global_info');
    globalInfoChannel.bind('global_info', (data: NotificationPayload) => {
      showNotification({ ...data, message: `Global: ${data.message}` });
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(channelName);
      globalInfoChannel.unbind_all();
      pusher.unsubscribe('global_info');
    };
  }, [userId]);
};
