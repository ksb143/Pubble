// 1. react
import { useState } from 'react';
// 2. library
// 3. api
import { updateMessageStatus } from '@/apis/message';
import { MessageInfo } from '@/types/messageType';
import { extractDate, extractTime } from '@/utils/datetime';
// 4. store
import useNotificationStore from '@/stores/notificationStore';
// 5. component
import Profile from '@/components/layout/Profile';
import Badge from '@/components/navbar/Badge';
// 6. assets
import Down from '@/assets/icons/chevron-down.svg?react';

// api로 받아온 쪽지 리스트 타입 설정
interface MessageListProps {
  data: MessageInfo[];
}

const MessageList = ({ data }: MessageListProps) => {
  const { isMessageChecked, setIsMessageChecked } = useNotificationStore();
  // 쪽지 읽었는지 여부 상태
  const [expandedMessageId, setExpandedMessageId] = useState<number | null>(
    null,
  );

  // 쪽지 내용 확장 토글 함수
  const handleToggleExpand = (messageId: number) => {
    setExpandedMessageId(expandedMessageId === messageId ? null : messageId);
  };

  // 쪽지 읽었을 때 상태를 변경하는 함수
  const handleReadMessage = async (message: MessageInfo) => {
    if (message.status !== 'r') {
      try {
        await updateMessageStatus(message.messageId, 'r');
        setIsMessageChecked(!isMessageChecked);
      } catch (error) {
        console.log('쪽지 상태 업데이트 실패 :', error);
      }
    }
  };

  return (
    <>
      {data.map((message) => (
        <li
          key={message.messageId}
          className='relative flex justify-between border-b px-2 py-6 last-of-type:border-none'>
          <div
            className='flex flex-1'
            onClick={() => handleReadMessage(message)}>
            <Profile
              width='3rem'
              height='3rem'
              name={message.senderInfo.name}
              profileColor={message.senderInfo.profileColor}
            />
            <div className='flex w-0 flex-1 flex-col px-4'>
              <p
                className={`font-normal ${expandedMessageId === message.messageId ? '' : 'truncate'}`}>
                {message.title}
              </p>
              <p
                className={`${expandedMessageId === message.messageId ? '' : 'truncate'}`}>
                {message.content}
              </p>
            </div>
          </div>
          <div className='flex shrink-0 flex-col items-end text-sm'>
            <p>{extractDate(message.createdAt)}</p>
            <p>{extractTime(message.createdAt)}</p>
          </div>
          <Down
            className={`ml-5 mt-3 h-4 w-4 cursor-pointer stroke-gray-400 transition duration-300 ${expandedMessageId === message.messageId ? 'rotate-180' : ''}`}
            onClick={() => {
              handleToggleExpand(message.messageId);
            }}
          />
          {message.status !== 'r' && <Badge size='sm' position='left' />}
        </li>
      ))}
    </>
  );
};

export default MessageList;
