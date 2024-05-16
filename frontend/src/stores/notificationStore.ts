import create from 'zustand';

// 알림 상태 타입 정의
interface NotificationState {
  hasNewNotification: boolean; // 새로운 알림을 받았는지 여부
  hasNewMessage: boolean; // 새로운 쪽지를 받았는지 여부
  isMessageChecked: boolean; // 개별 쪽지 상태변경 시 쪽지 리스트를 갱신하기 위한 의존성 배열에 추가할 변수
  isNotificationChecked: boolean; // 개별 알림 상태변경 시 알림 리스트를 갱신하기 위한 의존성 배열에 추가할 변수
  setHasNewNotification: (hasNew: boolean) => void;
  setHasNewMessage: (hasNew: boolean) => void;
  setIsMessageChecked: (isChecked: boolean) => void;
  setIsNotificationChecked: (isChecked: boolean) => void;
}

const useNotificationStore = create<NotificationState>((set) => ({
  hasNewNotification: false,
  hasNewMessage: false,
  isMessageChecked: false,
  isNotificationChecked: false,
  setHasNewNotification: (hasNew) => set({ hasNewNotification: hasNew }),
  setHasNewMessage: (hasNew) => set({ hasNewMessage: hasNew }),
  setIsMessageChecked: (isChecked) => set({ isMessageChecked: isChecked }),
  setIsNotificationChecked: (isChecked) =>
    set({ isNotificationChecked: isChecked }),
}));

export default useNotificationStore;
