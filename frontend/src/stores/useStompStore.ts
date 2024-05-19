import create from 'zustand';
import { Client } from '@stomp/stompjs';

type StompState = {
  stompClient: Client | null;
  connect: (url: string) => void;
  disconnect: () => void;
  sendMessage: (destination: string, body: string) => void;
};

export const useStompStore = create<StompState>((set, get) => ({
  stompClient: null,
  connect: (url: string) => {
    const token = localStorage.getItem('accessToken');
    const client = new Client({
      brokerURL: url,
      connectHeaders: {
        Authorization: `Bearer ${token}`, // Bearer 스키마를 사용하는 경우
      },
      reconnectDelay: 5000,
      debug: (str) => {
        console.log('STOMP Debug:', str);
      },
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
  sendMessage: (destination, body) => {
    get().stompClient?.publish({ destination, body });
  },
}));

export default useStompStore;
