import { useEffect } from 'react';
import useSocketStore from '@/stores/useSocketStore';
import usePageInfoStore from '@/stores/pageInfoStore';

const Socket = () => {
  const { connect, disconnect, subscribe, publish, messages } =
    useSocketStore();
  const { projectId } = usePageInfoStore();

  useEffect(() => {
    connect(
      `wss://${import.meta.env.VITE_STOMP_BROKER_URL}`,
      () => {
        console.log('WebSocket Connected');
        subscribe(`/sub/project/${projectId}`, (message) => {
          console.log('Received:', message);
        });
      },
      (error) => {
        console.error('Connection error:', error);
      },
    );

    return () => {
      disconnect();
    };
  }, [connect, disconnect, subscribe, projectId]);

  return (
    <div>
      <button
        onClick={() =>
          publish(`/pub/project/${projectId}`, 'Hello, WebSocket!')
        }>
        Send Message
      </button>
      <div>
        {messages.map((msg, index) => (
          <p key={index}>{msg.body}</p>
        ))}
      </div>
    </div>
  );
};

export default Socket;
