import create from 'zustand';
import { Client } from '@stomp/stompjs';

interface SocketState {
  client: Client | null;
  isConnected: boolean;
  messages: any[];
  setClient: (client: Client | null) => void;
  connect: (
    url: string,
    onConnect: () => void,
    onError: (error: string) => void,
  ) => void;
  disconnect: () => void;
  subscribe: (url: string, callback: (message: any) => void) => void;
  publish: (url: string, message: string) => void;
}

const useSocketStore = create<SocketState>((set, get) => ({
  client: null,
  isConnected: false,
  messages: [],
  setClient: (client) => set({ client }),
  connect: (url, onConnect, onError) => {
    const client = new Client({
      brokerURL: url,
      // connectHeaders: {
      //   Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      // },
      debug: function (str) {
        console.log(str);
      },
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
    });

    client.onConnect = function () {
      set({ isConnected: true });
      onConnect();
    };

    client.onStompError = function (frame) {
      console.error('Broker reported error: ' + frame.headers['message']);
      console.error('Additional details: ' + frame.body);
      onError(frame.headers['message']);
    };

    client.activate();
    set({ client });
  },
  disconnect: () => {
    get().client?.deactivate();
    set({ client: null, isConnected: false });
  },
  subscribe: (url, callback) => {
    get().client?.subscribe(url, (message) => {
      callback(message);
      set((state) => ({ messages: [...state.messages, message] }));
    });
  },
  publish: (url, message) => {
    get().client?.publish({ destination: url, body: message });
  },
}));

export default useSocketStore;
