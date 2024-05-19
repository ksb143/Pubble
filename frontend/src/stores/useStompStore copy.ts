// src/stores/useStompStore.ts
import { Client, StompSubscription, IMessage } from '@stomp/stompjs';
import create from 'zustand';

interface UserStatus {
  [userId: string]: 'online' | 'offline';
}

interface StompState {
  stompClient: Client | null;
  subscriptions: { [key: string]: StompSubscription };
  userStatus: UserStatus;
  connect: () => void;
  disconnect: () => void;
  subscribe: (
    path: string,
    key: string,
    callback: (message: IMessage) => void,
  ) => void;
  unsubscribe: (key: string) => void;
  updateUserStatus: (userId: string, status: 'online' | 'offline') => void;
}

export const useStompStore = create<StompState>((set, get) => ({
  stompClient: null,
  subscriptions: {},
  userStatus: {},

  connect: () => {
    // const token = localStorage.getItem('accessToken');
    const url = `wss://${import.meta.env.VITE_STOMP_BROKER_URL}`;
    const client = new Client({
      brokerURL: url,
      // connectHeaders: {
      //   Authorization: `Bearer ${token}`,
      // },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      debug: (str) => console.log('STOMP Debug:', str),
      onConnect: () => {
        console.log('STOMP Connection successful');
      },
      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },
    });

    client.activate();
    set({ stompClient: client });
  },

  disconnect: () => {
    get().stompClient?.deactivate();
    set({ stompClient: null });
  },

  subscribe: (path, key, callback) => {
    const { stompClient, subscriptions } = get();
    if (stompClient && !subscriptions[key]) {
      const subscription = stompClient.subscribe(path, (message: IMessage) => {
        callback(message); // 사용자 정의 콜백 실행
      });
      set((state) => ({
        subscriptions: { ...state.subscriptions, [key]: subscription },
      }));
    }
  },

  unsubscribe: (key) => {
    const { subscriptions } = get();
    subscriptions[key]?.unsubscribe();
    set((state) => {
      const newSubscriptions = { ...state.subscriptions };
      delete newSubscriptions[key];
      return { subscriptions: newSubscriptions };
    });
  },

  updateUserStatus: (userId, status) =>
    set((state) => ({
      userStatus: {
        ...state.userStatus,
        [userId]: status,
      },
    })),
}));

export default useStompStore;
