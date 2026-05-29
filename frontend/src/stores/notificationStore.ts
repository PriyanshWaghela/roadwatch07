import { create } from 'zustand';
import { notificationsAPI } from '@/lib/api';
import type { Notification } from '@/types';

interface NotificationStore {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchNotifications: async () => {
    set({ isLoading: true });
    try {
      const { notifications } = await notificationsAPI.list({ limit: 50 });
      set({ notifications, isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  fetchUnreadCount: async () => {
    try {
      const { count } = await notificationsAPI.unreadCount();
      set({ unreadCount: count });
    } catch {
      // silently fail
    }
  },

  markAsRead: async (id: string) => {
    try {
      await notificationsAPI.markRead(id);
      const { notifications } = get();
      set({
        notifications: notifications.map((n) =>
          n._id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, get().unreadCount - 1),
      });
    } catch {
      // silently fail
    }
  },

  markAllAsRead: async () => {
    try {
      await notificationsAPI.markAllRead();
      const { notifications } = get();
      set({
        notifications: notifications.map((n) => ({ ...n, read: true })),
        unreadCount: 0,
      });
    } catch {
      // silently fail
    }
  },
}));
