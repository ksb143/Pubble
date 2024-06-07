import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase 콘솔에서 주는 설정
const firebaseConfig = {
  apiKey: '', // Your API Key
  authDomain: '', // Your Auth Domain
  projectId: '', // Your Project ID
  storageBucket: '', // Your Storage Bucket
  messagingSenderId: '', // Your Messaging Sender ID
  appId: '', // Your App ID
  measurementId: '', // Your Measurement ID
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };
