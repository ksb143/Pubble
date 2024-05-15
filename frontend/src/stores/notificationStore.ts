import create from 'zustand';

// 알림 수신 여부 타입 정의
interface NotificationState {
  hasNewNotification: boolean;
  setHasNewNotification: (hasNew: boolean) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  hasNewNotification: false,
  setHasNewNotification: (hasNew) => set({ hasNewNotification: hasNew }),
}));

export default useNotificationStore;
