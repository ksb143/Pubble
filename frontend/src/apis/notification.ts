import { privateApi } from '@/utils/http-commons.ts';
import { getToken, getMessaging, onMessage } from 'firebase/messaging';
import { app } from '@/firebaseConfig.ts';

export const messaging = getMessaging(app);

// FCM 토큰 전송 함수
export const sendFCMToken = async (token: string) => {
  console.log('토큰 전송 api');
  const { data } = await privateApi.post(`notification/token`, { token });
  return data;
};

// FCM 토큰 요청 함수
export const getFCMToken = async () => {
  try {
    const permission = await Notification.requestPermission();

    if (permission === 'granted') {
      const currentToken = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      });
      if (currentToken) {
        console.log('Token:', currentToken);
        sendFCMToken(currentToken); // (토큰을 서버로 전송하는 로직)
      } else {
        alert('토큰 등록이 불가능 합니다. 생성하려면 권한을 허용해주세요');
      }
    } else if (permission === 'denied') {
      alert(
        'web push 권한이 차단되었습니다. 알림을 사용하시려면 권한을 허용해주세요',
      );
    }
  } catch (error) {
    console.error('푸시 토큰 가져오는 중에 에러 발생', error);
  }
};

onMessage(messaging, (payload) => {
  console.log('알림 도착 ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  if (Notification.permission === 'granted') {
    new Notification(notificationTitle, notificationOptions);
  }
});
