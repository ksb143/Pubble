import create from 'zustand';

// 알림 상태 타입 정의
interface NotificationState {
  hasNewNotification: boolean;
  hasNewMessage: boolean;
  setHasNewNotification: (hasNew: boolean) => void;
  setHasNewMessage: (hasNew: boolean) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  hasNewNotification: false,
  hasNewMessage: false,
  setHasNewNotification: (hasNew) => set({ hasNewNotification: hasNew }),
  setHasNewMessage: (hasNew) => set({ hasNewMessage: hasNew }),
}));

export default useNotificationStore;
