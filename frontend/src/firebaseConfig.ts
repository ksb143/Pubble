import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: 'AIzaSyA-jlbMvTl34uffdBao_ToX8cxDwqSiA4k',
  authDomain: 'pubble-push.firebaseapp.com',
  projectId: 'pubble-push',
  storageBucket: 'pubble-push.appspot.com',
  messagingSenderId: '36975261213',
  appId: '1:36975261213:web:c89c3c83722c542d9678f4',
  measurementId: 'G-RDDYCM82CV',
};

export const app = initializeApp(firebaseConfig);
