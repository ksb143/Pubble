import { privateApi } from '@/utils/http-commons.ts';
import { getToken, messaging, onMessage } from '@/firebaseConfig';
import useNotificationStore from '@/stores/notificationStore';

// FCM 토큰 전송 함수
export const sendFCMToken = async (token: string) => {
  await privateApi.post(`notification/token`, { token });
};

// FCM 토큰 요청 함수
export const getFCMToken = async () => {
  try {
    // 알림 권한 요청
    const permission = await Notification.requestPermission();

    // 알림 권한이 허용된 경우
    if (permission === 'granted') {
      // FCM 토큰 요청
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      // FCM 토큰을 받은 경우
      if (currentToken) {
        // 서버로 토큰 전송
        sendFCMToken(currentToken);
      } else {
        alert('알림 권한을 허용해주세요!');
      }
    }
  } catch (error) {
    console.log('토큰 요청 중 에러 발생 : ', error);
  }
};

// FCM 메시지 수신 리스너
export const setupFCMListener = () => {
  const subscribe = onMessage(messaging, (payload) => {
    console.log('알림 수신 데이터 : ', payload);
    if (payload.notification) {
      const notificationTitle = payload.notification.title || '알림 제목';
      const notificationOptions = {
        body: payload.notification.body || '알림 내용',
      };

      // 브라우저 알림 권한이 허용되었으면
      if (Notification.permission === 'granted') {
        new Notification(notificationTitle, notificationOptions);
      }

      useNotificationStore.setState({ hasNewNotification: true });
    } else {
      // payload.notification이 없는 경우
      console.log('알림없음. 데이터 메세지 수신 :', payload.data);
    }

    return subscribe;
  });
};

// 받은 알림 리스트 조회 함수
export const getNotificationList = async (page: number, size: number) => {
  const { data } = await privateApi.get('/notification/list', {
    params: { page, size },
  });
  return data;
};
