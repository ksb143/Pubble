importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-app-compat.js',
);
importScripts(
  'https://www.gstatic.com/firebasejs/10.8.0/firebase-messaging-compat.js',
);

self.addEventListener('install', function (e) {
  self.skipWaiting(); // 이벤트가 발생하면 즉시 활성화
});

self.addEventListener('activate', function (e) {
  console.log('FCM service worker가 실행되었습니다.');
});

// Firebase 설정 값
const firebaseConfig = {
  apiKey: 'AIzaSyA-jlbMvTl34uffdBao_ToX8cxDwqSiA4k',
  authDomain: 'pubble-push.firebaseapp.com',
  projectId: 'pubble-push',
  storageBucket: 'pubble-push.appspot.com',
  messagingSenderId: '36975261213',
  appId: '1:36975261213:web:c89c3c83722c542d9678f4',
  measurementId: 'G-RDDYCM82CV',
};

// Firebase SDK 초기화
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 백그라운드 상태에서 수신된 알림 표시
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.body,
    // icon: payload.icon
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
