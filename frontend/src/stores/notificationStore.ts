import create from 'zustand';

interface Notification {
  id: number;
  title: string;
  message: string;
  receivedAt: Date;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) =>
    set((state) => ({
      notifications: [...state.notifications, notification],
    })),
  clearNotifications: () => set({ notifications: [] }),
}));
