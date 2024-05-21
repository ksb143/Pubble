import { useEffect } from 'react';
import useSocketStore from '@/stores/useSocketStore';
import usePageInfoStore from '@/stores/pageInfoStore';
import { getVisitor } from '@/apis/user';
import useUserStore from '@/stores/userStore';

const Socket = () => {
  const { connect, disconnect, subscribe, publish } = useSocketStore();
  const { projectId } = usePageInfoStore();
  const userState = useUserStore();

  useEffect(() => {
    connect(
      `wss://${import.meta.env.VITE_STOMP_BROKER_URL}`,
      async () => {
        console.log('WebSocket Connected');
        subscribe(`/sub/project/${projectId}`, (message) => {
          const userInfo = JSON.parse(message.body);
          console.log('Received:', userInfo);
        });

        const response = await getVisitor(projectId);
        console.log(response);
      },
      (error) => {
        console.error('Connection error:', error);
      },
    );

    return () => {
      disconnect();
    };
  }, [connect, disconnect, subscribe, projectId]);

  const sendMessage = () => {
    const messageContent = {
      operation: 'e',
      employeeId: userState.employeeId,
      userInfoDto: {
        name: userState.name,
        employeeId: userState.employeeId,
        department: userState.department,
        position: userState.position,
        role: userState.role,
        isApprovable: userState.isApprovable,
        profileColor: userState.profileColor,
      },
      locationName: 'socket',
      locationUrl: '/socket',
    };

    publish(`/pub/project/${projectId}`, messageContent);
  };

  return (
    <div>
      <button onClick={sendMessage}>Send Message</button>
      <div></div>
    </div>
  );
};

export default Socket;
