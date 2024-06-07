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
  console.log('FCM service worker 실행');
});

// Firebase 설정 값
const firebaseConfig = {
  apiKey: '', // Your API Key
  authDomain: '', // Your Auth Domain
  projectId: '', // Your Project ID
  storageBucket: '', // Your Storage Bucket
  messagingSenderId: '', // Your Messaging Sender ID
  appId: '', // Your App ID
  measurementId: '', // Your Measurement ID
};

// Firebase SDK 초기화
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// 백그라운드 상태에서 수신된 알림 표시
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.body,
    icon: payload.icon || '/pubble_logo.png',
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
