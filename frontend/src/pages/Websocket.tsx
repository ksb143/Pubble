import useStompStore from '@/stores/useStompStore';

const Websocket = () => {
  const { connect, disconnect } = useStompStore();

  // 메시지 보내기 예제
  const handleLocalClick = () => {
    connect(`ws://${import.meta.env.VITE_STOMP_BROKER_URL}`);

    return () => disconnect();
  };

  // 메시지 보내기 예제
  const handleServerClick = () => {
    connect(`wss://${import.meta.env.VITE_STOMP_BROKER_URL}`);

    return () => disconnect();
  };

  return (
    <div>
      <p>Websocket Test</p>
      <button
        className='mx-2 shrink-0 rounded-full bg-red-500 p-3 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
        onClick={handleLocalClick}>
        local
      </button>
      <button
        className='shrink-0 rounded-full bg-blue-500 p-3 text-white hover:bg-dpubble hover:outline-double hover:outline-4 hover:outline-gray-200'
        onClick={handleServerClick}>
        server
      </button>
    </div>
  );
};
export default Websocket;
